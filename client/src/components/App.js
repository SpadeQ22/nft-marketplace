import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import Create from './Create.js'
import User from "./User";
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import MarketplaceData from '../contractsData/Marketplace.json'
import NFTData from '../contractsData/NFT.json'
import 'bootstrap/dist/css/bootstrap.css'
import { useState } from 'react'
import { ethers } from "ethers"
import { Spinner, Modal, Button, Form } from 'react-bootstrap'
import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  const [creds, setCreds] = useState({username:"", age:null, pn:"", email:""});
  const [credserr, setCredserr] = useState({});
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [pn, setPn] = useState("");
  const [email, setEmail] = useState("");
  const [acccheck, setAcccheck] = useState(false);
  const [validate, setValidate] = useState(false);
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    fetch(`/userinfo/${accounts[0]}`).then((res) =>{
      res.json().then((data) => {
          setAge(data.age);
          setUsername(data.name);
          setPn(data.phonenumber);
          setEmail(data.email);
      }).catch(()=>{
        setAcccheck(true);
      });
    });

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(MarketplaceData.networks["552"]["address"], MarketplaceData.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTData.networks["552"]["address"], NFTData.abi, signer)
    setNFT(nft)
    setLoading(false)
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    console.log(name, value)
    setCreds({...creds, [name]:value});
    if(!!credserr[name]){
      setCredserr({...credserr, [name]: null})
    }
  }

  const validateForm = () => {
    const { username, age, pn, email } = creds;
    const errors = {}
    if(!username){errors.username = "Please Enter Your Username!"} 
    if(!age){errors.age = "Please Enter Your Age!"} 
    if(!pn){errors.pn = "Please Enter Your Phone Number!"} 
    if(!email){errors.email = "Please Enter Your Email!"}
    return errors;
  }

  

  const handleNewacc = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if(Object.keys(formErrors).length > 0 ){setCredserr(formErrors)}
    else{
      const { username, email, age, pn } = creds;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address:account, name:username, email, age, phonenumber:("+20"+pn.toString())})
      };
      fetch('/userinfo', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));
        setAcccheck(false);
        setAge(age);
        setUsername(username);
        setPn(pn);
        setEmail(email);
    }
    setValidate(true);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} />
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : 
          (
            <div>
            {acccheck ? (
              <Modal show={acccheck}>
              <Modal.Header>
                <Modal.Title>Create an Account</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form validated={validate}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control required type="email" placeholder="Enter email" name={"email"} value={creds.email} onChange={handleChange}/>
                          <Form.Text className="text-muted">
                              We'll never share your email with anyone else.
                          </Form.Text>
                      <Form.Control.Feedback type="invalid">{credserr.email}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Name</Form.Label>
                      <Form.Control required type="text" placeholder="Enter Name" name={"username"} value={creds.username} onChange={handleChange}/>
                      <Form.Control.Feedback type="invalid">{credserr.username}</Form.Control.Feedback>
                      <Form.Label>Age</Form.Label>
                      <Form.Control required type="number" placeholder="Enter Age" name={"age"} value={creds.age} onChange={handleChange}/>
                      <Form.Control.Feedback type="invalid">{credserr.age}</Form.Control.Feedback>
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control required type="number" placeholder="Enter Phone Number" name={"pn"} value={creds.pn} onChange={handleChange}/>
                      <Form.Control.Feedback type="invalid">{credserr.pn}</Form.Control.Feedback>
                      </Form.Group>
                  </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={handleNewacc}>
                  Sign Up
                </Button>
              </Modal.Footer>
            </Modal>
            ) : (
              <Routes>
              <Route path="/" element={<Home marketplace={marketplace} nft={nft}/>}/>
              <Route path="/create" element={<Create marketplace={marketplace} nft={nft}/>}/>
              <Route path="/my-listed-items" element={<MyListedItems marketplace={marketplace} nft={nft} account={account}/>}/>
              <Route path="/my-purchases" element={<MyPurchases marketplace={marketplace} nft={nft} account={account}/>}/>
              <Route path="/user-info" element={<User account={account} username={username} age={age} pn={pn} email={email}/>}/>
              </Routes>
            )}
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
