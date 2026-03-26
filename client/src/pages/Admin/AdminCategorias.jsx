import React, { useState, useEffect } from 'react';
import categoriaService from '../../services/categoriaService';

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nueva, setNueva] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, nombre }

  const cargarCategorias = async () => {
    try {
      const data = await categoriaService.obtenerCategorias();
      setCategorias(data);
    } catch {
      setError('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarCategorias(); }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nueva.trim()) return;
    setGuardando(true);
    setError(null);
    try {
      await categoriaService.crearCategoria(nueva.trim());
      setNueva('');
      await cargarCategorias();
      showSuccess(`Categoría "${nueva.trim()}" creada correctamente.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la categoría.');
    } finally {
      setGuardando(false);
    }
  };

  const handleConfirmEliminar = async () => {
    if (!confirmDelete) return;
    try {
      await categoriaService.eliminarCategoria(confirmDelete.id);
      showSuccess(`Categoría "${confirmDelete.nombre}" eliminada.`);
      await cargarCategorias();
    } catch {
      setError('Error al eliminar la categoría.');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--color-dark)', fontSize: '1.8rem', margin: '0 0 6px 0' }}>
          Categorías
        </h2>
        <p style={{ color: 'var(--color-gray)', fontSize: '0.95rem', margin: 0 }}>
          Las categorías que crees aquí aparecerán en el formulario de productos.
        </p>
      </div>

      {/* Formulario nueva categoría */}
      <form
        onSubmit={handleCrear}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          className="admin-input-control"
          placeholder="Ej: Cámaras de leudado"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <button
          type="submit"
          disabled={guardando || !nueva.trim()}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            padding: '10px 22px',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: guardando || !nueva.trim() ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
            opacity: guardando || !nueva.trim() ? 0.55 : 1,
            transition: 'opacity 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {guardando ? 'Creando...' : '+ Agregar categoría'}
        </button>
      </form>

      {/* Toast de éxito */}
      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#f0fdf4',
          color: '#166534',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #bbf7d0',
          fontWeight: 500,
          fontSize: '0.9rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          backgroundColor: '#fff8f8',
          color: '#dc3545',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #f5c2c7',
          fontWeight: 500,
          fontSize: '0.9rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Tabla de categorías */}
      {loading ? (
        <p style={{ color: 'var(--color-gray)' }}>Cargando...</p>
      ) : categorias.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          border: '2px dashed var(--color-gray-light)',
          borderRadius: '12px',
          color: 'var(--color-gray)',
        }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>No hay categorías todavía</p>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Creá tu primera categoría usando el formulario de arriba.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: '1px solid var(--color-gray-light)',
        }}>
          {/* Header de tabla */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            padding: '12px 20px',
            backgroundColor: 'var(--color-gray-light)',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.06em',
            color: 'var(--color-gray)',
            textTransform: 'uppercase',
          }}>
            <span>Nombre</span>
            <span>Acción</span>
          </div>

          {/* Filas */}
          {categorias.map((cat, idx) => (
            <div
              key={cat._id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                padding: '14px 20px',
                borderTop: idx === 0 ? 'none' : '1px solid var(--color-gray-light)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(232,130,12,0.04)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  flexShrink: 0,
                }} />
                <span style={{ fontWeight: 600, color: 'var(--color-dark)', fontSize: '0.95rem' }}>
                  {cat.nombre}
                </span>
              </div>
              <button
                onClick={() => setConfirmDelete({ id: cat._id, nombre: cat.nombre })}
                style={{
                  background: 'none',
                  border: '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: 'var(--color-gray)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  padding: '5px 10px',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#dc3545';
                  e.currentTarget.style.borderColor = '#f5c2c7';
                  e.currentTarget.style.backgroundColor = '#fff8f8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-gray)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      {categorias.length > 0 && (
        <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginTop: '12px', textAlign: 'right' }}>
          {categorias.length} categoría{categorias.length !== 1 ? 's' : ''} en total
        </p>
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmDelete && (
        <div
          onClick={() => setConfirmDelete(null)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: '12px',
              padding: '32px 28px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
          >
            {/* Ícono de advertencia */}
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
              ¿Eliminar categoría?
            </h3>
            <p style={{ color: 'var(--color-gray)', fontSize: '0.95rem', margin: '0 0 28px 0', lineHeight: 1.5 }}>
              Vas a eliminar <strong style={{ color: 'var(--color-dark)' }}>"{confirmDelete.nombre}"</strong>.
              Los productos con esta categoría no se eliminan, solo dejarán de asociarse a ella.
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
                onClick={handleConfirmEliminar}
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

export default AdminCategorias;
