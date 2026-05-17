import React, {useEffect, useRef} from 'react';
import {FusePageSimple} from '@fuse';
import {useDispatch} from 'react-redux';
import withReducer from 'app/store/withReducer';
import ZonesList from './ZonesList';
import ZonesHeader from './ZonesHeader';
import ZonesDialog from './ZonesDialog';
import * as Actions from './store/actions';
import reducer from './store/reducers';


function ZonesApp(props)
{
    const dispatch = useDispatch();

    const pageLayout = useRef(null);

    useEffect(() => {
        dispatch(Actions.getZones());
        dispatch(Actions.getPays());
        
    }, [dispatch]);

    return (
        <React.Fragment>
            <FusePageSimple
                classes={{
                    contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
                    content       : "flex flex-col h-full",
                    leftSidebar   : "w-256 border-0",
                }}
                content={
                    <ZonesList/>
                }
                sidebarInner
                ref={pageLayout}
                innerScroll
            />
            
            <ZonesDialog/>
        </React.Fragment>
    )
}

export default withReducer('zonesApp', reducer)(ZonesApp);
