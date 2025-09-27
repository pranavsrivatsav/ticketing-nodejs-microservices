import mongoose from "mongoose";
import { OrderStatus } from "../types/OrderStatus";
import { TicketDocument } from "./Ticket";

// Define the attributes required to create a new order
export interface OrderAttrs {
  userId: string;
  price: number;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

// Interface holding the type of the document returned by the Order Model
export interface OrderDocument extends mongoose.Document {
  userId: string;
  price: number;
  status: OrderStatus;
  expiresAt: Date;
}

// Define the custom model interface that extends mongoose.Model
// This allows us to add custom static methods to the model
interface OrderModel extends mongoose.Model<OrderDocument> {
  //custom static method to create a new ticket
  buildOrder(attrs: OrderAttrs): OrderDocument;
}

// create order schema
const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: OrderTransform,
    },
  }
);

function OrderTransform(Doc: OrderDocument, ret: any) {
  ret.id = Doc._id;
  delete ret._id;

  return ret;
}

// Attach build function to order schema statics
OrderSchema.statics.buildOrder = function (attrs: OrderAttrs): OrderDocument {
  return new Order(attrs);
};

// export order model
const Order = mongoose.model<OrderDocument, OrderModel>("Order", OrderSchema);

export default Order;
