import React, { useEffect, useRef } from 'react';
import { Icon, Typography, Grid, InputAdornment, IconButton } from '@material-ui/core';
import { FuseAnimate, FusePageCarded, TextFieldFormsy } from '@fuse';
import { useForm } from '@fuse/hooks';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import Formsy from 'formsy-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';



function Suggestion(props) {

    const dispatch = useDispatch();
    const suggestion = useSelector(({ suggestionsApp }) => suggestionsApp.suggestion);
    const formRef = useRef(null);
    const { form, handleChange, setForm } = useForm(null);


    useEffect(() => {
        function updateSuggestionstate() {
            const params = props.match.params;
            const { suggestionId } = params;
            dispatch(Actions.getSuggestion(suggestionId));
        }

        updateSuggestionstate();
        return () => {
            dispatch(Actions.cleanUp())
        }
    }, [dispatch, props.match.params]);


    //SET ERRORS IN INPUTS AFTER ERROR API
    useEffect(() => {
        if (suggestion.error && (suggestion.error.name)) {
            formRef.current.updateInputsWithError({
                ...suggestion.error
            });
        }
    }, [suggestion.error]);

    //SET FORM DATA
    useEffect(() => {
        if (
            (suggestion.data && !form) ||
            (suggestion.data && form && suggestion.data.id !== form.id)
        ) {

            setForm({ ...suggestion.data });
        }

    }, [form, suggestion.data, setForm]);


    function handleAddSecteur(secteur) {

        dispatch(Actions.saveSecteur(secteur));

    }
    function handleAddSousSecteur(sousSecteur, secteur) {

        dispatch(Actions.saveSousSecteur(sousSecteur, secteur));

    }
    function handleAddCategorie(categorie, sousSecteur) {

        dispatch(Actions.saveCategorie(categorie, sousSecteur));

    }


    return (
        <FusePageCarded
            classes={{
                toolbar: "p-0",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                form && (
                    <div className="flex flex-1 w-full items-center justify-between">

                        <div className="flex flex-col items-start max-w-full">

                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/parametres/suggestions" color="inherit">
                                    <Icon className="mr-4 text-20">arrow_back</Icon>
                                    Suggestions
                                </Typography>
                            </FuseAnimate>
                        </div>


                    </div>
                )
            }

            content={
                suggestion.requestSuggestion ? <LinearProgress color="secondary" /> :

                    form && (
                        <div className=" sm:p-10 max-w-2xl">

                            <Formsy
                                ref={formRef}
                                className="flex pt-5 flex-col ">

                                <Grid container spacing={3}>

                                    <Grid item xs={12} sm={4}>
                                        <TextFieldFormsy
                                            className="mb-16"
                                            type="text"
                                            name="secteur"
                                            value={form.secteur}
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment:
                                                    suggestion.requestSecteur ?
                                                        <CircularProgress color="secondary" />
                                                        :
                                                        (<InputAdornment position="end">
                                                            <IconButton
                                                                color="secondary"
                                                                aria-label="toggle add secteur"
                                                                disabled={!!suggestion.secteur || !form.secteur}
                                                                onClick={() => handleAddSecteur(form.secteur)}
                                                            >
                                                                <Icon>add_circle</Icon>
                                                            </IconButton>
                                                        </InputAdornment>)
                                            }}
                                            label="Secteur"
                                            variant="outlined"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextFieldFormsy
                                            className="mb-16"
                                            type="text"
                                            name="sousSecteur"
                                            disabled={!suggestion.secteur}
                                            value={form.sousSecteur}
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment:
                                                    suggestion.requestSousSecteur ?
                                                        <CircularProgress color="secondary" />
                                                        :
                                                        (<InputAdornment position="end">
                                                            <IconButton
                                                                color="secondary"
                                                                aria-label="toggle add sous secteur"
                                                                disabled={!!suggestion.sousSecteur || !suggestion.secteur || !form.sousSecteur}
                                                                onClick={() => handleAddSousSecteur(form.sousSecteur, suggestion.secteur['@id'])}
                                                            >
                                                                <Icon>add_circle</Icon>
                                                            </IconButton>
                                                        </InputAdornment>)
                                            }}
                                            label="Activité"
                                            variant="outlined"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextFieldFormsy
                                            className="mb-16"
                                            type="text"
                                            name="categorie"
                                            value={form.categorie}
                                            disabled={!suggestion.sousSecteur}
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment:
                                                    suggestion.requestCategorie ?
                                                        <CircularProgress color="secondary" />
                                                        :
                                                        (<InputAdornment position="end">
                                                            <IconButton
                                                                color="secondary"
                                                                aria-label="toggle add sous secteur"
                                                                disabled={!!suggestion.categorie || !suggestion.sousSecteur || !form.categorie}
                                                                onClick={() => handleAddCategorie(form.categorie, suggestion.sousSecteur['@id'])}
                                                            //onClick={handleClickShowPassword}
                                                            >
                                                                <Icon>add_circle</Icon>
                                                            </IconButton>
                                                        </InputAdornment>)
                                            }}
                                            label="Produit"
                                            variant="outlined"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                            </Formsy>


                        </div>
                    )

            }
            innerScroll
        />
    )
}

export default withReducer('suggestionsApp', reducer)(Suggestion);
