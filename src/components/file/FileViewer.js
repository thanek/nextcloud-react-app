import {Button, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faClose} from "@fortawesome/free-solid-svg-icons";
import Audio from "../media/Audio";
import {useEffect, useRef} from "react";

export default function FileViewer(props) {
    const thisRef = useRef()

    function handleKeyboard(event, name) {
        console.log("KBRD", name)
        if (event.key === 'Escape') {
            props.onClose()
        }
        if (event.key === 'ArrowLeft' && props.prev) {
            props.onPrev()
        }
        if (event.key === 'ArrowRight' && props.next) {
            props.onNext()
        }
    }

    useEffect(() => {
        console.log("FOXUS")
        thisRef.current.focus();
    }, []);

    return <div className="current-file position-fixed"
                onKeyDown={(e) => handleKeyboard(e, props.file.name)}>
        <Container>
            <Row className="viewer d-flex align-items-center justify-content-center">
                <div id="show" className="">
                    <Button className="close-btn position-absolute top-0 end-0" onClick={() => props.onClose()}>
                        <FontAwesomeIcon icon={faClose} size="4x"/>
                    </Button>

                    {props.prev && <Button className="navi prev" onClick={() => props.onPrev()}>
                        <FontAwesomeIcon icon={faArrowLeft} size="4x"/>
                    </Button>}

                    <div ref={thisRef}>
                        {props.file.mime.startsWith('image/') &&
                        <img src={props.file.url} onLoad={() => props.onLoad()}/>}

                        {props.file.mime.startsWith('audio/') &&
                        <Audio item={props.file} onLoad={() => props.onLoad()}/>}

                        {props.file.mime.startsWith('video/') &&
                        <video controls autoPlay src={props.file.url}
                               onLoad={() => props.onLoad()}
                               onProgress={() => props.onLoad()}/>}
                    </div>

                    {props.next && <Button className="navi next" onClick={() => props.onNext()}>
                        <FontAwesomeIcon icon={faArrowRight} size="4x"/>
                    </Button>}
                </div>
            </Row>
        </Container>
    </div>
}
