const { Pool } = require('pg');
    
const clientPool = new Pool({
    host: 'database-1.cvwemstkxffy.us-east-1.rds.amazonaws.com',
    user: 'postgres',
    database: 'NFT_MarketPlace',
    password: 'adminadmin',
    port: 5432,
});

async function establishDatabaseConnection() {
    // var pg = require('pg');
    // var connectionString = "postgres://postgres:adminadmin@database-1.cvwemstkxffy.us-east-1.rds.amazonaws.com:5432/NFT_MarketPlace";

    // var client = new pg.Client(connectionString);

    var clientConnection;
    
    clientPool.connect((err, client) => {
        if(err) {
            console.error('Database connection failed: ' + err.stack);
            return;
        }
        clientConnection = client;
        console.log('Connected to database.');
    });

    return clientConnection;
}

function releaseConnection(clientConnection) {
    clientConnection.release();
    return;
}

function getClientInfo(address) {
    establishDatabaseConnection();
    var query_1 = "SELECT * FROM client WHERE address = '" + address + "'";

    var client = {};

    var result = clientPool.query(query_1, (err, res) => {
        if (err) {
            console.log(err.stack)
        }
        else {
            console.log(res['rows'][0]);
            client = res['rows'][0];
            return client;
        }
    });

    console.log(client);

    return result;

    // releaseConnection(client);
}

function getAllNFTItems() {
    establishDatabaseConnection();
    var query = 'SELECT * FROM nft_object';

    var response;

    clientPool.query(query, (err, res) => {
        if (err) {
            console.log(err.stack)
        }
        else {
            console.log(res['rows'])
            response = res['rows'];
        }
    });

    return response;
}

function getOwnerNFTItems(ownerAddress) {
    establishDatabaseConnection();
    var query = "SELECT * FROM nft_object WHERE owneraddress = '" + ownerAddress + "'";

    var response;

    clientPool.query(query, (err, res) => {
        if (err) {
            console.log(err.stack)
        }
        else {
            response = res['rows'];
            console.log(res['rows'])
        }
    });

    return response;
}

module.exports = {
    establishDatabaseConnection,
    getClientInfo,
    getAllNFTItems,
    getOwnerNFTItems,
};