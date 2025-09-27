import { TicketDocument } from "../models/Ticket";
import { RegisterUserRequest } from "./RegisterUserRequest";

/**
 * We are adding new props to global scope of nodejs.
 * This is not the best practice, as we can simply use a class and reuse them.
 * But this is for educational purpose.
 */

/**
 * Whereas global contains all the properties that are declared globally, this cannot be known before hand by typescript.
 * So all we can do is add these properties to the global, which is what we are doing.
 * The 'declare' keyword is a TypeScript-specific feature that tells the compiler about types that exist at runtime,
 * but doesn't generate any JavaScript code. It serves two purposes here:
 * 1. Type augmentation: Adding to existing types (like we do with Express Request)
 * 2. Property declaration: Creating new global properties (like validUserData and getLoginCookie)
 *
 * This is also an example of an ambient declaration - telling TypeScript about code that exists at runtime
 * but isn't defined in the TypeScript code itself. Ambient declarations are commonly used for:
 * - External JavaScript libraries
 * - Global variables that exist in the runtime environment
 * - Properties that will be added to the global scope
 */
declare global {
  // eslint-disable-next-line no-var
  var validUserData: RegisterUserRequest;
  // eslint-disable-next-line no-var
  var getLoginCookie: (userId?: string) => string[];
  // eslint-disable-next-line no-var
  var createTicket: (userId?: string) => Promise<TicketDocument>;
}
