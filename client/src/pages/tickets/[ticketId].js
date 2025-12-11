import api from '@/services/axiosInterceptors';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'

function ticketDetails() {
  const router = useRouter();
  const ticketId = router.query.ticketId;
  console.log("ticketId" ,ticketId)
  const [ticket, setTicket] = useState(null);
  
  useEffect(() => {
    const fetchTicket = async () => {
      console.log("fetching ticket details")
      const response = await api.get(`/api/tickets/${ticketId}`);
      console.log("response", response)
      setTicket(response.data);
    }
    fetchTicket();
  }, [ticketId]);

  const onBuyHandler = useCallback(async ()=>{
    //create new order
    const response = await api.post("/api/orders", {
      ticketId
    })

    
    const orderId = response.data.id
    sessionStorage.setItem(`order${orderId}`, response.data);

    //push to checkout with orderId
    router.push("/checkout/[orderId]", `/checkout/${orderId}`)
  })

  if (!ticket) {
    return <div>Loading...</div>
  }
  return (
    <div className="container mt-5">
      <h1>Ticket Details</h1>
      <p>Title: {ticket.title}</p>
      <p>Price: {ticket.price}</p>
      <button onClick={onBuyHandler}>Buy Ticket</button>
    </div>
  )
}

export default ticketDetails