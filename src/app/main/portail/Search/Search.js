import React, { useRef } from 'react';
import { Popper, Icon, Paper, TextField, Typography, Avatar, CircularProgress } from '@material-ui/core';
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

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    container: {
        position: 'relative',
        width: '100%',
    },
    input: {
        background: '#ffffff',
        borderRadius: 40,
        height: 72, // Plus haut
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
        '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 40,
            border: '1.5px solid #e2e8f0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563eb',
        },
        '&.Mui-focused': {
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.1)',
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2563eb',
                borderWidth: '2px',
            },
        }
    },
    mainPaper: {
        borderRadius: "20px",
        marginTop: (props) => props.inline ? 40 : 8,
        padding: "24px",
        border: '1.5px solid #e2e8f0',
        boxShadow: (props) => props.inline ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        width: (props) => props.inline ? '100%' : '1600px',
        maxWidth: (props) => props.inline ? '100%' : '95vw',
        background: '#f8fafc',
        position: 'relative',
        zIndex: 10,
        transition: 'all 0.3s ease-out',
    },
    resultsGrid: {
        display: 'flex',
        gap: '24px',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        }
    },
    column: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
    },
    columnHeader: {
        padding: '24px 20px',
        background: '#ffffff',
        borderBottom: '2px solid #1e3a8a',
        textAlign: 'center',
        '& h4': {
            fontSize: '1.2rem', // Plus grand
            fontWeight: 800,
            color: '#1e3a8a',
            margin: 0,
            letterSpacing: '0.02em',
        }
    },
    suggestionItem: {
        padding: '16px 24px', // Plus de padding
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderBottom: '1px solid #f1f5f9',
        minHeight: '72px', // Plus haut
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
            background: '#eff6ff',
        },
        '&:last-child': {
            borderBottom: 'none',
        }
    },
    suggestionText: {
        fontSize: '1.05rem', // Plus grand
        color: '#1e293b',
        fontWeight: 600,
    },
    keywordLabel: {
        color: '#f59e0b',
        fontStyle: 'italic',
        fontSize: '0.9rem',
        marginLeft: '6px',
        fontWeight: 400,
    },
    produitItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 16,
    },
    entrepriseItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width: '100%',
    },
    countChip: {
        fontSize: '0.8rem',
        fontWeight: 700,
        color: '#65a30d',
        background: '#f7fee7',
        padding: '6px 14px',
        borderRadius: "10px",
        border: '1px solid #d9f99d',
        whiteSpace: 'nowrap',
    },
    avatar: {
        width: 64,
        height: 52,
        borderRadius: 6,
        border: '1.5px solid #f1f5f9',
        fontSize: '1.1rem',
        background: '#ffffff',
        color: '#1e3a8a',
        fontWeight: 700,
        '& img': {
            objectFit: 'contain',
            padding: '4px',
        }
    },
    companyDetails: {
        display: 'flex',
        flexDirection: 'column',
        '& .societe': {
            fontSize: '1.1rem', // Plus grand
            fontWeight: 700,
            color: '#1e293b',
            lineHeight: 1.2,
        },
        '& .filiale': {
            fontSize: '0.85rem',
            color: '#64748b',
            marginTop: '4px',
        }
    },
    noResults: {
        padding: 60,
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '1rem',
    }
}));


function renderSuggestion(suggestion, { query }, classes) {
    const isFournisseur = !!suggestion.societe;
    const isDemande = suggestion.type === 'demande';

    let text = suggestion.societe || suggestion.titre || suggestion.name ||
        suggestion.autreFrs || suggestion.autreProduits || suggestion.autreDemandes || suggestion.autreActivites || suggestion.autreActualites || '';

    if (isFournisseur) {
        return (
            <div className={classes.suggestionItem}>
                <div className={classes.entrepriseItem}>
                    <Avatar
                        className={classes.avatar}
                        src={suggestion.logo ? URL_SITE + suggestion.logo.url : null}
                    >
                        {suggestion.societe ? suggestion.societe[0] : 'B'}
                    </Avatar>
                    <div className={classes.companyDetails}>
                        <Typography className="societe">
                            <Highlighter
                                highlightStyle={{ background: '#fef08a', padding: '1px 2px' }}
                                searchWords={[query]}
                                autoEscape={true}
                                textToHighlight={suggestion.societe}
                            />
                        </Typography>
                        {suggestion.filiale && (
                            <Typography className="filiale">
                                (Filiale de {suggestion.filiale})
                            </Typography>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.suggestionItem}>
            <div className={classes.produitItem}>
                <Typography className={classes.suggestionText}>
                    <Highlighter
                        highlightStyle={{ background: '#fef08a', padding: '1px 2px' }}
                        searchWords={[query]}
                        autoEscape={true}
                        textToHighlight={text}
                    />
                    <span className={classes.keywordLabel}>({isDemande ? 'RFQ' : 'mot clé'})</span>
                </Typography>
                {suggestion.count && (
                    <span className={classes.countChip}>{suggestion.count} entreprise{suggestion.count > 1 ? 's' : ''}</span>
                )}
            </div>
        </div>
    );
}

function Search(props) {
    const { variant, inline } = props;
    const classes = useStyles({ variant, inline });
    const dispatch = useDispatch();
    const globalSearch = useSelector(({ globalSearchApp }) => globalSearchApp.globalSearch);
    const popperNode = useRef(null);

    const showSearch = () => dispatch(Actions.showSearch());
    const hideSearch = () => dispatch(Actions.hideSearch());

    const handleSuggestionSelected = (event, { suggestion }) => {
        let url;
        if (suggestion.autreFrs || suggestion.autreProduits || suggestion.autreDemandes || suggestion.autreActivites || suggestion.autreActualites) {
            url = `/${suggestion.autreFrs ? 'entreprises' : (suggestion.autreActivites ? 'annuaire-entreprises' : (suggestion.autreDemandes ? 'demandes-achats' : (suggestion.autreActualites ? 'actualites' : 'vente-produits')))}?q=${suggestion.value}`;
        }
        else if (suggestion.type === 'actualite' || suggestion.titre_news) {
            url = `/actualite/${suggestion.id}-${suggestion.slug}`;
        }
        else if (suggestion.type === 'demande') {
            url = `/demandes-achat/${suggestion.id}-${suggestion.slug}`;
        }
        else if (suggestion.titre && suggestion.sousSecteurSlug) {
            url = `/detail-produit/${suggestion.sousSecteurSlug}/${suggestion.categorieSlug}/${suggestion.id}-${suggestion.slug}`;
        }
        else if (suggestion.societe) {
            url = `/entreprise/${suggestion.id}-${suggestion.slug}`;
        }
        else if (suggestion.name) {
            url = `/vente-produits/${suggestion.sect}/${suggestion.slug}`;
        }
        else {
            url = `/vente-produits?q=${suggestion.value}`;
        }

        history.push(url);
        hideSearch();
    };

    const autosuggestProps = {
        renderInputComponent: (inputProps) => {
            const { ref, ...other } = inputProps;
            return (
                <div className="w-full relative">
                    <TextField
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            inputRef: ref,
                            classes: { root: classes.input, input: "py-12 px-24 h-64 pr-48" },
                            startAdornment: <Icon className="mr-16 text-28" style={{ color: '#94a3b8' }}>search</Icon>,
                            endAdornment: globalSearch.loading && <CircularProgress size={24} style={{ color: '#2563eb' }} />
                        }}
                        {...other}
                    />
                </div>
            );
        },
        highlightFirstSuggestion: true,
        multiSection: true,
        suggestions: globalSearch.suggestions,
        onSuggestionsFetchRequested: ({ value }) => value.trim().length > 0 && dispatch(Actions.loadSuggestions(value.trim())),
        onSuggestionsClearRequested: () => dispatch(Actions.clearSuggestions()),
        onSuggestionSelected: handleSuggestionSelected,
        renderSectionTitle: (s) => null,
        getSectionSuggestions: (s) => s.suggestions,
        getSuggestionValue: (s) => s.societe || s.titre || s.name || '',
        renderSuggestion: (s, p) => renderSuggestion(s, p, classes),
        renderSuggestionsContainer: ({ containerProps, children, query }) => {
            if (!query || query.length <= 0) return null;

            const sections = globalSearch.suggestions || [];
            const produits = sections.find(s => s.title === 'Produits')?.suggestions || [];
            const demandes = sections.find(s => s.title === 'Demandes')?.suggestions || [];
            const actualites = sections.find(s => s.title === 'Actualités')?.suggestions || [];
            const fournisseurs = sections.find(s => s.title === 'Fournisseurs')?.suggestions || [];

            const content = (
                <Paper elevation={0} {...containerProps} className={classes.mainPaper}>
                    <div className={classes.resultsGrid}>
                        {/* Bloc 1: Produits */}
                        <div className={classes.column}>
                            <div className={classes.columnHeader}>
                                <h4>Produits</h4>
                            </div>
                            <div className="flex-1 overflow-auto max-h-500">
                                {produits.length > 0 ? (
                                    produits.map((s, i) => (
                                        <div key={i} onMouseDown={() => handleSuggestionSelected(null, { suggestion: s })} style={{ cursor: 'pointer' }}>
                                            {renderSuggestion(s, { query }, classes)}
                                        </div>
                                    ))
                                ) : (
                                    <div className={classes.noResults}>Aucun produit</div>
                                )}
                            </div>
                        </div>

                        {/* Bloc 2: Demandes */}
                        <div className={classes.column}>
                            <div className={classes.columnHeader}>
                                <h4>Demandes</h4>
                            </div>
                            <div className="flex-1 overflow-auto max-h-500">
                                {demandes.length > 0 ? (
                                    demandes.map((s, i) => (
                                        <div key={i} onMouseDown={() => handleSuggestionSelected(null, { suggestion: s })} style={{ cursor: 'pointer' }}>
                                            {renderSuggestion(s, { query }, classes)}
                                        </div>
                                    ))
                                ) : (
                                    <div className={classes.noResults}>Aucune demande</div>
                                )}
                            </div>
                        </div>



                        {/* Bloc 3: Actualités */}
                        <div className={classes.column}>
                            <div className={classes.columnHeader}>
                                <h4>Actualités</h4>
                            </div>
                            <div className="flex-1 overflow-auto max-h-500">
                                {actualites.length > 0 ? (
                                    actualites.map((s, i) => (
                                        <div key={i} onMouseDown={() => handleSuggestionSelected(null, { suggestion: s })} style={{ cursor: 'pointer' }}>
                                            {renderSuggestion(s, { query }, classes)}
                                        </div>
                                    ))
                                ) : (
                                    <div className={classes.noResults}>Aucune actualité</div>
                                )}
                            </div>
                        </div>

                        {/* Bloc 4: Entreprises/Marques */}
                        <div className={classes.column}>
                            <div className={classes.columnHeader}>
                                <h4>Entreprises / Marques</h4>
                            </div>
                            <div className="flex-1 overflow-auto max-h-500">
                                {fournisseurs.length > 0 ? (
                                    fournisseurs.map((s, i) => (
                                        <div key={i} onMouseDown={() => handleSuggestionSelected(null, { suggestion: s })} style={{ cursor: 'pointer' }}>
                                            {renderSuggestion(s, { query }, classes)}
                                        </div>
                                    ))
                                ) : (
                                    <div className={classes.noResults}>Aucune entreprise</div>
                                )}
                            </div>
                        </div>
                    </div>
                </Paper>
            );

            if (inline) {
                return content;
            }

            return (
                <Popper
                    anchorEl={popperNode.current}
                    open={Boolean(query)}
                    placement="bottom"
                    popperOptions={{
                        positionFixed: true,
                        modifiers: {
                            offset: {
                                enabled: true,
                                offset: '0, 10'
                            },
                        }
                    }}
                    className="z-9999"
                    style={{
                        width: '1600px',
                        maxWidth: '95vw',
                    }}
                >
                    {content}
                </Popper>
            );
        },
        shouldRenderSuggestions: (v) => v.trim().length > 0
    };

    return (
        <div className={clsx(classes.root, props.className)
        } ref={popperNode} >
            <Autosuggest
                {...autosuggestProps}
                inputProps={{
                    placeholder: 'Rechercher un produit, fournisseur...',
                    value: globalSearch.searchText || '',
                    onChange: (e, { newValue }) => dispatch(Actions.setSearchText(newValue)),
                    onFocus: showSearch,
                }}
                theme={{ container: "w-full", suggestionsList: "m-0 p-0 list-none", suggestion: "block" }}
            />
        </div >
    );
}

export default withReducer('globalSearchApp', reducer)(Search);
