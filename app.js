const express = require( 'express' );
const mongoose = require( 'mongoose' );

const app = express();

mongoose.connection.openUri( 'mongodb://localhost:27017/hospitalDB', ( err, res ) => {
    if ( err ) throw err;

    console.log( "Conexión con mongodb correcta" );
} );

app.set( 'port', process.env.PORT || 3000 );

app.listen( app.get('port'), () => {
    console.log( "servidor corriendo en \x1b[32m%s\x1b[0m", "localhost:3000" );
} );
