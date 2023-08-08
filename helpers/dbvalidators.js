const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const esRoleValido = async (rol ='' ) =>{
    const existeRol = await Role.findOne({ rol });
    if(!existeRol){
        throw new Error(`El rol: ${rol} no esta registrado en la BD`)
    }
}

const emailExiste = async (correo ='') =>{
const existeEmail = await Usuario.findOne({correo});
if(existeEmail){
    throw new Error (`El correo ${correo} ya se encuentra registrado en la BD`)
    }
}

const existeUsuarioPorID = async (id ='') =>{
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error (`El id ${id} no existe`)
        }
    }

const existeCategoria = async (id ='')=>{
    const existeCat = await Categoria.findById(id);
    if(!existeCat){
        throw new Error (`El id ${id} no existe`)
    }

}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion ='',colecciones =[])=>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La colección ${coleccion} no es permitida en : ${colecciones}`)
    }
    return true;
}

module.exports ={
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoria,
    coleccionesPermitidas
}