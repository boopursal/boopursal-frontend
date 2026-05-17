import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {  Grid } from '@material-ui/core';
import DemandeDetail from './DemandeDetail';
import HeaderDetailDemande from './HeaderDetailDemande';
import { useDispatch } from 'react-redux';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';

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

}));

function DemandeAchat(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const params = props.match.params;
    const { id } = params;
    useEffect(() => {

        function updateDemandeState() {
            
            dispatch(Actions.getDemande(id));
            
        }

        updateDemandeState();

        return () => {
            dispatch(Actions.cleanUpDemande())
        }
    }, [dispatch, id]);


    return (
        <div className={clsx(classes.root, props.innerScroll && classes.innerScroll, 'min-h-md')}>
            <div
                className={clsx(classes.middle, "mb-0 relative overflow-hidden flex flex-col flex-shrink-0 ")}>
                <Grid container  className=" max-w-2xl mx-auto py-8  sm:px-16 items-center z-9999">
                    <Grid item sm={12} xs={12}>
                        <HeaderDetailDemande {...props} />
                    </Grid>
                </Grid>
            </div>
            <DemandeDetail {...props} />
        </div>


    )
}

export default withReducer('demandesAchat', reducer)(DemandeAchat);
