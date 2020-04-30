import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';
import faAngleUp from '@fortawesome/fontawesome-free-solid/faAngleUp';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';


class CollapseCheckbox extends Component {

    state = {
        open: false,
        checked: []
    }

    //Siempre obtengo el default que paso en el "index" de "Shop"; el cual va a cambiar el "state".
    componentDidMount() {  // ¿¿¿ PARA QUÉ ES EL componentDidMount() ???
        if (this.props.initState) {
            this.setState({
                open: this.props.initState
            })
        }
    }

    handleClick = () => {
        this.setState({ open: !this.state.open }) // Cambia el estado de "open" al hacer click. Si es "false" pasa a "true" y al revés.
    }

    handleAngle = () => ( //cambia la "^" (flechita) para arriba o para abajo.
        this.state.open ?
            <FontAwesomeIcon
                icon={faAngleUp}
                className="icon"
            />
            :
            <FontAwesomeIcon
                icon={faAngleDown}
                className="icon"
            />
    )

    /**-Tengo que agarrar cualquier cosa que esté obteniendo como lista de productos y de ahí crear el "text" y los "checkboxes" */
    renderList = () => (
        this.props.list ? //Checkeo si tengo algo en las "props" de "list". 
            this.props.list.map((value) => (
                <ListItem key={value._id} style={{padding: '10px 0'}}>
                    <ListItemText primary={value.name}/>
                    <ListItemSecondaryAction>
                        <Checkbox
                            color="primary"
                            onChange={this.handleToggle(value._id)}
                            checked={this.state.checked.indexOf(value._id) !== -1} //Si lo encuentra es "true", sino "false".
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            ))
        :null
    )

    //Buscar en la documentación.
    handleToggle = value => () => { //No entiendo esta línea. 
        const { checked } = this.state; //Es lo mismo que "const checked = this.state.checked"
        const currentIndex = checked.indexOf(value); /**-"indexOf()" es de JAVASCRIPT puro.
                                                      - Estoy entrando al array de "checks" que tengo en "state" y me fijo si está el "indexOf()" 
                                                      de ese "value" en particular (me fijo si tengo una entrada con el mismo "_id", con el 
                                                      mismo value. Si esto NO pasa, "checked.indexOf()" va a ser un nro negativo. Si no tengo
                                                      ese "value" en la lista, esto va a ser un nro positivo y me devolverá la posición del 
                                                      "value").*/
        const newChecked = [...checked]; 

        if(currentIndex === -1){ //NO está en la lista
            newChecked.push(value)
        } else { //Está en la lista y hay que quitarla.
            newChecked.splice(currentIndex,1) /**con el "splice()" sólo tengo que pasar la posición de lo que quiero borrar y dsp la cantidad de 
                                                 entradas que quiero borrar (si pongo 2, por ej. => se va a posiciónar donde le indiqué y va a 
                                                 borrar los próximos 2). */
        }

        ///// "this.props.handleFilters()" también lo podría hacer acá.

        this.setState({
            checked: newChecked
        },()=>{
            this.props.handleFilters(newChecked)
        })
    }
    

    render() {
        return (
            /**-"List" es de "material UI".
             * -"component="div" " es porque "div" es el componente que quiero devolver como una lista. //esta es una propiedad de "material UI" y de "Lists".
            */
            <div className="collapse_items_wrapper">
                <List style={{ borderBottom: '1px solid #dbdbdb' }}>
                    <ListItem onClick={this.handleClick} style={{ padding: '10px 23px 10px 0' }}>
                        <ListItemText
                            primary={this.props.title}
                            className="collapse_title"
                        />
                        {this.handleAngle()}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit /**"unmountOnExit" es de "Material UI" */>
                        <List component="div" disablePadding>
                            {this.renderList()}
                        </List>
                    </Collapse>
                </List>
            </div>
        );
    }
}

export default CollapseCheckbox;