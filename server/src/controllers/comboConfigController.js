import ComboConfig from '../models/ComboConfig.js';

// GET /api/combo-config - Public: returns current config (creates default if none exists)
export const obtenerConfig = async (req, res) => {
  try {
    let config = await ComboConfig.findOne();
    if (!config) {
      config = await ComboConfig.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la configuración del combo.' });
  }
};

// PUT /api/combo-config - Admin only: update the config
export const actualizarConfig = async (req, res) => {
  const { maxPrincipal, maxComplemento, descuento } = req.body;

  try {
    let config = await ComboConfig.findOne();
    if (!config) {
      config = new ComboConfig({});
    }

    if (maxPrincipal !== undefined) config.maxPrincipal = Number(maxPrincipal);
    if (maxComplemento !== undefined) config.maxComplemento = Number(maxComplemento);
    if (descuento !== undefined) config.descuento = Number(descuento);

    await config.save();
    res.json({ message: 'Configuración actualizada con éxito.', config });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la configuración.' });
  }
};
