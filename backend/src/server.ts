//const express = require('express'); //Common JS
import express from 'express'; //ESM sintaxis
import cors from 'cors';
import 'dotenv/config'; // Cargar variables de entorno
import router from './router';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';

connectDB(); // Conexión a la base de datos

const app = express();

// Cors
app.use(cors(corsConfig));

app.use(express.json()); // Leer datos de formularios

app.use('/', router); // .use : cada que hay una petición a la URL principal se va a ejecutar la función router y va a entrar a todos los métodos que tengamos, mapeando cada una de las URL


export default app;