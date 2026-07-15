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
};

function SousSecteursDialog(props) {
    const dispatch = useDispatch();
    const SousSecteursDialog = useSelector(({ sous_secteursApp }) => sous_secteursApp.sous_secteurs.sous_secteursDialog);
    const Secteur = useSelector(({ sous_secteursApp }) => sous_secteursApp.sous_secteurs.secteur);
    const parents = useSelector(({ sous_secteursApp }) => sous_secteursApp.sous_secteurs.parents);
    const parametres = useSelector(({ sous_secteursApp }) => sous_secteursApp.sous_secteurs.parametres);

    const { form, handleChange, setForm } = useForm(defaultFormState);


    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if (SousSecteursDialog.type === 'edit' && SousSecteursDialog.data) {
                let secteur = {
                    value: SousSecteursDialog.data.secteur['@id'],
                    label: SousSecteursDialog.data.secteur.name,
                };
                if (SousSecteursDialog.data.parent)
                    SousSecteursDialog.data.parent = {
                        value: SousSecteursDialog.data.parent['@id'],
                        label: SousSecteursDialog.data.parent.name,
                    };
                setForm({ ...SousSecteursDialog.data });
                setForm(_.set({ ...SousSecteursDialog.data }, 'secteur', secteur));
            }

            /**
             * Dialog type: 'new'
             */
            if (SousSecteursDialog.type === 'new') {
                setForm({
                    ...defaultFormState,
                    ...SousSecteursDialog.data,
                });
            }
        },
        [SousSecteursDialog.data, SousSecteursDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if (SousSecteursDialog.props.open) {
            initDialog();
        }

    }, [SousSecteursDialog.props.open, initDialog]);



    function closeComposeDialog() {
        SousSecteursDialog.type === 'edit' ? dispatch(Actions.closeEditSousSecteursDialog()) : dispatch(Actions.closeNewSousSecteursDialog());
    }



    function handleSubmit(event) {
        //event.preventDefault();
        if (SousSecteursDialog.type === 'new') {
            dispatch(Actions.addSousSecteur(form, parametres));
        }
        else {
            dispatch(Actions.updateSousSecteur(form, parametres));
        }
        closeComposeDialog();
    }

    function handleRemove() {

        dispatch(Actions.removeSousSecteur(form, parametres));
        dispatch(Actions.closeDialog())
        closeComposeDialog();
    }
    function handleChipChange(value, name) {
        //setForm(_.set({...form}, name, value.map(item => item.value)));
        setForm(_.set({ ...form }, name, value));
        if (name === 'secteur') {
            if (value.value) {
                dispatch(Actions.getParents(value.value));
            }
        }

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
            {...SousSecteursDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {SousSecteursDialog.type === 'new' ? 'Nouvelle activité' : 'Editer activité'}
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
                            <Icon color="action">ballot</Icon>
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
                            <Icon color="action">work</Icon>
                        </div>

                        <SelectReactFormsy

                            id="secteur"
                            name="secteur"
                            className="MuiFormControl-fullWidth MuiTextField-root mb-24"
                            value={

                                form.secteur


                            }
                            onChange={(value) => handleChipChange(value, 'secteur')}
                            placeholder="Sélectionner un secteur"
                            textFieldProps={{
                                label: 'Secteur',
                                InputLabelProps: {
                                    shrink: true
                                },
                                variant: 'outlined'
                            }}
                            options={Secteur}
                            fullWidth
                            required
                        />
                    </div>

                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">work</Icon>
                        </div>

                        <SelectReactFormsy

                            id="parent"
                            name="parent"
                            className="MuiFormControl-fullWidth MuiTextField-root mb-24"
                            value={
                                form.parent
                            }
                            onChange={(value) => handleChipChange(value, 'parent')}
                            placeholder="Parent optionnel"
                            textFieldProps={{
                                label: 'Parent',
                                InputLabelProps: {
                                    shrink: true
                                },
                                variant: 'outlined'
                            }}
                            options={parents}
                            fullWidth
                        />
                    </div>


                </DialogContent>

                {SousSecteursDialog.type === 'new' ? (
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
                                                        (Object.keys(_.pullAllBy(form.fournisseurs, [{ 'del': true }], 'del')).length === 0 /*&& Object.keys(_.pullAllBy(form.acheteurs, [{ 'del': true }], 'del')).length === 0 */) ?
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
                                                    (Object.keys(_.pullAllBy(form.fournisseurs, [{ 'del': true }], 'del')).length === 0 /*&& Object.keys(_.pullAllBy(form.acheteurs, [{ 'del': true }], 'del')).length === 0*/) ?
                                                        <Button
                                                            onClick={handleRemove} color="secondary" variant="contained" autoFocus>
                                                            Oui
                                                </Button>
                                                        :
                                                        <Button
                                                            disabled
                                                            color="secondary" variant="contained" autoFocus>
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

export default SousSecteursDialog;
