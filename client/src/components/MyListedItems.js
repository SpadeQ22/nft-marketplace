import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap'

function renderSoldItems(items) {
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Footer>
                For {ethers.utils.formatEther(item.totalPrice)} ICZ - Recieved {ethers.utils.formatEther(item.price)} ICZ
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      if (i.seller.toLowerCase() === account) {
        const uri = await nft.tokenURI(i.tokenId)
        const response = await fetch(uri)
        const metadata = await response.json()
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        if (i.sold) soldItems.push(item)
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }
  useEffect(() => {
    loadListedItems()
  }, [])

  return (
    <div className="flex justify-center">
      {loading && <div style={{width:"100%", position: "fixed", display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '95vh', zIndex: "999"}}>
      <Button variant="dark" style={{pointerEvents: "none"}}>
        <Spinner as="span" size="sm" animation="border"/> <span>Loading...</span>
      </Button>
      </div>}
      {(listedItems.length > 0) &&
        <div className="px-5 py-3 container">
            <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>
                    {item.name}<br/>
                    {ethers.utils.formatEther(item.totalPrice)} ICZ
                    </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
            {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>}
        {(!loading) && (listedItems.length === 0) &&
          <div style={{ padding: "1rem 0", textAlign: 'center' }}>
            <h2>No listed assets</h2>
          </div>
        }
    </div>
  );
}