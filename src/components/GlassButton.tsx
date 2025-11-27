import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    ...props
}) => {
    const baseStyle = {
        padding: '12px 24px',
        borderRadius: '16px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 600,
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
    };

    const primaryStyle = {
        background: 'var(--accent-color)',
        color: '#fff',
        boxShadow: 'var(--accent-glow)',
    };

    const secondaryStyle = {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'var(--text-primary)',
        border: '1px solid var(--glass-border)',
    };

    const style = { ...baseStyle, ...(variant === 'primary' ? primaryStyle : secondaryStyle), ...props.style };

    return (
        <button
            className={className}
            style={style}
            {...props}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                if (variant === 'primary') e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 122, 255, 0.5)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                if (variant === 'primary') e.currentTarget.style.boxShadow = 'var(--accent-glow)';
            }}
        >
            {children}
        </button>
    );
};
