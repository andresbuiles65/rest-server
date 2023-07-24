const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el Role sin validar el Token primero",
    });
  }
  const { rol, nombre } = req.usuario;
  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} No es administrador - no puede hacer esto`,
    });
  }
  next();
};

const tieneRole = (...roles) => {
  return (req, res = response, next) => {

    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el Role sin validar el Token primero",
      });
    }
    if( !roles.includes(req.usuario.rol)){
        return res.status(401).json({
            msg: `El servicio requiere uno de estos roles ${roles} `
        });
    }

    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRole,
};
