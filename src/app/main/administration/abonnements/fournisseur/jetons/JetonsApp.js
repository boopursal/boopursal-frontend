import React, {useEffect, useRef} from 'react';
import {FusePageSimple} from '@fuse';
import {useDispatch,useSelector} from 'react-redux';
import withReducer from 'app/store/withReducer';
import JetonsList from './JetonsList';
import JetonsHeader from './JetonsHeader';
import JetonsDialog from './JetonsDialog';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { Helmet } from "react-helmet";


function JetonsApp(props)
{
    const dispatch = useDispatch();
    const pageLayout = useRef(null);
    const parametres = useSelector(({jetonsApp}) => jetonsApp.jetons.parametres);
    const paiements = useSelector(({ jetonsApp }) => jetonsApp.jetons.paiements);

    useEffect(() => {
        
        dispatch(Actions.getJetons(parametres));
        if(!paiements)
        dispatch(Actions.getPaiements());
        
        
    }, [dispatch,parametres]);

    return (
        <React.Fragment>
            <Helmet>
                <title>Jetons | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageSimple
                classes={{
                    contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
                    content       : "flex flex-col h-full",
                    leftSidebar   : "w-256 border-0",
                }}
                content={
                    <JetonsList/>
                }
                sidebarInner
                ref={pageLayout}
                innerScroll
            />
            
            <JetonsDialog/>
        </React.Fragment>
    )
}

export default withReducer('jetonsApp', reducer)(JetonsApp);
