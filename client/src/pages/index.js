import api from "@/services/axiosInterceptors";
import Link from "next/link";
import React from "react";

function index({ user, tickets }) {
  console.log("index", tickets);
  return (
    <div className="container mt-5">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {tickets?.length > 0 &&
            tickets?.map((ticket) => {
              return (
                <tr id={ticket.id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.price}</td>
                  <td>
                    <Link
                      href="tickets/[ticketId]"
                      as={`tickets/${ticket.id}`}
                    >Link</Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
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
