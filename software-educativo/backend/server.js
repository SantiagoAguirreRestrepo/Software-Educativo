const express = require('express');
const moongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/users', userRoutes);

//Base de datos en MongoDB
moongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado a la base de datos de MongoDB');
    app.listen(process.env.PORT, () => {
        console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    })
})
.catch(error => console.log('Error al conectar',error));