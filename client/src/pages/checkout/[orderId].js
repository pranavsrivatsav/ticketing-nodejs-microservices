import api from "@/services/axiosInterceptors";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

function checkout() {
  const router = useRouter();
  const orderId = router.query.orderId;
  const [rzpOrderId, setRzpOrderId] = useState();
  const [orderDetails, setOrderDetails] = useState();
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
      handler: function (response) {
        console.log("payment success :" + JSON.stringify(response));
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
  }, [scriptLoaded, orderDetails, rzpOrderId]);

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
  }, []);

  const onPaymentClickHandler = useCallback((e)=>{
    console.log("payment button clicked");
    rzpInstance.open();
    rzpInstance.on("payment.failed", function (response) {
      console.log("payment failied :" + JSON.stringify(response));
    });
    e.preventDefault();
  }, [rzpInstance])

  if (!orderDetails) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading order details...</p>
        </div>
      </div>
    );
  }

  const orderPrice = orderDetails?.ticket?.price || orderDetails?.price || 0;
  const expiresAt = orderDetails.expiresAt
    ? new Date(orderDetails.expiresAt).toLocaleString()
    : "N/A";

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">Order Checkout</h2>
            </div>
            <div className="card-body">
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
                        <td>
                          <span
                            className={`badge ${
                              orderDetails.status === "SUCCESS"
                                ? "bg-success"
                                : orderDetails.status === "CANCELLED"
                                ? "bg-danger"
                                : orderDetails.status === "ACTIVE"
                                ? "bg-primary"
                                : "bg-secondary"
                            }`}
                          >
                            {orderDetails.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Expires At:</td>
                        <td>{expiresAt}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={onPaymentClickHandler}
                  disabled={!rzpInstance || !scriptLoaded}
                >
                  {scriptLoaded
                    ? `Pay $${orderPrice.toFixed(2)}`
                    : "Loading payment gateway..."}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default checkout;
