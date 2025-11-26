export interface VerifyRazorpayPaymentRequestModel {
  rzpOrderId: string;
  rzpPaymentId: string;
  rzpSignature: string;
}
