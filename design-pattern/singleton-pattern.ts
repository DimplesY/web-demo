class User {
  private static instance: User;

  private constructor() {
  }

  public static getInstance(): User {
    if (!User.instance) {
      User.instance = new User()
    }
    return User.instance
  }
}


console.log(User.getInstance() === User.getInstance())
