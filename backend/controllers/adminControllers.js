import Admin from '../models/Admin.js'; // Add .js extension
import Bus from '../models/Bus.js'; 
import Ticket from '../models/Ticket.js'  // Add .js extension
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin login
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    // console.log('Received email:', email, 'Received password:', password); // Log the request data
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ adminId: admin._id }, "secretkey", { expiresIn: "1h" });
        // res.json({ token });
        res.json({ message: "You have successfully signed in", token });

    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Add bus
export const addBus = async (req, res) => {
    try {
        const newBus = new Bus(req.body);
        await newBus.save();
        res.status(201).json({ message: "Bus added successfully", newBus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Fetch buses based on from and to locations
export const getBuses = async (req, res) => {
    const { from, to } = req.body;

    try {
        // Find buses where both "from" and "to" fields match the query parameters
        const buses = await Bus.find({ from, to });

        if (buses.length === 0) {
            return res.status(404).json({ message: "No buses available for the selected route" });
        }

        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update bus details
export const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bus) return res.status(404).json({ message: "Bus not found" });
        res.json(bus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete a bus
export const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) return res.status(404).json({ message: "Bus not found" });
        await Ticket.deleteMany(bus.name);

        res.json({ message: "Bus and ticket deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const addadmin = async (req,res) => {
    const { name, email, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new Admin({ name, email, password: hashedPassword});
        await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully", newAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const fetchBus = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        // Respond with the fetched bus data
        res.json(bus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const bookTicket = async (req, res) => {
    const { busId, seatsToBook, customerName, phoneNumber, emailAddress, boardingPoint, destinationPoint, totalFare, bookingDate } = req.body;

    try {
      // Find the bus by ID and update the occupancy
      const bus = await Bus.findById(busId);
      if (!bus) return res.status(404).json({ message: 'Bus not found' });
  
      // Check seat availability
      const availableSeats = bus.totalSeats - bus.currentOccupancy;
      if (seatsToBook > availableSeats) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }
  
      // Update the bus occupancy
      bus.currentOccupancy += seatsToBook;
      await bus.save();
  
      // Create a new ticket
   
      const ticket = new Ticket({
        ticketId: `TCKT-${Date.now()}`,  // Generate a unique ticket ID
        customerName,
        boardingPoint,
        phoneNumber,
        emailAddress,
        destinationPoint,
        numberofticket:seatsToBook,
        totalFare,
        busTravelProviderName: bus.name,
        dateOfBooking: bookingDate 
      });
      await ticket.save();
  
      res.status(201).json({ message: 'Booking confirmed and ticket generated', ticket });
    } 
    catch (error) {
      console.error('Error processing booking:', error);
      res.status(500).json({ message: 'Error processing booking', error });
    }
    };

    export const allbuses = async (req,res)=>{
        try {
            const buses = await Bus.find(); // Fetch all buses
            res.status(200).json(buses);
          } 
          catch (error) {
            res.status(500).json({ message: 'Failed to fetch buses', error: error.message });
          }
    }

   export const alltickets = async (req,res) =>{
    try {
        const tickets = await Ticket.find(); // Fetch all tickets
    //     const totalTickets = tickets.length; // Count the total number of tickets
    
    //   const totalRevenue = 0;

        res.status(200).json(tickets);
      } 
      catch (error) {
        res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
      }
    }


    export const cancelticket = async (req, res) => {
        const { ticketId } = req.body;
      
        try {
          // Find and delete the ticket
          console.log(ticketId);
          const ticket = await Ticket.findByIdAndDelete(ticketId);
          if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
      
          // Find the associated bus by ID and increment its available seats
          const bus = await Bus.findOne({name:ticket.busTravelProviderName}); // Assuming busId is stored in ticket document
          console.log(bus.name);
          if (!bus) return res.status(404).json({ message: 'Bus not found' });
      
          // Increment available seats by the number of tickets canceled
          bus.currentOccupancy -= ticket.numberofticket; // Assuming numberofticket is in the ticket document
      
          // Save the updated bus document
          
          await bus.save();
      
          res.status(200).json({ message: 'Ticket cancelled and bus seats updated' });
        } catch (error) {
          res.status(500).json({ message: 'Failed to cancel ticket', error: error.message });
        }
      };

      export const fetchticket = async(req,res)=>{
        const { ticketId } = req.body;
        try {
          // Find and return the ticket
          const ticket = await Ticket.find({ticketId});
          if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
          res.status(200).json(ticket);
      }
      catch (error) {
        res.status(500).json({ message: 'Failed to fetch ticket', error: error.message });
      }
    }
      

