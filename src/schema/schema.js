import { makeExecutableSchema } from 'graphql-tools';
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

import Post from '../types/post';
import Comment from '../types/comment';
import DummyPosts from '../dummy_data/dummy_posts';
import DummyComments from '../dummy_data/dummy_comments';

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
			posts: () => {
				return DummyPosts;
			},
			post: (_, args) => {
				let [post] = DummyPosts.filter(p => p.id === args.id);
				if (post) return post;
			},
			comments: () => {
				return DummyComments;
			},
			comment: (_, args) => {
				let [comment] = DummyComments.filter(c => c.id === args.id);
				if (comment) return comment;
			},
		},
		Post: {
			comments: post => {
				return DummyComments.filter(c => c.post_id === post.id);
			}
		},
		Comment: {
			posts: comment => {
				return DummyPosts.filter(p => p.id === comment.post_id);
			}
		},
		Mutation: {
			addPost: (_, args) => {
				console.log(args);
				let id = nextId++;
				const post = Object.assign({}, {id: id}, args.input);
				DummyPosts.push(post);
				pubsub.publish("postAdded", { postAdded: post});
				return post;
			},
			addComment: (_, args) => {
				let comment = Object.assign({}, {id: nextId++}, args.input);
				DummyComments.push(comment);
				return comment;
			}
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
