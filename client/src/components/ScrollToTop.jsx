import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, key } = useLocation();

  useEffect(() => {
    // Evitar que el navegador intente restaurar el scroll de la página anterior
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const scrollToTop = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    };

    // Ejecutar inmediatamente
    scrollToTop();

    // Re-ejecutar en distintas etapas del montaje por si 
    // la página tarda en obtener altura por la carga de productos u otros elementos
    const t1 = setTimeout(scrollToTop, 10);
    const t2 = setTimeout(scrollToTop, 100);
    const t3 = setTimeout(scrollToTop, 300);
    const t4 = setTimeout(scrollToTop, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname, key]);

  return null;
};

export default ScrollToTop;
