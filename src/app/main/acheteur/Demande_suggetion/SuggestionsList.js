import React, { useEffect, useState } from "react";
import {
  Icon,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
} from "@material-ui/core";
import { FuseUtils, FuseAnimate } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table";
import * as Actions from "./store/actions";
import moment from "moment";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
      width: '100%',
      '& > * + *': {
          marginTop: theme.spacing(2),
      },
  },
  chip: {
      marginLeft: theme.spacing(1),
      padding: 2,
      background: '#ef5350',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '11px',
      height: 20
  },
  chip2: {
      marginLeft: theme.spacing(1),
      padding: 2,
      background: '#4caf50',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '11px',
      height: 20
  },
  chipOrange: {
      marginLeft: theme.spacing(1),
      padding: 2,
      background: '#ff9800',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '11px',
      height: 20
  },
}));

function SuggestionsList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const suggestions = useSelector(({ SuggestionsApp }) => SuggestionsApp.suggestions.entities);
  const user = useSelector(({ auth }) => auth.user);
  const searchText = useSelector(({ SuggestionsApp }) => SuggestionsApp.suggestions.searchText);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    function getFilteredArray(entities, searchText) {
      if (!entities) return [];
      const arr = Object.values(entities);
      if (searchText.length === 0) return arr;
      return FuseUtils.filterArrayByString(arr, searchText);
    }

    setFilteredData(getFilteredArray(suggestions, searchText));
  }, [suggestions, searchText]);

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          Il n'y a pas de Demande de Suggestion!
        </Typography>
      </div>
    );
  }

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={300}>
      <ReactTable
        className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
        data={filteredData}
        columns={[
          {
            Header: "Titre",
            accessor: "name",
            filterable: true,
          },
          {
            Header: "Description",
            accessor: "description",
            filterable: true,
          },
          {
            Header: "État",
            accessor: "etat",
            filterable: true,
            
          },
          {
            Header: "Date de création",
            accessor: "createdAt",
            Cell: ({ value }) => moment(value).format("DD/MM/YYYY HH:mm"),
          },
         /*  {
            Header: "",
            width: 128,
            Cell: ({ row }) => (
              <div className="flex items-center">
                <Tooltip title="Éditer">
                  <IconButton
                    className="text-orange text-20"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      dispatch(Actions.openEditSuggestionsDialog(row.original));
                    }}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <IconButton
                    className="text-red text-20"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      dispatch(
                        Actions.openDialog({
                          children: (
                            <>
                              <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  Voulez-vous vraiment supprimer cette suggestion ?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={() => dispatch(Actions.closeDialog())} color="default" variant="contained">
                                  Non
                                </Button>
                                <Button
                                  onClick={() => {
                                    dispatch(Actions.removeSuggestion(row.original, user.id));
                                    dispatch(Actions.closeDialog());
                                  }}
                                  color="secondary" variant="contained"
                                  autoFocus
                                >
                                  Oui
                                </Button>
                              </DialogActions>
                            </>
                          ),
                        })
                      );
                    }}
                  >
                    <Icon>delete</Icon>
                  </IconButton>
                </Tooltip>
              </div>
            ),
          }, */
        ]}
        defaultPageSize={10}
        noDataText="Aucune suggestion trouvée"
      />
    </FuseAnimate>
  );
}

export default SuggestionsList;
