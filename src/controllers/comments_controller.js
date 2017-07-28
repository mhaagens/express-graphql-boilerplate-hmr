import DummyComments from '../dummy_data/dummy_comments';
import DummyPosts from '../dummy_data/dummy_posts';

export default class CommentsController {
	static index() {
		return new Promise((resolve,reject) => {
			try {
				resolve(DummyComments);
			} catch (err) {
				reject(err)
			}
		})
	}

	static show(id) {
		return new Promise((resolve,reject) => {
			try {
				resolve(...DummyComments.filter(comment => comment.id === id));
			} catch (err) {
				reject(err)
			}
		})	
	}

	static getCommentPost(postId) {
		return new Promise((resolve,reject) => {
			try {
				resolve(...DummyPosts.filter(post => post.id === postId));
			} catch (err) {
				reject(err)
			}
		})	
	}
}