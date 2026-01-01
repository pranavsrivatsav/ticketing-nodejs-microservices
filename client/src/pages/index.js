import api from "@/services/axiosInterceptors";
import Link from "next/link";
import React from "react";

const getTicketStatus = (ticket) => {
  if (ticket.orderId) {
    if (ticket.purchased) {
      return "Purchased";
    }
    return "Reserved";
  }
  return "Available";
};

const renderEmptyState = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <p>No tickets available</p>
    </div>
  );
};

const renderTicketRow = (ticket) => {
  return (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>${ticket.price}</td>
      <td>{getTicketStatus(ticket)}</td>
      <td>
        <Link href="tickets/[ticketId]" as={`tickets/${ticket.id}`}>
          Link
        </Link>
      </td>
    </tr>
  );
};

const renderTicketsTable = (tickets) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Status</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>{tickets.map(renderTicketRow)}</tbody>
    </table>
  );
};

function index({ user, tickets }) {
  console.log("index", tickets);
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Available Tickets</h1>
      {!tickets || tickets.length === 0
        ? renderEmptyState()
        : renderTicketsTable(tickets)}
    </div>
  );
}

index.getInitialProps = async (context) => {
  console.log("index.getInitialProps");
  const request = context?.ctx?.req;
  try {
    const { data } = await api.get("/api/tickets", {
      headers: request?.headers,
    });
    return { tickets: data.tickets };
  } catch (error) {
    console.error(error);
  }
};

export default index;
