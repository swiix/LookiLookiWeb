import React from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const GlassInput: React.FC<GlassInputProps> = ({ className = '', ...props }) => {
    return (
        <input
            className={className}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                width: '100%',
                backdropFilter: 'blur(10px)',
                transition: 'border-color 0.3s ease',
                ...props.style,
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            {...props}
        />
    );
};
