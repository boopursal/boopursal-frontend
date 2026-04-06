import React from 'react';
import { ListSubheader } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseUtils } from '@fuse';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FuseNavVerticalCollapse from './FuseNavVerticalCollapse';
import FuseNavVerticalItem from './FuseNavVerticalItem';
import FuseNavVerticalLink from './FuseNavVerticalLink';

const useStyles = makeStyles({
    item: {
        height: 64, // Taller for better sectioning
        width: '100%',
        paddingRight: 16,
        paddingTop: 24, // Added top padding for grouping
        fontFamily: 'Outfit, sans-serif',
        '& .list-subheader-text': {
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: '#8A99AF !important', // TailAdmin Light Gray
            fontSize: '0.75rem',
            textTransform: 'uppercase'
        }
    }
});

function FuseNavVerticalGroup(props) {
    const userRole = useSelector(({ auth }) => auth.user.role);

    const classes = useStyles(props);
    const { item, nestedLevel, active } = props;
    const listItemPadding = nestedLevel > 0 ? 'pl-48' : 'pl-16'; 

    if (!FuseUtils.hasPermission(item.auth, userRole)) {
        return null;
    }

    return (
        <React.Fragment>

            <ListSubheader disableSticky={true} className={clsx(classes.item, listItemPadding, "list-subheader flex items-center")}>
                <span className="list-subheader-text">
                    {item.title}
                </span>
            </ListSubheader>

            {item.children && (
                <React.Fragment>
                    {
                        item.children.map((item) => (

                            <React.Fragment key={item.id}>

                                {item.type === 'group' && (
                                    <NavVerticalGroup item={item} nestedLevel={nestedLevel} active={active} />
                                )}

                                {item.type === 'collapse' && (
                                    <FuseNavVerticalCollapse item={item} nestedLevel={nestedLevel} active={active} />
                                )}

                                {item.type === 'item' && (
                                    <FuseNavVerticalItem item={item} nestedLevel={nestedLevel} active={active} />
                                )}

                                {item.type === 'link' && (
                                    <FuseNavVerticalLink item={item} nestedLevel={nestedLevel} active={active} />
                                )}

                            </React.Fragment>
                        ))
                    }
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

const NavVerticalGroup = withRouter(React.memo(FuseNavVerticalGroup));

export default NavVerticalGroup;
