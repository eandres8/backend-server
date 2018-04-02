const express = require( 'express' );
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' );

const appRoutes = require( './routes/app' );
const usuarioRoutes = require( './routes/usuario' );
const loginRoutes = require( './routes/login' );

// Inicializar variables
const app = express();

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended:false } ) );
// parse application/json
app.use( bodyParser.json() );

// Conexión a DB
mongoose.connection.openUri( 'mongodb://localhost:27017/hospitalDB', ( err, res ) => {
    if ( err ) throw err;

    console.log( "Conexión con mongodb correcta" );
} );

// Rutas
app.use( '/usuario', usuarioRoutes );
app.use( '/login', loginRoutes );
app.use( '/', appRoutes );

// Puerto
app.set( 'port', process.env.PORT || 3000 );

app.listen( app.get('port'), () => {
    console.log( "servidor corriendo en \x1b[32m%s\x1b[0m", "localhost:3000" );
} );
