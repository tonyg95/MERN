const express = require('express');

const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

//create our profile
//POST api/profile
//@access private

router.post('/', auth, async (req, res) => { //protected route
    try {
        const {name,email,location,experience} = req.body;//grab data from page

        const profileFields = {};
        profileFields.user = req.user.id;
        if(name) profileFields.name = name;
        if(email) profileFields.email = email;
        if(location) profileFields.location = location;
        if(experience) profileFields.experience = experience;
        //await profile.save();
        let profile = await Profile.findOne({user:req.user.id}); //search for profile
        if(profile){ //update pre-existing profile
            profile = await Profile.findOneAndUpdate({user: req.user.id},{$set:profileFields},{new:true});
            return res.json(profile);
        }else{
            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);
        }
    } catch (err) {
        console.log(err.message);
        res.send("error: "+err.message);
    }
    });



//get our profile
//GET api/profile/me
//@access private
router.get('/me', auth, async (req, res) => { //protected route
try {
    const profile = await Profile.findOne({user: req.user.id});
    if(!profile){
        throw new Error("profile doesnt exist");
    }

    res.json(profile);
} catch (err) {
    res.send(err.message);
}
});

module.exports = router;