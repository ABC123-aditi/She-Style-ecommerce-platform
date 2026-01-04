const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb+srv://kadhitu24_db_user:Aditi123@shopease-cluster.yshojzz.mongodb.net/shopease?appName=shopease-cluster");

const products = [
  {
    name: "Product 1",
    price: 500,
    image: "a1.jpeg",
    stock: 8
  },
  {
    name: "Product 2",
    price: 1550,
    image: "a2.jpeg",
    stock: 6
  },
  {
    name: "Product 3",
    price: 1250,
    image: "a3.jpeg",
    stock: 5
  },
  {
    name: "Product 4",
    price: 1000,
    image: "a4.jpeg",
    stock: 10
  },
  {
    name: "Product 5",
    price: 1200,
    image: "a5.jpeg",
    stock: 8
  },
    {
    name: "Product 6",
    price: 1300,
    image: "a6.jpeg",
    stock: 17
  },
  {
    name: "Product 7",
    price: 1700,
    image: "a7.jpeg",
    stock: 50
  },
  {
    name: "Product 8",
    price: 1500,
    image: "a8.jpeg",
    stock: 19
  },
  {
    name: "Product 9",
    price: 1100,
    image: "a9.jpeg",
    stock: 13
  },
  {
    name: "Product 10",
    price: 1100,
    image: "a10.jpeg",
    stock: 12
  },
  {
    name: "Product 11",
    price: 1010,
    image: "a11.jpeg",
    stock: 11
  },
  {
    name: "Product 12",
    price: 1040,
    image: "a12.jpeg",
    stock: 10
  },
  {
    name: "Product 13",
    price: 1400,
    image: "a13.jpeg",
    stock: 7
  },
  {
    name: "Product 14",
    price: 600,
    image: "a14.jpeg",
    stock: 5
  },
  {
    name: "Product 15",
    price: 900,
    image: "a15.jpeg",
    stock: 9
  },
  {
    name: "Product 16",
    price: 800,
    image: "a16.jpeg",
    stock: 40
  },
    {
    name: "Product 17",
    price: 700,
    image: "a17.jpeg",
    stock: 20
  },
    {
    name: "Product 18",
    price: 900,
    image: "a18.jpeg",
    stock: 15
  },
    {
    name: "Product 19",
    price: 1700,
    image: "a19.jpeg",
    stock: 18
  },
    {
    name: "Product 20",
    price: 1900,
    image: "a20.jpeg",
    stock: 19
  },
    {
    name: "Product 21",
    price: 2000,
    image: "a21.jpeg",
    stock: 10
  },
    {
    name: "Product 22",
    price: 1300,
    image: "a22.jpeg",
    stock: 16
  },
    {
    name: "Product 23",
    price: 1600,
    image: "a23.jpeg",
    stock: 5
  },
    {
    name: "Product 24",
    price: 1500,
    image: "a24.jpeg",
    stock: 6
  },
    {
    name: "Product 25",
    price: 1000,
    image: "a25.jpeg",
    stock: 12
  },
    {
    name: "Product 26",
    price: 1500,
    image: "a26.jpeg",
    stock: 4
  },
    {
    name: "Product 27",
    price: 1400,
    image: "a27.jpeg",
    stock: 6
  },
    {
    name: "Product 28",
    price: 1890,
    image: "a28.jpeg",
    stock: 7
  },
    {
    name: "Product 29",
    price: 1780,
    image: "a29.jpeg",
    stock: 8
  },
    {
    name: "Product 30",
    price: 1000,
    image: "a30.jpeg",
    stock: 6
  },
  
];

async function seedDB() {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("Products added");
  mongoose.connection.close();
}

seedDB();

"mongodb+srv://kadhitu24_db_user:Aditi123@shopease-cluster.yshojzz.mongodb.net/shopease?appName=shopease-cluster"

