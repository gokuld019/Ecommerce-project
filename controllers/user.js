import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import { Cart } from "../Models/Order.js";


export const registerUser = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User Email Already Exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            contact,
        });

        // Save user to the database
        await user.save();

        // Optionally, create an empty cart for the user
        const cart = new Cart({ userId: user._id, items: [] });
        await cart.save();

        return res.status(200).json({
            message: "User registration successful",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // Compare password
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // Fetch the user's cart based on user ID
        const cart = await Cart.findOne({ userId: user._id });

        // If cart doesn't exist, create an empty cart for the user
        if (!cart) {
            const newCart = new Cart({ userId: user._id, items: [] });
            await newCart.save();
        }

        // Return user details and cart items
        return res.status(200).json({
            message: `Welcome ${user.name}`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            cart: cart ? cart.items : [],
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
      const { userID } = req.params; // Get userID from the request parameters
  
      // Fetch the user details based on userID
      const user = await User.findById(userID).select("-password"); // Exclude password field
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      // Return the user details
      return res.status(200).json({
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };


export const updateUserProfile = async (req, res) => {
  try {
    const { userID } = req.params; // Get userID from request params
    const { name, email, contact } = req.body; // Get updated fields from the request body

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      userID, // Find the user by ID
      { name, email, contact }, // The updated fields
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user details
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
};
