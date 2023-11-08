import {Button, Figure, FigureCaption, FigureImage} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-regular-svg-icons";
import Avatars from "./Avatars";
import {faClose, faDeleteLeft} from "@fortawesome/free-solid-svg-icons";

export default function Profile(props) {
    return <Figure className="profile position-relative">
        <div className="position-absolute end-0 top-0">
            <Button className="delete-profile btn" onClick={() => props.onDelete(props.profile)}>
                <FontAwesomeIcon icon={faClose}/>
            </Button>

            <Button className="edit-profile btn" onClick={() => props.onEdit(props.profile)}>
                <FontAwesomeIcon icon={faEdit}/>
            </Button>
        </div>

        <FigureImage src={Avatars.get(props.profile.avatar)}
                     onClick={() => props.onSelect(props.profile)}/>
        <FigureCaption onClick={() => props.onSelect(props.profile)}>
            <p>{props.profile.loginName}</p>
            <small>{props.profile.server}</small>
        </FigureCaption>
    </Figure>

}
