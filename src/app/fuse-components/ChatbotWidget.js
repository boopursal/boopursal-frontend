import React, { useState, useRef, useEffect } from 'react';
import { Icon, IconButton } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { URL_SITE } from '@fuse/Constants';

const ChatbotWidget = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    
    // Charger l'historique depuis le localStorage ou utiliser le message de bienvenue par défaut
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('boopursal_chat_history');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error(e); }
        }
        return [{
            id: 1,
            type: 'bot',
            text: t("chatbot.welcome", { defaultValue: "Bonjour 👋 Je suis votre assistant IA Boopursal. Je peux répondre à toutes vos questions sur les achats industriels, les fournisseurs, ou le fonctionnement de la plateforme. Comment puis-je vous aider ?" }),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
    });
    
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef(null);

    // Sauvegarder l'historique à chaque modification
    useEffect(() => {
        localStorage.setItem('boopursal_chat_history', JSON.stringify(messages));
    }, [messages]);

    const toggleChat = () => setIsOpen(prev => !prev);

    const SUGGESTIONS = [
        { icon: 'add_shopping_cart', label: t("chatbot.sugg1", { defaultValue: "Comment publier une demande d'achat ?" }) },
        { icon: 'search',            label: t("chatbot.sugg2", { defaultValue: "Comment trouver un fournisseur ?" }) },
        { icon: 'card_membership',   label: t("chatbot.sugg3", { defaultValue: "Quels sont les tarifs de l'abonnement ?" }) },
        { icon: 'help_outline',      label: t("chatbot.sugg4", { defaultValue: "C'est quoi Boopursal ?" }) },
    ];

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            setTimeout(scrollToBottom, 100);
        }
    }, [messages, isOpen, isTyping]);

    const handleSend = async (textToSend) => {
        const text = (typeof textToSend === 'string' ? textToSend : inputValue).trim();
        if (!text) return;

        const userMsg = { id: Date.now(), type: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        
        // Mettre à jour l'UI avec le message utilisateur
        const newHistory = [...messages, userMsg];
        setMessages(newHistory);
        setInputValue('');
        setIsTyping(true);

        try {
            // Appel à l'API NestJS / Gemini
            const apiUrl = URL_SITE.endsWith('/') ? URL_SITE.slice(0, -1) : URL_SITE;
            const response = await fetch(`${apiUrl}/api/chatbot/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    // On envoie les 10 derniers messages pour le contexte de la conversation
                    history: messages.slice(-10).map(m => ({ role: m.type, text: m.text }))
                })
            });

            if (!response.ok) throw new Error("Erreur réseau");
            
            const data = await response.json();
            
            const botMsg = { 
                id: Date.now() + 1, 
                type: 'bot', 
                text: data.reply, 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                feedback: null // Pour 👍 / 👎
            };
            
            setMessages(prev => [...prev, botMsg]);
            if (!isOpen) setHasUnread(true);

        } catch (error) {
            console.error("Erreur Chatbot API:", error);
            const errorMsg = { 
                id: Date.now() + 1, 
                type: 'bot', 
                text: t("chatbot.error", { defaultValue: "Désolé, je n'arrive pas à joindre mes serveurs pour le moment. Veuillez réessayer dans quelques instants." }), 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const handleFeedback = (msgId, isPositive) => {
        setMessages(prev => prev.map(msg => 
            msg.id === msgId ? { ...msg, feedback: isPositive } : msg
        ));
    };

    const clearHistory = () => {
        if (window.confirm(t("chatbot.confirm_clear", { defaultValue: "Voulez-vous vraiment effacer l'historique de cette conversation ?" }))) {
            setMessages([{
                id: Date.now(),
                type: 'bot',
                text: t("chatbot.history_cleared", { defaultValue: "Historique effacé. Comment puis-je vous aider ?" }),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    };

    const ORANGE = '#F48D35';
    const ORANGE_DARK = '#E07820';
    const TEXT_DARK = '#1A1F2E';
    const TEXT_LIGHT = '#9CA3AF';
    const SURFACE = '#F9FAFB';

    // Parseur Markdown : gras **texte**, listes, liens [texte](url)
    const renderMarkdown = (text) => {
        return text.split('\n').map((line, i) => {
            // Gestion des listes
            if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                line = '• ' + line.trim().substring(2);
            }

            // Découpe sur les liens [texte](url) ET le gras **texte**
            const tokenize = (str) => {
                const tokens = [];
                const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*(.*?)\*\*/g;
                let last = 0;
                let m;
                while ((m = regex.exec(str)) !== null) {
                    if (m.index > last) tokens.push({ type: 'text', value: str.slice(last, m.index) });
                    if (m[1] !== undefined) {
                        tokens.push({ type: 'link', label: m[1], href: m[2] });
                    } else {
                        tokens.push({ type: 'bold', value: m[3] });
                    }
                    last = m.index + m[0].length;
                }
                if (last < str.length) tokens.push({ type: 'text', value: str.slice(last) });
                return tokens;
            };

            const tokens = tokenize(line);
            return (
                <div key={i} style={{ minHeight: line.trim() ? 'auto' : '8px' }}>
                    {tokens.map((tok, j) => {
                        if (tok.type === 'bold') return <strong key={j}>{tok.value}</strong>;
                        if (tok.type === 'link') return <a key={j} href={tok.href} style={{ color: '#F48D35', textDecoration: 'underline', fontWeight: 600 }}>{tok.label}</a>;
                        return tok.value;
                    })}
                </div>
            );
        });
    };

    return (
        <>
            <style>{`
                @keyframes bpSlideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes bpFadeMsg {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bpDot {
                    0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
                    40% { transform: scale(1); opacity: 1; }
                }
                .bp-dot { width: 7px; height: 7px; border-radius: 50%; background: ${ORANGE}; display: inline-block; animation: bpDot 1.3s ease-in-out infinite both; }
                .bp-dot:nth-child(2) { animation-delay: 0.15s; }
                .bp-dot:nth-child(3) { animation-delay: 0.3s; }
                .bp-msg { animation: bpFadeMsg 0.3s ease-out both; }
                .bp-scroll::-webkit-scrollbar { width: 5px; }
                .bp-scroll::-webkit-scrollbar-track { background: transparent; }
                .bp-scroll::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
                .bp-btn-fab { transition: transform 0.25s, box-shadow 0.2s; }
                .bp-btn-fab:hover { transform: scale(1.1) !important; }
                .bp-sugg { transition: all 0.18s ease; }
                .bp-sugg:hover { background: ${ORANGE} !important; color: white !important; border-color: ${ORANGE} !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(244, 141, 53, 0.25); }
                .bp-sugg:hover .bp-sugg-icon { color: white !important; }
                .bp-feedback-btn { transition: all 0.2s; opacity: 0.5; cursor: pointer; padding: 2px; }
                .bp-feedback-btn:hover { opacity: 1; transform: scale(1.1); color: ${ORANGE}; }
                .bp-feedback-active { opacity: 1 !important; color: ${ORANGE} !important; }

                /* Chat Window Responsive Styles */
                .bp-chat-window {
                    position: fixed;
                    bottom: 28px;
                    right: 28px;
                    width: 380px;
                    height: 680px;
                    max-height: calc(100vh - 56px);
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
                    overflow: hidden;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
                    animation: bpSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                @media (max-width: 480px) {
                    .bp-chat-window {
                        bottom: 16px;
                        right: 16px;
                        width: calc(100vw - 32px);
                        height: calc(100vh - 100px);
                        max-height: 600px;
                        border-radius: 20px;
                    }
                }
            `}</style>

            {/* FAB Button */}
            {!isOpen && (
                <div
                    className="bp-btn-fab"
                    onClick={toggleChat}
                    style={{
                        position: 'fixed', bottom: '28px', right: '28px',
                        width: '58px', height: '58px', borderRadius: '18px',
                        background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)`,
                        boxShadow: '0 8px 24px rgba(244, 141, 53, 0.4), 0 2px 8px rgba(0,0,0,0.08)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999
                    }}
                >
                    <Icon style={{ color: 'white', fontSize: '28px' }}>chat</Icon>
                    {hasUnread && (
                        <div style={{
                            position: 'absolute', top: '-4px', right: '-4px',
                            width: '14px', height: '14px', borderRadius: '50%',
                            background: '#EF4444', border: '2px solid white'
                        }} />
                    )}
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bp-chat-window">
                    {/* Header */}
                    <div style={{ position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)` }} />
                        <svg viewBox="0 0 380 40" style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, width: '100%', display: 'block' }}>
                            <path d="M0 40 C100 0 280 40 380 10 L380 40 Z" fill="white" />
                        </svg>

                        <div style={{ position: 'relative', padding: '20px 20px 40px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Icon style={{ color: 'white', fontSize: '28px' }}>chat</Icon>
                                </div>
                                <div>
                                    <div style={{ color: 'white', fontWeight: 700, fontSize: '16px', lineHeight: 1.3 }}>Assistant Boopursal</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)' }} />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: 500 }}>{t("chatbot.online", { defaultValue: "En ligne" })}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <IconButton size="small" style={{ color: 'rgba(255,255,255,0.85)', padding: '6px' }} onClick={clearHistory} title={t("chatbot.clear_history", { defaultValue: "Effacer l'historique" })}>
                                    <Icon style={{ fontSize: '18px' }}>delete_outline</Icon>
                                </IconButton>
                                <IconButton size="small" style={{ color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.15)', padding: '6px' }} onClick={toggleChat}>
                                    <Icon style={{ fontSize: '20px' }}>close</Icon>
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="bp-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', background: SURFACE }}>
                        {messages.map((msg, idx) => (
                            <div key={msg.id} className="bp-msg" style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: '20px'
                            }}>
                                <div style={{
                                    maxWidth: '85%', padding: '12px 16px', fontSize: '14px', lineHeight: 1.5,
                                    background: msg.type === 'user' ? `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)` : 'white',
                                    color: msg.type === 'user' ? 'white' : TEXT_DARK,
                                    borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    boxShadow: msg.type === 'user' ? '0 4px 14px rgba(244, 141, 53, 0.25)' : '0 2px 8px rgba(0,0,0,0.06)',
                                    border: msg.type === 'bot' ? '1px solid #F0F0F0' : 'none'
                                }}>
                                    {renderMarkdown(msg.text)}
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                    <span style={{ fontSize: '11px', color: TEXT_LIGHT, marginLeft: msg.type === 'bot' ? '4px' : '0' }}>{msg.time}</span>
                                    
                                    {/* Feedback UX (only for AI replies) */}
                                    {msg.type === 'bot' && idx > 0 && (
                                        <div style={{ display: 'flex', gap: '4px', background: 'white', padding: '2px 6px', borderRadius: '12px', border: '1px solid #F0F0F0' }}>
                                            <Icon 
                                                className={`bp-feedback-btn ${msg.feedback === true ? 'bp-feedback-active' : ''}`}
                                                style={{ fontSize: '14px' }} 
                                                onClick={() => handleFeedback(msg.id, true)}
                                            >thumb_up</Icon>
                                            <Icon 
                                                className={`bp-feedback-btn ${msg.feedback === false ? 'bp-feedback-active' : ''}`}
                                                style={{ fontSize: '14px' }}
                                                onClick={() => handleFeedback(msg.id, false)}
                                            >thumb_down</Icon>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing */}
                        {isTyping && (
                            <div className="bp-msg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{
                                    padding: '14px 18px', background: 'white', borderRadius: '18px 18px 18px 4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0',
                                    display: 'flex', alignItems: 'center', gap: '5px'
                                }}>
                                    <span className="bp-dot" /><span className="bp-dot" /><span className="bp-dot" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions (always visible) */}
                    <div style={{ background: 'white', padding: '14px 18px 8px', borderTop: '1px solid #F0F0F0' }}>
                            <p style={{ margin: '0 0 10px 2px', fontSize: '11px', fontWeight: 700, color: TEXT_LIGHT, textTransform: 'uppercase' }}>{t("chatbot.faq_title", { defaultValue: "Questions fréquentes" })}</p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {SUGGESTIONS.map((s, i) => (
                                    <button key={i} className="bp-sugg" onClick={() => handleSend(s.label)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 13px',
                                            borderRadius: '20px', border: '1.5px solid #F0F0F0', background: 'white', color: TEXT_DARK,
                                            fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none'
                                        }}
                                    >
                                        <Icon className="bp-sugg-icon" style={{ fontSize: '14px', color: ORANGE }}>{s.icon}</Icon>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                    {/* Input Area */}
                    <div style={{ background: 'white', padding: '12px 16px 16px', borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={t("chatbot.placeholder", { defaultValue: "Posez votre question..." })}
                            style={{
                                flex: 1, padding: '11px 16px', borderRadius: '24px', border: '1.5px solid #E5E7EB',
                                fontSize: '14px', color: TEXT_DARK, outline: 'none', background: SURFACE,
                            }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim() || isTyping}
                            style={{
                                width: '42px', height: '42px', borderRadius: '13px',
                                background: inputValue.trim() && !isTyping ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})` : '#F3F4F6',
                                color: inputValue.trim() && !isTyping ? 'white' : '#D1D5DB',
                                border: 'none', outline: 'none', cursor: inputValue.trim() && !isTyping ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}
                        >
                            <Icon style={{ fontSize: '20px' }}>send</Icon>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;
