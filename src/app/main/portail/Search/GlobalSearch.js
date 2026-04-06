import React, { useEffect, useRef, useState } from 'react';
import { FuseAnimate, FuseAnimateGroup } from '@fuse';
import { ClickAwayListener, Paper, Icon, Input, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import reducer from './store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import withReducer from 'app/store/withReducer';
import Highlighter from "react-highlight-words";
import ContentLoader from 'react-content-loader';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        height: 200,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
    },
    searchResults: {
        width: '100%',
        overflowX: 'auto',
    },
    sectionsContainer: {
        padding: theme.spacing(2),
        minHeight: 300,
        margin: 0,
    },
    sectionWrapper: {
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[2],
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)'
        }
    },
    sectionContent: {
        flex: 1,
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        overflowY: 'auto',
        minHeight: 200,
        maxHeight: 400,
    },
    noResults: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        textAlign: 'center',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

function GlobalSearch(props) {
    const dispatch = useDispatch();
    const [onSearch, setOnSearch] = useState(false);
    const classes = useStyles(props);
    const globalSearch = useSelector(({ globalSearchApp }) => globalSearchApp.globalSearch);
    const ResultsNode = useRef(null);

    useEffect(() => {
        if (globalSearch.searchText.length > 1 && onSearch) {
            dispatch(Actions.showSearch());
            dispatch({
                type: Actions.GS_REQUEST_PRODUITS,
            });
            dispatch({
                type: Actions.GS_REQUEST_ACTIVITES,
            });
            dispatch({
                type: Actions.GS_REQUEST_FOURNISSEUR,
            });
            const timer = setTimeout(() => {
                dispatch(Actions.getResults(globalSearch.searchText));
            }, 500);
            return () => {
                clearTimeout(timer);
                dispatch(Actions.cleanUp())
            };
        }
        else {
            dispatch(Actions.hideSearch());
        }
    }, [globalSearch.searchText, onSearch, dispatch]);

    function handleClickAway(event) {
        return (
            !ResultsNode.current ||
            !ResultsNode.current.contains(event.target)
        ) && (dispatch(Actions.hideSearch()), setOnSearch(false));
    }

    function hideSearch() {
        dispatch(Actions.hideSearch())
    }

    const renderSearchResults = () => {
        const sections = [
            {
                title: 'Fournisseurs',
                content: globalSearch.fournisseurs,
                loading: globalSearch.loadingFournisseurs,
                renderItem: (item) => (
                    <ListItem
                        component={Link}
                        to={`/entreprise/${item.id}-${item.slug}`}
                        onClick={() => { hideSearch(); setOnSearch(false) }}
                        button
                    >
                        <ListItemText
                            primary={
                                <Highlighter
                                    highlightClassName="YourHighlightClass"
                                    searchWords={[globalSearch.searchText]}
                                    autoEscape={true}
                                    textToHighlight={item.societe}
                                />
                            }
                        />
                    </ListItem>
                )
            },
            {
                title: 'Produits',
                content: globalSearch.produits,
                loading: globalSearch.loadingProduits,
                renderItem: (item) => (
                    <ListItem
                        component={Link}
                        to={`/detail-produit/${item.sec}/${item.soussec}/${item.id}-${item.slug}`}
                        onClick={() => { hideSearch(); setOnSearch(false) }}
                        button
                    >
                        <ListItemText
                            primary={
                                <Highlighter
                                    highlightClassName="YourHighlightClass"
                                    searchWords={[globalSearch.searchText]}
                                    autoEscape={true}
                                    textToHighlight={item.titre}
                                />
                            }
                        />
                    </ListItem>
                )
            },
            {
                title: 'Activités',
                content: globalSearch.activites,
                loading: globalSearch.loadingActivites,
                renderItem: (item) => (
                    <ListItem
                        component={Link}
                        to={`/vente-produits?activite=${item.slug}`}
                        onClick={() => { hideSearch(); setOnSearch(false) }}
                        button
                    >
                        <ListItemText
                            primary={
                                <Highlighter
                                    highlightClassName="YourHighlightClass"
                                    searchWords={[globalSearch.searchText]}
                                    autoEscape={true}
                                    textToHighlight={item.name}
                                />
                            }
                        />
                    </ListItem>
                )
            },
            {
                title: 'Actualités',
                content: globalSearch.actualites,
                loading: globalSearch.loadingActualites,
                renderItem: (item) => (
                    <ListItem
                        component={Link}
                        to={`/actualite/${item.id}-${item.slug}`}
                        onClick={() => { hideSearch(); setOnSearch(false) }}
                        button
                    >
                        <ListItemText
                            primary={
                                <Highlighter
                                    highlightClassName="YourHighlightClass"
                                    searchWords={[globalSearch.searchText]}
                                    autoEscape={true}
                                    textToHighlight={item.titre}
                                />
                            }
                        />
                    </ListItem>
                )
            }
        ];

        return (
            <div className={classes.searchResults}>
                <Grid container spacing={4} className={classes.sectionsContainer}>
                    {sections.map((section, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <div className={classes.sectionWrapper}>
                                <div className={classes.sectionContent}>
                                    {section.loading ? (
                                        <ContentLoader
                                            viewBox="0 0 400 100"
                                            height={100}
                                            width={400}
                                            speed={2}
                                        >
                                            <circle cx="150" cy="86" r="8" />
                                            <circle cx="194" cy="86" r="8" />
                                            <circle cx="238" cy="86" r="8" />
                                        </ContentLoader>
                                    ) : (
                                        <List className={classes.root}>
                                            {section.content && section.content.length > 0 ? (
                                                section.content.map((item, itemIndex) => (
                                                    <React.Fragment key={itemIndex}>
                                                        {section.renderItem(item)}
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <Typography className={classes.noResults}>
                                                    Aucun {section.title.toLowerCase().slice(0, -1)} trouvé
                                                </Typography>
                                            )}
                                        </List>
                                    )}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    };

    return (
        <div ref={ResultsNode} className={clsx("mx-auto w-full max-w-1600 border border-gray-600 rounded-lg", props.className)}>
            <FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
                <Paper className="flex p-4 items-center w-full rounded-lg" elevation={1}>
                    <Icon className="mr-8 ml-8" color="action">search</Icon>
                    <Input
                        placeholder="Rechercher un produit, une activité, un fournisseur"
                        className="flex flex-1 h-44 focus:bg-gray"
                        disableUnderline
                        fullWidth
                        onChange={(event) => {
                            dispatch(Actions.setGlobalSearchText(event));
                            setOnSearch(true)
                        }}
                        onFocus={(event) => { setOnSearch(true) }}
                        autoFocus
                        value={globalSearch.searchText}
                        inputProps={{
                            'aria-label': 'Search'
                        }}
                    />
                </Paper>
            </FuseAnimate>
            {globalSearch.opened && (
                <ClickAwayListener onClickAway={handleClickAway}>
                    <FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
                        <div className="mx-auto w-full z-999">
                            <Paper className="absolute shadow w-full z-9999" elevation={1}>
                                {renderSearchResults()}
                            </Paper>
                        </div>
                    </FuseAnimate>
                </ClickAwayListener>
            )}
        </div>
    );
}

export default withReducer('globalSearchApp', reducer)(GlobalSearch);
