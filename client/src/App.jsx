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
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminLayout from './pages/Admin/AdminLayout.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminProductos from './pages/Admin/AdminProductos.jsx';
import AdminProductoForm from './pages/Admin/AdminProductoForm.jsx';
import AdminCombos from './pages/Admin/AdminCombos.jsx';
import AdminComboBuilder from './pages/Admin/AdminComboBuilder.jsx';
import AdminMensajes from './pages/Admin/AdminMensajes.jsx';
import AdminCategorias from './pages/Admin/AdminCategorias.jsx';
import AdminComboConfig from './pages/Admin/AdminComboConfig.jsx';
import AdminPedidos from './pages/Admin/AdminPedidos.jsx';
import AdminGanancias from './pages/Admin/AdminGanancias.jsx';
import Perfil from './pages/Perfil/Perfil.jsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx';
import Checkout from './pages/Checkout/Checkout.jsx';
import CheckoutResult from './pages/Checkout/CheckoutResult.jsx';


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
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout-success" element={<CheckoutResult />} />
              <Route path="/checkout-failure" element={<CheckoutResult />} />
              <Route path="/checkout-pending" element={<CheckoutResult />} />
              
              {/* Ruta Privada de Cliente */}
              <Route path="/perfil" element={<PrivateRoute />}>
                <Route index element={<Perfil />} />
              </Route>
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
            <Route path="combos" element={<AdminCombos />} />
            <Route path="combos/nuevo" element={<AdminComboBuilder />} />
            <Route path="combos/:id/editar" element={<AdminProductoForm isCombo={true} />} />
            <Route path="mensajes" element={<AdminMensajes />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="combo-config" element={<AdminComboConfig />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="ganancias" element={<AdminGanancias />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
