const FavoriteDB = require('../Model/FavoriteModel');
const joi = require('joi');
const lodash = require('lodash');

module.exports = {
postFavorite : async (req,res)=>{

    try{
        const _keys = joi.object().keys({
            name: joi.string().required().min(3).max(1024) , 
            image: joi.string().required(),
            idProducts: joi.string().required() , 
            idUser : joi.string().required()
        });

        const _joiKeys = _keys.validate(req.body);

        const _pick = lodash.pick(_joiKeys.value,['name','image','idUser','idProducts']);


       if(_joiKeys.error) {

        res.status(404).json({message:_joiKeys.error.details[0].message});

       } else {
       
        await FavoriteDB({
            name: _pick.name , 
            image: _pick.image ,
            idProducts : _pick.idProducts , 
            idUser: _pick.idUser
        }).save()
        .then((result)=>{

         res.status(200).json({
             data: result , 
             message: true
         });

        }).catch((err)=>{

         res.status(404).json({
             error: err , 
             message: false
         });

        });

       }
    }catch(e){
        res.status(500).json({
            error: err , 
            message: "Main Error"
        });
    }
},


getFavortie: async (req,res)=>{
     await FavoriteDB.find({idUser: req.params.idUser}).then((data)=>{
        res.status(200).json({
            data: data,
            message: true
        });
    }).catch((err)=>{
        res.status(404).json({
            data: err,
            message: false
        });
    });


    



    /*
    for(var i = 0; i < _FavoriteDB.length ; i++) {
        if(_FavoriteDB[i].idUser == req.params.idUser){

          
            res.status(200).json({
                data: _FavoriteDB[i],
                message: true
            });
          
        }
    }
    */
},


checkFavortie: async (req,res)=>{
    const _FavoriteDB = await FavoriteDB.find({idProducts: req.params.idUser});

    if(_FavoriteDB.length == 1){
        res.status(200).json({
            message: true
        })
    } else {
        res.status(404).json({
            message: false
        }) 
    }

},



deleteFavorite: async (req,res)=>{
    try{
        return await FavoriteDB.findOneAndDelete({idProducts: req.params.idUser})
    .then((result)=>{
        res.status(200).json({
            data: result , 
            message: "True"
        });
    }).catch((err)=>{
        res.status(404).json({
            error: err , 
            message: "False"
        });
    });
    }catch(e){
        res.status(500).json({
            error: err , 
            message: "Main Error"
        });
    }
},

}