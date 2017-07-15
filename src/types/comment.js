import Post from "./post";

const Comment = `
  type Comment {
    id: Int!
    body: String!
    post_id: Int
    posts: [Post]
  }
`;

export default () => [Comment, Post];
