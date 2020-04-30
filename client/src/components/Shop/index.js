import React, { Component } from 'react';
import PageTop from '../utils/page_top';

import { frets, price } from '../utils/Form/fixed_categories';

import { connect } from 'react-redux';
import { getProductsToShop, getBrands, getWoods } from '../../actions/products_actions';

import CollapseCheckbox from '../utils/collapseCheckbox';
import CollapseRadio from '../utils/collapseRadio';

import LoadmoreCards from './loadmoreCards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faTh from '@fortawesome/fontawesome-free-solid/faTh';

class Shop extends Component {

    state = {
        grid: '', //Estado inicial de los artículos en la pág. (en forma de lista o de bloques).
        limit: 6,
        skip: 0, //Es para cuando clickeo "load more" y no me muestre más los 6 productos que recién me mostró.
        filters: { //Hago esto porque sino, de forma estandard, no devuelvo un solo array con todo lo que quiero, sino que devuelvo varios distintos.
            brand: [],
            frets: [],
            wood: [],
            price: []
        }
    }

    componentDidMount() { // ¿¿¿ Para obtener BRANDS y WOODS???  ¿¿¿Para qué era el componentDidMount()???
        this.props.dispatch(getBrands());
        this.props.dispatch(getWoods());

        this.props.dispatch(getProductsToShop(
            this.state.skip,
            this.state.limit,
            this.state.filters
        ))
    }

    //El "value" que paso lo obtuve en "let priceValues = this.handlePrice(filters);". ¿¿¿PERO CÓMO ME DOY CUENTA??? NO HAY NADA QUE SALGA CON EL NOMBRE "VALUE".
    handlePrice = (value) => { //Tengo que ir al array inicial de "price" que traigo del children, encontrar el "_id" y traer el value, que es un array.
        const data = price; //"data" va a ser un array.
        let array = [];

        for(let key in data){
            if(data[key]._id === parseInt(value,10)){ //Con "parseInt" convierto todo a números (porque los estoy usando) porque lo que traigo de "filters" es un string... el "10" es para no tener un msj de error (?).
                array = data[key].array //El "array" hace referencia al valor. Por ejemplo, " "array":[300,599] " => [300, 599]. 
            }            
        }
        return array;
    }

    handleFilters = (filters, category) => {
        const newFilters = { ...this.state.filters }
        newFilters[category] = filters; //Pongo lo que haya tenido de vuelta en "filters".

        if(category === "price"){
            let priceValues = this.handlePrice(filters); //"filters" va a ser el "value", el "_id" (1,2,3,4,5)
            newFilters[category] = priceValues
        }

        this.showFilteredResults(newFilters) //Gatilla los cambios cuando se activan los filtros elegidos por el usuario (paso los nuevos cambios como argumento).

        this.setState({
            filters: newFilters
        })
    }

    showFilteredResults = (filters) => { //Establece los cambios cuando se activan los filtros elegidos por el usuario.
        this.props.dispatch(getProductsToShop(
            0, // Size = 0; no puede saltearse nada si el usuario elige 1ro un filtro y después agrega otro, arranca de 0 (?).
            this.state.limit,
            filters //los filtros son los que paso por argumento.
        )).then(()=>{ //Esto se hace una vez que obtuve los nuevo artículos/productos.
            this.setState({
                skip:0 //lo establezco oootra vez a 0.
            })
        })
    }

    loadMoreCards = () => {
        let skip = this.state.skip + this.state.limit; //skip inicial 0; limit 6 => "load more" => skip=6; limit=12 y así...

        this.props.dispatch(getProductsToShop(
            skip,
            this.state.limit,
            this.state.filters,
            this.props.products.toShop //paso TODO lo que tengo en "state" para hacer un array con los articulos viejos y los de "load more".
        )).then(()=>{
            this.setState({
                skip //actualizo de 6 el skip.
            })
        })
    }

    handleGrid = () => {
        this.setState({
            grid: !this.state.grid ? 'grid_bars' : '' //si tiene algo, no hago nada.
            
        })
    }


    render() {
        const products = this.props.products;
        return (
            <div>
                <PageTop
                    title="Browse Products"
                />
                <div className="container">
                    <div className="shop_wrapper">
                        <div className="left">
                            <CollapseCheckbox // Las BRANDS vienen del server.
                                initState={true}
                                title="Brands"
                                list={products.brands /**en el "brands" del "REDUX STORE" */}
                                handleFilters={(filters /**recibe los "filters" del "child component".*/) => this.handleFilters(filters /**pasa los "filters" que obtenemos de "CollapseCheckbox".*/, 'brand' /**aclaro qué checkbox es. */)} //Maneja los cambios en la lista de checkboxes.
                            />
                            <CollapseCheckbox // FRETS no vienen del server, entonces las tengo que hostear en una variable.
                                initState={false}
                                title="Frets"
                                list={frets}
                                handleFilters={(filters) => this.handleFilters(filters, 'frets')} //Maneja los cambios en la lista de checkboxes.
                            />
                            <CollapseCheckbox // WOODS vienen del server.
                                initState={false}
                                title="Wood"
                                list={products.woods}
                                handleFilters={(filters) => this.handleFilters(filters, 'wood')} //Maneja los cambios en la lista de checkboxes.
                            />
                            <CollapseRadio
                                initState={true}
                                title="Price"
                                list={price}
                                handleFilters={(filters) => this.handleFilters(filters, 'price')}
                            />
                        </div>
                        <div className="right">
                            <div className="shop_options">
                                <div className="shop_grids clear">
                                    <div
                                        className={`grid_btn ${this.state.grid ? '' : 'active'}`}
                                        onClick={()=> this.handleGrid()}
                                    >
                                        <FontAwesomeIcon icon={faTh}/>
                                    </div>
                                    <div
                                        className={`grid_btn ${!this.state.grid ? '' : 'active'}`}
                                        onClick={()=> this.handleGrid()}
                                    >
                                        <FontAwesomeIcon icon={faBars}/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <LoadmoreCards
                                    grid={this.state.grid}
                                    limit={this.state.limit}
                                    size={products.toShopSize}
                                    products={products.toShop}
                                    loadMore={()=> this.loadMoreCards()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// La idea principal es, al final, tener todo inyectado en "props".
const mapStateToProps = (state) => { // ¿¿¿REDUX???
    return { // Necesito hacer la request al server y acá voy a traer todo lo que tiene "products".
        products: state.products
    }
}

export default connect(mapStateToProps)(Shop);