import api from "@/services/axiosInterceptors";
import Router from "next/router";
import React, { useCallback, useState } from "react";

function newTicket(headers) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const onSubmitHandler = useCallback(async (e) => {
    e.preventDefault();
    const response = await api.post("/api/tickets", {
      title,
      price
    })
    Router.push(`/tickets/${response.data.id}`)
  }, [title, price])

  return (
    <div className="container mt-5">
      <h1>Create a ticket</h1>
      <form className="container">
        <div class="mb-3 row col-md-6">
          <label for="title" class="form-label">
            Title
          </label>
          <input
            type="text"
            class="form-control"
            id="title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        <div class="mb-3 row col-md-6">
          <label for="price" class="form-label">
            Price
          </label>
          <input
            type="text"
            class="form-control"
            id="price"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></input>
        </div>
        <button className="btn btn-primary" onClick={onSubmitHandler}>Submit</button>
      </form>
    </div>
  );
}

export default newTicket;
