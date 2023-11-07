import {Figure, FigureImage} from "react-bootstrap";

export default function Folder(props) {
    return <Figure className="rounded">
        <div className="icon folder"/>
        <p>{props.item.basename}</p>
    </Figure>
}
