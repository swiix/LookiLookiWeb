import { useState, useEffect } from 'react';

type Language = 'en' | 'de';

const translations = {
    en: {
        title: 'Looki Looki',
        subtitle: 'Connect deeply through the power of eye gazing.',
        startSession: 'Start a Session',
        eyeGazingTitle: '👁️ Eye Gazing',
        eyeGazingDesc: 'Eye gazing is a powerful practice to build intimacy and connection. By looking into another\'s eyes, we can see beyond the surface and connect on a soul level.',
        howItWorksTitle: '✨ How it works',
        howItWorksDesc: '1. Create a room.\n2. Share the link with a friend.\n3. Connect via video.\n4. Agree on a duration and gaze.',
        privacyTitle: '🔒 Private & Secure',
        privacyDesc: 'Your connection is peer-to-peer. No video is stored on our servers. Enjoy a safe space for vulnerability.',
        room: 'Room',
        status: 'Status',
        connecting: 'Connecting...',
        connected: 'Connected',
        userConnected: 'User connected. Initiating peer connection...',
        receivingCall: 'Receiving call...',
        errorMedia: 'Error: Could not access camera/microphone',
        sessionControls: 'Session Controls',
        chat: 'Chat',
        typeMessage: 'Type a message...',
        send: 'Send',
        me: 'Me',
        partner: 'Partner',
        min: 'Min',
        custom: 'Custom',
        setDuration: 'Set Duration (min)',
        start: 'Start',
        stopSession: 'Stop Session',
    },
    de: {
        title: 'Looki Looki',
        subtitle: 'Verbinde dich tief durch die Kraft des Augenkontakts.',
        startSession: 'Sitzung starten',
        eyeGazingTitle: '👁️ Eye Gazing',
        eyeGazingDesc: 'Eye Gazing ist eine kraftvolle Praxis, um Intimität und Verbindung aufzubauen. Indem wir uns in die Augen schauen, sehen wir über die Oberfläche hinaus und verbinden uns auf Seelenebene.',
        howItWorksTitle: '✨ Wie es funktioniert',
        howItWorksDesc: '1. Erstelle einen Raum.\n2. Teile den Link mit einem Freund.\n3. Verbinde dich per Video.\n4. Einigt euch auf eine Dauer und schaut euch an.',
        privacyTitle: '🔒 Privat & Sicher',
        privacyDesc: 'Deine Verbindung ist Peer-to-Peer. Kein Video wird auf unseren Servern gespeichert. Genieße einen sicheren Raum für Verletzlichkeit.',
        room: 'Raum',
        status: 'Status',
        connecting: 'Verbinden...',
        connected: 'Verbunden',
        userConnected: 'Benutzer verbunden. Starte Peer-Verbindung...',
        receivingCall: 'Empfange Anruf...',
        errorMedia: 'Fehler: Kein Zugriff auf Kamera/Mikrofon',
        sessionControls: 'Sitzungssteuerung',
        chat: 'Chat',
        typeMessage: 'Nachricht eingeben...',
        send: 'Senden',
        me: 'Ich',
        partner: 'Partner',
        min: 'Min',
        custom: 'Benutzerdefiniert',
        setDuration: 'Dauer festlegen (Min)',
        start: 'Starten',
        stopSession: 'Sitzung beenden',
    }
};

export const useLanguage = () => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'de') {
            setLanguage('de');
        } else {
            setLanguage('en');
        }
    }, []);

    return {
        t: translations[language],
        language,
        setLanguage
    };
};
