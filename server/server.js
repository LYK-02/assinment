import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import upload from "./config/upload.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve uploaded files by URL - do not edit.
app.use("/uploads", express.static("uploads"));

// The complete upload endpoint from lesson 4.9 - do not edit.
// upload.single("avatar") parses one file from the form field named "avatar".
app.post("/api/upload", (req, res) => {
  upload.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large (max 5MB)" });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.status(201).json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
  });
});

app.get("/", (req, res) => res.json({ ok: true, service: "threadbase-upload-ui-server" }));

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
