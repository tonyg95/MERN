const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const router = express.Router();

router.get('/', auth, async (req, res) => {
try {
    const user = await User.findById(req.user.id);
    res.json(user);
} catch (err) {
    return res.status(400).json({errors:[{msg: 'Test test'}]});
}

});

module.exports = router;