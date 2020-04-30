import React from 'react';

const FormField = ({ formdata, change, id }) => {

    const showError = () => { //"showError()" chequea "formdata".
        let errorMessage = null;

        if(formdata.validation && !formdata.valid){ //sigo adelante si tengo "validation" y, además, es FALSE (si es falso, quiero mostrar el msj).
            errorMessage = (
                <div className="error_label">
                    {formdata.validationMessage}
                </div>
            )
        }

        return errorMessage; //errorMessage valiendo NULL o con el JSX.
    }


    const renderTemplate = () => {
        let formTemplate = null;

        /**Switch necesita checkear qué se va a usar ("element", o sea "input", dentro de "formdata") para checkear.
         * Es decir toma el "formdata" y chequea el element.
         * - Cada vez que haga "onChange" u "onBlur" ejecuto "updateForm()" (en "login.js") para que actualice el "state" de "formdata"; los
         *   cambios se verán reflejados en "<Formfield/> en "login.js".
         */
        switch (formdata.element) {
            case ('input'): //Si tengo un INPUT el FORMTEMPLATE va a ser diferente
                formTemplate = (
                    <div className="formBlock">
                        { formdata.showlabel ? 
                            <div className="label_inputs">{ formdata.config.label }</div>
                        :null}


                        <input
                            {...formdata.config} // con los "..." adjunto todas las propiedades de "config".
                            value={formdata.value}
                            onBlur={(event) => change({ event, id, blur: true })} /**-Con el "onBlur" hago un cambio en la "form" 
                                                                                     -Al "onBlur" le voy a pasar un objeto.
                                                                                     -Significa que hago click en el FORM y salgo (?) => tengo
                                                                                      que checkear si el "input" está vacío o no. Es por eso que
                                                                                      paso "blur: true", es decir, puedo checkear si este evento
                                                                                      es de tipo "change" y "blur" ayuda a mostrar el mensaje de
                                                                                      validación que diga que tenés que ingresar algo. */
                            onChange={(event) => change({ event, id})}
                        />
                        {showError()}
                    </div>
                )
                break;
                case('select'):
                    formTemplate = (
                        <div className="formBlock">
                            { formdata.showlabel ? 
                                <div className="label_inputs">{ formdata.config.label }</div>
                            :null}
                            <select
                                value={formdata.value}
                                onBlur={(event) => change({ event, id, blur: true })}
                                onChange={(event) => change({ event, id})}
                            >
                                <option value="">Select one</option>
                                {
                                    formdata.config.options.map(item=>(
                                        <option
                                             key={item.key} 
                                             value={item.key}
                                        >
                                            {item.value}
                                        </option>
                                    ))
                                }
                            </select>
                            {showError()}
                        </div>
                    )            
                break;
                case('textarea'):
                    formTemplate = (
                        <div className="formBlock">
                            { formdata.showlabel ? 
                                <div className="label_inputs">{ formdata.config.label }</div>
                            :null}

                            <textarea
                                {...formdata.config} // con los "..." adjunto todas las propiedades de "config".
                                value={formdata.value}
                                onBlur={(event) => change({ event, id, blur: true })} /**-Con el "onBlur" hago un cambio en la "form" 
                                                                                        -Al "onBlur" le voy a pasar un objeto.
                                                                                        -Significa que hago click en el FORM y salgo (?) => tengo
                                                                                        que checkear si el "input" está vacío o no. Es por eso que
                                                                                        paso "blur: true", es decir, puedo checkear si este evento
                                                                                        es de tipo "change" y "blur" ayuda a mostrar el mensaje de
                                                                                        validación que diga que tenés que ingresar algo. */
                                onChange={(event) => change({ event, id})} 
                            />                        
                            {showError()}
                        </div>
                    )
                break;
            default:
                formTemplate = null;




        }


        return formTemplate;
    }



    return (
        <div>
            {renderTemplate()}
        </div>
    );
};

export default FormField;