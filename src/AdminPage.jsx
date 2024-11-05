import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './assets/logo.png';

const AdminPage = () => {
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [busInfo, setBusInfo] = useState([]);
  const [ticketInfo, setTicketInfo] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch ticket stats and bus info
  const fetchTicketStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/alltickets');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const ticketData = await response.json();
      setTicketInfo(ticketData);
      setTotalTickets(ticketData.length);

      // Calculate total revenue
      const revenue = ticketData.reduce((acc, ticket) => acc + ticket.totalFare, 0);
      setTotalRevenue(revenue);
    } catch (err) { 
      setError('Failed to load ticket stats');
    }
  };

  const fetchBusInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/allbuses');
      const data = await response.json();
      setBusInfo(data);
    } catch (err) {
      setError('Failed to load bus info');
    }
  };

  useEffect(() => {
    fetchTicketStats();
    fetchBusInfo();
  }, []);

  const cancelbus = async (busId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/bus/${busId}`, {
        method: 'DELETE',
      });
      fetchBusInfo();  // Refresh bus info after deletion
    } catch (err) {
      setError('Failed to delete bus info');
    }
  };

  const cancelticket = async (ticketId) => {
    try {
      await fetch('http://localhost:5000/api/admin/cancelticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }), // Send ticketId in the request body
      });
      fetchTicketStats();  // Refresh ticket info after deletion
    } catch (err) {
      setError('Failed to delete ticket info');
    }
  };
  
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const addbus = () => {
    navigate('/savebus');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 shadow-lg text-white flex justify-between items-center">
        <img src={Logo} alt="logo" className="w-28 h-auto object-contain" />
        <div className="flex gap-4">
          <button onClick={addbus} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold">
            Add Bus
          </button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to the GBus Dashboard</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Tickets Booked */}
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Tickets Booked : {totalTickets}</h2>
            <ul className="flex flex-col space-y-6 p-4 overflow-y-auto h-96">
              {ticketInfo.length ? (
                ticketInfo.map((ticket, index) => (
                  <li key={index} className="bg-white border border-gray-200 shadow-lg rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-600 mb-2">{ticket.customerName}</h3>
                    <p className="text-gray-700"><span className="font-semibold">Route From:</span> {ticket.boardingPoint}</p>
                    <p className="text-gray-700"><span className="font-semibold">Route To:</span> {ticket.destinationPoint}</p>
                    <p className="text-gray-700"><span className="font-semibold">Total Seats:</span> {ticket.busTravelProviderName}</p>
                    <p className="text-gray-700"><span className="font-semibold">Number of Tickets:</span> {ticket.numberofticket}</p>
                    <button onClick={() => cancelticket(ticket._id)} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold">Cancel</button>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No Tickets available</p>
              )}
            </ul>
          </div>

          {/* Total Revenue */}
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold">Total Revenue Generated</h2>
            <p className="text-5xl font-bold mt-2">₹{totalRevenue}</p>
          </div>

          {/* Bus Information */}
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Buses Operating</h2>
            <ul className="flex flex-col space-y-6 p-4 overflow-y-auto h-96">
              {busInfo.length ? (
                busInfo.map((bus, index) => (
                  <li key={index} className="bg-white border border-gray-200 shadow-lg rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-600 mb-2">{bus.name}</h3>
                    <p className="text-gray-700"><span className="font-semibold">Route From:</span> {bus.from}</p>
                    <p className="text-gray-700"><span className="font-semibold">Route To:</span> {bus.to}</p>
                    <p className="text-gray-700"><span className="font-semibold">Total Seats:</span> {bus.totalSeats}</p>
                    <p className="text-gray-700"><span className="font-semibold">Type of Bus:</span> {bus.typeofbus}</p>
                    <button onClick={() => cancelbus(bus._id)} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold">Cancel</button>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No buses available</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
