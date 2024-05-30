const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const orders = require("./routes/orders");
const productsRoute = require("./routes/products.js");
const users = require("./routes/users")
const contact = require("./routes/contact.js")
const result = require("./routes/uploadRouter")
const path = require('path');
const cloudinary = require("./utils/cloudinary");
const fs = require('fs');
const bodyParser = require('body-parser');
const uploadRouter = require("./routes/uploadRouter");
const app = express();
const comment = require("./routes/comment.js");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static('public'));
// app.use('/payment', require('./controllers/payment-controller'));

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/orders", orders);

app.use("/api/comment", comment);

app.use("/api/products", productsRoute);
app.use("/api/users", users);
app.use("/api/upload", uploadRouter);

app.use("/api/contact", contact);


app.get("/", (req, res) => {
  res.send("Welcome our to online shop API...");
});

app.get("/products", (req, res) => {
  res.send(products);
});




app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/upload", (req, res) => {
  res.send(upload);
});

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const uri = process.env.DB_URI;
const port = process.env.PORT;

// app.listen(port, () => {
//   console.log(`Server running on port: ${port}...`);
// });
app.listen(port, ()=>{console.log(`Server running on ${port} for localhost `)} ); // or server.listen(3001, '0.0.0.0'); for all interfaces
app.on('listening', ()=> {
    console.log(`Express server started on ${port}...`, app.address().port, app.address().address);
});

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB connection success..."))
  .catch((error) => console.log("MongoDB connection failed:", error.message));
