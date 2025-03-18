const sql = require('../config/pgdb');

const VerifyImage = function(verifyImage){
    this.productId = verifyImage.productId;
    this.imageName1 = verifyImage.imageName1;
    this.imageName2 = verifyImage.imageName2;
    this.imageName3 = verifyImage.imageName3;
};