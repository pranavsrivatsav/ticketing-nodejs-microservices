import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Define the attributes required to create a new user
export interface TicketAttrs {
  id: string;
  title: string;
  price: number;
  userId: string;
  version?: number;
}

// Interface holding the type of the document returned by the Ticket Model
export interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

// Define the custom model interface that extends mongoose.Model
// This allows us to add custom static methods to the model
interface TicketModel extends mongoose.Model<TicketDocument> {
  //custom static method to create a new ticket
  buildTicket(attrs: TicketAttrs): TicketDocument;
  findOneWithVersion(id: string, version: number): Promise<TicketDocument | null>;
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
  const newTicket = new Ticket({ price: attrs.price, title: attrs.title, userId: attrs.userId });
  newTicket._id = new mongoose.Types.ObjectId(attrs.id);

  return newTicket;
};

TicketSchema.statics.findOneWithVersion = async function (id: string, version: number) {
  const ticket = await Ticket.findOne({
    _id: id,
    version: version,
  });

  return ticket;
};

//Create the ticket model using the schema and the document model
const Ticket = mongoose.model<TicketDocument, TicketModel>("Ticket", TicketSchema);

export default Ticket;
