import React from 'react';
import { Avatar, Table, TableHead, TableCell, TableRow, Typography, TableBody, makeStyles, Chip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        }
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid #f1f5f9',
    },
    title: {
        fontSize: '1.05rem',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.01em',
    },
    badge: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 700,
        padding: '3px 12px',
        borderRadius: 20,
    },
    tableHead: {
        '& th': {
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '12px 16px',
            background: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
        }
    },
    tableRow: {
        transition: 'background 0.2s ease',
        '&:hover': {
            background: '#f8fafc',
        },
        '& td': {
            padding: '14px 16px',
            borderBottom: '1px solid #f8fafc',
            fontSize: '0.875rem',
            color: '#1e293b',
            fontWeight: 500,
        }
    },
    avatar: {
        width: 36,
        height: 36,
        border: '2px solid #f1f5f9',
    },
    nameCell: {
        fontWeight: 700,
        color: '#0f172a',
    }
}));

function Widget11(props) {
    const classes = useStyles();

    if (!props.widget) return null;

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography className={classes.title}>{props.widget.title}</Typography>
                <span className={classes.badge}>{props.widget.table.rows.length} Membres</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            {props.widget.table.columns.map(column => (
                                <TableCell key={column.id}>{column.title}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.widget.table.rows.map(row => (
                            <TableRow key={row.id} className={classes.tableRow}>
                                {row.cells.map(cell => {
                                    if (cell.id === 'avatar') {
                                        return (
                                            <TableCell key={cell.id} style={{ paddingLeft: 16, paddingRight: 8 }}>
                                                <Avatar src={cell.value} className={classes.avatar} />
                                            </TableCell>
                                        );
                                    }
                                    if (cell.id === 'name') {
                                        return (
                                            <TableCell key={cell.id} className={classes.nameCell}>{cell.value}</TableCell>
                                        );
                                    }
                                    return (
                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default React.memo(Widget11);
