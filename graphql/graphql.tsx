// ApolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://192.168.1.5:8080/query', // Thay thế bằng URL của API GraphQL
  }),
  cache: new InMemoryCache(),
});

export default client;