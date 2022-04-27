const mongose = require('mongoose');

const _reapeat = { type: String , required: true };

const schema = mongose.Schema({
    name: _reapeat , 
    image: _reapeat ,
    idProducts: _reapeat , 
    idUser: _reapeat , 
});

module.exports = mongose.model('Favorite',schema);