import React, { useState, useEffect } from 'react';
import pedidoService from '../../services/pedidoService';
import './AdminLayout.css'; // Reutilizando estilos del admin

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);

  // Estados para filtros y paginación
  const [busqueda, setBusqueda] = useState('');
  const [filtroPago, setFiltroPago] = useState('');
  const [filtroEntrega, setFiltroEntrega] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 15;

  const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p);

  const getBadgeStyle = (estado) => {
    if (['Entregado', 'Aprobado'].includes(estado)) return { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
    if (['Rechazado', 'Cancelado'].includes(estado)) return { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
    if (estado === 'En preparación') return { backgroundColor: '#cce5ff', color: '#004085', border: '1px solid #b8daff' };
    if (estado === 'Enviado') return { backgroundColor: '#e2e3e5', color: '#383d41', border: '1px solid #d6d8db' };
    return { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }; // Pendiente
  };

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidoService.getAllPedidos();
      setPedidos(data);
    } catch (err) {
      console.error(err);
      setError('Error cargando los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleEstadoChange = async (pedidoId, tipo, estado) => {
    try {
      const payload = {};
      if (tipo === 'entrega') payload.estadoEntrega = estado;
      if (tipo === 'pago') payload.estadoPago = estado;

      const updated = await pedidoService.updateEstadoPedido(pedidoId, payload);
      setPedidos(pedidos.map(p => p._id === pedidoId ? updated : p));
    } catch (err) {
      alert('Error al actualizar el estado.');
    }
  };

  // Resetea la paginación a 1 cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroPago, filtroEntrega]);

  // Lógica de filtrado
  const pedidosFiltrados = pedidos.filter(p => {
    const term = busqueda.toLowerCase();
    const matchBusqueda = p._id.toLowerCase().includes(term) || 
                          `${p.datosEntrega.nombre} ${p.datosEntrega.apellido}`.toLowerCase().includes(term);
    const matchPago = filtroPago === '' || p.estadoPago === filtroPago;
    const matchEntrega = filtroEntrega === '' || p.estadoEntrega === filtroEntrega;
    return matchBusqueda && matchPago && matchEntrega;
  });

  // Lógica de paginación
  const totalPaginas = Math.ceil(pedidosFiltrados.length / itemsPorPagina);
  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indexPrimero, indexUltimo);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando administrador de pedidos...</div>;
  if (error) return <div style={{ color: 'red', padding: '40px' }}>{error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Gestión de Pedidos</h2>
      </div>

      {/* Barra de Filtros */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', backgroundColor: 'var(--color-white)', padding: '15px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Buscar (ID o Cliente)</label>
          <input 
            type="text" 
            placeholder="Ej: BF042B o Juan Perez" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-gray-light)', outline: 'none' }}
          />
        </div>

        <div style={{ minWidth: '180px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Estado de Pago</label>
          <select 
            value={filtroPago}
            onChange={(e) => setFiltroPago(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-gray-light)', outline: 'none', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <option value="">Todos los pagos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        <div style={{ minWidth: '180px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Estado de Entrega</label>
          <select 
            value={filtroEntrega}
            onChange={(e) => setFiltroEntrega(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-gray-light)', outline: 'none', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <option value="">Todos los envíos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En preparación">En preparación</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto', backgroundColor: 'var(--color-white)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--color-dark)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-gray-light)', borderBottom: '2px solid var(--color-gray)' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>Fecha</th>
              <th style={{ padding: '15px' }}>Cliente</th>
              <th style={{ padding: '15px' }}>Total</th>
              <th style={{ padding: '15px' }}>Pago</th>
              <th style={{ padding: '15px' }}>Entrega</th>
              <th style={{ padding: '15px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosPaginados.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '50px', textAlign: 'center', color: 'var(--color-gray)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#666', fontWeight: 500 }}>No se encontraron pedidos con ese criterio.</p>
                    <small style={{ color: '#999' }}>Prueba cambiando los filtros o la búsqueda.</small>
                  </div>
                </td>
              </tr>
            ) : pedidosPaginados.map(pedido => (
              <tr key={pedido._id} style={{ borderBottom: '1px solid var(--color-gray-light)', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fdfdfd'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '15px' }}>
                  <span style={{ backgroundColor: '#fff7f2', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ffe8d6', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '0.9em', letterSpacing: '1px', display: 'inline-block' }}>
                    #{pedido._id.slice(-6).toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '15px', color: '#444' }}>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 600 }}>{pedido.datosEntrega.nombre} {pedido.datosEntrega.apellido}</div>
                  <small style={{ color: '#888' }}>{pedido.datosEntrega.provincia}</small>
                </td>
                <td style={{ padding: '15px' }}>
                  <strong style={{ fontSize: '1.05em' }}>{formatPrice(pedido.totales.total)}</strong><br/>
                  <small style={{ color: '#17a2b8', fontWeight: 600 }}>{pedido.metodoPago.toUpperCase()}</small>
                </td>
                <td style={{ padding: '15px' }}>
                  <select 
                    value={pedido.estadoPago} 
                    onChange={(e) => handleEstadoChange(pedido._id, 'pago', e.target.value)}
                    style={{ 
                      ...getBadgeStyle(pedido.estadoPago),
                      padding: '6px 24px 6px 12px', borderRadius: '20px',
                      fontWeight: 'bold', fontSize: '0.85em', cursor: 'pointer', outline: 'none',
                      appearance: 'none', backgroundPosition: 'calc(100% - 8px) center', 
                      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2210%22%20viewBox%3D%220%200%2014%2010%22%3E%3Cpath%20d%3D%22M7%2010L0%200h14z%22%20fill%3D%22%23333%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundSize: '8px 6px'
                    }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </td>
                <td style={{ padding: '15px' }}>
                  <select 
                    value={pedido.estadoEntrega} 
                    onChange={(e) => handleEstadoChange(pedido._id, 'entrega', e.target.value)}
                    style={{ 
                      ...getBadgeStyle(pedido.estadoEntrega),
                      padding: '6px 24px 6px 12px', borderRadius: '20px',
                      fontWeight: 'bold', fontSize: '0.85em', cursor: 'pointer', outline: 'none',
                      appearance: 'none', backgroundPosition: 'calc(100% - 8px) center', 
                      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2210%22%20viewBox%3D%220%200%2014%2010%22%3E%3Cpath%20d%3D%22M7%2010L0%200h14z%22%20fill%3D%22%23333%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundSize: '8px 6px'
                    }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En preparación">En preparación</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
                <td style={{ padding: '15px' }}>
                  <button className="admin-btn-edit" onClick={() => setSelectedPedido(pedido)} style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Paginación */}
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', borderTop: '1px solid var(--color-gray-light)', gap: '10px' }}>
            <button 
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: paginaActual === 1 ? '#f8f9fa' : '#fff', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer' }}
            >
              Anterior
            </button>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Página <strong>{paginaActual}</strong> de {totalPaginas}</span>
            <button 
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: paginaActual === totalPaginas ? '#f8f9fa' : '#fff', cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer' }}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {selectedPedido && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 9999, padding: '16px' }} onClick={() => setSelectedPedido(null)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '0', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 30px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Pedido #{selectedPedido._id.slice(-6).toUpperCase()}</h3>
                <span style={{ opacity: 0.9, fontSize: '0.9rem' }}>{new Date(selectedPedido.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedPedido(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ padding: '30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Datos del Cliente</h4>
                  <p style={{ margin:'4px 0', fontWeight: 'bold' }}>{selectedPedido.datosEntrega.nombre} {selectedPedido.datosEntrega.apellido}</p>
                  <p style={{ margin:'4px 0', color: '#666', fontSize: '0.95rem' }}><a href={`mailto:${selectedPedido.datosEntrega.email}`} style={{ color: 'var(--color-primary)' }}>{selectedPedido.datosEntrega.email}</a></p>
                  <p style={{ margin:'4px 0', color: '#666', fontSize: '0.95rem' }}>📞 {selectedPedido.datosEntrega.telefono}</p>
                </div>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lugar de Entrega</h4>
                  <p style={{ margin:'4px 0', fontWeight: 'bold' }}>{selectedPedido.datosEntrega.ciudad}, {selectedPedido.datosEntrega.provincia}</p>
                  <p style={{ margin:'4px 0', color: '#666', fontSize: '0.95rem' }}>{selectedPedido.datosEntrega.direccion} {selectedPedido.datosEntrega.piso ? `(${selectedPedido.datosEntrega.piso})` : ''}</p>
                  <p style={{ margin:'4px 0', color: '#666', fontSize: '0.95rem' }}>CP: {selectedPedido.datosEntrega.cp}</p>
                </div>
              </div>

              {selectedPedido.datosEntrega.notas && (
                <div style={{ backgroundColor:'#fff3cd', borderLeft: '4px solid #ffc107', padding:'12px 15px', borderRadius:'0 6px 6px 0', marginBottom: '30px' }}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#856404', marginBottom: '4px' }}>📝 Notas Adicionales:</strong>
                  <p style={{ margin: 0, color: '#856404', fontSize: '0.95rem' }}>{selectedPedido.datosEntrega.notas}</p>
                </div>
              )}

              <h4 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Artículos del Pedido</h4>
              <div style={{ marginBottom: '20px' }}>
                {selectedPedido.pedidosData.map((item, idx) => (
                  <div key={idx} style={{ display:'flex', justifyContent:'space-between', padding: '12px 10px', borderBottom: '1px solid #eee' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{item.cantidad}x</span> 
                      <span>{item.nombre}</span>
                    </div>
                    <strong>{formatPrice(item.precio * item.cantidad)}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '250px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', padding: '5px 10px', color: '#666' }}>
                    <span>Subtotal</span><span>{formatPrice(selectedPedido.totales.subtotal)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', padding: '5px 10px', color: '#666' }}>
                    <span>Envío</span><span>{formatPrice(selectedPedido.totales.envio)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', margin: '15px 0 0 0', padding: '15px 10px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef', fontSize: '1.1rem' }}>
                    <strong>TOTAL</strong><strong style={{ color: 'var(--color-primary)' }}>{formatPrice(selectedPedido.totales.total)}</strong>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <small style={{ color: '#888' }}>Pago vía {selectedPedido.metodoPago.toUpperCase()}</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '20px 30px', backgroundColor: '#f8f9fa', borderTop: '1px solid #eee', borderRadius: '0 0 12px 12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedPedido(null)}
                style={{ padding:'10px 24px', backgroundColor:'var(--color-dark)', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-dark)'}
              >
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPedidos;
