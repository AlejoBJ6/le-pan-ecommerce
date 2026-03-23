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
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>URLs de Imágenes (separadas por coma)</label>
           <input type="text" name="imagenes" value={formData.imagenes} onChange={handleChange} placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
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
