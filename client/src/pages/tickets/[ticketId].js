import api from '@/services/axiosInterceptors';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'

function ticketDetails() {
  const router = useRouter();
  const ticketId = router.query.ticketId;
  console.log("ticketId" ,ticketId)
  const [ticket, setTicket] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        console.log("fetching ticket details")
        const response = await api.get(`/api/tickets/${ticketId}`);
        console.log("response", response)
        setTicket(response.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    }
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const onBuyHandler = useCallback(async ()=>{
    try {
      setPurchasing(true);
      //create new order
      const response = await api.post("/api/orders", {
        ticketId
      })

      
      const orderId = response.data.id
      sessionStorage.setItem(`order${orderId}`, JSON.stringify(response.data));

      //push to checkout with orderId
      router.push("/checkout/[orderId]", `/checkout/${orderId}`)
    } catch (error) {
      let errorMessage = "Failed to create order. Please try again.";
      console.log("Error creating order:", errorMessage);
      alert(errorMessage);
    } finally {
      setPurchasing(false);
    }
  }, [ticketId, router])

  const renderLoading = () => {
    return <div className="container mt-5">Loading...</div>
  }

  const renderPurchasedMessage = () => {
    return (
      <div className="alert alert-info" role="alert">
        This ticket is already purchased.
      </div>
    )
  }

  const renderReservedMessage = () => {
    return (
      <div className="alert alert-warning" role="alert">
        This ticket is currently reserved.
      </div>
    )
  }

  const renderBuyButton = () => {
    return (
      <button 
        onClick={onBuyHandler}
        disabled={purchasing}
        className="btn btn-primary"
      >
        {purchasing ? 'Processing...' : 'Buy Ticket'}
      </button>
    )
  }

  const renderTicketAction = () => {
    if (ticket.purchased) {
      return renderPurchasedMessage();
    }
    if (ticket.orderId) {
      return renderReservedMessage();
    }
    return renderBuyButton();
  }

  const renderTicketContent = () => {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title mb-4">{ticket.title}</h1>
            <p className="card-text mb-4">
              <strong>Price:</strong> ${ticket.price}
            </p>
            {renderTicketAction()}
          </div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return renderLoading();
  }
  
  return renderTicketContent();
}

export default ticketDetails