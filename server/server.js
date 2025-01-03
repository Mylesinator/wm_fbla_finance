const express = require("express");
const path = require("path");
const fs = require("fs");

const clientPath = path.join(__dirname, "..", "client");

const app = express();
app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile("pages/index.html", { root: clientPath });
});

//styles
app.get("/style.css", (req, res) => {
    res.sendFile("../style.css", { root: clientPath });
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});