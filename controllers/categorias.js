const { response, request } = require("express");
const Categoria = require("../models/categoria");
const { bindAll } = require("express-validator/src/utils");

//ObtenerCategorías - Paginado -total -populate

const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 6, desde = 0 } = req.query;
  const query = { estado: true };
  const usuario = await Categoria.find().populate("usuario").exec();

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    (Categoria.usuario = usuario),
    Categoria.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};

// Obtener categoria por ID
const obtenerCategoria = async (req = request, res = response) => {
  // Leer y guardar el ID que me pasan por la URL
  const id = req.params.id;
  // Buscar en BD si existe y que devuelve el documento
  const categoria = await Categoria.findById(id);
  if (categoria) {
    res.status(200).json({
      categoria,
    });
  }
};

// Crear Categoria
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  // Guardar en DB
  await categoria.save();
  res.status(201).json(categoria);
};

// Modificar Categoria

const actualizarCategoria = async (req = request, res = response) => {
    // Leer y guardar el ID que me pasan por la URL
    const id = req.params.id;
    const {estado,usuario,_id,...resto} = req.body
    // Buscar en BD si existe y que devuelve el documento
    const categoria = await Categoria.findById(id);
    if (categoria) {
    // Cambiar solo el nombre
    const modificar = await Categoria.findByIdAndUpdate(id, resto)
      res.status(200).json({
        modificar
      });
    }
  };

  // Eliminar
  const borrarCategoria = async (req = request, res = response) => {

    const {id} = req.params;
   // borrar cambiando el estado
   const categoria = await Categoria.findByIdAndUpdate(id, {estado:false});
   const catAuten = categoria

    res.json({catAuten});
  };

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria
};
