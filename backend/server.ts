import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import branchRoutes from "./src/routes/branchRoutes";
import categoryRoutes from "./src/routes/categoryRoutes";
import productRoutes from "./src/routes/productRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/branches", branchRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Budget Wear Limited API" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
