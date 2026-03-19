import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.jsx';
import Catalogo from './pages/Catalogo';
import CombosPage from './pages/CombosPage/CombosPage.jsx';
import ArmaCombo from './pages/ArmaCombo/ArmaCombo.jsx';
import Contacto from './pages/Contacto/Contacto.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<Catalogo />} />
        <Route path="/combos" element={<CombosPage />} />
        <Route path="/arma-combo" element={<ArmaCombo />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
      <Footer />
      <WhatsAppButton />
    </BrowserRouter>
  );
}

export default App;
