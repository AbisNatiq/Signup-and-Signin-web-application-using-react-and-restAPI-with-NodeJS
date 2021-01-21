const http = require("http");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const user = require("./model/user");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const registerValidation = (data) => {
  const schema = {
    fname: Joi.string().min(4).required(),
    lname: Joi.string().min(4).required(),
    email: Joi.string().min(4).required().email(),
    pass: Joi.string().min(6).required(),
  };
  return Joi.validate(data, schema);
};

const loginValidation = (data) => {
  const schema = {
    email: Joi.string().min(4).required().email(),
    pass: Joi.string().min(6).required(),
  };
  return Joi.validate(data, schema);
};

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(
  (req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","*");
    if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
      return res.status(200).json({});
    }
  next();
  });

//app.use(express.json());

port = 80;


  

app.post('/login/api', async (req, res) => {
    const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const us = await user.findOne({
    email: req.body.email
  });

  if (!us) {
    return res.status(400).send("email or password invalid");
  }

  const validPass= await bcrypt.compare(req.body.pass,us.pass);

  if(!validPass){
      return res.status(400).send('invalid pass');
  }

  const token = jwt.sign({
      _id:us._id
  },process.env.TOKEN_SECRET);
  res.header('token',token).send(token);
});

app.post("/register/api/", async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const emailExist = await user.findOne({
    email: req.body.email,
  });

  if (emailExist) {
    return res.status(400).send("email exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.pass, salt);

  const us = new user({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    pass: hashPass,
  });
  try {
    const savedUser = await us.save();
    res.send({user:us._id});
  } catch (err) {
    console.log(err);
  }
});



app.listen(port, () => {
  console.log(`server started on ${port}`);
});
