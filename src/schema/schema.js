import { GraphQLObjectType, GraphQLSchema, GraphQLList } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import Post from '../types/post';
import Comment from '../types/comment';
import DummyPosts from '../dummy_data/dummy_posts';
import DummyComments from '../dummy_data/dummy_comments';

const RootQuery = `
	type RootQuery {
		posts: [Post]
		post(id: Int!): Post
		comments: [Comment]
		comment(id: Int!): Comment
	}
`;

const SchemaDefinition = `
	schema {
		query: RootQuery
	}
`;

export default makeExecutableSchema({
	typeDefs: [SchemaDefinition, RootQuery, Post, Comment],
	resolvers: {
		RootQuery: {
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
		}
	}
});
