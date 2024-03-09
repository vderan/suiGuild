type ImageUrl = {
	url: string;
};

type IForumImageUrl = {
	some: {
		url: string;
	};
};

type Some<T> = {
	some?: T;
};

type None = {
	none?: boolean;
};

export interface UserInfo {
	id: string;
	userAddress: string;
	joinedAt: Date;
	isActive: boolean;
	friends: string[];
	receivedRequests: string[];
	sentRequests: string[];
	followingCommunity: None & Some<string[]>;
	userPosts: None & Some<string[]>;
	userInfo:
		| Some<{
				name: string;
				avatar: ImageUrl;
				coverImage: ImageUrl;
				displayName: string;
				email: string;
				bio: string;
				nation: string;
				language: string;
				website: string;
				socialLinks: string;
		  }> &
				None;
	achievement: None & Some<IAchievement[]>;
	award: None & Some<IAward[]>;
	gameSummary: None & Some<string[]>;
	games: None & Some<IGamingSetup[]>;
	teams: None & Some<ITeam[]>;
	videos: None & Some<IVideo[]>;
}

//////////////////////////// Auth.context interface ///////////////////////////
export interface IGilder {
	id: string;
	name: string;
	avatar: string;
	postNum: number;
	commentNum: string;
	coverImage: string;
	displayName: string;
	email: string;
	bio: string;
	nation: string;
	language: string;
	website: string;
	socialLinks: string;
	joinedAt: Date;
	friends: string[];
	receivedRequests: string[];
	sentRequests: string[];
}

//////////////////////////// Forum.context interface ///////////////////////////
export interface IForum {
	idx: string;
	title: string;
	avatar: IForumImageUrl;
	coverImage: IForumImageUrl;
	description: string;
	rules: string;
	links: string;
	resources: string;
	followers: string[];
	members: string[];
	numPost: string;
	numComment?: string;
	visible: boolean;
	createdAt: string;
	creatorInfo: string;
}

export interface IPost {
	idx: string;
	communityIdx: string;
	title: string;
	message: string;
	creatorInfo: string;
	createdAt: string;
	vote: string;
	isDraft: boolean;
	voted: string[];
	comments?: IComment[];
}

export interface IComment {
	idx: string;
	postIdx: string;
	createdAt: string;
	creatorInfo: string;
	message: string;
	threadIdx: string;
	reply: IReply[];
}

export interface IReply {
	creatorInfo: string;
	createdAt: string;
	parentIdx: string;
	threadIdx: string;
	message: string;
}

export interface IReplyProps {
	depth: number;
	reply: IReply;
	communityIdx: string;
	comment: IComment;
}

//////////////////////////// Notification.context interface ///////////////////////////
export interface INotification {
	_id: string;
	type: 'friend-request' | 'friend-approval' | 'friend-rejection' | 'friend-deletion';
	from: string;
	to: string;
	createdAt: string;
}

export interface IAchievement {
	title: string;
	description: string;
	year: string;
	month: string;
	place: string;
	team: string;
	link: string;
	coverImage: ImageUrl;
}

export interface IGameSummary {
	id: string;
}

export interface ITeam {
	name: string;
	coverImage: ImageUrl;
	startYear: string;
	startMonth: string;
	endYear?: string;
	endMonth?: string;
}

export interface IVideo {
	name: string;
	link: string;
}

export interface IGamingSetup {
	coverImage: ImageUrl;
	name: string;
	community: string;
	component: string;
}

export interface IAward {
	title: string;
	year: string;
	month: string;
	link: string;
	coverImage: ImageUrl;
}

export interface IGroup {
	id: string;
	name: string;
	avatar: string;
	memberNum: string;
}
