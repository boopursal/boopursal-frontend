import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Icon, CircularProgress } from '@material-ui/core';
import ReCAPTCHA from "react-google-recaptcha";
import axios from '../../../../agent';

const ORANGE = '#F48D35';
const ORANGE_DARK = '#E07820';

function ContactApp() {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const recaptchaRef = useRef(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        const recaptchaToken = recaptchaRef.current ? recaptchaRef.current.getValue() : null;
        if (!recaptchaToken) {
            setErrorMsg(t('contact.recaptcha_required', 'Veuillez valider le reCAPTCHA.'));
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/contact', { ...form, recaptchaToken });
            setSubmitted(true);
            if (recaptchaRef.current) recaptchaRef.current.reset();
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            setErrorMsg(t('contact.error_send', 'Une erreur est survenue lors de l\'envoi du message.'));
        } finally {
            setLoading(false);
        }
    };

    const contactItems = [
        {
            icon: 'location_on',
            title: t('contact.address_title', 'Adresse'),
            lines: ['36, rue Imam El Boukhari', 'Maârif 20370 Casablanca', 'Maroc']
        },
        {
            icon: 'phone',
            title: t('contact.phone_title', 'Téléphone'),
            lines: ['+212-522365797'],
            href: 'tel:+212522365797'
        },
        {
            icon: 'email',
            title: t('contact.email_title', 'Email'),
            lines: ['contact@boopursal.com', 'support@boopursal.com'],
            hrefs: ['mailto:contact@boopursal.com', 'mailto:support@boopursal.com']
        }
    ];

    return (
        <>
            <Helmet>
                <title>{t('contact.page_title', 'Contactez-nous')} | Boopursal</title>
                <meta name="description" content="Contactez l'équipe Boopursal — marketplace B2B. Adresse : 36, rue Imam El Boukhari, Casablanca, Maroc." />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </Helmet>

            <style>{`
                * { box-sizing: border-box; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes wave { 0%,100% { d: path("M0 40 C100 10 280 50 480 20 S700 10 960 30 L960 60 L0 60 Z"); } 50% { d: path("M0 30 C120 50 260 10 480 35 S720 15 960 25 L960 60 L0 60 Z"); } }
                .bp-contact-anim { animation: fadeUp 0.6s ease-out both; }
                .bp-contact-card { transition: all 0.25s ease; }
                .bp-contact-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(244,141,53,0.12) !important; }
                .bp-contact-input { transition: border-color 0.2s, box-shadow 0.2s; }
                .bp-contact-input:focus { border-color: ${ORANGE} !important; box-shadow: 0 0 0 3px rgba(244,141,53,0.12) !important; outline: none; }
                .bp-contact-btn { transition: all 0.2s ease; }
                .bp-contact-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(244,141,53,0.35) !important; }
                .bp-back-btn { transition: all 0.18s; }
                .bp-back-btn:hover { color: ${ORANGE} !important; transform: translateX(-3px); }
            `}</style>

            <div style={{ fontFamily: '"Inter", -apple-system, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>

                {/* ─── Hero Header ─── */}
                <div style={{ position: 'relative', background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)`, overflow: 'hidden', paddingBottom: '60px' }}>
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                    <div style={{ position: 'absolute', bottom: '0', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                    {/* Back button */}
                    <div style={{ position: 'absolute', top: '20px', left: '28px', zIndex: 10 }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }} className="bp-back-btn">
                            <Icon style={{ fontSize: '18px' }}>arrow_back</Icon>
                            {t('common.back_home', 'Accueil')}
                        </Link>
                    </div>

                    <div style={{ position: 'relative', textAlign: 'center', padding: '80px 24px 20px', maxWidth: '720px', margin: '0 auto' }}>
                        <div className="bp-contact-anim" style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '64px', height: '64px', borderRadius: '18px',
                            background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)',
                            marginBottom: '20px'
                        }}>
                            <Icon style={{ color: 'white', fontSize: '32px' }}>chat_bubble_outline</Icon>
                        </div>
                        <h1 className="bp-contact-anim" style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, margin: '0 0 16px', animationDelay: '0.1s' }}>
                            {t('contact.hero_title', 'Contactez-nous')}
                        </h1>
                        <p className="bp-contact-anim" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '17px', lineHeight: 1.7, margin: 0, animationDelay: '0.2s' }}>
                            {t('contact.hero_subtitle', "Nous sommes à votre écoute pour toute question liée à Boopursal.")}
                        </p>
                    </div>

                    {/* Wave */}
                    <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, width: '100%', display: 'block' }} preserveAspectRatio="none">
                        <path d="M0 40 C360 10 720 55 1080 20 S1320 10 1440 30 L1440 60 L0 60 Z" fill="#F9FAFB" />
                    </svg>
                </div>

                {/* ─── Main Content ─── */}
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 80px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

                        {/* ── Left : Contact Info Cards ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1F2E', margin: '0 0 8px' }}>
                                {t('contact.info_title', 'Nos coordonnées')}
                            </h2>
                            <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.6, margin: '0 0 12px' }}>
                                {t('contact.info_subtitle', "Vous pouvez nous joindre par email, téléphone, ou passer directement à nos bureaux à Casablanca.")}
                            </p>

                            {contactItems.map((item, idx) => (
                                <div key={idx} className="bp-contact-card" style={{
                                    background: 'white', borderRadius: '16px', padding: '24px',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0',
                                    display: 'flex', gap: '18px', alignItems: 'flex-start',
                                    animationDelay: `${idx * 0.1 + 0.2}s`
                                }}>
                                    <div style={{
                                        flexShrink: 0, width: '46px', height: '46px', borderRadius: '13px',
                                        background: `linear-gradient(135deg, ${ORANGE}22 0%, ${ORANGE}11 100%)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: `1.5px solid ${ORANGE}33`
                                    }}>
                                        <Icon style={{ color: ORANGE, fontSize: '22px' }}>{item.icon}</Icon>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                            {item.title}
                                        </div>
                                        {item.lines.map((line, i) => (
                                            item.hrefs ? (
                                                <a key={i} href={item.hrefs[i]} style={{ display: 'block', color: ORANGE, fontWeight: 600, fontSize: '15px', textDecoration: 'none', lineHeight: 1.8 }}>
                                                    {line}
                                                </a>
                                            ) : item.href ? (
                                                <a key={i} href={item.href} style={{ display: 'block', color: ORANGE, fontWeight: 600, fontSize: '15px', textDecoration: 'none', lineHeight: 1.8 }}>
                                                    {line}
                                                </a>
                                            ) : (
                                                <p key={i} style={{ margin: 0, color: '#374151', fontSize: '15px', fontWeight: 500, lineHeight: 1.8 }}>{line}</p>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Google Map embed */}
                            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0', marginTop: '4px' }}>
                                <iframe
                                    title="Boopursal Casablanca"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8!2d-7.633!3d33.575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzMwLjAiTiA3wrAzNycxOS4wIlc!5e0!3m2!1sfr!2sma!4v1691600000000!5m2!1sfr!2sma"
                                    width="100%" height="220" style={{ border: 0, display: 'block' }}
                                    allowFullScreen="" loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                        {/* ── Right : Contact Form ── */}
                        <div style={{
                            background: 'white', borderRadius: '20px', padding: '36px',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0'
                        }}>
                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                    <div style={{
                                        width: '72px', height: '72px', borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
                                    }}>
                                        <Icon style={{ color: 'white', fontSize: '36px' }}>check</Icon>
                                    </div>
                                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1F2E', margin: '0 0 12px' }}>
                                        {t('contact.success_title', 'Message envoyé !')}
                                    </h3>
                                    <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.6, margin: '0 0 28px' }}>
                                        {t('contact.success_msg', "Merci pour votre message. Notre équipe vous répondra dans les meilleurs délais.")}
                                    </p>
                                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                        style={{
                                            padding: '12px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                            background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                                            color: 'white', fontSize: '15px', fontWeight: 600
                                        }}>
                                        {t('contact.new_message', 'Nouveau message')}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1F2E', margin: '0 0 6px' }}>
                                            {t('contact.form_title', 'Envoyez-nous un message')}
                                        </h2>
                                        <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>
                                            {t('contact.form_subtitle', 'Nous vous répondrons sous 24h.')}
                                        </p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>
                                                {t('contact.name', 'Nom complet')} *
                                            </label>
                                            <input
                                                className="bp-contact-input"
                                                type="text" name="name" value={form.name}
                                                onChange={handleChange} required
                                                placeholder={t('contact.name_ph', 'Jean Dupont')}
                                                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '14px', background: '#F9FAFB' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>
                                                {t('contact.email', 'Email')} *
                                            </label>
                                            <input
                                                className="bp-contact-input"
                                                type="email" name="email" value={form.email}
                                                onChange={handleChange} required
                                                placeholder="jean@entreprise.com"
                                                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '14px', background: '#F9FAFB' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>
                                            {t('contact.subject', 'Sujet')} *
                                        </label>
                                        <select
                                            className="bp-contact-input"
                                            name="subject" value={form.subject}
                                            onChange={handleChange} required
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '14px', background: '#F9FAFB', cursor: 'pointer' }}
                                        >
                                            <option value="">{t('contact.subject_ph', 'Sélectionnez un sujet...')}</option>
                                            <option value="info">{t('contact.sub_info', 'Demande d\'information')}</option>
                                            <option value="support">{t('contact.sub_support', 'Support technique')}</option>
                                            <option value="commercial">{t('contact.sub_commercial', 'Question commerciale / Abonnement')}</option>
                                            <option value="partenariat">{t('contact.sub_partner', 'Partenariat')}</option>
                                            <option value="autre">{t('contact.sub_other', 'Autre')}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>
                                            {t('contact.message', 'Message')} *
                                        </label>
                                        <textarea
                                            className="bp-contact-input"
                                            name="message" value={form.message}
                                            onChange={handleChange} required rows={5}
                                            placeholder={t('contact.message_ph', 'Décrivez votre besoin ou votre question...')}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '14px', background: '#F9FAFB', resize: 'vertical', fontFamily: 'inherit' }}
                                        />
                                    </div>

                                        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
                                            <ReCAPTCHA
                                                ref={recaptchaRef}
                                                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LdSWIAtAAAAAMhfBiaaEsve64dWwdBEzOkf5gDr"}
                                                hl={t('common.language_code', 'fr')}
                                            />
                                        </div>

                                        {errorMsg && (
                                            <div style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center', marginBottom: '10px', fontWeight: 500 }}>
                                                {errorMsg}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bp-contact-btn"
                                            style={{
                                                width: '100%', padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                                background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)`,
                                                color: 'white', fontSize: '16px', fontWeight: 700,
                                                boxShadow: `0 4px 16px rgba(244, 141, 53, 0.3)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                opacity: loading ? 0.7 : 1
                                            }}
                                        >
                                            {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : (
                                                <>
                                                    <Icon style={{ fontSize: '20px' }}>send</Icon>
                                                    {t('contact.send', 'Envoyer le message')}
                                                </>
                                            )}
                                        </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactApp;
