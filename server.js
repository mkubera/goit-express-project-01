const path = require("path");
const express = require("express");
const app = express();
const port = 3001;

// console.log(__dirname);
// console.log(path.join(__dirname, "static"));

// MIDDLEWARE
const myLogger = (req, res, next) => {
  // req.user = "Nasz User";
  console.log("LOGGED");
  console.log(req.method);
  // console.log(req.user);
  return req.method === "GET" ? next() : null;
  // next();
};

// CONFIG
// app.use(myLogger);
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: false })); // for HTML FORMS
app.use(express.json()); // for JSON FETCH

// ROUTES
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
app.get("/about", (req, res) => {
  res.status(200).send("<h1>About</h1>");
});
app.get("/users/:userId", (req, res) => {
  console.log(req.params);
  const { userId } = req.params;
  res.status(200).send(`
    <h1>Hello, User ${userId}!</h1>
  `);
});
app.get("/users/:userId/books/:bookId", myLogger, (req, res) => {
  console.log(req.params);
  const { userId, bookId } = req.params;
  res.status(200).send(`
    <h1>Hello, User ${userId}!</h1>
    <p>You requested Book Id: ${bookId}.</p>
  `);
});

app.get("/users", (req, res) => {
  res.send(`
  <form action="/api/users/34" method="POST">
    <label for="fields">Fields</label>
    <input type="text" name="fields" id="fields" value="id,name" />
    <button type="submit">Send</button>
  </form>
  `);
});

let fakeDb = {
  users: [{ id: 34, name: "Albert", courseName: "GoIT Full-stack" }],
};

// input: userId (String), fields (String)
// ouput: User{}
const getUserWithChosenFields = (userId, fields) => {
  const fieldsToSend = fields.split(",");
  const user = fakeDb.users.find(({ id }) => id === Number(userId));

  return Object.entries(user)
    .filter(([k]) => fieldsToSend.includes(k))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
};

app
  .route("/api/users/:userId")
  .get((req, res) => {
    res.send("Hi, user");
  })
  .post((req, res) => {
    const { userId } = req.params;
    const { fields } = req.body;
    const user = getUserWithChosenFields(userId, fields);

    res.status(200).json(user);
  });

// START SERVER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
