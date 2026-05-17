import React from 'react';
import FournisseurListItem from './FournisseurListItem';
import HeaderContentList from './HeaderContentList';
import { withRouter } from 'react-router-dom';

function ContentList(props) {

    return (
        <div className="flex flex-col">
            <HeaderContentList props />
            <FournisseurListItem {...props} />
        </div>
    );
}

export default withRouter(ContentList);
