import React, { Component } from 'react';
import ImageLightBox from '../utils/lightbox';

class ProdImg extends Component {

    state = {
        lightbox: false,
        imagePos: 0, // cero es la 1ra imagen de la lista; entonces por default abro esa.
        lightboxImages: []
    }



    componentDidCatch() {
        if (this.props.detail.images.length > 0) {
            let lightboxImages = [];

            this.props.detail.images.forEach(item => {
                lightboxImages.push(item.url) //quiero pushear la key "url" en el array "lightboxImages".
            })

            this.setState({
                lightboxImages
            })

        }
    }

    handleLightBox = (pos) => { //A la que le paso la posición en la que quiero abrir "lightbox"
        if(this.state.lightboxImages.length > 0){
            this.setState({
                lightbox:true,
                imagePos: pos
            })
        }
    }

    handleLightBoxClose = () => {
        this.setState({
            lightbox: false
        })
    }

    showThumbs = () => ( //loopear la info que obtengo de "detail.images" 
        this.state.lightboxImages.map((item, i) => (
            i > 0 ? //si la iteación es más grande que la 1ra posición.
                <div
                    key={i}
                    onClick={() => this.handleLightBox(i)}
                    className="thumb"
                    style={{ background: `url(${item}) no-repeat` }}
                >
                </div>
            : null
        ))
    )

    renderCardImage = (images) => {
        if (images.length > 0) {
            return images[0].url
        } else {
            return `/images/image_not_availble.png`
        }
    }

    render() {
        const { detail } = this.props;
        return (
            <div className="product_image_container">
                <div className="main_pic">
                    <div
                        style={{ background: `url(${this.renderCardImage(detail.images)}) no-repeat` }} //"images" es el array que obtengo de "index", de "detail".
                        onClick={() => this.handleLightBox(0)}
                    >

                    </div>
                </div>
                <div className="main_thumbs">
                    {this.showThumbs(detail)}
                </div>
                {
                    this.state.lightbox ? 
                        <ImageLightBox
                            id={detail.id}
                            images={this.state.lightboxImages}
                            open={this.state.open}
                            pos={this.state.imagePos}
                            onclose={()=> this.handleLightBoxClose()}
                        />
                    :null
                }
            </div>
        );
    }
}

export default ProdImg;