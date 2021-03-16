const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.send({ some: 'json' }));

module.exports = router;