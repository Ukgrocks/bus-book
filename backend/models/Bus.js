import mongoose from 'mongoose';  // Use ES module syntax

const busSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    totalSeats: {
        type: Number,
        required: true,
    },
    currentOccupancy: {
        type: Number,
        default: 0,
    },
    typeofbus:{
        type:String,
        required:true
    },
    fair:{
        type: Number,
        required: true
    },
    hours:{
        type: Number,
        required: true
    },
    
        from: { type: String, required: true },

        to: { type: String, required: true },
        
        departure :{type:Number, required: true},
        arrival: {type:Number, required: true}
    
});

// Export the Bus model using ES module syntax
const Bus = mongoose.model('Bus', busSchema);
export default Bus;
