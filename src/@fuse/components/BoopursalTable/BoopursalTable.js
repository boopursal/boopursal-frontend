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
    tableWrapper: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        }
    },
    tableHeader: {
        padding: '28px 32px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        backgroundColor: '#FFFFFF',
        [theme.breakpoints.down('xs')]: {
            padding: '20px 16px',
        }
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#1C2434',
        letterSpacing: '-0.02em',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        '&::before': {
            content: '""',
            width: 4,
            height: 24,
            backgroundColor: '#3C50E0',
            borderRadius: 4,
        }
    },
    searchField: {
        backgroundColor: '#F7F9FC',
        borderRadius: 8,
        padding: '10px 16px',
        width: 340,
        border: '1px solid #E2E8F0',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
        '&:focus-within': {
            backgroundColor: '#FFFFFF',
            borderColor: '#3C50E0',
            boxShadow: '0 0 0 3px rgba(60, 80, 224, 0.1)',
            width: 380,
            [theme.breakpoints.down('xs')]: {
                width: '100%',
            }
        }
    },
    tableContent: {
        '& .rt-table': {
            overflowX: 'auto',
            borderCollapse: 'collapse',
        },
        '& .rt-thead': {
            backgroundColor: '#F9FAFB',
            borderBottom: '1px solid #E2E8F0 !important',
            position: 'sticky',
            top: 0,
            zIndex: 10,
        },
        '& .rt-th': {
            padding: '16px 32px !important',
            fontSize: '0.8125rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#64748B',
            textAlign: 'left',
            borderRight: '0 !important',
            '&:focus': {
                outline: 'none'
            }
        },
        '& .rt-tr-group': {
            borderBottom: '1px solid #F1F5F9 !important',
            transition: 'background-color 0.2s ease',
        },
        '& .rt-tr': {
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease',
            }
        },
        '& .rt-tr:hover': {
            backgroundColor: '#F7F9FC !important',
            '&::after': {
                backgroundColor: '#3C50E0',
            }
        },
        '& .rt-td': {
            padding: '20px 32px !important',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            color: '#1C2434',
            display: 'flex',
            alignItems: 'center',
            borderRight: '0 !important',
        },
        '& .-pagination': {
            boxShadow: 'none !important',
            borderTop: '1px solid #E2E8F0 !important',
            padding: '20px 32px !important',
            backgroundColor: '#FFFFFF',
            '& .-btn': {
                height: 40,
                backgroundColor: '#ffffff !important',
                border: '1px solid #E2E8F0 !important',
                borderRadius: '6px !important',
                fontWeight: 600,
                color: '#64748B !important',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:not([disabled]):hover': {
                    backgroundColor: '#3C50E0 !important',
                    color: '#FFFFFF !important',
                    borderColor: '#3C50E0 !important',
                }
            }
        }
    }
}));

function BoopursalTable(props) {
    const classes = useStyles();
    const {
        title,
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
                <div className={classes.tableWrapper}>
                    <div className={classes.tableHeader}>
                        <div className="flex items-center">
                            <Typography className={classes.title}>{title}</Typography>
                        </div>

                        <div className={classes.searchField}>
                            <Icon className="text-20 text-slate-400">search</Icon>
                            <input
                                placeholder="Rechercher dans les enregistrements..."
                                value={searchText || ""}
                                onChange={(ev) => onSearchChange && onSearchChange(ev)}
                                className="flex-1 bg-transparent border-none outline-none font-medium text-14 text-slate-700 placeholder-slate-400"
                            />
                        </div>
                    </div>

                    <div className={classes.tableContent}>
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
                            loadingText="Mise à jour des données..."
                        />
                    </div>
                </div>
            </FuseAnimate>
        </div>
    );
}

export default BoopursalTable;
