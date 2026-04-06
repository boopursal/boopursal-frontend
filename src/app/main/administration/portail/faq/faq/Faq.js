import React, { useEffect, useState, useRef } from 'react';
import { Button, Tab, Tabs, Icon, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, TextFieldFormsy, SelectReactFormsy } from '@fuse';
import { useForm } from '@fuse/hooks';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import _ from '@lodash';
import Formsy from 'formsy-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },

}));

function Faq(props) {

    const dispatch = useDispatch();
    const classes = useStyles();
    const faq = useSelector(({ faqsApp }) => faqsApp.faq);
    const formRef = useRef(null);
    const [tabValue, setTabValue] = useState(0);
    const [categorie, setCategorie] = useState(null);
    const { form, handleChange, setForm } = useForm(null);

    useEffect(() => {
        dispatch(Actions.getCategoriess());
    }, [dispatch]);
    useEffect(() => {
        function updateFaqstate() {
            const params = props.match.params;
            const { faqId } = params;

            if (faqId === 'new') {
                dispatch(Actions.newFaq());
            }
            else {
                dispatch(Actions.getFaq(faqId));

            }
        }

        updateFaqstate();
        return () => {
            dispatch(Actions.cleanUp())
        }

    }, [dispatch, props.match.params]);


    //SET ERRORS IN INPUTS AFTER ERROR API
    useEffect(() => {
        if (faq.error && tabValue === 0 && (faq.error.question || faq.error.reponse)) {
            formRef.current.updateInputsWithError({
                ...faq.error
            });
        }
    }, [faq.error]);

    //SET FORM DATA
    useEffect(() => {
        if (
            (faq.data && !form) ||
            (faq.data && form && faq.data.id !== form.id)
        ) {

            if (faq.data.categorie) {
                setCategorie({
                    value: faq.data.categorie['@id'],
                    label: faq.data.categorie.name
                })
            }
            setForm({ ...faq.data });
        }

    }, [form, faq.data, setForm]);


    function handleSubmit(model) {

        const params = props.match.params;
        const { faqId } = params;
        if (faqId === 'new') {
            dispatch(Actions.saveFaq(form, props.history));
        }
        else {

            dispatch(Actions.updateFaq(form, props.history));
        }
        //  dispatch(Actions.updateUserInfo(model, form.id));
    }
    function handleChipChange(value, name) {

        setCategorie(value);
        setForm(_.set({ ...form }, name, value));

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
                                <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/admin/faqs" color="inherit">
                                    <Icon className="mr-4 text-20">arrow_back</Icon>
                                    Faqs
                                </Typography>
                            </FuseAnimate>

                            <div className="flex items-center max-w-full">


                                <div className="flex flex-col min-w-0">
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography className="text-16 sm:text-20 truncate">
                                            {form.question ? form.question : 'Nouveau Faq'}

                                        </Typography>
                                    </FuseAnimate>

                                </div>
                            </div>
                        </div>
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>


                            <Button
                                className="whitespace-no-wrap"
                                variant="contained"
                                disabled={faq.loading || !form.question || !form.reponse}
                                onClick={() => handleSubmit(form)}
                            >
                                Sauvegarder
                                    {faq.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </Button>
                        </FuseAnimate>

                    </div>
                )
            }
            contentToolbar={

                form && (
                    <Tabs
                        value={tabValue}
                        onChange={(e, value) => setTabValue(value)}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                        classes={{ root: "w-full h-64" }}
                    >
                        <Tab className="h-64 normal-case" label="Infos faq" />
                    </Tabs>)

            }
            content={
                faq.requestFaq ? <LinearProgress color="secondary" /> :
                    form && (
                        <div className=" sm:p-10 max-w-2xl">

                            {tabValue === 0 && (
                                <Formsy
                                    ref={formRef}
                                    className="flex pt-5 flex-col ">
                                    <Grid container spacing={2} >

                                        <Grid item xs={12} sm={8}>
                                            <TextFieldFormsy
                                                className="mb-16"
                                                type="text"
                                                name="question"
                                                value={form.question}
                                                onChange={handleChange}
                                                label="Question"
                                                validations={{
                                                    minLength: 4
                                                }}
                                                validationErrors={{
                                                    minLength: 'La longueur minimale de caractère est 4'
                                                }}
                                                variant="outlined"
                                                required
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <SelectReactFormsy
                                                id="categorie"
                                                name="categorie"
                                                value={
                                                    categorie
                                                }
                                                placeholder="Sélectionner une categorie"
                                                textFieldProps={{
                                                    label: 'Catégories',
                                                    InputLabelProps: {
                                                        shrink: true
                                                    },
                                                    variant: 'outlined'
                                                }}

                                                className="mb-16"
                                                options={faq.categories}
                                                onChange={(value) => handleChipChange(value, 'categorie')}
                                            />
                                        </Grid>




                                    </Grid>


                                    <Grid container spacing={3}>


                                        <Grid item xs={12} sm={12}>
                                            <TextFieldFormsy
                                                className="mb-16"
                                                type="text"
                                                name="reponse"
                                                value={form.reponse}
                                                onChange={handleChange}
                                                label="Réponse"
                                                validations={{
                                                    minLength: 10
                                                }}
                                                validationErrors={{
                                                    minLength: 'La longueur minimale de caractère est 10'
                                                }}
                                                variant="outlined"
                                                multiline
                                                rows="8"
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>

                                </Formsy>
                            )}




                        </div>
                    )

            }
            innerScroll
        />
    )
}

export default withReducer('faqsApp', reducer)(Faq);
