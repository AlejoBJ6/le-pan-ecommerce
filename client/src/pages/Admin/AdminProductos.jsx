import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productoService from '../../services/productoService';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productoService.obtenerProductos();
        setProductos(data.filter(p => p.categoria !== 'Combos'));
      } catch (error) {
        console.error("Error cargando productos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar permanentemente este producto? Esta acción no se puede deshacer.')) {
      try {
        await productoService.eliminarProducto(id);
        setProductos(productos.filter(p => p._id !== id));
      } catch (error) {
        alert('Hubo un error al eliminar el producto.');
        console.error(error);
      }
    }
  };

  if (loading) return <div>Cargando catálogo...</div>;

  return (
    <div className="admin-productos">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Productos ({productos.length})</h2>
        <Link 
          to="/admin/productos/nuevo" 
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          + Crear Producto
        </Link>
      </div>

      <div style={{ overflowX: 'auto', backgroundColor: 'var(--color-white)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--color-dark)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-gray-light)', borderBottom: '2px solid var(--color-gray)' }}>
              <th style={{ padding: '15px' }}>Imagen</th>
              <th style={{ padding: '15px' }}>Nombre</th>
              <th style={{ padding: '15px' }}>Categoría</th>
              <th style={{ padding: '15px' }}>Precio</th>
              <th style={{ padding: '15px' }}>Stock</th>
              <th style={{ padding: '15px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod._id} style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                <td style={{ padding: '15px' }}>
                  {prod.imagenes && prod.imagenes[0] ? (
                    <img src={prod.imagenes[0]} alt={prod.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                  )}
                </td>
                <td style={{ padding: '15px', fontWeight: 500 }}>{prod.nombre}</td>
                <td style={{ padding: '15px' }}>{prod.categoria}</td>
                <td style={{ padding: '15px' }}>${prod.precio.toLocaleString('es-AR')}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', backgroundColor: prod.stock > 0 ? '#d4edda' : '#f8d7da', color: prod.stock > 0 ? '#155724' : '#721c24' }}>
                    {prod.stock > 0 ? prod.stock : 'Agotado'}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <Link to={`/admin/productos/${prod._id}/editar`} style={{ marginRight: '15px', color: '#007bff', textDecoration: 'none', fontWeight: 600 }}>Editar</Link>
                  <button onClick={() => handleDelete(prod._id)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Borrar</button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-gray)' }}>No hay productos registrados. ¡Comienza creando uno nuevo!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductos;
