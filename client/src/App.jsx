import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.jsx';
import Catalogo from './pages/Catalogo';
import CombosPage from './pages/CombosPage/CombosPage.jsx';
import ArmaCombo from './pages/ArmaCombo/ArmaCombo.jsx';
import Contacto from './pages/Contacto/Contacto.jsx';
import Login from './pages/Login/Login.jsx';
import Registro from './pages/Registro/Registro.jsx';
import ProductDetail from './pages/ProductDetail/ProductDetail.jsx';
import Carrito from './pages/Carrito/Carrito.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AdminLayout from './pages/Admin/AdminLayout.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminProductos from './pages/Admin/AdminProductos.jsx';
import AdminProductoForm from './pages/Admin/AdminProductoForm.jsx';

// Componente Wrapper para Layout Público
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
    <WhatsAppButton />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/*" element={
          <PublicLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<Catalogo />} />
              <Route path="/combos" element={<CombosPage />} />
              <Route path="/arma-combo" element={<ArmaCombo />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Carrito />} />
            </Routes>
          </PublicLayout>
        } />

        {/* Rutas Privadas / Admin */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="productos/nuevo" element={<AdminProductoForm />} />
            <Route path="productos/:id/editar" element={<AdminProductoForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
