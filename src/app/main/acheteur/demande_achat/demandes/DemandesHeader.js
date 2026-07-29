import React from 'react';
import { Button, Icon, Typography} from '@material-ui/core';
import {FuseAnimate} from '@fuse';
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function DemandesHeader(props)
{
  const { t } = useTranslation();
    return (
        <div className="flex flex-1 w-full items-center justify-between">

            <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                    <Icon className="text-32 mr-0 sm:mr-12">inbox</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="hidden sm:flex" variant="h6">{t('demandes.header.title', "Vos demandes d'achats")}</Typography>
                </FuseAnimate>
            </div>

            <div className="flex flex-1 items-center justify-center px-12">

               
            </div>
            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button component={Link} to="/demandes/new" className="whitespace-no-wrap" variant="contained">
                    <span className="hidden sm:flex">{t('demandes.header.add', 'Ajouter nouvelle demande')}</span>
                    <span className="flex sm:hidden">{t('demandes.header.new', 'New')}</span>
                </Button>
            </FuseAnimate>
        </div>
    );
}

export default DemandesHeader;
