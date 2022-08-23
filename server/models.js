class User {

    address;
    name;
    age;
    email;
    phoneNumber;

    constructor(json) {
        this.address = json['address'];
        this.name = json['name'];
        this.age = json['age'];
        this.email = json['email'];
        this.phoneNumber = json['phoneNumber'];
    }
}

class NFT {

    nftAddress;
    name;
    description;
    hasLicense;
    licenseType;
    ownerAddress;

    constructor(json) {
        this.nftAddress = json['nftAddress'];
        this.name = json['name'];
        this.description = json['description'];
        this.hasLicense = json['hasLicense'];
        this.licenseType = json['licenseType'];
        this.ownerAddress = json['ownerAddress'];
    }

    nftAddress() {
        return this.nftAddress;
    }

    name() {
        return this.name;
    }

    description() {
        return this.description;
    }

    hasLicense() {
        return this.hasLicense;
    }

    licenseType() {
        return this.licenseType;
    }

    ownerAddress() {
        return this.ownerAddress;
    }
}

module.exports = {
    User,
    NFT,
};