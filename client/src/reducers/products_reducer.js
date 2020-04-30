//CONFIGURACIÓN ESTANDARD DE REDUX

import {
    GET_PRODUCTS_BY_SELL,
    GET_PRODUCTS_BY_ARRIVAL,
    GET_BRANDS,
    ADD_BRAND,
    GET_WOODS,
    ADD_WOOD,
    GET_PRODUCTS_TO_SHOP,
    ADD_PRODUCT,
    CLEAR_PRODUCT,
    GET_PRODUCT_DETAIL,
    CLEAR_PRODUCT_DETAIL

} from '../actions/types';


/**-La función necesita de un estado con un objeto vacío.
 * -Si no encuentro el "type" devuelvo el "state" (que va a ser igual al que paso en la función).
*/
export default function (state = {}, action) {
    switch (action.type) {
        case GET_PRODUCTS_BY_SELL:
            return {...state, bySell: action.payload }
        case GET_PRODUCTS_BY_ARRIVAL:
            return {...state, byArrival: action.payload }
        case GET_BRANDS:
            return { ...state, brands: action.payload }
        case ADD_BRAND:
            return {
                ...state, 
                addBrand: action.payload.success, 
                brands: action.payload.brands 
            }
        case GET_WOODS:
            return { ...state, woods: action.payload }
        case ADD_WOOD:
            return {
                ...state, 
                addWood: action.payload.success, 
                woods: action.payload.woods 
            }
        case GET_PRODUCTS_TO_SHOP:
            return {
                ...state,
                toShop:action.payload.articles, //Nueva key, igual a lo que obtengo del server.
                toShopSize:action.payload.size //Nueva key, igual a lo que obtengo del server.
            }
        case ADD_PRODUCT:
            return { ...state, addProduct: action.payload }
        case CLEAR_PRODUCT:
            return { ...state, addProduct: action.payload }
        case GET_PRODUCT_DETAIL:
            return { ...state, prodDetail:action.payload }
        case CLEAR_PRODUCT_DETAIL:
            return { ...state, prodDetail:action.payload }
        default:
            return state;
    }
}