const  express = require('express');
const { registrarUsuario, obtenerUsuarios, loginUsuario, actualizarProgresoMatematicas, actualizarProgresoOrtografia, obtenerProgresoUsuario } = require('../controllers/userController');

const router = express.Router();

router.post('/', registrarUsuario);
router.get('/', obtenerUsuarios);
router.post('/login', loginUsuario)
router.post('/matematicas', actualizarProgresoMatematicas)
router.post('/ortografia', actualizarProgresoOrtografia)
router.post('/obtener-progreso', obtenerProgresoUsuario);

module.exports = router;