require('dotenv').config();
const path = require("path")
const express= require('express')
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3001;


app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.get("/api", (req, res) => {
    res.json({ message: "Welcome from Server!!"});
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


// var pg = require('pg');
// var connectionString = "postgres://postgres:adminadmin@database-1.cvwemstkxffy.us-east-1.rds.amazonaws.com:5432/NFT_MarketPlace";

// var client = new pg.Client(connectionString);

// client.connect(function(err) {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }

//   console.log('Connected to database.');
// });

// client.end();

var client = require('./client');

var t = client.getClientInfo('0xA1f61C8CA661B198971697279a56D15d9F1B3329');

console.log(t);