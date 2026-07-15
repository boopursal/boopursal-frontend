import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, DialogTitle, DialogContentText } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { TextFieldFormsy } from '@fuse';
import Formsy from 'formsy-react';
import _ from '@lodash';

const defaultFormState = {
    name: '',
};

function SecteursDialog(props) {
    const dispatch = useDispatch();
    const SecteursDialog = useSelector(({ secteursApp }) => secteursApp.secteurs.secteursDialog);


    const { form, handleChange, setForm } = useForm(defaultFormState);


    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if (SecteursDialog.type === 'edit' && SecteursDialog.data) {
                setForm({ ...SecteursDialog.data });
            }

            /**
             * Dialog type: 'new'
             */
            if (SecteursDialog.type === 'new') {
                setForm({
                    ...defaultFormState,
                    ...SecteursDialog.data,
                });
            }
        },
        [SecteursDialog.data, SecteursDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if (SecteursDialog.props.open) {
            initDialog();
        }

    }, [SecteursDialog.props.open, initDialog]);



    function closeComposeDialog() {
        SecteursDialog.type === 'edit' ? dispatch(Actions.closeEditSecteursDialog()) : dispatch(Actions.closeNewSecteursDialog());
    }



    function handleSubmit(event) {
        //event.preventDefault();

        if (SecteursDialog.type === 'new') {
            dispatch(Actions.addSecteur(form));
        }
        else {
            dispatch(Actions.updateSecteur(form));
        }
        closeComposeDialog();
    }

    function handleRemove() {

        dispatch(Actions.removeSecteur(form));
        dispatch(Actions.closeDialog())
        closeComposeDialog();
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
            {...SecteursDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {SecteursDialog.type === 'new' ? 'Nouveau Secteur' : 'Editer Secteur'}
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
                            <Icon color="action">account_circle</Icon>
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

                </DialogContent>

                {SecteursDialog.type === 'new' ? (
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
                                                        Object.keys(_.pullAllBy(form.sousSecteurs, [{ 'del': true }], 'del')).length === 0 ?
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
                                                    Object.keys(_.pullAllBy(form.sousSecteurs, [{ 'del': true }], 'del')).length === 0 ?
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

export default SecteursDialog;
