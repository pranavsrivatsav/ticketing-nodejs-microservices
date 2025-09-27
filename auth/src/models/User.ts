import mongoose from "mongoose";
import Password from "../utils/Password";

// Define the attributes required to create a new user
interface userAttrs {
  email: string;
  password: string;
}

// Interface holding the type of the document returned by the User Model
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Define the custom model interface that extends mongoose.Model
// This allows us to add custom static methods to the model
interface UserModel extends mongoose.Model<UserDoc> {
  // Custom static method to create a new user
  buildUser(attrs: userAttrs): UserDoc;
}

const userTransform = function (doc: UserDoc, ret: any) {
  ret.id = doc._id;
  delete ret._id;
  delete ret.password;

  return ret;
};

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true, // Email is required
    },
    password: {
      type: String,
      required: true, // Password is required
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: userTransform,
    },
  }
);

// Add the custom static method to the schema
// This method allows us to create a new user in a type-safe way
userSchema.statics.buildUser = function (attrs: userAttrs): UserDoc {
  // Use the Mongoose model to create a new user document
  return new User(attrs);
};

userSchema.pre("save", async function (next) {
  const isPasswordUpdated = this.isModified("password");

  if (isPasswordUpdated) {
    const hashedPassword = await Password.hash(this.password);
    this.password = hashedPassword;
  }

  next();
});

// Create the User model
// - The first type parameter (`any`) represents the document type (currently not strictly typed)
// - The second type parameter (`UserModel`) represents the model type, including custom static methods
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// Example usage of the custom static method
// This demonstrates how to create a new user using the `buildUser` method
// const newUser = User.buildUser({
//   email: "ksjfhgjks",
//   password: "sfhjglskjhfg",
// });

// Export the User model for use in other parts of the application
export default User;
