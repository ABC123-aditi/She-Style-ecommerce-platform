// ============================
// 1️⃣ IMPORT REQUIRED PACKAGES
// ============================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const path = require("path");

// ============================
// 2️⃣ APP CONFIGURATION
// ============================
const app = express();
const PORT = 5000;

app.use(cors());

app.use(express.json());



// ============================
// 3️⃣ MONGODB CONNECTION
// ============================
const MONGO_URI =
  "mongodb+srv://kadhitu24_db_user:Aditi123@shopease-cluster.yshojzz.mongodb.net/shopease?appName=shopease-cluster";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ============================
// 4️⃣ SCHEMAS & MODELS
// ============================

// Product
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  stock: Number,
});
const Product = mongoose.model("Product", productSchema);

// Contact
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  reply: String,
  repliedAt: Date,
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", contactSchema);
const orderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,

  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  totalAmount: Number,
  paymentMethod: String,
  paymentStatus: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Order = mongoose.model("Order", orderSchema);
// ============================
// USER (AUTH) SCHEMA
// ============================
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

// ============================
// 5️⃣ ROUTES
// ============================

// Test
app.get("/", (req, res) => {
  res.send("ShopStyle backend running 🚀");
});

// Products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ message: "Error fetching products" });
  }
});
// ============================
// ADMIN PRODUCT ROUTES
// ============================

// ➕ Add product
app.post("/api/admin/product", async (req, res) => {
  try {
    const { name, price, image, stock } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: "All fields required" });
    }

    await Product.create({
      name,
      price,
      image,
      stock
    });

    res.json({ message: "Product added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
});


// ✏️ Update product (stock / price etc.)
app.put("/api/admin/product/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Product updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});


// ❌ Delete product
app.delete("/api/admin/product/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});


// Checkout
app.post("/api/checkout", async (req, res) => {
  try {
    const { cart, paymentMethod, customerName, customerEmail } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!customerName || !customerEmail) {
      return res.status(400).json({ message: "Customer details missing" });
    }

    let totalAmount = 0;
    let orderItems = [];

    for (const item of cart) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }

      // Atomically reduce stock using findByIdAndUpdate
      const updatedProduct = await Product.findByIdAndUpdate(
        item._id,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found during update" });
      }

      totalAmount += item.price * item.quantity;

      orderItems.push({
        name: product.name,
        price: item.price,
        quantity: item.quantity
      });
    }

    await Order.create({
      customerName,
      customerEmail,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "SUCCESS"
    });

    res.json({ message: "Checkout successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  }
});



// Contact
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    await Contact.create({ name, email, message });
    res.json({ message: "Message sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Admin: read messages
app.get("/api/admin/messages", async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

// Admin: reply to message
app.put("/api/admin/messages/:id/reply", async (req, res) => {
  try {
    const { reply } = req.body;
    const { id } = req.params;
    
    console.log("Reply request received for message ID:", id);
    console.log("Reply content:", reply);
    
    if (!reply || reply.trim() === "") {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID format" });
    }

    const message = await Contact.findByIdAndUpdate(
      id,
      { 
        reply: reply.trim(),
        repliedAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found with ID: " + id });
    }

    console.log("Reply saved successfully for message:", message._id);
    res.json({ message: "Reply sent successfully", data: message });
  } catch (err) {
    console.error("Error in reply endpoint:", err);
    res.status(500).json({ 
      message: "Failed to send reply", 
      error: err.message 
    });
  }
});
app.get("/api/admin/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});
// ============================
// AUTH: REGISTER
// ============================
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "shopease_secret_key";

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Registration attempt:", { name, email, hasPassword: !!password });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log("User registered successfully:", newUser.email);
    res.json({ message: "Registration successful" });

  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle duplicate key error (MongoDB unique constraint)
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    res.status(500).json({ 
      message: "Registration failed",
      error: err.message 
    });
  }
});
// ============================
// AUTH: LOGIN
// ============================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});




// ============================
// 6️⃣ START SERVER
// ============================
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
app.use(express.static(path.join(__dirname, "public")));

