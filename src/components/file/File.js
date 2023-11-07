import Thumbnail from "./Thumbnail";
import {Figure} from "react-bootstrap";

export default function File(props) {
    return <Figure className="rounded">
        <Thumbnail src={props.item.thumbnail}/>
        <p>{props.item.basename}</p>
    </Figure>
}
