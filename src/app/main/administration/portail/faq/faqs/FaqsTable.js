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

const useStyles = makeStyles(theme => ({
    faqQuestion: {
        fontWeight: 950,
        color: '#0f172a',
        fontSize: '0.9rem'
    },
    faqAnswer: {
        fontSize: '0.8rem',
        color: '#64748b',
        fontWeight: 500
    }
}));

function FaqsTable(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const faqs = useSelector(({ faqsApp }) => faqsApp.faqs.data);
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
            title="Base de Connaissance & FAQ"
            icon="help_center"
            data={filteredData}
            loading={loading}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setFaqsSearchText(ev))}
            onRowClick={(row) => props.history.push('/portail/faqs/' + row.id)}
            columns={[
                {
                    Header: "Identifiant",
                    accessor: "id",
                    Cell: row => <Typography className="font-800 text-slate-300">#{row.original.id}</Typography>,
                    width: 100
                },
                {
                    Header: "Question posée & Réponse",
                    accessor: "question",
                    Cell: (row) => (
                        <div className="flex flex-col py-8">
                            <Typography className={classes.faqQuestion}>{row.original.question}</Typography>
                            <Typography className={clsx(classes.faqAnswer, "mt-4")}>
                                {_.truncate(row.original.reponse, { length: 120 })}
                            </Typography>
                        </div>
                    ),
                    minWidth: 400
                },
                {
                    Header: "Actions",
                    sortable: false,
                    Cell: (row) => (
                        <div className="flex items-center gap-8">
                            <Tooltip title="Modifier">
                                <IconButton size="small" className="text-slate-400 hover:text-blue-600">
                                    <Icon className="text-18">edit</Icon>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                                <IconButton size="small" className="text-slate-400 hover:text-red-600" onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(Actions.removeFaq(row.original));
                                }}>
                                    <Icon className="text-18">delete</Icon>
                                </IconButton>
                            </Tooltip>
                        </div>
                    ),
                    width: 120
                }
            ]}
        />
    );
}

export default withRouter(FaqsTable);
