import axios from 'axios';

const API_URL = '/api/pedidos';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

// Crear pedido
const crearPedido = async (pedidoData) => {
    const response = await axios.post(API_URL, pedidoData, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Obtener mis pedidos (Cliente)
const getMisPedidos = async () => {
    const response = await axios.get(`${API_URL}/mis-pedidos`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Obtener todos los pedidos (Admin)
const getAllPedidos = async () => {
    const response = await axios.get(API_URL, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Actualizar estado (Admin)
const updateEstadoPedido = async (id, estados) => {
    // estados: { estadoEntrega, estadoPago }
    const response = await axios.put(`${API_URL}/${id}/estado`, estados, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Subir comprobante (Cliente o Admin)
const subirComprobante = async (id, comprobanteUrl) => {
    const response = await axios.put(`${API_URL}/${id}/comprobante`, { comprobanteUrl }, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Verificar pago manual (Failsafe para localtunnel)
const forceWebhookVerify = async (paymentId) => {
    const response = await axios.post(`${API_URL}/webhook?type=payment&data.id=${paymentId}`);
    return response.data;
};

// Consultar pedido (Invitados)
const trackPedido = async (orderIdShort, email) => {
    const response = await axios.post(`${API_URL}/track`, { orderIdShort, email });
    return response.data;
};

const pedidoService = {
    crearPedido,
    getMisPedidos,
    getAllPedidos,
    updateEstadoPedido,
    subirComprobante,
    forceWebhookVerify,
    trackPedido
};

export default pedidoService;
