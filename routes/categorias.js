const { check } = require('express-validator');
const {Router} = require('express');
const  {validarJWT}  = require('../middlewares/validar-jwt');
const {validarcampos} = require('../middlewares/validar-campos');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');


const router = Router();



//Obtener todas las categorias
router.get('/',obtenerCategorias);

//Obtener una categoria por ID
router.get('/:id',[
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
    check('nombre').trim().escape().customSanitizer(value => value.toUpperCase()),
],actualizarCategoria);

//Borrar una categoría -Privado Admin 
router.delete('/:id',borrarCategoria);




module.exports= router;
