import React from 'react';
import Card from './card';

const CardBlock = (props) => { //¿¿¿QUÉ PROPS VA A ESTAR RECIBIENDO???

    /**Esta es la encargada de loopear todo esto.*/
    const renderCards = () => (
        props.list ?
            props.list.map((card, i) => (
                   <Card
                    key={i}
                    {...card}
                   />
            ))
        : null
    )


    return (
        <div className="card_block">
            <div className="container">
                { //Lo hago así para que sea reusable.
                    props.title ?
                        <div className="title">
                            {props.title}
                        </div>
                    : null
                }
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap'   // ¿¿¿ ????
                }}>
                    {renderCards(props.list)}
                </div>
            </div>
        </div>
    );
};

export default CardBlock;