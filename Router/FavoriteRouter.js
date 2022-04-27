const router = require('express').Router();
const controller = require('../Controller/FavoriteController');
const helperImage = require('../Helper/HelperImages');
const helperToken = require('../Helper/HelperToken');


router.post('/',controller.postFavorite);



router.post('/:idUser',controller.checkFavortie);


router.delete('/:idUser',controller.deleteFavorite);


router.get('/:idUser',controller.getFavortie);


module.exports = router;