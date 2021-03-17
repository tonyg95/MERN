const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const router = express.Router();

<<<<<<< HEAD
const auth = require('../../middleware/auth');

router.get('/',auth, (req, res) => res.send('auth route'));
=======
router.get('/', auth, async (req, res) => {
try {
    const user = await User.findById(req.user.id);
    res.json(user);
} catch (err) {
    return res.status(400).json({errors:[{msg: 'Test test'}]});
}

});
>>>>>>> br1

module.exports = router;