import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', style, ...props }) => {
    return (
        <div className={`glass-panel animate-slide-up ${className}`} style={{ padding: '2rem', ...style }} {...props}>
            {children}
        </div>
    );
};
