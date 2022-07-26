const getConnection = require('../database');
const config = require('./../config');
const jwt = require('jsonwebtoken');

//sign up
const signUp = async (req, res) => {
    try {
        //obtener los valores
        const { email, password, username } = req.body;

        //obtener la conexion
        const connection = await getConnection();

        //ejecutar una consulta para saber si ya hay una cuenta con el correo
        await connection.query('SELECT * FROM User WHERE email = ?', email, async (err, result) => {

            //si hay datos, quiere decir que si existe
            if (result.length) {
                return res.status(400).json({ success: false, message: "That email is already in use, please try with another email" });
            }
            else {
                //ahora verificar si el nombre de usuario ya existe
                await connection.query('SELECT * FROM User WHERE username = ?', username, async (err, result) => {

                    //si hay datos, quiere decir que si existe
                    if (result.length) {
                        return res.status(400).json({ success: false, message: "The username already exist, choose another" });
                    }
                    else {
                        //de todo lo contrario insertar el usuario en la base de datos
                        await connection.query('INSERT INTO User (email, password, username) VALUES (?, aes_encrypt(?, ?), ?)', [email, password, config.encryptkey, username], (err, result) => {

                            //si ocurre un error
                            if (err) {
                                return res.status(400).json({ success: false, message: err.sqlMessage })
                            }

                            //si no hubo un error crear el token
                            const token = jwt.sign({ user_id: result.insertId }, config.key, { expiresIn: '2m' });

                            //devolver la respuesta
                            return res.status(201).json({
                                success: true,
                                message: 'Account created successfully!',
                                user_id: result.insertId,
                                username: username,
                                token: token
                            });
                        });
                    }
                });
            }
        });
    } catch (err) {
        res.status(500).json({ succes: false, message: error });
    }
};

//login
const login = async (req, res) => {
    try {
        //obtener los valores 
        const { email, password } = req.body;

        //obtener la conexion
        const connection = await getConnection();

        //ejecutamos la consulta
        await connection.query('SELECT * FROM User WHERE email = ? AND AES_DECRYPT(password,?) = ?', [email, config.encryptkey, password], async (err, result) => {

            //si las credenciales estan incorrectas
            if (result.length == 0) {
                return res.status(401).json({ success: false, message: 'Email or Password incorrect' });
            }

            //si todos es correcto generar el token
            const token = jwt.sign({ user_id: result[0]['id'] }, config.key, { expiresIn: '2m' });

            //y enviar la respuesta
            res.status(200).json({
                success: true,
                logged_in: true,
                message: 'Welcome! ' + result[0]['username'],
                user_id: result[0]['id'],
                username: result[0]['username'],
                token: token
            });
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: error });
    }
}

//update
const updateUser = async (req, res) => {
    try {
        //obtener los valores
        const { id } = req.params;
        const username = req.body.username;

        //obtener la conexion
        const connection = await getConnection();

        //ejecutar consulta para actualizar
        await connection.query('UPDATE User SET username = ? WHERE id = ?', [username, id], (err, result) => {

            //si ocurre un error
            if (err) {
                return res.status(400).json({ success: false, message: err.sqlMessage })
            }

            //si no hubo un error, responder que se actualizo la contraseña
            res.status(200).json({ success: true, message: 'Username updated!' });
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: error });
    }
};

//delete
const deleteUser = async (req, res) => {
    try {
        //obtener los valores 
        const { id } = req.params;

        //obtener la conexion
        const connection = await getConnection();

        //ejecutar consulta y enviar el id para eliminar
        await connection.query('DELETE FROM User WHERE id = ?', id, (err) => {

            //si ocurre un error
            if (err) {
                return res.status(400).json({ success: false, message: err.sqlMessage })
            }

            //si no hubo un error, responder que se elimino el website
            res.status(200).json({ success: true, message: 'Account deleted!' });
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: error });
    }
};

module.exports = {
    signUp,
    login,
    updateUser,
    deleteUser
};