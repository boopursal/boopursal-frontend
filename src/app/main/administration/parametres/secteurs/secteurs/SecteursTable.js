import React, { useEffect, useState } from "react";
import {
  Icon,
  IconButton,
  Tooltip,
  Avatar,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@material-ui/core";
import { FuseUtils, URL_SITE } from "@fuse";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from "../store/actions";

function SecteursTable(props) {
  const dispatch = useDispatch();
  const secteurs = useSelector(({ secteursApp }) => secteursApp.secteurs.entities);
  const loading = useSelector(({ secteursApp }) => secteursApp.secteurs.loading);
  const searchText = useSelector(({ secteursApp }) => secteursApp.secteurs.searchText);

  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (secteurs) {
      const arr = Object.values(secteurs);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [secteurs, searchText]);

  if (!filteredData) return null;

  return (
    <BoopursalTable
        title="Configuration des Secteurs"
        data={filteredData}
        loading={loading}
        searchText={searchText}
        onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
        onRowClick={(row) => props.history.push("/parametres/secteurs/" + row.id)}
        columns={[
          {
            Header: "Secteur",
            accessor: "name",
            Cell: (row) => (
                <div className="flex items-center gap-12">
                     <Avatar
                        className="w-40 h-40 border-2 border-white shadow-sm"
                        alt={row.original.name}
                        src={row.original.image ? URL_SITE + row.original.image.url : "/assets/images/avatars/images.png"}
                    />
                    <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                        {row.original.name}
                    </Typography>
                </div>
            ),
            minWidth: 400
          },
          {
            Header: "Actions",
            width: 100,
            sortable: false,
            Cell: (row) => (
              <div className="flex items-center gap-8">
                 <IconButton 
                    size="small"
                    style={{ color: '#319795', backgroundColor: 'rgba(49, 151, 149, 0.05)' }}
                    onClick={(ev) => {
                        ev.stopPropagation();
                        props.history.push("/parametres/secteurs/" + row.original.id);
                    }}
                >
                  <Icon className="text-18">edit</Icon>
                </IconButton>
                <IconButton 
                    size="small"
                    style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      dispatch(Actions.openDialog({
                        children: (
                          <React.Fragment>
                            <DialogTitle>Confirmation</DialogTitle>
                            <DialogContent>
                              <DialogContentText>Voulez-vous vraiment supprimer ce secteur ?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
                              <Button 
                                variant="contained" 
                                style={{ backgroundColor: '#D34053', color: 'white' }}
                                onClick={() => {
                                  dispatch(Actions.removeSecteur(row.original));
                                  dispatch(Actions.closeDialog());
                                }}
                              >
                                Supprimer
                              </Button>
                            </DialogActions>
                          </React.Fragment>
                        ),
                      }));
                    }}
                >
                  <Icon className="text-18">delete</Icon>
                </IconButton>
              </div>
            ),
          },
        ]}
    />
  );
}

export default withRouter(SecteursTable);
