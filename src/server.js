import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import schema from './schema/schema';

const app = express();

app.use(cors());
app.use(
	'/graphiql',
	graphiqlExpress({
		endpointURL: '/graphql',
		subscriptionsEndpoint: `ws://localhost:3000/subscriptions`
	})
);
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));

export default app;
