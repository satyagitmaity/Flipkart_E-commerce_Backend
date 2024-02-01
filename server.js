const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./Connection/dbConnect")
const errorHandler = require("./Middleware/errorHandler");
const path = require("path")
//Routes
const authRoutes = require("./Routes/authRoutes");
const adminAuthRoutes = require("./Routes/Admin/auth");
const categoryRoutes = require("./Routes/category");
const productRoutes = require("./Routes/product");
const cartRoutes = require("./Routes/cart");
const initialDataRoutes = require("./Routes/Admin/initialData")
const pageRoutes = require("./Routes/page");
const addressRoutes = require("./Routes/address");
const orderRoutes = require("./Routes/order");
const adminOrderRoutes = require("./Routes/Admin/order.route")

const app = express()
const port = process.env.PORT 
dbConnect();
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")))
app.use("/api", authRoutes);
app.use("/api", adminAuthRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoutes)

app.use(errorHandler)
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})