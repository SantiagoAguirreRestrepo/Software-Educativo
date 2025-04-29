const User = require("../models/user");
const bcrypt = require('bcrypt');

exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    // Encriptar la contraseña, en la base de datos no nos mostrara la contraseña del usuario 
    const saltRounds = 10;
    const contraseñaEncriptada = await bcrypt.hash(contraseña, saltRounds);

    const usuario = new User({
      nombre,
      correo,
      contraseña: contraseñaEncriptada
    });

    await usuario.save();
    res.status(201).json(usuario);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await User.findOne({ correo });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Comparar la contraseña encriptada, aunque no podemos verla, el software podra compararla para permite el acceso del usuario a su cuenta
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarProgresoMatematicas = async (req, res) => {
  try {
    const { correo, nuevosPuntos } = req.body;

    const usuario = await User.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuario.progresoMatematico = nuevosPuntos;
    await usuario.save();

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarProgresoOrtografia = async (req, res) => {
  try {
    const { correo, nuevosPuntos } = req.body;

    const usuario = await User.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuario.progresoOrtografico = nuevosPuntos;
    await usuario.save();

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.obtenerProgresoUsuario = async (req, res) => {
  try {
    const { correo } = req.body;
    const usuario = await User.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      progresoMatematico: usuario.progresoMatematico,
      progresoOrtografico: usuario.progresoOrtografico
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};