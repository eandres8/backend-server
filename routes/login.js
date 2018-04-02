const express = require( 'express' );
const bcrypt = require( 'bcryptjs' );
const Usuario = require( '../models/usuario' );
const jwt = require( 'jsonwebtoken' );

const SEED = require( '../config/config' ).SEED;

const app = express();

app.post( '/', ( req, res ) => {
    let body = req.body;
    Usuario.findOne( { email: body.email }, ( err, usuarioDB ) => {

        if ( err ) {
            return res.status( 500 ).json( {
                ok:false,
                mensaje: 'Error al buscar un usuario',
                errors: err
            } );
        }

        if ( !usuarioDB ){
            return res.status( 400 ).json( {
                ok:false,
                mensaje: 'Credenciales incorrectas - email',
                errors: {}
            } );
        }

        if ( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {
            return res.status( 400 ).json( {
                ok:false,
                mensaje: 'Credenciales incorrectas - password',
                errors: {}
            } );
        }

        //  Crear un token!!!
        usuarioDB.password = ':v';
        let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 } );// 4 horas

        res.status(200).json({
            ok:true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    } );
} );

module.exports = app;
