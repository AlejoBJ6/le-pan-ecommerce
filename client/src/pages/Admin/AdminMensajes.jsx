import React, { useState, useEffect } from 'react';
import contactoService from '../../services/contactoService';

const AdminMensajes = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeAEliminar, setMensajeAEliminar] = useState(null);

  useEffect(() => {
    cargarMensajes();
  }, []);

  const cargarMensajes = async () => {
    try {
      setLoading(true);
      const data = await contactoService.obtenerMensajes();
      setMensajes(data);
    } catch (err) {
      setError('Error al cargar los mensajes. Asegúrate de estar autenticado como administrador.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLeido = async (id) => {
    try {
      await contactoService.marcarComoLeido(id);
      // Actualizamos solo el estado local para no recargar todo de la red
      setMensajes(prev => prev.map(m => m._id === id ? { ...m, leido: !m.leido } : m));
    } catch (err) {
      alert('Error al marcar el mensaje: ' + err.message);
    }
  };

  const handleDeleteRequest = (id) => {
    setMensajeAEliminar(id);
  };

  const confirmarEliminacion = async () => {
    if (!mensajeAEliminar) return;
    try {
      await contactoService.eliminarMensaje(mensajeAEliminar);
      setMensajes(prev => prev.filter(m => m._id !== mensajeAEliminar));
      setMensajeAEliminar(null);
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
      setMensajeAEliminar(null);
    }
  };

  const cancelarEliminacion = () => {
    setMensajeAEliminar(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      
      {/* Modal de Confirmación */}
      {mensajeAEliminar && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: 'var(--color-white)', padding: '30px',
            borderRadius: '8px', maxWidth: '400px', width: '90%', textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚠️</div>
            <h3 style={{ marginTop: 0, color: 'var(--color-dark)', fontSize: '1.4rem' }}>Eliminar Mensaje</h3>
            <p style={{ color: 'var(--color-gray)', marginBottom: '24px', lineHeight: '1.5' }}>
              ¿Estás seguro de que deseas eliminar este mensaje de forma permanente? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={cancelarEliminacion} 
                style={{ padding: '12px 24px', backgroundColor: 'var(--color-gray-light)', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-dark)', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-gray-light)'}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion} 
                style={{ padding: '12px 24px', backgroundColor: '#dc3545', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'white', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--color-dark)', margin: 0 }}>Bandeja de Mensajes</h2>
        <button onClick={cargarMensajes} style={{ padding: '8px 16px', background: 'var(--color-gray-light)', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
          ↻ Actualizar
        </button>
      </div>

      {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <p>Cargando mensajes...</p>
      ) : mensajes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--color-white)', borderRadius: '8px', border: '1px dashed #ccc' }}>
          <span style={{ fontSize: '3rem' }}>📭</span>
          <p style={{ marginTop: '10px', color: 'var(--color-gray)' }}>No hay mensajes nuevos.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {mensajes.map((mensaje) => (
            <div 
              key={mensaje._id} 
              style={{ 
                backgroundColor: mensaje.leido ? 'var(--color-white)' : '#fdfaf2', 
                borderLeft: `4px solid ${mensaje.leido ? 'transparent' : 'var(--color-primary)'}`,
                padding: '20px', 
                borderRadius: '8px', 
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-gray-light)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: 'var(--color-dark)', fontWeight: mensaje.leido ? '600' : '800' }}>
                    {mensaje.nombre}
                    {!mensaje.leido && <span style={{ marginLeft: '10px', fontSize: '0.8rem', background: 'var(--color-primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Nuevo</span>}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--color-gray)', fontSize: '0.9rem' }}>
                    <a href={`mailto:${mensaje.email}`} style={{ color: '#0066cc', textDecoration: 'none' }}>{mensaje.email}</a> 
                    {mensaje.telefono && (
                      <>
                        <span style={{ margin: '0 10px' }}>•</span>
                        📞 <a href={`tel:${mensaje.telefono}`} style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>{mensaje.telefono}</a>
                      </>
                    )}
                    <span style={{ margin: '0 10px' }}>•</span>
                    {formatDate(mensaje.createdAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => toggleLeido(mensaje._id)} 
                    style={{ background: 'none', border: '1px solid #ccc', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    {mensaje.leido ? 'Marcar como no leído' : '✅ Marcar como leído'}
                  </button>
                  <button 
                    onClick={() => handleDeleteRequest(mensaje._id)} 
                    className="admin-btn-delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #eee', marginTop: '15px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--color-dark-2)', lineHeight: '1.5' }}>
                {mensaje.mensaje}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMensajes;
