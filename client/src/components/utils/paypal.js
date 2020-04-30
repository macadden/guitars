/**import React, { Component } from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

class Paypal extends Component {
    render() {

        const onSuccess = (payment) => {
            //console.log(JSON.stringify(payment))            
            this.props.onSuccess(payment);

            /**{
             * "paid": true,
             * "payerID": "...",
             * "paymentID": "PAY-...",
             * "paymentToken": "EC-...",
             * "returnUrl": "https://www.sandbox.paypal.com/paymentId=PAY-...",
             * "address": {
             *      "recupient_name": "test buyer",
             *      "line1": "1 Maint St",
             *      "city": "San Jose",
             *      "state": "CA",
             *      "postal_code": "...",
             *      "country_code": "US"
             *    },
             *    "email":"...@gmail.com"
             * }
             */
        
/**        }

        const onCancel = (data) => {
            console.log(JSON.stringify(data))
        }

        const onError = (err) => {
            console.log(JSON.stringify(err))
        }

        let env = 'sandbox';
        let currency = 'USD';
        let total = this.props.toPay;

        const client = { // OJO: como en una constante puedo meter 2 cosas.
            sandbox: '', // TOKEN.
            production: ''
        }

        return (
            <div>
                <PaypalExpressBtn
                    env={env}
                    client={client}
                    currency={currency}
                    total={total}
                    onError={onError}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    style={{
                        size:'large',
                        color:'blue',
                        shape:'rect',
                        label:'checkout'
                    }}
                
                />
            </div>
        );
    }
}

export default Paypal */