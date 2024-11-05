import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [buses, setBuses] = useState([]); // State to store fetched bus data

  // Fetch bus data based on selected locations
  const checkBuses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/bus/find', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to }), // Send from and to in the request body
      });
      
      if (response.ok) {
        const data = await response.json();
        setBuses(data); // Set fetched data to buses state
      } else {
        console.error('Failed to fetch bus data');
      }
    } catch (error) {
      console.error('Error fetching bus data:', error);
    }
  };

  // const handlebooking = () => {

  //   const dataToSend = {busid:bus._id};

  //   navigate('/book', { state: dataToSend }); // Pass data as state object

  // }

  return (
    <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 my-[8ch]">
      <div className="w-full bg-neutral-100 rounded-md dark:bg-neutral-900/40 p-8">
        <div className="grid grid-cols-3 gap-x-10 gap-y-12 items-end">
          <div>
            <label htmlFor="from" className="block mb-2 font-semibold">
              From
            </label>
            <select
              name="from"
              id="from"
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="">Select Location</option>
              <option value="Agra">Agra</option>
              <option value="Indore">Indore</option>
              <option value="Delhi">Delhi</option>
              <option value="Amritsar">Amritsar</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Patna">Patna</option>
            </select>
          </div>

          <div>
            <label htmlFor="to" className="block mb-2 font-semibold">
              To
            </label>
            <select
              name="to"
              id="to"
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">Select Location</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Varanasi">Varanasi</option>
              <option value="Delhi">Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mysore">Mysore</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          <div>
            <button
              onClick={checkBuses}
              className="w-full px-4 h-12 bg-violet-700 text-neutral-50 text-base font-normal rounded-md"
            >
              Check Availability
            </button>
          </div>
        </div>

        {/* Display the list of available buses */}
        <div className="mt-8 max-w-3xl mx-auto">
  {buses.length > 0 ? (
    <ul className="space-y-4">
      {buses.map((bus) => {
        // Determine background color based on occupancy
        const occupancyRate = (bus.currentOccupancy / bus.totalSeats);
        let bgColor = '';

        if (occupancyRate === 1) {
          bgColor = 'bg-red-400'; // Fully booked
        } else if (occupancyRate >= 0.5) {
          bgColor = 'bg-yellow-400'; // Half full
        } else {
          bgColor = 'bg-green-300'; // Plenty of seats
        }

        return (
          <li
            key={bus.id}
            className={`rounded-lg flex justify-between items-center p-6 transition-transform transform hover:scale-105 ${bgColor} dark:${occupancyRate === 1 ? 'bg-red-800' : occupancyRate >= 0.5 ? 'bg-yellow-800' : 'bg-green-800'}`}
          >
            <div>
           
            <h2 className="text-xl font-bold text-gray-600 dark:text-gray-900">{bus.name}</h2>
           
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{bus.typeofbus}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seats: {bus.totalSeats} | Booked: {bus.currentOccupancy}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Departure: {bus.departure} | Arrival: {bus.arrival} | Time:{bus.hours} hours
              </p> 
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-700 ">
                Fare Per Seat : ₹{bus.fair} 
              </p>
              <h6 className="text-xl font-bold text-gray-800 ">Operational Everyday</h6>
            </div>
           
            <button
              onClick={() => {
                const dataToSend = {
                  busid: bus._id,
                  start: bus.from,
                  end: bus.to,
                  fair: bus.fair,
                  departure: bus.departure,
                  arrival: bus.arrival,
                };
                navigate('/book', { state: dataToSend });
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200"
            >
              Book
            </button>
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-center text-gray-500 mt-6">No buses available for the selected route.</p>
  )}
</div>



      </div>
    </div>
  );
};

export default Search;
