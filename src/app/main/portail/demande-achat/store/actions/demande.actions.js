import agent from "agent";

export const CLEAN_UP = '[DEMANDE ACHAT PORTAIL APP] CLEAN_UP';
export const REQUEST_DEMANDE = '[DEMANDE ACHAT PORTAIL APP] REQUEST_DEMANDE';
export const GET_DEMANDE = '[DEMANDE ACHAT PORTAIL APP] GET_DEMANDE';
export const CLEAN_ERROR = '[DEMANDE ACHAT PORTAIL APP] CLEAN_ERROR';
export const GET_ATTACHEMENT = '[DEMANDE ACHAT PORTAIL APP] GET_ATTACHEMENT';
export const REQUEST_ATTACHEMENT = '[DEMANDE ACHAT PORTAIL APP] REQUEST_ATTACHEMENT';
export const SAVE_ERROR = '[DEMANDE ACHAT PORTAIL APP] SAVE_ERROR';

export function cleanUpDemande() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}


export function getDemande(id) {
    const request = agent.get(`/api/demande_achats/${id}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_DEMANDE,
        });
        return request.then((response) => {
            dispatch({
                type: GET_DEMANDE,
                payload: response.data
            })
        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
            })
        });
    }

}



export function getFile(fiche) {
    const request = agent({
        url: `/api/attachements/${fiche.id}`,
        method: 'GET',
        responseType: 'blob', // important
    }
    );
    return (dispatch) => {
        dispatch({
            type: REQUEST_ATTACHEMENT,
        });
        return request.then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fiche.url); //or any other extension
            document.body.appendChild(link);
            link.click();
            return dispatch({
                type: GET_ATTACHEMENT,
            });
        }
        );
    }



}

