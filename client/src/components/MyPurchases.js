import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap'

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const loadPurchasedItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
    const results = await marketplace.queryFilter(filter)
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }
  useEffect(() => {
    loadPurchasedItems()
  }, [])

  return (
    <div className="flex justify-center">
      {loading && <div style={{width:"100%", position: "fixed", display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '95vh', zIndex: "999"}}>
      <Button variant="dark">
        <Spinner as="span" size="sm" animation="border"/> <span>Loading...</span>
      </Button>
      </div>}
      {(purchases.length > 0) &&
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ICZ</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>}
        {(!loading) && (purchases.length === 0) &&
          <div style={{ padding: "1rem 0", textAlign: 'center' }}>
            <h2>No listed assets</h2>
          </div>
        }
    </div>
  );
}