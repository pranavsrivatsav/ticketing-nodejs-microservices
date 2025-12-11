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
      amount: orderDetails.price*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
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

      if (!orderDetails) {
        orderDetails = await api.get(`/api/orders/${orderId}`);
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

  return (<div>
    <h1>checkout</h1>

    <button className="btn btn-primary" onClick={onPaymentClickHandler}>Pay now</button>
    </div>);
}

export default checkout;
