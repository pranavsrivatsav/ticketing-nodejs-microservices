import { Request, Response } from "express";
import { VerifyRazorpayPaymentRequestModel } from "../models/CaptureRazorpayPaymentRequestModel";
import Order from "../models/Order";
import { BadRequestError, NotFoundError, UnauthorizedRequest } from "@psctickets/common/errors";
import { verifyPayment, getOrderPaymentDetails } from "../services/razorpayService";

export async function verifyPaymentHandler(req: Request, res: Response) {
  const payload = req.body as VerifyRazorpayPaymentRequestModel;
  const orderId = req.params.orderId;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError("Unable to find order with orderId " + orderId);
  }

  if (order.userId !== req.currentUser.userId) {
    throw new UnauthorizedRequest("Unauthorized request");
  }

  const response = await verifyPayment(order, payload);

  res.send(response);
}

export async function getPgDetailsHandler(req: Request, res: Response) {
  const orderId = req.params.orderId;

  if (!orderId) throw new BadRequestError("Order id must be provided as query param");

  const order = await Order.findById(orderId);

  if (!order) throw new NotFoundError(`Order with id ${orderId} not found`);

  if (order.userId !== req.currentUser?.userId)
    throw new UnauthorizedRequest("Unauthorized Request");

  res.send({
    orderId: order.id,
    rzpOrderId: order.pgDetails?.pgOrderId,
  });
}

export async function getOrderPaymentDetailsHandler(req: Request, res: Response) {
  const orderId = req.params.orderId;

  if (!orderId) throw new BadRequestError("Order id must be provided");

  const order = await Order.findById(orderId);

  if (!order) throw new NotFoundError(`Order with id ${orderId} not found`);

  if (order.userId !== req.currentUser?.userId)
    throw new UnauthorizedRequest("Unauthorized Request");

  // Get JWT token from session for internal service call
  const jwtToken = req.session?.jwt;
  if (!jwtToken) {
    throw new UnauthorizedRequest("JWT token not found in session");
  }

  const payment = await getOrderPaymentDetails(orderId, jwtToken);

  if (!payment) throw new NotFoundError(`Payment details not found for order ${orderId}`);

  res.send(payment);
}
