const router = require('express').Router();
const v = require('../validators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/mappingController');

router.use(auth);
router.route('/')
  .post(v.mapping, validate, ctrl.create)
  .get(ctrl.list);
// GET uses the patient id; DELETE uses the mapping id (as the assignment specifies)
router.get('/:patientId', v.idParam('patientId'), validate, ctrl.doctorsForPatient);
router.delete('/:id', v.idParam(), validate, ctrl.remove);

module.exports = router;
