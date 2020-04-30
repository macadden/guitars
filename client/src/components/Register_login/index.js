import React from 'react';
import MyButton from '../utils/button';
import Login from './login';

const RegisterLogin = () => {
    return (
        <div className="page_wrapper">
            <div className="container">
                <div className="register_login_container">
                    <div className="left">
                        <h1>New Customers</h1>
                        <p>Praesent scelerisque eget felis vel commodo. Mauris auctor erat vitae fermentum porttitor. Duis aliquam bibendum 
                            efficitur. Vivamus ullamcorper facilisis eros congue semper. Ut et dui elementum, ornare orci sit amet, blandit 
                            sem. Proin aliquet consectetur purus, vel placerat nisi tempus sed. Suspendisse potenti. Vivamus lobortis, metus 
                            euismod accumsan, urna nunc molestie lorem, ut egestas orci leo posuere risus.</p>
                        <MyButton
                            type="default"
                            title="create an account"
                            linkTo="/register"
                            addStyles={{
                                margin:'10px 0 0 0' //10px desde arriba, solamente.
                            }}
                        />
                    </div>
                    <div className="right">
                        <h2>Registered customers</h2>
                        <p>If you have an account please log in.</p>
                        <Login/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLogin;