import './Card.css';
import { Modal } from '../modal/Modal';

export function Card({name, image, type, onClick}){

    const handleClickCard = () => {
        onClick();
    };

    return <div className="card-container" onClick={handleClickCard}>
        <div className="card-content" >
            <h2 className="name">{name}</h2>
            <img src={image}></img>
            <p className="type">{type}</p>
        </div>
    </div>
}