import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@material-ui/core';
import { FuseUtils } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from './store/actions';
import { withStyles } from '@material-ui/core/styles';

function CategorieList(props) {
    const dispatch = useDispatch();
    const categories = useSelector(({ categoriesApp }) => categoriesApp.categories.entities);
    const pageCount = useSelector(({ categoriesApp }) => categoriesApp.categories.pageCount);
    const loading = useSelector(({ categoriesApp }) => categoriesApp.categories.loading);
    const parametres = useSelector(({ categoriesApp }) => categoriesApp.categories.parametres);
    const searchText = useSelector(({ categoriesApp }) => categoriesApp.categories.searchText);

    const [filteredData, setFilteredData] = useState(null);

    const HtmlTooltip = withStyles(theme => ({
        tooltip: {
            maxWidth: 240,
            fontSize: 12,
            backgroundColor: '#1C2434',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '8px 12px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        },
    }))(Tooltip);

    useEffect(() => {
        if (categories) {
            const arr = Object.values(categories);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [categories, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Gestion des Catégories"
            data={filteredData}
            loading={loading}
            pageCount={pageCount}
            page={parametres.page - 1}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onPageChange={(pageIndex) => {
                const newParams = { ...parametres, page: pageIndex + 1 };
                dispatch(Actions.setParametresData(newParams));
            }}
            onSortedChange={(newSorted) => {
                const newParams = { 
                    ...parametres, 
                    page: 1, 
                    filter: { 
                        id: newSorted[0].id === 'sousSecteur' ? 'sousSecteur.id' : newSorted[0].id, 
                        direction: newSorted[0].desc ? 'desc' : 'asc' 
                    } 
                };
                dispatch(Actions.setParametresData(newParams));
            }}
            onRowClick={(row) => dispatch(Actions.openEditCategoriesDialog(row))}
            columns={[
                {
                    Header: "Nom de la Catégorie",
                    accessor: "name",
                    Cell: row => (
                        <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                            {row.original.name}
                        </Typography>
                    ),
                    minWidth: 300
                },
                {
                    Header: "Activités Liées",
                    accessor: "sousSecteurs",
                    Cell: row => (
                        <HtmlTooltip
                            title={
                                <div className="flex flex-col gap-4">
                                    {Object.keys(row.original.sousSecteurs || {}).length === 0 ? (
                                        "Aucune activité"
                                    ) : (
                                        Object.values(row.original.sousSecteurs).map((s, i) => (
                                            <div key={i} className="flex items-center gap-6 text-11 font-500">
                                                <div className="w-4 h-4 rounded-full bg-white/30" /> {s.name}
                                            </div>
                                        ))
                                    )}
                                </div>
                            }
                        >
                            <div 
                                className="inline-flex px-12 py-4 rounded-6 bg-indigo-50 border border-indigo-100 text-12 font-700 text-indigo-600"
                                style={{ cursor: 'help' }}
                            >
                                {Object.keys(row.original.sousSecteurs || {}).length} Activités
                            </div>
                        </HtmlTooltip>
                    ),
                    width: 180
                },
                {
                    Header: "Actions",
                    width: 100,
                    sortable: false,
                    Cell: row => (
                        <div className="flex items-center gap-8">
                             <IconButton 
                                size="small" 
                                style={{ color: '#319795', backgroundColor: 'rgba(49, 151, 149, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(Actions.openEditCategoriesDialog(row.original));
                                }}
                            >
                                <Icon className="text-18">edit</Icon>
                            </IconButton>
                            <IconButton 
                                size="small" 
                                style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(Actions.openDialog({
                                        children: (
                                            <React.Fragment>
                                                <DialogTitle>Confirmation</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>Voulez-vous vraiment supprimer cette catégorie ? Cette action est irréversible.</DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
                                                    <Button 
                                                        variant="contained" 
                                                        style={{ backgroundColor: '#D34053', color: 'white' }}
                                                        onClick={() => {
                                                            dispatch(Actions.removeCategorie(row.original, parametres));
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
                                <Icon className="text-18">delete</Icon>
                            </IconButton>
                        </div>
                    ),
                }
            ]}
        />
    );
}

export default CategorieList;
