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
  Avatar,
} from "@material-ui/core";
import { FuseUtils, FuseAnimate,URL_SITE } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table";
import * as Actions from "./store/actions";
//import PersonnelsMultiSelectMenu from './PersonnelsMultiSelectMenu';
import moment from "moment";
function PersonnelsList(props) {
  const dispatch = useDispatch();
  const personnels = useSelector(
    ({ personnelsApp }) => personnelsApp.personnels.entities
  );
  const user = useSelector(({ auth }) => auth.user);
  // const selectedPersonnelsIds = useSelector(({personnelsApp}) => personnelsApp.personnels.selectedPersonnelsIds);
  const searchText = useSelector(
    ({ personnelsApp }) => personnelsApp.personnels.searchText
  );

  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    function getFilteredArray(entities, searchText) {
      const arr = Object.keys(entities).map((id) => entities[id]);
      if (searchText.length === 0) {
        return arr;
      }
      return FuseUtils.filterArrayByString(arr, searchText);
    }

    if (personnels) {
      setFilteredData(getFilteredArray(personnels, searchText));
    }
  }, [personnels, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          Il n'y a pas d'Agence / Service!
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
            Header: "",
            Cell: (row) =>
              row.original.avatar ? (
                <Avatar
                  className="mr-8"
                  alt={row.original.firstName}
                  src={URL_SITE + row.original.avatar.url}
                />
              ) : (
                <Avatar
                  className="mr-8"
                  alt={row.original.firstName}
                  src="/assets/images/avatars/images.png"
                />
              ),

            className: "justify-center",
            width: 64,
            sortable: false,
          },
          {
            Header: "Agence/Service",
            accessor: "agence",
            filterable: true,
            Cell: (row) => (row.original.agence ? row.original.agence : ""),
          },
          {
            Header: "NOM & Prénom",
            accessor: "name",
            filterable: true,
            Cell: (row) => (row.original.name ? row.original.name : ""),
          },
          {
            Header: "Ville",
            accessor: "ville",
            filterable: true,
            Cell: (row) => (row.original.ville ? row.original.ville : ""),
          },
          {
            Header: "Email",
            accessor: "email",
            filterable: true,
            Cell: (row) => (row.original.email ? row.original.email : ""),
          },
          {
            Header: "Téléphone",
            accessor: "phone",
            filterable: true,
            Cell: (row) => (row.original.phone ? row.original.phone : ""),
          },
          {
            Header: "Date de création",
            Cell: (row) =>
              moment(row.original.created).format("DD/MM/YYYY HH:mm"),
          },

          {
            Header: "",
            width: 128,
            Cell: (row) => (
              <div className="flex items-center">
                <Tooltip title="Editer">
                  <IconButton
                    className="text-orange text-20"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      dispatch(Actions.openEditPersonnelsDialog(row.original));
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
                            <React.Fragment>
                              <DialogTitle id="alert-dialog-title">
                                Suppression
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  Voulez vous vraiment supprimer cet
                                  enregistrement ?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() =>
                                    dispatch(Actions.closeDialog())
                                  }
                                  color="primary"
                                >
                                  Non
                                </Button>
                                <Button
                                  onClick={(ev) => {
                                    dispatch(
                                      Actions.removePersonnel(
                                        row.original,
                                        user.id
                                      )
                                    );
                                    dispatch(Actions.closeDialog());
                                  }}
                                  color="primary"
                                  autoFocus
                                >
                                  Oui
                                </Button>
                              </DialogActions>
                            </React.Fragment>
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
          },
        ]}
        defaultPageSize={10}
        noDataText="No personnels found"
      />
    </FuseAnimate>
  );
}

export default PersonnelsList;
