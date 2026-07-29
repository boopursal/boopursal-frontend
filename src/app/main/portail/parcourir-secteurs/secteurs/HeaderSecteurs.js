import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import _ from '@lodash';
import { Button, Icon } from '@material-ui/core';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

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
    }
}));

function HeaderSecteurs(props) {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className="flex items-center">
            <Button variant="outlined" size="small" color="secondary" onClick={() => props.history.goBack()} className={clsx(classes.btn, "mr-8")}>
                <Icon>chevron_left</Icon> <span className="transition ease-in-out duration-700 ">{t('common.back', 'Retour')}</span>
            </Button>
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>

                <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} className={classes.breadcrumbs}>
                    <Link color="inherit" to="/" className={classes.link}>
                        <HomeIcon className={classes.icon} />
                        {t('common.home', 'Accueil')}
                    </Link>

                    <span className="text-white">
                        {t('secteurs.all_sectors', 'Tous les secteurs d\'activités')}
                    </span>


                </Breadcrumbs>

            </FuseAnimate>
        </div>

    )
}

export default HeaderSecteurs;
