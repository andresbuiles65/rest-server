const { check } = require('express-validator');
const {Router} = require('express');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const {validarJWT} = require('../middlewares/validar-jwt');
const { validarcampos } = require('../middlewares/validar-campos');
const { existeCategoria } = require('../helpers/dbvalidators');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.post('/',[ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','Esta categoria no existe').custom(existeCategoria),
    validarcampos
],crearProducto);


router.get('/',[
],obtenerProductos)

router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    validarcampos

],obtenerProducto);

router.put('/:id', [
    validarJWT,
    check('id','El ID no es correcto').isMongoId(),
    validarcampos  
], actualizarProducto);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
],borrarProducto);


module.exports = router;