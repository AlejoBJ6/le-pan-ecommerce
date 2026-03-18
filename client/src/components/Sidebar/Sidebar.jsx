import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Ordenar por</h3>
        <select className="sidebar-select">
          <option>Relevancia</option>
          <option>Menor precio</option>
          <option>Mayor precio</option>
          <option>Más vendidos</option>
        </select>
      </div>

      <div className="sidebar-section">
        <h3>Disponibilidad</h3>
        <label className="sidebar-label">
          <input type="checkbox" defaultChecked />
          <span className="custom-checkbox"></span>
          Con stock en local
        </label>
      </div>

      <div className="sidebar-section">
        <h3>Categoría</h3>
        <ul className="sidebar-list">
          <li>
            <label className="sidebar-label">
              <input type="checkbox" />
              <span className="custom-checkbox"></span>
              Amasadoras (12)
            </label>
          </li>
          <li>
            <label className="sidebar-label">
              <input type="checkbox" />
              <span className="custom-checkbox"></span>
              Hornos (8)
            </label>
          </li>
          <li>
            <label className="sidebar-label">
              <input type="checkbox" />
              <span className="custom-checkbox"></span>
              Sobadoras (4)
            </label>
          </li>
          <li>
            <label className="sidebar-label">
              <input type="checkbox" />
              <span className="custom-checkbox"></span>
              Batidoras (6)
            </label>
          </li>
          <li>
            <label className="sidebar-label">
              <input type="checkbox" />
              <span className="custom-checkbox"></span>
              Accesorios (24)
            </label>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
