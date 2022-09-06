import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router';

const Create = ({ marketplace, nft, acccheck }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [hide, setHide] = useState({"name":true, "price":true, "file":true, "description":true});
  const nav = useNavigate();

  const uploadToAWS = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        var height = this.height;
        var width = this.width;
        if (height < 270 || width < 300) {
          alert("Height must exceed 270px and Width must exceed 300px.");
          event.target.value=null;
          setImage('')
        }
        else{
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
        }
      };
    };
  }

  const createNFTAWS = async () => {
    validateForm();
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
  }
    
  const mintThenList = async (result) => {
    nav("/");
    const uri = result;
    await(await nft.mint(uri)).wait()
    const id = await nft.tokenCount()
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }

  const validateForm = () => {
    let temp = JSON.parse(JSON.stringify(hide));
    if(!image) temp["file"]=false
    else temp["file"]=true
    if(!price) temp["price"]=false
    else temp["price"]=true
    if(!name) temp["name"]=false
    else temp["name"]=true
    if(!description) temp["description"]=false
    else temp["description"]=true
    setHide(temp);
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
                isInvalid={!hide["file"]}
              />
              <div style={{ marginTop:".25rem", fontSize:".875em", color:"#dc3545"}} hidden={hide["file"]}>Please Enter a Valid Image</div>
              <Form.Control isInvalid={!hide["name"]} onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <div style={{ marginTop:".25rem", fontSize:".875em", color:"#dc3545"}} hidden={hide["name"]}>Please Enter a Valid Name</div>
              <Form.Control isInvalid={!hide["description"]} onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <div style={{ marginTop:".25rem", fontSize:".875em", color:"#dc3545"}} hidden={hide["description"]}>Please Enter a Valid Description</div>
              <Form.Control isInvalid={!hide["price"]} onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ICZ" />
              <div style={{ marginTop:".25rem", fontSize:".875em", color:"#dc3545"}} hidden={hide["price"]}>Please Enter a Valid Price</div>
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