"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
// @ts-ignore
import SimplePeer from 'simple-peer';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { GlassInput } from '@/components/GlassInput';
import { VideoContainer } from '@/components/VideoContainer';
import { ThemeToggle } from '@/components/ThemeToggle';

import { useLanguage } from '@/hooks/useLanguage';

import { GlassModal } from '@/components/GlassModal';

export default function RoomPage() {
    const { id: roomId } = useParams();
    const { t } = useLanguage();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
    const [messages, setMessages] = useState<{ text: string, sender: string }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [timer, setTimer] = useState<number | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isCustomDurationOpen, setIsCustomDurationOpen] = useState(false);
    const [customDuration, setCustomDuration] = useState('');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<SimplePeer.Instance | null>(null);

    useEffect(() => {
        setConnectionStatus(t.connecting);
        const init = async () => {
            // Initialize Socket
            const s = io();
            setSocket(s);

            // Get User Media
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);

                // Auto-mute audio initially as per requirements (or maybe just when session starts? 
                // User asked "mute audio while eye gazing session started". 
                // For now, let's keep it unmuted until they start the "session" timer).

                s.emit('join-room', roomId, s.id);

                s.on('user-connected', (userId: string) => {
                    console.log('User connected:', userId);
                    setConnectionStatus(t.userConnected);
                    // Initiator
                    const peer = new SimplePeer({
                        initiator: true,
                        trickle: false,
                        stream: stream
                    });

                    peer.on('signal', (signal: any) => {
                        s.emit('signal', { target: userId, signal, caller: s.id });
                    });

                    peer.on('stream', (remoteStream: MediaStream) => {
                        setRemoteStream(remoteStream);
                        setConnectionStatus(t.connected);
                    });

                    peerRef.current = peer;
                });

                s.on('signal', (data: any) => {
                    if (data.caller === s.id) return; // Ignore own signals if any

                    // Receiver
                    if (!peerRef.current) {
                        setConnectionStatus(t.receivingCall);
                        const peer = new SimplePeer({
                            initiator: false,
                            trickle: false,
                            stream: stream
                        });

                        peer.on('signal', (signal: any) => {
                            s.emit('signal', { target: data.caller, signal, caller: s.id });
                        });

                        peer.on('stream', (remoteStream: MediaStream) => {
                            setRemoteStream(remoteStream);
                            setConnectionStatus(t.connected);
                        });

                        peer.signal(data.signal);
                        peerRef.current = peer;
                    } else {
                        peerRef.current.signal(data.signal);
                    }
                });

                s.on('receive-message', (msg: string) => {
                    setMessages(prev => [...prev, { text: msg, sender: t.partner }]);
                });

                s.on('timer-started', (duration: number) => {
                    startTimer(duration);
                    // Auto-mute when timer starts
                    if (stream) {
                        stream.getAudioTracks().forEach(track => track.enabled = false);
                        setIsAudioMuted(true);
                    }
                });

            } catch (err) {
                console.error('Error accessing media devices:', err);
                setConnectionStatus(t.errorMedia);
            }
        };

        init();

        return () => {
            if (socket) socket.disconnect();
            if (localStream) localStream.getTracks().forEach(track => track.stop());
            if (peerRef.current) peerRef.current.destroy();
        };
    }, [roomId, t]);

    const toggleMute = () => {
        if (localStream) {
            const enabled = !localStream.getAudioTracks()[0].enabled;
            localStream.getAudioTracks().forEach(track => track.enabled = enabled);
            setIsAudioMuted(!enabled);
        }
    };

    const sendMessage = () => {
        if (!socket || !newMessage.trim()) return;
        socket.emit('send-message', { roomId, message: newMessage });
        setMessages(prev => [...prev, { text: newMessage, sender: t.me }]);
        setNewMessage('');
    };

    const startSession = (minutes: number) => {
        if (!socket) return;
        socket.emit('start-timer', { roomId, duration: minutes * 60 });
        startTimer(minutes * 60);
        // Auto-mute locally too
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = false);
            setIsAudioMuted(true);
        }
        setIsCustomDurationOpen(false);
    };

    const stopSession = () => {
        if (!socket) return;
        // Ideally emit stop event, but for now just clear local timer
        setTimer(null);
        setIsTimerRunning(false);
        // Unmute
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = true);
            setIsAudioMuted(false);
        }
    };

    const startTimer = (duration: number) => {
        setTimer(duration);
        setIsTimerRunning(true);
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev === null || prev <= 0) {
                    clearInterval(interval);
                    setIsTimerRunning(false);
                    // Unmute maybe? Or let user unmute manually.
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <main style={{ height: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <ThemeToggle />

            {/* Header - Hide in Focus Mode */}
            {!isTimerRunning && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="text-gradient">{t.room}: {roomId}</h2>
                    <div style={{ padding: '8px 16px', background: 'var(--glass-bg)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                        {t.status}: {connectionStatus}
                    </div>
                </div>
            )}

            {/* Video Area */}
            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: isTimerRunning ? '1fr' : '1fr 1fr',
                gap: '20px',
                minHeight: 0,
                position: 'relative'
            }}>
                {/* Local Video - PIP in Focus Mode */}
                <div style={isTimerRunning ? {
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '150px',
                    height: '200px',
                    zIndex: 20,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    border: '2px solid rgba(255,255,255,0.2)'
                } : { width: '100%', height: '100%' }}>
                    <VideoContainer
                        stream={localStream}
                        isLocal={true}
                        onToggleMute={toggleMute}
                        isAudioMuted={isAudioMuted}
                    />
                </div>

                {/* Remote Video - Fullscreen in Focus Mode */}
                <div style={isTimerRunning ? {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 10
                } : { width: '100%', height: '100%' }}>
                    <VideoContainer
                        stream={remoteStream}
                    />
                </div>
            </div>

            {/* Controls & Chat - Hide Chat in Focus Mode */}
            {!isTimerRunning ? (
                <GlassCard style={{ height: '200px', display: 'flex', gap: '20px', padding: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3>{t.sessionControls}</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <GlassButton onClick={() => startSession(1)}>1 {t.min}</GlassButton>
                            <GlassButton onClick={() => startSession(5)}>5 {t.min}</GlassButton>
                            <GlassButton onClick={() => startSession(10)}>10 {t.min}</GlassButton>
                            <GlassButton onClick={() => setIsCustomDurationOpen(true)} variant="secondary">{t.custom}</GlassButton>
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3>{t.chat}</h3>
                        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '8px' }}>
                            {messages.map((m, i) => (
                                <div key={i} style={{ marginBottom: '4px' }}>
                                    <strong>{m.sender}: </strong>{m.text}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <GlassInput
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder={t.typeMessage}
                            />
                            <GlassButton onClick={sendMessage}>{t.send}</GlassButton>
                        </div>
                    </div>
                </GlassCard>
            ) : (
                // Focus Mode Controls
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 30,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        textShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}>
                        {timer !== null ? formatTime(timer) : '0:00'}
                    </div>
                    <GlassButton onClick={stopSession} style={{ background: 'rgba(255, 59, 48, 0.8)' }}>
                        {t.stopSession}
                    </GlassButton>
                </div>
            )}

            <GlassModal isOpen={isCustomDurationOpen} onClose={() => setIsCustomDurationOpen(false)}>
                <h3 style={{ marginBottom: '1rem' }}>{t.setDuration}</h3>
                <GlassInput
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="15"
                    style={{ marginBottom: '1rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <GlassButton variant="secondary" onClick={() => setIsCustomDurationOpen(false)}>Cancel</GlassButton>
                    <GlassButton onClick={() => startSession(Number(customDuration) || 1)}>{t.start}</GlassButton>
                </div>
            </GlassModal>
        </main>
    );
}
