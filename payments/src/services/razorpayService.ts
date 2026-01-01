import { Orders } from "razorpay/dist/types/orders";
import { OrderDocument } from "../models/Order";
import { razorpay } from "../razorpay/Razorpay";
import { VerifyRazorpayPaymentRequestModel } from "../models/CaptureRazorpayPaymentRequestModel";
import RazorpayPayment, { RzpPaymentDocument } from "../models/RazorpayPayments";
import { PaymentSuccessPublisher } from "../events/PaymentSuccessPublisher";
import { natsWrapper } from "../events/NatsWrapper";
import axios from "axios";
import { NotFoundError } from "@psctickets/common/errors";
import { OrderResponse } from "../types/OrderResponse";

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
    // check if payment captured - else capture it
    console.log("fetching payment for paymentId", payload.rzpPaymentId);
    let payment = await razorpay.payments.fetch(payload.rzpPaymentId);
    console.log("payment", payment);

    if (payment.status !== "captured") {
      console.log(`capturing payment for orderId ${order.id}`);
      payment = await capturePayment(order, payload.rzpPaymentId);
    }

    // Add entry into payment collection
    let rzpPayment: RzpPaymentDocument | null = await RazorpayPayment.findOne({
      rzpPaymentId: payload.rzpPaymentId,
    });

    console.log("found rzpdoc", rzpPayment);

    if (!order.pgDetails) {
      throw new Error("Razorpay order ID not found for order " + order.id);
    }

    const pgOrderId = order.pgDetails.pgOrderId;

    if (!rzpPayment) {
      rzpPayment = RazorpayPayment.buildRazorpayPayment({
        order,
        rzpOrderId: pgOrderId,
        rzpPaymentId: payload.rzpPaymentId,
        status: payment.status,
        paymentMadeAt: new Date(),
      });

      console.log("created rzpPayment", rzpPayment);

      await rzpPayment.save();
    }

    console.log(rzpPayment);

    await new PaymentSuccessPublisher(natsWrapper.client).publish({
      orderId: order.id,
      rzpPaymentId: payload.rzpPaymentId,
      rzpOrderId: pgOrderId,
    });

    console.log(`Payment success event published for orderId: ${order.id}`);

    return rzpPayment.populate("order");
  } catch (error) {
    throw new Error(
      `Unable to verify payment for orderId ${order.id} - payload - ` + JSON.stringify(payload)
    );
  }
}

export async function getOrderPaymentDetails(orderId: string, jwtToken: string) {
  // Get payment details from database
  const payment = await RazorpayPayment.findOne({ order: orderId }).populate("order");

  console.log("payment", payment);

  if (!payment) {
    throw new NotFoundError(`Payment details not found for order ${orderId}`);
  }

  // Make API call to orders service to get order details with ticket information
  const ordersServiceUrl = process.env.ORDERS_SERVICE_URL || "http://orders-svc:3000";

  try {
    const orderResponse = await axios.get<OrderResponse>(
      `${ordersServiceUrl}/api/orders/${orderId}`,
      {
        headers: {
          "x-internal-api-key": process.env.INTERNAL_API_KEY || "",
          "x-jwt-token": jwtToken,
        },
      }
    );

    const order = orderResponse.data;
    const ticketId = order.ticket.id;
    const ticketTitle = order.ticket.title;
    const ticketPrice = order.ticket.price;

    // Combine payment details with order ticket information
    const paymentDetails = payment.toJSON();
    const combinedResponse = {
      ...paymentDetails,
      order: {
        id: order.id,
        status: order.status,
        price: ticketPrice,
      },
      ticket: {
        id: ticketId,
        title: ticketTitle,
      },
    };

    return combinedResponse;
  } catch (error) {
    console.error("Error fetching order details from orders service:", error);
    throw new Error(`Unable to fetch order details for order ${orderId}`);
  }
}
