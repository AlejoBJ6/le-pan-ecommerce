import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.jsx';
import Catalogo from './pages/Catalogo';
import CombosPage from './pages/CombosPage/CombosPage.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<Catalogo />} />
        <Route path="/combos" element={<CombosPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
