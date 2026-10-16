const router = require('express').Router();
const v = require('../validators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/authController');

router.post('/register', v.register, validate, ctrl.register);
router.post('/login', v.login, validate, ctrl.login);
router.post('/refresh', v.refresh, validate, ctrl.refresh);
router.get('/me', auth, ctrl.me);

module.exports = router;
