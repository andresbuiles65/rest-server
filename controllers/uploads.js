const path = require('path');
const fs = require('fs');
const { response, request } = require("express");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);
const { subirArchivo } = require("../helpers");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

const cargarArchivo = async (req, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({ nombre });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  try {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el ID ${id}`,
          });
        }
        break;

      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un producto con el ID ${id}`,
          });
        }
        break;

      default:
        return res.status(400).json({ msg: "Se me olvidó validar esto" });
    }
    

    // Limpiar imagenes previas

    if(modelo.img){
      // Hay que borrar IMG del servidor
      const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
      if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
      }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
    res.json(modelo);
  } 
  catch (error) {
    res.status(400).json(error);
  }
};


const mostrarImagen = async (req, res=response)=>{

  try {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el ID ${id}`,
          });
        }
        break;

      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un producto con el ID ${id}`,
          });
        }
        break;

      default:
        return res.status(400).json({ msg: "Se me olvidó validar esto" });
    }
    

    // Limpiar imagenes previas

    if(modelo.img){
      // Hay que borrar IMG del servidor
      const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
      if(fs.existsSync(pathImagen)){
        return res.sendFile(pathImagen)
      }
    }
    const dontimage = path.join(__dirname,'../assets/no-image.jpg')
    return res.sendFile(dontimage)
  } 
  catch (error) {
    res.status(400).json(error);
  }
}

const actualizarImagenCloudinary = async (req = request, res = response) => {
  try {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el ID ${id}`,
          });
        }
        break;

      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un producto con el ID ${id}`,
          });
        }
        break;

      default:
        return res.status(400).json({ msg: "Se me olvidó validar esto" });
    }
    

    // Limpiar imagenes previas
    if(modelo.img){
      const nombreArr = modelo.img.split('/');
      const nombre = nombreArr[nombreArr.length-1];
      const [ public_id]= nombre.split('.');
      cloudinary.uploader.destroy(public_id);

    }
    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    await modelo.save();
    res.json(modelo);
  } 
  catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
};
