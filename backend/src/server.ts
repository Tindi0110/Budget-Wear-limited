import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import branchRoutes from "./routes/branchRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/branches", branchRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Budget Wear Limited API" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
