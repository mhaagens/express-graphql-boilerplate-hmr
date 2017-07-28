import Post from "../post/post_type";

const Comment = `
  type Comment {
    id: Int!
    body: String!
    post_id: Int
    post: Post
  }
`;

export default () => [Comment, Post];
