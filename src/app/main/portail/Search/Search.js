import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Popper, Icon, Paper, TextField, Typography, Avatar, CircularProgress, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import Autosuggest from 'react-autosuggest';
import reducer from './store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import withReducer from 'app/store/withReducer';
import Highlighter from "react-highlight-words";
import history from '@history';
import { URL_SITE } from "@fuse";

// ─── Styles ──────────────────────────────────────────────────────────────────

const useStyles = makeStyles(theme => ({
    root: { width: '100%' },
    container: { position: 'relative', width: '100%' },

    // ── Input wrapper ──────────────────────────────────────────────────
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 50,
        boxShadow: '0 4px 24px rgba(46,76,155,0.10), 0 1.5px 6px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.25s ease, background 0.25s ease',
        border: '1.5px solid rgba(46,76,155,0.10)',
        backdropFilter: 'blur(8px)',
        '&:focus-within': {
            boxShadow: '0 6px 32px rgba(46,76,155,0.18), 0 2px 8px rgba(0,0,0,0.08)',
            border: '1.5px solid rgba(46,76,155,0.25)',
            background: '#ffffff',
        },
    },
    input: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        flex: 1,
        height: 54,
        fontSize: '1rem',
        color: '#1e293b',
        padding: '0 16px',
        '& .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
        '& .MuiOutlinedInput-root': { background: 'transparent !important' },
        '& .MuiInputBase-root': { background: 'transparent' },
    },
    searchIcon: {
        marginLeft: 20,
        color: '#2e4c9b',
        fontSize: 22,
        flexShrink: 0,
        opacity: 0.75,
    },
    searchBtn: {
        borderRadius: '50px !important',
        padding: '8px 24px !important',
        marginRight: 6,
        background: 'linear-gradient(135deg, #F5A623 0%, #f0860a 100%) !important',
        color: '#ffffff !important',
        textTransform: 'none !important',
        fontWeight: '700 !important',
        fontSize: '0.92rem !important',
        boxShadow: '0 4px 14px rgba(245,166,35,0.35) !important',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        '&:hover': {
            boxShadow: '0 6px 20px rgba(245,166,35,0.5) !important',
            transform: 'translateY(-1px)',
        },
    },

    // ── Results panel ─────────────────────────────────────────────────
    resultPanel: {
        background: '#ffffff',
        borderRadius: props => props.inline ? '0px' : '20px',
        marginTop: props => props.inline ? 16 : 10,
        border: '1px solid #e5e7eb',
        boxShadow: props => props.inline ? 'none' : '0 24px 64px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        width: props => props.inline ? '100%' : '900px',
        maxWidth: props => props.inline ? '100%' : '95vw',
    },

    // ── Filter pills ──────────────────────────────────────────────────
    filterRow: {
        display: 'flex',
        gap: 8,
        padding: '14px 16px 10px',
        borderBottom: '1px solid #f1f5f9',
        background: '#fafafa',
        flexWrap: 'wrap',
    },
    filterPill: {
        padding: '5px 16px',
        borderRadius: 50,
        border: '1.5px solid #d1d5db',
        background: 'transparent',
        color: '#374151',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.15s',
        lineHeight: 1.4,
        '&:hover': {
            borderColor: '#9ca3af',
            background: '#f3f4f6',
        },
        '&.active': {
            background: '#111827',
            color: '#ffffff',
            borderColor: '#111827',
        }
    },

    // ── Results grid ──────────────────────────────────────────────────
    resultsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: 'repeat(2, 1fr)',
        },
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        }
    },
    resultsGrid3: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 0,
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        }
    },
    resultsGrid2: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 0,
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        }
    },
    resultsGrid1: {
        display: 'grid',
        gridTemplateColumns: '1fr',
    },

    // ── Column ───────────────────────────────────────────────────────
    col: {
        padding: '14px 12px',
        borderRight: '1px solid #f1f5f9',
        '&:last-child': { borderRight: 'none' },
    },
    colTitle: {
        fontSize: '0.75rem',
        fontWeight: 800,
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: '2px solid #2e4c9b',
        display: 'inline-block',
    },
    colBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxHeight: 320,
        overflowY: 'auto',
    },

    // ── Item card ────────────────────────────────────────────────────
    itemCard: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '7px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': {
            borderColor: '#2e4c9b',
            boxShadow: '0 2px 8px rgba(46,76,155,0.08)',
            background: '#fafbff',
        }
    },
    itemText: {
        fontSize: '0.83rem',
        color: '#374151',
        fontWeight: 500,
        lineHeight: 1.4,
        flex: 1,
    },
    badge: {
        background: '#f0fdf4',
        color: '#16a34a',
        border: '1px solid #bbf7d0',
        fontSize: '0.68rem',
        fontWeight: 700,
        padding: '2px 7px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
        flexShrink: 0,
    },

    // ── Enterprise card ──────────────────────────────────────────────
    entCard: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '7px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': {
            borderColor: '#2e4c9b',
            boxShadow: '0 2px 8px rgba(46,76,155,0.08)',
            background: '#fafbff',
        }
    },
    entAvatar: {
        width: 32,
        height: 32,
        borderRadius: 6,
        background: '#f3f4f6',
        color: '#374151',
        fontWeight: 800,
        fontSize: '0.85rem',
        flexShrink: 0,
        border: '1px solid #e5e7eb',
        '& img': { objectFit: 'contain', padding: 3 },
    },
    entName: {
        fontSize: '0.83rem',
        fontWeight: 600,
        color: '#111827',
        lineHeight: 1.3,
    },
    entFiliale: {
        fontSize: '0.72rem',
        color: '#6b7280',
        marginTop: 1,
    },

    // ── Empty state ───────────────────────────────────────────────────
    emptyState: {
        padding: '16px 8px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.78rem',
        border: '1px dashed #e5e7eb',
        borderRadius: 8,
    },

    // ── Footer CTA ────────────────────────────────────────────────────
    panelFooter: {
        padding: '10px 16px',
        background: '#f8fafc',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'center',
    },
    viewAllBtn: {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#2e4c9b',
        background: 'transparent',
        border: '1.5px solid #2e4c9b',
        borderRadius: 50,
        padding: '5px 20px',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.15s',
        '&:hover': {
            background: '#2e4c9b',
            color: '#fff',
        }
    },
}));

// ─── Filter definitions ───────────────────────────────────────────────────────

const FILTERS = [
    { key: 'tous', label: 'Tous' },
    { key: 'produits', label: 'Produits/Services' },
    { key: 'entreprises', label: 'Entreprises' },
    { key: 'demandes', label: 'Demandes' },
    { key: 'actualites', label: 'Actualités' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

function Search(props) {
    const { variant, inline, withButton } = props;
    const classes = useStyles({ variant, inline });
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const globalSearch = useSelector(({ globalSearchApp }) => globalSearchApp.globalSearch);
    const popperNode = useRef(null);
    const [activeFilter, setActiveFilter] = useState('tous');

    const showSearch = () => dispatch(Actions.showSearch());
    const hideSearch = () => dispatch(Actions.hideSearch());

    const handleSearchSubmit = () => {
        if (globalSearch.searchText && globalSearch.searchText.trim().length > 0) {
            history.push(`/recherche?q=${encodeURIComponent(globalSearch.searchText.trim())}`);
            hideSearch();
        }
    };

    const handleSuggestionSelected = (event, { suggestion }) => {
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
            url = `/vente-produits?q=${suggestion.value}`;
        }
        history.push(url);
        hideSearch();
    };

    // ── Results panel renderer ────────────────────────────────────────────────
    const renderResultsPanel = (containerProps, query) => {
        const sections = globalSearch.suggestions || [];
        const findSection = (title) => (sections.find(s => s.title === title) || {}).suggestions || [];

        const produits   = [...findSection('Produits / Services'), ...findSection('Activités')];
        const fournisseurs = findSection('Fournisseurs');
        const demandes = [...findSection('Demandes d\'achats'), ...findSection('Demandes d\'achat'), ...findSection('Demandes')];
        const actualites = findSection('Actualités');

        // Apply active filter
        const showProduits    = activeFilter === 'tous' || activeFilter === 'produits';
        const showEntreprises = activeFilter === 'tous' || activeFilter === 'entreprises';
        const showDemandes    = activeFilter === 'tous' || activeFilter === 'demandes';
        const showActualites  = activeFilter === 'tous' || activeFilter === 'actualites';
        const activeCount = [showProduits, showEntreprises, showDemandes, showActualites].filter(Boolean).length;
        const gridClass = activeCount === 4 ? classes.resultsGrid : activeCount === 3 ? classes.resultsGrid3 : activeCount === 2 ? classes.resultsGrid2 : classes.resultsGrid1;

        // Filter items based on active pill
        const displayProduits    = showProduits ? produits : [];
        const displayFournisseurs = showEntreprises ? fournisseurs : [];
        const displayDemandes    = showDemandes ? demandes : [];
        const displayActualites  = showActualites ? actualites : [];

        return (
            <Paper elevation={0} {...containerProps} className={classes.resultPanel}>
                {/* Filter pills */}
                <div className={classes.filterRow}>
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            className={`${classes.filterPill} ${activeFilter === f.key ? 'active' : ''}`}
                            onMouseDown={e => { e.preventDefault(); setActiveFilter(f.key); }}
                        >
                            {f.label}
                        </button>
                    ))}
                    {globalSearch.loading && <CircularProgress size={16} style={{ color: '#2e4c9b', marginLeft: 4, alignSelf: 'center' }} />}
                </div>

                {/* Results grid */}
                <div className={gridClass}>
                    {/* ── Produits ── */}
                    {showProduits && (
                        <div className={classes.col}>
                            <div className={classes.colTitle}>Produits / Services</div>
                            <div className={classes.colBody}>
                                {displayProduits.length > 0 ? displayProduits.map((s, i) => {
                                    const text = s.name || s.titre || s.autreProduits || s.autreActivites || s.autreDemandes || '';
                                    return (
                                        <div key={i} className={classes.itemCard}
                                            onMouseDown={() => handleSuggestionSelected(null, { suggestion: s })}>
                                            <span className={classes.itemText}>
                                                <Highlighter
                                                    highlightStyle={{ background: '#fef08a', padding: '0 2px', borderRadius: 2 }}
                                                    searchWords={[query]}
                                                    autoEscape
                                                    textToHighlight={text}
                                                />
                                            </span>
                                            {s.count && (
                                                <span className={classes.badge}>{s.count} ent.</span>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className={classes.emptyState}>Aucun produit</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Entreprises ── */}
                    {showEntreprises && (
                        <div className={classes.col}>
                            <div className={classes.colTitle}>Entreprises / Marques</div>
                            <div className={classes.colBody}>
                                {displayFournisseurs.length > 0 ? displayFournisseurs.map((s, i) => (
                                    <div key={i} className={classes.entCard}
                                        onMouseDown={() => handleSuggestionSelected(null, { suggestion: s })}>
                                        <Avatar
                                            className={classes.entAvatar}
                                            src={s.logo ? URL_SITE + s.logo.url : null}
                                        >
                                            {s.societe ? s.societe[0].toUpperCase() : 'B'}
                                        </Avatar>
                                        <div>
                                            <div className={classes.entName}>
                                                <Highlighter
                                                    highlightStyle={{ background: '#fef08a', padding: '0 2px', borderRadius: 2 }}
                                                    searchWords={[query]}
                                                    autoEscape
                                                    textToHighlight={s.societe || ''}
                                                />
                                            </div>
                                            {s.filiale && (
                                                <div className={classes.entFiliale}>Filiale de {s.filiale}</div>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className={classes.emptyState}>Aucune entreprise</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Demandes ── */}
                    {showDemandes && (
                        <div className={classes.col}>
                            <div className={classes.colTitle}>Demandes</div>
                            <div className={classes.colBody}>
                                {displayDemandes.length > 0 ? displayDemandes.map((s, i) => {
                                    const text = s.titre || s.autreDemandes || '';
                                    return (
                                        <div key={i} className={classes.itemCard}
                                            onMouseDown={() => handleSuggestionSelected(null, { suggestion: s })}>
                                            <span className={classes.itemText}>
                                                <Highlighter
                                                    highlightStyle={{ background: '#fef08a', padding: '0 2px', borderRadius: 2 }}
                                                    searchWords={[query]}
                                                    autoEscape
                                                    textToHighlight={text}
                                                />
                                            </span>
                                        </div>
                                    );
                                }) : (
                                    <div className={classes.emptyState}>Aucune demande</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Actualités ── */}
                    {showActualites && (
                        <div className={classes.col}>
                            <div className={classes.colTitle}>Actualités</div>
                            <div className={classes.colBody}>
                                {displayActualites.length > 0 ? displayActualites.map((s, i) => {
                                    const text = s.titre || s.autreActualites || '';
                                    return (
                                        <div key={i} className={classes.itemCard}
                                            onMouseDown={() => handleSuggestionSelected(null, { suggestion: s })}>
                                            <span className={classes.itemText}>
                                                <Highlighter
                                                    highlightStyle={{ background: '#fef08a', padding: '0 2px', borderRadius: 2 }}
                                                    searchWords={[query]}
                                                    autoEscape
                                                    textToHighlight={text}
                                                />
                                            </span>
                                        </div>
                                    );
                                }) : (
                                    <div className={classes.emptyState}>Aucune actualité</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>


            </Paper>
        );
    };

    // ── Autosuggest props ─────────────────────────────────────────────────────
    const autosuggestProps = {
        renderInputComponent: (inputProps) => {
            const { ref, ...other } = inputProps;
            return (
                <div className={classes.inputWrapper}>
                    <Icon className={classes.searchIcon}>search</Icon>
                    <TextField
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            inputRef: ref,
                            classes: { root: classes.input },
                        }}
                        {...other}
                    />
                    {globalSearch.loading && (
                        <CircularProgress size={18} style={{ color: '#2e4c9b', marginRight: 10, flexShrink: 0 }} />
                    )}
                    {withButton && (
                        <Button
                            className={classes.searchBtn}
                            variant="contained"
                            onClick={e => { e.stopPropagation(); handleSearchSubmit(); }}
                        >
                            Rechercher
                        </Button>
                    )}
                </div>
            );
        },
        highlightFirstSuggestion: false,
        multiSection: true,
        suggestions: globalSearch.suggestions,
        onSuggestionsFetchRequested: ({ value }) => value.trim().length > 0 && dispatch(Actions.loadSuggestions(value.trim())),
        onSuggestionsClearRequested: () => dispatch(Actions.clearSuggestions()),
        onSuggestionSelected: handleSuggestionSelected,
        renderSectionTitle: () => null,
        getSectionSuggestions: s => s.suggestions,
        getSuggestionValue: s => s.societe || s.titre || s.name || '',
        renderSuggestion: () => null,   // hidden — we render our own panel
        renderSuggestionsContainer: ({ containerProps, query }) => {
            if (!query || query.trim().length === 0) return null;

            const panel = renderResultsPanel(containerProps, query);

            if (inline) return panel;

            return (
                <Popper
                    anchorEl={popperNode.current}
                    open={Boolean(query)}
                    placement="bottom-start"
                    popperOptions={{
                        positionFixed: true,
                        modifiers: { offset: { enabled: true, offset: '0, 10' } }
                    }}
                    className="z-9999"
                    style={{ width: popperNode.current ? popperNode.current.offsetWidth : 900, maxWidth: '95vw' }}
                >
                    {panel}
                </Popper>
            );
        },
        shouldRenderSuggestions: v => v.trim().length > 0,
    };

    return (
        <div className={clsx(classes.root, props.className)} ref={popperNode}>
            <Autosuggest
                {...autosuggestProps}
                inputProps={{
                    placeholder: t('portail.search.placeholder', 'Rechercher un produit, fournisseur...'),
                    value: globalSearch.searchText || '',
                    onChange: (e, { newValue }) => dispatch(Actions.setSearchText(newValue)),
                    onFocus: showSearch,
                }}
                theme={{ container: 'w-full', suggestionsList: 'm-0 p-0 list-none', suggestion: 'block' }}
            />
        </div>
    );
}

export default withReducer('globalSearchApp', reducer)(Search);
