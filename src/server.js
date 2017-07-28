import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import schema from './schema/schema';

const PORT = process.env.NODE_ENV === 'production' ? 3030 : 3000;
const SUBSCRIPTIONS_URL =
	process.env.NODE_ENV === 'production'
		? process.env.WS_URL
		: `ws://localhost:${PORT}/subscriptions`;
		
const app = express();

app.use(cors());
app.use(
	'/graphiql',
	graphiqlExpress({
		endpointURL: '/graphql',
		subscriptionsEndpoint: SUBSCRIPTIONS_URL
	})
);
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));

export default app;
