import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import productoService from '../../services/productoService';

const AdminComboBuilder = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  
  const [comboName, setComboName] = useState('');
  const [comboPrice, setComboPrice] = useState(0);
  const [comboImages, setComboImages] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productoService.obtenerProductos();
        setProductos(data.filter(p => p.categoria !== 'Combos'));
      } catch (err) {
        setError('Error al cargar catálogo');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    if (seleccionados.length > 0) {
      const suggestedName = 'Combo Especial: ' + seleccionados.map(p => p.nombre).join(' + ');
      const subotal = seleccionados.reduce((acc, p) => acc + p.precio, 0);
      const suggestedPrice = Math.round(subotal * 0.9); // 10% discount baseline
      
      setComboName(suggestedName);
      setComboPrice(suggestedPrice);
    } else {
      setComboName('');
      setComboPrice(0);
    }
  }, [seleccionados]);

  const toggleSeleccion = (producto) => {
    if (seleccionados.find(p => p._id === producto._id)) {
      setSeleccionados(seleccionados.filter(p => p._id !== producto._id));
    } else {
      setSeleccionados([...seleccionados, producto]);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoImagen(true);
    try {
      const data = await productoService.uploadImage(file);
      setComboImages(comboImages ? `${comboImages}, ${data.imageUrl}` : data.imageUrl);
      setSubiendoImagen(false);
    } catch (err) {
      console.error(err);
      setSubiendoImagen(false);
      setError('Error al subir la imagen a Cloudinary (verifica backend y .env)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (seleccionados.length === 0) {
      setError('Debes seleccionar al menos un producto para formar un combo.');
      return;
    }
    setSaving(true);
    setError(null);

    const subotal = seleccionados.reduce((acc, p) => acc + p.precio, 0);

    const productoData = {
      nombre: comboName,
      descripcion: `Combo especial armado que incluye: ${seleccionados.map(p => p.nombre).join(', ')}. Ideal para equipar tu negocio al mejor precio.`,
      precio: Number(comboPrice),
      precioAnterior: subotal, 
      categoria: 'Combos',
      marca: 'Lé Pan Combos',
      modelo: 'PACK',
      imagenes: comboImages.split(',').map(url => url.trim()).filter(url => url !== ''),
      stock: 5, 
      disponible: true,
      destacado: true,
    };

    try {
      await productoService.crearProducto(productoData);
      navigate('/admin/combos');
    } catch (err) {
      setError(err.response?.data?.message || 'Hubo un error al guardar el combo');
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando catálogo para ensamblar...</div>;

  const subtotalNeto = seleccionados.reduce((acc, p) => acc + p.precio, 0);

  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      
      {/* Left Column: Catalog Selectable */}
      <div style={{ flex: '1', minWidth: '400px', backgroundColor: 'var(--color-white)', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ marginTop: 0, color: 'var(--color-dark)' }}>Paso 1: Construye tu Combo</h2>
        <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>Haz clic en el catálogo inferior para agrupar máquinas en una sola súper-oferta.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
          {productos.map(p => {
            const isSelected = seleccionados.find(sel => sel._id === p._id);
            return (
              <div 
                key={p._id} 
                onClick={() => toggleSeleccion(p)}
                style={{ 
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-gray-light)', 
                  borderRadius: '6px', 
                  padding: '10px', 
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#fff9db' : 'white',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {isSelected && <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--color-primary)', color: 'black', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>}
                <img src={p.imagenes[0] || 'https://via.placeholder.com/150'} alt={p.nombre} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                <h4 style={{ margin: '0 0 5px 0', fontSize: '0.85rem', lineHeight: '1.2' }}>{p.nombre}</h4>
                <p style={{ margin: 0, color: 'var(--color-dark)', fontWeight: 'bold' }}>${p.precio.toLocaleString('es-AR')}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Combo Builder Details */}
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--color-dark)' }}>Paso 2: Lanzar Oferta</h2>
          <Link to="/admin/combos" style={{ color: 'var(--color-gray)', textDecoration: 'none', fontSize: '0.9em' }}>Cancelar</Link>
        </div>

        {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

        <div style={{ marginBottom: '20px', backgroundColor: 'var(--color-gray-light)', padding: '15px', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Máquinas Incluidas ({seleccionados.length})</h4>
          {seleccionados.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--color-gray)', fontSize: '0.9rem' }}>Vacío.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--color-dark)' }}>
              {seleccionados.map(s => <li key={s._id} style={{ marginBottom: '5px' }}>{s.nombre} - ${s.precio.toLocaleString('es-AR')}</li>)}
            </ul>
          )}
          <div style={{ borderTop: '1px solid #ccc', margin: '15px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
            <span>Suma de Precios:</span>
            <span>${subtotalNeto.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, fontSize: '0.9rem' }}>Título de la Oferta *</label>
            <input type="text" value={comboName} onChange={(e) => setComboName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-gray)' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, fontSize: '0.9rem' }}>Precio Combo Final ($) *</label>
            <input type="number" value={comboPrice} onChange={(e) => setComboPrice(e.target.value)} required min="0" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-gray)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>El sistema aplicó un 10% automático, pero modifícalo como gustes.</span>
          </div>

          <div>
             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, fontSize: '0.9rem' }}>Imagen para la Tienda (Opcional)</label>
             <input type="file" onChange={uploadFileHandler} accept="image/*" style={{ padding: '6px', border: '1px solid var(--color-gray)', borderRadius: '4px', backgroundColor: 'var(--color-gray-light)', width: '100%', marginBottom: '8px' }} />
             {subiendoImagen && <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>Subiendo...</span>}
             <input type="text" value={comboImages} onChange={(e) => setComboImages(e.target.value)} placeholder="O ingresa un LINK directo de imagen de internet..." style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-gray)', marginTop: '5px' }} />
             {comboImages && <p style={{fontSize: '0.8rem', color: 'green', margin: '5px 0 0 0'}}>¡Imagen cargada lista para usarse!</p>}
          </div>

          <button type="submit" disabled={saving || seleccionados.length === 0} style={{ marginTop: '10px', backgroundColor: seleccionados.length > 0 ? 'var(--color-primary)' : '#ccc', color: 'var(--color-dark)', padding: '12px', border: 'none', borderRadius: '4px', cursor: seleccionados.length > 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '1rem' }}>
            {saving ? 'Publicando...' : 'Publicar Combo de Inmediato 🚀'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminComboBuilder;
