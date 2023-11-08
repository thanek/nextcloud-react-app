import {Button, ButtonGroup, Container, Figure, FigureCaption, FigureImage, Modal, ModalBody} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faCancel} from "@fortawesome/free-solid-svg-icons";
import {faSave} from "@fortawesome/free-regular-svg-icons";
import {useState} from "react";
import Avatars from "./Avatars";

export default function ProfileEditor(props) {
    const [avatar, setAvatar] = useState(props.profile.avatar)

    function nextAvatar() {
        if (!Avatars.has(avatar + 1)) {
            setAvatar(0)
        } else {
            setAvatar(avatar + 1)
        }
    }

    function prevAvatar() {
        if (!Avatars.has(avatar - 1)) {
            setAvatar(Avatars.count() - 1)
        } else {
            setAvatar(avatar - 1)
        }
    }

    return <Modal centered show fullscreen className="profile-editor">
        <ModalBody className="position-absolute translate-middle top-50 start-50">
            <h5 className="p-3">Edit profile:</h5>
            <Figure className="profile position-relative">
                <Button className="position-absolute top-0 start-0" onClick={() => prevAvatar()}>
                    <FontAwesomeIcon icon={faArrowLeft}/>
                </Button>
                <FigureImage src={Avatars.get(avatar)}/>
                <FigureCaption>
                    <p>{props.profile.loginName}</p>
                    <small>{props.profile.server}</small>
                </FigureCaption>
                <Button className="position-absolute top-0 end-0" onClick={() => nextAvatar()}>
                    <FontAwesomeIcon icon={faArrowRight}/>
                </Button>
            </Figure>
            <Container>
                <ButtonGroup>
                    <Button onClick={() => props.onCancel(props.profile)} className="btn-secondary">
                        <FontAwesomeIcon icon={faCancel}/> Cancel
                    </Button>
                    <Button onClick={() => props.onSave({...props.profile, avatar: avatar})} className="btn-primary">
                        <FontAwesomeIcon icon={faSave}/> Save
                    </Button>
                </ButtonGroup>
            </Container>
        </ModalBody>
    </Modal>
}
