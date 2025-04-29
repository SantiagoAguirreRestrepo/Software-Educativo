const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true},
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    progresoOrtografico: { type: Number, default: 0 },
    progresoMatematico: { type: Number, default: 0 },
    medallas: { type: [String], default: [] }
});

module.exports = mongoose.model('User', userSchema);