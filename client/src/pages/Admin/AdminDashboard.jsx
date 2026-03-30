import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productoService from '../../services/productoService';

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productoService.obtenerProductos();
        setProductos(data.filter(p => p.categoria !== 'Combos'));
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  if (loading) return <div>Cargando resumen...</div>;

  const bajoStock = productos.filter(p => p.stock > 0 && p.stock <= 5);
  const agotados = productos.filter(p => p.stock === 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Resumen del Negocio</h2>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-gray)' }}>Actualizado al instante</span>
      </div>
      
      {/* Alertas Críticas (Agotados) */}
      {agotados.length > 0 && (
        <div style={{ backgroundColor: '#fff8f8', borderLeft: '4px solid #dc3545', padding: '16px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🚨</span>
            <div>
              <h4 style={{ margin: 0, color: '#dc3545', fontSize: '1.1rem' }}>¡Atención! {agotados.length} producto(s) sin stock</h4>
              <p style={{ margin: '4px 0 0 0', color: 'var(--color-dark)', fontSize: '0.9rem' }}>
                {agotados.slice(0, 3).map(p => p.nombre).join(', ')}
                {agotados.length > 3 ? ` y ${agotados.length - 3} más...` : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alertas Preventivas (Bajo Stock) */}
      {bajoStock.length > 0 && (
        <div style={{ backgroundColor: '#fffcf0', borderLeft: '4px solid #ffc107', padding: '16px 20px', borderRadius: '8px', marginBottom: '30px', boxShadow: 'var(--shadow-sm)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <h4 style={{ margin: 0, color: '#856404', fontSize: '1.1rem' }}>{bajoStock.length} producto(s) por agotarse</h4>
              <p style={{ margin: '4px 0 0 0', color: 'var(--color-dark)', fontSize: '0.9rem' }}>
                {bajoStock.slice(0, 3).map(p => p.nombre).join(', ')}
                {bajoStock.length > 3 ? ` y ${bajoStock.length - 3} más...` : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas Principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
        
        {/* Total Productos */}
        <div 
          onClick={() => navigate('/admin/productos')}
          style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', cursor: 'pointer', transition: 'transform 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--color-gray)', fontSize: '0.95rem' }}>Productos en Catálogo</h3>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                {productos.length}
              </p>
            </div>
          </div>
          <div style={{ marginTop: '15px', color: 'var(--color-gray)', fontSize: '0.85rem', fontWeight: 500 }}>
            Ver todos los productos →
          </div>
        </div>

        {/* Órdenes Recientes (Placeholder) */}
        <div style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', opacity: 0.6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--color-gray)', fontSize: '0.95rem' }}>Órdenes Recientes</h3>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-dark)' }}>
                0
              </p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '10px', color: '#888' }}>
              🛒
            </div>
          </div>
          <div style={{ marginTop: '15px', color: 'var(--color-gray)', fontSize: '0.85rem', fontWeight: 500 }}>
            Función próximamente...
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
