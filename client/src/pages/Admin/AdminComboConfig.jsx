import React, { useState, useEffect } from 'react';
import comboConfigService from '../../services/comboConfigService.js';

const AdminComboConfig = () => {
  const [config, setConfig] = useState({ maxPrincipal: 1, maxComplemento: 1, descuento: 10 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await comboConfigService.obtenerConfig();
        setConfig({ maxPrincipal: data.maxPrincipal, maxComplemento: data.maxComplemento, descuento: data.descuento });
      } catch {
        setError('No se pudo cargar la configuración.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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

  const subtotalExample = 100; // example price for preview
  const discountAmount = subtotalExample * (config.descuento / 100);
  const totalExample = subtotalExample - discountAmount;

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
                🛒 Máx. de Productos Principales (Paso 1)
              </label>
              <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', margin: '0 0 10px 0' }}>
                Cuántos productos puede elegir el cliente en el primer paso del combo.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input
                  type="range"
                  min="1" max="5"
                  value={config.maxPrincipal}
                  onChange={(e) => setConfig(c => ({ ...c, maxPrincipal: Number(e.target.value) }))}
                  style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                />
                <span style={{
                  minWidth: '48px', textAlign: 'center', fontWeight: 800, fontSize: '1.5rem',
                  color: 'var(--color-primary)', backgroundColor: '#fff9db', padding: '4px 12px',
                  borderRadius: '8px', border: '2px solid var(--color-primary)'
                }}>
                  {config.maxPrincipal}
                </span>
              </div>
            </div>

            {/* Max Complemento */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--color-dark)' }}>
                ➕ Máx. de Complementos (Paso 2)
              </label>
              <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', margin: '0 0 10px 0' }}>
                Cuántos complementos puede agregar el cliente en el segundo paso.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input
                  type="range"
                  min="1" max="5"
                  value={config.maxComplemento}
                  onChange={(e) => setConfig(c => ({ ...c, maxComplemento: Number(e.target.value) }))}
                  style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                />
                <span style={{
                  minWidth: '48px', textAlign: 'center', fontWeight: 800, fontSize: '1.5rem',
                  color: 'var(--color-primary)', backgroundColor: '#fff9db', padding: '4px 12px',
                  borderRadius: '8px', border: '2px solid var(--color-primary)'
                }}>
                  {config.maxComplemento}
                </span>
              </div>
            </div>

            {/* Descuento */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--color-dark)' }}>
                🏷️ Descuento al Armar el Combo (%)
              </label>
              <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', margin: '0 0 10px 0' }}>
                Porcentaje de descuento que se aplica cuando el cliente completa ambos pasos.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input
                  type="range"
                  min="0" max="50"
                  value={config.descuento}
                  onChange={(e) => setConfig(c => ({ ...c, descuento: Number(e.target.value) }))}
                  style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                />
                <span style={{
                  minWidth: '60px', textAlign: 'center', fontWeight: 800, fontSize: '1.5rem',
                  color: 'var(--color-primary)', backgroundColor: '#fff9db', padding: '4px 12px',
                  borderRadius: '8px', border: '2px solid var(--color-primary)'
                }}>
                  {config.descuento}%
                </span>
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
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Elegí hasta <strong>{config.maxPrincipal}</strong> producto{config.maxPrincipal > 1 ? 's' : ''} principal{config.maxPrincipal > 1 ? 'es' : ''}.</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ display: 'inline-block', backgroundColor: 'var(--color-primary)', color: '#000', borderRadius: '4px', padding: '2px 8px', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>
                Paso 2
              </span>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Elegí hasta <strong>{config.maxComplemento}</strong> complemento{config.maxComplemento > 1 ? 's' : ''}.</p>
            </div>

            <div style={{ borderTop: '1px dashed #ccc', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span>Subtotal</span><span>$100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'green', marginBottom: '4px' }}>
                <span>Descuento ({config.descuento}%)</span><span>- ${discountAmount.toFixed(0)}</span>
              </div>
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
