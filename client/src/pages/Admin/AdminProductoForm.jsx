import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import productoService from '../../services/productoService';
import categoriaService from '../../services/categoriaService';

const isVideo = (url) => typeof url === 'string' && url.match(/\.(mp4|webm|mov)$/i);

const AdminProductoForm = ({ isCombo = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    comision: 0,
    categoria: isCombo ? 'Combos' : 'Hornos',
    marca: '',
    modelo: '',
    imagenes: '',
    stock: 0,
    disponible: true,
    destacado: false,
  });
  const [caracteristicas, setCaracteristicas] = useState([{ nombre: '', valor: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [categorias, setCategorias] = useState([]);

  // Validation state
  const [touched, setTouched] = useState({});
  const [displayPrice, setDisplayPrice] = useState('');
  const [displayComision, setDisplayComision] = useState('');
  
  // Categoría en línea
  const [showNuevaCategoria, setShowNuevaCategoria] = useState(false);
  const [nuevaCategoriaNombre, setNuevaCategoriaNombre] = useState('');
  const [creandoCategoria, setCreandoCategoria] = useState(false);

  useEffect(() => {
    // Cargar categorías dinámicas
    categoriaService.obtenerCategorias().then(setCategorias).catch(console.error);

    if (isEditMode) {
      const fetchProducto = async () => {
        try {
          const data = await productoService.obtenerProductoPorId(id);
          setFormData({
            ...data,
            imagenes: data.imagenes ? data.imagenes.join(', ') : ''
          });
          if (data.precio) {
            setDisplayPrice(new Intl.NumberFormat('es-AR').format(data.precio));
          }
          if (data.comision) {
            setDisplayComision(new Intl.NumberFormat('es-AR').format(data.comision));
          }
          if (data.caracteristicas && data.caracteristicas.length > 0) {
            setCaracteristicas(data.caracteristicas);
          }
        } catch (err) {
          setError('Error al cargar el producto para editar');
        }
      };
      fetchProducto();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handlePriceChange = (e) => {
    // Solo permitir números
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue === '') {
      setDisplayPrice('');
      setFormData({ ...formData, precio: 0 });
      return;
    }
    const numValue = parseInt(rawValue, 10);
    // Format visual display (e.g. 1.500.000)
    setDisplayPrice(new Intl.NumberFormat('es-AR').format(numValue));
    setFormData({ ...formData, precio: numValue });
  };

  const handleComisionChange = (e) => {
    // Solo permitir números
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue === '') {
      setDisplayComision('');
      setFormData({ ...formData, comision: 0 });
      return;
    }
    const numValue = parseInt(rawValue, 10);
    setDisplayComision(new Intl.NumberFormat('es-AR').format(numValue));
    setFormData({ ...formData, comision: numValue });
  };

  const isInvalid = (name) => {
    return touched[name] && (!formData[name] || String(formData[name]).trim() === '');
  };

  const isInvalidNum = (name) => {
    return touched[name] && (formData[name] === '' || formData[name] < 0);
  };

  const handleCrearCategoria = async () => {
    if (!nuevaCategoriaNombre || nuevaCategoriaNombre.trim() === '') {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }
    setCreandoCategoria(true);
    setError(null);
    try {
      const nuevaCat = await categoriaService.crearCategoria(nuevaCategoriaNombre);
      setCategorias([...categorias, nuevaCat]);
      setFormData({ ...formData, categoria: nuevaCat.nombre });
      setShowNuevaCategoria(false);
      setNuevaCategoriaNombre('');
      setCreandoCategoria(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la categoría.');
      setCreandoCategoria(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marcar todos como tocados para mostrar errores
    const allTouched = { nombre: true, descripcion: true, precio: true, stock: true };
    setTouched(allTouched);

    if (!formData.nombre || !formData.descripcion || formData.precio < 0 || formData.stock < 0) {
      setError('Por favor, completa correctamente todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    setError(null);

    const productoData = {
      ...formData,
      precio: Number(formData.precio),
      comision: Number(formData.comision),
      stock: Number(formData.stock),
      imagenes: formData.imagenes.split(',').map(url => url.trim()).filter(url => url !== ''),
      caracteristicas: caracteristicas.filter(c => c.nombre.trim() !== '' && c.valor.trim() !== '')
    };

    try {
      if (isEditMode) {
        await productoService.actualizarProducto(id, productoData);
      } else {
        await productoService.crearProducto(productoData);
      }
      navigate(isCombo ? '/admin/combos' : '/admin/productos');
    } catch (err) {
      setError(err.response?.data?.message || 'Hubo un error al guardar el producto');
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoImagen(true);
    try {
      const data = await productoService.uploadImage(file);
      setFormData({
        ...formData,
        imagenes: formData.imagenes ? `${formData.imagenes}, ${data.imageUrl}` : data.imageUrl
      });
      setSubiendoImagen(false);
    } catch (err) {
      console.error(err);
      setSubiendoImagen(false);
      setError('Error al subir la imagen a Cloudinary (verifica que el backend esté corriendo y tus keys de .env estén correctas)');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-dark)', fontSize: '1.8rem' }}>
          {isEditMode ? (isCombo ? 'Editar Combo' : 'Editar Producto') : (isCombo ? 'Crear Nuevo Combo' : 'Crear Nuevo Producto')}
        </h2>
        <Link 
          to={isCombo ? "/admin/combos" : "/admin/productos"} 
          style={{ color: 'var(--color-dark)', textDecoration: 'underline', fontWeight: 600, fontSize: '1.05rem' }}
        >
          Cancelar
        </Link>
      </div>

      {error && <div style={{ backgroundColor: '#fff8f8', color: '#dc3545', padding: '15px 20px', borderRadius: '6px', marginBottom: '24px', border: '1px solid #f5c2c7', fontWeight: 500 }}>⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        
        {/* SECCIÓN: INFORMACIÓN BÁSICA */}
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Información Básica</h3>
          
          <div className="admin-input-group full-width">
            <label>Nombre del {isCombo ? 'Combo' : 'Producto'} *</label>
            <input 
              type="text" 
              name="nombre" 
              className={`admin-input-control ${isInvalid('nombre') ? 'has-error' : ''}`}
              value={formData.nombre} 
              onChange={handleChange} 
              onBlur={handleBlur}
              placeholder={`Ej: ${isCombo ? 'Combo Panadería Inicial' : 'Amasadora 20L'}`}
            />
            {isInvalid('nombre') && <span className="admin-input-error-msg">Este campo es obligatorio.</span>}
          </div>

          <div className="admin-input-group full-width">
            <label>Descripción *</label>
            <textarea 
              name="descripcion" 
              className={`admin-input-control ${isInvalid('descripcion') ? 'has-error' : ''}`}
              value={formData.descripcion} 
              onChange={handleChange} 
              onBlur={handleBlur}
              rows="4" 
              placeholder="Describe las características principales..."
            ></textarea>
            {isInvalid('descripcion') && <span className="admin-input-error-msg">Este campo es obligatorio.</span>}
          </div>

          <div className="admin-input-group full-width">
            <label>Categoría *</label>
            {isCombo ? (
              <input type="text" value="Combos" disabled className="admin-input-control" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {!showNuevaCategoria ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      name="categoria"
                      className="admin-input-control"
                      value={formData.categoria}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    >
                      {categorias.length === 0 ? (
                        <option value="">— Sin categorías (creá una) —</option>
                      ) : (
                        <>
                          <option value="" disabled>— Seleccionar categoría —</option>
                          {categorias.map((cat) => (
                            <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
                          ))}
                          <option value="Sin categoría" style={{ color: '#856404', fontWeight: 'bold' }}>Sin categoría</option>
                        </>
                      )}
                    </select>
                    <button 
                      type="button" 
                      onClick={() => setShowNuevaCategoria(true)}
                      style={{ 
                        backgroundColor: 'var(--color-dark)', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '6px', 
                        padding: '0 16px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      + Nueva
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      className="admin-input-control" 
                      value={nuevaCategoriaNombre}
                      onChange={(e) => setNuevaCategoriaNombre(e.target.value)}
                      placeholder="Nombre de la nueva categoría..."
                      style={{ flex: 1 }}
                      autoFocus
                    />
                    <button 
                      type="button" 
                      onClick={handleCrearCategoria}
                      disabled={creandoCategoria}
                      style={{ 
                        backgroundColor: 'var(--color-primary)', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '6px', 
                        padding: '0 16px', 
                        cursor: creandoCategoria ? 'not-allowed' : 'pointer', 
                        fontWeight: 'bold',
                        height: '100%',
                        minHeight: '44px'
                      }}
                    >
                      {creandoCategoria ? '...' : 'Crear'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowNuevaCategoria(false);
                        setNuevaCategoriaNombre('');
                      }}
                      style={{ 
                        backgroundColor: 'white', 
                        color: 'var(--color-dark)', 
                        border: '1px solid #ccc', 
                        borderRadius: '6px', 
                        padding: '0 16px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        height: '100%',
                        minHeight: '44px'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN: INVENTARIO Y PRECIO */}
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Inventario y Precio</h3>
          
          <div className="admin-form-grid">
            <div className="admin-input-group">
              <label>Precio ($) *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-dark)', fontWeight: 600 }}>$</span>
                <input 
                  type="text" 
                  name="precio" 
                  className={`admin-input-control ${isInvalidNum('precio') ? 'has-error' : ''}`}
                  value={displayPrice} 
                  onChange={handlePriceChange} 
                  onBlur={() => setTouched({ ...touched, precio: true })}
                  style={{ paddingLeft: '28px' }}
                  placeholder="0"
                />
              </div>
              {isInvalidNum('precio') && <span className="admin-input-error-msg">Ingresa un precio válido.</span>}
            </div>

            <div className="admin-input-group">
              <label>Comisión ($)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-dark)', fontWeight: 600 }}>$</span>
                <input 
                  type="text" 
                  name="comision" 
                  className={`admin-input-control ${isInvalidNum('comision') ? 'has-error' : ''}`}
                  value={displayComision} 
                  onChange={handleComisionChange} 
                  onBlur={() => setTouched({ ...touched, comision: true })}
                  style={{ paddingLeft: '28px' }}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label>Stock *</label>
              <input 
                type="number" 
                name="stock" 
                className={`admin-input-control ${isInvalidNum('stock') ? 'has-error' : ''}`}
                value={formData.stock} 
                onChange={handleChange} 
                onBlur={handleBlur}
                min="0" 
                step="1"
              />
              {isInvalidNum('stock') && <span className="admin-input-error-msg">Ingresa un stock válido.</span>}
            </div>

            {!isCombo && (
              <>
                <div className="admin-input-group">
                  <label>Marca</label>
                  <input 
                    type="text" 
                    name="marca" 
                    className="admin-input-control"
                    value={formData.marca} 
                    onChange={handleChange} 
                    placeholder="Ej: Argental"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Modelo</label>
                  <input 
                    type="text" 
                    name="modelo" 
                    className="admin-input-control"
                    value={formData.modelo} 
                    onChange={handleChange} 
                    placeholder="Ej: AM-20"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SECCIÓN: ESTADO DEL PRODUCTO */}
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Visibilidad e Impulso</h3>
          
          <div className="admin-form-grid">
            <label className="admin-checkbox-group">
              <input type="checkbox" name="disponible" checked={formData.disponible} onChange={handleChange} />
              <span>Activo / Disponible para venta</span>
            </label>
            
            <label className="admin-checkbox-group" style={{ backgroundColor: formData.destacado ? 'rgba(226, 88, 34, 0.1)' : 'var(--color-gray-light)' }}>
              <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleChange} />
              <span>⭐ Destacar en portada</span>
            </label>
          </div>
        </div>

        {/* SECCIÓN: MULTIMEDIA */}
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Multimedia</h3>
          
          <div className="admin-input-group full-width">
             <label>Imagen del {isCombo ? 'Combo' : 'Producto'}</label>
             
             <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
               <label style={{ margin: 0, padding: '10px 16px', backgroundColor: 'var(--color-dark)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'inline-block' }}>
                 Subir Archivo
                 <input type="file" onChange={uploadFileHandler} accept="image/*,video/mp4,video/webm,video/quicktime" style={{ display: 'none' }} />
               </label>
               {subiendoImagen && <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Subiendo a Cloudinary... ⬆️</span>}
               <span style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>o podés pegar una URL existente abajo</span>
             </div>
             
             <input 
               type="text" 
               name="imagenes" 
               className="admin-input-control"
               value={formData.imagenes} 
               onChange={handleChange} 
               placeholder="Ej: https://midominio.com/imagen.jpg (separadas por coma)" 
             />
             
             {formData.imagenes && formData.imagenes.split(',').filter(u => u.trim() !== '').length > 0 && (
               <div style={{ marginTop: '20px', backgroundColor: 'var(--color-gray-light)', padding: '15px', borderRadius: '6px' }}>
                 <p style={{ fontSize: '0.9rem', color: 'var(--color-dark)', margin: '0 0 10px 0', fontWeight: 600 }}>Vista previa:</p>
                 <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                   {formData.imagenes.split(',').filter(url => url.trim() !== '').map((url, i) => (
                     <div key={i} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ccc', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isVideo(url.trim()) ? (
                          <video 
                            src={url.trim()} 
                            muted autoPlay loop playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <img 
                            src={url.trim()} 
                            alt="preview" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Error'; }}
                          />
                        )}
                        {/* Botón para eliminar imagen */}
                        <button 
                          type="button"
                          onClick={() => {
                            const urls = formData.imagenes.split(',').map(u => u.trim()).filter(u => u !== '');
                            const newUrls = urls.filter((_, idx) => idx !== i);
                            handleChange({ target: { name: 'imagenes', value: newUrls.join(', ') } });
                          }}
                          style={{
                            position: 'absolute', top: '4px', right: '4px',
                            backgroundColor: 'rgba(220, 53, 69, 0.9)', color: 'white',
                            border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                          title="Borrar imagen"
                        >
                          ✕
                        </button>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* SECCIÓN: ESPECIFICACIONES TÉCNICAS */}
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Especificaciones Técnicas</h3>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '16px' }}>Agregá filas con las specs del producto. Ej: Potencia → 2HP, Material → Acero Inoxidable</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {caracteristicas.map((spec, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="admin-input-control"
                  placeholder="Nombre (ej: Potencia)"
                  value={spec.nombre}
                  onChange={e => {
                    const updated = [...caracteristicas];
                    updated[idx] = { ...updated[idx], nombre: e.target.value };
                    setCaracteristicas(updated);
                  }}
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  className="admin-input-control"
                  placeholder="Valor (ej: 2HP)"
                  value={spec.valor}
                  onChange={e => {
                    const updated = [...caracteristicas];
                    updated[idx] = { ...updated[idx], valor: e.target.value };
                    setCaracteristicas(updated);
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setCaracteristicas(caracteristicas.filter((_, i) => i !== idx))}
                  style={{ backgroundColor: '#fff', border: '1px solid #f5c2c7', borderRadius: '6px', color: '#dc3545', fontWeight: 'bold', width: '38px', height: '38px', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}
                  title="Eliminar fila"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCaracteristicas([...caracteristicas, { nombre: '', valor: '' }])}
            style={{ marginTop: '14px', backgroundColor: 'transparent', border: '1px dashed var(--color-primary)', borderRadius: '6px', color: 'var(--color-primary)', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', width: '100%' }}
          >
            + Agregar especificación
          </button>
        </div>

        <div style={{ marginTop: '30px', marginBottom: '40px' }}>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              backgroundColor: 'var(--color-primary)', 
              color: 'var(--color-white)', 
              padding: '16px 24px', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '1.1rem',
              width: '100%',
              boxShadow: '0 4px 12px rgba(226, 88, 34, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Guardando...' : (isEditMode ? (isCombo ? 'Actualizar Combo' : 'Actualizar Producto') : (isCombo ? 'Crear Combo' : 'Crear Producto'))}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminProductoForm;
