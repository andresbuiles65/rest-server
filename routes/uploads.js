const { check } = require('express-validator');
const {Router} = require('express');
const { validarcampos } = require('../middlewares/validar-campos');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.js');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

const router = Router();

router.post('/',validarArchivoSubir,cargarArchivo)

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El ID debe de ser de MONGO').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarcampos
 ],actualizarImagenCloudinary)
 //],actualizarImagen)

 router.get('/:coleccion/:id',[ 
    check('id','El ID debe de ser de MONGO').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarcampos
 ], mostrarImagen)

module.exports = router;