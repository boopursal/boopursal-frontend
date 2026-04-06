import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Icon, List, ListItem, ListItemText, Typography, Chip, IconButton, LinearProgress } from '@material-ui/core';
import { FuseAnimateGroup } from '@fuse';
import _ from '@lodash';
import * as Actions from '../store/actions';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    sectionCard: {
        borderRadius: 20,
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
        backgroundColor: 'white',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
            borderColor: '#e2e8f0'
        }
    },
    sectionHeader: {
        padding: '20px 24px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    headerIcon: {
        color: theme.palette.primary.main,
        fontSize: 20
    },
    headerTitle: {
        fontSize: '0.875rem',
        fontWeight: 800,
        color: '#1e293b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    listRoot: {
        padding: '8px 0',
        maxHeight: 350,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f5f9',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '10px',
        },
    },
    listItem: {
        padding: '10px 24px',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#f8fafc',
            paddingLeft: '30px',
            '& $itemText': {
                color: theme.palette.primary.main
            }
        },
        '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.05)',
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            '& $itemText': {
                color: theme.palette.primary.main,
                fontWeight: 700
            }
        }
    },
    itemText: {
        fontSize: '0.875rem',
        color: '#475569',
        fontWeight: 500
    },
    itemCount: {
        fontSize: '0.75rem',
        color: '#94a3b8',
        fontWeight: 600,
        backgroundColor: '#f1f5f9',
        padding: '2px 8px',
        borderRadius: 12
    },
    activeFilterChip: {
        margin: '16px 24px',
        height: 32,
        borderRadius: 10,
        fontWeight: 700,
        fontSize: '0.8rem',
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
        color: theme.palette.primary.main,
        border: `1px solid rgba(25, 118, 210, 0.2)`,
        '& .MuiChip-deleteIcon': {
            color: theme.palette.primary.main,
            '&:hover': {
                color: theme.palette.primary.dark
            }
        }
    },
    loader: {
        height: 2,
        backgroundColor: '#f1f5f9',
        '& .MuiLinearProgress-bar': {
            backgroundColor: theme.palette.primary.main
        }
    }
}));

function useQuery(location) {
    return new URLSearchParams(location.search);
}

function SideBareSearch(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const loadingSecteurs = useSelector(({ demandesAchat }) => demandesAchat.demandes.loadingSecteurs);
    const secteurs = useSelector(({ demandesAchat }) => demandesAchat.demandes.secteurs);
    const loadingActivites = useSelector(({ demandesAchat }) => demandesAchat.demandes.loadingActivites);
    const activites = useSelector(({ demandesAchat }) => demandesAchat.demandes.activites);
    const loadingCategories = useSelector(({ demandesAchat }) => demandesAchat.demandes.loadingCategories);
    const categories = useSelector(({ demandesAchat }) => demandesAchat.demandes.categories);
    const loadingPays = useSelector(({ demandesAchat }) => demandesAchat.demandes.loadingPays);
    const payss = useSelector(({ demandesAchat }) => demandesAchat.demandes.pays);
    const loadingVilles = useSelector(({ demandesAchat }) => demandesAchat.demandes.loadingVilles);
    const villes = useSelector(({ demandesAchat }) => demandesAchat.demandes.villes);
    const demandes = useSelector(({ demandesAchat }) => demandesAchat.demandes.data);
    const parametres = useSelector(({ demandesAchat }) => demandesAchat.demandes.parametres);

    const query = useQuery(props.location);
    const params = props.match.params;
    const { secteur, activite, categorie } = params;
    const pays = query.get("pays");
    const ville = query.get("ville");
    const q = query.get("q");

    const scrollToTop = () => {
        const el = document.querySelector('.st');
        if (el) el.scrollTop = 0;
    };

    function handleDeletePathSecteur() {
        let searchText = q ? 'q=' + q : '';
        props.history.push({ pathname: '/demandes-achats', search: (pays ? 'pays=' + pays : '') + (ville ? '&ville=' + ville : '') + (q ? (pays ? '&' : '') + searchText : '') });
        scrollToTop();
        parametres.page = 1;
        dispatch(Actions.setParametresData(parametres));
    }

    function handleDeletePathActivite() {
        let searchText = q ? 'q=' + q : '';
        props.history.push({ pathname: '/demandes-achats/' + secteur, search: (pays ? 'pays=' + pays : '') + (ville ? '&ville=' + ville : '') });
        scrollToTop();
    }

    function handleDeleteQueryPays() {
        const path = (secteur ? '/' + secteur : '') + (activite ? '/' + activite : '') + (categorie ? '/' + categorie : '');
        props.history.push({ pathname: '/demandes-achats' + path, search: q ? 'q=' + q : '' });
        scrollToTop();
        parametres.page = 1;
        dispatch(Actions.setParametresData(parametres));
    }

    return (
        <div className={classes.root}>
            {/* Section Pays / Localisation */}
            <div className={classes.sectionCard}>
                <div className={classes.sectionHeader}>
                    <Icon className={classes.headerIcon}>public</Icon>
                    <Typography className={classes.headerTitle}>Localisation</Typography>
                </div>

                {pays && (
                    <Chip
                        label={_.capitalize(pays.replace('-', ' '))}
                        onDelete={handleDeleteQueryPays}
                        className={classes.activeFilterChip}
                        color="primary"
                    />
                )}

                <div className={classes.listRoot}>
                    {pays ? (
                        loadingVilles ? <LinearProgress className={classes.loader} /> : (
                            <FuseAnimateGroup enter={{ animation: "transition.slideUpBigIn" }}>
                                {villes && [...villes].sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => (
                                    <ListItem
                                        key={index}
                                        className={classes.listItem}
                                        selected={item.slug === ville}
                                        button={item.slug !== ville}
                                        onClick={() => {
                                            props.history.push({ pathname: props.location.pathname, search: 'pays=' + pays + '&ville=' + item.slug + (q ? '&q=' + q : '') });
                                            scrollToTop();
                                        }}>
                                        <ListItemText primary={<span className={classes.itemText}>{item.name}</span>} />
                                        <span className={classes.itemCount}>{item.count}</span>
                                    </ListItem>
                                ))}
                            </FuseAnimateGroup>
                        )
                    ) : (
                        loadingPays ? <LinearProgress className={classes.loader} /> : (
                            <FuseAnimateGroup enter={{ animation: "transition.slideUpBigIn" }}>
                                {payss && [...payss].sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => (
                                    <ListItem
                                        key={index}
                                        className={classes.listItem}
                                        button
                                        onClick={() => {
                                            props.history.push({ pathname: props.location.pathname, search: 'pays=' + item.slug + (q ? '&q=' + q : '') });
                                            scrollToTop();
                                        }}>
                                        <ListItemText primary={<span className={classes.itemText}>{item.name}</span>} />
                                        <span className={classes.itemCount}>{item.count}</span>
                                    </ListItem>
                                ))}
                            </FuseAnimateGroup>
                        )
                    )}
                </div>
            </div>

            {/* Section Catégories / Activités */}
            <div className={classes.sectionCard}>
                <div className={classes.sectionHeader}>
                    <Icon className={classes.headerIcon}>category</Icon>
                    <Typography className={classes.headerTitle}>Catégories</Typography>
                </div>

                <div className="flex flex-col">
                    {secteur && (
                        <Chip
                            label={_.capitalize(secteur.replace('-', ' '))}
                            onDelete={handleDeletePathSecteur}
                            className={classes.activeFilterChip}
                        />
                    )}
                    {activite && (
                        <Chip
                            label={_.capitalize(activite.replace('-', ' '))}
                            onDelete={handleDeletePathActivite}
                            className={clsx(classes.activeFilterChip, "mt-0")}
                        />
                    )}
                </div>

                <div className={classes.listRoot}>
                    {secteur ? (
                        activite ? (
                            loadingCategories ? <LinearProgress className={classes.loader} /> : (
                                <FuseAnimateGroup enter={{ animation: "transition.slideUpBigIn" }}>
                                    {categories && [...categories].sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => (
                                        <ListItem
                                            key={index}
                                            className={classes.listItem}
                                            selected={item.slug === categorie}
                                            button={item.slug !== categorie}
                                            onClick={() => {
                                                if (item.slug !== categorie) {
                                                    props.history.push({ pathname: '/demandes-achats/' + secteur + '/' + activite + '/' + item.slug, search: (pays ? 'pays=' + pays : '') + (ville ? '&ville=' + ville : '') + (q ? '&q=' + q : '') });
                                                    scrollToTop();
                                                }
                                            }}>
                                            <ListItemText primary={<span className={classes.itemText}>{item.name}</span>} />
                                            <span className={classes.itemCount}>{item.count}</span>
                                        </ListItem>
                                    ))}
                                </FuseAnimateGroup>
                            )
                        ) : (
                            loadingActivites ? <LinearProgress className={classes.loader} /> : (
                                <FuseAnimateGroup enter={{ animation: "transition.slideUpBigIn" }}>
                                    {activites && [...activites].sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => (
                                        <ListItem
                                            key={index}
                                            className={classes.listItem}
                                            button
                                            onClick={() => {
                                                props.history.push({ pathname: '/demandes-achats/' + secteur + '/' + item.slug, search: (pays ? 'pays=' + pays : '') + (ville ? '&ville=' + ville : '') + (q ? '&q=' + q : '') });
                                                scrollToTop();
                                            }}>
                                            <ListItemText primary={<span className={classes.itemText}>{item.name}</span>} />
                                            <span className={classes.itemCount}>{item.count}</span>
                                        </ListItem>
                                    ))}
                                </FuseAnimateGroup>
                            )
                        )
                    ) : (
                        loadingSecteurs ? <LinearProgress className={classes.loader} /> : (
                            <FuseAnimateGroup enter={{ animation: "transition.slideUpBigIn" }}>
                                {secteurs && [...secteurs].sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => (
                                    <ListItem
                                        key={index}
                                        className={classes.listItem}
                                        button
                                        onClick={() => {
                                            props.history.push({ pathname: '/demandes-achats/' + item.slug, search: (pays ? 'pays=' + pays : '') + (ville ? '&ville=' + ville : '') + (q ? '&q=' + q : '') });
                                            scrollToTop();
                                        }}>
                                        <ListItemText primary={<span className={classes.itemText}>{item.name}</span>} />
                                        <span className={classes.itemCount}>{item.count}</span>
                                    </ListItem>
                                ))}
                            </FuseAnimateGroup>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default SideBareSearch;