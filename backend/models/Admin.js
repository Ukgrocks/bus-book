import mongoose from 'mongoose'; // Use import for mongoose

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Admin name is required'],
  },
  email: {
    type: String,
    required: [true, 'Admin email is required'],
    unique: true, // Email should be unique
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Pre-save hook to hash the password before saving to database
// adminSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next(); // Skip if password is not modified
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt); // Hash the password
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// Method to compare passwords during login
// adminSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Export the Admin model using ES module syntax
const Admin = mongoose.model('Admin', adminSchema);
export default Admin; // Default export
