import { Client, client, xml } from '@xmpp/client';
import { JID } from '@xmpp/jid';
import { Element } from '@xmpp/xml';
import {
	Bookmark,
	Message,
	MessageType,
	PageInfo,
	NotificationSetting,
	RoomMember,
	RoomMemberAffiliation,
	MAMFilters,
	SharedMedia,
	RoomRole
} from 'src/types/Xmpp.types';
import { getAttachmentType, getAttachmentTypeByMimeType } from 'src/helpers/file.helpers';
import { IGNORE_BODY, MAX_MESSAGES, PUB_SUB_NODES, XMPP_DOMAIN } from 'src/constants/xmpp.constants';
import {
	getNickname,
	getUrlFromMessage,
	getUsernameFromJid,
	isGifUrl,
	removeResourceFromJid
} from 'src/helpers/xmpp.helpers';
import { v4 as uuidv4 } from 'uuid';
import { uploadAttachment } from 'src/helpers/upload.helpers';

interface XmppError {
	condition: string;
	name: string;
	text: string;
}

interface Callbacks {
	/**
	 * Incoming one on one message
	 *
	 * @param msg - The message
	 */
	onOneOnOneMessage?: (msg: Message, type: MessageType) => void;
	/**
	 * Incoming one on one MAM history message. This will trigger when scrolling
	 * through the history of a one on one chat
	 *
	 * @param msg - The message
	 * @param type - The message type
	 */
	oneOnOneHistoryMessage?: (msg: Message) => void;
	/**
	 * Incoming one to many message
	 *
	 * @param msg - The message
	 * @param type - The message type
	 */
	onOneToManyMessage?: (msg: Message, type: MessageType) => void;
	/**
	 * Incoming one to many MAM history message. This will trigger when scrolling
	 * through the history of a one to many chat
	 *
	 * @param msg - The message
	 * @param type - The message type
	 */
	onOneToManyHistoryMessage?: (msg: Message) => void;
	/**
	 * Incoming error
	 *
	 * @param data.error - The error message
	 * @param data.name - The error name
	 * @param data.roomJid - The room JID
	 * @param data.type - The error type
	 */
	onError?: (data: { error: string; name: string; roomJid: string; type: string }) => void;
	/**
	 * Incoming new member. This will trigger for all members of the room except the invitee
	 *
	 * @param roomJid - The room JID
	 * @param memberJid - The member JID
	 */
	onNewMember?: (roomJid: string, memberJid: string) => void;
	/**
	 * Incoming invite to group chat. This will only trigger for the invitee (the user who is invited to join the room)

	 *
	 * @param data.name - The room name
	 * @param data.roomJid - The room JID
	 * @param data.userJid - Current user JID
	 */
	onInvitedToGroupChat?: (data: { name: string; roomJid: string; userJid: string }) => void;
	/**
	 * Incoming new batch of messages (history)
	 *
	 * @param roomJid - The room JID
	 * @param complete - Whether the whole history has been received
	 */
	onNewBatch?: (roomJid: string, complete: boolean) => void;
	/**
	 * Incoming member revoked
	 *
	 * @param roomJid - The room JID
	 * @param memberJid - The member JID
	 */
	onMemberRevoked?: (roomJid: string, memberJid: string) => void;
	/**
	 * Incoming room destroyed
	 *
	 * @param roomJid - The room JID
	 */
	onRoomDestroyed?: (roomJid: string) => void;
	/**
	 * Incoming room configuration change. Eg when the room name is changed
	 *
	 * @param roomJid - The room JID
	 * @param memberJid - The member JID
	 */
	onRoomConfigurationChange?: (roomJid: string) => void;
	/**
	 * Incoming member avatar change in a room
	 *
	 * @param data.roomJid - The JID of the user who changed the avatar
	 * @param data.memberJid - The JID of the member whose avatar was changed
	 * @param data.avatar - The avatar URL
	 */
	onMemberAvatarChange?: (data: { roomJid: string; memberJid: string; avatar: string }) => void;
}

export abstract class Xmpp {
	private static client: Client | undefined;
	private static jid: JID | undefined;
	private static userAvatar: string | undefined;
	private static isMessagesInitialized: Record<string, boolean> = {};

	public static getClient() {
		return this.client;
	}

	public static connect(username: string, password: string) {
		const xmpp = client({ service: `wss://${XMPP_DOMAIN}:5280/ws`, username: `${username}@${XMPP_DOMAIN}`, password });
		this.client = xmpp;
	}

	public static async disconnect() {
		if (this.client) {
			console.log('Disconnecting...');
			await this.client.stop();
		}
	}

	public static async stop() {
		if (this.client) {
			console.log('Stopping...');
			await this.client.stop();
		}
	}

	public static async discovery() {
		if (this.client && this.jid) {
			const discovery = await this.client.iqCaller.request(
				xml(
					'iq',
					{ type: 'get', to: `mix.${XMPP_DOMAIN}`, from: this.jid },
					xml('query', { xmlns: 'http://jabber.org/protocol/disco#info' })
				)
			);

			console.log('Discovery', discovery.toString());
		}
	}

	public static async subscribeToPresence(userJid: string) {
		const presenceStanza = xml('presence', { to: userJid, type: 'subscribe' });
		await this.client?.send(presenceStanza);
	}

	public static async getLastActivity(jid: string) {
		if (!jid) return null;
		const iq = xml('iq', { to: jid, type: 'get', id: 'last1' }, xml('query', { xmlns: 'jabber:iq:last' }));
		const response = await this.client?.iqCaller.request(iq);

		if (response?.is('iq') && response.attrs.type === 'result') {
			const seconds = response?.getChild('query')?.attrs.seconds;
			return seconds;
		} else {
			console.error('Error retrieving last activity:', response?.toString());
			return null;
		}
	}

	public static async sendMessage({
		attachments,
		message,
		to,
		type
	}: {
		type: 'chat' | 'groupchat';
		to: string;
		message: string;
		attachments: File[];
	}) {
		if (this.client) {
			const xmlMessage = xml(
				'message',
				{ type, from: this.jid, to, id: Math.random() },
				xml('body', {}, message.trim())
			);

			// Append attachments if any
			for (const attachment of attachments) {
				const ipfsHash = await uploadAttachment(attachment, attachment.name);

				const xmlAttachment = xml(
					getAttachmentType(attachment),
					{
						'mime-type': attachment.type,
						name: attachment.name,
						size: attachment.size
					},
					ipfsHash
				);

				xmlMessage.append(xmlAttachment);
			}

			// Append avatar so that we can render the sender's avatar in the UI
			if (this.userAvatar) {
				xmlMessage.append(xml('avatar', {}, this.userAvatar));
			}

			// Append sender so that we can render the sender's name in the UI
			if (this.jid) {
				xmlMessage.append(xml('sender', {}, removeResourceFromJid(this.jid.toString())));
			}

			try {
				await this.client.send(xmlMessage);
			} catch (error) {
				console.log('Error sending message', error);
			}
		}
	}

	public static async sendPing(to: string) {
		if (this.client) {
			await this.client.send(xml('iq', { to, type: 'get', id: 'ping1' }, xml('ping', { xmlns: 'urn:xmpp:ping' })));
		}
	}

	/**
	 * Create an instant room
	 *
	 * @param name - The name of the room
	 * @param description - The description of the room
	 * @returns The room `JID` or `undefined` if the room could not be created
	 */
	public static async createRoom(name: string, description = '') {
		if (this.client && this.jid) {
			const createRoomXml = xml(
				'iq',
				{
					from: this.jid,
					to: `${uuidv4()}@muc.${XMPP_DOMAIN}`,
					type: 'set'
				},
				xml(
					'query',
					{
						xmlns: 'http://jabber.org/protocol/muc#owner'
					},
					xml(
						'x',
						{
							xmlns: 'jabber:x:data',
							type: 'submit'
						},
						xml('field', { var: 'FORM_TYPE' }, xml('value', {}, 'http://jabber.org/protocol/muc#roomconfig')),
						xml('field', { var: 'muc#roomconfig_roomname', type: 'text-single' }, xml('value', {}, name)),
						xml('field', { var: 'muc#roomconfig_roomdesc', type: 'text-single' }, xml('value', {}, description)),
						xml('field', { var: 'muc#roomconfig_changesubject', type: 'boolean' }, xml('value', {}, '1')),
						xml('field', { var: 'muc#roomconfig_allowinvites', type: 'boolean' }, xml('value', {}, '1')),
						xml('field', { var: 'muc#roomconfig_publicroom', type: 'boolean' }, xml('value', {}, '0')),
						xml('field', { var: 'muc#roomconfig_persistentroom', type: 'boolean' }, xml('value', {}, '1')),
						xml('field', { var: 'muc#roomconfig_membersonly', type: 'boolean' }, xml('value', {}, '1')),
						xml('field', { var: 'muc#roomconfig_moderatedroom', type: 'boolean' }, xml('value', {}, '1')),
						xml('field', { var: 'muc#roomconfig_whois' }, xml('value', {}, 'anyone')),
						xml('field', { var: 'muc#roomconfig_passwordprotectedroom', type: 'boolean' }, xml('value', {}, '0'))
					)
				)
			);

			const createdRoom = await this.client.iqCaller.request(createRoomXml);

			const from = createdRoom.attrs.from;
			return from as string;
		}
	}

	/**
	 * Edit name and description of a room
	 *
	 * @param roomJid - The room JID
	 * @param name - The name of the room
	 * @param description - The description of the room
	 */
	public static async editRoomName(roomJid: string, name: string, description = '') {
		if (this.client && this.jid) {
			const editRoom = await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						to: roomJid,
						type: 'set'
					},
					xml(
						'query',
						{
							xmlns: 'http://jabber.org/protocol/muc#owner'
						},
						xml(
							'x',
							{
								xmlns: 'jabber:x:data',
								type: 'submit'
							},
							xml('field', { var: 'FORM_TYPE' }, xml('value', {}, 'http://jabber.org/protocol/muc#roomconfig')),
							xml('field', { var: 'muc#roomconfig_roomname', type: 'text-single' }, xml('value', {}, name)),
							xml('field', { var: 'muc#roomconfig_roomdesc', type: 'text-single' }, xml('value', {}, description))
						)
					)
				)
			);

			console.log('editRoom', editRoom.toString());
		}
	}

	/**
	 * Get the list of bookmarks
	 *
	 * @param userJid - The JID of the user
	 * @returns The list of bookmarks
	 */
	public static async getBookmarks(userJid: string): Promise<Bookmark[]> {
		if (this.client && this.jid) {
			try {
				const bookmarks = await this.client.iqCaller.request(
					xml(
						'iq',
						{
							from: userJid,
							type: 'get'
						},
						xml('pubsub', { xmlns: 'http://jabber.org/protocol/pubsub' }, xml('items', { node: 'storage:bookmarks' }))
					)
				);

				const pubsub = bookmarks.getChild('pubsub');
				if (pubsub) {
					const items = pubsub.getChild('items');

					if (items) {
						const item = items.getChild('item');

						if (item) {
							const storage = item.getChild('storage');

							if (storage) {
								const conferences = storage.getChildren('conference');

								const bookmarks = conferences.map(
									(conference): Bookmark => ({
										jid: conference.attrs.jid as string,
										nick: conference.getChild('nick')?.getText() ?? '',
										name: (conference.attrs.name as string) ?? '',
										autoJoin: conference.attrs.autojoin === 'true',
										date: conference.attrs.date ?? new Date().getTime().toString()
									})
								);

								// Sort on date DESC
								return bookmarks.sort((a, b) => parseInt(b.date) - parseInt(a.date));
							}
						}
					}
				}
			} catch (error) {
				return [];
			}
		}

		return [];
	}

	/**
	 * Remove a bookmark
	 *
	 * @param roomJid - The room JID to remove
	 * @param userJid - The JID of the user
	 */
	public static async removeBookmark(roomJid: string, userJid: string) {
		if (this.client) {
			const bookmarks = await this.getBookmarks(userJid);
			const filteredBookmarks = bookmarks.filter(bookmark => bookmark.jid !== roomJid);

			const storageNode = xml('storage', { xmlns: 'storage:bookmarks' });
			for (const bookmark of filteredBookmarks) {
				storageNode.append(
					xml(
						'conference',
						{
							autojoin: bookmark.autoJoin ? 'true' : 'false',
							name: bookmark.name,
							jid: bookmark.jid,
							date: bookmark.date
						},
						xml('nick', {}, bookmark.nick)
					)
				);
			}

			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: userJid,
						type: 'set'
					},
					xml(
						'pubsub',
						{ xmlns: 'http://jabber.org/protocol/pubsub' },
						xml('publish', { node: 'storage:bookmarks' }, xml('item', { id: 'current' }, storageNode)),
						xml(
							'publish-options',
							{},
							xml(
								'x',
								{
									xmlns: 'jabber:x:data',
									type: 'submit'
								},
								xml(
									'field',
									{ var: 'FORM_TYPE', type: 'hidden' },
									xml('value', {}, 'http://jabber.org/protocol/pubsub#publish-options')
								),
								xml('field', { var: 'pubsub#persist_items' }, xml('value', {}, 'true')),
								xml(
									'field',
									{
										var: 'pubsub#access_model'
									},
									xml('value', {}, 'whitelist')
								)
							)
						)
					)
				)
			);
		}
	}

	/**
	 * Add a bookmark
	 *
	 * @param roomJid - The room JID to add
	 * @param userJid - The JID of the user
	 */
	public static async addBookmark({ name, roomJid, userJid }: { roomJid: string; name: string; userJid: string }) {
		if (this.client && this.jid) {
			const storageNode = xml('storage', { xmlns: 'storage:bookmarks' });

			// Fetch bookmarks and append existing ones
			const bookmarks = await this.getBookmarks(userJid);

			// We must add all existing bookmarks, otherwise they will be removed
			for (const bookmark of bookmarks) {
				storageNode.append(
					xml(
						'conference',
						{
							autojoin: bookmark.autoJoin ? 'true' : 'false',
							name: bookmark.name,
							jid: bookmark.jid,
							date: bookmark.date
						},
						xml('nick', {}, bookmark.nick)
					)
				);
			}

			// Add new bookmark
			storageNode.append(
				xml(
					'conference',
					{
						autojoin: 'true',
						name,
						jid: roomJid,
						date: new Date().getTime().toString()
					},
					xml('nick', {}, getNickname(this.jid))
				)
			);

			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: userJid,
						type: 'set'
					},
					xml(
						'pubsub',
						{ xmlns: 'http://jabber.org/protocol/pubsub' },
						xml('publish', { node: 'storage:bookmarks' }, xml('item', { id: 'current' }, storageNode)),
						xml(
							'publish-options',
							{},
							xml(
								'x',
								{
									xmlns: 'jabber:x:data',
									type: 'submit'
								},
								xml(
									'field',
									{ var: 'FORM_TYPE', type: 'hidden' },
									xml('value', {}, 'http://jabber.org/protocol/pubsub#publish-options')
								),
								xml('field', { var: 'pubsub#persist_items' }, xml('value', {}, 'true')),
								xml(
									'field',
									{
										var: 'pubsub#access_model'
									},
									xml('value', {}, 'whitelist')
								)
							)
						)
					)
				)
			);
		}
	}

	/**
	 * Get the list of room occupants (joined by presence)
	 *
	 * @param roomJid - The room JID
	 * @returns The list of room occupants
	 */
	public static async getRoomOccupants(roomJid: string) {
		if (this.client && this.jid) {
			const roomItems = await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						to: roomJid,
						type: 'get'
					},
					xml('query', { xmlns: 'http://jabber.org/protocol/disco#items' })
				)
			);

			const query = roomItems.getChild('query');
			if (query) {
				const items = query.getChildren('item');

				return items.map(item => {
					return {
						roomJid: item.attrs.jid as string,
						name: item.attrs.name as string
					};
				});
			}
		}

		return [];
	}

	/**
	 * Get VCARD user/room. In case there is no `to` parameter, the VCARD of the current user will be fetched.
	 *
	 * @param to - The JID of the room/user
	 * @returns The avatar URL + type
	 */
	public static async getVCard(to?: string, options?: { setUserAvatar?: boolean }) {
		if (this.client) {
			try {
				const avatar = await this.client.iqCaller.request(
					xml(
						'iq',
						{
							to,
							type: 'get'
						},
						xml('vCard', {
							xmlns: 'vcard-temp'
						})
					)
				);

				const vCard = avatar.getChild('vCard');
				if (vCard) {
					const photoChild = vCard.getChild('PHOTO');
					const roleChild = vCard.getChild('ROLE');

					let avatar = '';
					let role = '';

					if (photoChild) {
						const urlChild = photoChild.getChild('EXTVAL');
						const typeChild = photoChild.getChild('TYPE');

						if (urlChild && typeChild) {
							if (options?.setUserAvatar) {
								this.userAvatar = urlChild.getText();
							}

							avatar = urlChild.getText();
						}
					}

					if (roleChild) {
						role = roleChild.getText();
					}

					return {
						avatar,
						role
					};
				}

				return null;
			} catch (error) {
				return null;
			}
		}

		return null;
	}

	public static async setRoomVCard({
		avatar,
		roomRole,
		roomJid
	}: {
		roomJid: string;
		avatar?: File | string;
		roomRole?: RoomRole;
	}) {
		if (this.client) {
			let avatarUrl: string | undefined;
			if (avatar && avatar instanceof File) {
				const url = await uploadAttachment(avatar, avatar.name);
				avatarUrl = url;
			} else {
				avatarUrl = avatar;
			}

			const vCard = await this.generateVCardElement({ avatar: avatarUrl, role: roomRole });

			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						to: roomJid,
						type: 'set'
					},
					vCard
				)
			);
		}
	}

	/**
	 * Set the VCard of the current user. This will also set the avatar URL in the `Xmpp` class
	 *
	 * @param avatar - IPFS Hash
	 * @returns IPFS Hash
	 */
	public static async setUserVCard(avatar: string) {
		if (this.client) {
			const vCard = await this.generateVCardElement({ avatar });
			this.userAvatar = avatar;

			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						type: 'set'
					},
					vCard
				)
			);

			return avatar;
		}
	}

	public static async updatePresence(
		to: string,
		update?: {
			avatar?: string;
			show?: string;
			status?: string;
		}
	) {
		if (this.client && this.jid) {
			const presenceXml = xml('presence', {
				from: this.jid,
				to
			});

			if (update?.avatar) {
				presenceXml.append(xml('avatar', {}, update.avatar));
			}

			if (update?.show) {
				presenceXml.append(xml('show', {}, update.show));
			}

			if (update?.status) {
				presenceXml.append(xml('status', {}, update.status));
			}

			await this.client.send(presenceXml);
		}
	}

	private static async generateVCardElement({
		avatar,
		imageType,
		role
	}: {
		avatar?: string;
		imageType?: string;
		role?: 'DM' | 'ROOM';
	}) {
		const vCardElement = xml('vCard', {
			xmlns: 'vcard-temp'
		});

		if (avatar) {
			vCardElement.append(
				xml('PHOTO', {}, xml('TYPE', {}, imageType ?? ''), xml('BINVAL', {}, ''), xml('EXTVAL', {}, avatar))
			);
		}

		if (role) {
			vCardElement.append(xml('ROLE', {}, role));
		}

		return vCardElement;
	}

	public static async getRoomInfo(roomJid: string) {
		if (this.client && this.jid && roomJid) {
			const roomInfo = await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						to: roomJid,
						type: 'get'
					},
					xml('query', { xmlns: 'http://jabber.org/protocol/disco#info' })
				)
			);

			const x = roomInfo.getChild('query')?.getChild('x');
			if (x) {
				const nameField = x.getChildByAttr('var', 'muc#roomconfig_roomname');
				const descriptionField = x.getChildByAttr('var', 'muc#roominfo_description');

				if (nameField && descriptionField) {
					const nameValue = nameField.getChild('value')?.getText();
					const descriptionValue = descriptionField.getChild('value')?.getText();

					if (nameValue) {
						return {
							name: nameValue,
							description: descriptionValue
						};
					}
				}
			}
		}
	}

	/**
	 * Get the members of a room
	 *
	 * @param roomJid Room JID
	 */
	public static async getRoomMembers(roomJid: string) {
		const owners = await this.roomMembersRequest(roomJid, 'owner');
		const admins = await this.roomMembersRequest(roomJid, 'admin');
		const members = await this.roomMembersRequest(roomJid, 'member');

		return [...owners, ...admins, ...members];
	}

	/**
	 * In order to join a room, we need to send a presence stanza to the room
	 *
	 * @param roomJid Room JID
	 */
	public static async joinRoom(roomJid: string) {
		if (this.client && this.jid) {
			await this.client.send(
				xml(
					'presence',
					{ from: this.jid, to: `${roomJid}/${getNickname(this.jid)}` },
					xml('x', { xmlns: 'http://jabber.org/protocol/muc' }, xml('history', { maxchars: '0' }))
				)
			);
		}
	}

	// Join multiple rooms
	public static async joinRooms(roomJids: string[], userJid: string) {
		if (this.client && this.jid) {
			const addressesElement = xml('addresses', {
				xmlns: 'http://jabber.org/protocol/address'
			});

			for (const roomJid of roomJids) {
				addressesElement.append(
					xml('address', {
						type: 'bcc',
						jid: roomJid
					})
				);
			}

			await this.client.send(
				xml(
					'presence',
					{
						from: userJid,
						to: `multicast.${XMPP_DOMAIN}`
					},
					addressesElement
				)
			);
		}
	}

	/**
	 * Invite a user to a room
	 *
	 * @param roomJid Room JID
	 * @param userJid User JID
	 */
	public static async inviteUser(roomJid: string, userJid: string) {
		if (this.client && this.jid) {
			console.log('inviteUser', roomJid, userJid);

			// Invite user to room
			await this.client.send(
				xml(
					'message',
					{
						from: this.jid,
						to: roomJid
					},
					xml(
						'x',
						{
							xmlns: 'http://jabber.org/protocol/muc#user'
						},
						xml(
							'invite',
							{
								to: userJid
							},
							xml('reason', {}, 'Join us for a groupchat')
						)
					)
				)
			);
		}
	}

	/**
	 * Revokes a user's membership to a room (as an admin)
	 *
	 * @param roomJid Room JID
	 * @param memberJid Member JID
	 */
	public static async revokeMembership(roomJid: string, memberJid: string) {
		if (this.client && this.jid) {
			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						to: roomJid,
						type: 'set'
					},
					xml(
						'query',
						{
							xmlns: 'http://jabber.org/protocol/muc#admin'
						},
						xml('item', {
							affiliation: 'none',
							jid: memberJid
						})
					)
				)
			);
		}
	}

	public static async signOut() {
		if (this.client && this.jid) {
			const bookmarks = await this.getBookmarks(this.jid.toString());

			for (const bookmark of bookmarks) {
				await this.exitRoom(
					`${bookmark.jid}/${getNickname(this.jid)}`,
					`${getUsernameFromJid(this.jid)}@${XMPP_DOMAIN}`
				);
			}

			await Xmpp.stop();

			this.client = undefined;
			this.jid = undefined;
		}
	}

	/**
	 * Error listener
	 */
	public static onError(callback: (err: XmppError) => void): void {
		if (this.client) {
			this.client.on('error', async (err: XmppError) => {
				console.log('error', { err });

				callback(err);
			});
		}
	}

	/**
	 * Online listener
	 */
	public static onOnline(callback: (jid: JID) => void): void {
		if (this.client) {
			this.client.on('online', async jid => {
				this.client && (await this.client.send(xml('presence')));
				this.jid = jid;

				callback(jid);
			});
		}
	}

	/**
	 * Start XMPP client
	 */
	public static async start() {
		if (this.client) {
			await this.client.start().catch(console.log);
		}
	}

	/**
	 * Status listener
	 */
	public static onStatus(): void {
		if (this.client) {
			this.client.on('status', (status, value) => {
				console.log('status changed to', status, value);
			});
		}
	}

	/**
	 * Close listener
	 */
	public static onClose(): void {
		if (this.client) {
			this.client.on('close', () => {
				console.log('connection closed');
			});
		}
	}

	/**
	 * Message listener
	 */
	public static onMessage({
		onOneOnOneMessage,
		oneOnOneHistoryMessage,
		onOneToManyMessage,
		onOneToManyHistoryMessage,
		onError,
		onNewMember,
		onInvitedToGroupChat,
		onNewBatch,
		onMemberRevoked,
		onRoomDestroyed,
		onRoomConfigurationChange,
		onMemberAvatarChange
	}: Callbacks): void {
		if (this.client) {
			this.client.on('stanza', async stanza => {
				console.log('stanza', stanza.toString());

				if (stanza.attrs.type === 'error') {
					const error = stanza.getChild('error');

					if (error) {
						const firstChild = error.getChildElements()[0];
						const text = error.getChildText('text');

						if (text) {
							onError?.({
								error: text,
								name: firstChild.name,
								roomJid: stanza.attrs.from as string,
								type: error.attrs.type as string
							});
						}
					}

					return;
				}

				if (stanza.is('iq')) {
					const fin = stanza.getChild('fin');

					if (fin) {
						const complete = fin.attrs.complete === 'true';

						return onNewBatch?.(stanza.attrs.from as string, complete);
					}

					return;
				}

				if (stanza.is('presence')) {
					if (stanza.attrs.type === 'subscribe') {
						const approveSubscription = xml('presence', { to: stanza.attrs.from, type: 'subscribed' });
						this.client?.send(approveSubscription);
					}

					// OneOnOne avatar change
					const avatar = stanza.getChild('avatar');
					const x = stanza.getChild('x', 'http://jabber.org/protocol/muc#user');

					if (!avatar) {
						// const url = avatar.getText();
						// const from = stanza.attrs.from as string;
						// const memberJid = stanza.attrs.to as string;

						// onMemberAvatarChange?.({ fromJid: from, memberJid, avatar: url });
						return;
					}

					if (x) {
						const item = x.getChild('item');

						const avatar = stanza.getChild('avatar');
						// OneToMany avatar change
						if (item && avatar) {
							const memberJid = item.attrs.jid as string;
							const roomJid = stanza.attrs.from as string;
							const url = avatar.getText();

							onMemberAvatarChange?.({ roomJid, memberJid, avatar: url });
							return;
						}

						// Destroyed room
						const destroy = x.getChild('destroy');
						if (item && destroy) {
							const jid = destroy.attrs.jid as string;

							onRoomDestroyed?.(jid);
							return;
						}

						// Revoked membership for online member
						// https://github.com/processone/ejabberd/issues/1577#issuecomment-283791338
						const statuses = x.getChildren('status');
						if (item && statuses.length) {
							const affiliation = item.attrs.affiliation;
							const code = statuses[statuses.length - 1].attrs.code;

							if (affiliation === 'none' && code === '321') {
								const roomJid = stanza.attrs.from as string;
								const userJid = item.attrs.jid as string;

								// Remove nickname from roomJid
								onMemberRevoked?.(removeResourceFromJid(roomJid), removeResourceFromJid(userJid));
							}
						}
					}

					return;
				}

				if (!stanza.is('message')) {
					return;
				}

				// Invited to join a room
				// This will only trigger for the invitee (the user who is invited to join the room)
				const xJabberConference = stanza.getChild('x', 'jabber:x:conference');
				if (xJabberConference) {
					const xJabberProtocolMUCUser = stanza.getChild('x', 'http://jabber.org/protocol/muc#user');

					if (xJabberProtocolMUCUser) {
						const invite = xJabberProtocolMUCUser.getChild('invite');

						if (invite) {
							const roomJid = xJabberConference.attrs.jid as string;
							const roomInfo = await this.getRoomInfo(roomJid);

							onInvitedToGroupChat?.({ roomJid, userJid: stanza.attrs.to as string, name: roomInfo?.name ?? '' });
						}
					}

					return;
				}

				const xJabberProtocolMUCUser = stanza.getChild('x', 'http://jabber.org/protocol/muc#user');
				if (xJabberProtocolMUCUser) {
					const status = xJabberProtocolMUCUser.getChild('status');
					if (status) {
						const code = status.attrs.code;

						// Room configuration changed
						if (code === '104') {
							const roomJid = stanza.attrs.from as string;
							onRoomConfigurationChange?.(roomJid);
						}

						return;
					}

					const item = xJabberProtocolMUCUser.getChild('item');

					if (item) {
						const role = item.attrs.role;
						const affiliation = item.attrs.affiliation;

						const roomJid = stanza.attrs.from as string;
						const memberJid = item.attrs.jid as string;

						// New member joined by invite
						// This will trigger for all members of the room except the invitee
						if (role === 'none' && affiliation === 'member') {
							return onNewMember?.(roomJid, memberJid);
						}

						// Revoked membership for offline/non-present member
						// https://github.com/processone/ejabberd/issues/1577#issuecomment-283791338
						if (role === 'none' && affiliation === 'none') {
							return onMemberRevoked?.(roomJid, memberJid);
						}
					}

					return;
				}

				// MAM (Message Archive Management) message OneOnOne or OneToMany
				const result = stanza.getChild('result');
				if (result) {
					const forwarded = result.getChild('forwarded', 'urn:xmpp:forward:0');
					if (!forwarded) {
						return;
					}

					const message = forwarded.getChild('message');
					if (!message) {
						return;
					}

					if (message.attrs.type !== 'chat' && message.attrs.type !== 'groupchat') {
						return;
					}

					const body = message.getChildText('body');
					if (body) {
						const delay = forwarded.getChild('delay', 'urn:xmpp:delay');
						const date = delay?.attrs.stamp ? new Date(delay.attrs.stamp) : new Date();

						const images = message.getChildren('image');
						const audios = message.getChildren('audio');
						const videos = message.getChildren('videos');
						const file = message.getChildren('file');
						const sender = message.getChild('sender')?.getText();
						const stanzaId = message.getChild('stanza-id');
						const to = stanza.attrs.to as string;
						const from = removeResourceFromJid(message.attrs.from as string);
						const text = body.replace('You sent: ', '');
						const vCard = await this.getVCard(sender);
						const data: Message = {
							to: removeResourceFromJid(to),
							// In case of OneToMany message, from is the room
							from,
							// Sender is the user who sent the message
							sender: sender ?? '',
							message: text !== IGNORE_BODY ? text : '',
							id: stanzaId?.attrs.id ?? date.getTime().toString(),
							date,
							avatar: vCard?.avatar,
							attachments: [...images, ...audios, ...videos, ...file].map(attachment => ({
								type: getAttachmentTypeByMimeType(attachment.attrs['mime-type']),
								mimeType: attachment.attrs['mime-type'],
								name: attachment.attrs.name,
								size: Number(attachment.attrs.size),
								url: attachment.getText()
							}))
						};

						if (message.attrs.type === 'chat') {
							// In case the one on one messages are already initialized, we add the incoming MAM
							// message to the history messages, in other words we prepend it to the array of messages
							// This will be the case when the user scroll up to load more messages
							if (typeof this.isMessagesInitialized[to] !== 'undefined' && this.isMessagesInitialized[to]) {
								return oneOnOneHistoryMessage?.(data);
							}

							return onOneOnOneMessage?.(data, 'mam');
						}

						// In case the room messages are already initialized, we add the incoming MAM
						// message to the history messages, in other words we prepend it to the array of messages
						// This will be the case when the user scroll up to load more messages
						if (typeof this.isMessagesInitialized[from] !== 'undefined' && this.isMessagesInitialized[from]) {
							return onOneToManyHistoryMessage?.(data);
						}

						return onOneToManyMessage?.(data, 'mam');
					}

					return;
				}

				// Normal message OneToMany
				if (stanza.attrs.type === 'groupchat') {
					const body = stanza.getChild('body');

					if (body) {
						// Get date of message
						const date = new Date();

						const images = stanza.getChildren('image');
						const audios = stanza.getChildren('audio');
						const videos = stanza.getChildren('video');
						const files = stanza.getChildren('file');
						const sender = stanza.getChild('sender');
						const avatar = stanza.getChild('avatar');
						const by = stanza.getChild('archived')?.attrs.by;
						const text = body.getText();
						const stanzaId = stanza.getChild('stanza-id');

						onOneToManyMessage?.(
							{
								to: removeResourceFromJid(stanza.attrs.to as string),
								// From is the room
								from: by as string,
								// Sender is the user who sent the message
								sender: sender?.getText() ?? '',
								message: text !== IGNORE_BODY ? text : '',
								id: stanzaId?.attrs.id ?? date.getTime().toString(),
								date,
								avatar: avatar?.getText(),
								attachments: [...images, ...audios, ...videos, ...files].map(attachment => ({
									type: getAttachmentTypeByMimeType(attachment.attrs['mime-type']),
									mimeType: attachment.attrs['mime-type'],
									name: attachment.attrs.name,
									size: Number(attachment.attrs.size),
									url: attachment.getText()
								}))
							},
							'message'
						);
					}

					return;
				}

				// Normal message OneOnOne
				if (stanza.attrs.type === 'chat') {
					const body = stanza.getChild('body');

					if (body) {
						const images = stanza.getChildren('image');
						const audios = stanza.getChildren('audio');
						const videos = stanza.getChildren('video');
						const files = stanza.getChildren('file');
						const avatar = stanza.getChild('avatar');
						const sender = stanza.getChild('sender');

						// Get date of message
						const date = new Date();

						onOneOnOneMessage?.(
							{
								to: stanza.attrs.to as string,
								from: removeResourceFromJid(stanza.attrs.from as string),
								// Sender is the user who sent the message
								sender: sender?.getText() ?? '',
								message: body.getText(),
								id: date.getTime().toString(),
								date,
								avatar: avatar?.getText(),
								attachments: [...images, ...audios, ...videos, ...files].map(attachment => ({
									type: 'image',
									mimeType: attachment.attrs['mime-type'],
									name: attachment.attrs.name,
									size: Number(attachment.attrs.size),
									url: attachment.getText()
								}))
							},
							'message'
						);
					}
				}
			});
		}
	}

	/**
	 * Remove message listener
	 */
	public static removeMessageListener(): void {
		if (this.client) {
			this.client.removeAllListeners('stanza');
		}
	}

	/**
	 * Load history messages (On to Many chat). This will trigger stanzas that need to be processed by the message listener
	 */
	public static async loadRoomHistoryMessages(roomJid: string, options?: MAMFilters): Promise<PageInfo | undefined> {
		if (this.client) {
			const iq = await this.client.iqCaller.request(
				xml(
					'iq',
					{ type: 'set', to: roomJid },
					xml('query', { xmlns: 'urn:xmpp:mam:2', queryid: Math.random() }, this.generateMAMFilters(options))
				)
			);

			// Mark room messages as loaded
			this.isMessagesInitialized[roomJid] = true;

			return this.getPageInfo(iq);
		}
	}

	public static async loadLatestRoomHistoryMessages(roomJid: string) {
		if (this.client) {
			const iq = await this.client.iqCaller.request(
				xml(
					'iq',
					{ type: 'set', to: roomJid },
					xml(
						'query',
						{ xmlns: 'urn:xmpp:mam:2', queryid: Math.random() },
						xml('set', { xmlns: 'http://jabber.org/protocol/rsm' }, xml('max', {}, '1'), xml('before'))
					)
				)
			);

			return this.getPageInfo(iq);
		}
	}

	/**
	 * Exit a room
	 *
	 * @param roomJid Room JID
	 * @param memberJid Member JID
	 */
	public static async exitRoom(roomJid: string, memberJid: string) {
		if (this.client) {
			await this.client.send(
				xml('presence', {
					from: memberJid,
					to: roomJid,
					type: 'unavailable'
				})
			);
		}
	}

	/**
	 * Toggle notifications on/off for a room
	 *
	 * @param roomJid Room JID
	 * @param isEnabled True if notifications should be enabled, false otherwise
	 */
	public static async toggleNotifications(roomJid: string, isEnabled: boolean) {
		if (this.client && this.jid) {
			const notificationsElement = xml('notifications');
			const notificationSettings = await this.getNotificationSettings();

			// If there are notification settings, but the room is not in the list, append notification element to private data
			// This occurs when the user has set notification settings for other rooms, but not for this one
			if (!notificationSettings.find(notificationSetting => notificationSetting.roomJid === roomJid)) {
				notificationsElement.append(
					xml('notification', {
						jid: roomJid,
						enabled: isEnabled ? 'true' : 'false'
					})
				);
			}

			// If there are notification settings, and the room is in the list, update the notification setting
			// We must add all existing settings to the private data, otherwise they will be removed
			for (const notificationSetting of notificationSettings) {
				// Update notification setting
				if (notificationSetting.roomJid === roomJid) {
					notificationSetting.enabled = isEnabled;
				}

				// Append notification element to private data
				notificationsElement.append(
					xml('notification', {
						jid: notificationSetting.roomJid,
						enabled: notificationSetting.enabled ? 'true' : 'false'
					})
				);
			}

			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						type: 'set'
					},
					xml(
						'query',
						{ xmlns: 'jabber:iq:private' },
						xml(
							'exodus',
							{
								xmlns: 'exodus:prefs'
							},
							notificationsElement
						)
					)
				)
			);
		}
	}

	/**
	 * Get notification settings for all rooms. This contains if notifications are enabled or disabled for a room
	 */
	public static async getNotificationSettings(): Promise<NotificationSetting[]> {
		if (this.client && this.jid) {
			const privateData = await this.getPrivateData();

			if (privateData) {
				const query = privateData.getChild('query', 'jabber:iq:private');

				if (query) {
					const exodus = query.getChild('exodus', 'exodus:prefs');

					if (exodus) {
						const notifications = exodus.getChild('notifications');

						if (notifications) {
							const notificationChildren = notifications.getChildren('notification');
							return notificationChildren.map(
								(notification): NotificationSetting => ({
									roomJid: notification.attrs.jid,
									enabled: notification.attrs.enabled === 'true'
								})
							);
						}
					}
				}
			}
		}

		return [];
	}

	public static async deleteChat(roomJid: string) {
		if (this.client && this.jid) {
			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						type: 'set',
						to: roomJid
					},
					xml(
						'query',
						{ xmlns: 'http://jabber.org/protocol/muc#owner' },
						xml('destroy', {
							jid: roomJid
						})
					)
				)
			);
		}
	}

	public static async block(memberJid: string) {
		if (this.client && this.jid) {
			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						type: 'set'
					},
					xml(
						'block',
						{ xmlns: 'urn:xmpp:blocking' },
						xml('item', {
							jid: memberJid
						})
					)
				)
			);
		}
	}

	public static async unBlock(memberJid: string) {
		if (this.client) {
			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						type: 'set'
					},
					xml(
						'unblock',
						{ xmlns: 'urn:xmpp:blocking' },
						xml('item', {
							jid: memberJid
						})
					)
				)
			);
		}
	}

	public static async getBlockedList() {
		if (this.client) {
			const iq = await this.client.iqCaller.request(
				xml(
					'iq',
					{
						type: 'get'
					},
					xml('blocklist', { xmlns: 'urn:xmpp:blocking' })
				)
			);

			const blocklist = iq.getChild('blocklist', 'urn:xmpp:blocking');
			if (blocklist) {
				const items = blocklist.getChildren('item');

				return items.map(item => item.attrs.jid as string);
			}
		}

		return [];
	}

	public static async subscribePubSubNode(roomJid: string, node: string) {
		if (this.client && this.jid) {
			await this.client.iqCaller.request(
				xml(
					'iq',
					{ type: 'set', from: this.jid, to: `pubsub.${XMPP_DOMAIN}` },
					xml(
						'pubsub',
						{ xmlns: 'http://jabber.org/protocol/pubsub' },
						xml('subscribe', { node: `${node}:${roomJid}`, jid: this.jid })
					)
				)
			);
		}
	}

	public static async unSubscribePubSubNode(roomJid: string, node: string) {
		if (this.client && this.jid) {
			await this.client.iqCaller.request(
				xml(
					'iq',
					{ type: 'set', from: this.jid, to: `pubsub.${XMPP_DOMAIN}` },
					xml(
						'pubsub',
						{ xmlns: 'http://jabber.org/protocol/pubsub' },
						xml('unsubscribe', { node: `${node}:${roomJid}`, jid: this.jid })
					)
				)
			);
		}
	}

	/**
	 * Publish initial shared media PubSub node
	 */
	public static async publishPubSubNode(roomJid: string, node: string) {
		if (this.client && this.jid) {
			await this.client.iqCaller.request(
				xml(
					'iq',
					{
						type: 'set',
						from: this.jid,
						to: `pubsub.${XMPP_DOMAIN}`
					},
					xml(
						'pubsub',
						{
							xmlns: 'http://jabber.org/protocol/pubsub'
						},
						xml('create', {
							node: `${node}:${roomJid}`
						}),
						xml(
							'configure',
							{},
							xml(
								'x',
								{ xmlns: 'jabber:x:data', type: 'submit' },
								xml(
									'field',
									{ var: 'FORM_TYPE', type: 'hidden' },
									xml('value', {}, 'http://jabber.org/protocol/pubsub#node_config')
								),
								xml('field', { var: 'pubsub#access_model' }, xml('value', {}, 'open')),
								xml('field', { var: 'pubsub#publish_model' }, xml('value', {}, 'subscribers')),
								xml('field', { var: 'pubsub#persist_items' }, xml('value', {}, '1'))
							)
						)
					)
				)
			);
		}
	}

	/**
	 * Add shared media to PubSub node for Shared Media
	 */
	public static async addSharedMedia(roomJid: string, message: Message) {
		if (this.client) {
			let hasSharedMedia = false;

			const publishElement = xml('publish', {
				node: `${PUB_SUB_NODES.SHARED_MEDIA}:${roomJid}`
			});

			const url = getUrlFromMessage(message);
			if (url) {
				hasSharedMedia = true;

				const isGif = await isGifUrl(message);
				if (isGif) {
					publishElement.append(
						xml(
							'item',
							{},
							xml(
								'entry',
								{ xmlns: 'http://www.w3.org/2005/Atom' },
								xml(
									'shared-media',
									{
										type: 'image',
										id: message.id,
										name: 'GIF',
										sender: message.sender,
										avatar: message.avatar,
										date: message.date.toISOString(),
										size: 0,
										isGiphy: true
									},
									message.message
								)
							)
						)
					);
				} else {
					publishElement.append(
						xml(
							'item',
							{},
							xml(
								'entry',
								{ xmlns: 'http://www.w3.org/2005/Atom' },
								xml(
									'shared-media',
									{
										type: 'link',
										id: message.id,
										name: 'link',
										sender: message.sender,
										avatar: message.avatar,
										date: message.date.toISOString(),
										size: 0
									},
									message.message
								)
							)
						)
					);
				}
			}

			if (message.attachments.length) {
				hasSharedMedia = true;

				const attachmentElements: Element[] = [];
				for (const attachment of message.attachments) {
					attachmentElements.push(
						xml(
							'shared-media',
							{
								type: getAttachmentTypeByMimeType(attachment.mimeType),
								id: message.id,
								name: attachment.name,
								sender: message.sender,
								avatar: message.avatar,
								date: message.date.toISOString(),
								size: attachment.size
							},
							attachment.url
						)
					);
				}

				publishElement.append(
					xml('item', {}, xml('entry', { xmlns: 'http://www.w3.org/2005/Atom' }, ...attachmentElements))
				);
			}

			if (hasSharedMedia) {
				await this.client.iqCaller.request(
					xml(
						'iq',
						{ type: 'set', from: this.jid, to: `pubsub.${XMPP_DOMAIN}` },
						xml('pubsub', { xmlns: 'http://jabber.org/protocol/pubsub' }, publishElement)
					)
				);
			}

			return hasSharedMedia;
		}

		return false;
	}

	public static async getSharedMedia(roomJid: string): Promise<SharedMedia[]> {
		if (this.client && this.jid) {
			const iq = await this.client.iqCaller.request(
				xml(
					'iq',
					{ type: 'get', from: this.jid, to: `pubsub.${XMPP_DOMAIN}` },
					xml(
						'pubsub',
						{ xmlns: 'http://jabber.org/protocol/pubsub' },
						xml('items', { node: `${PUB_SUB_NODES.SHARED_MEDIA}:${roomJid}` })
					)
				)
			);

			const pubsub = iq.getChild('pubsub', 'http://jabber.org/protocol/pubsub');
			if (pubsub) {
				const items = pubsub.getChild('items');
				if (items) {
					const itemChildren = items.getChildren('item');
					return itemChildren
						.map(item => {
							const entry = item.getChild('entry');
							const sharedMedia = entry?.getChildren('shared-media');

							if (!sharedMedia) {
								return [];
							}

							return sharedMedia.map(
								(media): SharedMedia => ({
									itemId: item.attrs.id as string,
									type: media.attrs.type as string,
									id: media.attrs.id as string,
									src: media.getText(),
									avatar: media.attrs.avatar as string,
									sender: media.attrs.sender as string,
									date: new Date(media.attrs.date as string),
									name: media.attrs.name as string,
									size: Number(media.attrs.size),
									isGiphy: media.attrs.isGiphy === 'true'
								})
							);
						})
						.flat()
						.reverse();
				}
			}
		}

		return [];
	}

	private static getPrivateData() {
		if (this.client && this.jid) {
			return this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						type: 'get'
					},
					xml(
						'query',
						{ xmlns: 'jabber:iq:private' },
						xml('exodus', {
							xmlns: 'exodus:prefs'
						})
					)
				)
			);
		}
	}

	/**
	 * Request room members
	 *
	 * @param room Room JID
	 * @param affiliation Affiliation type
	 */
	private static async roomMembersRequest(
		room: string,
		affiliation: 'owner' | 'admin' | 'member'
	): Promise<RoomMember[]> {
		if (this.client && this.jid) {
			const users = await this.client.iqCaller.request(
				xml(
					'iq',
					{
						from: this.jid,
						to: room,
						type: 'get'
					},
					xml('query', { xmlns: 'http://jabber.org/protocol/muc#admin' }, xml('item', { affiliation }))
				)
			);

			const query = users.getChild('query');
			if (query) {
				const items = query.getChildren('item');

				const members: RoomMember[] = [];
				for (const item of items) {
					const jid = item.attrs.jid as string;
					const name = getUsernameFromJid(jid);
					const affiliation = item.attrs.affiliation as RoomMemberAffiliation;

					const vCard = await this.getVCard(jid);

					members.push({
						jid,
						name,
						affiliation,
						avatar: vCard?.avatar ?? ''
					});
				}

				return members;
			}
		}

		return [];
	}

	private static generateMAMFilters(filters?: MAMFilters) {
		const set = xml('set', {
			xmlns: 'http://jabber.org/protocol/rsm'
		});

		if (filters?.max) {
			set.append(xml('max', {}, filters.max.toString()));
		} else {
			set.append(xml('max', {}, MAX_MESSAGES.toString()));
		}

		if (filters?.before) {
			set.append(xml('before', {}, filters.before));
		} else {
			set.append(xml('before'));
		}

		if (filters?.after) {
			set.append(xml('after', {}, filters.after));
		}

		return set;
	}

	private static getPageInfo(result: Element) {
		const fin = result.getChild('fin');
		if (fin) {
			const set = fin.getChild('set');

			if (set) {
				const count = set.getChild('count');
				const first = set.getChild('first');
				const last = set.getChild('last');

				if (count && first && last) {
					return {
						count: Number(count.getText()),
						first: first.getText(),
						last: last.getText()
					};
				}
			}
		}
	}
}
