const jwt = require('jsonwebtoken');
const config = require('../config');

//middleware
function verifyToken(req, res, next) {

    //recuperar el token a travez del header
    const token = req.headers['authorization'];

    //si no hay un token
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided, you don't have authorization" });
    }

    //si hay un token
    jwt.verify(token, config.key, (err, result) => {
        if(err){

            //los posibles errores son token expirado o incorrecto
            return res.status(401).json({ success: false, message: err.message });
        }

        //si todo va bien
        /*el id del usuario puede ser capturado aqui
         y guardado en req, de esta manera ya no se tendria que enviar
         en params, pero en esta ocasion lo recuperare así por params*/
        //req.user_id = result.user_id;     
        next();
    });
}

module.exports = verifyToken 