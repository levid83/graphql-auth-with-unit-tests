module.exports = {
  users: async (parent, args, { dataSources }, info) => {
    return await dataSources.userDataSource.getUsers();
  },
  userById: async (parent, { id }, { dataSources }, info) => {
    return await dataSources.userDataSource.getUserById(id);
  },

  me: async (parent, args, { dataSources, user }, info) => {
    if (user) {
      return await dataSources.userDataSource.getUserById(user.id);
    }
    return undefined;
  },
};
