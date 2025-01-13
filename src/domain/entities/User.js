class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export default User;
