import React, { useState, useEffect } from 'react';
import comboConfigService from '../../services/comboConfigService.js';
import categoriaService from '../../services/categoriaService.js';

/* ─── Inline styles as constants to keep JSX clean ─── */
const S = {
  page: {
    display: 'flex',
    gap: '28px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    minWidth: '340px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: 'var(--color-white)',
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    border: '1px solid #f0f0f0',
    overflow: 'hidden',
  },
  cardHeader: (accent) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    background: accent
      ? 'linear-gradient(135deg, #fff8ed 0%, #fff3d6 100%)'
      : 'linear-gradient(135deg, #f7f9ff 0%, #eef2ff 100%)',
    borderBottom: `1px solid ${accent ? '#ffe8b0' : '#e2e8ff'}`,
  }),
  stepBadge: (color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: color,
    color: '#fff',
    fontWeight: 800,
    fontSize: '0.95rem',
    flexShrink: 0,
    boxShadow: `0 3px 8px ${color}55`,
  }),
  cardBody: {
    padding: '20px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  sectionLabel: {
    display: 'block',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: 'var(--color-dark)',
    marginBottom: '4px',
  },
  helperText: {
    color: '#9a9a9a',
    fontSize: '0.82rem',
    margin: '0 0 10px 0',
    lineHeight: 1.4,
  },

  /* Stepper +/- */
  stepperWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  stepperBtn: {
    width: '38px',
    height: '38px',
    fontSize: '1.2rem',
    fontWeight: 800,
    background: '#f4f4f4',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.15s, transform 0.1s',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperInput: {
    width: '80px',
    height: '38px',
    textAlign: 'center',
    fontWeight: 800,
    fontSize: '1.2rem',
    color: 'var(--color-primary)',
    backgroundColor: '#fff9db',
    borderRadius: '10px',
    border: '2px solid var(--color-primary)',
    outline: 'none',
  },

  /* Category chips */
  chipsArea: {
    background: '#fafafa',
    border: '1px solid #ebebeb',
    padding: '16px',
    borderRadius: '10px',
    marginTop: '4px',
  },
  chip: (active) => ({
    padding: '7px 16px',
    borderRadius: '20px',
    fontSize: '0.84rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: active ? 'var(--color-primary)' : '#ececec',
    color: active ? '#fff' : '#888',
    border: active ? '2px solid var(--color-primary)' : '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    userSelect: 'none',
  }),

  /* Toggle buttons for discount type */
  toggleBtn: (active) => ({
    flex: 1,
    padding: '10px 16px',
    fontSize: '0.92rem',
    fontWeight: 700,
    borderRadius: '10px',
    border: active ? '2px solid var(--color-primary)' : '1px solid #ddd',
    background: active ? '#fff9db' : '#f9f9f9',
    color: active ? 'var(--color-primary)' : '#aaa',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),

  /* Save button */
  saveBtn: (saving) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 28px',
    backgroundColor: saving ? '#f0c060' : 'var(--color-primary)',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 800,
    fontSize: '1rem',
    cursor: saving ? 'not-allowed' : 'pointer',
    boxShadow: saving ? 'none' : '0 5px 18px rgba(232,130,12,0.35)',
    transition: 'all 0.2s',
    alignSelf: 'flex-end',
    minWidth: '220px',
  }),

  /* Preview sidebar */
  previewCol: {
    width: '290px',
    flexShrink: 0,
    position: 'sticky',
    top: '24px',
  },
  previewCard: {
    backgroundColor: 'var(--color-white)',
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.09)',
    border: '1px solid #f0f0f0',
    overflow: 'hidden',
  },
  previewHeader: {
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
    borderBottom: 'none',
  },
  previewBody: {
    padding: '20px',
  },
  previewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    marginBottom: '6px',
    alignItems: 'center',
  },
  previewStepBadge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color,
    color: '#fff',
    borderRadius: '6px',
    padding: '3px 10px',
    fontWeight: 700,
    fontSize: '0.78rem',
    marginBottom: '6px',
    letterSpacing: '0.03em',
  }),
};

/* ─── Save icon SVG ─── */
const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

/* ─── Warning icon SVG ─── */
const WarnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8820c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

/* ─── Reusable Stepper ─── */
const Stepper = ({ value, min = 1, max = Infinity, step = 1, onChange }) => {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  const handleChange = (e) => {
    // parseInt strips leading zeros; fallback to min if empty/NaN
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) return;
    onChange(Math.min(max, Math.max(min, parsed)));
  };

  return (
    <div style={S.stepperWrap}>
      <button type="button" onClick={dec} style={S.stepperBtn}
        onMouseOver={e => e.currentTarget.style.background = '#e8e8e8'}
        onMouseOut={e => e.currentTarget.style.background = '#f4f4f4'}>
        −
      </button>
      <input
        type="number" min={min} max={max} step={step} value={value}
        onChange={handleChange}
        style={S.stepperInput}
      />
      <button type="button" onClick={inc} style={S.stepperBtn}
        onMouseOver={e => e.currentTarget.style.background = '#e8e8e8'}
        onMouseOut={e => e.currentTarget.style.background = '#f4f4f4'}>
        +
      </button>
    </div>
  );
};

/* ─── Category chip selector ─── */
const CategoryChips = ({ categorias, selected, onToggle }) => (
  <div style={S.chipsArea}>
    <label style={{ ...S.sectionLabel, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '1rem' }}>🏷️</span> Límite de Categorías
    </label>
    <p style={S.helperText}>
      Sin selección → se muestran <em>todos</em> los productos.
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {categorias.map(cat => {
        const active = selected.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onToggle(cat)}
            style={S.chip(active)}
          >
            {active && <span style={{ fontSize: '0.75rem', marginRight: '2px' }}>✓</span>}
            {cat}
          </button>
        );
      })}
    </div>
  </div>
);

/* ─── Step Card wrapper ─── */
const StepCard = ({ number, color, emoji, title, subtitle, children }) => (
  <div style={S.card}>
    <div style={S.cardHeader(true)}>
      <div style={S.stepBadge(color)}>{number}</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{emoji}</span> {title}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#999', marginTop: '2px' }}>{subtitle}</div>
      </div>
    </div>
    <div style={S.cardBody}>{children}</div>
  </div>
);

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
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
    const load = async () => {
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
    load();
  }, []);

  const toggleCategoria = (field, cat) => {
    setConfig(c => {
      const arr = c[field] || [];
      const isAdding = !arr.includes(cat);
      const otherField = field === 'categoriasPrincipal' ? 'categoriasComplemento' : 'categoriasPrincipal';
      
      let newConfig = { ...c };
      
      if (isAdding) {
        // Añade al actual
        newConfig[field] = [...arr, cat];
        // Quita del otro
        newConfig[otherField] = (c[otherField] || []).filter(x => x !== cat);
      } else {
        newConfig[field] = arr.filter(x => x !== cat);
      }
      return newConfig;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setError('');
    try {
      await comboConfigService.actualizarConfig(config);
      setSuccessMsg('¡Configuración guardada! Los clientes ya verán los cambios.');
    } catch {
      setError('Error al guardar la configuración. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', color: 'var(--color-gray)' }}>Cargando configuración…</div>;

  /* Preview calculations */
  const subtotalExample = config.tipoDescuento === 'fijo'
    ? (config.descuento > 1000 ? config.descuento * 2 : 10000)
    : 100;
  const discountAmount = config.tipoDescuento === 'porcentaje'
    ? subtotalExample * (config.descuento / 100)
    : config.descuento;
  const totalExample = Math.max(0, subtotalExample - discountAmount);

  return (
    <div>
      {/* Page header */}
      <h2 style={{ marginTop: 0, color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.4rem' }}>⚙️</span> Configuración: Armá tu Combo
      </h2>
      <p style={{ color: 'var(--color-gray)', marginBottom: '28px', maxWidth: '560px', lineHeight: 1.6 }}>
        Controlá cuántos productos puede elegir el cliente en "Armá tu Combo" y qué descuento se aplica al finalizar.
      </p>

      {/* Alerts */}
      {error && (
        <div style={{ backgroundColor: '#fdf0f0', color: '#c0392b', padding: '13px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #f5c6c6', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚠️</span> {error}
        </div>
      )}
      {successMsg && (
        <div style={{ backgroundColor: '#edfdf4', color: '#1a7a45', padding: '13px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #b7e8cb', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✅</span> {successMsg}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={S.page}>

          {/* LEFT COLUMN — Steps */}
          <div style={S.column}>

            {/* ── PASO 1 ── */}
            <StepCard
              number="1"
              color="var(--color-primary)"
              emoji="🛒"
              title="Productos Principales"
              subtitle="Cuántos productos debe elegir el cliente en el primer paso"
            >
              <div>
                <label style={S.sectionLabel}>Cantidad de productos</label>
                <p style={S.helperText}>Mínimo 1. El cliente deberá elegir esta cantidad exactamente.</p>
                <Stepper
                  value={config.maxPrincipal}
                  min={1}
                  onChange={v => setConfig(c => ({ ...c, maxPrincipal: v }))}
                />
              </div>
              <CategoryChips
                categorias={categorias}
                selected={config.categoriasPrincipal}
                onToggle={cat => toggleCategoria('categoriasPrincipal', cat)}
              />
            </StepCard>

            {/* ── PASO 2 ── */}
            <StepCard
              number="2"
              color="#7c5cbf"
              emoji="➕"
              title="Complementos"
              subtitle="Cuántos complementos puede agregar el cliente en el segundo paso"
            >
              <div>
                <label style={S.sectionLabel}>Cantidad de complementos</label>
                <p style={S.helperText}>Mínimo 1. El cliente deberá elegir esta cantidad exactamente.</p>
                <Stepper
                  value={config.maxComplemento}
                  min={1}
                  onChange={v => setConfig(c => ({ ...c, maxComplemento: v }))}
                />
              </div>
              <CategoryChips
                categorias={categorias}
                selected={config.categoriasComplemento}
                onToggle={cat => toggleCategoria('categoriasComplemento', cat)}
              />
            </StepCard>

            {/* ── DESCUENTO ── */}
            <div style={S.card}>
              <div style={{ ...S.cardHeader(false), background: 'linear-gradient(135deg, #f5f7ff 0%, #eef0ff 100%)', borderBottom: '1px solid #dde3ff' }}>
                <div style={{ ...S.stepBadge('#3a56d4'), backgroundColor: '#3a56d4' }}>%</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>💱</span> Tipo y Valor del Descuento
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#999', marginTop: '2px' }}>
                    Se aplicará al total del combo al finalizar
                  </div>
                </div>
              </div>
              <div style={S.cardBody}>
                {/* Toggle */}
                <div>
                  <label style={S.sectionLabel}>Tipo de descuento</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button"
                      onClick={() => setConfig(c => c.tipoDescuento === 'porcentaje' ? c : { ...c, tipoDescuento: 'porcentaje', descuento: 10 })}
                      style={S.toggleBtn(config.tipoDescuento === 'porcentaje')}>
                      📉 Porcentaje (%)
                    </button>
                    <button type="button"
                      onClick={() => setConfig(c => c.tipoDescuento === 'fijo' ? c : { ...c, tipoDescuento: 'fijo', descuento: 0 })}
                      style={S.toggleBtn(config.tipoDescuento === 'fijo')}>
                      💵 Monto Fijo ($)
                    </button>
                  </div>
                </div>

                {/* Stepper */}
                <div>
                  <label style={S.sectionLabel}>Valor del descuento</label>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <Stepper
                      value={config.descuento}
                      min={0}
                      max={config.tipoDescuento === 'porcentaje' ? 100 : Infinity}
                      step={config.tipoDescuento === 'fijo' ? 500 : 1}
                      onChange={v => setConfig(c => ({ ...c, descuento: v }))}
                    />
                    <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.2rem', minWidth: '20px' }}>
                      {config.tipoDescuento === 'porcentaje' ? '%' : '$'}
                    </span>
                  </div>
                </div>

                {/* Save button — right-aligned, inside the card */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="submit" disabled={saving} style={S.saveBtn(saving)}>
                    <SaveIcon />
                    {saving ? 'Guardando…' : 'Guardar Configuración'}
                  </button>
                </div>
              </div>
            </div>

          </div>{/* end left column */}

          {/* RIGHT COLUMN — Sticky Preview */}
          <div style={S.previewCol}>
            <div style={S.previewCard}>
              <div style={S.previewHeader}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📋</span> Vista Previa del Combo
                </h3>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' }}>
                  Cómo lo verá el cliente
                </p>
              </div>

              <div style={S.previewBody}>
                {/* Steps */}
                <div style={{ backgroundColor: '#f8f9fc', borderRadius: '10px', padding: '14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={S.previewStepBadge('var(--color-primary)')}>Paso 1</div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-dark)' }}>
                      Elegí <strong>{config.maxPrincipal}</strong> producto{config.maxPrincipal > 1 ? 's' : ''} principal{config.maxPrincipal > 1 ? 'es' : ''}.
                    </p>
                    {config.categoriasPrincipal.length > 0 && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#aaa' }}>
                        Solo de: {config.categoriasPrincipal.join(', ')}
                      </p>
                    )}
                  </div>
                  <div style={{ borderTop: '1px dashed #dde', paddingTop: '14px' }}>
                    <div style={S.previewStepBadge('#7c5cbf')}>Paso 2</div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-dark)' }}>
                      Elegí <strong>{config.maxComplemento}</strong> complemento{config.maxComplemento > 1 ? 's' : ''}.
                    </p>
                    {config.categoriasComplemento.length > 0 && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#aaa' }}>
                        Solo de: {config.categoriasComplemento.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price breakdown */}
                <div style={{ borderTop: '1px solid #eee', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={S.previewRow}>
                    <span style={{ color: '#888' }}>Subtotal</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                      ${subtotalExample.toLocaleString()}
                    </span>
                  </div>

                  {config.descuento > 0 ? (
                    <div style={{ ...S.previewRow, color: '#1a9e54', fontWeight: 700 }}>
                      <span>
                        Descuento{' '}
                        {config.tipoDescuento === 'porcentaje' ? `(${config.descuento}%)` : 'Fijo'}
                      </span>
                      <span>− ${discountAmount.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div style={{ ...S.previewRow, color: '#e8820c', fontStyle: 'italic', fontSize: '0.83rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <WarnIcon /> Sin descuento
                      </span>
                      <span>− $0</span>
                    </div>
                  )}

                  <div style={{ ...S.previewRow, fontSize: '1.1rem', fontWeight: 800, borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '4px' }}>
                    <span>Total Final</span>
                    <span style={{ color: 'var(--color-primary)' }}>${totalExample.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>{/* end flex page */}
      </form>
    </div>
  );
};

export default AdminComboConfig;
