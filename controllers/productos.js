const { response, request } = require("express");
const Producto = require('../models/producto')

// Crear Producto
const crearProducto = async (req = request, res = response) =>{
    const {nombre, precio,descripcion,disponible,categoria} = req.body
  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }
  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
    precio,
    categoria,
    descripcion,
    disponible
  };

  const producto = new Producto(data)
  // Guardar en BD
  await producto.save();
  res.json(producto)
}

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 6, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query).populate('usuario',{nombre:1}).populate('categoria',{nombre:1})
    .skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
  });
};

  const obtenerProducto = async (req = request, res = response) => {
    // Leer y guardar el ID que me pasan por la URL
    const id = req.params.id;
    // Buscar en BD si existe y que devuelve el documento
    const producto = await Producto.findById(id).populate('usuario',{nombre:1}).populate('categoria',{nombre:1});
    if (producto) {
      res.status(200).json({
        producto,
      });
    }
  };

  const actualizarProducto = async (req = request, res = response) => {
    // Leer y guardar el ID que me pasan por la URL
    const id = req.params.id;
    const {estado,usuario,categoria,_id,...resto} = req.body
    // Buscar en BD si existe y que devuelve el documento
    const producto = await Producto.findById(id);
    try {
      if (producto) {
        // Cambiar solo el nombre
        const modificar = await Producto.findByIdAndUpdate(id, resto,{new:true});
          res.status(200).json({
            modificar
          });
        }
    } catch (error) {
      res.status(400).json({
        msg: ` Nombre de Usuario invalido, ya se encuentra registrado `
      })      
    }
  };
  const borrarProducto = async (req = request, res = response) => {

    const {id} = req.params;
   // borrar cambiando el estado
   //const {usuario } = Categoria 
   //console.log({usuario})
   const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});
   const prodAuten = producto

    res.json({prodAuten});
  };

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}