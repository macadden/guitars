import axios from 'axios';//Axios para hacer las request.
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART_USER,
    GET_CART_ITEMS_USER,
    REMOVE_CART_ITEM_USER,
  //  ON_SUCCESS_BUY_USER,
    UPDATE_DATA_USER,
    CLEAR_UPDATE_USER_DATA

} from './types';

import { USER_SERVER, PRODUCT_SERVER } from '../components/utils/misc';


export function registerUser(dataToSubmit) {

    const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)
        .then(response => response.data);

    return {
        type: REGISTER_USER,
        payload: request
    }

}


export function loginUser(dataToSubmit) {

    /** 1) Despacho la acción desde ¿"login.js" ó "user_actions.js"?
     *  2) Hace la request (justo en este paso) y devuelve algo.
     *  3) El server ("server.js") devuelve "loginSuccess: true".
     *  4) Pasa por acá ("user.actions.js") y entra al "return" con el "type" y el "payload".
     *  5) La acción va al "reducer" en "user_reducer.js".
     */
    const  request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data)

    //REDUX.
    return { 
        type: LOGIN_USER, /**-Uso TYPE y no STRING porque si con strings yo cometo un error, puedo acceder al loguearme pero no voy a actualizar
                              el "state" (no va a entrar al CASE de "user_reducer.js") porque los 'LOGIN_USER' no van a coincidir. Además no voy
                              a tener un msj de error; no me podria dar cuenta que hay algo mal. Etonces uso TYPES porque son VARIABLES, no strings.*/
        payload: request
    }
}

export function auth() {
    //El siguiente "get()" es un "get-request".
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return { //esto es lo que obtenemos del SERVER.
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){

    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}


export function addToCart(_id){

    const request = axios.post(`${USER_SERVER}/addToCart?productId=${_id}`)
    .then(response => response.data)
    
    
    return{
        type:ADD_TO_CART_USER,
        payload: request
    }
}

export function getCartItems(cartItems, userCart){

    //Uso la ruta "articles_by_id" porque es una ruta que permite traer varios IDs.
    const request = axios.get(`${PRODUCT_SERVER}/articles_by_id?id=${cartItems}&type=array`)
                    .then(response => {

                        //Esto se podría haber hecho en el server.
                        userCart.forEach(item=>{
                            response.data.forEach((k,i)=>{
                                if(item.id === k._id){
                                    response.data[i].quantity = item.quantity;
                                }
                            })
                        })
                        return response.data;                        
                    })

    return {
        type: GET_CART_ITEMS_USER,
        payload: request
    }

}


export function removeCartItem(id){

    const request = axios.get(`${USER_SERVER}/removeFromCart?_id=${id}`) //Tengo que pasar el id.
                    .then(response=> { //El "response" es del SERVER.

                        response.data.cart.forEach(item=>{

                            response.data.cartDetail.forEach((k,i)=>{ // En cada loop de "cartDetail" tengo que tomar el item (k) y la iteración (i). 
                                if(item.id === k._id){ //Checkeo si el id del padre coincide con el del hijo.
                                    response.data.cartDetail[i].quantity = item.quantity;
                                }
                            })
                        })
                            return response.data;
                    })

    return {
        type: REMOVE_CART_ITEM_USER,
        payload: request
    }                
}


/**export function onSuccessBuy(data){    
    const request = axios.post(`${USER_SERVER}/successBuy`,data)
                    .then(response => response.data);

    return {
        type: ON_SUCCESS_BUY_USER,
        payload: request
    }   
}*/

export function updateUserData(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/update_profile`,dataToSubmit)
                    .then(response =>{
                        return response.data
                    });
     
    return {
        type: UPDATE_DATA_USER,
        request: request
    }
}

export function clearUpdateUser(){
    return {
        type: CLEAR_UPDATE_USER_DATA,
        payload: ''
    }
}