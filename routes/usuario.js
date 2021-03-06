const express = require( 'express' );
const bcrypt = require( 'bcryptjs' );
const Usuario = require( '../models/usuario' );
const jwt = require( 'jsonwebtoken' );

const mdAuth = require( '../middlewares/autenticacion' );

const app = express();

// ========================================================
// Obtiene todos los usuarios
// ========================================================
app.get( '/', ( req, res, next ) => {

    Usuario.find({}, 'nombre email img role')
        .exec( ( err, usuarios ) => {
        if ( err ) {
            return res.status( 500 ).json( {
                ok:false,
                mensaje: 'Error consultando usuarios',
                errors: err
            } );
        }

        res.status( 200 ).json( {
            ok:true,
            usuarios: usuarios
        } );

    } );

} );

// ========================================================
// Actualiza un usuario
// ========================================================
app.put( '/:id', mdAuth.verificaToken, ( req, res ) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findById( id, ( err, usuario ) => {
        if ( err ) {
            return res.status( 500 ).json( {
                ok:false,
                mensaje: 'Error al buscar usuario',
                errors: err
            } );
        }

        if( !usuario ){
            return res.status( 400 ).json( {
                ok:false,
                mensaje: 'El usuario con el id '+id+' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            } );
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( ( err, usuarioGuardado ) => {
            if ( err ) {
                return res.status( 400 ).json( {
                    ok:false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                } );
            }

            usuarioGuardado.password = ':V';

            res.status( 200 ).json( {
                ok:true,
                usuario: usuarioGuardado
            } );

        } );

    } );

} );

// ========================================================
// Crear un nuevo usuario
// ========================================================
app.post( '/', mdAuth.verificaToken, ( req, res ) => {
    let body = req.body;
    let hash = bcrypt.hashSync( body.password, 10 );

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: hash,
        img: body.img,
        role: body.role
    });

    usuario.save( ( err, usuarioGuardado ) => {
        if ( err ) {
            return res.status( 400 ).json( {
                ok:false,
                mensaje: 'Error al crear un usuario',
                errors: err
            } );
        }

        res.status( 201 ).json( {
            ok:true,
            usuario: usuarioGuardado
        } );
    } );

} );

// ========================================================
// Elimina un usuario por el id
// ========================================================
app.delete( '/:id', mdAuth.verificaToken, ( req, res ) => {
    let id = req.params.id;
    Usuario.findByIdAndRemove( id, ( err, usuarioBorrado ) => {
        if ( err ) {
            return res.status( 500 ).json( {
                ok:false,
                mensaje: 'Error al eliminar un usuario',
                errors: err
            } );
        }

        if ( !usuarioBorrado ) {
            return res.status( 400 ).json( {
                ok:false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese ID' }
            } );
        }

        res.status( 200 ).json( {
            ok: true,
            usuario: usuarioBorrado
        } );
    } );
} );



module.exports = app;
