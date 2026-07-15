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

function FaqCategoriesDialog(props) {
    const dispatch = useDispatch();
    const faqCategoriesDialog = useSelector(({ faqCategorieApp }) => faqCategorieApp.faqCategories.faqCategoriesDialog);
    const { form, handleChange, setForm } = useForm(defaultFormState);
    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if (faqCategoriesDialog.type === 'edit' && faqCategoriesDialog.data) {
                setForm({ ...faqCategoriesDialog.data });
            }

            /**
             * Dialog type: 'new'
             */
            if (faqCategoriesDialog.type === 'new') {
                setForm({
                    ...defaultFormState,
                    ...faqCategoriesDialog.data,
                });
            }
        },
        [faqCategoriesDialog.data, faqCategoriesDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if (faqCategoriesDialog.props.open) {
            initDialog();
        }

    }, [faqCategoriesDialog.props.open, initDialog]);



    function closeComposeDialog() {
        faqCategoriesDialog.type === 'edit' ? dispatch(Actions.closeEditFaqCategorieDialog()) : dispatch(Actions.closeNewFaqCategorieDialog());
    }



    function handleSubmit(event) {
        //event.preventDefault();
        if (faqCategoriesDialog.type === 'new') {
            dispatch(Actions.addCategorie(form));
        }
        else {
            dispatch(Actions.updateCategorie(form));
        }
        closeComposeDialog();
    }

    function handleRemove() {

        dispatch(Actions.removeCategorie(form));
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
            {...faqCategoriesDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {faqCategoriesDialog.type === 'new' ? 'Nouvelle Categorie' : 'Editer Categorie'}
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

                {faqCategoriesDialog.type === 'new' ? (
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

export default FaqCategoriesDialog;
