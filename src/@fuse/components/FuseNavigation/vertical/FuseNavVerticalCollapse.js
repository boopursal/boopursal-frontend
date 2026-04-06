import React, {useEffect, useState} from 'react';
import {Collapse, Icon, IconButton, ListItem, ListItemText} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {FuseUtils} from '@fuse';
import {withRouter} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import FuseNavVerticalGroup from './FuseNavVerticalGroup';
import FuseNavVerticalItem from './FuseNavVerticalItem';
import FuseNavBadge from './../FuseNavBadge';
import FuseNavVerticalLink from './FuseNavVerticalLink';

const useStyles = makeStyles(theme => ({
    root: {
        padding : 0,
    },
    item: {
        height: 48,
        width: 'calc(100% - 32px)',
        borderRadius: 8,
        padding: '12px 16px',
        margin: '4px 16px',
        transition: 'all 0.3s ease',
        color: '#475569 !important',
        fontFamily: 'Outfit, sans-serif',
        '&.active': {
            color: '#1C2434 !important',
            backgroundColor: '#F1F5F9',
        },
        '& .list-item-icon': {
            marginRight: 16,
            color: '#64748B',
            fontSize: 20
        },
        '& .list-item-text': {
            fontWeight: 500,
            fontSize: '0.925rem'
        }
    }
}));

function needsToBeOpened(location, item)
{
    return location && isUrlInChildren(item, location.pathname)
}

function isUrlInChildren(parent, url)
{
    if ( !parent.children )
    {
        return false;
    }

    for ( let i = 0; i < parent.children.length; i++ )
    {
        if ( parent.children[i].children )
        {
            if ( isUrlInChildren(parent.children[i], url) )
            {
                return true;
            }
        }

        if ( parent.children[i].url === url || url.includes(parent.children[i].url) )
        {
            return true;
        }
    }

    return false;
}

function FuseNavVerticalCollapse(props)
{
    const userRole = useSelector(({auth}) => auth.user.role);

    const classes = useStyles(props);
    const [open, setOpen] = useState(() => needsToBeOpened(props.location, props.item));
    const {item, nestedLevel, active} = props;

    useEffect(() => {
        if ( needsToBeOpened(props.location, props.item) )
        {
            setOpen(true);
        }
    }, [props.location, props.item]);

    function handleClick()
    {
        setOpen(!open);
    }

    if ( !FuseUtils.hasPermission(item.auth, userRole) )
    {
        return null;
    }

    return (
        <ul className={clsx(classes.root, open && "open")}>

            <ListItem
                button
                className={clsx(classes.item, 'list-item', active)}
                onClick={handleClick}
            >
                {item.icon && (
                    <Icon className="list-item-icon flex-shrink-0">{item.icon}</Icon>
                )}
                <ListItemText 
                    className="list-item-text" 
                    primary={item.title} 
                    classes={{primary: 'text-14 font-600'}}
                />
                <IconButton disableRipple className="w-16 h-16 p-0 text-slate-400">
                    <Icon className="text-16 arrow-icon" color="inherit">
                        {open ? 'expand_less' : 'expand_more'}
                    </Icon>
                </IconButton>
            </ListItem>

            {item.children && (
                <Collapse in={open} className="collapse-children">
                    {
                        item.children.map((item) => (

                            <React.Fragment key={item.id}>

                                {item.type === 'group' && (
                                    <FuseNavVerticalGroup item={item} nestedLevel={nestedLevel + 1} active={active}/>
                                )}

                                {item.type === 'collapse' && (
                                    <NavVerticalCollapse item={item} nestedLevel={nestedLevel + 1} active={active}/>
                                )}

                                {item.type === 'item' && (
                                    <FuseNavVerticalItem item={item} nestedLevel={nestedLevel + 1} active={active}/>
                                )}

                                {item.type === 'link' && (
                                    <FuseNavVerticalLink item={item} nestedLevel={nestedLevel + 1} active={active}/>
                                )}

                            </React.Fragment>
                        ))
                    }
                </Collapse>
            )}
        </ul>
    );
}

const NavVerticalCollapse = withRouter(React.memo(FuseNavVerticalCollapse));

export default NavVerticalCollapse;
