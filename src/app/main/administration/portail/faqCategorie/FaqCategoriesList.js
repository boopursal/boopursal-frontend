import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Typography } from '@material-ui/core';
import { FuseUtils } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from './store/actions';

function FaqCategoriesList(props) {
    const dispatch = useDispatch();
    const categories = useSelector(({ faqCategorieApp }) => faqCategorieApp.faqCategories.entities);
    const loading = useSelector(({ faqCategorieApp }) => faqCategorieApp.faqCategories.loading);
    const searchText = useSelector(({ faqCategorieApp }) => faqCategorieApp.faqCategories.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (categories) {
            const arr = Object.values(categories);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [categories, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Catégories de FAQ"
            data={filteredData}
            loading={loading}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onRowClick={(row) => dispatch(Actions.openEditFaqCategorieDialog(row))}
            columns={[
                {
                    Header: "Nom de la Catégorie",
                    accessor: "name",
                    Cell: row => (
                        <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                            {row.original.name}
                        </Typography>
                    ),
                    minWidth: 400
                },
                {
                    Header: "Actions",
                    sortable: false,
                    Cell: row => (
                        <div className="flex items-center gap-8">
                            <IconButton 
                                size="small" 
                                style={{ color: '#3C50E0', backgroundColor: 'rgba(60, 80, 224, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(Actions.openEditFaqCategorieDialog(row.original));
                                }}
                            >
                                <Icon className="text-18">edit</Icon>
                            </IconButton>
                            <IconButton 
                                size="small" 
                                style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(Actions.removeCategorie(row.original));
                                }}
                            >
                                <Icon className="text-18">delete</Icon>
                            </IconButton>
                        </div>
                    ),
                    width: 100
                }
            ]}
        />
    );
}

export default FaqCategoriesList;
