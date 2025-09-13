const express = require('express');
const { getHero, updateHero } = require('../controllers/heroController');

const router = express.Router();

// GET /api/hero - Get hero data
router.get('/', getHero);

// PUT /api/hero - Update hero data
router.put('/', updateHero);

module.exports = router;