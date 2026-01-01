import mongoose from "mongoose";
import { Payments } from "razorpay/dist/types/payments";
import { OrderDocument } from "./Order";

interface RzpPaymentAttrs {
  order: OrderDocument;
  rzpPaymentId: string;
  rzpOrderId: string;
  status: Payments.RazorpayPayment["status"];
  paymentMadeAt?: Date; // Optional for creation, could be set at creation or later
}

// interface for document model
export interface RzpPaymentDocument extends mongoose.Document {
  order: OrderDocument;
  rzpPaymentId: string;
  rzpOrderId: string;
  status: Payments.RazorpayPayment["status"];
  paymentMadeAt?: Date;
}

// Define the custom model interface that extends mongoose.Model
// This allows us to add custom static methods to the model
interface RzpPaymentModel extends mongoose.Model<RzpPaymentDocument> {
  //custom static method to create a new ticket
  buildRazorpayPayment(attrs: RzpPaymentAttrs): RzpPaymentDocument;
}

// schema declaration
const RzpPaymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    rzpPaymentId: {
      type: String,
      required: true,
    },
    rzpOrderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentMadeAt: {
      type: Date,
      required: false,
    },
  },
  {
    toJSON: {
      transform: PaymentTransform,
      versionKey: false,
    },
  }
);

function PaymentTransform(Doc: RzpPaymentDocument, ret: any) {
  ret.id = Doc._id;
  delete ret._id;

  return ret;
}

// buildRzpPayment definition
RzpPaymentSchema.statics.buildRazorpayPayment = function (
  attrs: RzpPaymentAttrs
): RzpPaymentDocument {
  return new RazorpayPayment(attrs);
};

// export model
const RazorpayPayment = mongoose.model<RzpPaymentDocument, RzpPaymentModel>(
  "RazorpayPayment",
  RzpPaymentSchema
);

export default RazorpayPayment;
