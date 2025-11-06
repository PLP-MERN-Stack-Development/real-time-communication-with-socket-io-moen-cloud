import express from "express";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";

const router = express.Router();

// Middleware to verify JWT
router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
});

// GET messages for a room
// Example: GET /api/messages/global?limit=50
router.get("/:room", async (req, res) => {
  const room = req.params.room;
  const limit = parseInt(req.query.limit) || 50;

  try {
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Return oldest → newest
    res.json(messages.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
