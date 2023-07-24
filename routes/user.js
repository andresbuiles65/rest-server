const { check } = require('express-validator');
const {Router} = require('express');
const {validarcampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole,tieneRole } = require('../middlewares/validar-roles');
const { esRoleValido, emailExiste, existeUsuarioPorID } = require('../helpers/dbvalidators');
const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    check('rol').custom(esRoleValido),
    validarcampos    
] ,usuariosPut);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('correo','El correo es obligatorio').not().isEmpty().custom(emailExiste),
    check('password','El password debe de ser de más de 6 digitos').isLength({min:6}),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarcampos
] ,usuariosPost);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE','NOSE_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    validarcampos

],usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;

