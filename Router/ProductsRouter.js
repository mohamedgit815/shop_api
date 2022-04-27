const router = require('express').Router();
const controller = require('../Controller/ProductsController');
const helperImage = require('../Helper/HelperImages');
const helperToken = require('../Helper/HelperToken');



router.post('/' , helperImage.single('products') , controller.postProducts);
router.get('/' , controller.getProducts);


module.exports = router;