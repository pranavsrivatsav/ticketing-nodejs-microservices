import { BadRequestError } from "@psctickets/common/errors";
import User, { UserDoc } from "../models/User";
import RegisterUserRequest from "../types/RegisterUserRequest";
import SignInUserRequest from "../types/SignInUserRequest";
import Password from "../utils/Password";

export const registerUser = async (payload: RegisterUserRequest): Promise<UserDoc> => {
  // check user exists
  const existingUser = await User.exists({ email: payload.email });
  if (existingUser) {
    throw new BadRequestError("User with provided email already exists");
  }

  // build new user and save to db
  const newUser = User.buildUser({
    email: payload.email,
    password: payload.password,
  });

  await newUser.save();

  // return user
  return newUser;
};

export const signInUser = async (payload: SignInUserRequest): Promise<UserDoc> => {
  // check user exists
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new BadRequestError("Invalid Credentials");
  }

  const isPasswordValid = await Password.verify(user.password, payload.password);

  //create JWT and set as cookie

  if (!isPasswordValid) {
    throw new BadRequestError("Invalid Credentials");
  }

  return user;
};
