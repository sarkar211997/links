const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/User");

const app = express();
let currentUser = null; // simple session

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://chizal461_db_user:Sarkar@1990@cluster0.icfsvrw.mongodb.net/?appName=Cluster0")
  .then(() => console.log("Database Connected"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/home.html"));
});

app.post("/signup", async (req, res) => {
  const { username, email, password, instagram, youtube, twitter } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    links: { instagram, youtube, twitter }
  });

  currentUser = user;
  res.redirect(`/edit`);
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) return res.send("Invalid login");

  currentUser = user;
  res.redirect("/edit");
});

app.get("/edit", (req, res) => {
  if (!currentUser) return res.redirect("/login");
  res.sendFile(path.join(__dirname, "views/edit.html"));
});

app.post("/edit", async (req, res) => {
  if (!currentUser) return res.redirect("/login");

  const { instagram, youtube, twitter } = req.body;

  await User.updateOne(
    { _id: currentUser._id },
    { links: { instagram, youtube, twitter } }
  );

  res.redirect(`/${currentUser.username}`);
});

app.get("/logout", (req, res) => {
  currentUser = null;
  res.redirect("/");
});

app.get("/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.send("User not found");

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>@${user.username}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>

<div class="container">
  <h1>@${user.username}</h1>

  ${user.links.instagram ? `<a class="link-btn" href="${user.links.instagram}" target="_blank">Instagram</a>` : ""}
  ${user.links.youtube ? `<a class="link-btn" href="${user.links.youtube}" target="_blank">YouTube</a>` : ""}
  ${user.links.twitter ? `<a class="link-btn" href="${user.links.twitter}" target="_blank">Twitter</a>` : ""}

</div>

</body>
</html>
`);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});



