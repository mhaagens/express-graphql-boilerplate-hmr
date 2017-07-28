import Comment from "../comment/comment_type";

const Post = `
  type Post {
    id: Int!
    title: String!
    comments: [Comment]
  }
`;

export default () => [Post, Comment];
