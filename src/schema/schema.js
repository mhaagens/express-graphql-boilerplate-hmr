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
		Posts: [Post]
		Post(id: Int!): Post
		Comments: [Comment]
		Comment(id: Int!): Comment
	}
`;

const Mutation = `
	type Mutation {
		addPost(title: String): Post
	}
`;

const Subscription = `
	type Subscription {
		postAdded(title: String): Post
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
	typeDefs: [SchemaDefinition, Query, Post, Comment, Mutation, Subscription],
	resolvers: {
		Query: {
			Posts: () => {
				return DummyPosts;
			},
			Post: (_, args) => {
				let [post] = DummyPosts.filter(p => p.id === args.id);
				if (post) return post;
			},
			Comments: () => {
				return DummyComments;
			},
			Comment: (_, args) => {
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
			addPost: (root, args) => {
				let id = nextId++;
				const post = {
					id: id,
					title: args.title
				}
				DummyPosts.push(post);
				pubsub.publish("postAdded", { postAdded: post});
				return post;
			}
		},
		Subscription: {
			postAdded: {
				subscribe: () => pubsub.asyncIterator('postAdded')
			}
		}
	}
});
