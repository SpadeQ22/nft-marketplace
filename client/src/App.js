import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './Navbar';
import Home from './Home.js'
import Create from './Create.js'
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import items_list from './itemslist';

function App() {
  const [account, setAccount] = useState(null)
  const [itemsList, setItemsList] = useState(items_list)
  const web3Handler = () => {
    setAccount("admin");
  }

  return (
    <Router>
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} />
        <div>
          <Routes>
            <Route path="/" element={<Home items_list={ itemsList } setItems_list= { setItemsList }/>}/>
            <Route path="/create" element={<Create items_list={ itemsList } setItems_list= { setItemsList }/>}/>
            <Route path="/my-listed-items" element={<MyListedItems/>}/>
            <Route path="/my-purchases" element={<MyPurchases/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
