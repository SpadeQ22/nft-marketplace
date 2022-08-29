import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import userp from './userp.png';

const User = ( { account, username, age, pn, email } ) => {
    return ( 
        <Container className="justify-content-md-center" fluid>
            <Row style={{paddingTop: '1rem'}}>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}>
                    <Card style={{ width: '28rem' , alignItems: 'center', textAlign:"center" }}>
                            <Card.Img variant="top" src={userp} style={{ width: '50%'}}/>
                            <Card.Body>
                                <Card.Title>
                                    <strong>User:</strong><br/>
                                    {username}<br/><br/>
                                    <strong>Address:</strong><br/>
                                    {account}<br/><br/>
                                    <strong>Email:</strong><br/>
                                    {email}<br/><br/>
                                    <strong>Phone-Number:</strong><br/>
                                    {pn}<br/><br/>
                                    <strong>Age:</strong><br/>
                                    {age}
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