require("dotenv").config();

const JWT = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");

const { ApolloServer } = require("apollo-server-express");
const depthLimit = require("graphql-depth-limit");
const { createComplexityLimitRule } = require("graphql-validation-complexity");
const {
  createRateLimitTypeDef,
  createRateLimitDirective,
  defaultKeyGenerator,
} = require("graphql-rate-limit-directive");

const { UserDataSource } = require("./datasources/users");
const { AuthDirective } = require("./directives/AuthDirective");

const typeDefs = require("./schema");
const resolvers = require("./resolvers/index");

const app = express();

const dataSources = () => ({
  userDataSource: new UserDataSource("./data/users.json"),
});

app.use(cookieParser());

const keyGenerator = (directiveArgs, obj, args, context, info) =>
  context.user
    ? `${context.user.id}`
    : defaultKeyGenerator(directiveArgs, obj, args, context, info);

const server = new ApolloServer({
  typeDefs: [createRateLimitTypeDef(), typeDefs],
  resolvers,
  dataSources,
  schemaDirectives: {
    isAdmin: AuthDirective,
    rateLimit: createRateLimitDirective({
      keyGenerator,
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
  context: ({ req, res }) => {
    let user = null;
    if (req.cookies.token) {
      user = JWT.verify(req.cookies.token, process.env.SECRET);
    }
    return {
      user,
      req,
      res,
    };
  },
});

server.applyMiddleware({ app });

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running at port 4000`);
});
