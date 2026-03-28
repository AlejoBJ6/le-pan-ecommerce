import React, { useState, useEffect } from 'react';
import comboConfigService from '../../services/comboConfigService.js';
import categoriaService from '../../services/categoriaService.js';

const AdminComboConfig = () => {
  const [config, setConfig] = useState({ 
    maxPrincipal: 1, maxComplemento: 1, descuento: 10, 
    tipoDescuento: 'porcentaje', categoriasPrincipal: [], categoriasComplemento: [] 
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [data, cats] = await Promise.all([
          comboConfigService.obtenerConfig(),
          categoriaService.obtenerCategorias()
        ]);
        setConfig({ 
          maxPrincipal: data.maxPrincipal || 1, 
          maxComplemento: data.maxComplemento || 1, 
          descuento: data.descuento || 0,
          tipoDescuento: data.tipoDescuento || 'porcentaje',
          categoriasPrincipal: data.categoriasPrincipal || [],
          categoriasComplemento: data.categoriasComplemento || []
        });
        setCategorias(cats.filter(c => c.nombre !== 'Combos').map(c => c.nombre));
      } catch {
        setError('No se pudo cargar la configuración.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const updateNumber = (field, delta) => {
    setConfig(c => {
      let val = c[field] + delta;
      if (field !== 'descuento' && val < 1) val = 1;
      if (field === 'descuento' && val < 0) val = 0;
      return { ...c, [field]: val };
    });
  };

  const toggleCategoria = (field, cat) => {
    setConfig(c => {
      const arr = c[field] || [];
      if (arr.includes(cat)) return { ...c, [field]: arr.filter(x => x !== cat) };
      return { ...c, [field]: [...arr, cat] };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setError('');
    try {
      await comboConfigService.actualizarConfig(config);
      setSuccessMsg('¡Configuración guardada con éxito! Los clientes ya verán los cambios.');
    } catch {
      setError('Error al guardar la configuración. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando configuración...</div>;

  const subtotalExample = config.tipoDescuento === 'fijo' ? (config.descuento > 1000 ? config.descuento * 2 : 10000) : 100; 
  const discountAmount = config.tipoDescuento === 'porcentaje' 
    ? subtotalExample * (config.descuento / 100)
    : config.descuento;
  const totalExample = Math.max(0, subtotalExample - discountAmount);

  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-dark)' }}>⚙️ Configuración: Armá tu Combo</h2>
      <p style={{ color: 'var(--color-gray)', marginBottom: '30px' }}>
        Controlá cuántos productos puede elegir el cliente en "Armá tu Combo" y qué descuento se aplica al finalizar.
      </p>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Config Form */}
        <div style={{ flex: 1, minWidth: '320px', backgroundColor: 'var(--color-white)', padding: '28px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}
          {successMsg && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>{successMsg}</div>}
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Max Principal */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--color-dark)' }}>
                🛒 Cantidad de Productos Principales (Paso 1)
              </label>
              <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', margin: '0 0 10px 0' }}>
                Cuántos productos debe elegir el cliente obligatoriamente en el primer paso.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button type="button" onClick={() => updateNumber('maxPrincipal', -1)} style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>-</button>
                <input
                  type="number"
                  min="1"
                  value={config.maxPrincipal}
                  onChange={(e) => setConfig(c => ({ ...c, maxPrincipal: Math.max(1, Number(e.target.value)) }))}
                  style={{ width: '80px', height: '40px', textAlign: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)', backgroundColor: '#fff9db', borderRadius: '8px', border: '2px solid var(--color-primary)' }}
                />
                <button type="button" onClick={() => updateNumber('maxPrincipal', 1)} style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>+</button>
              </div>

              {/* Selector Categorias Paso 1 */}
              <div style={{ marginTop: '16px', background: '#fcfcfc', border: '1px solid #eee', padding: '12px', borderRadius: '8px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--color-dark)' }}>
                  🏷️ Límite de Categorías (Paso 1)
                </label>
                <p style={{ color: '#888', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '12px' }}>
                  Si no seleccionas ninguna categoría, se mostrarán todos los productos de la tienda.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categorias.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategoria('categoriasPrincipal', cat)}
                      style={{
                        padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        background: config.categoriasPrincipal.includes(cat) ? 'var(--color-primary)' : '#e0e0e0',
                        color: config.categoriasPrincipal.includes(cat) ? '#fff' : '#444',
                        border: 'none',
                      }}
                    >
                      {cat} {config.categoriasPrincipal.includes(cat) && '✓'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Max Complemento */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--color-dark)' }}>
                ➕ Cantidad de Complementos (Paso 2)
              </label>
              <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', margin: '0 0 10px 0' }}>
                Cuántos complementos debe elegir el cliente en el segundo paso.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button type="button" onClick={() => updateNumber('maxComplemento', -1)} style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>-</button>
                <input
                  type="number"
                  min="1"
                  value={config.maxComplemento}
                  onChange={(e) => setConfig(c => ({ ...c, maxComplemento: Math.max(1, Number(e.target.value)) }))}
                  style={{ width: '80px', height: '40px', textAlign: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)', backgroundColor: '#fff9db', borderRadius: '8px', border: '2px solid var(--color-primary)' }}
                />
                <button type="button" onClick={() => updateNumber('maxComplemento', 1)} style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>+</button>
              </div>

              {/* Selector Categorias Paso 2 */}
              <div style={{ marginTop: '16px', background: '#fcfcfc', border: '1px solid #eee', padding: '12px', borderRadius: '8px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--color-dark)' }}>
                  🏷️ Límite de Categorías (Paso 2)
                </label>
                <p style={{ color: '#888', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '12px' }}>
                  Si no seleccionas ninguna categoría, se mostrarán todos los productos de la tienda.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categorias.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategoria('categoriasComplemento', cat)}
                      style={{
                        padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        background: config.categoriasComplemento.includes(cat) ? 'var(--color-primary)' : '#e0e0e0',
                        color: config.categoriasComplemento.includes(cat) ? '#fff' : '#444',
                        border: 'none',
                      }}
                    >
                      {cat} {config.categoriasComplemento.includes(cat) && '✓'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tipo de Descuento (Toggle) */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--color-dark)' }}>
                💱 Tipo de Descuento
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setConfig(c => ({ ...c, tipoDescuento: 'porcentaje' }))} style={{ flex: 1, padding: '10px', fontSize: '0.95rem', fontWeight: 'bold', borderRadius: '8px', border: config.tipoDescuento === 'porcentaje' ? '2px solid var(--color-primary)' : '1px solid #ddd', background: config.tipoDescuento === 'porcentaje' ? '#fff9db' : '#f9f9f9', color: config.tipoDescuento === 'porcentaje' ? 'var(--color-primary)' : '#666', cursor: 'pointer', transition: 'all 0.2s' }}>Porcentaje (%)</button>
                <button type="button" onClick={() => setConfig(c => ({ ...c, tipoDescuento: 'fijo' }))} style={{ flex: 1, padding: '10px', fontSize: '0.95rem', fontWeight: 'bold', borderRadius: '8px', border: config.tipoDescuento === 'fijo' ? '2px solid var(--color-primary)' : '1px solid #ddd', background: config.tipoDescuento === 'fijo' ? '#fff9db' : '#f9f9f9', color: config.tipoDescuento === 'fijo' ? 'var(--color-primary)' : '#666', cursor: 'pointer', transition: 'all 0.2s' }}>Monto Fijo ($)</button>
              </div>
            </div>

            {/* Descuento */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--color-dark)' }}>
                🏷️ Valor del Descuento al Armar el Combo
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button type="button" onClick={() => updateNumber('descuento', config.tipoDescuento === 'fijo' ? -1000 : -1)} style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>-</button>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  {config.tipoDescuento === 'fijo' && <span style={{ position: 'absolute', left: '12px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.2rem' }}>$</span>}
                  <input
                    type="number"
                    min="0"
                    value={config.descuento}
                    onChange={(e) => setConfig(c => ({ ...c, descuento: Math.max(0, Number(e.target.value)) }))}
                    style={{ width: config.tipoDescuento === 'fijo' ? '140px' : '100px', height: '40px', textAlign: 'center', paddingLeft: config.tipoDescuento === 'fijo' ? '24px' : '10px', paddingRight: config.tipoDescuento === 'porcentaje' ? '28px' : '10px', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)', backgroundColor: '#fff9db', borderRadius: '8px', border: '2px solid var(--color-primary)' }}
                  />
                  {config.tipoDescuento === 'porcentaje' && <span style={{ position: 'absolute', right: '12px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.2rem' }}>%</span>}
                </div>
                <button type="button" onClick={() => updateNumber('descuento', config.tipoDescuento === 'fijo' ? 1000 : 1)} style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '14px', backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)',
                border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(232,130,12,0.3)', transition: 'all 0.2s'
              }}
            >
              {saving ? '⏳ Guardando...' : '💾 Guardar Configuración'}
            </button>
          </form>
        </div>

        {/* Preview Card */}
        <div style={{ width: '280px', backgroundColor: 'var(--color-white)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--color-dark)' }}>📋 Vista Previa del Combo</h3>
          <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem' }}>
            Así verá el cliente el combo con esta configuración.
          </p>

          <div style={{ marginTop: '16px', backgroundColor: 'var(--color-gray-light)', borderRadius: '8px', padding: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ display: 'inline-block', backgroundColor: 'var(--color-primary)', color: '#000', borderRadius: '4px', padding: '2px 8px', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>
                Paso 1
              </span>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Elegí <strong>{config.maxPrincipal}</strong> producto{config.maxPrincipal > 1 ? 's' : ''} principal{config.maxPrincipal > 1 ? 'es' : ''}.</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ display: 'inline-block', backgroundColor: 'var(--color-primary)', color: '#000', borderRadius: '4px', padding: '2px 8px', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>
                Paso 2
              </span>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Elegí <strong>{config.maxComplemento}</strong> complemento{config.maxComplemento > 1 ? 's' : ''}.</p>
            </div>

            <div style={{ borderTop: '1px dashed #ccc', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span>Subtotal</span><span>${subtotalExample.toFixed(0)}</span>
              </div>
              
              {config.descuento > 0 ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#00a650', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Descuento {config.tipoDescuento === 'porcentaje' ? `(${config.descuento}%)` : `Fijo`}</span>
                  <span>- ${discountAmount.toFixed(0)}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#999', fontStyle: 'italic', marginBottom: '4px' }}>
                  <span>Sin descuento configurado</span>
                  <span>-$0</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px solid #ccc', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total Final</span><span style={{ color: 'var(--color-primary)' }}>${totalExample.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComboConfig;
