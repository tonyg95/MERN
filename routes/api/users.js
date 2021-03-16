const express = require('express');

const router = express.Router();

const config = require('config');

const bcrypt = require('bcryptjs');

const {check, validationResult} = require('express-validator');

const jwt = require('jsonwebtoken');

const User = require('../../models/User'); //grab model
// @route post appi/users
// @desc register user
// @access public no token
router.post('/', 
[
    check('name','name is required').not().isEmpty(),
    check('email','please include email').isEmail(),
    check('password','please enter password').isLength({min: 6})
],
 async (req, res) => {
    //req.body looks like { name: 'tony', password: 'asdfas' }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const { name, email, password} = req.body; //destructure

    try {
        let user = await User.findOne({email: email});
        if(user){//if found email in the database
            return res.status(400).json({ errors:[{msg: 'user already exists'}]});
        }
        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err,token)=> {
            if(err) throw err;
            res.json({token});
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }

});

module.exports = router;