import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Tooltip } from "@mui/material";
import {
  LayoutDashboard, CircleDollarSign, Users, SquareText, Store, Wallet,
  ChartNoAxesColumn, CurrencyIcon, StickyNote, ListChecks, FilePlusCorner,
  ShoppingCart, LogOut, type LucideIcon,
} from "lucide-react";
import type { AuthenticatedProps } from "../../features/auth/types/type.auth";

import "../../styles/navbar.css";
import { useCart } from "../../context/useCarrito";

interface NavbarProps {
  setIsAuthenticated: AuthenticatedProps["setIsAuthenticated"];
}

interface NavItemData {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;      
  badgeLabel?: string;  
}


const NavItem = ({ item, showTip }: { item: NavItemData; showTip: boolean }) => {
  const Icon = item.icon;
  const badge = item.badge ?? 0;

  return (
    <NavLink
      to={item.to}
      aria-label={badge > 0 ? `${item.label}, ${badge} ${item.badgeLabel ?? ''}` : item.label}
    >
      <Tooltip title={showTip ? item.label : ''} placement="right">
        <div className="icon">
          <Icon />
          {badge > 0 && (
            <span key={badge} className="nav-badge" aria-hidden="true">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
          <span className="text">{item.label}</span>
        </div>
      </Tooltip>
    </NavLink>
  );
};

const Navbar = ({ setIsAuthenticated }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();


  const [pendingNotes, setPendingNotes] = useState<number>(
    () => Number(localStorage.getItem('notasPendientes')) || 0
  );

  useEffect(() => {
    const onPending = (e: Event) => setPendingNotes((e as CustomEvent<number>).detail);
    window.addEventListener('notas:pendientes', onPending);
    return () => window.removeEventListener('notas:pendientes', onPending);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('open', isOpen);
    return () => document.body.classList.remove('open');
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {

    setIsAuthenticated(false);
  };


  const sections: { title: string; items: NavItemData[] }[] = [
    {
      title: 'General',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Negocio',
      items: [
        { to: '/sales', label: 'Ventas', icon: CircleDollarSign },
        { to: '/list', label: 'Lista de Productos', icon: SquareText },
        { to: '/proveedores', label: 'Proveedores', icon: Store },
        { to: '/clientes', label: 'Clientes', icon: Users },
      ],
    },
    {
      title: 'Finanzas',
      items: [
        { to: '/gastos', label: 'Gastos', icon: Wallet },
        { to: '/estadisticas', label: 'Estadísticas', icon: ChartNoAxesColumn },
        { to: '/convertidor', label: 'Convertidor', icon: CurrencyIcon },
      ],
    },
    {
      title: 'Organización',
      items: [
        { to: '/notas', label: 'Notas', icon: StickyNote, badge: pendingNotes, badgeLabel: 'pendientes' },
        { to: '/carritos-guardados', label: 'Listas', icon: ListChecks },
        { to: '/archivos', label: 'Archivos', icon: FilePlusCorner },
      ],
    },
  ];

  const showTip = !isOpen;

  return (
    <div className={`icon-container ${isOpen ? 'open' : ''}`}>
      <div
        onClick={toggleMenu}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMenu()}
        role="button"
        tabIndex={0}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isOpen}
        className={`menu-icon ${isOpen ? 'open' : ''}`}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`icons ${isOpen ? 'open' : ''}`} onClick={closeMenu}>
        <nav className={`menu ${isOpen ? 'open' : ''}`} aria-label="Principal">
          {sections.map((section) => (
            <div className="nav-section" key={section.title}>
              <p className="nav-section__title">{section.title}</p>
              {section.items.map((item) => (
                <NavItem key={item.to} item={item} showTip={showTip} />
              ))}
            </div>
          ))}
        </nav>
      </div>


      <div className="nav-footer" onClick={closeMenu}>
        <NavItem
          item={{
            to: '/carrito',
            label: 'Carrito',
            icon: ShoppingCart,
            badge: cartCount,
            badgeLabel: 'productos',
          }}
          showTip={showTip}
        />

        <Tooltip title={showTip ? 'Cerrar sesión' : ''} placement="right">
          <button type="button" className="icon nav-logout" onClick={handleLogout}>
            <LogOut />
            <span className="text">Cerrar sesión</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navbar;