import React, { useState } from "react";
import axios from "axios";

const EmailInput = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post("/api/send-email", { email });
    console.log(response.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EmailInput;
