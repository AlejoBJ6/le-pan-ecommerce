import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productoService from '../../services/productoService';
import pedidoService from '../../services/pedidoService';
import categoriaService from '../../services/categoriaService';
import comboService from '../../services/comboService';
import contactoService from '../../services/contactoService';

// ── SVG Icons ─────────────────────────────────────────────────
const IconBox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Cuerpo del horno */}
    <rect x="3" y="4" width="18" height="16" rx="2" />
    {/* Puerta de vidrio */}
    <rect x="5" y="6" width="14" height="8" rx="1" />
    {/* Manija de la puerta */}
    <line x1="7" y1="10" x2="17" y2="10" />
    {/* Perillas de control inferiores */}
    <circle cx="6" y="17" r="1" fill="currentColor" />
    <circle cx="9" y="17" r="1" fill="currentColor" />
    {/* Respiradero lateral */}
    <line x1="18" y1="16" x2="18" y2="18" />
    <line x1="20" y1="16" x2="20" y2="18" />
  </svg>
);
const IconPackage = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconTag = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const IconLayers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);
const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconTrendingUp = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

// ── Sparkline Component ────────────────────────────────────────
const Sparkline = ({ data, color = '#e25822', height = 48, width = 110, dark = false }) => {
  const [tooltip, setTooltip] = React.useState(null);
  if (!data || data.length < 2) return null;

  const padX = 6, padY = 8;
  const w = width - padX * 2;
  const h = height - padY * 2;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * w,
    y: padY + h - ((v - min) / range) * h,
    value: v,
  }));

  // Smooth cubic Bézier path – control points at midX
  const linePath = pts.reduce((d, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = pts[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${d} C ${cpX},${prev.y} ${cpX},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  // Closed area below the line
  const areaPath = `${linePath} L ${pts[pts.length - 1].x},${padY + h} L ${pts[0].x},${padY + h} Z`;

  const gradId = `sg${Math.abs(color.split('').reduce((a, c) => a + c.charCodeAt(0), 0))}${width}`;
  const baselineColor = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)';
  const lineColor = color;
  const fillOpacity = dark ? '0.18' : '0.25';

  return (
    <svg
      width={width} height={height}
      style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}
      onMouseLeave={() => setTooltip(null)}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
        {dark && (
          <filter id={`glow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        )}
      </defs>

      {/* Baseline */}
      <line x1={padX} y1={padY + h} x2={padX + w} y2={padY + h} stroke={baselineColor} strokeWidth="1" />

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />

      {/* Smooth line */}
      <path
        d={linePath}
        fill="none"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={dark ? `url(#glow-${gradId})` : undefined}
      />

      {/* Hover hit areas + tooltip */}
      {pts.map((pt, i) => (
        <g key={i} style={{ cursor: 'crosshair' }} onMouseEnter={() => setTooltip(i)}>
          <circle cx={pt.x} cy={pt.y} r={10} fill="transparent" />
          {tooltip === i && (
            <>
              <circle cx={pt.x} cy={pt.y} r={4} fill={lineColor} stroke={dark ? 'rgba(255,255,255,0.8)' : 'white'} strokeWidth="1.5" />
              <rect
                x={Math.min(pt.x - 15, width - 36)} y={pt.y - 28}
                width={30} height={18} rx={4}
                fill={dark ? 'rgba(255,255,255,0.25)' : 'rgba(30,30,30,0.82)'}
              />
              <text
                x={Math.min(pt.x, width - 21)} y={pt.y - 15}
                textAnchor="middle" fill="white" fontSize="10" fontWeight="700"
              >
                {pt.value}
              </text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
};

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ title, value, subtitle, icon, iconColor, iconBg, badge, sparkData, sparkColor, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
      padding: '22px 24px 18px',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.05)',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)';
    }}
  >
    {/* Top row: icon + badge */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
      <div style={{ padding: '10px', backgroundColor: iconBg, borderRadius: '12px', color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      {badge && (
        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', backgroundColor: badge.bg, color: badge.color, whiteSpace: 'nowrap' }}>
          {badge.text}
        </span>
      )}
    </div>

    {/* Value */}
    <p style={{ margin: '0 0 4px 0', fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, letterSpacing: '-1px' }}>
      {value}
    </p>

    {/* Title */}
    <h3 style={{ margin: '0 0 12px 0', color: '#888', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
      {title}
    </h3>

    {/* Bottom: sparkline + subtitle */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
      <div style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 500 }}>
        {subtitle} →
      </div>
      {sparkData && <Sparkline data={sparkData} color={sparkColor || iconColor} height={36} width={90} />}
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────
const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [combos, setCombos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, pedData, catData, comboData, mensajeData] = await Promise.all([
          productoService.obtenerProductos({ admin: true }),
          pedidoService.getAllPedidos(),
          categoriaService.obtenerCategorias(),
          comboService.obtenerCombos(true),
          contactoService.obtenerMensajes().catch(() => []),
        ]);
        setProductos(prodData.filter(p => p.categoria !== 'Combos'));
        setPedidos(pedData);
        setCategorias(catData);
        setCombos(comboData);
        setMensajes(mensajeData);
      } catch (error) {
        console.error('Error cargando dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#aaa' }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
      Cargando resumen...
    </div>
  );

  // ── Derived data ───────────────────────────────────────────
  const bajoStock = productos.filter(p => p.stock > 0 && p.stock <= 5);
  const agotados = productos.filter(p => p.stock === 0);
  const pedidosPendientes = pedidos.filter(p => p.estadoEntrega === 'Pendiente' || p.estadoEntrega === 'En preparación');
  const mensajesNoLeidos = mensajes.filter(m => !m.leido);
  const gananciasTotal = pedidos
    .filter(p => p.estadoPago === 'Aprobado')
    .reduce((acc, p) => acc + (p.totales?.total || 0), 0);

  const formatPrice = (val) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);



  // ── Stock badge for products card ──────────────────────────
  const productoBadge = agotados.length > 0
    ? { text: `${agotados.length} agotado${agotados.length > 1 ? 's' : ''}`, bg: '#fde8e8', color: '#c0392b' }
    : bajoStock.length > 0
    ? { text: `${bajoStock.length} bajo stock`, bg: '#fff3cd', color: '#856404' }
    : null;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '1.6rem', fontWeight: 800, color: '#1a1a2e' }}>Resumen del Negocio</h2>
          <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>Datos actualizados en tiempo real</p>
        </div>
      </div>

      {/* ── Tarjetas principales (grid 3 cols) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <StatCard
          title="Productos en Catálogo"
          value={productos.length}
          subtitle="Ver catálogo"
          icon={<IconBox />}
          iconColor="var(--color-primary)"
          iconBg="#fff0eb"
          badge={productoBadge}
          onClick={() => navigate('/admin/productos')}
        />
        <StatCard
          title="Órdenes Pendientes"
          value={pedidosPendientes.length}
          subtitle="Ver pedidos"
          icon={<IconPackage />}
          iconColor={pedidosPendientes.length > 0 ? 'var(--color-primary)' : '#999'}
          iconBg={pedidosPendientes.length > 0 ? '#fff0eb' : '#f5f5f5'}
          badge={pedidosPendientes.length > 0 ? { text: 'Requiere atención', bg: '#fff0eb', color: 'var(--color-primary)' } : null}
          onClick={() => navigate('/admin/pedidos')}
        />
        <StatCard
          title="Categorías"
          value={categorias.length}
          subtitle="Gestionar"
          icon={<IconTag />}
          iconColor="var(--color-primary)"
          iconBg="#fff0eb"
          onClick={() => navigate('/admin/categorias')}
        />
        <StatCard
          title="Combos Activos"
          value={combos.filter(c => c.disponible !== false).length}
          subtitle="Ver combos"
          icon={<IconLayers />}
          iconColor="var(--color-primary)"
          iconBg="#fff0eb"
          onClick={() => navigate('/admin/combos')}
        />
        <StatCard
          title="Mensajes Sin Leer"
          value={mensajesNoLeidos.length}
          subtitle="Ver mensajes"
          icon={<IconMail />}
          iconColor={mensajesNoLeidos.length > 0 ? 'var(--color-primary)' : '#999'}
          iconBg={mensajesNoLeidos.length > 0 ? '#fff0eb' : '#f5f5f5'}
          badge={mensajesNoLeidos.length > 0 ? { text: `${mensajesNoLeidos.length} sin leer`, bg: '#fff0eb', color: 'var(--color-primary)' } : null}
          onClick={() => navigate('/admin/mensajes')}
        />
      </div>

      {/* ── Tarjeta de Ganancias (ancho completo) ── */}
      <div
        onClick={() => navigate('/admin/ganancias')}
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #c94b1a 60%, #a33c12 100%)',
          padding: '28px 32px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(226,88,34,0.25)',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(226,88,34,0.35)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(226,88,34,0.25)';
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', display: 'flex' }}>
              <IconTrendingUp />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Ganancias Totales (pagos aprobados)
            </span>
          </div>
          <p style={{ margin: '0 0 6px 0', fontSize: '2.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
            {formatPrice(gananciasTotal)}
          </p>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>Ver detalle completo →</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
