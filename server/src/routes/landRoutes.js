const router = require('express').Router();
const { getLands, createLand } = require('../controllers/landController');
const auth = require('../middleware/auth');

router.get('/', auth, getLands);
router.post('/', auth, createLand);

module.exports = router;
