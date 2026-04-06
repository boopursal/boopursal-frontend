import React from 'react';
import MailchimpSubscribe from "react-mailchimp-subscribe"
import { Grid, Button, Icon, Paper, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    inputPaper: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderRadius: 12,
        background: 'var(--portal-surface)',
        border: '1px solid var(--portal-border)',
        boxShadow: 'var(--portal-card-shadow)',
        transition: 'all 0.3s ease',
        '&:focus-within': {
            borderColor: 'rgba(255, 90, 90, 0.4)',
            boxShadow: '0 0 0 4px rgba(255, 90, 90, 0.1)',
        }
    },
    input: {
        border: 'none',
        outline: 'none',
        padding: '12px',
        width: '100%',
        fontSize: '1rem',
        color: 'var(--portal-text)',
        background: 'transparent',
        '&::placeholder': {
            color: 'var(--portal-muted)',
        }
    },
    submitButton: {
        height: '100%',
        padding: '12px 32px',
        borderRadius: 12,
        background: 'linear-gradient(135deg, #ff5a5a 0%, #ff8a8a 100%)',
        color: '#ffffff',
        fontWeight: 700,
        textTransform: 'none',
        fontSize: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: 'none',
        '&:hover': {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff9a9a 100%)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
        }
    },
    statusMessage: {
        marginBottom: theme.spacing(2),
        fontSize: '0.9rem',
        fontWeight: 500,
    }
}));

const CustomForm = ({ status, message, onValidated }) => {
    const classes = useStyles();
    let email;
    const submit = () =>
        email &&
        email.value.indexOf("@") > -1 &&
        onValidated({
            EMAIL: email.value,
        });

    return (
        <div style={{ width: '100%' }}>
            {status === "sending" && <div className={classes.statusMessage} style={{ color: "var(--portal-text)" }}>Envoi en cours...</div>}
            {status === "error" && (
                <div
                    className={classes.statusMessage}
                    style={{ color: "#fca5a5" }}
                    dangerouslySetInnerHTML={{ __html: message }}
                />
            )}
            {status === "success" && (
                <div
                    className={classes.statusMessage}
                    style={{ color: "#86efac" }}
                    dangerouslySetInnerHTML={{ __html: message }}
                />
            )}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <div className={classes.inputPaper}>
                        <Icon style={{ color: '#9ca3af' }}>mail_outline</Icon>
                        <input
                            className={classes.input}
                            ref={node => (email = node)}
                            type="email"
                            placeholder="votre-email@exemple.com"
                        />
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button
                        className={classes.submitButton}
                        onClick={submit}
                        variant="contained"
                        fullWidth
                    >
                        Soumettre
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default function Newsletter() {
    const url = "https://boopursal.us1.list-manage.com/subscribe/post?u=ec057da8878f92c766693bd65&amp;id=8947f5aa1f&amp;f_id=00c07de2f0";

    return (
        <MailchimpSubscribe
            url={url}
            render={({ subscribe, status, message }) => (
                <CustomForm
                    status={status}
                    message={message}
                    onValidated={formData => subscribe(formData)}
                />
            )}
        />
    )
}
