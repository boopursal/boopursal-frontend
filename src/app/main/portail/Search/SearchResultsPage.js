import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Avatar, LinearProgress, Chip } from '@material-ui/core';
import Highlighter from 'react-highlight-words';
import agent from 'agent';
import { URL_SITE } from '@fuse';
import { Helmet } from 'react-helmet';

// ─── Styles ─────────────────────────────────────────────────────────────────

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        background: '#f5f5f5',
        fontFamily: "'Inter', -apple-system, sans-serif",
    },

    // ── Sticky top bar ──────────────────────────────────────────
    topBar: {
        background: '#ffffff',
        borderBottom: '1px solid #e8e8e8',
        padding: '16px 24px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },

    // ── Filter pills ──
    filterRow: {
        display: 'flex',
        gap: 10,
        marginBottom: 14,
        flexWrap: 'wrap',
    },
    filterPill: {
        padding: '7px 18px',
        borderRadius: 50,
        border: '1.5px solid #d1d5db',
        background: 'transparent',
        color: '#374151',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.15s',
        '&:hover': {
            borderColor: '#9ca3af',
            background: '#f9fafb',
        },
        '&.active': {
            background: '#111827',
            color: '#ffffff',
            borderColor: '#111827',
        }
    },

    // ── Search bar ──
    searchBar: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '0 14px',
        marginBottom: 0,
        boxShadow: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:focus-within': {
            borderColor: '#2e4c9b',
            boxShadow: '0 0 0 3px rgba(46,76,155,0.08)',
        },
        '& svg, & .searchIcon': {
            color: '#9ca3af',
            fontSize: 20,
            flexShrink: 0,
        },
        '& input': {
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            color: '#111827',
            padding: '12px 0',
            fontFamily: "'Inter', sans-serif",
            background: 'transparent',
            '&::placeholder': { color: '#9ca3af' },
        }
    },
    searchSubmitBtn: {
        flexShrink: 0,
        padding: '7px 20px',
        borderRadius: 50,
        border: 'none',
        background: '#F5A623',
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.88rem',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        transition: 'opacity 0.15s',
        '&:hover': { opacity: 0.9 },
    },

    // ── Body ──────────────────────────────────────────────────────
    body: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 24px 80px',
    },

    pageTitle: {
        fontSize: '2rem',
        fontWeight: 800,
        color: '#111827',
        marginBottom: 12,
        letterSpacing: '-0.02em',
    },

    metaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 28,
        flexWrap: 'wrap',
    },
    metaText: {
        fontSize: '0.85rem',
        color: '#6b7280',
    },
    metaTag: {
        background: '#f3f4f6',
        border: '1px solid #e5e7eb',
        color: '#374151',
        fontSize: '0.78rem',
        fontWeight: 500,
        padding: '3px 10px',
        borderRadius: 20,
    },

    // ── 3-column grid ──────────────────────────────────────────────
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        alignItems: 'start',
        [theme.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
        [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr' },
    },
    grid3: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        alignItems: 'start',
        [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
    },
    grid2: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 20,
        alignItems: 'start',
        [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr' },
    },
    grid1: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 20,
    },

    // ── Column ──────────────────────────────────────────────────────
    column: {
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        padding: '18px 16px',
    },
    colTitle: {
        fontSize: '1rem',
        fontWeight: 800,
        color: '#111827',
        marginBottom: 14,
        letterSpacing: '-0.01em',
    },
    colBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxHeight: 480,
        overflowY: 'auto',
    },

    // ── Result item card ────────────────────────────────────────────
    itemCard: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': {
            borderColor: '#2e4c9b',
            boxShadow: '0 2px 8px rgba(46,76,155,0.08)',
        }
    },
    itemText: {
        fontSize: '0.88rem',
        color: '#374151',
        fontWeight: 500,
        lineHeight: 1.45,
        flex: 1,
    },
    badge: {
        background: '#f0fdf4',
        color: '#16a34a',
        border: '1.5px solid #bbf7d0',
        fontSize: '0.72rem',
        fontWeight: 700,
        padding: '3px 10px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
        flexShrink: 0,
    },

    // ── Enterprise card ─────────────────────────────────────────────
    entCard: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': {
            borderColor: '#2e4c9b',
            boxShadow: '0 2px 8px rgba(46,76,155,0.08)',
        }
    },
    entLogo: {
        width: 40,
        height: 40,
        borderRadius: 6,
        background: '#f3f4f6',
        border: '1px solid #e5e7eb',
        color: '#374151',
        fontWeight: 800,
        fontSize: '1rem',
        flexShrink: 0,
        '& img': { objectFit: 'contain', padding: 4 },
    },
    entName: {
        fontSize: '0.88rem',
        fontWeight: 600,
        color: '#111827',
        lineHeight: 1.35,
    },
    entFiliale: {
        fontSize: '0.76rem',
        color: '#6b7280',
        marginTop: 2,
        fontStyle: 'normal',
    },

    // ── Director card ────────────────────────────────────────────────
    dirCard: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': {
            borderColor: '#2e4c9b',
            boxShadow: '0 2px 8px rgba(46,76,155,0.08)',
        }
    },
    dirAvatar: {
        width: 36,
        height: 36,
        background: '#f3f4f6',
        color: '#9ca3af',
        fontWeight: 700,
        fontSize: '0.85rem',
        flexShrink: 0,
    },
    dirName: {
        fontSize: '0.88rem',
        fontWeight: 700,
        color: '#111827',
        lineHeight: 1.3,
    },
    dirSociete: {
        fontSize: '0.76rem',
        color: '#6b7280',
        fontStyle: 'italic',
        marginTop: 2,
    },

    // ── Empty / Loading ──────────────────────────────────────────────
    emptyState: {
        padding: '24px 10px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.82rem',
        border: '1px dashed #e5e7eb',
        borderRadius: 10,
    },
    loadingWrap: {
        padding: '80px 0',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.9rem',
    },
}));

// ─── Filter definitions ──────────────────────────────────────────────────────

const FILTERS = [
    { key: 'tous', label: 'Tous' },
    { key: 'produits', label: 'Produits/Services' },
    { key: 'entreprises', label: 'Entreprises' },
    { key: 'demandes', label: 'Demandes' },
    { key: 'actualites', label: 'Actualités' },
];

// ─── Main Component ──────────────────────────────────────────────────────────

function SearchResultsPage(props) {
    const classes = useStyles();
    const searchParams = new URLSearchParams(props.location ? props.location.search : '');
    const q = searchParams.get('q') || '';

    const [searchInput, setSearchInput] = useState(q);
    const [activeFilter, setActiveFilter] = useState('tous');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({
        produits: [], activites: [], fournisseurs: [], demandes: [], actualites: []
    });

    const fetchResults = useCallback(async (searchText) => {
        if (!searchText || searchText.trim().length < 2) return;
        setLoading(true);
        try {
            const resp = await agent.get(`/api/searchResult?searchText=${searchText.trim()}`);
            const data = resp.data || [];
            const findSection = (title) => {
                const sec = data.find(s => s.title === title);
                return sec ? sec.suggestions || [] : [];
            };
            setResults({
                produits: findSection('Produits / Services'),
                activites: findSection('Activités'),
                fournisseurs: findSection('Fournisseurs'),
                demandes: [...findSection('Demandes d\'achats'), ...findSection('Demandes d\'achat'), ...findSection('Demandes')],
                actualites: findSection('Actualités'),
            });
        } catch (e) {
            console.error('SearchResults fetch error', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setSearchInput(q);
        fetchResults(q);
    }, [q, fetchResults]);

    const handleSearch = () => {
        if (searchInput.trim()) {
            props.history.push(`/recherche?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const goTo = (suggestion) => {
        let url;
        if (suggestion.autreFrs || suggestion.autreProduits || suggestion.autreDemandes || suggestion.autreActivites || suggestion.autreActualites) {
            url = `/${suggestion.autreFrs ? 'entreprises' : (suggestion.autreActivites ? 'annuaire-entreprises' : (suggestion.autreDemandes ? 'demandes-achats' : (suggestion.autreActualites ? 'actualites' : 'vente-produits')))}?q=${suggestion.value}`;
        } else if (suggestion.type === 'actualite' || suggestion.titre_news) {
            url = `/actualite/${suggestion.id}-${suggestion.slug}`;
        } else if (suggestion.type === 'demande') {
            url = `/demandes-achat/${suggestion.id}-${suggestion.slug}`;
        } else if (suggestion.titre && suggestion.sousSecteurSlug) {
            url = `/detail-produit/${suggestion.sousSecteurSlug}/${suggestion.categorieSlug}/${suggestion.id}-${suggestion.slug}`;
        } else if (suggestion.societe) {
            url = `/entreprise/${suggestion.id}-${suggestion.slug}`;
        } else if (suggestion.name) {
            url = `/vente-produits/${suggestion.sect}/${suggestion.slug}`;
        } else {
            url = `/vente-produits?q=${suggestion.value || q}`;
        }
        props.history.push(url);
    };

    const { produits, activites, fournisseurs, demandes, actualites } = results;
    const allProduits = [...produits, ...activites];
    const totalCount = allProduits.length + fournisseurs.length + demandes.length + actualites.length;

    const showProduits   = activeFilter === 'tous' || activeFilter === 'produits';
    const showEntreprises = activeFilter === 'tous' || activeFilter === 'entreprises';
    const showDemandes    = activeFilter === 'tous' || activeFilter === 'demandes';
    const showActualites  = activeFilter === 'tous' || activeFilter === 'actualites';
    const activeCount = [showProduits, showEntreprises, showDemandes, showActualites].filter(Boolean).length;
    const gridClass = activeCount === 4 ? classes.grid : activeCount === 3 ? classes.grid3 : activeCount === 2 ? classes.grid2 : classes.grid1;

    const activeLabel = FILTERS.find(f => f.key === activeFilter)?.label || 'Tous';

    return (
        <div className={classes.root}>
            <Helmet>
                <title>{q ? `Résultats pour "${q}" - Boopursal` : 'Recherche - Boopursal'}</title>
            </Helmet>

            {/* ── Sticky top bar ── */}
            <div className={classes.topBar}>
                {/* Filter pills */}
                <div className={classes.filterRow}>
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            className={`${classes.filterPill} ${activeFilter === f.key ? 'active' : ''}`}
                            onClick={() => setActiveFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Search bar */}
                <div className={classes.searchBar}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af', flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Rechercher un produit, fournisseur..."
                    />
                    <button className={classes.searchSubmitBtn} onClick={handleSearch}>
                        Rechercher
                    </button>
                </div>

                {loading && <LinearProgress style={{ height: 2, marginTop: 2 }} />}
            </div>

            {/* ── Body ── */}
            <div className={classes.body}>
                <Typography className={classes.pageTitle}>Résultats de recherche</Typography>

                {q && (
                    <div className={classes.metaRow}>
                        <span className={classes.metaText}>
                            Résultats pour <strong>{q}</strong>
                        </span>
                        <span className={classes.metaTag}>Type sélectionné</span>
                        <span className={classes.metaTag}>Type : {activeLabel}</span>
                        {!loading && totalCount > 0 && (
                            <span className={classes.metaTag}>{totalCount} résultat{totalCount > 1 ? 's' : ''}</span>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className={classes.loadingWrap}>Recherche en cours...</div>
                ) : (
                    <div className={gridClass}>

                        {/* ── Produits / Services / Mots-clé ── */}
                        {showProduits && (
                            <div className={classes.column}>
                                <div className={classes.colTitle}>Produits/Services/Mots-clé</div>
                                <div className={classes.colBody}>
                                    {allProduits.length > 0 ? allProduits.map((s, i) => {
                                        const text = s.name || s.titre || s.autreProduits || s.autreActivites || s.autreDemandes || '';
                                        return (
                                            <div key={i} className={classes.itemCard} onClick={() => goTo(s)}>
                                                <span className={classes.itemText}>
                                                    <Highlighter
                                                        highlightStyle={{ background: '#fef08a', padding: '0 2px', borderRadius: 2 }}
                                                        searchWords={[q]}
                                                        autoEscape
                                                        textToHighlight={text}
                                                    />
                                                </span>
                                                {s.count && (
                                                    <span className={classes.badge}>{s.count} entreprise{s.count > 1 ? 's' : ''}</span>
                                                )}
                                            </div>
                                        );
                                    }) : (
                                        <div className={classes.emptyState}>Aucun produit trouvé</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Entreprises / Marques ── */}
                        {showEntreprises && (
                            <div className={classes.column}>
                                <div className={classes.colTitle}>Entreprises/Marques</div>
                                <div className={classes.colBody}>
                                    {fournisseurs.length > 0 ? fournisseurs.map((s, i) => (
                                        <div key={i} className={classes.entCard} onClick={() => goTo(s)}>
                                            <Avatar
                                                className={classes.entLogo}
                                                src={s.logo ? URL_SITE + s.logo.url : null}
                                            >
                                                {s.societe ? s.societe[0].toUpperCase() : 'B'}
                                            </Avatar>
                                            <div>
                                                <div className={classes.entName}>
                                                    <Highlighter
                                                        highlightStyle={{ background: '#fef08a', padding: '0 2px', borderRadius: 2 }}
                                                        searchWords={[q]}
                                                        autoEscape
                                                        textToHighlight={s.societe || ''}
                                                    />
                                                </div>
                                                {s.filiale && (
                                                    <div className={classes.entFiliale}>
                                                        Filiale de {s.filiale}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className={classes.emptyState}>Aucune entreprise trouvée</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Demandes ── */}
                        {showDemandes && (
                            <div className={classes.column}>
                                <div className={classes.colTitle}>Demandes</div>
                                <div className={classes.colBody}>
                                    {demandes.length > 0 ? demandes.map((s, i) => {
                                        const text = s.titre || s.autreDemandes || '';
                                        return (
                                            <div key={i} className={classes.itemCard} onClick={() => goTo(s)}>
                                                <span className={classes.itemText}>
                                                    <Highlighter
                                                        highlightStyle={{ background: '#fef08a', padding: '0 2px', borderRadius: 2 }}
                                                        searchWords={[q]}
                                                        autoEscape
                                                        textToHighlight={text}
                                                    />
                                                </span>
                                            </div>
                                        );
                                    }) : (
                                        <div className={classes.emptyState}>Aucune demande trouvée</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Actualités ── */}
                        {showActualites && (
                            <div className={classes.column}>
                                <div className={classes.colTitle}>Actualités</div>
                                <div className={classes.colBody}>
                                    {actualites.length > 0 ? actualites.map((s, i) => {
                                        const text = s.titre || s.autreActualites || '';
                                        return (
                                            <div key={i} className={classes.itemCard} onClick={() => goTo(s)}>
                                                <span className={classes.itemText}>
                                                    <Highlighter
                                                        highlightStyle={{ background: '#fef08a', padding: '0 2px', borderRadius: 2 }}
                                                        searchWords={[q]}
                                                        autoEscape
                                                        textToHighlight={text}
                                                    />
                                                </span>
                                            </div>
                                        );
                                    }) : (
                                        <div className={classes.emptyState}>Aucune actualité trouvée</div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchResultsPage;
