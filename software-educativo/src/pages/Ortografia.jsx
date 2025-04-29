import { useState, useEffect } from "react";
import { Container, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const palabras = [
  { palabra: "analisar", correcta: "analizar" },
  { palabra: "opinión", correcta: "opinión" },
  { palabra: "ecxelente", correcta: "excelente" },
  { palabra: "felicidad", correcta: "felicidad" },
  { palabra: "comensar", correcta: "comenzar" }
];

const mensajesExito = [
  "¡Muy bien!",
  "¡Perfecto!",
  "¡Sigue así!",
  "¡Excelente trabajo!",
  "¡Eres un genio!"
];

export default function SpellingPage() {
  const navigate = useNavigate();
  const [palabraActual, setPalabraActual] = useState("");
  const [respuestaCorrecta, setRespuestaCorrecta] = useState("");
  const [respuestaUsuario, setRespuestaUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [puntosOrtografia, setPuntosOrtografia] = useState(0);
  const [bloquearBoton, setBloquearBoton] = useState(false);
  const [loading, setLoading] = useState(true);
  

  const cargarProgresoOrtografia = async () => {
    const correo = localStorage.getItem('userCorreo');
    if (correo) {
      try {
        const res = await axios.post('http://localhost:5000/api/users/obtener-progreso', { correo });
        if (res.data && typeof res.data.progresoOrtografico === 'number') {
          setPuntosOrtografia(res.data.progresoOrtografico);
          console.log('✅ Progreso de ortografía cargado:', res.data.progresoOrtografico);
        } else {
          setPuntosOrtografia(0); // fallback si no trae progreso
        }
      } catch (error) {
        console.error('❌ Error cargando progreso de ortografía:', error);
        setPuntosOrtografia(0); // fallback por error
      }
    } else {
      // ⚠️ Aquí estaba el problema: si no hay sesión, no reinicias puntos
      console.log('⚠️ No hay usuario logueado, puntos a 0');
      setPuntosOrtografia(0);
    }
  
    setLoading(false);
  };
  

  useEffect(() => {
    const iniciarJuego = async () => {
      await cargarProgresoOrtografia();
      generarNuevaPalabra();
    };
  
    iniciarJuego();
  }, []);

  const generarNuevaPalabra = () => {
    const seleccion = palabras[Math.floor(Math.random() * palabras.length)];
    setPalabraActual(seleccion.palabra);
    setRespuestaCorrecta(seleccion.correcta);
    setRespuestaUsuario("");
    setMensaje("");
    setBloquearBoton(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bloquearBoton) return;

    if (respuestaUsuario.trim().toLowerCase() === respuestaCorrecta.trim().toLowerCase()) {
      const nuevosPuntos = puntosOrtografia + 10;
      setPuntosOrtografia(nuevosPuntos);
      setMensaje(mensajesExito[Math.floor(Math.random() * mensajesExito.length)]);
      setBloquearBoton(true);

      const correo = localStorage.getItem('userCorreo');
      if (correo) {
        try {
          console.log("Actualizando", correo, nuevosPuntos)
          await axios.post("http://localhost:5000/api/users/ortografia", {
            correo,
            nuevosPuntos, // Manda explícitamente los nuevos puntos
          });
          console.log("✅ Puntos actualizados correctamente en MongoDB:", nuevosPuntos);
        } catch (error) {
          console.error("❌ Error actualizando progreso en MongoDB:", error);
        }
      }

      setTimeout(() => {
        generarNuevaPalabra();
      }, 2000);
    } else {
      setMensaje("Vaya, respuesta incorrecta, ¡intenta de nuevo!");
    }
  };

  const rendirse = () => {
    setMensaje(`La respuesta correcta era: "${respuestaCorrecta}"`);
    setBloquearBoton(true);
    setTimeout(() => {
      generarNuevaPalabra();
    }, 2500);
  };

  const volver = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h6">Cargando progreso...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Juego de Ortografía</Typography>
      <Typography variant="h5" gutterBottom>
        Corrige o confirma: "{palabraActual}"
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Tu corrección"
          value={respuestaUsuario}
          onChange={(e) => setRespuestaUsuario(e.target.value)}
          margin="normal"
          disabled={bloquearBoton}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={bloquearBoton}
        >
          Enviar
        </Button>
      </form>

      {mensaje && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          {mensaje}
        </Typography>
      )}

      {!bloquearBoton && (
        <Button
          onClick={rendirse}
          variant="outlined"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
        >
          Rendirse y ver respuesta
        </Button>
      )}

      <Typography variant="h6" sx={{ mt: 4 }}>
        Puntos Ortografía: {puntosOrtografia}
      </Typography>

      <Button variant="contained" color="primary" fullWidth onClick={volver} sx={{ mt: 2 }}>
        Volver
      </Button>
    </Container>
  );
}
