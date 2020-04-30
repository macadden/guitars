import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth } from '../actions/user_actions';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function (ComposedClass, reload, adminRoute = null) {
    class AuthenticationCheck extends Component {

        state = {
            loading: true
        }

        componentDidMount() {
            this.props.dispatch(auth()).then(response => {
                let user = this.props.user.userData;
                console.log(user);

                if (!user.isAuth) {
                    if (reload) {
                        this.props.history.push('/register_login')
                    }
                } else { //En este punto ya estoy autenticado.
                    if (adminRoute && !user.isAdmin) {
                        this.props.history.push('/user/dashboard')
                    } else {
                        if (reload === false) {
                            this.props.history.push('/user/dashboard')
                        }
                    }
                }
                this.setState({ loading: false })
            })
        }

        
        render() {
            if(this.state.loading) {
                return (
                    <div className="main_loader">
                        <CircularProgress style={{color: '#2196F3'}} thickness={7}/>
                    </div>
                )
            }
            return (
                <ComposedClass {...this.props} /**Lo siguiente es REDUX */user={this.props.user}/>
            );
        }
    }

    /**-REDUX: "mapStateToProps()"; "connect()" */
    function mapStateToProps(state){
        return {
            user:state.user
        }
    }

    //Siempre que use "connect" y "mapStateProps()", tego que pasar este como el 1er argumento (el 2do sería DISPATCH).
    return connect(mapStateToProps)(AuthenticationCheck)
}
