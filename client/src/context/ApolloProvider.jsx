import React from "react";
import {
  ApolloProvider as Provider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { AuthContext } from "./AuthProvider";

const apollo = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "/graphql",
  }),
  credentials: "same-origin",
});

export function ApolloProvider({ children }) {
  const { isAuthenticated } = React.useContext(AuthContext);
  React.useEffect(() => {}, [isAuthenticated]);
  return <Provider client={apollo}>{children}</Provider>;
}
