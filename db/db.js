// db.js
const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (db) return db; // reuse existing connection

  client = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = client.db(process.env.DB_NAME || "testdb"); // pick database name
  console.log("✅ MongoDB connected");
  return db;
}

module.exports = connectDB;

