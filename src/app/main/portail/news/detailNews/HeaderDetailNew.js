import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import _ from '@lodash';
import { Button, Icon } from '@material-ui/core';
import clsx from 'clsx';

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
    btn:{
        fontSize:11,
        padding : '0px 8px'
    }
}));

function HeaderDetailNew(props) {
    const classes = useStyles();
    const actualite = useSelector(({ newsApp }) => newsApp.actualite);

    return (
        actualite.data && (
            <div className="flex items-center">
                <Button variant="outlined" size="small" color="secondary" onClick={()=>props.history.goBack()} className={clsx(classes.btn,"mr-8")}>
                    <Icon>chevron_left</Icon> <span className="transition ease-in-out duration-700 ">Retour</span> 
                 </Button>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>

                    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} className={classes.breadcrumbs}>
                        <Link color="inherit" to="/" className={classes.link}>
                            <HomeIcon className={classes.icon} />
                            Accueil
                    </Link>

                        {
                            actualite.data.titre &&
                            <span className="text-white">
                                {_.capitalize(actualite.data.titre)}
                            </span>

                        }

                    </Breadcrumbs>

                </FuseAnimate>
            </div>)



    )
}

export default HeaderDetailNew;
