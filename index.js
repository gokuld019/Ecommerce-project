import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));


import userRoutes from "./Routes/user.js";
import productRoutes from "./Routes/Product.js";
import OrderRoutes from "./Routes/Product.js";


app.use("/uploads",express.static('uploads'));

// Routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", OrderRoutes);





app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});
