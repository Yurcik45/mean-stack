const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const configDB = require("./config/db");
const account = require("./routes/account");

const PORT = process.env.PORT || 8080;
// const PORT = 3000;

const app = express();


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://yurcik:Iphone10x@cluster0.ekgf1.mongodb.net/mean?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});




app.use(cors());
app.use(bodyParser.json());
app.use('/account', account);
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport)

// Connected to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('_-_ Connected to mongoDB _-_');
});
mongoose.connection.on('error', (err) => {
    console.log('___ NOT!!! connected to mongoDB ___' + err);
});


app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req,res) => {
//     res.send('Home page');
// });
app.get('*' , (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, () => {
    console.log('---- Server has been started on PORT -- ' + PORT + ' --')
})
