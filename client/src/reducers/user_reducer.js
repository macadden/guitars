//CONFIGURACIÓN ESTANDARD DE REDUX

import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART_USER,
    GET_CART_ITEMS_USER,
    REMOVE_CART_ITEM_USER,
   // ON_SUCCESS_BUY_USER,
   UPDATE_DATA_USER,
   CLEAR_UPDATE_USER_DATA

} from '../actions/types';


/**-La función necesita de un estado con un objeto vacío.
 * -Si no encuentro el "type" devuelvo el "state" (que va a ser igual al que paso en la función).
*/
export default function (state = {}, action) {
    switch (action.type) {
        case REGISTER_USER:
            return {...state, register: action.payload}
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload}
        case AUTH_USER:
            return{...state, userData: action.payload}
        case LOGOUT_USER:
            return {...state }
        case ADD_TO_CART_USER:
            return { ...state, userData:{
                ...state.userData, //quiero dejar acá adentro lo que tengo en UserData, pero...
                cart: action.payload //quiero entrar a "cart" y modicar con l que tengo en "payload"
            }}
        case GET_CART_ITEMS_USER:
            return {...state,cartDetail: action.payload }
        case REMOVE_CART_ITEM_USER:
            return { 
                ...state,
                cartDetail: action.payload.cartDetail,
                userData: {
                    ...state.userData,
                    cart: action.payload.cart
                }
            }
/**        case ON_SUCCESS_BUY_USER:
            return {
                ...state,
                successBuy: action.payload.success,
                userData: { //Actualizar el carrito, porque ahora va a estar vacío.
                    ...state.userData, //Voy a poner lo que tenga en "userData" 
                    cart: action.payload.cart //El carrito va a ser actualizado con lo que tenga de vuelta del SERVER.
                },
                cartDetail: action.payload.cartDetail
            }*/
        case UPDATE_DATA_USER:
            return {...state,updateUser: action.payload }
        case CLEAR_UPDATE_USER_DATA:
            return {...state, updateUser: action.payload }
        default:
            return state;
    }
}