const path = require("path");
const express = require("express");

const app = express(),
  DIST_DIR = path.join(__dirname, "dist"),
  HTML_FILE = path.join(__dirname, "index.html"),
  DEFAULT_PORT = 45011;

const port = process.env.PORT || DEFAULT_PORT;
app.set("port", port);
app.use(express.static(DIST_DIR));
app.get("*", (req, res) => res.sendFile(HTML_FILE));

var networkInterfaces = require('os').networkInterfaces( );
const key = Object.keys(networkInterfaces).find(key => key.toLowerCase().startsWith('eth'));
const ipAddress = networkInterfaces[key].find(entry => entry.address.startsWith('192.168'));

app.listen(port, () => console.log(`Server running on port ${port}\nhttp://${ipAddress.address}:${port}`));