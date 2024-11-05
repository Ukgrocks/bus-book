import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SaveBus = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    totalSeats: '',
    hours: 0,
    typeofbus: '',
    fair: '',
    from: '',
    to: '',
    departure: '',
    arrival: ''
  });
  const navigate = useNavigate();
  // State to manage success and error messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = ['departure', 'arrival', 'totalSeats', 'hours', 'fair'].includes(name) ? Number(value) : value;

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  // Validate form data
  const validateForm = () => {
    const { name, totalSeats, hours, typeofbus, fair, from, to, departure, arrival } = formData;
    if (!name || !totalSeats || !hours|| !typeofbus || !fair || !from || !to || !departure || !arrival) {
      setErrorMessage('Please fill in all required fields.');
      return false;
    }
    setErrorMessage(''); // Clear error if all fields are valid
    return true;
  };

  // Submit data to the server
  const submitData = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) return; // Stop if form is invalid

    try {
      const response = await fetch('http://localhost:5000/api/admin/bus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Bus details saved successfully:', data);
        setSuccessMessage('Information saved successfully!');
        setErrorMessage(''); // Clear error message on success

        // Clear the form
        setFormData({
          name: '',
          totalSeats: '',
          hours: 0,
          typeofbus: '',
          fair: '',
          from: '',
          to: '',
          departure: '',
          arrival: ''
        });
      } else {
        console.error('Failed to save bus details:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving bus details:', error);
    }
  };

  const handleDash = () =>{
   
    navigate('/admin');
  }
  return (
    <>
      <nav className="bg-blue-600 p-4 shadow-lg text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bus Save</h1>
        <button
          onClick={handleDash}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold"
        >
          Go to Dashboard
        </button>
      </nav>
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <form onSubmit={submitData} className="max-w-4xl bg-white p-6 rounded-lg shadow-lg grid grid-cols-2 gap-4">
      {errorMessage && (
          <p className="col-span-2 text-red-600 font-semibold text-center mt-2">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="col-span-2 text-green-600 font-semibold text-center mt-2">{successMessage}</p>
        )}
        <h2 className="col-span-2 text-xl font-bold">Bus Information</h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Bus Name</span>
          </label>
          <input 
            type="text" 
            name="name" 
            placeholder="Enter bus name" 
            className="input input-bordered w-full" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Total Seats</span>
          </label>
          <input 
            type="number" 
            name="totalSeats" 
            placeholder="Total seats available" 
            className="input input-bordered w-full" 
            value={formData.totalSeats} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Estimated Journey Time(Hours)</span>
          </label>
          <input 
            type="number" 
            name="hours" 
            placeholder="Seats currently occupied" 
            className="input input-bordered w-full" 
            value={formData.hours} 
            onChange={handleChange} 
            min="1" 
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Type of Bus</span>
          </label>
          <select 
            name="typeofbus" 
            className="input input-bordered w-full" 
            value={formData.typeofbus} 
            onChange={handleChange} 
            required
          >
            <option value="" disabled>Select bus type</option>
            <option value="Private Bus">Private</option>
            <option value="Luxury Bus">Luxury</option>
            <option value="Government Bus">Government</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Fare</span>
          </label>
          <input 
            type="number" 
            name="fair" 
            placeholder="Fare for the trip" 
            className="input input-bordered w-full" 
            value={formData.fair} 
            onChange={handleChange} 
            required 
          />
        </div>

        <h2 className="col-span-2 text-xl font-bold mt-4">Route Information</h2>
        <div className="form-control">
  <label className="label">
    <span className="label-text">Route From</span>
  </label>
  <select 
    name="from" 
    className="select select-bordered w-full" 
    value={formData.from} 
    onChange={handleChange} 
    required
  >
    <option value="" disabled>Select starting location</option>
              <option value="Agra">Agra</option>
              <option value="Indore">Indore</option>
              <option value="Delhi">Delhi</option>
              <option value="Amritsar">Amritsar</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Patna">Patna</option>
    {/* Add more options as needed */}
  </select>
</div>

<div className="form-control">
  <label className="label">
    <span className="label-text">Route To</span>
  </label>
  <select 
    name="to" 
    className="select select-bordered w-full" 
    value={formData.to} 
    onChange={handleChange} 
    required
  >
    <option value="" disabled>Select destination</option>
    <option value="Mumbai">Mumbai</option>
              <option value="Varanasi">Varanasi</option>
              <option value="Delhi">Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mysore">Mysore</option>
              <option value="Kolkata">Kolkata</option>
    {/* Add more options as needed */}
  </select>
</div>


        <div className="form-control">
          <label className="label">
            <span className="label-text">Departure Time</span>
          </label>
          <input 
            type="number" 
            name="departure" 
            className="input input-bordered w-full" 
            value={formData.departure} 
            min={0}
            max={24}
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Arrival Time</span>
          </label>
          <input 
            type="number" 
            name="arrival" 
            className="input input-bordered w-full" 
            value={formData.arrival} 
            min={0}
            max={24}
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-control col-span-2 mt-4">
          <button type="submit" className="btn btn-primary w-full">Save Bus Details</button>
        </div>

        
      </form>
    </div>
    </>
  );
};

export default SaveBus;
