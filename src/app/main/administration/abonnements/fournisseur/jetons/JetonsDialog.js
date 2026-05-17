import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Typography, Toolbar, AppBar, FormControlLabel, Radio } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RadioGroupFormsy, TextFieldFormsy, SelectReactFormsy, CheckboxFormsy } from '@fuse';
import Formsy from 'formsy-react';
import _ from '@lodash';
import Autosuggest from 'react-autosuggest';
import agent from "agent";
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const defaultFormState = {
    name: '',
};
const useStyles = makeStyles(theme => ({
    root: {
        height: 250,
        flexGrow: 1,
    },
    container: {
        position: 'relative',
        width: '100%',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 9999,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,

    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing(2),
    },
}));

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.societe, query);
    const parts = parse(suggestion.societe, matches);
    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map(part => (
                    <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
                        {part.text}
                    </span>
                ))}
            </div>
        </MenuItem>
    );
}
function renderInputComponent(inputProps) {
    const { classes, inputRef = () => { }, ref, ...other } = inputProps;
    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: classes.input,
                },
            }}
            required

            {...other}
        />
    );
}

function JetonsDialog(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const JetonsDialog = useSelector(({ jetonsApp }) => jetonsApp.jetons.jetonsDialog);
    const paiements = useSelector(({ jetonsApp }) => jetonsApp.jetons.paiements);
    const parametres = useSelector(({ jetonsApp }) => jetonsApp.jetons.parametres);
    const [fournisseur, setFournisseur] = useState({ societe: '' });
    const [suggestions, setSuggestions] = useState([]);
    const { form, handleChange, setForm } = useForm(defaultFormState);
    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const autosuggestProps = {
        renderInputComponent,
        renderSuggestion,
    };

    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if (JetonsDialog.type === 'edit' && JetonsDialog.data) {
                const data = JetonsDialog.data;
                let updatedForm = { ...data };
                
                setFournisseur(data.fournisseur || { societe: '' });
                
                if (data.fournisseur) {
                    updatedForm = _.set(updatedForm, 'fournisseur', data.fournisseur['@id']);
                }
                
                if (data.paiement) {
                    updatedForm = _.set(updatedForm, 'paiement', {
                        value: data.paiement['@id'],
                        label: data.paiement.name,
                    });
                }
                
                setForm(updatedForm);
            }

            /**
             * Dialog type: 'new'
             */
            if (JetonsDialog.type === 'new') {
                setForm({
                    ...defaultFormState,
                    ...JetonsDialog.data,
                });
            }
        },
        [JetonsDialog.data, JetonsDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if (JetonsDialog.props.open) {
            initDialog();
        }

    }, [JetonsDialog.props.open, initDialog]);



    function closeComposeDialog() {
        JetonsDialog.type === 'edit' ? dispatch(Actions.closeEditJetonsDialog()) : dispatch(Actions.closeNewJetonsDialog());
    }



    function handleSubmit() {
        //event.preventDefault();

        if (JetonsDialog.type === 'edit') {
            dispatch(Actions.UpdateJeton(form, parametres));
            setFournisseur({ societe: '' });
        } else {
            dispatch(Actions.addJeton(form, parametres));
            setFournisseur({ societe: '' });
        }

        closeComposeDialog();
    }

    function handleChipChange(value, name) {
        setForm(_.set({ ...form }, name, value));
    }

    function handleRadioChange(e) {

        setForm(_.set({ ...form }, 'nbrJeton', parseInt(e.target.value)));
    }
    function handleCheckBoxChange(e, name) {

        setForm(_.set({ ...form }, name, e.target.checked));
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
            {...JetonsDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {JetonsDialog.type === 'new' ? 'Nouveau Jeton' : 'Editer Jeton'}
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

                        <Autosuggest

                            suggestions={suggestions}
                            {...autosuggestProps}
                            onSuggestionsFetchRequested={async ({ value }) => {
                                if (!value) {
                                    setSuggestions([]);
                                    return;
                                }
                                try {
                                    const response = await agent.get(
                                        `/api/fournisseurs?societe=${value}&del=false&isactif=true&props[]=id&props[]=societe`
                                    );

                                    setSuggestions(
                                        response.data['hydra:member']
                                    );
                                } catch (e) {
                                    setSuggestions([]);

                                }
                            }}
                            onSuggestionsClearRequested={() => {
                                setSuggestions([]);

                            }}
                            getSuggestionValue={suggestion => suggestion.societe}

                            onSuggestionSelected={(event, { suggestion, method }) => {
                                if (method === "enter") {
                                    event.preventDefault();
                                }
                                setFournisseur(suggestion);
                                setForm(_.set({ ...form }, 'fournisseur', suggestion['@id']))

                            }}
                            required
                            inputProps={{
                                classes,
                                label: 'Fournisseur',
                                placeholder: "Cherchez avec le nom du société",
                                value: fournisseur.societe,
                                variant: "outlined",
                                name: "fournisseur",
                                disabled: JetonsDialog.type === 'edit',
                                onChange: (_event, { newValue }) => {
                                    setFournisseur({ societe: newValue });
                                },
                                InputLabelProps: {
                                    shrink: true,
                                }

                            }}
                            theme={{
                                container: classes.container,
                                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                                suggestionsList: classes.suggestionsList,
                                suggestion: classes.suggestion,
                            }}
                            renderSuggestionsContainer={options => (
                                <Paper {...options.containerProps} square>
                                    {options.children}
                                </Paper>
                            )}
                        />

                    </div>


                    <div className="flex mt-24">

                        <RadioGroupFormsy
                            className="inline"
                            name="nbrJeton"
                            label="Nombre de jetons"
                            onChange={handleRadioChange}
                        >
                            <FormControlLabel value="1" disabled={JetonsDialog.type === 'edit'} checked={form.nbrJeton === 1} control={<Radio />} label="1" />
                            <FormControlLabel value="5" disabled={JetonsDialog.type === 'edit'} checked={form.nbrJeton === 5} control={<Radio />} label="5" />
                            <FormControlLabel value="10" disabled={JetonsDialog.type === 'edit'} checked={form.nbrJeton === 10} control={<Radio />} label="10" />
                            <FormControlLabel value="20" disabled={JetonsDialog.type === 'edit'} checked={form.nbrJeton === 20} control={<Radio />} label="20" />

                        </RadioGroupFormsy>

                    </div>
                    <div className="flex">


                        <TextFieldFormsy
                            className="mb-24 mt-24"
                            type="number"
                            step="any"
                            label="Prix"
                            id="prix"
                            name="prix"
                            min="0"
                            value={String(form.prix)}
                            onChange={handleChange}
                            variant="outlined"
                            inputProps={{ min: "0", step: "any" }}
                            fullWidth
                            required
                        />

                    </div>
                    <div className="flex">


                        <SelectReactFormsy

                            id="paiement"
                            name="paiement"
                            className="MuiFormControl-fullWidth MuiTextField-root mb-24 z-999"
                            value={

                                form.paiement


                            }
                            onChange={(value) => handleChipChange(value, 'paiement')}
                            textFieldProps={{
                                label: 'Choisissez le mode de paiement',
                                InputLabelProps: {
                                    shrink: true
                                },
                                variant: 'outlined'
                            }}
                            options={paiements}
                            fullWidth
                            required
                        />

                    </div>
                    <div className="flex">


                        <CheckboxFormsy
                            className="mb-10"
                            name="isPayed"
                            value={form.isPayed}
                            onChange={(e) => handleCheckBoxChange(e, 'isPayed')}
                            label="Confirmer le paiement de cette entreprise"
                        />

                    </div>


                </DialogContent>

                {JetonsDialog.type === 'new' ? (
                    <DialogActions className="justify-between pl-16">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!isFormValid || !fournisseur['@id']}
                        >
                            Ajouter
                    </Button>
                    </DialogActions>
                ) : (
                        <DialogActions className="justify-between pl-16">
                            {
                                form.isUse ? '' :
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={!isFormValid}
                                    >
                                        Mettre à jour
                                    </Button>
                            }


                        </DialogActions>
                    )}
            </Formsy>
        </Dialog>
    );
}

export default JetonsDialog;
