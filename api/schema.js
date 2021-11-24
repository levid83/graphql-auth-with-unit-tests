const { gql } = require("apollo-server");

module.exports = gql`
  directive @isAdmin on FIELD_DEFINITION
  directive @cost(value: Int) on FIELD_DEFINITION

  enum Role {
    ADMIN
    USER
  }

  type Query @rateLimit(limit: 5, duration: 10) {
    userById(id: ID): User @isAdmin
    users: [User] @isAdmin
    me: User
  }

  type User {
    id: String!
    email: String! @cost(value: 10)
    role: Role
  }

  input Credentials {
    email: String!
    password: String!
  }

  type AuthPayload {
    user: User
  }

  type Mutation {
    signUp(credentials: Credentials!): AuthPayload
    signIn(credentials: Credentials!): AuthPayload
    signOut: AuthPayload
  }
`;
