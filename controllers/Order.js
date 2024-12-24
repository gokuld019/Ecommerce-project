import express from "express";
import Order from "../Models/Order.js";

const router = express.Router();

// Get all orders
router.get("/all-orders", async (req, res) => {
    try {
        const orders = await Order.find().populate("user").populate("items.product");
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { user, items, totalAmount } = req.body;

        const newOrder = new Order({
            user,
            items,
            totalAmount,
        });

        const savedOrder = await newOrder.save();
        res.json({ success: true, order: savedOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});



// Update order status (Admin)
router.put("/update-status/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status (add more valid statuses based on your application)
    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }

    try {
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, order });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
