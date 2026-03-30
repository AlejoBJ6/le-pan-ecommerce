import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productoService from '../../services/productoService';

const AdminCombos = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, nombre }
  const [deleteError, setDeleteError] = useState(null);

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

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await productoService.eliminarProducto(confirmDelete.id);
      setCombos(combos.filter(p => p._id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
      setDeleteError('Hubo un error al eliminar el combo.');
      setConfirmDelete(null);
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

      {deleteError && (
        <div style={{ backgroundColor: '#fff8f8', color: '#dc3545', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #f5c2c7', fontWeight: 500, fontSize: '0.9rem' }}>
          ⚠️ {deleteError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {combos.map(combo => (
          <div key={combo._id} style={{ 
            backgroundColor: 'var(--color-white)', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)', 
            border: '1px solid #eaeaea', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s, boxShadow 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)'; }}
          >
            {/* Imagen Header */}
            <div style={{ height: '180px', backgroundColor: '#fbfbfb', position: 'relative', borderBottom: '1px solid #f0f0f0' }}>
               {combo.imagenes && combo.imagenes[0] ? (
                  <img src={combo.imagenes[0]} alt={combo.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                    <span style={{ fontSize: '2rem' }}>📦</span>
                    <span style={{ fontSize: '0.85rem', marginTop: '5px' }}>Sin imagen</span>
                  </div>
                )}
                
                {/* Badge de Stock */}
                <span style={{ 
                  position: 'absolute', top: '12px', right: '12px', 
                  padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', 
                  backgroundColor: combo.stock > 0 ? (combo.stock <= 5 ? '#fff3cd' : '#d4edda') : '#f8d7da', 
                  color: combo.stock > 0 ? (combo.stock <= 5 ? '#856404' : '#155724') : '#721c24', 
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
                }}>
                  {combo.stock > 0 ? `${combo.stock} unid.` : 'Agotado'}
                </span>
            </div>

            {/* Contenido Card */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: 'var(--color-dark)', lineHeight: 1.4, fontWeight: 700 }}>
                {combo.nombre}
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                ${(combo.precio || 0).toLocaleString('es-AR')}
              </p>
              
              {/* Botones de acción */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                <Link 
                  to={`/admin/combos/${combo._id}/editar`} 
                  style={{ 
                    flex: 1, textAlign: 'center', padding: '10px', 
                    backgroundColor: '#f0f4ff', color: '#3a56d4', 
                    borderRadius: '8px', textDecoration: 'none', fontWeight: 600, 
                    transition: 'background 0.2s', fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e9ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f4ff'}
                >
                  Editar
                </Link>
                <button
                  onClick={() => setConfirmDelete({ id: combo._id, nombre: combo.nombre })}
                  style={{ 
                    flex: 1, padding: '10px', 
                    backgroundColor: '#fff0f0', color: '#dc3545', 
                    border: 'none', borderRadius: '8px', cursor: 'pointer', 
                    fontWeight: 600, transition: 'background 0.2s', fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffe0e0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff0f0'}
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {combos.length === 0 && (
          <div style={{ 
            gridColumn: '1 / -1', padding: '60px 40px', textAlign: 'center', 
            backgroundColor: 'var(--color-white)', borderRadius: '12px', border: '2px dashed #eaeaea', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'
          }}>
            <span style={{ fontSize: '3rem' }}>🛍️</span>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--color-dark)' }}>No tenés combos armados</h3>
              <p style={{ margin: 0, color: 'var(--color-gray)' }}>Aprovechá para agrupar productos y vender más.</p>
            </div>
            <Link
              to="/admin/combos/nuevo"
              style={{ 
                marginTop: '10px', backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', 
                padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' 
              }}
            >
              Crear mi primer Combo
            </Link>
          </div>
        )}
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
              ¿Eliminar combo?
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

export default AdminCombos;
