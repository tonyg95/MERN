const express = require('express');

const router = express.Router();

const {check, validationResult} = require('express-validator/check');

// @route post appi/users
// @desc register user
// @access public no token
router.post('/', 
[
    check('name','name is required').not().isEmpty(),
    check('email','please include email').isEmail(),
    check('password','please enter password').isLength({min: 6})
],
 (req, res) => {
    //req.body looks like { name: 'tony', password: 'asdfas' }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    res.send('user route')
});

module.exports = router;