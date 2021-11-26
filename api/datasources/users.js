const { DataSource } = require("apollo-datasource");
const lodashId = require("lodash-id");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

class UserDataSource extends DataSource {
  constructor(file) {
    super();
    const adapter = new FileSync(file);
    this.adapter = low(adapter);
    this.adapter._.mixin(lodashId);
  }

  initialize({}) {
    this.db = this.adapter.get("users");
  }

  getUsers() {
    return this.db.value();
  }

  getUserById(id) {
    return this.db.getById(id).value();
  }

  createUser(user) {
    return this.db.insert(user).write();
  }

  getUserByEmail(email) {
    return this.db.find({ email }).value();
  }
}

module.exports = { UserDataSource };
