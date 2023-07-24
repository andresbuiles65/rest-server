const { check } = require('express-validator');
const {Router} = require('express');
const { login, googleSignIn } = require('../controllers/auth');
const { validarcampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    check('password', 'La contraseña no puede ser vacia').not().isEmpty(),
    validarcampos
],login );

router.post('/google',[
    check('id_token','id_token es necesario').not().isEmpty(),
    validarcampos
],googleSignIn );

module.exports = router;