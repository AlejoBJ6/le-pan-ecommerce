import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import pedidoService from '../../services/pedidoService';
import { LuTruck } from 'react-icons/lu';

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
  const { user, logout } = useContext(AuthContext);
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
      setMensaje('Perfil actualizado correctamente. Refresca la página si no ves tu nombre actualizado arriba.');
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

  return (
    <div className="container" style={{ padding: '60px 16px', minHeight: '60vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--color-white)', padding: '30px', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-sm)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Mi Perfil</h2>
          <button 
            onClick={handleLogout} 
            style={{ 
              backgroundColor: 'transparent', 
              color: '#dc3545', 
              border: '1px solid #dc3545', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: '600',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fff5f5'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </button>
        </div>
        
        {mensaje && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px 15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #c3e6cb' }}>{mensaje}</div>}
        {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px 15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>{error}</div>}

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-dark)' }}>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fdfdfd', color: 'var(--color-dark)', fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-dark)' }}>Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fdfdfd', color: 'var(--color-dark)', fontSize: '1rem' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-dark)' }}>Nueva Contraseña (opcional)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Dejar en blanco para conservar la actual" 
                style={{ width: '100%', padding: '12px', paddingRight: '40px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fdfdfd', color: 'var(--color-dark)', fontSize: '1rem' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
                aria-label="Ver contraseña"
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>
          </div>

          {password && (
            <div style={{ position: 'relative', animation: 'fadeIn 0.3s ease' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-dark)' }}>Confirmar Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Repite la nueva contraseña" 
                  required={!!password}
                  style={{ width: '100%', padding: '12px', paddingRight: '40px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fdfdfd', color: 'var(--color-dark)', fontSize: '1rem' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
                  aria-label="Ver contraseña"
                >
                  <EyeIcon show={showConfirmPassword} />
                </button>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '14px', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '10px', transition: 'background-color 0.3s', cursor: 'pointer', boxShadow: '0 4px 6px rgba(226, 88, 34, 0.2)' }}>
            {loading ? 'Actualizando...' : 'Actualizar Perfil'}
          </button>
        </form>

        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
           <h3 style={{ color: 'var(--color-dark)', marginBottom: '20px', fontSize: '1.4rem' }}>Mis Órdenes</h3>
           
           {loadingPedidos ? (
             <p>Cargando tus órdenes...</p>
           ) : pedidos.length === 0 ? (
             <div style={{ padding: '40px 20px', backgroundColor: '#faf9f6', borderRadius: '8px', textAlign: 'center', border: '1px dashed #ddd', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
               <p style={{ color: 'var(--color-dark-2)', margin: 0, fontSize: '1.05rem' }}>No tienes órdenes registradas por el momento.</p>
               <button 
                  onClick={() => navigate('/productos')} 
                  style={{ marginTop: '5px', backgroundColor: 'var(--color-dark)', color: 'var(--color-white)', border: 'none', padding: '10px 24px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                 Ir a la tienda
               </button>
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
               {pedidos.map(pedido => {
                 const fMin = pedido.datosEntrega.fechaEstimadaMin ? new Date(pedido.datosEntrega.fechaEstimadaMin).toLocaleDateString() : '';
                 const fMax = pedido.datosEntrega.fechaEstimadaMax ? new Date(pedido.datosEntrega.fechaEstimadaMax).toLocaleDateString() : '';
                 return (
                 <div key={pedido._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                     <div>
                       <strong>Pedido #{pedido._id.slice(-6).toUpperCase()}</strong>
                       <span style={{ display: 'block', fontSize: '0.85rem', color: '#888' }}>{new Date(pedido.createdAt).toLocaleDateString()}</span>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                       <strong>${pedido.totales.total.toLocaleString('es-AR')}</strong>
                     </div>
                   </div>
                   <div style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                     {pedido.pedidosData.map((item, i) => (
                       <div key={i}>{item.cantidad}x {item.nombre}</div>
                     ))}
                   </div>
                   <div style={{ display: 'flex', gap: '10px' }}>
                     <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: pedido.estadoEntrega === 'Entregado' ? '#d4edda' : '#e2e3e5', color: pedido.estadoEntrega === 'Entregado' ? '#155724' : '#383d41' }}>
                       Envío: {pedido.estadoEntrega}
                     </span>
                     <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: pedido.estadoPago === 'Aprobado' ? '#d4edda' : '#fff3cd', color: pedido.estadoPago === 'Aprobado' ? '#155724' : '#856404' }}>
                       Pago: {pedido.estadoPago}
                     </span>
                   </div>
                   {pedido.estadoEntrega !== 'Entregado' && pedido.estadoEntrega !== 'Cancelado' && fMin && (
                     <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#17a2b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <LuTruck size={16} /> Entrega estimada: {fMin} a {fMax}
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
