import React, {useEffect, useState} from 'react';
import { Icon, IconButton, Typography, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core';
import {FuseUtils, FuseAnimate} from '@fuse';
import {useDispatch, useSelector} from 'react-redux';
import { withStyles  } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip'
import ReactTable from "react-table";
import * as Actions from './store/actions';
//import SecteursMultiSelectMenu from './SecteursMultiSelectMenu';
import _ from '@lodash';
function SecteursList(props)
{
    const dispatch = useDispatch();
    const Secteurs = useSelector(({secteursApp}) => secteursApp.secteurs.entities);
    //const selectedSecteursIds = useSelector(({secteursApp}) => secteursApp.secteurs.selectedSecteursIds);
    const searchText = useSelector(({secteursApp}) => secteursApp.secteurs.searchText);
    const HtmlTooltip = withStyles(theme => ({
        tooltip: {
          maxWidth: 220,
          fontSize: theme.typography.pxToRem(12),
          border: '1px solid #dadde9',
          '& b': {
            fontWeight: theme.typography.fontWeightMedium,
          },
        },
      }))(Tooltip);
    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function getFilteredArray(entities, searchText)
        {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if ( searchText.length === 0 )
            {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if ( Secteurs )
        {
            setFilteredData(getFilteredArray(Secteurs, searchText));
        }
    }, [Secteurs, searchText]);

  
    if ( !filteredData )
    {
        return null;
    }

    if ( filteredData.length === 0 )
    {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Typography color="textSecondary" variant="h5">
                    Il n'y a pas de Secteurs!
                </Typography>
            </div>
        );
    }

    return (
        
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            
            <ReactTable
                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                getTrProps={(state, rowInfo, column) => {
                    return {
                        className: "cursor-pointer",
                        onClick  : (e, handleOriginal) => {
                            if ( rowInfo )
                            {
                                dispatch(Actions.openEditSecteursDialog(rowInfo.original));
                            }
                        }
                    }
                }}
                data={filteredData}
                columns={[
                   /* {
                        Header   : () => (
                            <Checkbox
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                                onChange={(event) => {
                                    event.target.checked ? dispatch(Actions.selectAllSecteurs()) : dispatch(Actions.deSelectAllSecteurs());
                                }}
                                checked={selectedSecteursIds.length === Object.keys(Secteurs).length && selectedSecteursIds.length > 0}
                                indeterminate={selectedSecteursIds.length !== Object.keys(Secteurs).length && selectedSecteursIds.length > 0}
                            />
                        ),
                        accessor : "",
                        Cell     : row => {
                            return (<Checkbox
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                    checked={selectedSecteursIds.includes(row.value.id)}
                                    onChange={() => dispatch(Actions.toggleInSelectedSecteurs(row.value.id))}
                                />
                            )
                        },
                        className: "justify-center",
                        sortable : false,
                        width    : 64
                    },
                    {
                        Header   : () => (
                            selectedSecteursIds.length > 0 && (
                                <SecteursMultiSelectMenu/>
                            )
                        ),
                        width    : 40,
                        accessor : "",
                        Cell  : row => (
                            <div className="items-center">
                               
                            </div>
                        )
                    },*/
                    {
                        Header    : "Id",
                        accessor  : "id",
                        filterable: false,
                    },
                    {
                        Header    : "Secteurs",
                        accessor  : "name",
                        filterable: true,
                    },       
                    {
                        Header    : "Nbr Sous-secteurs",
                        className : "font-bold",
                        Cell  : row => (
                            
                            <div className="flex items-center">
                         
                               <HtmlTooltip
                                    title={
                                    <React.Fragment>
                                        
                                        {
                                            Object.keys(_.pullAllBy(row.original.sousSecteurs, [{ 'del': true }], 'del')).length === 0 ? 'Il n\'y aucun Sous-secteur' : 
                                            <ul> 
                                            { 
                                                _.map(_.pullAllBy(row.original.sousSecteurs, [{ 'del': true }], 'del'), function(value, key) {
                                                return <li key={key}> {value.name} </li>;
                                                })
                                            }
                                          </ul>
                                        }
                                       
                                    </React.Fragment>
                                    }
                                >
                                    <Button onClick={(ev)=>{ev.stopPropagation();}} >
                                        {Object.keys(_.pullAllBy(row.original.sousSecteurs, [{ 'del': true }], 'del')).length}
                                    </Button>
                                </HtmlTooltip>
                               
                            </div>
                        )
                    },              
                    {
                        Header: "",
                        width : 64,
                        Cell  : row => (
                            <div className="flex items-center">
                               
                                <IconButton className="text-red text-20"
                                    onClick={(ev)=>{
                                        ev.stopPropagation();
                                        dispatch(Actions.openDialog({
                                        children: (
                                            <React.Fragment>
                                                <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                    
                                                    {
                                                        Object.keys(_.pullAllBy(row.original.sousSecteurs, [{ 'del': true }], 'del')).length === 0 ? 
                                                        'Voulez vous vraiment supprimer cet enregistrement ?'
                                                        :
                                                        'Vous ne pouvez pas supprimer cet enregistrement, car il est en relation avec d\'autre(s) objet(s) !'
                                                    }
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={()=> dispatch(Actions.closeDialog())} color="default" variant="contained">
                                                        Non
                                                    </Button>
                                                    {
                                                        Object.keys(_.pullAllBy(row.original.sousSecteurs, [{ 'del': true }], 'del')).length === 0 ? 
                                                        <Button 
                                                        onClick={(ev) => {
                                                                    dispatch(Actions.removeSecteur(row.original));
                                                                    dispatch(Actions.closeDialog())
                                                                }} 
                                                        color="secondary" variant="contained" 
                                                        autoFocus>
                                                            Oui
                                                        </Button>
                                                        :
                                                        <Button 
                                                        disabled
                                                        color="secondary" variant="contained" 
                                                        autoFocus>
                                                            Oui
                                                        </Button>
                                                    }
                                                    
                                                </DialogActions>
                                            </React.Fragment>
                                             )
                                         }))}}
                                >
                                    <Icon>delete</Icon>
                                </IconButton>
                            </div>
                        )
                    }
                ]}
                defaultPageSize={10}
               
                noDataText="No Secteur found"
            />
        </FuseAnimate>
    );
}

export default SecteursList;
