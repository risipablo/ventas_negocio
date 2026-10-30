import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useMediaQuery } from "@mui/material";

export const ScrollTop = () => {
    const [visible, setVisible] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const clickUp = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleVisibility = () => {
        if (window.pageYOffset > 400) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            onClick={clickUp}
            className={`btn-up ${visible ? 'visible' : 'hidden'}`}
            aria-label="Volver arriba"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: isMobile ? '1rem' : '7rem',
                zIndex: 1000,
                padding: '12px',
                borderRadius: '100%',
                backgroundColor: 'rgba(28, 42, 68)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'opacity 0.3s ease, left 0.3s ease',
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <ArrowUp size={24} />
        </button>
    );
};