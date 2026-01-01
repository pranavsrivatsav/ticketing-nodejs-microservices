import api from "@/services/axiosInterceptors";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

function checkout() {
  const router = useRouter();
  const orderId = router.query.orderId;
  const [rzpOrderId, setRzpOrderId] = useState();
  const [orderDetails, setOrderDetails] = useState();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const rzpInstance = useMemo(() => {
    if (!scriptLoaded) return;

    const options = {
      key: "rzp_test_RicJRphzXyJOPL", // Enter the Key ID generated from the Dashboard
      amount: (orderDetails?.ticket?.price || orderDetails?.price || 0) * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: rzpOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (rzpResponse) {
        try {
          setProcessing(true);
          const verifyResponse = await api.post(`/api/payments/razorpay/${orderId}/verify`, {
            rzpPaymentId: rzpResponse.razorpay_payment_id,
          });
          console.log("payment success :" + JSON.stringify(verifyResponse));
          router.push(`/orders/${orderId}`);
        } catch (error) {
          console.error("Error verifying payment:", error);
        } finally {
          setProcessing(false);
        }
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpInstance = new window.Razorpay(options);

    return rzpInstance;
  }, [scriptLoaded, orderDetails, rzpOrderId, orderId, router]);

  //useEffect to get order and pg details
  useEffect(() => {
    if (!orderId) return;
    (async () => {
      // get and set order details
      let orderDetails = sessionStorage.getItem(`order${orderId}`);

      if (orderDetails) {
        // Parse if it's a string from sessionStorage
        orderDetails = JSON.parse(orderDetails);
      } else {
        const response = await api.get(`/api/orders/${orderId}`);
        orderDetails = response.data;
      }

      setOrderDetails(orderDetails);

      //get and set pg details
      const pgDetails = await api.get(
        `/api/payments/razorpay/${orderId}/pgDetails`
      );

      const rzpOrderId = pgDetails.data?.rzpOrderId;
      setRzpOrderId(rzpOrderId);
    })();
  }, [orderId]);

  // use effect to load pg script
  useEffect(() => {
    if (scriptLoaded) return;

    // create script element with razorpay src
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      const isClient = typeof window !== "undefined";
      const isRazorPayAvailable = isClient && "Razorpay" in window;
      setScriptLoaded(isRazorPayAvailable);
    };

    // Optional: Add an onerror event listener for when the script fails to load
    script.onerror = (error) => {
      console.error("Error loading script:", error);
    };

    // Append the script to the document body or head
    document.body.appendChild(script);
    // or document.head.appendChild(script);

    // Clean up function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [scriptLoaded]);

  const onPaymentClickHandler = useCallback((e) => {
    console.log("payment button clicked");
    rzpInstance.open();
    rzpInstance.on("payment.failed", function (response) {
      console.log("payment failied :" + JSON.stringify(response));
    });
    e.preventDefault();
  }, [rzpInstance]);

  // Render functions
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

  const renderProcessingOverlay = () => {
    if (!processing) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div className="text-center bg-white p-5 rounded shadow-lg">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Processing...</span>
          </div>
          <p className="mb-0 fw-bold">Processing payment...</p>
          <p className="text-muted small mt-2">Please wait while we verify your payment</p>
        </div>
      </div>
    );
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

  const renderOrderDetailsTable = () => {
    const orderPrice = orderDetails?.ticket?.price || orderDetails?.price || 0;
    const expiresAt = orderDetails.expiresAt
      ? new Date(orderDetails.expiresAt).toLocaleString()
      : "N/A";

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
                <td>{orderDetails.id || orderDetails._id}</td>
              </tr>
              <tr>
                <td className="fw-bold">Ticket Title:</td>
                <td>{orderDetails.ticket?.title || "N/A"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Price:</td>
                <td className="fs-5 text-success fw-bold">
                  ${orderPrice.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="fw-bold">Status:</td>
                <td>{renderStatusBadge(orderDetails.status)}</td>
              </tr>
              <tr>
                <td className="fw-bold">Expires At:</td>
                <td>{expiresAt}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPaymentButton = () => {
    const orderPrice = orderDetails?.ticket?.price || orderDetails?.price || 0;

    return (
      <div className="d-grid gap-2 mt-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={onPaymentClickHandler}
          disabled={!rzpInstance || !scriptLoaded || processing}
        >
          {scriptLoaded
            ? `Pay $${orderPrice.toFixed(2)}`
            : "Loading payment gateway..."}
        </button>
      </div>
    );
  };

  const renderCheckoutCard = () => (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">Order Checkout</h2>
            </div>
            <div className="card-body">
              {renderOrderDetailsTable()}
              {renderPaymentButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!orderDetails) {
    return renderLoadingState();
  }

  return (
    <>
      {renderCheckoutCard()}
      {renderProcessingOverlay()}
    </>
  );
}

export default checkout;
