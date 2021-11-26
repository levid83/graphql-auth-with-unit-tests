const { createTestClient } = require("apollo-server-testing");
const { ApolloServer, gql, MockList } = require("apollo-server");
const depthLimit = require("graphql-depth-limit");
const { createComplexityLimitRule } = require("graphql-validation-complexity");
const {
  createRateLimitTypeDef,
  createRateLimitDirective,
  defaultKeyGenerator,
} = require("graphql-rate-limit-directive");

const typeDefs = require("../schema");

const { UserDataSource } = require("../datasources/users");
const { AuthDirective } = require("../directives/AuthDirective");

const resolvers = require("../resolvers");

process.env.SECRET = "12121212112";

const apolloConfig = {
  typeDefs: [createRateLimitTypeDef(), typeDefs],
  dataSources: () => ({
    userDataSource: new UserDataSource("./data/test_data.json"),
  }),
  resolvers: resolvers,
  schemaDirectives: {
    isAdmin: AuthDirective,
    rateLimit: createRateLimitDirective({
      defaultKeyGenerator,
    }),
  },
  validationRules: [
    depthLimit(3),
    createComplexityLimitRule(600, {
      onCost: (cost) => {
        // console.log("query cost:", cost);
      },
    }),
  ],
  context: () => ({
    user: { id: "3", email: "user2@test.com", role: "ADMIN" },
    res: { cookie: jest.fn(), clearCookie: jest.fn() },
  }),
};

describe("Query integration tests", () => {
  test("Should return the user list ", async () => {
    const server = new ApolloServer({ ...apolloConfig });

    const { query } = createTestClient(server);
    const result = await query({
      query: gql`
        query {
          users {
            id
            email
            role
          }
        }
      `,
    });

    expect(result.data.users.length).toBeGreaterThan(2);
    expect(result.data.users[0]).toEqual({
      id: "1",
      email: "admin@domain.com",
      role: "ADMIN",
    });
  });

  test("Should return the user by id ", async () => {
    const server = new ApolloServer({ ...apolloConfig });

    const { query } = createTestClient(server);
    const result = await query({
      query: gql`
        query userById($id: String!) {
          userById(id: $id) {
            id
            email
            role
          }
        }
      `,
      variables: { id: "1" },
    });

    expect(result.data.userById).toEqual({
      id: "1",
      email: "admin@domain.com",
      role: "ADMIN",
    });
  });

  test("Should return the current user ", async () => {
    const server = new ApolloServer({ ...apolloConfig });

    const { query } = createTestClient(server);
    const result = await query({
      query: gql`
        query {
          me {
            id
            email
            role
          }
        }
      `,
    });

    expect(result.data.me).toEqual({
      id: "3",
      email: "user2@test.com",
      role: "ADMIN",
    });
  });
});

describe("Mutation integration tests", () => {
  test("should sign in ", async () => {
    const server = new ApolloServer({ ...apolloConfig });

    const { mutate } = createTestClient(server);
    const result = await mutate({
      mutation: gql`
        mutation signIn($email: String!, $password: String!) {
          signIn(credentials: { email: $email, password: $password }) {
            user {
              id
              email
              role
            }
          }
        }
      `,
      variables: { email: "admin@domain.com", password: "123456" },
    });

    expect(result.data.signIn.user.id).toBe("1");
  });

  test("should sign out ", async () => {
    const server = new ApolloServer({ ...apolloConfig });

    const { mutate } = createTestClient(server);
    const result = await mutate({
      mutation: gql`
        mutation signOutUser {
          signOut {
            user {
              id
              email
            }
          }
        }
      `,
    });
    expect(result.data.signOut.user).toBeNull();
  });

  test("should giv erro on sign up with existing user", async () => {
    const server = new ApolloServer({ ...apolloConfig });

    const { mutate } = createTestClient(server);
    const result = await mutate({
      mutation: gql`
        mutation signUp($email: String!, $password: String!) {
          signUp(credentials: { email: $email, password: $password }) {
            user {
              id
              email
              role
            }
          }
        }
      `,
      variables: { email: "admin@domain.com", password: "123456" },
    });

    expect(result.errors[0].message).toMatch(/already exists/);
  });
});
