import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiBarChart2, FiDroplet, FiPackage, FiFileText, FiLayers, FiClipboard, FiArchive, FiBriefcase, FiGrid, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./AdminnavBar.css";

const navSections = [
  {
    title: "Inventory",
    links: [
      { to: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
      { to: "/inventory/liquid-chemical", label: "Liquid Chemical", icon: <FiDroplet /> },
      { to: "/inventory/liquid", label: "Liquid", icon: <FiDroplet /> },
      { to: "/inventory/fertilizer", label: "Fertilizer", icon: <FiPackage /> },
    ],
  },
  {
    title: "Operations",
    links: [
      { to: "/Admin-invoice", label: "Invoice Details", icon: <FiFileText /> },
      { to: "/dateproductDetails", label: "Packing Summary", icon: <FiClipboard /> },
      { to: "/view-current-bulk", label: "Bulk Products", icon: <FiArchive /> },
      { to: "/Allexetable", label: "Executives Inventory", icon: <FiBriefcase /> },
      { to: "/view-all-bulk", label: "Imported Products", icon: <FiLayers /> },
    ],
  },
];

const AdminnavBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const width = collapsed ? 80 : 280;
    Array.from(document.body.children).forEach((el) => {
      if (!el.classList.contains("admin-sidebar")) {
        el.style.marginLeft = `${width}px`;
        el.style.transition = "margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.boxSizing = "border-box";
      }
    });

    return () => {
      // Best-effort cleanup (prevents stuck margin if sidebar unmounts)
      Array.from(document.body.children).forEach((el) => {
        if (!el.classList.contains("admin-sidebar")) el.style.marginLeft = "";
      });
    };
  }, [collapsed]);

  return (
    <aside className={`admin-sidebar ${collapsed ? "admin-sidebar--collapsed" : ""}`}>
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-mark" aria-hidden="true">
            {/* Simple inline SVG so no external logo file is required */}
            <svg viewBox="0 0 64 64" role="img" focusable="false">
              <path
                d="M14 30 L32 18 L50 30"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M20 28 V44 H44 V28"
                fill="none"
                stroke="rgba(0,188,212,0.95)"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M26 44 V36 H38 V44"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {!collapsed && (
            <div className="admin-sidebar__logo-text">
              Nihon ERP
              <span className="admin-sidebar__logo-sub">Admin</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="admin-sidebar__collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <ul className="admin-sidebar__links">
        <li>
          <NavLink to="/dashboard" className="admin-nav-link active">
            <span className="admin-nav-link__icon">I</span>
            {!collapsed && <span className="admin-nav-link__text">Inventory</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/inventory/liquid-chemical" className="admin-nav-link">
            <span className="admin-nav-link__icon">LC</span>
            {!collapsed && <span className="admin-nav-link__text">Liquid chemical</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/inventory/liquid" className="admin-nav-link">
            <span className="admin-nav-link__icon">L</span>
            {!collapsed && <span className="admin-nav-link__text">Liquid</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/inventory/fertilizer" className="admin-nav-link">
            <span className="admin-nav-link__icon">F</span>
            {!collapsed && <span className="admin-nav-link__text">Fertilizer</span>}
          </NavLink>
        </li>

        <li className="admin-sidebar__divider" />

        <li>
          <NavLink to="/Admin-invoice" className="admin-nav-link">
            <span className="admin-nav-link__icon">IN</span>
            {!collapsed && <span className="admin-nav-link__text">Invoice details</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/dateproductDetails" className="admin-nav-link">
            <span className="admin-nav-link__icon">PK</span>
            {!collapsed && <span className="admin-nav-link__text">Packing Summary</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/view-current-bulk" className="admin-nav-link">
            <span className="admin-nav-link__icon">BV</span>
            {!collapsed && <span className="admin-nav-link__text">View Bulk Product</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Allexetable" className="admin-nav-link">
            <span className="admin-nav-link__icon">EX</span>
            {!collapsed && <span className="admin-nav-link__text">Executives Inventory</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/view-all-bulk" className="admin-nav-link">
            <span className="admin-nav-link__icon">IM</span>
            {!collapsed && <span className="admin-nav-link__text">Imported Product details</span>}
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default AdminnavBar;