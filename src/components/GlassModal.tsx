import React from 'react';
import { GlassCard } from './GlassCard';

interface GlassModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const GlassModal: React.FC<GlassModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }} onClick={onClose} className="animate-fade-in">
            <div onClick={(e) => e.stopPropagation()} className="animate-slide-up">
                <GlassCard style={{ minWidth: '300px', padding: '2rem' }}>
                    {children}
                </GlassCard>
            </div>
        </div>
    );
};
