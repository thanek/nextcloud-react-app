import {Card, CardBody, CardImg, Container} from "react-bootstrap";

export default function Audio(props) {
    return <Container>
        <div id="audio-container">
            <Card>
                <CardImg src={props.item.thumbnail}/>
                <CardBody>
                    <h5 className="h5 font-weight-bold">
                        <p>{props.item.name}</p>
                    </h5>
                    <audio controls src={props.item.url} autoPlay onProgress={() => props.onLoad()}/>
                </CardBody>
            </Card>
        </div>
    </Container>;
}
