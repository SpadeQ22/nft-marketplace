import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router';

const ipfsClient = require('ipfs-http-client');

const projectId = '2DoTE6n5DzBzKm5qcPOlmnhx0gI';

const projectSecret = '9b2da398d7532a58c8dec6f78b158e1b';

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

const Create = ({ marketplace, nft, acccheck }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const nav = useNavigate();

  const uploadToAWS = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const formData = new FormData();
    formData.append("file", file);
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
      setImage(result.link);
    })
    .catch((error) => {
      console.error("Error:", error);
      });
    };

  const createNFTAWS = async () => {
    if (!image || !price || !name || !description) return
    await fetch("/uploaduri", {
      method: "POST",
      headers: {"Accept":"application/json", "Content-Type":"application/json"},
      body: JSON.stringify({image, price, name, description})
    })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result.link);
      mintThenList(result.link)
    })
    .catch((error) => {
      console.error("Error:", error);
      });
    };
    
  const mintThenList = async (result) => {
    nav("/");
    const uri = result;
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
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
                onChange={uploadToAWS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ICZ" />
              <div className="d-grid px-0">
                <Button onClick={createNFTAWS} variant="dark" size="lg">
                  Create & List NFT!
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