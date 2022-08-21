import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import userp from './userp.png';

const User = ( { account } ) => {
    return ( 
        <Container className="justify-content-md-center" fluid>
            <Row style={{paddingTop: '1rem'}}>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}>
                    <Card style={{ width: '28rem' }}>
                            <Card.Img variant="top" src={userp} />
                            <Card.Body>
                                <Card.Title>
                                    <strong>User:</strong><br/>
                                    {"Name"}<br/><br/>
                                    <strong>Address:</strong><br/>
                                    {account}<br/><br/>
                                    <strong>Email:</strong><br/>
                                    {"123@123.com"}<br/><br/>
                                    <strong>Phone-Number:</strong><br/>
                                    {"12345678"}<br/><br/>
                                    <strong>Age:</strong><br/>
                                    {"99"}
                                </Card.Title>
                                <Button href={`https://etherscan.io/address/${account}`} variant="dark">Etherscan.io</Button>
                            </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={4}></Col>
            </Row>
        </Container>
     );
}
 
export default User;