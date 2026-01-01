import api from "@/services/axiosInterceptors";
import Link from "next/link";
import React from "react";

function orders({ user, orders }) {
  console.log("orders", orders);
  return (
    <div className="container mt-5">
      <h1 className="mb-4">My Orders</h1>
      {!orders || orders.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <p>No orders found</p>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Ticket Title</th>
              <th>Price</th>
              <th>Status</th>
              <th>Expires At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const expiresAt = order.expiresAt
                ? new Date(order.expiresAt).toLocaleString()
                : "N/A";
              return (
                <tr key={order.id || order._id}>
                  <td>{order.id || order._id}</td>
                  <td>
                    {order.ticket?.id || order.ticket?._id ? (
                      <Link
                        href="/tickets/[ticketId]"
                        as={`/tickets/${order.ticket.id || order.ticket._id}`}
                      >
                        {order.ticket?.title || "N/A"}
                      </Link>
                    ) : (
                      order.ticket?.title || "N/A"
                    )}
                  </td>
                  <td>${order.ticket?.price || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "SUCCESS"
                          ? "bg-success"
                          : order.status === "CANCELLED"
                          ? "bg-danger"
                          : order.status === "ACTIVE"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === "success" || order.status === "SUCCESS"
                      ? "N/A"
                      : expiresAt}
                  </td>
                  <td>
                    {order.status === "success" || order.status === "SUCCESS" ? (
                      <Link
                        href="/orders/[orderId]"
                        as={`/orders/${order.id || order._id}`}
                      >
                        <button className="btn btn-sm btn-primary">View</button>
                      </Link>
                    ) : (
                      <Link
                        href="/checkout/[orderId]"
                        as={`/checkout/${order.id || order._id}`}
                      >
                        <button className="btn btn-sm btn-primary">Pay</button>
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

orders.getInitialProps = async (context) => {
  console.log("orders.getInitialProps");
  const request = context?.ctx?.req;
  try {
    const { data } = await api.get("/api/orders", {
      headers: request?.headers,
    });
    return { orders: data };
  } catch (error) {
    console.error(error);
    return { orders: [] };
  }
};

export default orders;
