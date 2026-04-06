const settingsConfig = {
    layout: {
        style: 'layout1', // layout-1 layout-2 layout-3
        config: {
            defaults: {
                mode: 'fullwidth',
                scroll: 'content',
                toolbar: {
                    display: true,
                    style: 'fixed',
                    position: 'above'
                },
                navbar: {
                    display: true,
                    folded: false,
                    position: 'left'
                }
            }
        } 
    },
    customScrollbars: true,
    theme: {
        main: 'tailadminLight',
        navbar: 'tailadmin',
        toolbar: 'tailadminLight',
        footer: 'tailadmin'
    }
};

export default settingsConfig;
