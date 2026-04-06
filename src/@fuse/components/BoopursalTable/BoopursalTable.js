import React from 'react';
import { Icon, TextField, Typography, Paper, Box, IconButton, Tooltip } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import ReactTable from "react-table";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import moment from 'moment';
import _ from '@lodash';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    tableHeader: {
        backgroundColor: '#ffffff',
        padding: '24px 32px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        borderRadius: '24px 24px 0 0'
    },
    searchField: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: '8px 16px',
        width: 320,
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        '&:focus-within': {
            backgroundColor: '#ffffff',
            borderColor: '#2563eb',
            boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.05)'
        }
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 950,
        color: '#0f172a',
        letterSpacing: '-0.02em'
    }
}));

/**
 * BoopursalTable - LE COMPOSANT STANDARD ELITE
 * Unifie la recherche, le style et l'interactivité des tableaux.
 */
function BoopursalTable(props) {
    const classes = useStyles();
    const {
        title,
        icon,
        data,
        columns,
        loading,
        pageCount,
        page,
        onPageChange,
        onSortedChange,
        onFilteredChange,
        searchText,
        onSearchChange,
        noDataText = "Aucune donnée à afficher",
        onRowClick
    } = props;

    return (
        <div className={classes.root}>
            <FuseAnimate animation="transition.slideUpIn" delay={300}>
                <div className="shadow-sm border border-slate-100 rounded-24 overflow-hidden bg-white">
                    {/* STANDARD ELITE HEADER */}
                    <div className={classes.tableHeader}>
                        <div className="flex items-center gap-16">
                            {icon && <Icon className="text-24 text-blue-600">{icon}</Icon>}
                            <Typography className={classes.title}>{title}</Typography>
                        </div>

                        <div className={classes.searchField}>
                            <Icon className="text-18 text-slate-400">search</Icon>
                            <TextField
                                placeholder="Rechercher..."
                                value={searchText || ""}
                                onChange={(ev) => onSearchChange && onSearchChange(ev)}
                                className="flex-1"
                                InputProps={{
                                    disableUnderline: true,
                                    style: { fontWeight: 700, fontSize: '0.85rem', color: '#334155' }
                                }}
                            />
                        </div>
                    </div>

                    {/* CORE REACT TABLE WITH GLOBAL ELITE STYLES */}
                    <ReactTable
                        className="-no-border"
                        getTrProps={(state, rowInfo) => ({
                            className: "cursor-pointer",
                            onClick: () => rowInfo && onRowClick && onRowClick(rowInfo.original)
                        })}
                        data={data}
                        columns={columns}
                        manual={!!pageCount}
                        pages={pageCount}
                        page={page}
                        defaultPageSize={10}
                        loading={loading}
                        showPageSizeOptions={false}
                        onPageChange={onPageChange}
                        onSortedChange={onSortedChange}
                        onFilteredChange={onFilteredChange}
                        noDataText={noDataText}
                        loadingText="Chargement..."
                    />
                </div>
            </FuseAnimate>
        </div>
    );
}

export default BoopursalTable;
