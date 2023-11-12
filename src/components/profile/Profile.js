import {Button, Card, Figure, FigureCaption, FigureImage} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrashCan} from "@fortawesome/free-regular-svg-icons";
import Avatars from "./Avatars";
import {faClose, faDeleteLeft} from "@fortawesome/free-solid-svg-icons";

export default function Profile(props) {
    return <Figure className="profile position-relative">
        <a href="#" className=""
           onClick={() => props.onSelect(props.profile)}>
            <FigureImage src={Avatars.get(props.profile.avatar)}/>
            <FigureCaption onClick={() => props.onSelect(props.profile)}>
                <p>{props.profile.loginName}</p>
                <small>{props.profile.server}</small>
            </FigureCaption>
        </a>

        <div className="buttons position-absolute end-0 bottom-0">
            <Button className="edit-profile btn" onClick={() => props.onEdit(props.profile)}>
                <FontAwesomeIcon icon={faEdit}/>
            </Button>

            <Button className="delete-profile btn" onClick={() => props.onDelete(props.profile)}>
                <FontAwesomeIcon icon={faTrashCan}/>
            </Button>
        </div>
    </Figure>

}
