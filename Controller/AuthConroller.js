const authDb = require('../Model/AuthModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const lodash = require('lodash');

module.exports = {
    /// Login
    login : async (req,res)=>{
        try{

            const _keys = joi.object().keys({
                email: joi.string().required().min(3).max(50).email().trim() , 
                password: joi.string().required().min(3).max(1024)
            });
    
            const _joiKeys = _keys.validate(req.body);
    
            const _pick = lodash.pick(_joiKeys.value,['email','password',]);


           if(_joiKeys.error) {

            res.status(404).json({message:_joiKeys.error.details[0].message});

           } else {            
               const _authDb = await authDb.find({email:_pick.email});

               if(_authDb.length < 1) {
                res.status(404).json({message: 'check your Email'});

            } else {


              bcrypt.compare(_pick.password,_authDb[0].password,async (err,result)=>{
                if(!result){
                    res.status(404).json({
                        message: 'check your Password' , 
                        results: result
                    });
                } else {

                    const _constDataDB = {
                        id: _authDb[0]._id,
                        first: _authDb[0].first,
                        last: _authDb[0].last,
                        image: _authDb[0].image,
                        email: _authDb[0].email,
                        createdAt: _authDb[0].createdAt,
                        updatedAt: _authDb[0].updatedAt,
                    }

                    return jwt.sign(_constDataDB, 'Token' ,(err,tokens)=>{
                        if(err){
                            res.status(404).json({
                                message : err , 
                            });
                        } else {
                            res.status(200).json({
                                results: result ,
                                data: _constDataDB , 
                                token : tokens
                            });
                        }
                    });

                   
                }

            });


           }
           }

        } catch(e) {
            res.status(404).json({
                'message': 'Error in Main'
            });
        }
    },



    /// Register
    register : async (req,res) => {
        try{
            const _mainKeys = joi.object().keys({
                first: joi.string().required().min(3).max(50) ,
                last: joi.string().required().min(3).max(50) ,
                email: joi.string().required().min(3).max(50).email().trim() , 
                password: joi.string().required().min(3).max(1024)
            });
    
            const _mainJoiKeys = _mainKeys.validate({
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                password: req.body.password,
            });
    
            const _mainPick = lodash.pick(_mainJoiKeys.value,['email','password','first','last']);


            if(_mainJoiKeys.error){

                res.status(404).json({
                    message : _mainJoiKeys.error.details[0].message
                });

            } else {
                const _findDb = await authDb.find({email: _mainPick.email});


            if(_findDb.length >= 1){
                res.status(404).json({
                    message : 'This Email Already Used'
                });
            } else {
                bcrypt.hash(_mainPick.password , 10 , async (err,hash)=>{
                    if(err){
                        res.status(404).json({
                            message : 'You Forget a Password'
                        });
                    } else {
                        const _keys = joi.object().keys({
                            first: joi.string().required().min(3).max(50) ,
                            last: joi.string().required().min(3).max(50) ,
                            email: joi.string().required().min(3).max(50).email().trim() , 
                            password: joi.string().required().min(3).max(1024)
                        });

                        const _joiKeys = _keys.validate({
                            first : _mainPick.first ,
                            last : _mainPick.last , 
                            email : _mainPick.email , 
                            password : hash
                        });

                        const _pick = lodash.pick(_joiKeys.value,['first','email','password','last']);

                        if(_joiKeys.error) {
                            res.json({
                                error : _joiKeys.error.details[0].message
                            })

                        } else {
                             await authDb(_pick).save().then((result)=>{
                                res.status(200).json({
                                    message : "True" , 
                                    data : result
                                });
                            }).catch((err)=>{
                                res.status(404).json({
                                    message : "Error in send data" , 
                                    error : err
                                });
                            });
                            

                        }                     
                    }
                });
            }
            }

    }catch(e){
        res.status(404).json({
            message : 'Main Error'
        })
    }
        
    },

    

    /// CheckPassword
    checkPassword : async (req,res)=>{
        try{
            
            const _keys = joi.object().keys({
                password: joi.string().required().min(3).max(1024)
            });
    
            const _joiKeys = _keys.validate(req.body);
    
            const _pick = lodash.pick(_joiKeys.value,['password']);


           if(_joiKeys.error) {

            res.status(404).json({message:_joiKeys.error.details[0].message});

           } else {            
            const _authDb = await authDb.find({email: req.params.email});

            if(_authDb.length < 1) {
             res.status(404).json({message: 'check your Email'});

         } else {


           bcrypt.compare(_pick.password,_authDb[0].password,(err,result)=>{
              if(result){

                res.status(200).json({
                    message: 'True' , 
                    results: result , 
                });

               
              } else {

                res.status(404).json({
                    message: 'False' , 
                    results: result
                });

              }
          });
          

        }

        }
            
        }catch(e) {
            res.status(404).json({
                message: 'Error in Main'
            });
        }
    },

    
    /// UpdatePassword
    updatePassword: async (req,res)=>{
        try{

            const _keys = joi.object().keys({
                password: joi.string().required().min(3).max(1024)
            });
    
            const _joiKeys = _keys.validate(req.body);
    
            const _pick = lodash.pick(_joiKeys.value,['password']);


            if( _joiKeys.error ) {
                res.status(404).json({
                    message: _joiKeys.error.details[0].message
                });
            } else {
               bcrypt.hash(_pick.password,10, async(err,hash)=>{
                   if(err){
                    res.status(404).json({
                        message: 'Error in Bcrypt'
                    });
                   } else {

                     await authDb.findByIdAndUpdate(req.params.id,{
                        password : hash , 
                        updatedAt: Date.now()
                    }).then((result)=>{
                        res.status(200).json({
                            message: 'Password Upadted',
                        })
                    }).catch((err)=>{
                        res.status(404).json({
                            message: 'False',
                        });  
                    });
                   }
               });
            }

        }catch(e) {
            res.status(404).json({
                message: 'Error in Main'
            });
        }
    },


    /// UpdateName
    updateName: async (req,res)=>{
        try{

            const _keys = joi.object().keys({
                first: joi.string().required().min(3).max(50) ,
                last: joi.string().required().min(3).max(50) ,
            });
    
            const _joiKeys = _keys.validate(req.body);
    
            const _pick = lodash.pick(_joiKeys.value,['first','last']);
    
    
            if( _joiKeys.error ) {
                res.status(404).json({
                    message: _joiKeys.error.details[0].message
                });
            } else {
    
                await authDb.findByIdAndUpdate(req.params.id,{
                    first : _pick.first , 
                    last : _pick.last , 
                    updatedAt: Date.now()
                }).then((result)=>{
                    res.status(200).json({
                        message: 'Name Updated',
                        results: result
                    })
                }).catch((err)=>{
                    res.status(404).json({
                        message: 'False',
                        results: err
                    });  
                });
    
            }

        }catch(e){
            res.status(404).json({
                message: 'Error in Main'
            });
        }
    } ,



    /// UpdateImages
    updateImage: async (req,res)=>{
        try{

            const _keys = joi.object().keys({
                image: joi.string()
            });
    
            const _joiKeys = _keys.validate({ image : req.file.filename });
    
            const _pick = lodash.pick(_joiKeys.value,['image']);
            
    
            if( _joiKeys.error ) {
                res.status(404).json({
                    message: _joiKeys.error.details[0].message
                });
            } else {
    
                await authDb.findByIdAndUpdate(req.params.id,{
                    image : `${req.file.fieldname}/${_pick.image}` , 
                    updatedAt: Date.now()
                }).then((result)=>{
                    res.status(200).json({
                        message: 'Image Updated',
                        profile_url: `image/${req.file.filename}` 
                    })
                }).catch((err)=>{
                    res.status(404).json({
                        message: 'False',
                        results: err
                    });  
                });
    
            }

        }catch(e){
            res.status(500).json({
                message: 'Error in Main'
            });
        }
    },
};