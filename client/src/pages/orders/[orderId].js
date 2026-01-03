import api from "@/services/axiosInterceptors";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIntervalWithTimeout } from "@/hooks/useIntervalWithTimeout";

function OrderDetails() {
  const router = useRouter();
  const { orderId } = router.query;

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reset state when orderId changes
  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    setPaymentDetails(null);
  }, [orderId]);

  // Poll for payment details until payment is complete or timeout
  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(null);

    const fetchPaymentDetails = async () => {
      try {
        const res = await api.get(
          `/api/payments/razorpay/${orderId}/paymentDetails`
        );
        setPaymentDetails(res.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch payment details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getOrderStatus = () => {
    if (paymentDetails?.order?.status) {
      return paymentDetails.order.status;
    }
    return "N/A";
  };

  const getAmountPaid = () => {
    return paymentDetails?.order?.price || 0;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      case "ACTIVE":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  const renderStatusBadge = (status) => (
    <span className={`badge ${getStatusBadgeClass(status)}`}>
      {status}
    </span>
  );

  const renderErrorState = () => (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h2 className="text-danger mb-3">Error</h2>
              <p className="text-muted">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="container mt-5">
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading order details...</p>
      </div>
    </div>
  );

  const renderOrderDetailsTable = () => {
    const amountPaid = getAmountPaid();

    return (
      <div className="mb-4">
        <h4 className="text-muted mb-3">Order Details</h4>
        <div className="table-responsive">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="fw-bold" style={{ width: "40%" }}>
                  Order ID:
                </td>
                <td>{orderId}</td>
              </tr>
              <tr>
                <td className="fw-bold">Payment ID:</td>
                <td>{paymentDetails.rzpPaymentId || "N/A"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Payment Made At:</td>
                <td>{formatDate(paymentDetails.paymentMadeAt)}</td>
              </tr>
              <tr>
                <td className="fw-bold">Order Status:</td>
                <td>{renderStatusBadge(getOrderStatus())}</td>
              </tr>
              <tr>
                <td className="fw-bold">Amount Paid:</td>
                <td className="fs-5 text-success fw-bold">
                  ${amountPaid.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTicketDetailsTable = () => {
    const ticketId = paymentDetails.ticket?.id;
    return (
      <div className="mb-4">
        <h4 className="text-muted mb-3">Ticket Details</h4>
        <div className="table-responsive">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="fw-bold" style={{ width: "40%" }}>
                  Ticket ID:
                </td>
                <td>
                  {ticketId ? (
                    <Link href={`/tickets/${ticketId}`}>
                      {ticketId}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
              <tr>
                <td className="fw-bold">Ticket Title:</td>
                <td>{paymentDetails.ticket?.title || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderOrderDetailsCard = () => (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">Order Details</h2>
            </div>
            <div className="card-body">
              {renderOrderDetailsTable()}
              {renderTicketDetailsTable()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return renderErrorState();
  }

  if (loading || !paymentDetails) {
    return renderLoadingState();
  }

  return renderOrderDetailsCard();
}

export default OrderDetails;
