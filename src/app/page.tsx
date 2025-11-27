"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/hooks/useLanguage';

export default function Home() {
    const router = useRouter();
    const { t } = useLanguage();

    const startSession = () => {
        const roomId = Math.random().toString(36).substring(7);
        router.push(`/room/${roomId}`);
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            gap: '2rem'
        }}>
            <ThemeToggle />

            <GlassCard className="hero-card" style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 800 }}>
                    {t.title}
                </h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {t.subtitle}
                </p>
                <GlassButton onClick={startSession} style={{ fontSize: '1.2rem', padding: '16px 32px' }}>
                    {t.startSession}
                </GlassButton>
            </GlassCard>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px' }}>
                <GlassCard>
                    <h2 style={{ marginBottom: '1rem' }}>{t.eyeGazingTitle}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t.eyeGazingDesc}
                    </p>
                </GlassCard>

                <GlassCard>
                    <h2 style={{ marginBottom: '1rem' }}>{t.howItWorksTitle}</h2>
                    <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                        {t.howItWorksDesc}
                    </p>
                </GlassCard>

                <GlassCard>
                    <h2 style={{ marginBottom: '1rem' }}>{t.privacyTitle}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t.privacyDesc}
                    </p>
                </GlassCard>
            </div>
        </main>
    );
}
