import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pedidoService from '../../services/pedidoService';
import uploadService from '../../services/uploadService';
import { 
  LuSearch, LuPackage, LuTruck, LuPhone, LuNotebook, 
  LuBuilding2, LuUpload, LuCircleCheck, LuChevronLeft 
} from 'react-icons/lu';
import './ConsultarPedido.css';

const ConsultarPedido = () => {
    const navigate = useNavigate();
    const [orderIdShort, setOrderIdShort] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [pedido, setPedido] = useState(null);
    const [error, setError] = useState(null);

    // States for upload process
    const [uploading, setUploading] = useState(false);
    const [comprobante, setComprobante] = useState(null);
    const [pendingFile, setPendingFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Auto-completado desde localStorage (Memoria para invitados)
    useEffect(() => {
        const savedId = localStorage.getItem('lepan_guest_last_order_id');
        const savedEmail = localStorage.getItem('lepan_guest_last_email');
        if (savedId) setOrderIdShort(savedId);
        if (savedEmail) setEmail(savedEmail);
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        setPedido(null);
        setComprobante(null);
        
        try {
            const data = await pedidoService.trackPedido(orderIdShort, email);
            setPedido(data);
            if (data.comprobanteTransferencia) {
                setComprobante(data.comprobanteTransferencia);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'No se encontró el pedido. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setPendingFile(file);
        
        if (file.type.startsWith('image/')) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleConfirmUpload = async () => {
        if (!pendingFile || !pedido) return;
        setUploading(true);
        try {
            // Check if user is logged in to use the right endpoint
            const userStr = localStorage.getItem('user');
            let uploadRes;
            if (userStr) {
                uploadRes = await uploadService.uploadImage(pendingFile);
            } else {
                const formData = new FormData();
                formData.append('image', pendingFile);
                const response = await fetch('/api/upload/guest', { method: 'POST', body: formData });
                uploadRes = await response.json();
            }

            await pedidoService.subirComprobante(pedido._id, uploadRes.imageUrl);
            setComprobante(uploadRes.imageUrl);
            
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPendingFile(null);
            setPreviewUrl(null);
        } catch (err) {
            console.error(err);
            alert('Error al subir el comprobante. Intentá de nuevo.');
        } finally {
            setUploading(false);
        }
    };

    const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p);

    const getStatusClass = (status) => {
        if (status === 'Aprobado' || status === 'Entregado') return 'status-approved';
        if (status === 'Pendiente') return 'status-pending';
        return 'status-default';
    };

    // UI Render logic
    return (
        <div className="track-page">
            <div className="track-container">
                {!pedido ? (
                    <div className="track-search-card">
                        <div className="track-header">
                            <LuSearch className="track-icon-main" />
                            <h1>Consultar mi Pedido</h1>
                            <p>Ingresa los detalles de tu compra para ver el estado y subir el comprobante.</p>
                        </div>
                        
                        {error && <div className="alert-error">{error}</div>}

                        <form onSubmit={handleSearch} className="track-form">
                            <div className="form-group">
                                <label>Número de Pedido</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: ABC123" 
                                    value={orderIdShort}
                                    onChange={(e) => setOrderIdShort(e.target.value.toUpperCase())}
                                    required
                                />
                                <small>Son los últimos 6 caracteres de tu comprobante.</small>
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    placeholder="tu@email.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <small>El email que usaste al realizar la compra.</small>
                            </div>
                            <button type="submit" className="btn-track-submit" disabled={loading}>
                                {loading ? <span className="spinner-border"></span> : 'Consultar Pedido'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="track-result-view">
                        <button className="btn-back-search" onClick={() => setPedido(null)}>
                            <LuChevronLeft /> Volver a buscar
                        </button>
                        
                        <div className="track-order-header">
                            <div className="order-main-info">
                                <h2>Pedido #{pedido._id.slice(-6).toUpperCase()}</h2>
                                <p className="order-date">Realizado el {new Date(pedido.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="order-status-group">
                                <span className={`status-badge ${getStatusClass(pedido.estadoPago)}`}>
                                    Pago: {pedido.estadoPago}
                                </span>
                                <span className={`status-badge ${getStatusClass(pedido.estadoEntrega)}`}>
                                    Envío: {pedido.estadoEntrega}
                                </span>
                            </div>
                        </div>

                        {/* Receipt Upload Section */}
                        {pedido.metodoPago === 'transferencia' && (
                            <div className="track-receipt-section">
                                {comprobante ? (
                                    <div className="receipt-success">
                                        <LuCircleCheck size={28} />
                                        <div>
                                            <strong>¡Comprobante enviado!</strong>
                                            <p>Ya lo recibimos y lo estamos revisando. No hace falta hacer nada más.</p>
                                        </div>
                                    </div>
                                ) : pendingFile ? (
                                    <div className="receipt-confirm">
                                        <h4>Confirmar Comprobante</h4>
                                        {previewUrl ? (
                                            <div className="preview-container">
                                                <img src={previewUrl} alt="Preview" />
                                            </div>
                                        ) : (
                                            <div className="pdf-preview">
                                                <span>📄</span>
                                                <p>{pendingFile.name}</p>
                                            </div>
                                        )}
                                        <div className="file-info">
                                            <strong>{pendingFile.name}</strong> • {(pendingFile.size / 1024).toFixed(1)} KB
                                        </div>
                                        <div className="confirm-btns">
                                            <button className="btn-confirm-upload" onClick={handleConfirmUpload} disabled={uploading}>
                                                {uploading ? 'Subiendo...' : 'Confirmar y subir'}
                                            </button>
                                            <button className="btn-cancel-upload" onClick={() => { setPendingFile(null); setPreviewUrl(null); }} disabled={uploading}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="receipt-upload-prompt">
                                        <LuBuilding2 className="prompt-icon" />
                                        <div className="prompt-text">
                                            <h4>Pendiente de Pago</h4>
                                            <p>Este pedido se abona por transferencia. Por favor, adjuntá tu comprobante aquí.</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            id="track-file" 
                                            style={{display:'none'}} 
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileSelect(e.target.files[0])}
                                        />
                                        <button className="btn-select-file" onClick={() => document.getElementById('track-file').click()}>
                                            <LuUpload /> Seleccionar comprobante
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="track-details-grid">
                            <div className="track-card items-card">
                                <h3><LuPackage /> Productos</h3>
                                <div className="track-items-list">
                                    {pedido.pedidosData.map((item, i) => (
                                        <div key={i} className="track-item-row">
                                            <span>{item.nombre} x{item.cantidad}</span>
                                            <span>{formatPrice((item.precio || item.precioFinal || 0) * item.cantidad)}</span>
                                        </div>
                                    ))}
                                    <div className="track-divider"></div>
                                    <div className="track-total-row">
                                        <span>Total</span>
                                        <span>{formatPrice(pedido.totales.total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="track-card shipping-card">
                                <h3><LuTruck /> Entrega</h3>
                                <div className="shipping-info">
                                    <p><strong>Destinatario:</strong> {pedido.datosEntrega.nombre} {pedido.datosEntrega.apellido}</p>
                                    <p><strong>Dirección:</strong> {pedido.datosEntrega.direccion}{pedido.datosEntrega.piso ? `, ${pedido.datosEntrega.piso}` : ''}</p>
                                    <p>{pedido.datosEntrega.ciudad}, {pedido.datosEntrega.provincia} ({pedido.datosEntrega.cp})</p>
                                    <p><LuPhone /> {pedido.datosEntrega.telefono}</p>
                                    {pedido.datosEntrega.notas && (
                                        <p className="shipping-notes"><LuNotebook /> {pedido.datosEntrega.notas}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="track-footer-actions">
                             <button className="btn-continue-shopping" onClick={() => navigate('/productos')}>
                                 Seguir comprando
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultarPedido;
