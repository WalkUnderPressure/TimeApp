import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { split, HttpLink } from '@apollo/client/index.js';
import { getMainDefinition } from '@apollo/client/utilities/index.js';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions/index.js';
import { createClient } from 'graphql-ws';

const {
  REACT_APP_QUERY_ENDPOINT_URI,
  REACT_APP_SUBS_ENDPOINT_URI, 
} = process.env;

const httpLink = new HttpLink({
  uri: REACT_APP_QUERY_ENDPOINT_URI,
});

const wsLink = new GraphQLWsLink(createClient({
  url: REACT_APP_SUBS_ENDPOINT_URI,
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

function ApolloProviderWrapper({ children }) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}

export default ApolloProviderWrapper;
