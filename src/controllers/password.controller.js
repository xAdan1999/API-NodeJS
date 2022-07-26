const getConnection = require('../database');
const config = require('../config');

//get all paswords
const getPasswords = async (req, res) => {
    try {
        //obtener el id para traer la informacion de cierto usuario
        //const user_id = req.user_id;
        const user_id = req.params.user_id;

        //obtener la conexion 
        const connection = await getConnection();

        //ejecutar la consulta y traer los registros del usuario a traves del id
        await connection.query('SELECT id, title, username_or_email, CAST(aes_decrypt(password, ?) as char) as password, date_format(created_at, "%d-%m-%Y %h:%i %p") as created, date_format(updated_at, "%d-%m-%Y %h:%i %p") as updated FROM Password WHERE user_id = ? ORDER BY id DESC', [config.encryptkey, user_id], (err, result) => {

            //si se captura un error
            if (err) {
                return res.status(400).json({ success: false, message: err.sqlMessage })
            }

            //si la consulta obtuvo datos, responder
            if (result.length) {
                res.status(200).json(result);
            }
            else {

                //de lo contrario simplemente informar que aun no hay informacion para mostrar
                res.status(404).json({ message: 'Not data found yet' });
            }
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: "Server error" });
    }
};

//search
const searchPassword = async (req, res) => {
    try {
        //obtener el id para traer la informacion de cierto usuario
        //const user_id = req.user_id;
        const user_id = req.params.user_id;

        //obtener el valor a buscar
        const title = req.query.title;

        //obtener la conexion
        const connection = await getConnection();

        //ejecutar la consulta y traer los registros del usuario a traves del id capturado por el middleware
        await connection.query('SELECT id, title, username_or_email, CAST(aes_decrypt(password, ?) as char) as password, date_format(created_at, "%d-%m-%Y %h:%i %p") as created, date_format(updated_at, "%d-%m-%Y %h:%i %p") as updated FROM Password WHERE title LIKE ? AND user_id = ? ORDER BY id DESC', [config.encryptkey, '%' + title+ '%', user_id], (err, result) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.sqlMessage })
            }
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: "Server error" });
    }
};

//insert
const insertPassword = async (req, res) => {
    try {
        //obtener los valores 
        //const user_id = req.user_id;
        const { user_id, title, username_or_email, password } = req.body;

        //obtener la conexion
        const connection = await getConnection();

        //ejecutar consulta para insertar
        await connection.query('INSERT INTO Password (user_id, title, username_or_email, password) VALUES (?,?,?, aes_encrypt(?, ?))', [user_id, title, username_or_email, password, config.encryptkey], (err, result) => {

            //si ocurre un error
            if (err) {
                return res.status(400).json({ success: false, message: err.sqlMessage})
            }

            //si no hubo un error, responder que la contraseña se guardo
            res.status(200).json({ success: true, message: 'Password saved!' });
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: "Server error" });
    }
};

//update
const updatePassword = async (req, res) => {
    try {
        //obtener los valores
        const { id } = req.params;
        const { title, username_or_email, password } = req.body;

        //obtener la conexion
        const connection = await getConnection();

        //ejecutar consulta para actualizar
        await connection.query('UPDATE Password SET title = ?, username_or_email = ?, password = (aes_encrypt(?, ?)) WHERE id = ?', [title, username_or_email, password, config.encryptkey, id], (err, result) => {

            //si ocurre un error
            if (err) {
                return res.status(400).json({ success: false, message: err.sqlMessage })
            }

            //si no hubo un error, responder que se actualizo la contraseña
            res.status(200).json({ success: true, message: 'Password updated!' });
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: "Server error" });
    }
};

//delete
const deletePassword = async (req, res) => {
    try {
        //obtener los valores 
        const { id } = req.params;

        //obtener la conexion
        const connection = await getConnection();

        //ejecutar consulta y enviar el id para eliminar
        await connection.query('DELETE FROM Password WHERE id = ?', id, (err) => {

            //si ocurre un error
            if (err) {
                return res.status(400).json({ success: false, message: err.sqlMessage })
            }

            //si no hubo un error, responder que se elimino el website
            res.status(200).json({ success: true, message: 'Password deleted!' });
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: "Server error" });
    }
};

module.exports = {
    getPasswords,
    searchPassword,
    insertPassword,
    updatePassword,
    deletePassword
};