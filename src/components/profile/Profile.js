import {Button, Figure, FigureCaption, FigureImage} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-regular-svg-icons";
import Avatars from "./Avatars";

export default function Profile(props) {
    return <Figure className="profile position-relative">
        <Button className="edit-profile position-absolute end-0 top-0"
                onClick={() => props.onEdit(props.profile)}>
            <FontAwesomeIcon icon={faEdit}/>
        </Button>
        <FigureImage src={Avatars.get(props.profile.avatar)}
                     onClick={() => props.onSelect(props.profile)}/>
        <FigureCaption onClick={() => props.onSelect(props.profile)}>
            <p>{props.profile.loginName}</p>
            <small>{props.profile.server}</small>
        </FigureCaption>
    </Figure>

}
