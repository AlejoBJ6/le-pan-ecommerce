import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import productoService from '../../services/productoService';

const AdminProductoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'Hornos',
    marca: '',
    modelo: '',
    imagenes: '',
    stock: 0,
    disponible: true,
    destacado: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchProducto = async () => {
        try {
          const data = await productoService.obtenerProductoPorId(id);
          setFormData({
            ...data,
            // Convertimos el array de imagenes a string separado por comas para el input de texto
            imagenes: data.imagenes ? data.imagenes.join(', ') : ''
          });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Preparar los datos antes de enviar
    const productoData = {
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      // Convertir string de vuelta a array
      imagenes: formData.imagenes.split(',').map(url => url.trim()).filter(url => url !== '')
    };

    try {
      if (isEditMode) {
        await productoService.actualizarProducto(id, productoData);
      } else {
        await productoService.crearProducto(productoData);
      }
      navigate('/admin/productos');
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
      // Si todo va bien, sumamos o reemplazamos las URLs
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
    <div style={{ maxWidth: '800px', backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-dark)' }}>{isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
        <Link to="/admin/productos" style={{ color: 'var(--color-gray)', textDecoration: 'none' }}>Cancelar</Link>
      </div>

      {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px 15px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Nombre del Producto *</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-gray)', backgroundColor: 'var(--color-gray-light)', color: 'var(--color-dark)' }} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Descripción *</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required rows="4" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-gray)', backgroundColor: 'var(--color-gray-light)', color: 'var(--color-dark)' }}></textarea>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Precio ($) *</label>
           <input type="number" name="precio" value={formData.precio} onChange={handleChange} required min="0" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-gray)', backgroundColor: 'var(--color-gray-light)', color: 'var(--color-dark)' }} />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Categoría *</label>
           <select name="categoria" value={formData.categoria} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-gray)', backgroundColor: 'var(--color-gray-light)', color: 'var(--color-dark)' }}>
             <option value="Hornos">Hornos</option>
             <option value="Amasadoras">Amasadoras</option>
             <option value="Laminadoras">Laminadoras</option>
             <option value="Batidoras">Batidoras</option>
             <option value="Varios">Varios</option>
           </select>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Marca</label>
           <input type="text" name="marca" value={formData.marca} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-gray)', backgroundColor: 'var(--color-gray-light)', color: 'var(--color-dark)' }} />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Modelo</label>
           <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Stock *</label>
           <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
           <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
             <input type="checkbox" name="disponible" checked={formData.disponible} onChange={handleChange} />
             Activo / Disponible
           </label>
           <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
             <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleChange} />
             Destacar en portada
           </label>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Imagen del Producto</label>
           
           <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
             <input type="file" onChange={uploadFileHandler} accept="image/*" style={{ padding: '8px', border: '1px solid var(--color-gray)', borderRadius: '4px', backgroundColor: 'var(--color-gray-light)', width: 'auto' }} />
             {subiendoImagen && <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Subiendo a Cloudinary... ⬆️</span>}
           </div>
           
           <input type="text" name="imagenes" value={formData.imagenes} onChange={handleChange} placeholder="Opcional: O ingresa la URL manualmente..." style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-gray)', backgroundColor: 'var(--color-gray-light)', color: 'var(--color-dark)' }} />
           
           {formData.imagenes && formData.imagenes.split(',').filter(u => u.trim() !== '').length > 0 && (
             <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
               <p style={{ width: '100%', fontSize: '0.9rem', color: 'var(--color-gray)', margin: 0 }}>Vista previa de las imágenes cargadas:</p>
               {formData.imagenes.split(',').filter(url => url.trim() !== '').map((url, i) => (
                 <img key={i} src={url.trim()} alt="preview" style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-gray)' }} />
               ))}
             </div>
           )}
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
          <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
            {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminProductoForm;
