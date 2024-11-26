//const express = require('express'); //Common JS
import express from 'express'; //ESM sintaxis
import router from './router';
const app = express();

app.use('/', router); //.use : cada que hay una petición a la URL principal se va a ejecutar la función router y va a entrar a todos los métodos que tengamos, mapeando cada una de las URL



export default app;