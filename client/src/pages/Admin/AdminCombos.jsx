import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productoService from '../../services/productoService';

const AdminCombos = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const data = await productoService.obtenerProductos();
        setCombos(data.filter(p => p.categoria === 'Combos'));
      } catch (error) {
        console.error("Error cargando combos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar permanentemente este combo? Esta acción no se puede deshacer.')) {
      try {
        await productoService.eliminarProducto(id);
        setCombos(combos.filter(p => p._id !== id));
      } catch (error) {
        alert('Hubo un error al eliminar el combo.');
        console.error(error);
      }
    }
  };

  if (loading) return <div>Cargando combos armados...</div>;

  return (
    <div className="admin-productos">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Combos Armados ({combos.length})</h2>
        <Link 
          to="/admin/combos/nuevo" 
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          + Crear Combo
        </Link>
      </div>

      <div style={{ overflowX: 'auto', backgroundColor: 'var(--color-white)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--color-dark)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-gray-light)', borderBottom: '2px solid var(--color-gray)' }}>
              <th style={{ padding: '15px' }}>Imagen</th>
              <th style={{ padding: '15px' }}>Nombre</th>
              <th style={{ padding: '15px' }}>Precio</th>
              <th style={{ padding: '15px' }}>Stock</th>
              <th style={{ padding: '15px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {combos.map(combo => (
              <tr key={combo._id} style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                <td style={{ padding: '15px' }}>
                  {combo.imagenes && combo.imagenes[0] ? (
                    <img src={combo.imagenes[0]} alt={combo.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                  )}
                </td>
                <td style={{ padding: '15px', fontWeight: 500 }}>{combo.nombre}</td>
                <td style={{ padding: '15px' }}>${combo.precio.toLocaleString('es-AR')}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', backgroundColor: combo.stock > 0 ? '#d4edda' : '#f8d7da', color: combo.stock > 0 ? '#155724' : '#721c24' }}>
                    {combo.stock > 0 ? combo.stock : 'Agotado'}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <Link to={`/admin/combos/${combo._id}/editar`} style={{ marginRight: '15px', color: '#007bff', textDecoration: 'none', fontWeight: 600 }}>Editar</Link>
                  <button onClick={() => handleDelete(combo._id)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Borrar</button>
                </td>
              </tr>
            ))}
            {combos.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-gray)' }}>No hay combos registrados. ¡Comienza creando uno nuevo!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCombos;
