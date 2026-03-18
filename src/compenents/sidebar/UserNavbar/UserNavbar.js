import React, { useState, useEffect } from 'react';
import './user-navbar-sm.css';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/User-dashboard', icon: '⊞' },
  { label: 'Add Sample', href: '#', icon: '＋' },
  {
    label: 'Return Details',
    icon: '↩',
    children: [
      { label: 'Add Return', href: '/addreturn' },
      { label: 'All Return Details', href: '/getallreturn' },
    ],
  },
  {
    label: 'Inventory History',
    icon: '📦',
    children: [
      { label: 'Inventory History', href: '/stockSnap' },
    ],
  },
  {
    label: 'Customers',
    icon: '👤',
    children: [
      { label: 'Register Customer', href: '/customerReg' },
      { label: 'All Customers', href: '/getAllCustomer' },
    ],
  },
  {
    label: 'Orders',
    icon: '📦',
    children: [
      { label: 'Add Orders', href: '/Add-Order-user-role' },
      { label: 'All Orders', href: '/view-all-order' },
    ],
  },
  {
    label: 'Invoices',
    icon: '🧾',
    children: [
      { label: 'View All Invoices', href: '/all-invoices' },
      { label: 'Add Invoices', href: '/add-invoice' },
    ],
  },
  {
    label: 'Payments',
    icon: '💳',
    children: [
      { label: 'Outstanding', href: '/user-check-outstanding' },
      { label: 'Add Cheque Details', href: '/Add-Cheque' },
      { label: 'View Cheques', href: '/user-cheque' },
      { label: 'Area Wise Product Qty', href: '/product-quantity-by-code' },
    ],
  },
  {
    label: 'Inventory',
    icon: '🏭',
    children: [
      { label: 'Bulk Inventory', href: '/user-Bulk-product-ton' },
      { label: 'Packing Summary', href: '/user-finishedProduct' },
      { label: 'Import Product Details', href: '/user-Bulk-product' },
      { label: 'Executives Inventory', href: '/area-allinventories' },
      { label: 'Add Executives Inventory', href: '/add-area-inventory' },
    ],
  },
];

const NavItem = ({ item, collapsed }) => {
  const [open, setOpen] = useState(false);

  if (item.children) {
    return (
      <div className={`sb-group ${open ? 'sb-group--open' : ''}`}>
        <button
          className="sb-item sb-item--toggle"
          onClick={() => setOpen(!open)}
          title={collapsed ? item.label : undefined}
        >
          <span className="sb-item__icon">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="sb-item__label">{item.label}</span>
              <span className="sb-item__chevron">›</span>
            </>
          )}
        </button>

        {/* Always render submenu when open — collapsed or not */}
        {open && (
          <div className={`sb-submenu ${collapsed ? 'sb-submenu--floating' : ''}`}>
            {item.children.map((child) => (
              <a key={child.href} href={child.href} className="sb-subitem">
                <span className="sb-subitem__dot" />
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={item.href}
      className="sb-item"
      title={collapsed ? item.label : undefined}
    >
      <span className="sb-item__icon">{item.icon}</span>
      {!collapsed && <span className="sb-item__label">{item.label}</span>}
    </a>
  );
};

const UserNavbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Find the sidebar's next sibling and wrap all page content with offset
    // Instead, directly style the nearest page container
    applyOffset(false);
  }, []);

  const applyOffset = (isCollapsed) => {
    const width = isCollapsed ? '72px' : '260px';
    document.documentElement.style.setProperty('--sb-current-width', width);
    // Find and offset every direct child of body except the sidebar
    Array.from(document.body.children).forEach((el) => {
      if (!el.classList.contains('sb-sidebar')) {
        el.style.marginLeft = width;
        el.style.transition = '0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.boxSizing = 'border-box';
      }
    });
  };

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    applyOffset(next);
  };

  return (
    <aside className={`sb-sidebar ${collapsed ? 'sb-sidebar--collapsed' : ''}`}>
      {/* Header */}
      <div className="sb-header">
        <div className="sb-logo">
          <div className="sb-logo__mark">UD</div>
          {!collapsed && (
            <div className="sb-logo__text">
              <span className="sb-logo__title">User</span>
              <span className="sb-logo__sub">Dashboard</span>
            </div>
          )}
        </div>
        <button
          className="sb-collapse-btn"
          onClick={toggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Divider */}
      <div className="sb-divider" />

      {/* Navigation */}
      <nav className="sb-nav">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="sb-footer">
        <div className="sb-divider" />
        <a href="/" className="sb-item sb-item--logout" title={collapsed ? 'Logout' : undefined}>
          <span className="sb-item__icon">⏻</span>
          {!collapsed && <span className="sb-item__label">Logout</span>}
        </a>
      </div>
    </aside>
  );
};

export default UserNavbar;