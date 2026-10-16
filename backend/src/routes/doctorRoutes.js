const router = require('express').Router();
const v = require('../validators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/doctorController');

router.use(auth);
router.route('/')
  .post(v.doctor(), validate, ctrl.create)
  .get(ctrl.list);
router.route('/:id')
  .get(v.idParam(), validate, ctrl.get)
  .put(v.idParam(), v.doctor(true), validate, ctrl.update)
  .delete(v.idParam(), validate, ctrl.remove);

module.exports = router;
