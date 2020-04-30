import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const links = [
    {
        name: 'My account',
        linkTo: '/user/dashboard'
    },
    {
        name: 'User information',
        linkTo: '/user/user_profile'
    },
    {
        name: 'My Cart',
        linkTo: '/user/cart'
    },

]

const admin = [
    {
        name: 'Site info',
        linkTo: '/user/site_info'
    },
    {
        name: 'Add products',
        linkTo: '/admin/add_product'
    },
    {
        name: 'Manage categories',
        linkTo: '/user/manage_categories'
    }
]


const UserLayout = (props) => {

    const generateLinks = (links) => (
        links.map((item,i /**obtengo "i"*/) => (
            <Link to={item.linkTo} key={i}/**Estoy loopeando, tengo que pasar la iteración.*/>
                {item.name}
            </Link>
        ))
    )

    return (
        <div className="container">
            <div className="user_container">
                <div className="user_left_nav">
                    <h2>My account</h2>
                    <div className="links">
                        {generateLinks(links)}
                    </div>
                    { props.user.userData.isAdmin ?
                        <div>
                            <h2>Admin</h2>
                            <div className="links">
                                { generateLinks(admin) }
                            </div>
                        </div>
                    :null

                    }
                </div>
                <div className="user_right">
                    {props.children /**Con esto tengo todo el contenido de los componentes padres, por ej. "dashboard"*/} 
                </div>
            </div>            
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}


export default connect(mapStateToProps)(UserLayout);