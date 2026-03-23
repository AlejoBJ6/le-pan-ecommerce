import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Resumen</h2>
      <p>Bienvenido al Panel de Control de Lé Pan.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div style={{ backgroundColor: 'var(--color-white)', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-gray)' }}>Productos en Catálogo</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>Gestionar →</p>
        </div>
        <div style={{ backgroundColor: 'var(--color-white)', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', opacity: 0.5 }}>
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-gray)' }}>Órdenes Recientes</h3>
          <p style={{ fontSize: '1rem', margin: 0 }}>Próximamente...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
