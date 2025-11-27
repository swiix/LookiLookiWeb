import React, { useEffect, useRef } from 'react';
import { GlassButton } from './GlassButton';

interface VideoContainerProps {
    stream: MediaStream | null;
    isLocal?: boolean;
    muted?: boolean;
    onToggleMute?: () => void;
    isAudioMuted?: boolean;
}

export const VideoContainer: React.FC<VideoContainerProps> = ({
    stream,
    isLocal = false,
    muted = false,
    onToggleMute,
    isAudioMuted = false
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="glass-panel" style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '24px',
            background: '#000'
        }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal || muted} // Always mute local video to prevent feedback
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: isLocal ? 'scaleX(-1)' : 'none' // Mirror local video
                }}
            />

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                gap: '10px'
            }}>
                {onToggleMute && (
                    <GlassButton
                        variant="secondary"
                        onClick={onToggleMute}
                        style={{
                            padding: '10px',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isAudioMuted ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {isAudioMuted ? '🔇' : '🎙️'}
                    </GlassButton>
                )}
            </div>
        </div>
    );
};
