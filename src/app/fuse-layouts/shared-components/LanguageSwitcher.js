import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
    { id: 'fr', label: 'FR', name: 'Français' },
    { id: 'en', label: 'EN', name: 'English' },
    { id: 'ar', label: 'AR', name: 'العربية' },
    { id: 'es', label: 'ES', name: 'Español' }
];

function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const currentLang = languages.find(l => l.id === i18n.language) || languages[0];

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                userSelect: 'none',
                marginRight: 8,
            }}
        >
            {/* Trigger button */}
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: open ? 'rgba(15, 23, 42, 0.06)' : 'transparent',
                    border: '1.5px solid rgba(15, 23, 42, 0.12)',
                    cursor: 'pointer',
                    padding: '7px 14px',
                    borderRadius: 30,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.06em',
                    color: '#1e293b',
                    transition: 'all 0.2s ease',
                    height: 38,
                    whiteSpace: 'nowrap',
                    outline: 'none',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.2)';
                }}
                onMouseLeave={e => {
                    if (!open) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.12)';
                    }
                }}
            >
                {/* Globe icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>{currentLang.label}</span>
                <svg
                    width="11" height="11" viewBox="0 0 12 12" fill="none"
                    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                >
                    <path d="M2 4l4 4 4-4" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    background: '#ffffff',
                    borderRadius: 14,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    minWidth: 150,
                    zIndex: 9999,
                    overflow: 'hidden',
                    padding: '6px',
                }}>
                    {languages.map(lng => (
                        <button
                            key={lng.id}
                            onClick={() => { i18n.changeLanguage(lng.id); setOpen(false); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                width: '100%',
                                textAlign: 'left',
                                background: lng.id === currentLang.id ? '#eff6ff' : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '9px 12px',
                                borderRadius: 9,
                                fontWeight: lng.id === currentLang.id ? 800 : 500,
                                fontSize: '0.9rem',
                                color: lng.id === currentLang.id ? '#2563eb' : '#334155',
                                transition: 'all 0.15s ease',
                                outline: 'none',
                            }}
                            onMouseEnter={e => {
                                if (lng.id !== currentLang.id) {
                                    e.currentTarget.style.background = '#f8fafc';
                                    e.currentTarget.style.color = '#0f172a';
                                }
                            }}
                            onMouseLeave={e => {
                                if (lng.id !== currentLang.id) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#334155';
                                }
                            }}
                        >
                            {/* Label badge */}
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,
                                height: 20,
                                borderRadius: 5,
                                background: lng.id === currentLang.id ? '#dbeafe' : '#f1f5f9',
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                letterSpacing: '0.05em',
                                color: lng.id === currentLang.id ? '#1d4ed8' : '#64748b',
                                flexShrink: 0,
                            }}>
                                {lng.label}
                            </span>
                            <span style={{ flex: 1 }}>{lng.name}</span>
                            {/* Checkmark for active */}
                            {lng.id === currentLang.id && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LanguageSwitcher;
