const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// ===== Middleware =====
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ===== Simple Admin Auth =====
let isLoggedIn = false;
const ADMIN_PASSWORD = "cut2025"; // change this to your preferred password

// Serve the admin login page
app.get("/admin-login", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-login.html"));
});

// Handle login submission
app.post("/api/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    isLoggedIn = true;
    console.log("✅ Admin logged in successfully");
    res.json({ success: true });
  } else {
    console.log("❌ Wrong password attempt");
    res.json({ success: false });
  }
});

// Serve the admin dashboard only if logged in
app.get("/admin", (req, res) => {
  if (!isLoggedIn) {
    console.log("🔒 Not logged in, redirecting to login page");
    return res.redirect("/admin-login");
  }

  res.sendFile(path.join(__dirname, "admin.html"));
});

// ===== API: Save Contact Messages =====
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  const newMessage = {
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
  };

  const messagesFile = path.join(__dirname, "messages.json");
  let messages = [];

  if (fs.existsSync(messagesFile)) {
    const data = fs.readFileSync(messagesFile, "utf-8");
    messages = JSON.parse(data || "[]");
  }

  messages.push(newMessage);
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
  console.log("💬 New message saved:", newMessage);

  res.json({ success: true, message: "Message received and saved successfully!" });
});

// ===== API: Get All Messages (for Admin) =====
app.get("/api/messages", (req, res) => {
  if (!isLoggedIn) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const messagesFile = path.join(__dirname, "messages.json");
  if (!fs.existsSync(messagesFile)) {
    return res.json([]);
  }

  const data = fs.readFileSync(messagesFile, "utf-8");
  res.json(JSON.parse(data || "[]"));
});

// ===== Serve Website Pages =====
app.get("/OG", (req, res) => res.sendFile(path.join(__dirname, "OG.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "about.html")));
app.get("/services", (req, res) => res.sendFile(path.join(__dirname, "services.html")));
app.get("/news", (req, res) => res.sendFile(path.join(__dirname, "news.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "contact.html")));

// Default route
app.get("/", (req, res) => res.redirect("/OG"));

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
