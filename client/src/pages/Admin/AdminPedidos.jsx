import React, { useState, useEffect } from 'react';
import pedidoService from '../../services/pedidoService';
import './AdminLayout.css'; // Reutilizando estilos del admin

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p);

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

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Gestión de Pedidos</h2>
      </div>

      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Entrega</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center'}}>No hay pedidos registrados</td></tr>
              ) : pedidos.map(pedido => (
                <tr key={pedido._id}>
                  <td><small>{pedido._id.slice(-6).toUpperCase()}</small></td>
                  <td>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div><strong>{pedido.datosEntrega.nombre} {pedido.datosEntrega.apellido}</strong></div>
                    <small style={{ color: '#666' }}>{pedido.datosEntrega.provincia}</small>
                  </td>
                  <td><strong>{formatPrice(pedido.totales.total)}</strong><br/><small>{pedido.metodoPago.toUpperCase()}</small></td>
                  <td>
                    <select 
                      value={pedido.estadoPago} 
                      onChange={(e) => handleEstadoChange(pedido._id, 'pago', e.target.value)}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc',
                               backgroundColor: pedido.estadoPago === 'Aprobado' ? '#e6ffe6' : '#fff' }}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </td>
                  <td>
                    <select 
                      value={pedido.estadoEntrega} 
                      onChange={(e) => handleEstadoChange(pedido._id, 'entrega', e.target.value)}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc',
                               backgroundColor: pedido.estadoEntrega === 'Entregado' ? '#e6ffe6' : '#fff' }}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En preparación">En preparación</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-table-action" onClick={() => setSelectedPedido(pedido)}>Ver Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPedido && (
        <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, backgroundColor: 'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000}}>
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', minWidth: '400px', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>Detalle del Pedido #{selectedPedido._id.slice(-6).toUpperCase()}</h3>
            
            <h4>Productos</h4>
            <div style={{ backgroundColor: '#f9f9f9', padding:'10px', borderRadius:'8px' }}>
              {selectedPedido.pedidosData.map((item, idx) => (
                <div key={idx} style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span>{item.cantidad}x {item.nombre}</span>
                  <strong>{formatPrice(item.precio * item.cantidad)}</strong>
                </div>
              ))}
              <hr/>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span>Subtotal</span><span>{formatPrice(selectedPedido.totales.subtotal)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span>Envío</span><span>{formatPrice(selectedPedido.totales.envio)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px' }}>
                <strong>TOTAL PAGADO</strong><strong>{formatPrice(selectedPedido.totales.total)}</strong>
              </div>
            </div>

            <h4 style={{ marginTop:'20px' }}>Datos de Entrega</h4>
            <p style={{ margin:'2px 0' }}><strong>Cliente:</strong> {selectedPedido.datosEntrega.nombre} {selectedPedido.datosEntrega.apellido}</p>
            <p style={{ margin:'2px 0' }}><strong>Email:</strong> <a href={`mailto:${selectedPedido.datosEntrega.email}`}>{selectedPedido.datosEntrega.email}</a></p>
            <p style={{ margin:'2px 0' }}><strong>Teléfono:</strong> {selectedPedido.datosEntrega.telefono}</p>
            <p style={{ margin:'2px 0' }}><strong>Dirección:</strong> {selectedPedido.datosEntrega.direccion} {selectedPedido.datosEntrega.piso}, {selectedPedido.datosEntrega.ciudad}, {selectedPedido.datosEntrega.provincia} ({selectedPedido.datosEntrega.cp})</p>
            {selectedPedido.datosEntrega.notas && (
              <p style={{ margin:'2px 0', backgroundColor:'#fff3cd', padding:'5px', borderRadius:'5px' }}><strong>Notas:</strong> {selectedPedido.datosEntrega.notas}</p>
            )}

            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'20px' }}>
              <button 
                onClick={() => setSelectedPedido(null)}
                style={{ padding:'10px 20px', backgroundColor:'#333', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer' }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPedidos;
