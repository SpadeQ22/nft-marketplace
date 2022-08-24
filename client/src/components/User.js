import { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import userp from './userp.png';

const User = ( { account, username, age, pn, email, handleNewacc } ) => {
    const [show, setShow] = useState(true);
    const [acc, setacc] = useState('');
    const [uanme, setuname] = useState('');
    const [ag, setag] = useState('');
    const [mail, setmail] = useState('');
    const handleClose = () => {
        if(account && username && age && pn && email){
            setShow(false);
        }
        else{
            setShow(true);
        }
    }
    useEffect(() => {
        if(account && username && age && pn && email){
            setShow(false);
        }
    }, []);
    return ( 
        <Container className="justify-content-md-center" fluid>
            <Row style={{paddingTop: '1rem'}}>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}>
                    <Card style={{ width: '28rem' , alignItems: 'center' }}>
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