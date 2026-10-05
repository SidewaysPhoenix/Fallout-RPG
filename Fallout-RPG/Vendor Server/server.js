const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const vendorPath = path.join(__dirname, "data", "vendor.json");

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "Vault-Kit Vendor Server"
  });
});

app.get("/api/vendor", (req, res) => {
  try {
    const raw = fs.readFileSync(vendorPath, "utf8");
    const vendor = JSON.parse(raw);

    res.json(vendor);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      ok: false,
      error: "Could not load vendor."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vault-Kit Vendor Server running on port ${PORT}`);
});