import { makeExecutableSchema } from 'graphql-tools';
import pubsub from "../pubsub";

// Types
import Post from '../types/post';
import Comment from '../types/comment';

// Controllers
import PostsController from '../controllers/posts_controller';
import CommentsController from "../controllers/comments_controller";

let nextId = 7;

const Query = `
	type Query {
		posts: [Post]
		post(id: Int!): Post
		comments: [Comment]
		comment(id: Int!): Comment
	}
`;

const PostInput = `
	input PostInput {
		title: String!
	}
`;

const CommentInput = `
	input CommentInput {
		body: String!
		post_id: Int!
	}
`;

const Mutation = `
	type Mutation {
		addPost(input: PostInput!): Post
		addComment(input: CommentInput!): Comment
	}
`;

const Subscription = `
	type Subscription {
		postAdded(title: String): Post,
		commentAdded(title: String): Comment
	}
`;

const SchemaDefinition = `
	schema {
		query: Query,
		mutation: Mutation,
		subscription: Subscription
	}
`;

export default makeExecutableSchema({
	typeDefs: [SchemaDefinition, Query, Post, PostInput, Comment, CommentInput, Mutation, Subscription],
	resolvers: {
		Query: {
			posts: () => Promise.resolve().then(async () => await PostsController.index()).catch(err => err),
			post: (_, { id }) => Promise.resolve().then(async () => PostsController.show(id)).catch(err => err),
			comments: () => Promise.resolve().then(async () => await CommentsController.index()).catch(err => err),
			comment: (_, { id }) => Promise.resolve().then(async () => CommentsController.show(id)).catch(err => err)
		},
		Post: {
			comments: ({id}) => Promise.resolve().then(async () => await PostsController.getPostComments(id)).catch(err => err),
		},
		Comment: {
			post: ({post_id}) => Promise.resolve().then(async () => await CommentsController.getCommentPost(post_id)).catch(err => err)
		},
		Mutation: {
			addPost: (_, { input }) => Promise.resolve().then(async () => await PostsController.create(input)).catch(err => err),
			addComment: (_, args) => null
		},
		Subscription: {
			postAdded: {
				subscribe: () => pubsub.asyncIterator('postAdded')
			},
			commentAdded: {
				subscribe: () => pubsub.asyncIterator('commentAdded')
			}
		}
	}
});
