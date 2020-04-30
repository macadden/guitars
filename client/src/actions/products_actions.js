import axios from 'axios';//Axios para hacer las request.
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
} from './types';

import { PRODUCT_SERVER } from '../components/utils/misc';

export function getProductDetail(id){

    const request = axios.get(`${PRODUCT_SERVER}/articles_by_id?id=${id}&type=single`)
    .then(response=>{
        return response.data[0] //la info viene dentro de un array; quiero obtener lo que sea que esté ahí y ponerlo 
    });

    return {
        type:GET_PRODUCT_DETAIL,
        payload: request
    }
}

export function clearProductDetail(){
    return {
        type: CLEAR_PRODUCT_DETAIL,
        payload: ''
    }
}


export function getProductsBySell() { //Lo tengo que traer del server
    const request = axios.get(`${PRODUCT_SERVER}/articles?sortBy=sold&order=desc&limit=4`)
        .then(response => response.data);

    return {
        type: GET_PRODUCTS_BY_SELL,
        payload: request
    }

}

export function getProductsByArrival() { //Lo tengo que traer del server
    const request = axios.get(`${PRODUCT_SERVER}/articles?sortBy=createdAt&order=desc&limit=4`)
        .then(response => response.data);

    return {
        type: GET_PRODUCTS_BY_ARRIVAL,
        payload: request
    }
}

/** El "filters" que paso por argumento, por default, lo pongo igual a nada porque a veces no voy a recibir filtros. */
export function getProductsToShop(skip, limit, filters = [], previousState = []){
    const data = {
        limit,
        skip,
        filters,
    }

    //Hago una REQUEST to "/shop"
    const request = axios.post(`${PRODUCT_SERVER}/shop`,data)
                .then(response => {
                    let newState = [ /**Al final voy a tener todo lo que tenía en "previousState" (puede ser nada) + lo 
                                        que tenga de vuelta del server. Junto los viejos con los nuevos y armo un solo array (?)
                                        para no perder nada.*/
                       ...previousState,
                       ...response.data.articles
                    ];
                    return { //esto es lo que vuelve de la request.
                        size: response.data.size, //"size" del article.
                        articles: newState //traigo los 6 articles, 12, o los que haya establecido.                        
                    }
                });

    return { //Por REDUX, tengo que devolver algo.
        type: GET_PRODUCTS_TO_SHOP,
        payload: request //Esto es igual a "size" y "article".
    }

}

export function addProduct(datatoSubmit){

    const request = axios.post(`${PRODUCT_SERVER}/article`, datatoSubmit)
                    .then(response => response.data);
    
    return {
        type: ADD_PRODUCT,
        payload: request
    }
}

export function clearProduct(){
    return {
        type: CLEAR_PRODUCT,
        payload: '' //Puedo devolver un array vacío también, dependiendo de qué estoy usando.
    }
}

////////////////////////////////
///////        CATEGORIES
////////////////////////////////

export function getBrands() {

    const request = axios.get(`${PRODUCT_SERVER}/brands`)
        .then(response => response.data );

    return {
        type: GET_BRANDS,
        payload: request
    }
}

export function addBrand(dataToSubmit, existingBrands){
    const request = axios.post(`${PRODUCT_SERVER}/brand`,dataToSubmit)
    .then(response=>{
        let brands = [
            ...existingBrands,
            response.data.brand
        ];
        return {
            success: response.data.success,
            brands
        }
    });

    return {
        type:ADD_BRAND,
        payload: request
    }
}

export function addWood(dataToSubmit, existingWoods){
    const request = axios.post(`${PRODUCT_SERVER}/wood`,dataToSubmit)
    .then(response=>{
        let woods = [
            ...existingWoods,
            response.data.wood
        ];
        return {
            success: response.data.success,
            woods
        }
    });

    return {
        type:ADD_WOOD,
        payload: request
    }
}


export function getWoods() {

    const request = axios.get(`${PRODUCT_SERVER}/woods`)
        .then(response => response.data );

    return {
        type: GET_WOODS,
        payload: request
    }
}