const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');

router.get('/', auth, async (req, res) => {
try {
    const user = await User.findById(req.user.id);
    res.json(req.user);
} catch (err) {
    return res.status(400).json({errors:[{msg: err.message}]});
}

});
//post to get authenticated with login credentials
//send in email,password
//recieve token
router.post('/',[   //use [] for array of callback functions
    check('email','please include email').isEmail(),
    check('password','please enter password').not().isEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req); //test req
        if(!errors.isEmpty()){
            return res.status(422).json({errors:errors.array()});
        }
        let user = await User.findOne({email: req.body.email});

        if(!user){
            throw new Error('email not found');
        }
        const result = await bcrypt.compare(req.body.password,user.password);
        if(!result){
            throw new Error('password incorrect');
        }
        //gen token
        const payload = { //object with a user that has an id
            user: {
                id: user.id
            }
        };

        jwt.sign(payload,config.get('jwtSecret'),{expiresIn: 360000},
        (err,token)=> {//inside the callback you get either an error or a token 
            if(err) throw err;
            res.json({token});
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({errors:[{msg: err.message}]});
    }
        
    });

module.exports = router;