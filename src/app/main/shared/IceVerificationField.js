import React, { useState } from 'react';
import {
  TextField, Button, CircularProgress, InputAdornment,
  Tooltip, Snackbar, Chip, Paper, Typography, Divider, Collapse, IconButton
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import BusinessIcon from '@material-ui/icons/Business';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import agent from 'agent';

/**
 * Composant de vérification ICE - Maroc
 * @param {string} value - Valeur actuelle de l'ICE
 * @param {function} onChange - Callback pour mettre à jour la valeur de l'ICE dans le parent
 * @param {function} onVerifySuccess - Callback appelé avec les données de l'entreprise quand trouvée
 */
function IceVerificationField({ value, onChange, onVerifySuccess }) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [foundData, setFoundData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const showSnack = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const snackbarColors = {
    success: { background: '#43a047', icon: <CheckCircleIcon style={{ color: 'white', marginRight: 8 }} /> },
    warning: { background: '#fb8c00', icon: <WarningIcon style={{ color: 'white', marginRight: 8 }} /> },
    error:   { background: '#e53935', icon: <ErrorOutlineIcon style={{ color: 'white', marginRight: 8 }} /> },
    info:    { background: '#1e88e5', icon: <InfoIcon style={{ color: 'white', marginRight: 8 }} /> },
  };

  const handleVerify = async () => {
    if (!value || value.length !== 15) {
      showSnack("Veuillez saisir un ICE valide de 15 chiffres.", 'warning');
      return;
    }

    setLoading(true);
    setFoundData(null);
    setShowDetails(false);

    try {
      const response = await agent.post('/api/ice/verify', { ice: value });
      const { success, found, data, message } = response.data;

      if (success && found && data) {
        setFoundData(data);
        setShowDetails(true);
        showSnack(`Entreprise trouvée : ${data.companyName}`, 'success');
        if (onVerifySuccess) {
          onVerifySuccess(data);
        }
      } else {
        showSnack(message || "Aucune entreprise trouvée pour cet ICE.", 'warning');
      }
    } catch (error) {
      showSnack("Erreur lors de la vérification de l'ICE. Veuillez remplir manuellement.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFoundData(null);
    setShowDetails(false);
    onChange('');
  };

  const isValid15 = value && value.length === 15 && /^\d+$/.test(value);

  const currentSnack = snackbarColors[snackbar.severity] || snackbarColors.info;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Champ ICE */}
      <TextField
        label="ICE (Identifiant Commun de l'Entreprise)"
        variant="outlined"
        value={value}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 15);
          onChange(val);
          if (foundData) { setFoundData(null); setShowDetails(false); }
        }}
        fullWidth
        disabled={loading}
        helperText={
          value
            ? isValid15
              ? "ICE valide — cliquez sur Vérifier"
              : `${value.length}/15 chiffres`
            : "Ex: 001531606000066"
        }
        InputProps={{
          inputProps: { maxLength: 15, inputMode: 'numeric' },
          startAdornment: (
            <InputAdornment position="start">
              <BusinessIcon color={isValid15 ? 'primary' : 'action'} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" style={{ gap: '4px' }}>
              {value && (
                <IconButton size="small" onClick={handleClear} title="Effacer">
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
              <Tooltip title={!isValid15 ? "Saisissez 15 chiffres pour vérifier" : "Vérifier l'ICE sur la base nationale"}>
                <span>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={handleVerify}
                    disabled={loading || !isValid15}
                    style={{ whiteSpace: 'nowrap', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {loading
                      ? <CircularProgress size={16} color="inherit" />
                      : foundData
                        ? <CheckCircleIcon style={{ fontSize: 18 }} />
                        : <SearchIcon style={{ fontSize: 18 }} />
                    }
                    <span style={{ marginLeft: '4px' }}>
                      {loading ? 'Vérification...' : foundData ? 'Vérifié ✓' : 'Vérifier'}
                    </span>
                  </Button>
                </span>
              </Tooltip>
            </InputAdornment>
          )
        }}
      />

      {/* Résultat : fiche entreprise */}
      <Collapse in={showDetails && !!foundData}>
        {foundData && (
          <Paper
            variant="outlined"
            style={{
              padding: '16px',
              borderColor: '#4caf50',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleIcon style={{ color: '#4caf50' }} />
                <Typography variant="subtitle1" style={{ fontWeight: 700, color: '#2e7d32' }}>
                  {foundData.companyName}
                </Typography>
              </div>
              {foundData.statut && (
                <Chip
                  label={foundData.statut}
                  size="small"
                  style={{
                    backgroundColor: foundData.statut.includes('ACTIVITE') ? '#4caf50' : '#f44336',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '11px'
                  }}
                />
              )}
            </div>

            <Divider style={{ margin: '8px 0', backgroundColor: '#c8e6c9' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
              {foundData.legalForm && (
                <InfoRow label="Forme juridique" value={foundData.legalForm} />
              )}
              {foundData.rc && (
                <InfoRow label="RC" value={foundData.rc} />
              )}
              {foundData.city && (
                <InfoRow label="Ville" value={foundData.city} />
              )}
              {foundData.capital && (
                <InfoRow label="Capital" value={foundData.capital} />
              )}
              {foundData.creationDate && (
                <InfoRow label="Création" value={foundData.creationDate} />
              )}
              {foundData.ice && (
                <InfoRow label="ICE" value={foundData.ice} />
              )}
            </div>

            {foundData.activity && (
              <>
                <Divider style={{ margin: '8px 0', backgroundColor: '#c8e6c9' }} />
                <Typography variant="caption" style={{ color: '#558b2f', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                  Activité :
                </Typography>
                <Typography variant="caption" style={{ color: '#33691e', lineHeight: 1.5 }}>
                  {foundData.activity}
                </Typography>
              </>
            )}

            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="caption" style={{ color: '#81c784', fontStyle: 'italic' }}>
                Source : ice.marocfacture.com
              </Typography>
            </div>
          </Paper>
        )}
      </Collapse>

      {/* Snackbar sans @material-ui/lab */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper
          style={{
            backgroundColor: currentSnack.background,
            color: 'white',
            padding: '10px 16px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '300px',
            boxShadow: '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)'
          }}
        >
          {currentSnack.icon}
          <Typography variant="body2" style={{ color: 'white', flex: 1 }}>
            {snackbar.message}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setSnackbar(s => ({ ...s, open: false }))}
            style={{ color: 'white', marginLeft: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Snackbar>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="caption" style={{ color: '#558b2f', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body2" style={{ color: '#1b5e20', fontWeight: 500 }}>
        {value}
      </Typography>
    </div>
  );
}

export default IceVerificationField;
