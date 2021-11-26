const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (userInfo) =>
  JWT.sign(
    { id: userInfo.id, email: userInfo.email, role: userInfo.role },
    process.env.SECRET
  );

const verifyPassword = (attemptedPw, hashedPw) =>
  bcrypt.compareSync(attemptedPw, hashedPw);

const hashPassword = (password) => bcrypt.hashSync(password);

module.exports = {
  signUp: async (parent, { credentials }, { dataSources, res }, info) => {
    const { email, password } = credentials;
    const userCredentials = { email: email.toLowerCase(), password };

    const existingUser = dataSources.userDataSource.getUserByEmail(
      userCredentials.email
    );

    if (existingUser)
      throw new Error("A user account with that email already exists.");

    const hash = hashPassword(userCredentials.password);

    const role = userCredentials.email.toLowerCase().endsWith("@domain.com")
      ? "ADMIN"
      : "USER";

    const dbUser = dataSources.userDataSource.createUser({
      email: userCredentials.email,
      hash,
      role,
    });

    const token = createToken(dbUser);

    res.cookie("token", token, {
      httpOnly: true,
    });

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
      },
    };
  },
  signIn: async (parent, { credentials }, { dataSources, res }, info) => {
    const { email, password } = credentials;
    const userCredentials = { email: email.toLowerCase(), password };

    const existingUser = dataSources.userDataSource.getUserByEmail(
      userCredentials.email
    );

    if (!existingUser) throw new Error("Incorrect email address or password.");

    const isValidPassword = verifyPassword(password, existingUser.hash);

    if (!isValidPassword)
      throw new Error("Incorrect email address or password.");

    const token = createToken(existingUser);

    res.cookie("token", token, {
      httpOnly: true,
    });

    return {
      user: {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
    };
  },
  signOut: (parent, args, { dataSources, res }, info) => {
    res.clearCookie("token");
    return {
      user: undefined,
    };
  },
};
