import { useState, type FormEvent } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import '../../styles/formlist.css'
import { useChangePassword } from '../../features/auth/hooks/useChangePassword';

export const ChangePasswordForm = () => {
  const { changePassword, loading } = useChangePassword();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return alert('Las contraseñas nuevas no coinciden');
    }

    if (newPassword.length < 8) {
      return alert('La nueva contraseña debe tener al menos 8 caracteres');
    }

    const success = await changePassword(currentPassword, newPassword);
    
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="sale-master" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <div className="sale-form__header" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={24} color="#1d5fc9" />
          Cambiar Contraseña
        </h2>
        <p style={{ color: '#5b6475', fontSize: '0.9rem', marginTop: '4px' }}>
          Por seguridad, necesitamos verificar tu contraseña actual.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="list-form" style={{ padding: 0 }}>
        <div className="list-form-row" style={{ flexDirection: 'column' }}>
          
          {/* Contraseña Actual */}
          <label className="field" style={{ width: '100%' }}>
            Contraseña Actual
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8c98a8' }} />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8c98a8' }}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {/* Nueva Contraseña */}
          <label className="field" style={{ width: '100%', marginTop: '1rem' }}>
            Nueva Contraseña
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8c98a8' }} />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8c98a8' }}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {/* Confirmar Nueva Contraseña */}
          <label className="field" style={{ width: '100%', marginTop: '1rem' }}>
            Confirmar Nueva Contraseña
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8c98a8' }} />
            </div>
          </label>

        </div>

        <div style={{ marginTop: '2rem' }}>
          <button 
            type="submit" 
            className="pf-btn-add" 
            disabled={loading} 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
};