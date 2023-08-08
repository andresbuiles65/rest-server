const { check } = require('express-validator');
const {Router} = require('express');
const {existeCategoria} = require('../helpers/dbvalidators')
const  {validarJWT}  = require('../middlewares/validar-jwt');
const {validarcampos} = require('../middlewares/validar-campos');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();



//Obtener todas las categorias
router.get('/',obtenerCategorias);

//Obtener una categoria por ID
router.get('/:id',[
    check('id').custom(existeCategoria),
    check('id','No es un ID válido').isMongoId(),
    validarcampos
],obtenerCategoria);

// Crear categorias - privado -cualquier persona con token válido
router.post('/',[ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarcampos
],crearCategoria);


//Actualizar - Privado - Cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('id','El ID No es correcto').isMongoId(),
    check('nombre').trim().escape().customSanitizer(value => value.toUpperCase()),
    validarcampos
],actualizarCategoria);

//Borrar una categoría-Privado Admin 
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    validarcampos
],borrarCategoria);




module.exports= router;
