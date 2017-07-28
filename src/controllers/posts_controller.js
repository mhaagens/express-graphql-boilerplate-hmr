import pubsub from "../pubsub";
import DummyPosts from '../dummy_data/dummy_posts';
import DummyComments from '../dummy_data/dummy_comments';

let nextId = DummyPosts.length;

export default class PostsController {
	static index() {
		return new Promise((resolve,reject) => {
			try {
				resolve(DummyPosts);
			} catch (err) {
				reject(err)
			}
		})
	}

	static show(id) {
		return new Promise((resolve,reject) => {
			try {
				resolve(...DummyPosts.filter(post => post.id === id));
			} catch (err) {
				reject(err)
			}
		})	
	}

	static create(input) {
		return new Promise((resolve,reject) => {
			try {
				nextId++;
				const post = Object.assign({}, { id: nextId }, input);
				DummyPosts.push(post);
				resolve(post);
				pubsub.publish('postAdded', { postAdded: post });
			} catch (err) {
				reject(err);
			}
		})
	}

	static getPostComments(postId) {
		return new Promise((resolve,reject) => {
			try {
				resolve(DummyComments.filter(comment => comment.post_id === postId));
			} catch (err) {
				reject(err)
			}
		})		
	}
}