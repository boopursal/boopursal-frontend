import React, { useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import ConditionsTable from './ConditionsTable';
import ConditionsHeader from './ConditionsHeader';
import reducer from '../store/reducers';
import { useDispatch } from 'react-redux';
import * as Actions from '../store/actions';

function Conditions() {

    const dispatch = useDispatch();

    useEffect(() => {
            dispatch(Actions.getConditions());
    }, [dispatch]);

    return (
        <FusePageCarded
            classes={{
                content: "flex flex-col h-full",
            }}
            content={
                <ConditionsTable />
            }
            innerScroll
        />
    );
}

export default withReducer('conditionsApp', reducer)(Conditions);
