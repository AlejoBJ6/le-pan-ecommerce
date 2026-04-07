import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import pedidoService from '../../services/pedidoService';
import uploadService from '../../services/uploadService';
import { LuTruck, LuLink, LuUpload, LuCircleCheck } from 'react-icons/lu';
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
  const [uploadingOrder, setUploadingOrder] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getUserProfile();
        setNombre(data.nombre);
        setEmail(data.email);
        
        try {
          const pedData = await pedidoService.getMisPedidos();
          setPedidos(pedData);
        } catch (pedidoErr) {
          console.error("Error al cargar pedidos", pedidoErr);
        } finally {
          setLoadingPedidos(false);
        }
      } catch (err) {
        setError('Error al cargar datos del perfil');
        setLoadingPedidos(false);
      }
    };
    fetchProfile();
  }, []);

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
      await authService.updateUserProfile({ nombre, email, password });
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

  const handleUploadComprobante = async (pedidoId, file) => {
    if (!file) return;
    setUploadingOrder(pedidoId);
    setError(null);
    setMensaje(null);
    try {
      const uploadRes = await uploadService.uploadImage(file);
      await pedidoService.subirComprobante(pedidoId, uploadRes.imageUrl);
      
      // Update local state to reflect the uploaded receipt
      setPedidos(pedidos.map(p => 
        p._id === pedidoId ? { ...p, comprobanteTransferencia: uploadRes.imageUrl } : p
      ));
      setMensaje('Comprobante subido y asociado correctamente al pedido.');
    } catch (err) {
      console.error(err);
      setError('Hubo un error al subir el comprobante. Intenta nuevamente.');
    } finally {
      setUploadingOrder(null);
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
           
           {loadingPedidos ? (
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
             <div className="orders-list">
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
                    
                    {pedido.metodoPago === 'transferencia' && (
                      <div className="order-receipt-section" style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                        {pedido.comprobanteTransferencia ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', fontSize: '0.9rem', fontWeight: '500' }}>
                            <LuCircleCheck size={20} />
                            Comprobante enviado (en revisión)
                            <a href={pedido.comprobanteTransferencia} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: 'var(--color-primary)', textDecoration: 'underline' }}>Ver archivo</a>
                          </div>
                        ) : (
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
                                onChange={(e) => handleUploadComprobante(pedido._id, e.target.files[0])}
                              />
                              <button 
                                onClick={() => document.getElementById(`file-${pedido._id}`).click()}
                                disabled={uploadingOrder === pedido._id}
                                style={{
                                  padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '6px', border: 'none', cursor: uploadingOrder === pedido._id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold'
                                }}
                              >
                                <LuUpload size={16} />
                                {uploadingOrder === pedido._id ? 'Subiendo...' : 'Subir Comprobante'}
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
        </div>
      </div>
    </div>
  );
};

export default Perfil;
