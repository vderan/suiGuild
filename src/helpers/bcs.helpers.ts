import { BCS, getSuiMoveConfig } from '@mysten/bcs';

export function getBCS() {
	const bcs = new BCS(getSuiMoveConfig());

	bcs.registerType(
		'utf8string',
		(writer, str) => {
			const bytes = Array.from(new TextEncoder().encode(str));
			return writer.writeVec(bytes, (writer, el) => writer.write8(el));
		},
		reader => {
			const bytes = reader.readVec(reader => reader.read8());
			return new TextDecoder().decode(new Uint8Array(bytes));
		}
	);

	bcs.registerStructType('Url', {
		url: BCS.STRING
	});

	bcs.registerEnumType('Option<T>', {
		none: null,
		some: 'T'
	});

	bcs.registerStructType('Achievement', {
		title: 'utf8string',
		description: 'utf8string',
		year: 'utf8string',
		month: 'utf8string',
		team: 'utf8string',
		place: BCS.U64,
		link: 'utf8string',
		coverImage: 'Url'
	});

	bcs.registerStructType('Team', {
		name: 'utf8string',
		startYear: 'utf8string',
		startMonth: 'utf8string',
		endYear: 'utf8string',
		endMonth: 'utf8string',
		coverImage: 'Url'
	});

	bcs.registerStructType('Video', {
		name: 'utf8string',
		link: 'utf8string'
	});

	bcs.registerStructType('Award', {
		title: 'utf8string',
		year: 'utf8string',
		month: 'utf8string',
		link: 'utf8string',
		coverImage: 'Url'
	});

	bcs.registerStructType('Game', {
		name: 'utf8string',
		component: 'utf8string',
		community: 'utf8string',
		coverImage: 'Url'
	});

	bcs.registerStructType('UserInfo', {
		avatar: 'Url',
		coverImage: 'Url',
		name: 'utf8string',
		displayName: 'utf8string',
		email: 'utf8string',
		bio: 'utf8string',
		nation: 'utf8string',
		language: 'utf8string',
		website: 'utf8string',
		socialLinks: 'utf8string'
	});

	bcs.registerStructType('UserProfile', {
		id: BCS.ADDRESS,
		joinedAt: BCS.U64,
		userAddress: BCS.ADDRESS,
		followingCommunity: `Option<vector<${BCS.U64}>>`,
		userPosts: `Option<vector<${BCS.U64}>>`,
		userInfo: 'Option<UserInfo>',
		achievement: 'Option<vector<Achievement>>',
		teams: 'Option<vector<Team>>',
		videos: 'Option<vector<Video>>',
		award: 'Option<vector<Award>>',
		games: 'Option<vector<Game>>',
		gameSummary: `Option<vector<${BCS.U64}>>`,
		friends: 'vector<utf8string>',
		receivedRequests: 'vector<utf8string>',
		sentRequests: 'vector<utf8string>',
		isActive: BCS.BOOL
	});

	bcs.registerStructType('Reply', {
		creatorInfo: BCS.ADDRESS,
		createdAt: BCS.U64,
		threadIdx: BCS.U64,
		parentIdx: BCS.U64,
		message: 'utf8string'
	});

	bcs.registerStructType('Comment', {
		postIdx: BCS.U64,
		idx: BCS.U64,
		threadIdx: BCS.U64,
		creatorInfo: BCS.ADDRESS,
		createdAt: BCS.U64,
		message: 'utf8string',
		reply: 'vector<Reply>'
	});

	bcs.registerStructType('Post', {
		communityIdx: BCS.U64,
		idx: BCS.U64,
		title: 'utf8string',
		message: 'utf8string',
		creatorInfo: BCS.ADDRESS,
		createdAt: BCS.U64,
		vote: BCS.U64,
		voted: `vector<${BCS.ADDRESS}>`,
		comments: 'vector<Comment>',
		isDraft: BCS.BOOL
	});

	bcs.registerStructType('Community', {
		idx: BCS.U64,
		avatar: 'Option<Url>',
		coverImage: 'Option<Url>',
		creatorInfo: BCS.ADDRESS,
		visible: BCS.BOOL,
		title: 'utf8string',
		description: 'utf8string',
		members: `vector<${BCS.ADDRESS}>`,
		followers: `vector<${BCS.ADDRESS}>`,
		numPost: BCS.U64,
		numComment: BCS.U64,
		rules: 'utf8string',
		links: 'utf8string',
		resources: 'utf8string',
		createdAt: BCS.U64
	});

	return bcs;
}
