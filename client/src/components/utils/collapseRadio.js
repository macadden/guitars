import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';
import faAngleUp from '@fortawesome/fontawesome-free-solid/faAngleUp';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLable from '@material-ui/core/FormControlLabel';


class CollapseRadio extends Component {

    state = {
        open: false,
        value: '0' //Lo hago String porque si lo paso como nro me tira error.
    }

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

    renderList = () => (
        this.props.list ?
            this.props.list.map( value => (
                <FormControlLable
                    key={value._id}
                    value={`${value._id}`}
                    control={<Radio/>}
                    label={value.name}
                />
            ))
        :null
    )

    handleChange = event => {
        this.props.handleFilters(event.target.value)
        this.setState({value: event.target.value })
    }


    render() {
        return (
            <div>
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
                                <RadioGroup //propiedades de Material UI
                                    aria-label="prices"
                                    name="prices"
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                >
                                    { this.renderList() }
                                </RadioGroup>

                        </List>
                    </Collapse>
                </List>
            </div>
        );
    }
}

export default CollapseRadio;