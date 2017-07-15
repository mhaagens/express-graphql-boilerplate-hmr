import Comment from "./comment";

const Post = `
  type Post {
    id: Int!
    title: String!
    comments: [Comment]
  }
`;

export default () => [Post, Comment];
