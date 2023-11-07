import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile} from "@fortawesome/free-regular-svg-icons";
import {FigureImage} from "react-bootstrap";

export default function Thumbnail(props) {
    const [isError, setIsError] = useState(false);

    function fallback() {
        setIsError(true)
    }

    return <>
        {isError && <div className="icon">
            <FontAwesomeIcon icon={faFile} size="8x"/>
        </div>}
        {!isError &&
        <FigureImage loading="lazy" className="rounded thumbnail icon" src={props.src} onError={() => fallback()}/>}
    </>
}
