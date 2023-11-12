import {Button, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faClose} from "@fortawesome/free-solid-svg-icons";
import Audio from "../media/Audio";
import {useEffect, useRef} from "react";

export default function FileViewer(props) {
    const thisRef = useRef()

    useEffect(() => {
        thisRef.current.focus()
    }, [])

    function supportedMedia(file) {
        return file.mime && (file.mime.startsWith('audio/')
            || file.mime.startsWith('image/')
            || file.mime.startsWith('video/'))
    }

    function handleKeyboard(event) {
        if (event.key === 'Escape') {
            props.onClose()
        }
        if (event.key === 'ArrowRight' && props.next) {
            props.onNext()
        }
        if (event.key === 'ArrowLeft' && props.prev) {
            props.onPrev()
        }
    }

    return <div className="current-file position-fixed">
        <Container>
            <Row className="viewer d-flex align-items-center justify-content-center">
                <a href="#" ref={thisRef} onKeyDown={handleKeyboard} ref={thisRef}>
                    <Button className="close-btn position-absolute top-0 end-0" onClick={() => props.onClose()}>
                        <FontAwesomeIcon icon={faClose} size="4x"/>
                    </Button>

                    {props.prev && <Button className="navi prev" onClick={() => props.onPrev()}>
                        <FontAwesomeIcon icon={faArrowLeft} size="4x"/>
                    </Button>}

                    <div>
                        {!supportedMedia(props.file) &&
                        <div>
                            {props.onLoad()}
                            <p>This file type is not supported</p>
                            <small>{props.file.name} is {props.file.mime}</small>
                        </div>}

                        {supportedMedia(props.file) && props.file.mime.startsWith('image/') &&
                        <img src={props.file.url} onLoad={() => props.onLoad()}/>}

                        {supportedMedia(props.file) && props.file.mime.startsWith('audio/') &&
                        <Audio item={props.file} onLoad={() => props.onLoad()}/>}

                        {supportedMedia(props.file) && props.file.mime.startsWith('video/') &&
                        <video controls autoPlay src={props.file.url}
                               onLoad={() => props.onLoad()}
                               onProgress={() => props.onLoad()}/>}
                    </div>

                    {props.next && <Button className="navi next" onClick={() => props.onNext()}>
                        <FontAwesomeIcon icon={faArrowRight} size="4x"/>
                    </Button>}
                </a>
            </Row>
        </Container>
    </div>
}
