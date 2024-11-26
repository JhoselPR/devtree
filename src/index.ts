import server from './server';

const port = process.env.PORT || 4000; //.PORT es variable de entorno que existe en todos los hosting que soportan Node.JS

server.listen(port, () => {
    console.log('Servidor funcionando en el puerto: ',4000);
})