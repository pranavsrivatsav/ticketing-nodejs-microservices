import { Orders } from "razorpay/dist/types/orders";
import { OrderDocument } from "../models/Order";
import { razorpay } from "../razorpay/Razorpay";
import { VerifyRazorpayPaymentRequestModel } from "../models/CaptureRazorpayPaymentRequestModel";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import RazorpayPayment, { RzpPaymentDocument } from "../models/RazorpayPayments";

export async function createRazorpayOrder(order: OrderDocument): Promise<Orders.RazorpayOrder> {
  try {
    const payload: Orders.RazorpayOrderBaseRequestBody = {
      amount: order?.price * 100,
      currency: "INR",
      receipt: `${order.id}--${Date.now()}`,
    };

    const orderCreateResponse = await razorpay.orders.create(payload);
    return orderCreateResponse;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to create razorpay order for order id: " + order.id);
  }
}

export async function capturePayment(order: OrderDocument, paymentId: string) {
  try {
    const updatedPayment = await razorpay.payments.capture(paymentId, order.price * 100, "INR");
    return updatedPayment;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Unable to capture payment for the following request: " +
        JSON.stringify({
          paymentId,
          orderId: order.id,
        })
    );
  }
}

export async function verifyPayment(
  order: OrderDocument,
  payload: VerifyRazorpayPaymentRequestModel
) {
  try {
    validatePaymentVerification(
      {
        order_id: payload.rzpOrderId,
        payment_id: payload.rzpPaymentId,
      },
      payload.rzpSignature,
      "65Axdto5UZfck5HmRP3NlV4C"
    );

    // check if payment captured - else capture it
    let payment = await razorpay.payments.fetch(payload.rzpPaymentId);

    if (payment.status !== "captured") {
      console.log(`capturing payment for orderId ${order.id}`);
      payment = await capturePayment(order, payload.rzpPaymentId);
    }

    // Add entry into payment collection
    let rzpPayment: RzpPaymentDocument | null = await RazorpayPayment.findOne({
      rzpPaymentId: payload.rzpPaymentId,
    });

    console.log("found rzpdoc", rzpPayment);

    if (!rzpPayment) {
      rzpPayment = RazorpayPayment.buildRazorpayPayment({
        order,
        rzpOrderId: payload.rzpOrderId,
        rzpPaymentId: payload.rzpPaymentId,
        status: payment.status,
      });

      console.log("created rzpPayment", rzpPayment);

      await rzpPayment.save();
    }

    console.log(rzpPayment);

    return rzpPayment.populate("order");
  } catch (error) {
    throw new Error(
      `Unable to verify payment for orderId ${order.id} - payload - ` + JSON.stringify(payload)
    );
  }
}
