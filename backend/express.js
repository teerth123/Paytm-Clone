const express = require("express");
const { Router } = require("./routes/index");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express()
app.use(express.json());
app.use(bodyParser.json());
require("./db");
app.use(cors());
app.use('/api/v1',Router);

app.listen(3000, ()=>{console.log("running on 3000")})
