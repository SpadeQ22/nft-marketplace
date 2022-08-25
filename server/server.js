require("dotenv").config();
const path = require("path");
const express= require('express');
const app = express();
const {Pool} = require("pg");
const Busboy = require("busboy");
const AWS = require("aws-sdk");
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');

app.use(express.json());
app.use(busboy());
app.use(express.urlencoded({ extended: true }));
app.use(busboyBodyParser());

const clientPool = new Pool({
  host: "database-1.cvwemstkxffy.us-east-1.rds.amazonaws.com",
  user: "postgres",
  database: "NFT_MarketPlace",
  password: "adminadmin",
  port: 5432,
});

const PORT = process.env.PORT || 3001;


AWS.config.update({
  accessKeyId: process.env.Access_Key_ID,
  secretAccessKey: process.env.Secret_Access_Key,
  region: "us-east-1"
});

var s3 = new AWS.S3();


// var params = {
//   Bucket: "blockchain-training",
//   Body: "filestream",
//   key:"file-name"
// };


app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/userinfo/:address", (req, res) => {
  let address = req.params.address;
  clientPool.connect((err, client) => {
    if (err) {
      console.log(err.stack);
    } else {
      client.query(
        "SELECT * FROM client WHERE address = '" + address + "';",
        (err, result) => {
          if (err) {
            console.log(err.stack);
          } else {
            res.send(result["rows"]["0"]);
          }
        }
      );
      client.release();
    }
  });
});

app.get("/nftinfo/:address", (req, res) => {
  let address = req.params.address;
  clientPool.connect((err, client) => {
    if (err) {
      console.log(err.stack);
    } else {
      client.query(
        "SELECT * FROM nft_object WHERE ownerAddress = '" + address + "';",
        (err, result) => {
          if (err) {
            console.log(err.stack);
          } else {
            res.send(result["rows"]);
          }
        }
      );
      client.release();
    }
  });
});

app.get("/nftinfo", (req, res) => {
  let address = req.params.address;
  clientPool.connect((err, client) => {
    if (err) {
      console.log(err.stack);
    } else {
      client.query("SELECT * FROM nft_object;", (err, result) => {
        if (err) {
          console.log(err.stack);
        } else {
          res.send(result["rows"]);
        }
      });
      client.release();
    }
  });
});

app.post("/userinfo", (req, res)=>{
  clientPool.connect((err, client) =>{
    if(err){
      console.log(err.stack);
      res.send({"message":"couldn't connect to database"});
    }else {
      client.query(`INSERT INTO client(name, age, address, phonenumber, email) 
      VALUES('${req.body.name}', ${req.body.age}, '${req.body.address}', 
        '${req.body.phonenumber}', '${req.body.email}');`, (err, result)=>{
          if(err){
            console.log(err.stack);
            res.send({"message":"error during added"});
          } else {
            res.send({"message":"success"});
          }
      });
    }
    client.release();
  });
});


app.post("/upload", (req, res, next)=>{
  const bb = Busboy({headers: req.headers});
  bb.on('finish', () => {
    console.log('Upload finished')
  });
  const params = {
    Bucket: "blockchain-training",
    Body: req.files.file.data,
    Key: req.files.file.name
  }
  s3.upload(params, (err, data) => {
    if(err){
      console.log(err);
    }
    else{
      res.send({"link":data.Location});
    }
  });
})

app.post("/uploaduri", (req, res)=>{
  var buf = JSON.stringify(req.body);
  const params = {
    Bucket: "blockchain-training",
    Body: buf,
    Key: req.body.name+ req.body.description + req.body.price.toString() +".json",
    ContentEncoding: 'base64',
    ContentType: 'application/json'
  }
  s3.upload(params, (err, data) => {
    if(err){
      console.log(err);
    }
    else{
      res.send({"link":data.Location});
    }
  });
})



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});