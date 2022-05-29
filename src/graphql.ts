
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum FriendshipStatus {
    FOLLOWED = "FOLLOWED",
    FOLLOWED_BACK = "FOLLOWED_BACK",
    BLACKLISTED = "BLACKLISTED"
}

export enum ReactionType {
    THUMBSUP = "THUMBSUP",
    HEART = "HEART",
    CLAP = "CLAP",
    DISLIKE = "DISLIKE"
}

export enum USER_ROLES {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum GENDER {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHERS = "OTHERS"
}

export class CreatePostInput {
    content?: Nullable<string>;
    imgUrl?: Nullable<string>;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userName: string;
    userImageUrl?: Nullable<string>;
    imagekit_fileId?: Nullable<string>;
    videoUrl?: Nullable<string>;
}

export class UpdatePostInput {
    id: string;
    userId: string;
    content?: Nullable<string>;
}

export class CreateChatInput {
    receiverId: string;
    senderId: string;
    senderFirstName: string;
    senderLastName: string;
    friendshipId: number;
    receiverFirstName: string;
    receiverLastName: string;
    message?: Nullable<string>;
    imageUrl?: Nullable<string>;
}

export class UpdateChatInput {
    _id: string;
    message: string;
}

export class GetChatsInput {
    friendshipId: number;
    page?: Nullable<number>;
    limit?: Nullable<number>;
}

export class SearchChatsInput {
    friendshipId: number;
    search: string;
    page?: Nullable<number>;
    limit?: Nullable<number>;
}

export class CreateCommentInput {
    postId: string;
    comment: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userName: string;
    userImageUrl?: Nullable<string>;
}

export class UpdateCommentInput {
    id: string;
    comment: string;
    userId: string;
}

export class GetFollowersInput {
    userId: string;
    page?: Nullable<number>;
    limit?: Nullable<number>;
}

export class CreateFollowershipInput {
    userId: string;
    friendId: string;
    friendFirstName: string;
    friendLastName: string;
    friendUserName: string;
    friendImageUrl?: Nullable<string>;
}

export class CreatereactionInput {
    postId: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userName: string;
    userImageUrl?: Nullable<string>;
    type: ReactionType;
}

export class ReactionsPagination {
    postId: string;
    page?: Nullable<number>;
    limit?: Nullable<number>;
}

export class CreateReplyInput {
    userId: string;
    userFirstName: string;
    userLastName: string;
    userName: string;
    userImageUrl?: Nullable<string>;
    commentId: string;
    reply: string;
}

export class UpdateReplyInput {
    id: string;
    reply: string;
    userId: string;
}

export class GetRepliesInput {
    commentId: string;
    page?: Nullable<number>;
    limit?: Nullable<number>;
}

export class CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: Nullable<string>;
    country?: Nullable<string>;
    state?: Nullable<string>;
    birthdate?: Nullable<Date>;
    username: string;
}

export class UpdateUserInput {
    id: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    username?: Nullable<string>;
    email?: Nullable<string>;
    phone?: Nullable<string>;
    imgUrl?: Nullable<string>;
    imagekit_fileId?: Nullable<string>;
    birthdate?: Nullable<Date>;
    headline?: Nullable<string>;
    bio?: Nullable<string>;
    country?: Nullable<string>;
    state?: Nullable<string>;
    website?: Nullable<string>;
    sex?: Nullable<GENDER>;
}

export class RetrieveUserPayload {
    username?: Nullable<string>;
    phone?: Nullable<string>;
    email?: Nullable<string>;
}

export class Post {
    id: string;
    content?: Nullable<string>;
    imgUrl?: Nullable<string>;
    videoUrl?: Nullable<string>;
    imagekit_fileId?: Nullable<string>;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userName: string;
    userImageUrl?: Nullable<string>;
    numberOfLikes: number;
    numberOfComments: number;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Posts {
    data: Post[];
    currentPage: number;
    size: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export abstract class IQuery {
    abstract posts(page?: Nullable<number>, limit?: Nullable<number>): Posts | Promise<Posts>;

    abstract post(id: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract userPosts(userId: string, page?: Nullable<number>, limit?: Nullable<number>): Posts | Promise<Posts>;

    abstract chats(payload: GetChatsInput): Chats | Promise<Chats>;

    abstract searchChats(payload: SearchChatsInput): Chats | Promise<Chats>;

    abstract chat(id: string): Nullable<Chat> | Promise<Nullable<Chat>>;

    abstract comments(postId: string, page?: Nullable<number>, limit?: Nullable<number>): Comments | Promise<Comments>;

    abstract comment(id: string): Nullable<Comment> | Promise<Nullable<Comment>>;

    abstract userComments(userId: string, page?: Nullable<number>, limit?: Nullable<number>): Comments | Promise<Comments>;

    abstract myConnections(payload: GetFollowersInput): FriendShips | Promise<FriendShips>;

    abstract connection(friendshipId: number): Nullable<FriendShip> | Promise<Nullable<FriendShip>>;

    abstract followersCount(userId: string): number | Promise<number>;

    abstract followingCount(userId: string): number | Promise<number>;

    abstract postReactions(paginationPayload?: Nullable<ReactionsPagination>): Reactions | Promise<Reactions>;

    abstract replies(payload: GetRepliesInput): Replies | Promise<Replies>;

    abstract reply(id: string): Nullable<Reply> | Promise<Nullable<Reply>>;

    abstract getAllUsers(page?: Nullable<number>, limit?: Nullable<number>): Users | Promise<Users>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract getUserByName(username: string, token?: Nullable<string>): Nullable<User> | Promise<Nullable<User>>;

    abstract retrieveUser(payload: RetrieveUserPayload): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createPost(createPostInput: CreatePostInput): Post | Promise<Post>;

    abstract updatePost(updatePostInput: UpdatePostInput): Post | Promise<Post>;

    abstract deletePost(id: string, userId: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract createChat(createChatInput: CreateChatInput): Chat | Promise<Chat>;

    abstract updateChat(updateChatInput: UpdateChatInput): Chat | Promise<Chat>;

    abstract deleteChat(id: string): Chat | Promise<Chat>;

    abstract userIsTyping(friendshipId: number, receiverId: string, senderFirstName: string, senderLastName: string): UserIsTyping | Promise<UserIsTyping>;

    abstract createComment(createCommentInput: CreateCommentInput): Comment | Promise<Comment>;

    abstract updateComment(updateCommentInput: UpdateCommentInput): Comment | Promise<Comment>;

    abstract deleteComment(id: string, userId: string): Nullable<Comment> | Promise<Nullable<Comment>>;

    abstract follow(createFollowershipInput: CreateFollowershipInput): FriendShip | Promise<FriendShip>;

    abstract followBack(friendshipId: number): FriendShip | Promise<FriendShip>;

    abstract updateLastMessage(friendshipId: number, message: string): FriendShip | Promise<FriendShip>;

    abstract blacklistFriend(friendshipId: number): FriendShip | Promise<FriendShip>;

    abstract whitelistFriend(friendshipId: number): FriendShip | Promise<FriendShip>;

    abstract addReaction(createReactionInput: CreatereactionInput): Reaction | Promise<Reaction>;

    abstract createReply(createReplyInput: CreateReplyInput): Reply | Promise<Reply>;

    abstract updateReply(updateReplyInput: UpdateReplyInput): Reply | Promise<Reply>;

    abstract removeReply(id: string, userId: string): Nullable<Reply> | Promise<Nullable<Reply>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateProfile(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract login(email: string, password: string): AuthData | Promise<AuthData>;

    abstract logout(userId: string): string | Promise<string>;

    abstract requestPasswordReset(email: string): string | Promise<string>;

    abstract resetPassword(password: string, email: string): string | Promise<string>;
}

export abstract class ISubscription {
    abstract newPost(): Post | Promise<Post>;

    abstract newChat(friendshipId: number): Chat | Promise<Chat>;

    abstract userIsTyping(friendshipId: number, receiverId: string): UserIsTyping | Promise<UserIsTyping>;

    abstract newComment(postId: string): Nullable<Comment> | Promise<Nullable<Comment>>;

    abstract newFollower(friendId: string): FriendShip | Promise<FriendShip>;

    abstract lastMessage(friendshipId: number): FriendShip | Promise<FriendShip>;

    abstract newReaction(postId: string): Reaction | Promise<Reaction>;

    abstract newReply(commentId: string): Reply | Promise<Reply>;
}

export class Chat {
    _id: string;
    senderId: string;
    senderFirstName: string;
    senderLastName: string;
    receiverId: string;
    receiverFirstName: string;
    receiverLastName: string;
    friendshipId: number;
    message?: Nullable<string>;
    imageUrl?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Chats {
    data: Chat[];
    currentPage: number;
    size: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export class UserIsTyping {
    friendshipId: number;
    receiverId: string;
    notification: string;
}

export class Comment {
    id: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userName: string;
    userImageUrl?: Nullable<string>;
    comment: string;
    createdAt: DateTime;
    updatedAt?: Nullable<DateTime>;
    postId: string;
    numberOfReplies?: Nullable<number>;
}

export class Comments {
    data: Comment[];
    currentPage: number;
    size: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export class FriendShip {
    id: number;
    userId: string;
    friendId: string;
    friendFirstName: string;
    friendLastName: string;
    friendUserName: string;
    friendImageUrl?: Nullable<string>;
    friendshipStatus: FriendshipStatus;
    lastMessage?: Nullable<string>;
    createdAt: DateTime;
    updatedAt?: Nullable<DateTime>;
}

export class FriendShips {
    data: FriendShip[];
    currentPage: number;
    size: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export class MyFriends {
    userId: string;
    friends: FriendShip[];
}

export class Reaction {
    id: string;
    type: ReactionType;
    postId: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userName: string;
    userImageUrl?: Nullable<string>;
    createdAt: Date;
}

export class Reactions {
    data: Reaction[];
    currentPage: number;
    size: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export class Reply {
    id: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userName: string;
    userImageUrl?: Nullable<string>;
    reply: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    commentId: string;
}

export class Replies {
    data: Reply[];
    currentPage: number;
    size: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: Nullable<string>;
    createdAt: DateTime;
    imgUrl?: Nullable<string>;
    imagekit_fileId?: Nullable<string>;
    birthdate: Date;
    headline?: Nullable<string>;
    bio?: Nullable<string>;
    country?: Nullable<string>;
    state?: Nullable<string>;
    website?: Nullable<string>;
    sex?: Nullable<GENDER>;
    username: string;
    user_role: USER_ROLES;
    isLoggedIn: boolean;
}

export class Users {
    data: Nullable<User>[];
    currentPage: number;
    size: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export class AuthData {
    AccessToken?: Nullable<string>;
    ExpiresIn?: Nullable<number>;
    TokenType?: Nullable<string>;
    RefreshToken?: Nullable<string>;
    IdToken?: Nullable<string>;
}

export type DateTime = any;
type Nullable<T> = T | null;
