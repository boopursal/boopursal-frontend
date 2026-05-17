import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, Typography, Button, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Avatar } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import FuseUtils from '@fuse/FuseUtils';
import { makeStyles } from '@material-ui/styles';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';

const useStyles = makeStyles(theme => ({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: '#F1F5F9',
        color: '#64748B',
        fontWeight: 700,
        fontSize: '0.875rem'
    },
    buttonProgress: {
        color: '#D34053',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function ChildTable(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const childs = useSelector(({ childsFrsAdminApp }) => childsFrsAdminApp.childs.data);
    const loading = useSelector(({ childsFrsAdminApp }) => childsFrsAdminApp.childs.loading);
    const loadingEdit = useSelector(({ childsFrsAdminApp }) => childsFrsAdminApp.childs.loadingEdit);
    const user = useSelector(({ auth }) => auth.user);
    const searchText = useSelector(({ childsFrsAdminApp }) => childsFrsAdminApp.childs.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (childs) {
            const arr = Object.values(childs);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [childs, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Tentatives d'inscription Fournisseurs"
            data={filteredData}
            loading={loading}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            columns={[
                {
                    Header: "Identité",
                    accessor: "firstName",
                    Cell: row => (
                        <div className="flex items-center gap-12">
                            <Avatar className={classes.avatar}>
                                {row.original.firstName?.charAt(0) || 'U'}
                            </Avatar>
                            <div className="flex flex-col">
                                <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                                    {row.original.firstName} {row.original.lastName}
                                </Typography>
                                <Typography variant="caption" style={{ color: '#64748B' }}>
                                    {row.original.email}
                                </Typography>
                            </div>
                        </div>
                    ),
                    minWidth: 250
                },
                {
                    Header: "Téléphone",
                    accessor: "phone",
                    Cell: row => <Typography className="text-13" style={{ color: '#1C2434' }}>{row.original.phone || 'Non renseigné'}</Typography>,
                    width: 150
                },
                {
                    Header: "Date de création",
                    accessor: "created",
                    Cell: row => <Typography className="text-13" style={{ color: '#64748B' }}>{row.original.created ? moment(row.original.created).format('DD/MM/YYYY HH:mm') : 'N/A'}</Typography>,
                    width: 160
                },
                {
                    Header: "Actions",
                    sortable: false,
                    Cell: row => (
                        <div className="flex items-center gap-8">
                            <Tooltip title="Supprimer">
                                <IconButton 
                                    size="small"
                                    style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                                    disabled={loadingEdit}
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        dispatch(Actions.openDialog({
                                            children: (
                                                <React.Fragment>
                                                    <DialogTitle>Confirmation de suppression</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText>Voulez-vous vraiment supprimer définitivement cette tentative d'inscription ?</DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
                                                        <Button 
                                                            variant="contained" 
                                                            style={{ backgroundColor: '#D34053', color: 'white' }}
                                                            onClick={() => {
                                                                dispatch(Actions.removeTentative(row.original, user));
                                                                dispatch(Actions.closeDialog());
                                                            }}
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </DialogActions>
                                                </React.Fragment>
                                            )
                                        }));
                                    }}
                                >
                                    {loadingEdit ? <CircularProgress size={18} style={{ color: '#D34053' }} /> : <Icon className="text-18">delete</Icon>}
                                </IconButton>
                            </Tooltip>
                        </div>
                    ),
                    width: 100
                }
            ]}
        />
    );
}

export default withRouter(ChildTable);
