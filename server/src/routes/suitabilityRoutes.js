const router = require('express').Router();
const { checkSuitability, getHistory } = require('../controllers/suitabilityController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('soilImage'), checkSuitability);
router.get('/history', auth, getHistory);

module.exports = router;
