const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const { JSDOM } = require("jsdom");

const clientPath = path.join(__dirname, "..", "client");

const app = express();
app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function sendCoolFile(file, title) {
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
    const page = await sendCoolFile("home.html", "Home");

    res.send(page);
});

app.get("/login", async (req, res) => {
    const page = await sendCoolFile("login.html", "Sign In");

    res.send(page);
});

app.post("/users/login", async (req, res) => {
    try {
        const users = await fs.readFile(`server/data/users.json`, "utf8")||[];
        const {email, password} = req.body;
        const user = users.filter(user => user.email === email);
        if (user !== "") {
            if (user.password == password) {
                res.status(200).send("Success!");
            } else {
                res.status(401).send("Password is incorrect!");
            }
        } else {
            res.status(404).send("User was not found!");
        }
        console.log(user);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

app.post("/users/signup", async (req, res) => {
    try {
        const users = await fs.readFile(`server/data/users.json`, "utf8")||[];
        const {email, password} = req.body;
        const user = users.filter(user => user.email === email);
        if (user === "") {
            await fs.appendFile(`server/data/users.json`, {email, password});
        } else {
            res.status(403).send("User is already taken!");
        }
        console.log(user);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});