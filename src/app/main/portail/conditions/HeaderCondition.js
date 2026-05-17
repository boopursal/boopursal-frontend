import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Button, Icon, IconButton, Hidden } from '@material-ui/core';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
    layoutRoot: {},
    breadcrumbs: {
        fontSize: 11,
    },
    link: {
        display: 'flex',
        'align-items': 'center',
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
    btn: {
        fontSize: 11,
        padding: '0px 8px'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    header: {
        backgroundColor: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        color: theme.palette.getContrastText(theme.palette.primary.main),
        position: 'relative',
        marginBottom: theme.spacing(4),
        backgroundImage: 'url(https://source.unsplash.com/collection/9804105)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },

}));

function HeaderCondition(props) {
    const classes = useStyles();
    const conditions = useSelector(({ conditionsApp }) => conditionsApp.conditions.data);
    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function filterData() {
            const { params } = props.match;
            const { slug } = params;

            let data = Object.keys(conditions).map((id) => conditions[id]);
            if (!slug) {
                data = data.filter((conditions) => conditions.slug === 'conditions-generales');
            }
            else {
                data = data.filter((note) => note.slug === slug);
            }
            return data;
        }

        if (conditions.length > 0) {
            setFilteredData(filterData())
        }

    }, [conditions, props.match]);
    return (
        <div className="flex items-center py-8  sm:px-16">
            <Hidden lgUp>
                <IconButton
                    onClick={(ev) => props.pageLayout.current.toggleLeftSidebar()}
                    aria-label="open left sidebar"
                >
                    <Icon>menu</Icon>
                </IconButton>
            </Hidden>
            <Button variant="outlined" size="small" color="secondary" onClick={() => props.history.goBack()} className={clsx(classes.btn, "mr-8")}>
                <Icon>chevron_left</Icon> <span className="transition ease-in-out duration-700 ">Retour</span>
            </Button>
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>

                <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} className={classes.breadcrumbs}>
                    <Link color="inherit" to="/" className={classes.link}>
                        <HomeIcon className={classes.icon} />
                        Accueil
                    </Link>

                    <span className="text-white">
                        {filteredData && (filteredData.length > 0 && filteredData[0].titre)}
                    </span>

                </Breadcrumbs>

            </FuseAnimate>
        </div>


    )
}

export default withRouter(HeaderCondition);
