import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Ticket = () => {
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Handle input change
  const handleInputChange = (e) => {
    setTicketId(e.target.value);
  };

  const backtohome =()=>{
navigate('/home')
  };
  // Fetch ticket by ID
  const fetchTicket = async () => {
    setMessage('');
    setError('');
    setTicket(null); // Clear previous ticket data
    try {
      const response = await fetch(`http://localhost:5000/api/admin/oneticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Ticket not found');
      }
      // const data = await response.json();
      console.log("Fetched Ticket Data:", data); // Debugging log
      setTicket(data);
    } 
    catch (error) {
      setTicket(null);
      setError(error.message);
      console.error("Error fetching ticket:", error.message); // Debugging log
    }
  };

  // Cancel the ticket
  const cancelTicket = async (ticketId) => {
    setMessage('');
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/cancelticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }), // Send ticketId in the request body
      });
      console.log(response.json());
      if (!response) {
        throw new Error('Failed to cancel ticket');
      }
      setMessage('Ticket canceled successfully.');
      setTicket(null); // Clear the ticket from view after cancellation
    } 
    catch (error) {
      setError(error.message);
      console.error("Error canceling ticket:", error.message); // Debugging log
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">View or Cancel Ticket</h2>
        
        {/* Input for Ticket ID */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Enter Ticket ID</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={ticketId}
            onChange={handleInputChange}
            placeholder="Enter your ticket ID"
          />
        </div>
        
        {/* Fetch Ticket Button */}
        <button onClick={fetchTicket} className="btn btn-primary w-full mb-4">
          Fetch Ticket
        </button>
       
        <button onClick={backtohome} className="btn btn-primary w-full mb-4">
          Back to Home
        </button>
       
        {/* Display ticket information or error */}
        {error && <p className="text-red-600 font-semibold text-center mb-2">{error}</p>}
        {message && <p className="text-green-600 font-semibold text-center mb-2">{message}</p>}

        {ticket ? (
         <div className="mt-6 p-6 border rounded-lg bg-gray-100 shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
         <h3 className="text-2xl font-semibold text-center text-blue-600 mb-6">Ticket Details</h3>
         <div className="space-y-4 text-gray-700">
           <p className="flex justify-between">
             <strong className="text-gray-800">Ticket ID:</strong> <span>{ticket[0].ticketId}</span>
           </p>
           <p className="flex justify-between">
             <strong className="text-gray-800">Passenger Name:</strong> <span>{ticket[0].customerName}</span>
           </p>
           <p className="flex justify-between">
             <strong className="text-gray-800">Bus:</strong> <span>{ticket[0].busTravelProviderName}</span>
           </p>
           <p className="flex justify-between">
             <strong className="text-gray-800">Destination:</strong> <span>{ticket[0].destinationPoint}</span>
           </p>
           <p className="flex justify-between">
             <strong className="text-gray-800">Date of Booking:</strong> <span>
            {new Date(ticket[0].dateOfBooking).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}</span>
           </p>
           <p className="flex justify-between">
             <strong className="text-gray-800">Total Fare:</strong> <span>{ticket[0].totalFare}</span>
           </p>
         </div>
         <button
           onClick={() => cancelTicket(ticket[0]._id)}
           className="btn btn-secondary w-full mt-8 py-2 font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
         >
           Cancel Ticket
         </button>
       </div>
       
        ) : (
          <p className="text-gray-600 text-center mt-4">No ticket details to display</p>
        )}
      </div>
    </div>
  );
};

export default Ticket;
