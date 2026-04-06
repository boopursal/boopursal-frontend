import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  DialogTitle,
  DialogContentText,
  InputAdornment,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import { useForm } from "@fuse/hooks";
import * as Actions from "./store/actions";
import { useDispatch, useSelector } from "react-redux";
import { TextFieldFormsy } from "@fuse";
import { URL_SITE } from "@fuse/Constants";

import Formsy from "formsy-react";
import _ from "@lodash";
import SelectReactFormsy from "@fuse/components/formsy/SelectReactFormsy";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const defaultFormState = {
  firstName: "",
  lastName: "",
  adresse1: "",
  adresse2: "",
  codepostal: null,
  phone: "",
  email: "",
  pays: null,
};

function ZonesDialog(props) {
  const dispatch = useDispatch();
  const zonesDialog = useSelector(({ zonesApp }) => zonesApp.zones.zonesDialog);
  const zones = useSelector(({ zonesApp }) => zonesApp.zones);
  const Pays = useSelector(({ zonesApp }) => zonesApp.zones.pays);
  const imageReqInProgress = useSelector(
    ({ zonesApp }) => zonesApp.zones.imageReqInProgress
  );
  const avatar = useSelector(({ zonesApp }) => zonesApp.zones.avatar);

  const { form, handleChange, setForm } = useForm(defaultFormState);

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  const [values, setValues] = useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (zonesDialog.type === "edit" && zonesDialog.data) {
      let pays = (zonesDialog.data.pays || []).map((item) => ({
        value: item["@id"],
        label: item.name,
      }));
      setForm({ ...zonesDialog.data });
      setForm(_.set({ ...zonesDialog.data }, "pays", pays));
    }

    /**
     * Dialog type: 'new'
     */
    if (zonesDialog.type === "new") {
      setForm({
        ...defaultFormState,
        ...zonesDialog.data,
      });
    }
  }, [zonesDialog.data, zonesDialog.type, setForm]);

  useEffect(() => {
    if (
      zones.error &&
      (zones.error.firstName ||
        zones.error.lastName ||
        zones.error.adresse1 ||
        zones.error.adresse2 ||
        zones.error.codepostal ||
        zones.error.phone ||
        zones.error.email ||
        zones.error.pays)
    ) {
      formRef.current.updateInputsWithError({
        ...zones.error,
      });

      disableButton();
      zones.error = null;
    }
  }, [zones.error]);

  useEffect(() => {
    /**
     * After Dialog Open
     */
    if (zonesDialog.props.open) {
      initDialog();
    }
  }, [zonesDialog.props.open, initDialog]);

  useEffect(() => {
    if (avatar) {
      setForm(_.set({ ...form }, "avatar", avatar));
    } else {
      setForm(_.set({ ...form }, "avatar", null));
    }
  }, [avatar, form, setForm]);

  function closeComposeDialog() {
    zonesDialog.type === "edit"
      ? dispatch(Actions.closeEditZonesDialog())
      : dispatch(Actions.closeNewZonesDialog());
  }

  function handleSubmit(event) {
    form.codepostal = _.parseInt(form.codepostal);
    //  console.log(form)

    //event.preventDefault();
    if (zonesDialog.type === "new") {
      dispatch(Actions.addZone(form));
    } else {
      dispatch(Actions.updateZone(form));
    }
  }

  function handleRemove() {
    dispatch(Actions.removeZone(form));
    dispatch(Actions.closeDialog());
    closeComposeDialog();
  }
  function handleChipChange(value, name) {
    //setForm(_.set({...form}, name, value.map(item => item.value)));
    setForm(_.set({ ...form }, name, value));
  }

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleUploadChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    dispatch(Actions.uploadImage(file));
  }

  return (
    <Dialog
      classes={{
        paper: "m-24",
      }}
      {...zonesDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={1}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {zonesDialog.type === "new" ? "Nouvelle Zone" : "Editer Zone"}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          {imageReqInProgress ? (
            <Avatar className="">
              <CircularProgress size={24} />
            </Avatar>
          ) : (
            <Avatar
              className="w-96 h-96"
              alt="contact avatar"
              src={
                form.avatar
                  ? URL_SITE + form.avatar.url
                  : "assets/images/avatars/images.png"
              }
            />
          )}

          {zonesDialog.type === "edit" && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {form.firstName}&ensp;
              {form.lastName}
            </Typography>
          )}
        </div>
      </AppBar>
      <Formsy
        onValidSubmit={handleSubmit}
        onValid={enableButton}
        onInvalid={disableButton}
        ref={formRef}
        className="flex flex-col overflow-hidden"
      >
        <DialogContent classes={{ root: "p-24" }}>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Nom"
              autoFocus
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              variant="outlined"
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: "Min character length is 4",
              }}
              required
              fullWidth
            />
          </div>

          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Prénom"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              variant="outlined"
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: "Min character length is 4",
              }}
              required
              fullWidth
            />
          </div>

          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Adresse 1"
              id="adresse1"
              name="adresse1"
              value={form.adresse1}
              onChange={handleChange}
              variant="outlined"
              validations={{
                minLength: 6,
              }}
              validationErrors={{
                minLength: "La longueur minimale des caractères est de 6",
              }}
              required
              fullWidth
            />
          </div>

          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Adresse 2"
              id="adresse2"
              name="adresse2"
              value={form.adresse2}
              onChange={handleChange}
              variant="outlined"
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: "La longueur minimale des caractères est de 6",
              }}
              fullWidth
            />
          </div>

          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Code postal"
              id="codepostal"
              type="number"
              name="codepostal"
              value={_.toString(form.codepostal)}
              onChange={handleChange}
              variant="outlined"
              validations={{
                minLength: 4,
                isNumeric: true,
              }}
              validationErrors={{
                minLength: "Min character length is 4",
                isNumeric: "Numeric value required",
              }}
              required
              fullWidth
            />
          </div>

          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Téléphone"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              variant="outlined"
              validations={{
                minLength: 10,
                isNumeric: true,
              }}
              validationErrors={{
                minLength: "Min character length is 10",
                isNumeric: "Numeric value required",
              }}
              required
              fullWidth
            />
          </div>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="E-mail"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              variant="outlined"
              validations="isEmail"
              validationErrors={{
                isEmail: "This is not a valid email",
              }}
              required
              fullWidth
            />
          </div>

          {zonesDialog.type === "new" ? (
            <div>
              <div className="flex">
                <TextFieldFormsy
                  className="mb-24"
                  type={values.showPassword ? "text" : "password"}
                  name="password"
                  label="Mot de passe"
                  onChange={handleChange}
                  validations={{
                    minLength: 6,
                  }}
                  validationErrors={{
                    minLength: "La longueur minimale des caractères est de 6",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  required
                  fullWidth
                />
              </div>
              <div className="flex">
                <TextFieldFormsy
                  className="mb-24"
                  id="confirmpassword"
                  type={values.showPassword ? "text" : "password"}
                  name="confirmpassword"
                  label="Confirmer mot de passe"
                  validations="equalsField:password"
                  onChange={handleChange}
                  validationErrors={{
                    equalsField: "Passwords not identique",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="flex">
            <SelectReactFormsy
              id="pays"
              name="pays"
              className="MuiFormControl-fullWidth MuiTextField-root mb-24"
              value={form.pays}
              onChange={(value) => handleChipChange(value, "pays")}
              placeholder="Sélectionner multiple pays"
              textFieldProps={{
                label: "Pays",
                InputLabelProps: {
                  shrink: true,
                },
                variant: "outlined",
              }}
              options={Pays}
              fullWidth
              isMulti
              required
            />
          </div>
          <div className="flex">
            <input
              accept="image/*"
              id="button-file"
              type="file"
              onChange={handleUploadChange}
            />
          </div>
        </DialogContent>

        {zonesDialog.type === "new" ? (
          <DialogActions className="justify-between pl-16">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isFormValid || zones.loading || imageReqInProgress}
            >
              Ajouter
              {zones.loading && <CircularProgress size={24} />}
            </Button>
          </DialogActions>
        ) : (
          <DialogActions className="justify-between pl-16">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isFormValid || zones.loading || imageReqInProgress}
            >
              Modifier
              {zones.loading && <CircularProgress size={24} />}
            </Button>
            <IconButton
              onClick={() =>
                dispatch(
                  Actions.openDialog({
                    children: (
                      <React.Fragment>
                        <DialogTitle id="alert-dialog-title">
                          Suppression
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Voulez vous vraiment supprimer cet enregistrement ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => dispatch(Actions.closeDialog())}
                            color="primary"
                          >
                            Non
                          </Button>
                          <Button
                            onClick={handleRemove}
                            color="primary"
                            autoFocus
                          >
                            Oui
                          </Button>
                        </DialogActions>
                      </React.Fragment>
                    ),
                  })
                )
              }
            >
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        )}
      </Formsy>
    </Dialog>
  );
}

export default ZonesDialog;
