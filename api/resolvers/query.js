module.exports = {
  users: async (parent, args, { user, dataSources }, info) => {
    const users = await dataSources.userDataSource.getUsers();
    return users;
  },
  userById: async (parent, { id }, { dataSources }, info) => {
    const user = await dataSources.userDataSource.getUserById(id);
    return user;
  },
  me: async (parent, { id }, { dataSources, user }, info) => {
    if (user) {
      return dataSources.userDataSource.getUserById(user.id);
    }
    return undefined;
  },
};
