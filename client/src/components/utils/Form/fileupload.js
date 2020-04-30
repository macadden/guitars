import React, { Component } from 'react';
import useDropzone from 'react-dropzone';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import CircularProgress from '@material-ui/core/CircularProgress';

class Fileupload extends Component {


    constructor() { //Es lo mismo, acá en React, que hacer un "state".
        super();
        this.state = {
            uploadedFiles: [],
            uploading: false
        }
    }

    onDrop = (files) => {
        this.setState({ uploading: true });
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' } //Esta es la manera de usarlo en AXIOS.
        }
        formData.append("file", files[0]); /**adjunto los archivos; "file" es la key-word con la que voy a tomar del server; "0" es
                                            porque ¿tengo? un solo archivo.*/
        axios.post('/api/users/uploadimage', formData, config)
            .then(response => {

                console.log(response.data)

                this.setState({
                    uploading: false,
                    uploadedFiles: [ //Quizás tengo que concatenar con la anterior "upload".
                        ...this.state.uploadedFiles,
                        response.data
                    ]
                }, () => {
                    this.props.imagesHandler(this.state.uploadedFiles)
                })
            });
    }

    onRemove = (id) => {
        axios.get(`/api/users/removeimage?public_id=${id}`).then(response=>{
            let images = this.state.uploadedFiles.filter(item=>{
                return item.public_id !== id;                
            })

            this.setState({
                uploadedFiles: images
            },()=>{
                this.props.imagesHandler(images)
            })

        })
    }

    showUploadedImages = () => (
        this.state.uploadedFiles.map(item => (
            <div className="dropzone_box"
                key={item.public_id}
                onClick={() => this.onRemove(item.public_id)}
            >
                <div 
                    className="wrap"
                    style={{background:`url(${item.url}) no-repeat`}}
                >                
                </div>
            </div>
        ))
    )

    static getDerivedStateFromProps(props,state){
        if(props.reset){
            return state = {
                uploadedFiles:[]
            }
        }
        return null;
    }


    render() {
        return (
            <div>
                <section>
                    <div className="dropzone clear">
                        <useDropzone
                            onDrop={(e) => this.onDrop(e)} //"e"="event" = los archivos.
                            multiple={false}
                            className="dropzone_box"
                        >
                            <div className="wrap">
                                <FontAwesomeIcon
                                    icon={faPlusCircle}
                                />
                            </div>
                        </useDropzone>
                        {this.showUploadedImages()}
                        {
                            this.state.uploading ?
                                <div className="dropzone_box" style={{ //Esto tiene un "style" acá porque se agregó una vez terminado el proyecto.
                                    textAlign: 'center',
                                    paddingTop: '60px'
                                }}>
                                    <CircularProgress
                                        style={{ color: '#00bcd4' }} //Esto tiene un "style" acá porque se agregó una vez terminado el proyecto.
                                        thickness={7}
                                    />
                                </div>
                                : null
                        }
                    </div>
                </section>

            </div>
        );
    }
}

export default Fileupload;