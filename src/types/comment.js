import Post from "./post";

const Comment = `
  type Comment {
    id: Int!
    body: String!
    post_id: Int
    post: Post
  }
`;

export default () => [Comment, Post];
