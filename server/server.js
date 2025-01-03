const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const { JSDOM } = require("jsdom");
const { randomUUID } = require("crypto");

const clientPath = path.join(__dirname, "..", "client");

const app = express();
app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function getFormattedPage(file, title) {
    try {
        const indexText = await fs.readFile("../client/pages/index.html", "utf8");
        const newContent = await fs.readFile(`../client/pages/${file}`, "utf8");

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

app.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await fs.readFile(`data/users.json`, "utf8");

        let users = JSON.parse(data);
        const user = users.filter(user => user.email === email);

        if (user.length > 0) {
            if (user[0].password === password) {
                let index = users.findIndex(item => item.email === email);

                users[index] = { ...users[index], id: randomUUID() }

                await fs.writeFile("data/users.json", JSON.stringify(users, null, 4));
                res.status(200).send(users[index].id);
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
        const { email, password } = req.body;
        const data = await fs.readFile(`data/users.json`, "utf8");

        const users = JSON.parse(data);
        const user = users.filter(u => u.email === email);

        if (user.length === 0) {
            users.push({ email, password });
            await fs.writeFile("data/users.json", JSON.stringify(users, null, 4));
        } else {
           return res.status(403).send("User is already taken!");
        }

        return res.status(201).send("User account registered.");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});