import React from 'react';
import { Icon, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { NavLinkAdapter, FuseUtils } from '@fuse';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/store/actions';
import FuseNavBadge from './../FuseNavBadge';

const useStyles = makeStyles(theme => ({
    item: {
        height: 48,
        width: 'calc(100% - 32px)', // More balanced width
        borderRadius: 8,
        padding: '12px 16px',
        margin: '4px 16px', // Compact grouping
        fontFamily: 'Outfit, sans-serif',
        transition: 'all 0.3s ease',
        color: '#475569 !important', // TailAdmin Slate-600
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: '#F1F5F9', // TailAdmin Slate-100
            color: '#1C2434 !important',
        },
        '&.active': {
            backgroundColor: '#F1F5F9 !important', 
            color: '#1C2434 !important',
            '& .list-item-text-primary': {
                color: '#1C2434 !important',
                fontWeight: 600
            },
            '& .list-item-icon': {
                color: '#3C50E0 !important', // Primary Blue for active icon
            }
        },
        '& .list-item-icon': {
            transition: 'all 0.3s',
            fontSize: 20,
            marginRight: 16,
            color: '#64748B' // Default icon color
        },
        '& .list-item-text-primary': {
            fontSize: '0.925rem',
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: 'inherit'
        }
    }
}));

function FuseNavVerticalItem(props) {
    const dispatch = useDispatch();
    const userRole = useSelector(({ auth }) => auth.user.role);

    const classes = useStyles(props);
    const { item, nestedLevel, active } = props;
    const listItemPadding = nestedLevel > 0 ? 'pl-48' : 'pl-16'; // Adjusted for better alignment

    return (
        <ListItem
            button
            component={NavLinkAdapter}
            to={item.url}
            activeClassName="active"
            className={clsx(classes.item, listItemPadding, 'list-item', active, `nav-item-${item.id}`)}
            onClick={ev => dispatch(Actions.navbarCloseMobile())}
            exact={item.exact}
        >
            {item.icon && (
                <Icon className="list-item-icon flex-shrink-0">{item.icon}</Icon>
            )}
            <ListItemText className="list-item-text" primary={item.title} classes={{ primary: 'list-item-text-primary' }} />
            {item.badge && (
                <FuseNavBadge badge={item.badge} />
            )}
        </ListItem>
    );
}

const NavVerticalItem = withRouter(React.memo(FuseNavVerticalItem));

export default NavVerticalItem;
