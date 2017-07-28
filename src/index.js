require('dotenv-safe').load();
import http from 'http';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import app from './server';
import schema from './schema/schema';

const PORT = process.env.NODE_ENV === "production" ? 3030 : 3000
const server = http.createServer(app);
let currentApp = app;

server.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`)
	new SubscriptionServer(
		{
			execute,
			subscribe,
			schema
		},
		{
			server: server,
			path: '/subscriptions'
		}
	);
});

if (module.hot) {
	module.hot.accept(['./server', './schema/schema'], () => {
		server.removeListener('request', currentApp);
		server.on('request', app);
		currentApp = app;
	});
}
