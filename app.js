const express = require("express");
const loggar = require('morgan');
const cors = require('cors');
const path = require('path');
const mongose  = require("mongoose");
const app = express();
let port = process.env.port || 3000;
mongose.connect('mongodb://localhost/shopapp',(err)=>{
  if(err){
    console.log(err);
  }else{
    console.log('Your Data Working');
  }
});


const authRouter = require('./Router/AuthRouter');
const productsRouter = require('./Router/ProductsRouter');
const favortieRouter = require('./Router/FavoriteRouter');


app.use([ 
  express.json() ,
  express.urlencoded({extended: false}) , 
  cors() ,
  express.urlencoded({extended:true}) ,
  loggar('dev') ,
  express.static(path.join(__dirname,'/upload/image'))
]);

/// Images
app.use('/profile',express.static('upload/image'));
app.use('/products',express.static('upload/image'));
/// Images

/// MiddelWare \\\
/// MiddelWare \\\


/// Routers \\\

app.use('/auth' , authRouter);
app.use('/products',productsRouter);
app.use('/favorite',favortieRouter)



app.all('*' , (req,res)=>{
  res.json({
    message: "No Route"
  })
});
/// Routers \\\



app.listen(port,() => { console.log('Running Server') });