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



