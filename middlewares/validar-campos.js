const { validationResult, check } = require('express-validator');


const validarcampos = (req,res,next )=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json(errors);
    }
    
    next();
}
module.exports={
    validarcampos,
}

