import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Icon,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Duree from "./steps/Duree";
import Activites from "./steps/Activites";
import Paiement from "./steps/Paiement";
import _ from "@lodash";
import Recapitulatif from "./steps/Recapitulatif";
import green from "@material-ui/core/colors/green";
import Offre from "./steps/Offre";
import { LOCAL_CURRENCY } from "@fuse";

function getStepsNewCommande() {
  return ["Durée", "Paiement"];
}
function getStepsEditCommande() {
  return ["Offre", "Durée", "Paiement"];
}

const useStyles = makeStyles((theme) => ({
  badge: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.getContrastText(theme.palette.error.main),
  },
  price: {
    backgroundColor: theme.palette.primary[600],
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ddd",
  },
  populaire: {
    "&:before": {
      content: "ddddddd",
    },
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  dialogPaper: { overflow: "visible" },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function CommandeDialog(props) {
  const classes = useStyles();
  const { currency } = props;
  const defaultFormState = {
    currency: currency,
    sousSecteurs: [],
    suggestions: [],
  };
  const dispatch = useDispatch();
  const commande = useSelector(({ facturationApp }) => facturationApp.commande);
  const commandeDialog = useSelector(
    ({ facturationApp }) => facturationApp.commande.commandeDialog
  );
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPack, setSelectedPack] = useState(defaultFormState);
  const steps =
    commandeDialog.type === "new"
      ? getStepsNewCommande()
      : getStepsEditCommande();

  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (commandeDialog.type === "edit" && commandeDialog.data) {
      dispatch(Actions.getOffres());
      setSelectedPack({
        ...commandeDialog.data,
        sousSecteurs: commandeDialog.data.sousSecteurs.map((item) => ({
          value: item["@id"],
          label: item.secteur.name + ": " + item.name,
        })),
        mode: commandeDialog.data.mode["@id"],
        currency: currency,
      });
    }

    /**
     * Dialog type: 'new'
     */
    if (commandeDialog.type === "new") {
      setSelectedPack({
        ...defaultFormState,
        ...commandeDialog.data,
      });
    }
  }, [commandeDialog.data, commandeDialog.type, setSelectedPack]);

  useEffect(() => {
    /**
     * After Dialog Open
     */
    if (commandeDialog.props.open) {
      initDialog();
    }
  }, [commandeDialog.props.open, initDialog]);

  console.log(commande.success);

  useEffect(() => {
    /**
     * After commande Passe
     */
    if (!commande.success) {
      return;
    }
    console.log("fff");
    if (commandeDialog.type === "new") {
      setActiveStep(3);
    } else {
      setActiveStep(4);
    }
    return () => {
      dispatch(Actions.cleanUp());
    };
  }, [commande.success, setActiveStep]);

  function getStepContentEditCommande(step) {
    switch (step) {
      case 0:
        return (
          <Offre
            commande={commande}
            selected={selectedPack}
            onChange={handleChangeOffre}
          />
        );
      case 1:
        return (
          <Duree
            durees={commande.durees}
            loading={commande.loadingDuree}
            selected={selectedPack}
            handleGetMontantPerMonth={getMontantPerMonth}
            handlegetMontantPerYear={getMontantPerYear}
            onChange={handleChangeDuree}
          />
        );
     /*  case 2:
        return (
          <Activites
            commande={commande}
            selected={selectedPack}
            handleChipChange={handleChipChange}
            handleChangeAutre={handleChangeAutre}
            handleAddSuggestion={handleAddSuggestion}
            handleDeleteActivite={handleDeleteActivite}
          />
        ); */
      case 2:
        return (
          <Paiement
            commande={commande}
            selected={selectedPack}
            handleChangeModePaiement={handleChangeModePaiement}
          />
        );
      case 3:
        return (
          <Recapitulatif
            selected={selectedPack}
            handleGetMontantPerMonth={getMontantPerMonth}
          />
        );
      case 4:
        return (
          <div className="flex flex-col  items-center justify-center h-full">
            <Icon style={{ color: green[600], fontSize: 120 }}>done</Icon>
            <Typography color="textSecondary" variant="h5">
              Votre commande d'abonnement est bien enregistrée, un mail vous
              sera envoyé dès la validation de votre commande. <br />
              Nous vous remercions pour votre confiance!
            </Typography>
          </div>
        );

      default:
        return "";
    }
  }

  function getStepContentNewCommande(step) {
    switch (step) {
      case 0:
        return (
          <Duree
            durees={commande.durees}
            loading={commande.loadingDuree}
            selected={selectedPack}
            handleGetMontantPerMonth={getMontantPerMonth}
            handlegetMontantPerYear={getMontantPerYear}
            onChange={handleChangeDuree}
          />
        );
     /*  case 1:
        return (
          <Activites
            commande={commande}
            selected={selectedPack}
            handleChipChange={handleChipChange}
            handleChangeAutre={handleChangeAutre}
            handleAddSuggestion={handleAddSuggestion}
            handleDeleteActivite={handleDeleteActivite}
          />
        ); */
      case 1:
        return (
          <Paiement
            commande={commande}
            selected={selectedPack}
            handleChangeModePaiement={handleChangeModePaiement}
          />
        );
      case 2:
        return (
          <Recapitulatif
            selected={selectedPack}
            handleGetMontantPerMonth={getMontantPerMonth}
          />
        );
      case 3:
        return (
          <div className="flex flex-col  items-center justify-center h-full">
            <Icon style={{ color: green[600], fontSize: 120 }}>done</Icon>
            <Typography color="textSecondary" variant="h5">
              Votre commande d'abonnement est bien enregistrée, un mail vous
              sera envoyé dès la validation de votre commande. <br />
              Nous vous remercions pour votre confiance!
            </Typography>
          </div>
        );

      default:
        return "";
    }
  }

  function getButtonsNewCommande(step) {
    switch (step) {
      case 0:
        return (
          <Button variant="contained" color="primary" disabled={!selectedPack.duree} onClick={handleNext}>
            {" "}
            Suivant
          </Button>
        );
      /* case 1:
        return (
          <Button
            variant="contained"
            color="primary"
            disabled={
              !selectedPack.sousSecteurs.length &&
              !selectedPack.suggestions.length
            }
            onClick={handleNext}
          >
            {" "}
            Suivant
          </Button>
        ); */
      case 1:
        return (
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedPack.mode}
            onClick={handleNext}
          >
            {" "}
            Suivant
          </Button>
        ); 
      case 2:
        return (
          <Button
            variant="contained"
            color="primary"
            disabled={commande.loading}
            onClick={handleSubmit}
          >
            {commande.loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
            Passer la commande
          </Button>
        );
      default:
        return "";
    }
  }
  function getButtonsEditCommande(step) {
    switch (step) {
      case 0:
      case 1:
        return (
          <Button variant="contained" color="primary" onClick={handleNext}>
            {" "}
            Suivant
          </Button>
        );
      case 2:
        return (
          <Button
            variant="contained"
            color="primary"
            disabled={
              !selectedPack.sousSecteurs.length &&
              !selectedPack.suggestions.length
            }
            onClick={handleNext}
          >
            {" "}
            Suivant
          </Button>
        );
      case 3:
        return (
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedPack.mode}
            onClick={handleNext}
          >
            {" "}
            Suivant
          </Button>
        );
      case 4:
        return (
          <Button
            variant="contained"
            color="primary"
            disabled={
              commande.loading ||
              !selectedPack.mode ||
              !selectedPack.offre
            }
            onClick={handleSubmit}
          >
            {commande.loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
            Passer la commande
          </Button>
        );
      default:
        return "";
    }
  }

  useEffect(() => {
    dispatch(Actions.getDurees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(Actions.getSecteurs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(Actions.getPaiements());
  }, [dispatch]);

  useEffect(() => {
    if (commande.durees && !selectedPack.duree) {
      setSelectedPack({ ...selectedPack, duree: commande.durees[0] });
    }
  }, [selectedPack, commande.durees, setSelectedPack]);

  function handleChangeModePaiement(event) {
    setSelectedPack({ ...selectedPack, mode: event.target.value });
  }

  function handleChangeAutre(event) {
    setSelectedPack({ ...selectedPack, autreActivite: event.target.value });
  }

  function handleChipChange(value, name) {
    setSelectedPack({ ...selectedPack, showAutre: false });
    if (name === "activites") {
      if (value.value === "/api/sous_secteurs/98") {
        setSelectedPack({ ...selectedPack, showAutre: true });
        return;
      }
      if (
        selectedPack.sousSecteurs.length + selectedPack.suggestions.length ===
        selectedPack.offre.nbActivite
      ) {
        return;
      }
      if (!_.find(selectedPack.sousSecteurs, ["value", value.value])) {
        let v = value;
        v.label = selectedPack.secteur.label + ": " + v.label;
        setSelectedPack({
          ...selectedPack,
          sousSecteurs: [v, ...selectedPack.sousSecteurs],
        });
      }
    } else {
      if (value.value) {
        setSelectedPack({ ...selectedPack, secteur: value });
        dispatch(Actions.getSousSecteurs(value.value));
      }
    }
  }

  function handleAddSuggestion(value) {
    if (value.length < 2) {
      return;
    }
    if (_.find(selectedPack.suggestions, ["sousSecteur", value])) {
      setSelectedPack({ ...selectedPack, autreActivite: null });
      return;
    }
    if (
      selectedPack.sousSecteurs.length + selectedPack.suggestions.length ===
      selectedPack.offre.nbActivite
    ) {
      setSelectedPack({ ...selectedPack, autreActivite: null });
      return;
    }
    let suggestion = {
      secteur: selectedPack.secteur,
      sousSecteur: value,
    };
    setSelectedPack({
      ...selectedPack,
      suggestions: [suggestion, ...selectedPack.suggestions],
      autreActivite: null,
    });
  }

  function handleDeleteActivite(id, collection) {
    if (collection === "suggestions") {
      const suggestions = selectedPack.suggestions.filter(
        (s) => s.sousSecteur !== id
      );
      setSelectedPack({ ...selectedPack, suggestions });
      return;
    }
    setSelectedPack({
      ...selectedPack,
      sousSecteurs: _.reject(selectedPack.sousSecteurs, function (o) {
        return o.value === id;
      }),
    });
  }

  function handleChangeDuree(duree) {
    setSelectedPack({ ...selectedPack, duree });
  }

  function handleChangeOffre(offre) {
    setSelectedPack({ ...selectedPack, offre });
  }

  function getMontantPerMonth(duree) {
    if (!selectedPack.offre || !duree) {
      return;
    }
    if (!duree.remise) {
      if (currency === LOCAL_CURRENCY) return selectedPack.offre.prixMad;
      else return selectedPack.offre.prixEur;
    }
    if (selectedPack.currency === LOCAL_CURRENCY) {
      let remise =
        selectedPack.offre.prixMad -
        (selectedPack.offre.prixMad * duree.remise) / 100;
      return remise;
    }
    let remise =
      selectedPack.offre.prixEur -
      (selectedPack.offre.prixEur * duree.remise) / 100;
    return remise;
  }

  function getMontantPerYear(duree) {
    if (!selectedPack.offre || !duree) {
      return;
    }
    let montantPerMonth = getMontantPerMonth(duree);
    let montant = montantPerMonth * 12;
    return montant;
  }

  const closeComposeDialog = () => {
    commandeDialog.type === "edit"
      ? dispatch(Actions.closeEditCommandeDialog())
      : dispatch(Actions.closeNewCommandeDialog());

    setSelectedPack({ currency: currency, sousSecteurs: [], suggestions: [] });
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function handleSubmit() {
    if (
      !selectedPack.mode ||
      !selectedPack.offre
    ) {
      return;
    }
    if (commandeDialog.type === "edit") {
      if (selectedPack.renew) {
        //Renouvellement
        dispatch(Actions.RenewAbonnementCommande(selectedPack));
      } else {
        //Edit Commande
        dispatch(Actions.updateCommande(selectedPack));
      }
    } else {
      //New Commande
      dispatch(Actions.saveCommande(selectedPack));
    }
  }

  return (
    <div>
      <Dialog
        classes={{
          paper: "m-24 rounded-16 shadow-2xl",
        }}
        {...commandeDialog.props}
        onClose={closeComposeDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          disableTypography
          className="flex flex-col text-center relative border-b border-gray-200"
          id="alert-dialog-title"
        >
          <IconButton
            onClick={closeComposeDialog}
            style={{ position: 'absolute', right: 8, top: 8, color: '#94a3b8' }}
            size="small"
          >
            <Icon>close</Icon>
          </IconButton>
          <Typography variant="h6" className="font-extrabold uppercase mb-16">
            Activation d'abonnement
          </Typography>
          {steps && (
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
        </DialogTitle>
        <DialogContent
          dividers
          className={clsx("min-h-xs text-center", classes.dialogPaper)}
        >
          <Typography variant="h6">
            {selectedPack.offre && activeStep <= 2 && selectedPack.offre.name}
          </Typography>

          <div>
            {commandeDialog.type === "new"
              ? getStepContentNewCommande(activeStep)
              : getStepContentEditCommande(activeStep)}
          </div>
        </DialogContent>
        <DialogActions className="flex justify-end p-24 gap-12 bg-gray-50 border-t border-gray-200">
          <Button
            onClick={closeComposeDialog}
            disabled={commande.loading}
            color="default"
            style={{ color: '#64748b' }}
            className={clsx(
              ((activeStep >= 4 && commandeDialog.type === "new") ||
                (activeStep >= 5 && commandeDialog.type === "edit")) &&
                "hidden"
            )}
          >
            Annuler
          </Button>
          <Button
            disabled={activeStep === 0 || commande.loading}
            onClick={handleBack}
            variant="outlined"
            className={clsx(
              ((activeStep >= 4 && commandeDialog.type === "new") ||
                (activeStep >= 5 && commandeDialog.type === "edit")) &&
                "hidden"
            )}
            style={{ borderRadius: 8, borderColor: '#cbd5e1', color: '#475569' }}
          >
            Précédent
          </Button>
          {commandeDialog.type === "new"
            ? getButtonsNewCommande(activeStep)
            : getButtonsEditCommande(activeStep)}
          <Button
            onClick={closeComposeDialog}
            disabled={commande.loading}
            color="primary"
            variant="contained"
            style={{ borderRadius: 8, padding: '8px 24px', background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}
            className={clsx(
              !((activeStep >= 4 && commandeDialog.type === "new") ||
                (activeStep >= 5 && commandeDialog.type === "edit")) &&
                "hidden"
            )}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CommandeDialog;
