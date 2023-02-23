"use strict";

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;

//connect node app to mongodb app
mongoose.connect("mongodb://localhost:27017/makeup");

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: String,
  imageUrl: String,
  description: String,
});

const productModel = mongoose.model("product", productSchema);

function seedProductCollection() {
  // you'll create an object that follows the Model structure
  const bronzer = new productModel({
    name: "Hi-Light Booster Bronzer",
    brand: "maybelline",
    price: "14.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/991799d3e70b8856686979f8ff6dcfe0_ra,w158,h184_pa,w158,h184.png",
    description:
      "Maybelline Face Studio Master Hi-Light Light Boosting bronzer formula has an expert balance of shade + shimmer illuminator for natural glow. Skin goes soft-lit with zero glitz.",
  });
  const contour = new productModel({
    name: "Contour Kit",
    brand: "maybelline",
    price: "15.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/4f731de249cbd4cb819ea7f5f4cfb5c3_ra,w158,h184_pa,w158,h184.png",
    description:
      "Maybelline Facestudio Master Contour Kit is the ultimate on the go all-in-one palette, with contouring brush included.  Define and highlight in a New York minute with this effortless 3-step face contouring kit.",
  });
  const blush = new productModel({
    name: "truBLEND Blush in Light Rose",
    brand: "maybelline",
    price: "13.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/0b8787d62ced45700c0693b869645542_ra,w158,h184_pa,w158,h184.png",
    description:
      "Never stop blushing with CoverGirl New truBLEND blush! Features:New marbled baked formulaUltra-blendable and delivers a beautiful, multi-toned result Designed to fit light, medium and deep skin tones alike",
  });
  bronzer.save();
  contour.save();
  blush.save();
}
seedProductCollection();

app.get("/", homeHandler);
app.get("/productsapi", allProductsHandler);
app.get("/product", getProductsHandler);
app.post("/product", addProductHandler);

function homeHandler(request, response) {
  response.status(200).send("Home");
}

async function allProductsHandler(request, response) {
  const url = "http://makeup-api.herokuapp.com/api/v1/products.json";
  try {
    let productData = await axios.get(url);
    response.status(200).send(productData.data);
  } catch (e) {
    response.status(500).send(e);
  }
}

async function getProductsHandler(request, response) {
  let products = await productModel.find({});
  response.send(products);
}

async function addProductHandler(request, response) {
  let { name, brand, price, imageUrl, description } = request.body;
  let newProduct = await productModel.create({
    name,
    brand,
    price,
    imageUrl,
    description,
  });

  productModel.find({}, function (error, products) {
    if (error) {
      response.status(500).send(`The error is: ${error}`);
    } else {
      response.status(200).send(products);
    }
  });
}

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
