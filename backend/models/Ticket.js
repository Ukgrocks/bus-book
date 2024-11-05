import mongoose from 'mongoose';  // Use ES module syntax

// Define the schema for a ticket
const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  boardingPoint: {
    type: String,
    required: true,
  },
  phoneNumber:{
type:Number,
required:true,
  },
  emailAddress:{
    type: String,
    required: true,
  },
  destinationPoint: {
    type: String,
    required: true,
  },
  numberofticket:{
    type: Number,
    required: true,
  },
  totalFare: {
    type: Number,
    required: true,
  },
  busTravelProviderName: {
    type: String,
    required: true,
  },
  dateOfBooking: {
    type: Date,
    required: true, // Make this required to ensure every ticket has a booking date
  },
});

// Create and export the model
const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
