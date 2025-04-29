import { useState, useEffect } from "react";
import { Container, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Motivacion = [
  "¡Buen trabajo!",
  "¡Bien hecho!",
  "¡Felicitaciones!",
  "¡Nada mal!",
  "¡Increíble!",
];

export default function MathPage() {
  const navigate = useNavigate();
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operacion, setOperacion] = useState("+");
  const [respuesta, setRespuesta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [puntos, setPuntos] = useState(0);
  const [bloquearBoton, setBloquearBoton] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargarProgresoMatematico = async () => {
    const correo = localStorage.getItem('userCorreo');
    if (correo) {
      try {
        const res = await axios.post('http://localhost:5000/api/users/obtener-progreso', { correo });
        if (res.data && typeof res.data.progresoMatematico === 'number') {
          setPuntos(res.data.progresoMatematico);
          console.log('Progreso de ortografía cargado:', res.data.progresoMatematico);
        }
      } catch (error) {
        console.error('Error al cargar progreso de ortografía:', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const iniciarJuego = async () => {
      await cargarProgresoMatematico();
      generarEjercicio();
    };
  
    iniciarJuego();
  }, []);

  const generarEjercicio = () => {
    const operaciones = ["+", "-", "*", "/"];
    const nuevaOperacion =
      operaciones[Math.floor(Math.random() * operaciones.length)];
    const nuevoNum1 = Math.floor(Math.random() * 10) + 1;
    const nuevoNum2 = Math.floor(Math.random() * 10) + 1;

    setOperacion(nuevaOperacion);
    setNum1(nuevoNum1);
    setNum2(nuevoNum2);
    setRespuesta("");
    setMensaje("");
    setIntentosFallidos(0);
    setMostrarPista(false);
    setBloquearBoton(false);
  };

  const calcularResultado = () => {
    switch (operacion) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return parseFloat((num1 / num2).toFixed(2));
      default:
        return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (bloquearBoton) return; // Evitar múltiples envíos, pues el usuario puede hacerlo y generar puntos gratis
  
    if (intentosFallidos >= 3) {
      setMostrarPista(true);
      return;
    } 
  
    const resultadoCorrecto = calcularResultado();
  
    if (parseFloat(respuesta) === resultadoCorrecto) {
      const correo = localStorage.getItem("userCorreo");
  
      const nuevosPuntos = puntos + 10; // Calculamos manualmente
      setPuntos(nuevosPuntos);           // Actualizamos en pantalla
      setMensaje(Motivacion[Math.floor(Math.random() * Motivacion.length)]);
      setBloquearBoton(true);
  
      if (correo) {
        try {
          console.log("Actualizando", correo, nuevosPuntos)
          await axios.post("http://localhost:5000/api/users/matematicas", {
            correo,
            nuevosPuntos, // Manda explícitamente los nuevos puntos
          });
          console.log("✅ Puntos actualizados correctamente en MongoDB:", nuevosPuntos);
        } catch (error) {
          console.error("❌ Error actualizando progreso en MongoDB:", error);
        }
      }
  
      setTimeout(() => {
        generarEjercicio();
      }, 2000);
    } else {
      setIntentosFallidos((prev) => prev + 1);
      setMensaje("Vaya, respuesta incorrecta, ¡intenta de nuevo!");
      if (intentosFallidos + 1 >= 3) {
        setMostrarPista(true);
      }
    }
  };

  const rendirse = () => {
    const resultadoCorrecto = calcularResultado();
    setMensaje(`La respuesta correcta era: ${resultadoCorrecto}`);
    setBloquearBoton(true);
    setTimeout(() => {
      generarEjercicio();
    }, 2000);
  };

  const Home = () => {
    navigate("/");
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
      <Typography variant="h4" gutterBottom>
        Juego de Matemáticas
      </Typography>
      <Typography variant="h5" gutterBottom>
        {num1} {operacion} {num2} = ?
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Tu respuesta"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          margin="normal"
          disabled={bloquearBoton} // Evita escribir cuando bloqueado
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={bloquearBoton}
        >
          Enviar Respuesta
        </Button>
      </form>

      
      {mensaje && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          {mensaje}
        </Typography>
      )}

      {mostrarPista && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          💡 Pista: Piensa en la operación {operacion}
        </Typography>
      )}

      {intentosFallidos >= 3 && !bloquearBoton && (
        <Button
          onClick={rendirse}
          variant="outlined"
          color="error"
          sx={{ mt: 2 }}
        >
          Rendirse y ver respuesta
        </Button>
      )}

      <Typography variant="h6" sx={{ mt: 4 }}>
        Puntos: {puntos}
      </Typography>

      

      <Button variant="contained" color="primary" fullWidth onClick={Home}>
        Volver
      </Button>
    </Container>
  );
}
