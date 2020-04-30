

/**-Si no tengo "formdata", si no la recibo, el "formdata" por default va a estar vacío. */
export const validate = (element, formdata = []) => {
    let error = [true, '']; // por default no va a haber msj de error por ser "true".


    if (element.validation.email) {
        const valid = /\S+@\S+\.\S+/.test(element.value) //validación de email de "regex.com" (?)
        const message = `${!valid ? 'Must be a valid email' : ''}`;
        error = !valid ? [valid, message] : error; //si no es válido mando "valid" (que es false) y "message", sino el defaul "error" que tengo arriba (true y '').
    }

    if(element.validation.confirm){
        const valid = element.value.trim() === formdata[element.validation.confirm].value;
        const message = `${!valid ? 'Passwords do not match' : ''}`;
        error = !valid ? [valid, message] : error; //si no es válido mando "valid" (que es false) y "message", sino el defaul "error" que tengo arriba (true y '').
    }


    if (element.validation.required) {
        const valid = element.value.trim() !== ''; //Chequeo si está vacía (True) o no (False). "trim()" es para eliminar espacios en blanco.
        const message = `${!valid ? 'This field is required' : ''}`;
        error = !valid ? [valid, message] : error; //si no es válido mando "valid" (que es false) y "message", sino el defaul "error" que tengo arriba (true y '').
    }

    return error
}

export const update = (element, formdata, formName) => {
    const newFormdata = {
        ...formdata
    }
    const newElement = {
        ...newFormdata[element.id]
    }

    newElement.value = element.event.target.value; /**-newElement tiene el nuevo valor de las cosas.
                                                      -Dentro del "element" tengo el "event" que lo obtengo en "formfields.js" (con "onChange" y "onBlur").*/
    //Necesito empezar a validar desde que el usuario empieza a ingresar datos y NO antes de eso.
    if (element.blur) {
        let validData = validate(newElement, formdata);
        newElement.valid = validData[0];
        newElement.validationMessage = validData[1];

    }

    newElement.touched = element.blur; //"element.blur" es true (de "formfield.js"); a menos que no haya ejecutado "onBlur" en "formfield.js"
    newFormdata[element.id] = newElement;

    return newFormdata; //"newFormdata" tiene todos los cambios.
}

export const generateData = (formdata, formName) => {
    let dataToSubmit = {};

    for(let key in formdata){
        if(key !== 'confirmPassword'){
            dataToSubmit[key] = formdata[key].value;        
        }       
    }

    return dataToSubmit;
}

export const isFormValid = (formdata, formName) => {
    let formIsValid = true;

    for(let key in formdata){
        formIsValid = formdata[key].valid && formIsValid
    }
    return  formIsValid;
}

export const populateOptionFields = (formdata, arrayData=[], field) => {
    const newArray = [];
    const newFormdata = {...formdata};

    arrayData.forEach(item=>{
        newArray.push({key:item._id, value:item.name});
    });

    newFormdata[field].config.options = newArray;
    return newFormdata;
}

export const resetFields = (formdata, formName) => {
    const newFormdata = {...formdata};

    for(let key in newFormdata){
        if(key === 'images'){
            newFormdata[key].value = [];
        } else {
            newFormdata[key].value = '';
        }
        
        newFormdata[key].valid = false;
        newFormdata[key].touched = false;
        newFormdata[key].validationMessage = '';
    }

    return newFormdata
}

export const populateFields = (formData, fields) => {

    for(let key in formData){
        formData[key].value = fields[key];
        formData[key].valid = true;
        formData[key].touched = true;
        formData[key].validationMessage = ''
    }

    return formData;
}