import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, DialogTitle, DialogContentText } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { TextFieldFormsy } from '@fuse';
import Formsy from 'formsy-react';

const defaultFormState = {
    name: '',
};

function MotifsDialog(props) {
    const dispatch = useDispatch();
    const MotifsDialog = useSelector(({ motifsApp }) => motifsApp.motifs.motifsDialog);


    const { form, handleChange, setForm } = useForm(defaultFormState);


    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if (MotifsDialog.type === 'edit' && MotifsDialog.data) {
                setForm({ ...MotifsDialog.data });
            }

            /**
             * Dialog type: 'new'
             */
            if (MotifsDialog.type === 'new') {
                setForm({
                    ...defaultFormState,
                    ...MotifsDialog.data,
                });
            }
        },
        [MotifsDialog.data, MotifsDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if (MotifsDialog.props.open) {
            initDialog();
        }

    }, [MotifsDialog.props.open, initDialog]);



    function closeComposeDialog() {
        MotifsDialog.type === 'edit' ? dispatch(Actions.closeEditMotifsDialog()) : dispatch(Actions.closeNewMotifsDialog());
    }



    function handleSubmit(event) {
        //event.preventDefault();

        if (MotifsDialog.type === 'new') {
            dispatch(Actions.addMotif(form));
        }
        else {
            dispatch(Actions.updateMotif(form));
        }
        closeComposeDialog();
    }

    function handleRemove() {

        dispatch(Actions.removeMotif(form));
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
            {...MotifsDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {MotifsDialog.type === 'new' ? 'Nouveau Motif' : 'Editer Motif'}
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
                            <Icon color="action">remove_circle_outline</Icon>
                        </div>

                        <TextFieldFormsy
                            className="mb-24"
                            label="Désignation"
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

                {MotifsDialog.type === 'new' ? (
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
                                                    Voulez vous vraiment supprimer cet enregistrement ?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                
                                                <Button onClick={() => dispatch(Actions.closeDialog())} color="primary">
                                                    Non
                                                </Button>
                                                <Button onClick={handleRemove} color="secondary" variant="contained" autoFocus>
                                                    Oui
                                                </Button>

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

export default MotifsDialog;
