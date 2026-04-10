import React, { useRef, useEffect } from "react";
import withReducer from "app/store/withReducer";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/styles";
import clsx from "clsx";
import {
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  ListItemText,
  Popper,
  Typography,
  Chip,
  Icon,
} from "@material-ui/core";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { FuseAnimate } from "@fuse";
import Formsy from "formsy-react";
import StepConnector from "@material-ui/core/StepConnector";
import PropTypes from "prop-types";
import DomainIcon from "@material-ui/icons/Domain";
import SettingsIcon from "@material-ui/icons/Settings";
import _ from "@lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Helmet } from "react-helmet";
import Autosuggest from "react-autosuggest";
import green from "@material-ui/core/colors/green";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Highlighter from "react-highlight-words";

/**=============== FOUNRISSEUR SOUS-SECTEURS ======================= */
const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 900,
    padding: "20px",
    height: "auto",
  },
  chips: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
  },
  select: {
    zIndex: 999,
  },
  root: {
    background:
      "radial-gradient(" +
      darken(theme.palette.primary.dark, 0.5) +
      " 0%, " +
      theme.palette.primary.dark +
      " 80%)",
    color: theme.palette.primary.contrastText,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  container: {
    position: "relative",
    width: "100%",
  },

  suggestion: {
    display: "block",
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  },
  divider: {
    height: theme.spacing(2),
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  labelBold: {
    fontWeight: "bold!important",
  },
  alert: {
    backgroundColor: " #ebf8ff",
    color: "#2b6cb0!important",
    borderColor: "#2b6cb0!important",
  },
}));



const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage: "linear-gradient(45deg, #5AFF15 30%, #00B712 90%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage: "linear-gradient(45deg, #5AFF15 30%, #00B712 90%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage: "linear-gradient(45deg, #5AFF15 30%, #00B712 90%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage: "linear-gradient(45deg, #5AFF15 30%, #00B712 90%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <Icon>person_add</Icon>,
    2: <DomainIcon />,
    3: <SettingsIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

function getSteps() {
  return ["Inscription", "Informations de la société", "Produits"];
}
function renderSuggestion(suggestion, { query, isHighlighted }) {
  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      className="z-999"
      dense={true}
    >
      <ListItemText
        className="pl-0 "
        primary={
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={[query]}
            autoEscape={true}
            textToHighlight={suggestion.name}
          />
        }
      />
    </MenuItem>
  );
}

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => { }, ref, ...other } = inputProps;
  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: (node) => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function Step3App(props) {
  console.log("[STEP3 DEBUG] Mounting Step3App");
  const suggestionsNode = useRef(null);
  const popperNode = useRef(null);
  const searchCategories = useSelector(
    ({ step3App }) => {
      console.log("[STEP3 DEBUG] useSelector step3App:", step3App);
      return step3App ? step3App.searchCategories : null;
    }
  );
  const [categories, setCategories] = React.useState([]);
  const [produitsSuggestion, setProduitsSuggestion] = React.useState([]);

  const dispatch = useDispatch();
  const classes = useStyles();
  const steps = getSteps();
  const user = useSelector(({ auth }) => {
    console.log("[STEP3 DEBUG] useSelector auth:", auth);
    return auth ? auth.user : null;
  });

  //const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  const step3 = useSelector(({ step3App }) => step3App ? step3App.step3 : { loading: false, success: false });

  //const { form, handleChange, setForm } = useForm(defaultFormState);



  /*const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    */
  useEffect(() => {
    if (step3.success) {
      if (step3.redirect_success) {
        props.history.push(step3.redirect_success);
      }
    }
  }, [props.history, step3.redirect_success, step3.success]);
  /*
        function disableButton() {
            setIsFormValid(false);
        }
    
        function enableButton() {
            setIsFormValid(true);
        }
    */
  function handleSubmit(model) {
    let data = {
      categories: _.map(categories, function (value, key) {
        return value["@id"];
      }),
      autreCategories:
        produitsSuggestion.length > 0
          ? _.join(_.map(produitsSuggestion, "value"), ", ")
          : null,
    };
    dispatch(Actions.setStep3(data, user.id, props.history));
  }

  function handleChangeSearch(event) {
    dispatch(Actions.setGlobalSearchText(event));
  }
  function showSearch() {
    dispatch(Actions.showSearch());
    document.addEventListener("keydown", escFunction, false);
  }

  function escFunction(event) {
    if (event.keyCode === 27) {
      hideSearch();
      dispatch(Actions.cleanUp());
    }
  }

  function hideSearch() {
    dispatch(Actions.hideSearch());
    document.removeEventListener("keydown", escFunction, false);
  }

  function handleSuggestionsFetchRequested({ value, reason }) {
    if (reason === "input-changed") {
      value &&
        value.trim().length > 1 &&
        dispatch(Actions.loadSuggestions(value.trim()));
      // Fake an AJAX call
    }
  }
  function handleSuggestionsClearRequested() {
    //dispatch(Actions.hideSearch());
  }
  const autosuggestProps = {
    renderInputComponent,
    //alwaysRenderSuggestions: true,
    suggestions: searchCategories.suggestions,
    focusInputOnSuggestionClick: false,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    renderSuggestion,
  };

  function handleDelete(id) {
    setCategories(
      _.reject(categories, function (o) {
        return o.id === id;
      })
    );
  }

  function addProduitSuggestion(event) {
    if (!_.find(produitsSuggestion, ["value", searchCategories.searchText])) {
      setProduitsSuggestion([
        ...produitsSuggestion,
        { value: searchCategories.searchText },
      ]);
      hideSearch();
      dispatch(Actions.cleanUp());
    }
  }
  function escProduitSuggestion(event) {
    hideSearch();
    dispatch(Actions.cleanUp());
  }

  function handleDeleteProduit(value) {
    setProduitsSuggestion(
      _.reject(produitsSuggestion, function (o) {
        return o.value === value;
      })
    );
  }
  if (!searchCategories || !user) {
    console.warn("[STEP3 DEBUG] Missing data before return, returning null", { searchCategories, user });
    return null;
  }

  return (
    <div
      className={clsx(

        classes.root,
        "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32"
      )}
    >
      <Helmet>
        <title>Inscription Fournisseur| Les Achats Industriels</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex" />
      </Helmet>
      <div className="flex flex-col items-center full-width justify-center">
        <FuseAnimate animation="transition.expandIn">
          <Card className={classes.card}>
            <CardContent>
              <Stepper
                alternativeLabel
                activeStep={2}
                connector={<ColorlibConnector />}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      classes={{
                        label: "font-bold",
                        alternativeLabel: classes.labelBold,
                      }}
                      StepIconComponent={ColorlibStepIcon}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <div className="w-full">
                <Formsy
                  onValidSubmit={handleSubmit}
                  // onValid={enableButton}
                  //onInvalid={disableButton}
                  ref={formRef}
                  className="flex flex-col justify-center w-full"
                >
                  <div ref={popperNode}>
                    <Typography
                      variant="h6"
                      className="text-center uppercase mb-16 "
                    >
                      Une dernière étape pour finaliser votre inscription !
                    </Typography>
                    <div
                      className={clsx(
                        "rounded py-8 px-4 border-t-4 shadow-md mb-16",
                        classes.alert
                      )}
                      role="alert"
                    >
                      <div className="flex items-center">
                        <Icon className="mr-2">info</Icon>
                        <Typography className="font-bold">
                          Plus vous sélectionnez de produits, plus vous
                          receverez des demandes d'achats.
                        </Typography>
                      </div>
                    </div>
                    <ul className="mb-24 text-12 font-600">
                      <li className="mb-4">
                        Tapez un mot clé, utilisez des termes génériques (ex:
                        Chariot élévateur).{" "}
                      </li>
                      <li>Choisissez au moins un produit de votre activité.</li>
                    </ul>
                    <Autosuggest
                      {...autosuggestProps}
                      getSuggestionValue={(suggestion) =>
                        searchCategories.searchText
                      }
                      onSuggestionSelected={(event, { suggestion, method }) => {
                        if (method === "enter") {
                          event.preventDefault();
                        }
                        !_.find(categories, ["name", suggestion.name]) &&
                          setCategories([suggestion, ...categories]);
                        //setForm(_.set({ ...form }, 'categories', suggestion['@id']))
                        //hideSearch();
                        popperNode.current.focus();
                      }}
                      required
                      inputProps={{
                        classes,
                        label: "Produits",
                        inputRef: (node) => {
                          if (popperNode) {
                            popperNode.current = node;
                          }
                        },
                        placeholder: "ex: Chariot élévateur",
                        value: searchCategories.searchText,
                        variant: "outlined",
                        name: "categories",
                        onChange: handleChangeSearch,
                        onFocus: showSearch,
                        InputLabelProps: {
                          shrink: true,
                        },
                      }}
                      theme={{
                        container: classes.container,
                        suggestionsContainerOpen:
                          classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                      }}
                      renderSuggestionsContainer={(options) => (
                        <Popper
                          anchorEl={popperNode.current}
                          open={
                            Boolean(options.children) ||
                            searchCategories.noSuggestions ||
                            searchCategories.loading
                          }
                          placement="bottom-start" // 👈 Ajoute ceci
                          popperOptions={{ positionFixed: false }} // 👈 ou retire cette ligne si pas nécessaire
                          className="z-9999"
                        >
                          <div ref={suggestionsNode}>
                            <Paper
                              elevation={1}
                              square
                              {...options.containerProps}
                              style={{
                                width: popperNode.current
                                  ? popperNode.current.clientWidth
                                  : null,
                              }}
                            >
                              {options.children}
                              {searchCategories.noSuggestions && (
                                <Typography className="px-16 py-12">
                                  Ce produit n'existe pas encore sur notre base
                                  de données. <br />
                                  Ajouter ce produit{" "}
                                  <Button
                                    size="small"
                                    onClick={addProduitSuggestion}
                                    variant="contained"
                                    color="secondary"
                                  >
                                    oui
                                  </Button>{" "}
                                  <Button
                                    size="small"
                                    onClick={escProduitSuggestion}
                                    variant="outlined"
                                    color="primary"
                                  >
                                    non
                                  </Button>
                                </Typography>
                              )}
                              {searchCategories.loading && (
                                <div className="px-16 py-12 text-center">
                                  <CircularProgress color="secondary" /> <br />{" "}
                                  Chargement ...
                                </div>
                              )}
                            </Paper>
                          </div>
                        </Popper>
                      )}
                    />
                  </div>
                  {categories && categories.length > 0 && (
                    <Typography paragraph className="mt-8 mb-2 font-bold">
                      Produit(s) sélectioné(s)
                    </Typography>
                  )}
                  <div className={clsx(classes.chips)}>
                    {categories &&
                      categories.length > 0 &&
                      categories.map((item) => (
                        <Chip
                          key={item.id}
                          color="secondary"
                          label={item.name}
                          onDelete={() => handleDelete(item.id)}
                          className="mt-8 mr-8"
                        />
                      ))}
                  </div>

                  {produitsSuggestion && produitsSuggestion.length > 0 && (
                    <>
                      <Typography paragraph className="mt-8 mb-2 font-bold">
                        Produit(s) suggéré(s)
                      </Typography>
                      <Typography variant="caption" className="">
                        Ce produit sera activé une fois validé par
                        administrateur, Merci.
                      </Typography>
                    </>
                  )}
                  <div className={clsx(classes.chips)}>
                    {produitsSuggestion &&
                      produitsSuggestion.length > 0 &&
                      produitsSuggestion.map((item) => (
                        <Chip
                          key={item.value}
                          color="secondary"
                          label={item.value}
                          onDelete={() => handleDeleteProduit(item.value)}
                          className="mt-8 mr-8"
                        />
                      ))}
                  </div>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16 normal-case"
                    aria-label="Suivant"
                    disabled={
                      step3.loading ||
                      (categories.length === 0 &&
                        produitsSuggestion.length === 0)
                    }
                    value="legacy"
                  >
                    Terminer
                    {step3.loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                </Formsy>
              </div>
            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default withReducer("step3App", reducer)(Step3App);
