import http from 'http';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import app from './server';
import schema from "./schema/schema";

const server = http.createServer(app);
let currentApp = app;

server.listen(3000, () => {
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
	module.hot.accept('./server', () => {
		server.removeListener('request', currentApp);
		server.on('request', app);
		currentApp = app;
	});
}
