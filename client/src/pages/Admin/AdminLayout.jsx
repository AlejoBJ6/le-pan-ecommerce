import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px 0' }}>
          <Link to="/">
            <img src="/images/logos/image-removebg-preview.png" alt="Lé Pan Logo" style={{ maxHeight: '60px', width: 'auto' }} />
          </Link>
        </div>
        <nav className="admin-sidebar-nav">
          <ul>
            <li>
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                Resumen
              </Link>
            </li>
            <li>
              <Link to="/admin/productos" className={location.pathname.includes('/admin/productos') ? 'active' : ''}>
                Catálogo de Productos
              </Link>
            </li>
            <li>
              <Link to="/admin/combos" className={location.pathname.includes('/admin/combos') ? 'active' : ''}>
                Armar Combos
              </Link>
            </li>
            <li>
              <Link to="/admin/mensajes" className={location.pathname.includes('/admin/mensajes') ? 'active' : ''}>
                Mensajes ✉️
              </Link>
            </li>
            <li>
              <Link to="/" className="back-link">
                ← Volver a la Tienda
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main-content">
        <div className="admin-topbar">
          <h3 style={{ margin: 0 }}>Gestión de E-Commerce</h3>
        </div>
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
