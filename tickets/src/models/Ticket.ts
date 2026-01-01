import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Define the attributes required to create a new user
export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  purchased?: boolean;
}

// Interface holding the type of the document returned by the Ticket Model
export interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  purchased: boolean;
  version: number;
}

// Define the custom model interface that extends mongoose.Model
// This allows us to add custom static methods to the model
interface TicketModel extends mongoose.Model<TicketDocument> {
  //custom static method to create a new ticket
  buildTicket(attrs: TicketAttrs): TicketDocument;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: false,
    },
    purchased: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    toJSON: {
      transform: TicketTransform,
    },
  }
);
TicketSchema.plugin(updateIfCurrentPlugin);
TicketSchema.set("versionKey", "version");

function TicketTransform(Doc: TicketDocument, ret: any) {
  ret.id = Doc._id;
  delete ret._id;
  return ret;
}

TicketSchema.statics.buildTicket = function (attrs: TicketAttrs): TicketDocument {
  return new Ticket(attrs);
};

//Create the ticket model using the schema and the document model
const Ticket = mongoose.model<TicketDocument, TicketModel>("Ticket", TicketSchema);

export default Ticket;
