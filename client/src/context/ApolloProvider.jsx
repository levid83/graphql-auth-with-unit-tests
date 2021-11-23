import React from "react";
import {
  ApolloProvider as Provider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { AuthContext } from "./AuthProvider";

export function ApolloProvider({ children }) {
  const { isAuthenticated } = React.useContext(AuthContext);
  React.useEffect(() => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: "/graphql",
      }),
      credentials: "same-origin",
    });
    setClient(client);
  }, [isAuthenticated]);

  const [client, setClient] = React.useState(undefined);

  return client ? <Provider client={client}>{children}</Provider> : null;
}
