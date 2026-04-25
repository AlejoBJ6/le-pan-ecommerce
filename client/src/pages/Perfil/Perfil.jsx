import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import pedidoService from '../../services/pedidoService';
import uploadService from '../../services/uploadService';
import { LuTruck, LuLink, LuUpload, LuCircleCheck, LuBuilding2 } from 'react-icons/lu';
import './Perfil.css';

const EyeIcon = ({ show }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {show ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </>
    )}
  </svg>
);

const Perfil = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadingOrder, setUploadingOrder] = useState(null);

  // States for pending upload with preview
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPedidoId, setPendingPedidoId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getUserProfile();
        setNombre(data.nombre);
        setApellido(data.apellido || '');
        setTelefono(data.telefono || '');
        setEmail(data.email);
      } catch (err) {
        setError('Error al cargar datos del perfil');
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoadingPedidos(true);
      try {
        const pedData = await pedidoService.getMisPedidos(currentPage, 5);
        if (pedData.pedidos) {
          setPedidos(pedData.pedidos);
          setTotalPages(pedData.pages);
        } else {
          // Fallback por si el backend no ha reiniciado y devuelve el formato viejo
          setPedidos(pedData); 
        }
      } catch (pedidoErr) {
        console.error("Error al cargar pedidos", pedidoErr);
      } finally {
        setLoadingPedidos(false);
      }
    };
    fetchPedidos();
  }, [currentPage]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (password && password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Por favor, verifica e inténtalo nuevamente.');
      return;
    }

    setLoading(true);
    try {
      await authService.updateUserProfile({ nombre, apellido, telefono, email, password });
      setMensaje('Perfil actualizado correctamente.');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper to determine status badge class
  const getStatusClass = (status) => {
    if (status === 'Aprobado' || status === 'Entregado') return 'status-approved';
    if (status === 'Pendiente') return 'status-pending';
    return 'status-default';
  };

  const handleFileSelect = (pedidoId, file) => {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setPendingFile(file);
    setPendingPedidoId(pedidoId);
    
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const cancelUpload = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPendingPedidoId(null);
    setPreviewUrl(null);
  };

  const handleConfirmUpload = async () => {
    if (!pendingFile || !pendingPedidoId) return;
    
    setUploadingOrder(pendingPedidoId);
    setError(null);
    setMensaje(null);
    
    try {
      const uploadRes = await uploadService.uploadImage(pendingFile);
      await pedidoService.subirComprobante(pendingPedidoId, uploadRes.imageUrl);
      
      // Update local state to reflect the uploaded receipt
      setPedidos(pedidos.map(p => 
        p._id === pendingPedidoId ? { ...p, comprobanteTransferencia: uploadRes.imageUrl } : p
      ));
      setMensaje('Comprobante subido y asociado correctamente al pedido.');
      
      // Clear pending state
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPendingFile(null);
      setPendingPedidoId(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setError('Hubo un error al subir el comprobante. Intenta nuevamente.');
    } finally {
      setUploadingOrder(null);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const ordersSection = document.querySelector('.orders-section');
    if (ordersSection) {
      // Ajuste para que el scroll no quede pegado al borde superior exacto
      const y = ordersSection.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="perfil-container bg-gray-light">
      <div className="perfil-card">
        
        <div className="perfil-header">
          <h2 className="perfil-title">Mi Perfil</h2>
          <button onClick={handleLogout} className="btn-logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </button>
        </div>
        
        {mensaje && <div className="alert-success">{mensaje}</div>}
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={submitHandler} className="profile-form">
          <div className="form-row-2col">
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input 
                type="text" 
                value={apellido} 
                onChange={(e) => setApellido(e.target.value)} 
                required 
                className="form-input" 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="tel" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
              required 
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              required 
              className="form-input" 
              disabled
            />
          </div>

          <div className="form-group">
            <label>Nueva Contraseña (opcional)</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Dejar en blanco para conservar la actual" 
                className="form-input"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="btn-password-toggle"
                aria-label="Ver contraseña"
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>
          </div>

          {password && (
            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <div className="password-input-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Repite la nueva contraseña" 
                  required={!!password}
                  className="form-input"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="btn-password-toggle"
                  aria-label="Ver contraseña"
                >
                  <EyeIcon show={showConfirmPassword} />
                </button>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-update">
            {loading ? 'Actualizando...' : 'Actualizar Perfil'}
          </button>
        </form>

        <div className="orders-section">
           <h3 className="orders-title">Mis Órdenes</h3>
           
           {loadingPedidos && pedidos.length === 0 ? (
             <p className="loading-text">Cargando tus órdenes...</p>
           ) : pedidos.length === 0 ? (
             <div className="empty-orders">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
               <p>No tienes órdenes registradas por el momento.</p>
               <button onClick={() => navigate('/productos')} className="btn-go-shop">
                 Ir a la tienda
               </button>
             </div>
           ) : (
             <div className="orders-list" style={{ opacity: loadingPedidos ? 0.5 : 1, transition: 'opacity 0.2s ease-in-out' }}>
               {pedidos.map(pedido => {
                 const fMin = pedido.datosEntrega.fechaEstimadaMin ? new Date(pedido.datosEntrega.fechaEstimadaMin).toLocaleDateString() : '';
                 const fMax = pedido.datosEntrega.fechaEstimadaMax ? new Date(pedido.datosEntrega.fechaEstimadaMax).toLocaleDateString() : '';
                 
                 return (
                  <div key={pedido._id} className="order-card">
                    <div className="order-header">
                      <div>
                        <span className="order-id">Pedido #{pedido._id.slice(-6).toUpperCase()}</span>
                        <span className="order-date">{new Date(pedido.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="order-total">
                        ${pedido.totales.allTotal ? pedido.totales.allTotal.toLocaleString('es-AR') : (pedido.totales.total?.toLocaleString('es-AR') || '0')}
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {pedido.pedidosData.map((item, i) => (
                        <div key={i} className="order-item-row" style={{ marginBottom: '4px' }}>
                          <strong>{item.cantidad}x</strong> {item.nombre}
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-status-row">
                      <span className={`status-badge ${getStatusClass(pedido.estadoEntrega)}`}>
                        Envío: {pedido.estadoEntrega}
                      </span>
                      <span className={`status-badge ${getStatusClass(pedido.estadoPago)}`}>
                        Pago: {pedido.estadoPago}
                      </span>
                    </div>
                    
                    {pedido.estadoEntrega !== 'Entregado' && pedido.estadoEntrega !== 'Cancelado' && fMin && (
                      <div className="order-shipping-info">
                        <LuTruck size={18} /> 
                        <span>Entrega estimada: {fMin} a {fMax}</span>
                      </div>
                    )}
                    
                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--color-gray-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link to={`/arrepentimiento?pedido=${pedido._id.slice(-6).toUpperCase()}`} style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px'}}>
                          <polyline points="9 14 4 9 9 4"></polyline>
                          <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                        </svg>
                        ¿Tuviste un problema? Solicitar Devolución
                      </Link>
                    </div>
                    
                    {pedido.metodoPago === 'transferencia' && (
                      <div className="order-receipt-section" style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                        {pedido.comprobanteTransferencia ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', fontSize: '0.9rem', fontWeight: '500' }}>
                            <LuCircleCheck size={20} />
                            Comprobante enviado (en revisión)
                            <a href={pedido.comprobanteTransferencia} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: 'var(--color-primary)', textDecoration: 'underline' }}>Ver archivo</a>
                          </div>
                        ) : pendingPedidoId === pedido._id ? (
                          /* Confirmación con preview */
                          <div>
                            <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <LuUpload size={18} /> Confirmar comprobante
                            </h4>

                            {previewUrl ? (
                              <div style={{ marginBottom: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #dee2e6', lineHeight: 0 }}>
                                <img
                                  src={previewUrl}
                                  alt="Vista previa del comprobante"
                                  style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', backgroundColor: '#f0f0f0' }}
                                />
                              </div>
                            ) : (
                              <div style={{ marginBottom: '12px', padding: '15px', backgroundColor: '#f0f4ff', borderRadius: '8px', border: '1px solid #c7d7fd', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '2rem' }}>📄</span>
                                <div>
                                  <div style={{ fontWeight: '600', color: '#333', fontSize: '0.85rem' }}>{pendingFile?.name}</div>
                                  <div style={{ color: '#777', fontSize: '0.75rem' }}>PDF • {(pendingFile?.size / 1024).toFixed(1)} KB</div>
                                </div>
                              </div>
                            )}

                            <div style={{ padding: '6px 10px', backgroundColor: '#fff', border: '1px solid #dee2e6', borderRadius: '6px', marginBottom: '12px', fontSize: '0.78rem', color: '#555' }}>
                              <strong>{pendingFile?.name}</strong> &nbsp;&bull;&nbsp; {(pendingFile?.size / 1024).toFixed(1)} KB
                            </div>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                onClick={handleConfirmUpload}
                                disabled={uploadingOrder === pedido._id}
                                style={{ padding: '8px 16px', backgroundColor: '#2e7d32', color: 'white', borderRadius: '6px', border: 'none', cursor: uploadingOrder === pedido._id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}
                              >
                                <LuCircleCheck size={16} />
                                {uploadingOrder === pedido._id ? 'Subiendo...' : 'Confirmar y subir'}
                              </button>
                              <button
                                onClick={cancelUpload}
                                disabled={uploadingOrder === pedido._id}
                                style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#666', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem' }}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Selección inicial */
                          <div>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#495057' }}>
                              <strong>Pago por transferencia:</strong> Adjuntá tu comprobante para que podamos aprobar tu pedido.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <input 
                                type="file" 
                                accept="image/*,.pdf" 
                                id={`file-${pedido._id}`}
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileSelect(pedido._id, e.target.files[0])}
                              />
                              <button 
                                onClick={() => document.getElementById(`file-${pedido._id}`).click()}
                                style={{
                                  padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold'
                                }}
                              >
                                <LuUpload size={16} />
                                Seleccionar Comprobante
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                 );
               })}
              </div>
           )}

           {!loadingPedidos && totalPages > 1 && (
             <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px', paddingBottom: '20px' }}>
               <button 
                 onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                 disabled={currentPage === 1}
                 style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #dee2e6', backgroundColor: currentPage === 1 ? '#f8f9fa' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#aaa' : 'var(--color-primary)', fontWeight: '500', transition: 'all 0.2s' }}
               >
                 Anterior
               </button>
               <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
                 Página {currentPage} de {totalPages}
               </span>
               <button 
                 onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                 disabled={currentPage === totalPages}
                 style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #dee2e6', backgroundColor: currentPage === totalPages ? '#f8f9fa' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#aaa' : 'var(--color-primary)', fontWeight: '500', transition: 'all 0.2s' }}
               >
                 Siguiente
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
