import {
    GET_SITE_DATA,
    UPDATE_SITE_DATA
} from '../actions/types';

/**-La función necesita de un estado con un objeto vacío.
 * -Si no encuentro el "type" devuelvo el "state" (que va a ser igual al que paso en la función).*/
export default function (state = {}, action) {
    switch (action.type) {
        case GET_SITE_DATA:
            return { ...state, siteData: action.payload }
        case UPDATE_SITE_DATA:
            return { ...state, siteData: action.payload.siteInfo }
        default:
            return state;
    }
}