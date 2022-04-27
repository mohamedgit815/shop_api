const mongose = require('mongoose');

const _name = {type: String , required: true ,minlength:3,maxlength:50,trim:true};


const authDb = mongose.Schema({
    first:  _name ,
    last: _name ,
    image: {type: String , default:''},
    email: {type: String , required: true , unique: true , maxlength: 50 , trim: true} ,
    password: {type: String , required: true ,minlength:3,maxlength:1024} , 
},
{ timestamps: true }
);

module.exports = mongose.model('Auth',authDb);