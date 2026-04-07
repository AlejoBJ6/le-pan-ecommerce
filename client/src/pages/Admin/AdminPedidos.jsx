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
                  {pedido.metodoPago === 'transferencia' && (
                    <div style={{ marginTop: '5px' }}>
                      {pedido.comprobanteTransferencia ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: '700', backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '2px 8px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                          Comprobante recibido
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: '700', backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: '12px', padding: '2px 8px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Sin comprobante
                        </span>
                      )}
                    </div>
                  )}
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
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef', minHeight: '140px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#495057', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Datos del Cliente</h4>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{selectedPedido.datosEntrega.nombre} {selectedPedido.datosEntrega.apellido}</p>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}><a href={`mailto:${selectedPedido.datosEntrega.email}`} style={{ color: '#444', textDecoration: 'none' }}>✉️ {selectedPedido.datosEntrega.email}</a></p>
                  <p style={{ margin: 0, color: '#444', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    {selectedPedido.datosEntrega.telefono}
                  </p>
                </div>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef', minHeight: '140px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#495057', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lugar de Entrega</h4>
                  <p style={{ margin: 0, fontWeight: 'bold', textTransform: 'capitalize' }}>{selectedPedido.datosEntrega.ciudad}, {selectedPedido.datosEntrega.provincia}</p>
                  <p style={{ margin: 0, color: '#444', fontSize: '0.95rem' }}>{selectedPedido.datosEntrega.direccion} {selectedPedido.datosEntrega.piso ? `(${selectedPedido.datosEntrega.piso})` : ''}</p>
                  <p style={{ margin: 0, color: '#444', fontSize: '0.95rem' }}>CP: {selectedPedido.datosEntrega.cp}</p>
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
                  <div key={idx} style={{ display:'flex', justifyContent:'space-between', alignItems: 'center', padding: '12px 10px', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <div style={{ width: '45px', height: '45px', backgroundColor: '#e9ecef', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="20" height="20" fill="none" stroke="#adb5bd" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: 'bold', marginRight: '6px', color: 'var(--color-primary)' }}>{item.cantidad}x</span> 
                        <span style={{ fontWeight: '500' }}>{item.nombre}</span>
                      </div>
                    </div>
                    <strong>{formatPrice(item.precio * item.cantidad)}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ alignSelf: 'flex-end', padding: '0 10px' }}>
                  <div style={{ padding: '6px 12px', backgroundColor: selectedPedido.estadoPago === 'Aprobado' ? '#e8f5e9' : '#e9ecef', border: `1px solid ${selectedPedido.estadoPago === 'Aprobado' ? '#c8e6c9' : '#ced4da'}`, borderRadius: '6px', display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>Método de pago</span>
                    <strong style={{ color: selectedPedido.estadoPago === 'Aprobado' ? '#2e7d32' : '#495057' }}>{selectedPedido.metodoPago.replace('_', ' ').toUpperCase()}</strong>
                  </div>
                </div>
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
                </div>
              </div>

              {/* ── Comprobante de Transferencia ── */}
              {selectedPedido.metodoPago === 'transferencia' && (
                <div style={{ marginTop: '28px', borderTop: '2px solid #eee', paddingTop: '22px' }}>
                  <h4 style={{ margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                    Comprobante de Transferencia
                  </h4>

                  {selectedPedido.comprobanteTransferencia ? (
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                        <span style={{ fontWeight: '600', color: '#15803d' }}>Comprobante adjuntado por el cliente</span>
                      </div>

                      {/* Vista previa si es imagen */}
                      {/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(selectedPedido.comprobanteTransferencia) ? (
                        <a href={selectedPedido.comprobanteTransferencia} target="_blank" rel="noreferrer">
                          <img
                            src={selectedPedido.comprobanteTransferencia}
                            alt="Comprobante de transferencia"
                            style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #d1fae5', display: 'block', marginBottom: '12px', cursor: 'zoom-in' }}
                          />
                        </a>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '12px', backgroundColor: '#e0f2fe', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <span style={{ color: '#0369a1', fontWeight: '500' }}>Archivo PDF adjunto</span>
                        </div>
                      )}

                      <a
                        href={selectedPedido.comprobanteTransferencia}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', backgroundColor: '#16a34a', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Ver / Descargar comprobante
                      </a>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#92400e' }}>Comprobante pendiente</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#b45309' }}>El cliente aún no ha subido el comprobante de pago.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div style={{ padding: '20px 30px', backgroundColor: '#f8f9fa', borderTop: '1px solid #eee', borderRadius: '0 0 12px 12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => window.print()} 
                style={{ padding:'10px 24px', backgroundColor:'transparent', color: 'var(--color-dark)', border:'2px solid var(--color-dark)', borderRadius:'6px', cursor:'pointer', fontWeight: 'bold', transition: 'all 0.2s', marginRight: '12px' }} 
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-dark)'; e.currentTarget.style.color = '#fff'; }} 
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-dark)'; }}
              >
                Imprimir PDF
              </button>
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
