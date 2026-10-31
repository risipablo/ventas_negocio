import type { ReactNode } from 'react';
import logo from '../../assets/logoBambina-removebg-preview.png';
import '../../styles/auth.css';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}


export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <main className="auth-page">
    <div className="auth-card">
      <aside className="auth-brand">
        <span className="auth-brand__logo">
          <img src={logo} alt="" />
        </span>
        <div className="auth-brand__text">
          <h1>Bambina Petshop</h1>
          <p>Gestion de productos,ventas y gastos</p>
        </div>
      </aside>

      <section className="auth-panel">
        <header className="auth-panel__header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </header>
        {children}
      </section>
    </div>
  </main>
);