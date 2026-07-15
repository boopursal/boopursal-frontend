import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, DialogTitle, DialogContentText } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { TextFieldFormsy } from '@fuse';
import Formsy from 'formsy-react';
import SelectReactFormsy from '@fuse/components/formsy/SelectReactFormsy';
import _ from '@lodash';
const defaultFormState = {
    name: '',
    pays: ''
};

function VillesDialog(props) {
    const dispatch = useDispatch();
    const VillesDialog = useSelector(({ villesApp }) => villesApp.villes.villesDialog);
    const Pays = useSelector(({ villesApp }) => villesApp.villes.pays);
    const parametres = useSelector(({ villesApp }) => villesApp.villes.parametres);

    const { form, handleChange, setForm } = useForm(defaultFormState);


    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if (VillesDialog.type === 'edit' && VillesDialog.data) {
                let pays = {
                    value: VillesDialog.data.pays['@id'],
                    label: VillesDialog.data.pays.name,
                };
                setForm({ ...VillesDialog.data });
                setForm(_.set({ ...VillesDialog.data }, 'pays', pays));
            }

            /**
             * Dialog type: 'new'
             */
            if (VillesDialog.type === 'new') {
                setForm({
                    ...defaultFormState,
                    ...VillesDialog.data,
                });
            }
        },
        [VillesDialog.data, VillesDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if (VillesDialog.props.open) {
            initDialog();
        }

    }, [VillesDialog.props.open, initDialog]);



    function closeComposeDialog() {
        VillesDialog.type === 'edit' ? dispatch(Actions.closeEditVillesDialog()) : dispatch(Actions.closeNewVillesDialog());
    }



    function handleSubmit(event) {
        //event.preventDefault();
        if (VillesDialog.type === 'new') {
            dispatch(Actions.addVille(form, parametres));
        }
        else {
            dispatch(Actions.updateVille(form, parametres));
        }
        closeComposeDialog();
    }

    function handleRemove() {

        dispatch(Actions.removeVille(form));
        dispatch(Actions.closeDialog())
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

    return (
        <Dialog
            classes={{
                paper: "m-24"
            }}
            {...VillesDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {VillesDialog.type === 'new' ? 'Nouvelle Ville' : 'Editer Ville'}
                    </Typography>
                </Toolbar>

            </AppBar>
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                ref={formRef}
                className="flex flex-col overflow-hidden">
                <DialogContent classes={{ root: "p-24" }}>
                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">location_city</Icon>
                        </div>

                        <TextFieldFormsy
                            className="mb-24"
                            label="Nom"
                            autoFocus
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            variant="outlined"
                            validations={{
                                minLength: 4
                            }}
                            validationErrors={{
                                minLength: 'Min character length is 4'
                            }}
                            required
                            fullWidth
                        />
                    </div>

                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">public</Icon>
                        </div>

                        <SelectReactFormsy

                            id="pays"
                            name="pays"
                            className="MuiFormControl-fullWidth MuiTextField-root mb-24"
                            value={

                                form.pays


                            }
                            onChange={(value) => handleChipChange(value, 'pays')}
                            placeholder="Sélectionner un pays"
                            textFieldProps={{
                                label: 'Pays',
                                InputLabelProps: {
                                    shrink: true
                                },
                                variant: 'outlined'
                            }}
                            options={Pays}
                            fullWidth
                            required
                        />
                    </div>


                </DialogContent>

                {VillesDialog.type === 'new' ? (
                    <DialogActions className="justify-between pl-16">
                        <Button
                            variant="contained"
                            color="default" variant="contained"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            Ajouter
                        </Button>
                    </DialogActions>
                ) : (
                        <DialogActions className="justify-between pl-16">
                            <Button
                                variant="contained"
                                color="secondary" variant="contained"
                                type="submit"
                                disabled={!isFormValid}
                            >
                                Modifier
                        </Button>
                            <IconButton
                                onClick={() => dispatch(Actions.openDialog({
                                    children: (
                                        <React.Fragment>
                                            <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    {
                                                        (Object.keys(_.pullAllBy(form.fournisseurs, [{ 'del': true }], 'del')).length === 0 && Object.keys(_.pullAllBy(form.acheteurs, [{ 'del': true }], 'del')).length === 0 && Object.keys(_.pullAllBy(form.commercials, [{ 'del': true }], 'del')).length === 0) ?
                                                            'Voulez vous vraiment supprimer cet enregistrement ?'
                                                            :
                                                            'Vous ne pouvez pas supprimer cet enregistrement, car il est en relation avec d\'autre(s) objet(s) !'
                                                    }
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => dispatch(Actions.closeDialog())} color="primary">
                                                    Non
                                            </Button>
                                                {
                                                    (
                                                        Object.keys(_.pullAllBy(form.fournisseurs, [{ 'del': true }], 'del')).length === 0
                                                        && Object.keys(_.pullAllBy(form.acheteurs, [{ 'del': true }], 'del')).length === 0
                                                        && Object.keys(_.pullAllBy(form.commercials, [{ 'del': true }], 'del')).length === 0
                                                    )
                                                        ?
                                                        <Button onClick={handleRemove} color="secondary" variant="contained" autoFocus>
                                                            Oui
                                                </Button>
                                                        :
                                                        <Button disabled color="secondary" variant="contained" autoFocus>
                                                            Oui
                                                </Button>
                                                }

                                            </DialogActions>
                                        </React.Fragment>
                                    )
                                }))}


                            >
                                <Icon>delete</Icon>
                            </IconButton>
                        </DialogActions>
                    )}
            </Formsy>
        </Dialog>
    );
}

export default VillesDialog;
