const { response, request } = require('express')
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req= request,res=response,next) =>{

    const token = req.header('x-token');
    if(!token){
        return res.status(400).json({
            msg:'No hay token en la petición'
        });
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario que corresponde al UID
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg:'Token no válido - Usuario no existe DB'
            });
        }

        // Verificar si el UID tiene el estado en true
        if( !usuario.estado ){
            return res.status(401).json({
                msg:'Token no válido - Usuario con estado false'
            });
        }else{
        req.usuario = usuario;
        next();
        }
        
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
        
    }
    

}


module.exports = {
    validarJWT
}