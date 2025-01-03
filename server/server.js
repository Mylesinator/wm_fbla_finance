const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const { JSDOM } = require("jsdom");

const clientPath = path.join(__dirname, "..", "client");

const app = express();
app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function getFormattedPage(file, title) {
    try {
        const indexText = await fs.readFile("client/pages/index.html", "utf8");
        const newContent = await fs.readFile(`client/pages/${file}`, "utf8");

        const dom = new JSDOM();
        const parser = new dom.window.DOMParser();

        const doc = parser.parseFromString(indexText, "text/html");
        doc.querySelector("title").innerHTML = title;
        doc.querySelector("main").innerHTML = newContent;

        return doc.documentElement.innerHTML;
    } catch (error) {
        console.error(error);
    }
}

app.get("/", async (req, res) => {
    const page = await getFormattedPage("home.html", "Home");

    res.send(page);
});

app.get("/login", async (req, res) => {
    const page = await getFormattedPage("login.html", "Sign In");

    res.send(page);
});

app.get("/register", async (req, res) => {
    const page = await getFormattedPage("register.html", "Register");

    res.send(page);
});

app.post("/users/login", (req, res) => {
    console.log(req.body);
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});