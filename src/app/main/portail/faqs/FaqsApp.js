import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import FaqDetail from './FaqDetail';
import HeaderFaq from './HeaderFaq';
import { useDispatch } from 'react-redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import { Helmet } from "react-helmet";

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
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    header: {
        color: theme.palette.getContrastText(theme.palette.primary.main),
        position: 'relative',
        marginBottom: theme.spacing(4),
        backgroundColor: theme.palette.primary.main,
        backgroundImage: 'url(https://source.unsplash.com/collection/9804105)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },

}));

function FaqsApp(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(Actions.getFaqs());
    }, [dispatch]);


    return (
        <div className={clsx(classes.root, props.innerScroll && classes.innerScroll, 'min-h-md')}>
            <Helmet>
                <title>FAQ | Boopursal</title>
                <meta name="description" content='Questions fréquemment posées ' />
                <meta property="og:title" content="FAQ | Boopursal" />
                <meta property="og:description" content='' />
            </Helmet>
            <div
                className={clsx(classes.middle, "mb-0 relative overflow-hidden flex flex-col flex-shrink-0 ")}>
                <Grid container className=" max-w-2xl mx-auto py-8  sm:px-16 items-center z-9999">
                    <Grid item sm={12} xs={12}>
                        <HeaderFaq {...props} />
                    </Grid>
                </Grid>
            </div>
            <div
                className={clsx(classes.header, "relative flex flex-col flex-shrink-0 items-center justify-center text-center p-16 sm:p-24 h-128 sm:h-224")}>
                <div className={classes.overlay} />
                <Typography variant="h1" component="h1" className="text-18 sm:text-24 z-9999 uppercase  font-bold mb-16 uppercase  mx-auto max-w-xl">
                    FAQ | Comment pouvons-nous vous aider ?
                </Typography>
            </div>
            <FaqDetail {...props} />
        </div>


    )
}

export default withReducer('faqsApp', reducer)(FaqsApp);
