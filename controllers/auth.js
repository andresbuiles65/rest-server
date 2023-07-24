const { response, json } = require("express");
const { body } = require("express-validator");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const { DefaultTransporter } = require("google-auth-library");

function getRandomOptionFromModelEnum() {
  const enumOptions = Usuario.schema.path('rol').enumValues;
  const randomIndex = Math.floor(Math.random() * enumOptions.length);
  return enumOptions[randomIndex];
}

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Email o Contraseña no son validos -Email",
      });
    }
    // Si el usuario esta activo
    if (usuario.estado != true) {
      return res.status(400).json({
        msg: "Email o contraseña no valido Estado-false",
      });
    }
    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Email o password no son correctos - Password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador ",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const {correo,nombre,img } = await googleVerify(id_token );
    let usuario = await Usuario.findOne({correo});
    if(!usuario){
      // Tengo que crearlo
      const data ={
        nombre,
        correo,
        password: ':P',
        img,
        rol: getRandomOptionFromModelEnum(),
        google:true
      };
      usuario = new Usuario(data);
      console.log(usuario);
      await usuario.save();
    }
    // Si el estado del usuario es false
    if(!usuario.estado){
      return res.status(401).json({
        msg:'Hable con el administrador, usuario bloqueado'
      });
    }
    // Generar el JWT
    const token = await generarJWT(usuario.id)
    res.json({
      usuario,
      token
    })

  } catch (error) {
    res.status(400).json({
        ok:false,
        msg:'El token no se pudo verificar '
    })
  }
};

module.exports = {
  login,
  googleSignIn,
};
