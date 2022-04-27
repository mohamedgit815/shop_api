const router = require('express').Router();
const helperImage = require('../Helper/HelperImages');
const helperToken = require('../Helper/HelperToken');
const controller = require('../Controller/AuthConroller');

router.post('/login',controller.login);
router.post('/register',controller.register);
router.post('/checkPw/:email',controller.checkPassword);
router.put('/updatePw/:id',controller.updatePassword);
router.put('/updateName/:id',controller.updateName);
router.put('/updateImage/:id',helperImage.single('profile'),controller.updateImage);


module.exports = router;