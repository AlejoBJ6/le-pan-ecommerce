import React, { useState, useEffect } from 'react';
import categoriaService from '../../services/categoriaService';

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nueva, setNueva] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nueva.trim()) return;
    setGuardando(true);
    setError(null);
    try {
      await categoriaService.crearCategoria(nueva.trim());
      setNueva('');
      await cargarCategorias();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la categoría.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar la categoría "${nombre}"?`)) return;
    try {
      await categoriaService.eliminarCategoria(id);
      await cargarCategorias();
    } catch {
      setError('Error al eliminar la categoría.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--color-dark)', fontSize: '1.8rem', marginBottom: '8px' }}>
        Categorías
      </h2>
      <p style={{ color: 'var(--color-gray)', marginBottom: '32px', fontSize: '0.95rem' }}>
        Las categorías que crees aquí aparecerán en el formulario de productos.
      </p>

      {/* Formulario nueva categoría */}
      <form
        onSubmit={handleCrear}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
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
            cursor: 'pointer',
            fontSize: '0.95rem',
            opacity: guardando || !nueva.trim() ? 0.6 : 1,
          }}
        >
          {guardando ? 'Creando...' : '+ Agregar'}
        </button>
      </form>

      {error && (
        <div
          style={{
            backgroundColor: '#fff8f8',
            color: '#dc3545',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #f5c2c7',
            fontWeight: 500,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Lista de categorías */}
      {loading ? (
        <p style={{ color: 'var(--color-gray)' }}>Cargando...</p>
      ) : categorias.length === 0 ? (
        <p style={{ color: 'var(--color-gray)', fontStyle: 'italic' }}>
          No hay categorías todavía. ¡Creá la primera!
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {categorias.map((cat) => (
            <div
              key={cat._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-gray-light)',
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '0.95rem',
                color: 'var(--color-dark)',
                fontWeight: 500,
              }}
            >
              <span>{cat.nombre}</span>
              <button
                onClick={() => handleEliminar(cat._id, cat.nombre)}
                title="Eliminar"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-gray)',
                  fontSize: '1rem',
                  lineHeight: 1,
                  padding: '0 2px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#dc3545')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-gray)')}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategorias;
