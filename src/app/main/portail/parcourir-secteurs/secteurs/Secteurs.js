import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Paper, Typography, Icon, Input } from '@material-ui/core';
import HeaderSecteurs from './HeaderSecteurs';
import CardSecteur from './CardSecteur';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import ContentLoader from 'react-content-loader'
import { Helmet } from "react-helmet";
import { FuseUtils } from '@fuse';
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        // minHeight      : '100%',
        position: 'relative',
        flex: '1 0 auto',
        height: 'auto',
        backgroundColor: theme.palette.background.default
    },
    middle: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        position: 'relative',
        marginBottom: theme.spacing(4),
    },
    grid: {
        marginBottom: '-16px',
        marginTop: '-16px',
        marginLeft: 'auto',
        marginRight: 'auto',
        '& > .MuiGrid-item': {
            padding: '16px'
        }
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    paper: {
        borderTop: '2px solid ' + theme.palette.secondary.main,
    },
    title: {
        fontSize: 20,
        color: theme.palette.primary.main,
        marginBottom: 16,
    },
}));
function generate(element) {
    return [0, 1, 2, 3].map(value =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}
function Secteurs(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const secteurs = useSelector(({ parcourirSecteurs }) => parcourirSecteurs.pSecteurs);
    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (!secteurs.data) {
            dispatch(Actions.getPSecteurs());
        }
    }, [dispatch, secteurs.data]);

    useEffect(() => {
        const queryParams = new URLSearchParams(props.location.search);
        const q = queryParams.get('q');
        if (q && secteurs.searchText !== q) {
            dispatch(Actions.setSearchText({ target: { value: q } }));
        }
    }, [dispatch, props.location.search, secteurs.searchText]);


    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (secteurs.data) {
            setFilteredData(getFilteredArray(secteurs.data, secteurs.searchText));
        }
    }, [secteurs.data, secteurs.searchText]);


    return (


        <div className={clsx(classes.root, props.innerScroll && classes.innerScroll, 'min-h-md')}>
            {
                <Helmet>
                    <title>{'Tous les secteurs d’activités | Les Achats Industriels'}</title>
                    <meta name="description" content='Tous les secteurs d’activités | Les Achats Industriels' />
                    <meta property="og:title" content='Tous les secteurs d’activités | Les Achats Industriels' />
                    <meta property="og:description" content='Tous les secteurs d’activités | Les Achats Industriels' />
                </Helmet>
            }
            <div
                className={clsx(classes.middle, "mb-0 relative overflow-hidden flex flex-col flex-shrink-0 ")}>
                <Grid container className=" max-w-2xl mx-auto py-8  sm:px-16 items-center z-9999">
                    <Grid item sm={12} xs={12}>
                        <HeaderSecteurs {...props} />
                    </Grid>
                </Grid>
            </div>
            <Grid container className={clsx(classes.grid, " max-w-2xl mx-auto py-8  sm:px-16 ")}>
                <Grid item sm={12} xs={12}>
                    <Paper variant="outlined" className={clsx(classes.paper, 'p-32 my-16')}>

                        <Typography className={classes.title} component="h1" color="primary">
                            Découvrez <span className="font-bold">Boopursal</span> à travers ces secteurs d'activités.
                        </Typography>
                        <Paper className="flex items-center w-full mb-16 px-8 py-4 rounded-8" elevation={1}>
                            <Icon className="mr-8" color="action">search</Icon>
                            <Input
                                placeholder="Parcourir les secteurs d’activités"
                                className="flex flex-1"
                                disableUnderline
                                fullWidth
                                value={secteurs.searchText}
                                inputProps={{
                                    'aria-label': 'Rechercher'
                                }}
                                onChange={ev => dispatch(Actions.setSearchText(ev))}


                            />
                        </Paper>
                        <Grid container spacing={2} className="">
                            {
                                secteurs.loading ?
                                    <>
                                        {
                                            generate(
                                                <Grid item sm={4} xs={12}>
                                                    <ContentLoader
                                                        speed={2}
                                                        width={300}
                                                        height={210}
                                                        viewBox="0 0 300 210"
                                                    >
                                                        <rect x="20" y="19" rx="0" ry="0" width="129" height="17" />
                                                        <rect x="14" y="45" rx="0" ry="0" width="223" height="60" />
                                                        <rect x="40" y="115" rx="0" ry="0" width="118" height="9" />
                                                        <circle cx="25" cy="119" r="9" />
                                                        <rect x="40" y="135" rx="0" ry="0" width="118" height="9" />
                                                        <circle cx="25" cy="139" r="9" />
                                                        <rect x="40" y="155" rx="0" ry="0" width="118" height="9" />
                                                        <circle cx="25" cy="159" r="9" />
                                                        <rect x="40" y="175" rx="0" ry="0" width="118" height="9" />
                                                        <circle cx="25" cy="179" r="9" />
                                                        <rect x="152" y="191" rx="0" ry="0" width="88" height="12" />
                                                    </ContentLoader>
                                                </Grid>
                                            )

                                        }
                                    </>
                                    :
                                    (


                                        filteredData && filteredData.map((item, index) => (
                                            <Grid item sm={4} xs={12} key={index}>
                                                <CardSecteur {...props} secteur={item} />
                                            </Grid>
                                        ))
                                    )
                            }

                        </Grid>
                    </Paper>
                </Grid>
                {/*  <Grid item xs={12} sm={4} className="sticky top-0">
                     <Paper className="w-full h-200 p-32 mt-16 text-center">
                        Ads
                    </Paper> 
                </Grid> 
                */}
            </Grid>
        </div >


    )
}

export default withReducer('parcourirSecteurs', reducer)(Secteurs);