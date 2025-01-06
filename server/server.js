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
        let index = users.findIndex(item => item.email === email);

        if (index !== -1) {
            const user = users[index];

            if (user.password === password) {
                users[index] = { ...users[index], id: randomUUID() };

                await fs.writeFile("data/users.json", JSON.stringify(users, null, 4));
                res.status(200).send(users[index].id);
            } else {
                res.status(401).send("Password is incorrect!");
            }
        } else {
            res.status(404).send("User was not found!");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

app.post("/users/signup", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const data = await fs.readFile(`data/users.json`, "utf8");

        const users = JSON.parse(data);
        const user = users.find(u => u.email === email);

        if (!user) {
            users.push({ email, username, password });
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

app.get("/users/auth-user/:token", async (req, res) => {
    try {
        const { token } = req.params;

        const data = await fs.readFile("data/users.json", "utf8");
        const users = JSON.parse(data);

        const user = users.find(user => user.id === token);

        if (user) {
            delete user.password;

            return res.status(200).send(user);
        } else {
            return res.status(404);
        }
    } catch (error) {
        console.error(error);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});