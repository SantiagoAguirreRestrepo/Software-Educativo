import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones antes de enviar
    if (!form.nombre || !form.correo || !form.contraseña) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Validar formato de correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(form.correo)) {
      alert("Por favor, ingresa un correo válido.");
      return;
    }

    // Validar longitud de contraseña
    if (form.contraseña.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // IMPORTANTE: Cambiar a la ruta correcta del backend
      await axios.post("http://localhost:5000/api/users", form, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Usuario Registrado con éxito");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(
        "Error al registrar: " +
          (error.response?.data?.error || "Error desconocido")
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Registro
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Correo"
          name="correo"
          type="email"
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Contraseña"
          name="contraseña"
          type="password"
          margin="normal"
          onChange={handleChange}
        />
        <Button type="submit" fullWidth variant="contained">
          Registrarse
        </Button>
        <Button onClick={() => navigate("/login")}>
          ¿Ya tienes cuenta? Ingresa
        </Button>
      </form>
    </Container>
  );
}
