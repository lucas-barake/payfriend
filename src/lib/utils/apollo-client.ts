import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { env } from "$/env.mjs";

const hygraphLink = new HttpLink({
  uri: env.NEXT_PUBLIC_HYGRAPH_GRAPHQL_ENDPOINT,
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([hygraphLink]),
  cache: new InMemoryCache(),
});
