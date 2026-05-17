import React, { useEffect, useState } from "react";
import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { FuseScrollbars, URL_SITE } from "@fuse";
import { withRouter } from "react-router-dom";
import _ from "@lodash";
import AdminsTableHead from "./AdminsTableHead";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

function AdminsTable(props) {
  const dispatch = useDispatch();
  const admins = useSelector(({ adminsApp }) => adminsApp.admins.data);
  const searchText = useSelector(
    ({ adminsApp }) => adminsApp.admins.searchText
  );

  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(admins);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  useEffect(() => {
    dispatch(Actions.getAdmins());
  }, [dispatch]);

  useEffect(() => {
    setData(
      searchText.length === 0
        ? admins
        : _.filter(admins, (item) =>
            (
              item.firstName.toLowerCase() +
              " " +
              item.lastName.toLowerCase()
            ).includes(searchText.toLowerCase())
          )
    );
  }, [admins, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleClick(item) {
    props.history.push("/users/admins/" + item.id + "/" + item.handle);
  }

  function handleChangePage(event, page) {
    setPage(page);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table className="min-w-xl" aria-labelledby="tableTitle">
          <AdminsTableHead
            numSelected={selected.length}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />

          <TableBody>
            {_.orderBy(
              data,
              [
                (o) => {
                  switch (order.id) {
                    case "categories": {
                      return o.categories[0];
                    }
                    default: {
                      return o[order.id];
                    }
                  }
                },
              ],
              [order.direction]
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n) => {
                return (
                  <TableRow
                    className="h-64 cursor-pointer"
                    hover
                    tabIndex={-1}
                    key={n.id}
                    onClick={(event) => handleClick(n)}
                  >
                    <TableCell
                      className="w-52"
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {n.avatar ? (
                        <img
                          className="w-full block rounded"
                          src={URL_SITE + n.avatar.url}
                          alt={n.name}
                        />
                      ) : (
                        <img
                          className="w-full block rounded"
                          src="/assets/images/avatars/images.png"
                          alt={n.name}
                        />
                      )}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {n.firstName + " " + n.lastName}
                    </TableCell>

                    <TableCell className="truncate" component="th" scope="row">
                      {n.phone}
                    </TableCell>

                    <TableCell component="th" scope="row" align="right">
                      {moment(n.created).format("DD/MM/YYYY HH:mm")}
                    </TableCell>

                    <TableCell component="th" scope="row" align="right">
                      {n.isactif ? (
                        <Icon className="text-green text-20">check_circle</Icon>
                      ) : (
                        <Icon className="text-red text-20">remove_circle</Icon>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(AdminsTable);
