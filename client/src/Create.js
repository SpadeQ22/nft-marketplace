import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

const Create = ( { items_list, setItems_list } ) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const navigation = useNavigate();

  const getImage = (event) => {
    event.preventDefault();
    setImage('https://i.imgur.com/DoTHD9G.png');
  }
  
  const createNFT = () => {
    let items = items_list;
    items.push({
      totalPrice: price,
      itemId: 0, 
      seller: 'admin', 
      name: name, 
      description: description,
      image: image
    })
    setItems_list(items);
    navigation('/')
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={getImage}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="dark" size="lg">
                  Create NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create