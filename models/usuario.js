const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

const Schema = mongoose.Schema;

let roles_validos = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    message: '{VALUE} no es un rol valido'
};

const usuarioSchema = new Schema( {
    nombre: { type: String, required: [true, 'El nombre es necesario' ] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario' ] },
    password: { type: String, required: [true, 'La contraseña es necesaria' ] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roles_validos }
} );

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único' } );

module.exports = mongoose.model( 'Usuario', usuarioSchema );