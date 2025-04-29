import { useState } from 'react'
import {Button, TextField, Container, Typography} from '@mui/material'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default function LoginPage() {
    const [correo, setCorreo] = useState('')
    const [contraseña, setContraseña] = useState('')

    const navigate = useNavigate()
    
    const handleLogin = async () => {
        if (!correo || !contraseña) {
          alert('Por favor, completa todos los campos.');
          return;
        }
      
        // Validar formato de correo
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(correo)) {
          alert('Por favor, ingresa un correo válido.');
          return;
        }
      
        try {
          const res = await axios.post('http://localhost:5000/api/users/login', {
            correo,
            contraseña
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
      
          alert('Bienvenido ' + res.data.nombre);
      
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', res.data.nombre);
          localStorage.setItem('userCorreo', res.data.correo);
          navigate('/');
          
        } catch (error) {
          alert('Credenciales incorrectas');
          console.error('Error en login:', error.response ? error.response.data : error.message);
        }
      };
      
      
      const Home = () => {
        navigate("/");
      };
    

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Iniciar sesión</Typography>
            <TextField fullWidth label="Correo" margin="normal" onChange={(e) => setCorreo(e.target.value)} />
            <TextField fullWidth label="Contraseña" type="password" margin="normal" onChange={(e) => setContraseña(e.target.value)} />
            <Button variant="contained" fullWidth onClick={handleLogin}>Ingresar</Button>
            <Button variant="contained" fullWidth onClick={Home}>Continuar sin cuenta</Button>
            <Button onClick={()=> navigate('/register')}>¿No tienes cuenta? Registrate</Button>        
        </Container>
    )
}