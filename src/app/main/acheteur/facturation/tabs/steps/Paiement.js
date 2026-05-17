import React from 'react';
import { CircularProgress, RadioGroup, FormLabel, FormControl, FormControlLabel, Radio } from '@material-ui/core';

function Paiement(props) {

    const { commande, selected, handleChangeModePaiement } = props;

    if (commande.loadingP) {
        return (
            <div className="flex flex-1 items-center justify-center h-200 ">
                <CircularProgress color="secondary" /> &ensp;
               Chargement ...
            </div>
        );
    }
    return (
        <div className="md:px-44 mt-16">
            <FormControl component="fieldset">
                <FormLabel component="legend">Mode de paimenet</FormLabel>
                <RadioGroup aria-label="mode" name="mode1" value={selected.mode} onChange={handleChangeModePaiement}>
                    {
                        commande.paiements.map((item) => (
                            <FormControlLabel value={item['@id']} key={item['@id']} control={<Radio />} label={item.name} />
                        ))
                    }
                    <FormControlLabel value="disabled" disabled control={<Radio />} label="Carte bancaire ( A venir )" />
                </RadioGroup>
            </FormControl>

        </div>
    );
}

export default Paiement;
