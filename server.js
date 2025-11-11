require("dotenv").config();
// ====== server.js ======
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ===== Contact Form Endpoint =====
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

  // Read existing messages
  let messages = [];
  if (fs.existsSync(messagesFile)) {
    const data = fs.readFileSync(messagesFile, "utf-8");
    messages = JSON.parse(data || "[]");
  }

  // Add new message
  messages.push(newMessage);

  // Save back to file
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

  console.log("💬 New message saved:", newMessage);
  res.json({ success: true, message: "Message received and saved successfully!" });
});

// ===== Password-Protected Admin Page =====
app.get("/admin", (req, res) => {
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).send("<h2>Access Denied</h2><p>Incorrect password.</p>");
  }
  res.sendFile(path.join(__dirname, "admin.html"));
});


app.post("/admin/login", (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = "CutAdmin2025!"; // change this if needed

  if (password === ADMIN_PASSWORD) {
    res.redirect("/admin-dashboard");
  } else {
    res.send(`
      <script>
        alert("❌ Incorrect password. Try again.");
        window.location.href = "/admin";
      </script>
    `);
  }
});

// ===== Admin Dashboard =====
app.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// ===== Fetch All Messages for Admin =====
app.get("/api/messages", (req, res) => {
  const filePath = path.join(__dirname, "messages.json");

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const messages = JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
  res.json(messages);
});

// ===== Serve Website Pages =====
app.get("/OG", (req, res) => res.sendFile(path.join(__dirname, "OG.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "about.html")));
app.get("/services", (req, res) => res.sendFile(path.join(__dirname, "services.html")));
app.get("/news", (req, res) => res.sendFile(path.join(__dirname, "news.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "contact.html")));

// Default route → Redirect to OG.html
app.get("/", (req, res) => res.redirect("/OG"));

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
