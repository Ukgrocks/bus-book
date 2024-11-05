import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Bus from "./assets/bus4.png";  // Default government bus image
import Bus1 from "./assets/bus1.png";  // Luxury bus image
import Bus2 from "./assets/bus7.png";  // Private bus image
import jsPDF from 'jspdf';
import logo from './assets/logo.png';
import { FaStar } from 'react-icons/fa';
import Navbar from './components/navbar/Navbar';

const BookBus = () => {
  const { busId } = useParams();
  const [bus, setBus] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [message, setMessage] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const location = useLocation();
  const receivedData = location.state;

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/bus/${receivedData.busid}`);
        if (response.ok) {
          const data = await response.json();
          setBus(data);
        } else {
          console.error('Failed to fetch bus details');
        }
      } catch (error) {
        console.error('Error fetching bus details:', error);
      }
    };
    
    fetchBusDetails();
  }, [busId, receivedData.busid]);

  const handleBooking = async () => {
    if (seatsToBook > bus.totalSeats - bus.currentOccupancy) {
      setMessage('Cannot book more seats than available.');
      return;
    }
  
    try {
      const busdataResponse = await fetch(`http://localhost:5000/api/admin/bus/${receivedData.busid}`);
      
      if (!busdataResponse.ok) {
        throw new Error('Failed to fetch bus data');
      }
  
      const busdata = await busdataResponse.json();
      
      const response = await fetch(`http://localhost:5000/api/admin/ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: receivedData.busid,
          seatsToBook,
          customerName,
          phoneNumber,
          emailAddress,
          boardingPoint: busdata.from,
          destinationPoint: busdata.to,
          totalFare: busdata.fair * seatsToBook,
          bookingDate, // Add the booking date to the request body
        }),
      });
  
      if (response.ok) {
        const ticketData = await response.json();
        setMessage('Seats booked successfully! Ticket generated, scroll down to download.');
        setTicketData(ticketData);
        setBus((prevBus) => ({
          ...prevBus,
          currentOccupancy: prevBus.currentOccupancy + seatsToBook,
        }));
        setSeatsToBook(0);
        setCustomerName('');
        setPhoneNumber('');
        setEmailAddress('');
        setBookingDate('');
      } else {
        console.error('Failed to book seats');
      }
    } catch (error) {
      console.error('Error booking seats:', error);
    }
  };
  

  const downloadTicket = () => {
    if (ticketData) {
      const doc = new jsPDF();
  
      // Add logo
      const imgData = logo; // Use the imported logo
     // Adjust logo position and size
     
      // Set background color
      doc.setFillColor(240, 240, 240); // Light grey background
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
      doc.text('Ticket Confirmation', 75, 40);
      // Set title
      // doc.setFontSize(24);
      doc.setTextColor(40, 40, 40); // Dark color
      // doc.text('Ticket Confirmation', 15, 40);
  
      // Set font for ticket details
      doc.setFontSize(12);
      // doc.setTextColor(60, 60, 60); // Dark grey
  
      // Ticket details with padding
      const details = [
        { label: 'Ticket ID:', value: ticketData.ticket.ticketId },
        { label: 'Bus:', value: ticketData.ticket.busTravelProviderName },
        { label: 'Customer:', value: ticketData.ticket.customerName },
        { label: 'Boarding Point:', value: ticketData.ticket.boardingPoint },
        { label: 'Destination Point:', value: ticketData.ticket.destinationPoint },
        { label: 'Seats Booked:', value: ticketData.ticket.numberofticket },
        { label: 'Total Fare:', value: `₹${ticketData.ticket.totalFare}` }
      ];
  
      let yPosition = 60; // Start position for the details
  
      details.forEach(({ label, value }) => {
        doc.text(`${label} ${value}`, 15, yPosition);
        yPosition += 10; // Increment y position for next line
      });
      
      // Add footer
      doc.setFontSize(10);
      doc.text('Thank you for booking with us!', 15, yPosition + 20);
      doc.text('For any queries, contact us at support@example.com', 15, yPosition + 30);
      doc.addImage(imgData, 'PNG', 70,  yPosition+50, 50, 30);
      // Save the PDF
      doc.save(`ticket_${ticketData._id}.pdf`);
    }
  };
  
  
  
  

  if (!bus) return <p>Loading bus details...</p>;

  const busImage = bus.typeofbus === 'Government Bus' ? Bus : bus.typeofbus === 'Private Bus' ? Bus1 : Bus2;
  const starRating = bus.typeofbus === 'Government Bus' ? 2 : bus.typeofbus === 'Private Bus' ? 4 : 5;

  return (
    <>
      <Navbar />
      <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[10ch]">
        <div className="w-full grid grid-cols-2 gap-16 items-center">
          <div className="col-span-1 space-y-8">
            <img src={busImage} alt={`${bus.typeofbus} bus`} className="w-full aspect-[3/2] rounded-md object-contain" />
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                {bus.typeofbus}
              </h1>
              <h6 className="text-lg text-neutral-900 dark:text-neutral-50">
                Price per Seat : ₹{bus.fair}
              </h6>
              <div className="flex items-center gap-x-2">
                <div className="flex items-center gap-x-1 text-sm text-yellow-500 dark:text-yellow-600">
                  {[...Array(starRating)].map((_, index) => (
                    <FaStar key={index} />
                  ))}
                </div>
                <p className="text-neutral-900 dark:text-neutral-200 text-sm font-normal">
                  ({starRating}.0)
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1 space-y-10">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">{bus.name} - Book Seats</h2>
              <p>Seats Available: {bus.totalSeats - bus.currentOccupancy}</p>

              <input
                type="number"
                min="1"
                value={seatsToBook}
                onChange={(e) => setSeatsToBook(Number(e.target.value))}
                placeholder='Enter number of seats to reserve'
                className="input input-bordered w-full mt-4"
              />

              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="input input-bordered w-full mt-4"
              />

              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="input input-bordered w-full mt-4"
              />
               
               <input
  type="date"
  value={bookingDate}
  onChange={(e) => setBookingDate(e.target.value)}
  placeholder="Select booking date"
  className="input input-bordered w-full mt-4"
  min={new Date().toISOString().split("T")[0]}  // Setting the minimum date to today's date
/>


              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Enter email address"
                className="input input-bordered w-full mt-4"
              />

            </div>

            <div className="flex">
              <button
                onClick={handleBooking}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Confirm Booking
              </button>
              {message && <p className="mt-4 text-green-600">{message}</p>}
            </div>
          </div>
        </div>

        {/* Ticket Download Section */}
   
        {ticketData ? (
  <div className="mt-8 p-6 bg-white shadow-xl rounded-lg border border-gray-200 w-full max-w-md mx-auto">
    <h2 className="text-2xl font-bold text-center text-primary mb-6">Ticket Confirmation</h2>
    
    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-700 font-semibold">Ticket ID:</span>
      <span className="text-gray-900">{ticketData.ticket.ticketId}</span>
    </div>
    
    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-700 font-semibold">Bus:</span>
      <span className="text-gray-900">{ticketData.ticket.busTravelProviderName}</span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-700 font-semibold">Customer:</span>
      <span className="text-gray-900">{ticketData.ticket.customerName}</span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-700 font-semibold">Boarding Point:</span>
      <span className="text-gray-900">{ticketData.ticket.boardingPoint}</span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-700 font-semibold">Destination Point:</span>
      <span className="text-gray-900">{ticketData.ticket.destinationPoint}</span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-700 font-semibold">Seats Booked:</span>
      <span className="text-gray-900">{ticketData.ticket.numberofticket}</span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-700 font-semibold">Total Fare:</span>
      <span className="text-gray-900">₹{ticketData.ticket.totalFare}</span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-700 font-semibold">Date of Booking:</span>
      <span className="text-gray-900">
        {new Date(ticketData.ticket.dateOfBooking).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    </div>

    <button
      onClick={downloadTicket}
      className="btn btn-primary w-full mt-6"
    >
      Download Ticket
    </button>
  </div>
): (
  <p>Generating ticket details...</p>
)}

  </div>
</>
  );
};

export default BookBus;
