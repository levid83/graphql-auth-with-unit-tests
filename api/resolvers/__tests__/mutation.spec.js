const { signOut, signUp, signIn } = require("../mutation");

describe("Mutation tests", () => {
  describe("SignUp tests", () => {
    test("it should throw an error when email already exists", async () => {
      expect(
        signUp(
          undefined,
          { credentials: { email: "test@domain.com", password: "1234" } },
          {
            dataSources: {
              userDataSource: {
                getUserByEmail: jest
                  .fn()
                  .mockReturnValue({ email: "test@domain.com" }),
              },
            },
          }
        )
      ).rejects.toThrow(/already exists/);
    });

    test("it should return a new user", async () => {
      const cookie = jest.fn();
      process.env.SECRET = "12121212112";

      const credentials = {
        email: "user@test.com",
        password: "1234",
      };
      const user = { email: credentials.email, id: 1000, role: "USER" };

      const res = await signUp(
        undefined,
        { credentials: credentials },
        {
          dataSources: {
            userDataSource: {
              getUserByEmail: jest.fn().mockReturnValue(undefined),
              createUser: jest.fn().mockReturnValue(user),
            },
          },
          res: {
            cookie,
          },
        }
      );
      expect(res).toStrictEqual({ user: user });
    });

    test("it should create a new token cookie", async () => {
      const cookie = jest.fn();
      process.env.SECRET = "12121212112";

      const credentials = {
        email: "user@test.com",
        password: "1234",
      };
      const user = { email: credentials.email, id: 1000, role: "USER" };

      const res = await signUp(
        undefined,
        { credentials: credentials },
        {
          dataSources: {
            userDataSource: {
              getUserByEmail: jest.fn().mockReturnValue(undefined),
              createUser: jest.fn().mockReturnValue(user),
            },
          },
          res: {
            cookie,
          },
        }
      );
      expect(cookie).toBeCalled();
    });
  });

  describe("SignIn tests", () => {
    test("it should throw an error when email doesn't exist", async () => {
      expect(
        signIn(
          undefined,
          { credentials: { email: "user@test.com", password: "1234" } },
          {
            dataSources: {
              userDataSource: {
                getUserByEmail: jest.fn().mockReturnValue(undefined),
              },
            },
          }
        )
      ).rejects.toThrow(/Incorrect email address or password/);
    });

    test("it should throw an error when password is incorrect", async () => {
      expect(
        signIn(
          undefined,
          { credentials: { email: "user@test.com", password: "1234" } },
          {
            dataSources: {
              userDataSource: {
                getUserByEmail: jest.fn().mockReturnValue({
                  email: "user@test.com",
                  hash: "dff43f34f34f32f4",
                }),
              },
            },
          }
        )
      ).rejects.toThrow(/Incorrect email address or password/);
    });

    test("it should return the user", async () => {
      const cookie = jest.fn();
      process.env.SECRET = "12121212112";

      const credentials = {
        email: "d@y.com",
        password: "123456",
      };
      const user = { email: credentials.email, id: 1000, role: "USER" };

      const res = await signIn(
        undefined,
        { credentials: credentials },
        {
          dataSources: {
            userDataSource: {
              getUserByEmail: jest.fn().mockReturnValue({
                ...user,
                hash: "$2a$10$PZkBfNBN7gopreZFxcqA7u.nzsGdmpip.VozBy.hXB.5laC6VONKq",
              }),
            },
          },
          res: {
            cookie,
          },
        }
      );
      expect(res).toStrictEqual({ user: user });
    });

    test("it should create a new token cookie", async () => {
      const cookie = jest.fn();
      process.env.SECRET = "12121212112";

      const credentials = {
        email: "d@y.com",
        password: "123456",
      };
      const user = { email: credentials.email, id: 1000, role: "USER" };

      const res = await signIn(
        undefined,
        { credentials: credentials },
        {
          dataSources: {
            userDataSource: {
              getUserByEmail: jest.fn().mockReturnValue({
                ...user,
                hash: "$2a$10$PZkBfNBN7gopreZFxcqA7u.nzsGdmpip.VozBy.hXB.5laC6VONKq",
              }),
            },
          },
          res: {
            cookie,
          },
        }
      );
      expect(cookie).toBeCalled();
    });
  });

  describe("SignOut tests", () => {
    test("it should signout", () => {
      const clearCookie = jest.fn();
      const res = signOut(undefined, undefined, {
        dataSources: undefined,
        res: { clearCookie },
      });
      expect(res).toStrictEqual({ user: undefined });
      expect(clearCookie).toBeCalledWith("token");
    });
  });
});
