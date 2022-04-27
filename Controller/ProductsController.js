const productDb = require('../Model/ProductsModel');
const joi = require('joi');
const lodash = require('lodash');

module.exports = {

    postProducts: async (req,res)=>{
        try{
            const _keys = joi.object().keys({
                name: joi.string().required().min(3).max(1024) , 
                image: joi.string().required()
            });
    
            const _joiKeys = _keys.validate({
                name: req.body.name , 
                image: req.file.filename
            });
    
            const _pick = lodash.pick(_joiKeys.value,['name','image',]);


           if(_joiKeys.error) {

            res.status(404).json({message:_joiKeys.error.details[0].message});

           } else {
                await productDb({
                   name: _pick.name ,
                   image: `${req.file.fieldname}/${_pick.image}`
               }).save().then((result)=>{
                   res.status(200).json({
                       message: 'Product Uploaded' , 
                       results: result
                   });
               }).catch((err)=>{
                res.status(404).json({
                    message: 'Error in Uploaded' , 
                    error: err
                });
               });
           }
        }catch(e){
            res.status(500).json({
                message: 'Error In Main'
            });
        }
    } ,


    getProducts: async (req,res)=>{
         try{
             const {_limit = 8 ,_page = 1} = req.query;


            const _productDB = await productDb.find()
            .select('_id name image')
            .limit(_limit * 1)
            .skip((_page -1)*_limit).exec()
            .then((value)=>{
                res.status(200).json({
                    message : "GET Sucess",
                    results : value
                });
            }).catch((err)=>{
                res.status(404).json({
                    message : "GET Field",
                    error : err
                });
            });

            
            
            
            
         }catch(e){
            res.status(500).json({
                message : "Error in Mai",
                error : e
            });
         }
    }

};