import {
  Container,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [puntosOrtografia, setPuntosOrtografia] = useState(0);
  const [puntosMatematico, setPuntosMatematico] = useState(0);

  useEffect(() => {
    const sessionStatus = localStorage.getItem("isLoggedIn");
    setLoggedIn(sessionStatus === "true");

    const correo = localStorage.getItem("userCorreo");
    if (correo) {
      axios
        .post("http://localhost:5000/api/users/obtener-progreso", { correo })
        .then((res) => {
          if (res.data) {
            if (typeof res.data.progresoOrtografico === "number") {
              setPuntosOrtografia(res.data.progresoOrtografico);
            }
            if (typeof res.data.progresoMatematico === "number") {
              setPuntosMatematico(res.data.progresoMatematico);
            }
          }
        })
        .catch((error) => {
          console.error("❌ Error obteniendo progreso:", error);
        });
    }
  }, []);

  const handleSessionAction = () => {
    if (loggedIn) {
      // Cerrar sesión
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName"); // También borra el nombre guardado
      localStorage.removeItem("userCorreo");
      setLoggedIn(false); // Actualiza estado local
      navigate("/"); // Vuelve al login
    } else {
      // Si no estaba logueado, simplemente ir al login
      navigate("/login");
    }
  };

  const goToMath = () => {
    navigate("/math");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Área Principal
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Elige una opción para comenzar:
      </Typography>

      {loggedIn && (
        <>
          <Typography variant="h6">
            Puntos en Matemáticas: {puntosMatematico}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(puntosMatematico, 100)}
            sx={{ height: 10, borderRadius: 5, mb: 3 }}
          />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Puntos en Ortografía: {puntosOrtografia}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(puntosOrtografia, 100)}
            sx={{ height: 10, borderRadius: 5, mb: 3 }}
          />
        </>
      )}

      <Stack spacing={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={goToMath}
        >
          Ir al área de Matemáticas
        </Button>

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => navigate("/spelling")}
        >
          Ir al área de Ortografía
        </Button>
        <Button
          variant="outlined"
          color={loggedIn ? "error" : "success"}
          fullWidth
          onClick={handleSessionAction}
        >
          {loggedIn ? "Cerrar Sesión" : "Iniciar Sesión"}
        </Button>
      </Stack>
    </Container>
  );
}
