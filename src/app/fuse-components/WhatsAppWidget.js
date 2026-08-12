import React, { useState } from 'react';

const WhatsAppWidget = () => {
    const [isHovered, setIsHovered] = useState(false);

    // Numéro de téléphone WhatsApp
    const phoneNumber = "212666612663";
    const message = encodeURIComponent("Bonjour Boopursal, j'ai une question.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'fixed',
                bottom: '100px', // Placé juste au-dessus du Chatbot (qui est à 24px)
                right: '24px',
                zIndex: 9998,
                background: '#25D366',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHovered 
                    ? '0 10px 25px rgba(37, 211, 102, 0.4)' 
                    : '0 6px 16px rgba(0,0,0,0.15)',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                cursor: 'pointer',
                textDecoration: 'none'
            }}
            title="Contactez-nous sur WhatsApp"
        >
            <svg 
                viewBox="0 0 32 32" 
                width="36" 
                height="36" 
                fill="currentColor"
            >
                <path d="M16 2a13.9 13.9 0 0 0-11.83 21.28L2 30l6.9-2.14A13.9 13.9 0 1 0 16 2zm0 25.43a11.51 11.51 0 0 1-5.88-1.6l-.42-.25-4.36 1.35 1.17-4.24-.28-.44A11.52 11.52 0 1 1 16 27.43zm6.34-8.6c-.35-.18-2.06-1-2.38-1.14s-.55-.18-.78.18-1 1.14-1.2 1.38-.43.25-.78.07a9.3 9.3 0 0 1-2.73-1.68 10.3 10.3 0 0 1-1.9-2.36c-.2-.35 0-.54.16-.71s.35-.41.52-.61.23-.35.35-.59A1.06 1.06 0 0 0 13.52 13c-.11-.27-.48-1.15-.65-1.57-.17-.41-.35-.36-.48-.36H11.8c-.23 0-.6.1-.9.41s-1.2 1.17-1.2 2.85 1.23 3.31 1.4 3.54 2.42 3.69 5.86 5.14a19.67 19.67 0 0 0 1.94.7c.81.25 1.54.22 2.12.13.65-.1 2.06-.84 2.35-1.65s.29-1.5.2-1.65-.33-.24-.68-.42z"/>
            </svg>
            
            {/* Tooltip au survol */}
            <div style={{
                position: 'absolute',
                right: '72px',
                background: 'white',
                color: '#1A1F2E',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
                pointerEvents: 'none',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                border: '1px solid #F0F0F0'
            }}>
                WhatsApp
            </div>
        </a>
    );
};

export default WhatsAppWidget;
