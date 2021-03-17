const express = require('express');

const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');

const bcrypt = require('bcryptjs');
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

    const { name, email, password} = req.body;//grab information from page

    try{
        let user = await User.findOne({email: email});//search db for same email
        if(user){
            return res.status(400).json({errors:[{msg: 'user already exists'}]});
        }

        user = new User({ //create new model
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);//generate salt

        user.password = await bcrypt.hash(password, salt);//encrypt password

        await user.save();//returns promise that contains

        const payload = { //object with a user that has an id
            user: {
                id: user.id
            }
        };
        //generate jwt token with a payload,secretString,options,callback(err,token)
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn: 360000},
        (err,token)=> {//inside the callback you get either an error or a token 
            if(err) throw err;
            res.json({token});
        });
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }

});

module.exports = router;