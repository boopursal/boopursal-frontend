import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';
import { TextField, Card, CardContent, Typography, Chip } from '@material-ui/core';
import IceVerificationField from '../shared/IceVerificationField';

const styles = theme => ({
    layoutRoot: {}
});

class Example extends Component {
    state = {
        ice: '',
        companyName: '',
        legalForm: '',
        rc: '',
        city: '',
        capital: '',
        creationDate: '',
        activity: '',
        statut: '',
        address: '',
    };

    handleIceSuccess = (data) => {
        this.setState({
            companyName: data.companyName || '',
            legalForm: data.legalForm || '',
            rc: data.rc || '',
            city: data.city || '',
            capital: data.capital || '',
            creationDate: data.creationDate || '',
            activity: data.activity || '',
            statut: data.statut || '',
            address: data.address || '',
        });
    };

    render() {
        const { classes } = this.props;
        const { ice, companyName, legalForm, rc, city, capital, creationDate, activity, statut, address } = this.state;

        return (
            <FusePageSimple
                classes={{ root: classes.layoutRoot }}
                header={
                    <div className="p-24">
                        <Typography variant="h4">Test : Vérification ICE Maroc</Typography>
                    </div>
                }
                content={
                    <div className="p-24">
                        <Card>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <Typography variant="h6">Simulateur d'ajout d'entreprise</Typography>

                                {/* Champ ICE avec bouton de vérification */}
                                <IceVerificationField
                                    value={ice}
                                    onChange={(val) => this.setState({ ice: val })}
                                    onVerifySuccess={this.handleIceSuccess}
                                />

                                {/* Statut (badge dynamique) */}
                                {statut ? (
                                    <div>
                                        <Chip
                                            label={statut}
                                            style={{
                                                backgroundColor: statut.includes('ACTIVITE') ? '#4caf50' : '#f44336',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </div>
                                ) : null}

                                {/* Champs auto-remplis */}
                                <TextField
                                    label="Raison sociale"
                                    variant="outlined"
                                    value={companyName}
                                    onChange={(e) => this.setState({ companyName: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="Forme juridique"
                                    variant="outlined"
                                    value={legalForm}
                                    onChange={(e) => this.setState({ legalForm: e.target.value })}
                                    fullWidth
                                />
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <TextField
                                        label="Registre de Commerce (RC)"
                                        variant="outlined"
                                        value={rc}
                                        onChange={(e) => this.setState({ rc: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                    <TextField
                                        label="Ville"
                                        variant="outlined"
                                        value={city}
                                        onChange={(e) => this.setState({ city: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <TextField
                                        label="Capital"
                                        variant="outlined"
                                        value={capital}
                                        onChange={(e) => this.setState({ capital: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                    <TextField
                                        label="Date de création"
                                        variant="outlined"
                                        value={creationDate}
                                        onChange={(e) => this.setState({ creationDate: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <TextField
                                    label="Activité"
                                    variant="outlined"
                                    value={activity}
                                    onChange={(e) => this.setState({ activity: e.target.value })}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </CardContent>
                        </Card>
                    </div>
                }
            />
        );
    }
}

export default withStyles(styles, { withTheme: true })(Example);
