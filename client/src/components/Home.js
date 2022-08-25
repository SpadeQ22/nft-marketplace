import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import LoadingOverlay from 'react-loading-overlay'

const Home = ({ marketplace, nft, acccheck }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const nav = useNavigate();
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await(marketplace.itemCount())
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await(marketplace.items(i))
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await(nft.tokenURI(item.tokenId))
        // use uri to fetch the nft metadata stored on ipfs
        console.log(uri); 
        const response = await(fetch(uri, {headers: { "Access-Control-Allow-Origin": "*" }}))
        console.log(response);
        const metadata = await(response.json())
        // get total price of item (item price + fee)
        const totalPrice = await(marketplace.getTotalPrice(item.itemId))
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
        setItems(items)
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    if(acccheck){
      nav("/user-info");
      return
    }
    loadMarketplaceItems()
  }, [])


  // if (loading) return (
  //   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
  //     <Spinner animation="border" style={{ display: 'flex' }} />
  //     <p className='mx-3 my-0'>Loading...</p>
  //   </div>
  // )
  return (
    <div className="flex justify-center">
      {loading && <div style={{width:"100%", position: "absolute", display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', zIndex: "999"}}>
      <Spinner animation="border" style={{ display: 'flex' }} />
      <p className='mx-3 my-0'>Loading...</p>
      </div>}
      {(items.length > 0) &&
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card border="dark">
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="dark" size="lg">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ICZ
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>}
        {(!loading) && (items.length == 0) &&
          <div style={{ padding: "1rem 0", textAlign: 'center' }}>
            <h2>No listed assets</h2>
          </div>
        }
    </div>
  );
}
export default Home