import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productoService from '../../services/productoService';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, nombre }
  const [deleteError, setDeleteError] = useState(null);

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

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await productoService.eliminarProducto(confirmDelete.id);
      setProductos(productos.filter(p => p._id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
      setDeleteError('Hubo un error al eliminar el producto.');
      setConfirmDelete(null);
    }
  };

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroStock, setFiltroStock] = useState('todos'); // 'todos', 'bajo', 'agotado'

  // Categorías extraídas automáticamente (únicas)
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];

  // Lógica de filtrado
  const productosFiltrados = productos.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = filtroCategoria === '' || p.categoria === filtroCategoria;
    
    let matchStock = true;
    if (filtroStock === 'bajo') matchStock = p.stock > 0 && p.stock <= 5;
    if (filtroStock === 'agotado') matchStock = p.stock === 0;

    return matchBusqueda && matchCategoria && matchStock;
  });

  if (loading) return <div>Cargando catálogo...</div>;

  return (
    <div className="admin-productos">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ margin: 0 }}>Productos ({productosFiltrados.length})</h2>
        <Link
          to="/admin/productos/nuevo"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          + Crear Producto
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div style={{ 
        display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap',
        backgroundColor: 'var(--color-white)', padding: '15px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Buscar por nombre</label>
          <input 
            type="text" 
            placeholder="Ej: Amasadora" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-gray-light)', outline: 'none' }}
          />
        </div>

        <div style={{ minWidth: '180px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Categoría</label>
          <select 
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-gray-light)', outline: 'none', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <option value="">Todas las categorías</option>
            {categoriasUnicas.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: '180px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Estado de Stock</label>
          <select 
            value={filtroStock}
            onChange={(e) => setFiltroStock(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-gray-light)', outline: 'none', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <option value="todos">Mostrar todos</option>
            <option value="bajo">Stock Bajo (≤ 5)</option>
            <option value="agotado">Agotados (0)</option>
          </select>
        </div>
      </div>

      {deleteError && (
        <div style={{ backgroundColor: '#fff8f8', color: '#dc3545', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #f5c2c7', fontWeight: 500, fontSize: '0.9rem' }}>
          ⚠️ {deleteError}
        </div>
      )}

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
            {productosFiltrados.map(prod => {
              // Lógica visual del badge de stock
              let stockBgColor = '#d4edda';
              let stockTextColor = '#155724';
              let stockText = prod.stock;

              if (prod.stock === 0) {
                stockBgColor = '#f8d7da';
                stockTextColor = '#721c24';
                stockText = 'Agotado';
              } else if (prod.stock <= 5) {
                stockBgColor = '#fff3cd';
                stockTextColor = '#856404';
              }

              return (
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
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.85em', 
                      fontWeight: 'bold',
                      backgroundColor: stockBgColor, 
                      color: stockTextColor 
                    }}>
                      {stockText}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <Link to={`/admin/productos/${prod._id}/editar`} className="admin-btn-edit">Editar</Link>
                    <button
                      onClick={() => setConfirmDelete({ id: prod._id, nombre: prod.nombre })}
                      className="admin-btn-delete"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              );
            })}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-gray)' }}>
                  No hay productos que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación de eliminación */}
      {confirmDelete && (
        <div
          onClick={() => setConfirmDelete(null)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: '12px',
              padding: '32px 28px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '52px', height: '52px',
              borderRadius: '50%',
              backgroundColor: '#fff8f8',
              border: '2px solid #f5c2c7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px auto',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>

            <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-dark)', fontSize: '1.2rem' }}>
              ¿Eliminar producto?
            </h3>
            <p style={{ color: 'var(--color-gray)', fontSize: '0.95rem', margin: '0 0 28px 0', lineHeight: 1.5 }}>
              Vas a eliminar permanentemente <strong style={{ color: 'var(--color-dark)' }}>"{confirmDelete.nombre}"</strong>.
              Esta acción no se puede deshacer.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1, padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-light)',
                  backgroundColor: 'transparent',
                  fontWeight: 600, cursor: 'pointer',
                  color: 'var(--color-dark)', fontSize: '0.95rem',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gray-light)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  flex: 1, padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  fontWeight: 700, cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b02a37'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductos;
