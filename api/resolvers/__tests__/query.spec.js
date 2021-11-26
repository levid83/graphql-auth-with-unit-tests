const { users, me, userById } = require("../query");

describe("Query tests", () => {
  test("it should get the users list", async () => {
    const list = [
      {
        id: 1000,
        email: "user@test.com",
        role: "USER",
      },
      {
        id: 1001,
        email: "user2@test.com",
        role: "USER",
      },
    ];
    const getUsers = jest.fn().mockReturnValue(list);
    const res = await users(
      undefined,
      {},
      {
        dataSources: {
          userDataSource: {
            getUsers: getUsers,
          },
        },
      }
    );
    expect(res).toStrictEqual(list);
  });
  test("it should get the user by id", async () => {
    const user = {
      id: 1000,
      email: "user@test.com",
      role: "USER",
    };
    const getUserById = jest.fn().mockReturnValue(user);
    const res = await userById(
      undefined,
      { id: 1000 },
      {
        dataSources: {
          userDataSource: {
            getUserById: getUserById,
          },
        },
      }
    );
    expect(res).toStrictEqual(user);
    expect(getUserById).toBeCalledWith(1000);
  });

  test("it should get the user from context", async () => {
    const user = {
      id: 1000,
      email: "user@test.com",
      role: "USER",
    };
    const getUserById = jest.fn().mockReturnValue(user);
    const res = await me(undefined, undefined, {
      dataSources: {
        userDataSource: {
          getUserById: getUserById,
        },
      },
      user: { id: 1000 },
    });
    expect(res).toStrictEqual(user);
    expect(getUserById).toBeCalledWith(1000);
  });
});
