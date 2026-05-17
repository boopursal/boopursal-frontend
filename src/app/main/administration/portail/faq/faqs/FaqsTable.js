import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import FuseUtils from '@fuse/FuseUtils';
import _ from '@lodash';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

function FaqsTable(props) {
    const dispatch = useDispatch();
    const faqs = useSelector(({ faqsApp }) => faqsApp.faqs.entities);
    const loading = useSelector(({ faqsApp }) => faqsApp.faqs.loading);
    const searchText = useSelector(({ faqsApp }) => faqsApp.faqs.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (faqs) {
            const arr = Object.keys(faqs).map((id) => faqs[id]);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [faqs, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Base de Connaissances"
            data={filteredData}
            loading={loading}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onRowClick={(row) => props.history.push('/admin/faqs/' + row.id)}
            columns={[
                {
                    Header: "ID",
                    accessor: "id",
                    Cell: row => (
                        <div className="px-8 py-2 rounded-4 bg-slate-50 border border-slate-100 font-700 text-11 text-slate-400">
                           #{row.original.id}
                        </div>
                    ),
                    width: 80
                },
                {
                    Header: "Question & Réponse",
                    accessor: "question",
                    Cell: (row) => (
                        <div className="flex flex-col py-8">
                            <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>{row.original.question}</Typography>
                            <Typography className="mt-4 text-13 font-500" style={{ color: '#64748B' }}>
                                {_.truncate(row.original.reponse, { length: 140 })}
                            </Typography>
                        </div>
                    ),
                    minWidth: 450
                },
                {
                    Header: "Actions",
                    sortable: false,
                    Cell: (row) => (
                        <div className="flex items-center gap-8">
                            <IconButton 
                                size="small" 
                                style={{ color: '#3C50E0', backgroundColor: 'rgba(60, 80, 224, 0.05)' }}
                            >
                                <Icon className="text-18">edit</Icon>
                            </IconButton>
                            <IconButton 
                                size="small" 
                                style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(Actions.removeFaq(row.original));
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

export default withRouter(FaqsTable);
