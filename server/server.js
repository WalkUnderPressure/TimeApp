import express from "express";
import { createServer } from "http";
import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { WebSocketServer } from "ws";

import { PORT, QUERY_PATH, SUBS_PATH } from './config.js';
const DATE_UPDATED = "DATE_UPDATED";
const ONE_SECOND = 1000;

const GetCurrentDateStr = () => Date.now().toString();
const pubsub = new PubSub();

const typeDefs = gql`
  type Query {
    getCurrentDate: String!
  }
    
  type Subscription {
    currentDateUpdated: String!
  }
`;

const resolvers = {
  Query: {
    getCurrentDate: () => GetCurrentDateStr(),
  },
  Subscription: {
    currentDateUpdated: {
      subscribe: () => pubsub.asyncIterator([DATE_UPDATED]),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);


const wsServer = new WebSocketServer({
  server: httpServer,
  path: SUBS_PATH,
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
server.applyMiddleware({ app, path: QUERY_PATH });

httpServer.listen(PORT, () => {
  console.log(
    `Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `Subscription endpoint ready at ws://localhost:${PORT}${wsServer.options.path}`
  );
});

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function updateDate() {
    const currentDateVal = GetCurrentDateStr();

    pubsub.publish(DATE_UPDATED, {
        currentDateUpdated: currentDateVal,
    });

    await sleep(ONE_SECOND);
    updateDate();
}

updateDate();
