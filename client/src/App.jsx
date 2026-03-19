import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif' }}>
        <Routes>
          <Route path="/" element={
            <div style={{ padding: '20px' }}>
              <h1>Le Pan - E-commerce</h1>
              <p>Bienvenido. El frontend base está configurado correctamente en Vite.</p>
              <p>(Aquí irá el Home de tu compañero)</p>
              <a href="/productos">Ir al Catálogo</a>
            </div>
          } />
          <Route path="/productos" element={<Catalogo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
