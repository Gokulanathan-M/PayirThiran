const router = require('express').Router();
const { getRecommendation, getHistory } = require('../controllers/recommendationController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('soilImage'), getRecommendation);
router.get('/history', auth, getHistory);

module.exports = router;
