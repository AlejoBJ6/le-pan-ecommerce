import React, { useState, useEffect } from 'react';
import pedidoService from '../../services/pedidoService';
import './AdminLayout.css';

const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p);

const normalizeString = (str) => str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

const getComisionUnitaria = (productName) => {
  const name = normalizeString(productName);
  
  if (name.includes('horno convector')) return 50000;
  if (name.includes('horno')) {
    if (name.includes('chico') || name.includes('chica')) return 60000;
    if (name.includes('grande')) return 100000;
  }
  
  if (name.includes('sobadora')) {
    if (name.includes('chica') || name.includes('chico')) return 30000;
    if (name.includes('mediana') || name.includes('mediano')) return 40000;
    if (name.includes('grande')) return 50000;
  }
  
  if (name.includes('amasadora')) {
    if (name.includes('chica') || name.includes('chico')) return 20000;
    if (name.includes('grande')) return 40000;
  }
  
  if (name.includes('rayadora') || name.includes('ralladora')) return 20000;
  
  if (name.includes('carrito')) return 20000;
  
  return 0;
};

const getComisionItem = (item) => {
  if (item.comision && item.comision > 0) {
    return item.comision * item.cantidad;
  }
  return getComisionUnitaria(item.nombre) * item.cantidad;
};

const getComisionPedido = (pedido) => {
    return pedido.pedidosData.reduce((acc, item) => acc + getComisionItem(item), 0);
};

const AdminGanancias = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mesFiltro, setMesFiltro] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const data = await pedidoService.getAllPedidos();
        // Solo ventas "Aprobadas" o cobradas generan comisión
        const completados = data.filter(p => p.estadoPago === 'Aprobado');
        setPedidos(completados);
      } catch (err) {
        console.error(err);
        setError('Error cargando los pedidos para ganancias.');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const pedidosFiltrados = mesFiltro 
    ? pedidos.filter(p => normalizeDate(p.createdAt) === mesFiltro) 
    : pedidos;

  const totalComisiones = pedidosFiltrados.reduce((acc, p) => acc + getComisionPedido(p), 0);
  const totalVentas = pedidosFiltrados.reduce((acc, p) => acc + p.totales.total, 0);

  const mesesUnicos = [...new Set(pedidos.map(p => normalizeDate(p.createdAt)))].sort().reverse();

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando ganancias...</div>;
  if (error) return <div style={{ color: 'red', padding: '40px' }}>{error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Ganancias y Comisiones</h2>
        
        <div>
          <select 
            value={mesFiltro} 
            onChange={e => setMesFiltro(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
          >
            <option value="">Histórico (Todos los meses)</option>
            {mesesUnicos.map(m => {
              const date = new Date(`${m}-01T00:00:00`);
              const mesNombre = date.toLocaleString('es-AR', { month: 'long', year: 'numeric' });
              return (
                <option key={m} value={m}>{mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1)}</option>
              );
            })}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', borderLeft: '5px solid #28a745' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--color-gray)' }}>Total Comisiones Generadas</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{formatPrice(totalComisiones)}</p>
          <small style={{ color: '#888' }}>Dinero total a cobrar por comisiones</small>
        </div>
        
        <div style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', borderLeft: '5px solid var(--color-primary)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--color-gray)' }}>Total Ventas (Ingreso Bruto)</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>{formatPrice(totalVentas)}</p>
          <small style={{ color: '#888' }}>Monto total de facturación aprobada</small>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-dark)' }}>Detalle de Ventas y Comisiones</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--color-dark)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-gray-light)', borderBottom: '2px solid var(--color-gray)' }}>
                <th style={{ padding: '15px' }}>ID Pedido</th>
                <th style={{ padding: '15px' }}>Fecha</th>
                <th style={{ padding: '15px' }}>Cliente</th>
                <th style={{ padding: '15px' }}>Productos</th>
                <th style={{ padding: '15px' }}>Total Venta</th>
                <th style={{ padding: '15px', color: '#28a745' }}>Comisión</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    No hay ventas registradas que apliquen para estos filtros.
                  </td>
                </tr>
              ) : pedidosFiltrados.map(pedido => {
                const comisionPedido = getComisionPedido(pedido);
                return (
                <tr key={pedido._id} style={{ borderBottom: '1px solid #eee' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fdfdfd'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '15px' }}>
                    <span style={{ backgroundColor: '#f8f9fa', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e9ecef', fontWeight: 'bold', fontSize: '0.9em', letterSpacing: '1px' }}>
                      #{pedido._id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#444' }}>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 500 }}>{pedido.datosEntrega.nombre} {pedido.datosEntrega.apellido}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '0.9rem', color: '#444' }}>
                      {pedido.pedidosData.map((item, idx) => {
                        const comisionItem = getComisionItem(item);
                        return (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            {item.cantidad}x {item.nombre} 
                            {comisionItem > 0 && <span style={{ color: '#28a745', fontWeight: 'bold', marginLeft: '6px', fontSize: '0.95em' }}>(+{formatPrice(comisionItem)})</span>}
                          </li>
                        )
                      })}
                    </ul>
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#444' }}>{formatPrice(pedido.totales.total)}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#28a745', fontSize: '1.05rem' }}>{formatPrice(comisionPedido)}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminGanancias;
