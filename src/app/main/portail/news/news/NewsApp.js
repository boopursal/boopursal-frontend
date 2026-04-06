import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { makeStyles } from '@material-ui/styles';
import {
    Typography,
    Grid,
    Breadcrumbs,
    Button,
    Icon,
    Select,
    IconButton,
    TextField,
    Paper
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { FuseAnimate } from '@fuse';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import reducer from '../store/reducers';
import withReducer from 'app/store/withReducer';
import HomeIcon from '@material-ui/icons/Home';
import * as Actions from '../store/actions';
import News from './News';
import ContentLoader from "react-content-loader";

function generate(element) {
    return Array.from({ length: 10 }).map((_, value) =>
        React.cloneElement(element, { key: value })
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        flex: '1 0 auto',
        height: 'auto',
        backgroundColor: theme.palette.background.default
    },
    middle: {
        background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        position: 'relative',
        marginBottom: theme.spacing(4),
    },
    breadcrumbs: {
        fontSize: 11,
    },
    link: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
    btn: {
        fontSize: 11,
        padding: '0px 8px'
    },
    margin: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    }
}));

function NewsApp(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const news = useSelector(({ newsApp }) => newsApp.news);
    const query = new URLSearchParams(props.location.search);
    const q = query.get('q');

    useEffect(() => {
        if (q && news.parametres.titre !== q) {
            dispatch(Actions.setParametresData({
                ...news.parametres,
                titre: q
            }));
        }
    }, [dispatch, q, news.parametres]);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(Actions.getActualites(news.parametres));
        }, 500);
        return () => clearTimeout(timer);
    }, [dispatch, news.parametres]);

    const scrollToTopIfExists = () => {
        const el = document.querySelector('.st');
        if (el) el.scrollTop = 0;
    };

    const handlePreviousClick = () => {
        dispatch(Actions.setParametresData({
            ...news.parametres,
            page: Math.max(news.parametres.page - 1, 1)
        }));
        scrollToTopIfExists();
    };

    const handleNextClick = () => {
        dispatch(Actions.setParametresData({
            ...news.parametres,
            page: Math.min(news.parametres.page + 1, news.pageCount)
        }));
        scrollToTopIfExists();
    };

    const handleChangeItems = (ev) => {
        dispatch(Actions.setParametresData({
            ...news.parametres,
            page: 1,
            itemsPerPage: ev.target.value
        }));
        scrollToTopIfExists();
    };

    const handleTitreChange = (ev) => {
        dispatch(Actions.setParametresData({
            ...news.parametres,
            page: 1,
            titre: ev.target.value
        }));
        scrollToTopIfExists();
    };

    return (
        <div className={clsx(classes.root, props.innerScroll && classes.innerScroll, 'min-h-md')}>
            <Helmet>
                <title>Toutes l'Actualité | Boopursal</title>
                <meta name="description" content='' />
            </Helmet>

            <div className={clsx(classes.middle, 'mb-0 relative overflow-hidden flex flex-col flex-shrink-0')}>
                <Grid container spacing={2} className="max-w-2xl mx-auto py-8 sm:px-16 items-center z-9999">
                    <Grid item xs={12}>
                        <div className="flex items-center">
                            <Button
                                variant="outlined"
                                size="small"
                                color="secondary"
                                onClick={() => props.history.goBack()}
                                className={clsx(classes.btn, 'mr-8')}
                            >
                                <Icon>chevron_left</Icon><span>Retour</span>
                            </Button>
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} className={classes.breadcrumbs} aria-label="breadcrumb">
                                    <Link color="inherit" to="/" className={classes.link}>
                                        <HomeIcon className={classes.icon} />
                                        Accueil
                                    </Link>
                                    <span className="text-white">Toute l'actualité</span>
                                </Breadcrumbs>
                            </FuseAnimate>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <Grid container spacing={2} className="max-w-2xl mx-auto sm:px-16 pt-24 items-center">
                <Grid item xs={12} sm={8}>
                    <Typography variant="h1" className="text-24 font-bold uppercase">Boopursal | Actualités</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Rechercher"
                        placeholder="Entrer un mot clé..."
                        className="flex w-full mb-16 sm:mb-0"
                        value={news.parametres.titre}
                        inputProps={{ 'aria-label': 'Search' }}
                        onChange={handleTitreChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className="max-w-2xl mx-auto py-24 sm:px-16 items-start">
                {news.loading ? (
                    generate(
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <ContentLoader speed={2} width="100%" height={250} viewBox="0 0 400 250">
                                <rect x="0" y="0" rx="10" ry="10" width="100%" height="160" />
                                <rect x="0" y="170" rx="4" ry="4" width="80%" height="16" />
                            </ContentLoader>
                        </Grid>
                    )
                ) : (
                    news.data && news.data.map((item, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                            <News news={item} />
                        </Grid>
                    ))
                )}

                {news.data && news.data.length === 0 && !news.loading && (
                    <Grid item xs={12}>
                        <Paper className="p-32 w-full my-16 text-center flex flex-col items-center justify-center min-h-md">
                            <Icon className="text-64 mb-16" color="action">article_off</Icon>
                            <Typography variant="h5" className="mb-16 font-bold text-blue-900" >
                                Aucune actualité trouvée
                            </Typography>
                            <Typography variant="body1" className="mb-32 text-gray-600 max-w-sm mx-auto">
                                Désolé, nous n'avons trouvé aucune actualité correspondant à votre recherche "<strong>{q}</strong>".
                            </Typography>
                        </Paper>
                    </Grid>
                )}

                {news.data && news.data.length > 0 && (
                    <Grid container spacing={2} className="justify-between mt-16">
                        <Grid item xs={12} md={6}>
                            Montrer:&ensp;
                            <Select
                                className="text-13"
                                native
                                value={news.parametres.itemsPerPage}
                                onChange={handleChangeItems}
                                inputProps={{ name: 'ItemsPerPage' }}
                            >
                                <option value='10'>10</option>
                                <option value='50'>50</option>
                                <option value='100'>100</option>
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={6} className="text-right">
                            <IconButton aria-label="Previous" disabled={news.parametres.page === 1} onClick={handlePreviousClick}>
                                <Icon>arrow_back</Icon>
                            </IconButton>
                            {news.parametres.page} / {news.pageCount}
                            <IconButton aria-label="Next" disabled={news.parametres.page === news.pageCount} onClick={handleNextClick}>
                                <Icon>arrow_forward</Icon>
                            </IconButton>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </div>
    );
}

export default withReducer('newsApp', reducer)(NewsApp);
