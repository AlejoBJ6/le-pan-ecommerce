import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productoService from '../../services/productoService';
import pedidoService from '../../services/pedidoService';

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, pedData] = await Promise.all([
          productoService.obtenerProductos({ admin: true }),
          pedidoService.getAllPedidos()
        ]);
        setProductos(prodData.filter(p => p.categoria !== 'Combos'));
        setPedidosPendientes(pedData.filter(ped => ped.estadoEntrega === 'Pendiente' || ped.estadoEntrega === 'En preparación'));
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

        {/* Órdenes Recientes */}
        <div 
          onClick={() => navigate('/admin/pedidos')}
          style={{ backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', cursor: 'pointer', transition: 'transform 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--color-gray)', fontSize: '0.95rem' }}>Órdenes Pendientes</h3>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: pedidosPendientes.length > 0 ? '#ff9800' : 'var(--color-dark)' }}>
                {pedidosPendientes.length}
              </p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#fff3e0', borderRadius: '10px', color: '#e65100' }}>
              📦
            </div>
          </div>
          <div style={{ marginTop: '15px', color: 'var(--color-gray)', fontSize: '0.85rem', fontWeight: 500 }}>
            Ver panel de pedidos →
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
