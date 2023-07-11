const {response, request} = require('express')

const usuariosGet = (req = request, res = response) =>{
    const {q,nombre ='no name',apikey} = req.query;
    res.json({
        msg:'get API -Controlador ',
        q,
        nombre,
        apikey
    });
}

const usuariosPut = (req = request, res = response) =>{
    const id = req.params.id
    res.json({
        msg:'Put API - Controlador',
        id
    });
}

const usuariosPost = (req, res = response) =>{

    const {nombre, edad} = req.body;
    res.json({
        msg:'Post API- Controlador',
        nombre,
        edad
    });

}


const usuariosDelete = (req, res= response) =>{
    res.json({
        msg:'Delete API-Controlador'
    });

}

const usuariosPatch = (req, res = response) =>{
    res.json({
        msg:'Patch API- Controller'
    });

}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}