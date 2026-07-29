import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { useSelector } from 'react-redux';
//import MobileApp from 'app/fuse-layouts/shared-components/MobileApp';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

function FooterLayout1(props) {
    const footerTheme = useSelector(({ fuse }) => fuse.settings.footerTheme);
    const { t } = useTranslation();

    return (
        <ThemeProvider theme={footerTheme}>
            <AppBar id="fuse-footer" className="relative z-10" color="default">
                <Toolbar className="px-16 py-0 flex items-center">

                    <div className="flex flex-1">
                        <Typography variant="caption">
                            Copyright © {moment().format('YYYY')} 7e-Sky, {t('footer.copyright', 'Tous les droits sont réservés.')}
                    </Typography>
                    </div>

                    <div>
                        {/*<MobileApp/>*/}
                    </div>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default FooterLayout1;
