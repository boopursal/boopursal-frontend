import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Paper } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { FuseAnimate } from '@fuse';

function CondtionDetail(props) {
    const conditions = useSelector(({ conditionsApp }) => conditionsApp.conditions.data);
    const loading = useSelector(({ conditionsApp }) => conditionsApp.conditions.loading);
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

        loading ?
            'Chargement ...'
            :
            (!filteredData || filteredData.length === 0) ?
                (
                    <div className="flex items-center justify-center h-full">
                        <Typography color="textSecondary" variant="h5">
                            La page que vous recherchez n'existe pas sur Les Achats Industriels.
                        </Typography>
                    </div>
                ) :
                (
                    <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                        <Paper elevation={1} className="w-full rounded-8 px-16 py-16">
                            {
                                ReactHtmlParser(filteredData[0].contenu)
                            }
                        </Paper>
                    </FuseAnimate>
                )



    );
}

export default withRouter(CondtionDetail);
