import crypto from "crypto";
import { promisify } from "util";

// hashing the password with the salt
const pbkdf2Async = promisify(crypto.pbkdf2);

class Password {
  static hash = async (password: string): Promise<string> => {
    // generating a random salt
    const salt = crypto.randomBytes(16).toString("hex");

    const hashedPassword = (await pbkdf2Async(password, salt, 100000, 64, "sha512")).toString(
      "hex"
    );

    return `${hashedPassword}.${salt}`;
  };

  static verify = async (
    hashedPasswordWithSalt: string,
    inputPassword: string
  ): Promise<boolean> => {
    const [hashedPassword, salt] = hashedPasswordWithSalt.split(".");

    const generatedHash = (await pbkdf2Async(inputPassword, salt, 100000, 64, "sha512")).toString(
      "hex"
    );

    return generatedHash === hashedPassword;
  };
}

export default Password;
