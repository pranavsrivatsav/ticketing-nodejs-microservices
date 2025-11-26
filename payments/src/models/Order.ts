import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@psctickets/common/orders";
import { PaymentGateways } from "./PaymentGateways";

export interface PgDetails {
  pgName: PaymentGateways;
  pgOrderId: string;
}

// Define the attributes required to create a new order
export interface OrderAttrs {
  id: string;
  userId: string;
  status: OrderStatus;
  price: number;
}

// Interface holding the type of the document returned by the Order Model
export interface OrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
  pgDetails?: PgDetails;
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
    status: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    pgDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  {
    toJSON: {
      transform: OrderTransform,
    },
  }
);
OrderSchema.plugin(updateIfCurrentPlugin);
OrderSchema.set("versionKey", "version");

function OrderTransform(Doc: OrderDocument, ret: any) {
  ret.id = Doc._id;
  delete ret._id;

  return ret;
}

// Attach build function to order schema statics
OrderSchema.statics.buildOrder = function (attrs: OrderAttrs): OrderDocument {
  const retOrder = new Order(attrs);
  retOrder._id = attrs.id;
  return retOrder;
};

// export order model
const Order = mongoose.model<OrderDocument, OrderModel>("Order", OrderSchema);

export default Order;
