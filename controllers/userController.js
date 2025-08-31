const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../db/db");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const db = await connectDB();
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { 
        name, 
        email, 
        password: hashedPassword,
        role: "user",  // default role
        createdAt: new Date()
      };

    await db.collection("users").insertOne(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = await connectDB();
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },   // add role here
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
  );

    

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const db = await connectDB();
    const user = await db.collection("users").findOne({ email: req.user.email }, { projection: { password: 0 } });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
