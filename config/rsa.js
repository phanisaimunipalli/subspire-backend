const crypto = require("crypto")
var fs = require("fs");
const path = require('path');

 //Very the registration code.
const encrypt = (textToEncrypt) => {
        return crypto.publicEncrypt(
        	{
                
        		key: fs.readFileSync(path.resolve(__dirname, './publickey.pem'), "utf8"),
        		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        		oaepHash: "sha256",
        	},
        	// We convert the data string to a buffer using `Buffer.from`
        	Buffer.from(textToEncrypt)
        ).toString("base64");

}

const decrypt = (encryptedText) => {
    return crypto.privateDecrypt(
        	{
        		key: fs.readFileSync(path.resolve(__dirname, './privatekey.pem'), "utf8"),
        		// In order to decrypt the data, we need to specify the
        		// same hashing function and padding scheme that we used to
        		// encrypt the data in the previous step
        		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        		oaepHash: "sha256",
        	},
        	Buffer.from(encryptedText, "base64")
        ).toString();
}

// This is the data we want to encrypt
// const data = "my secret data"

// const encryptedData = crypto.publicEncrypt(
// 	{
// 		key: publicKey,
// 		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
// 		oaepHash: "sha256",
// 	},
// 	// We convert the data string to a buffer using `Buffer.from`
// 	Buffer.from(data)
// )

// // The encrypted data is in the form of bytes, so we print it in base64 format
// // so that it's displayed in a more readable form
// console.log("encypted data: ", encryptedData.toString("base64"))

// const decryptedData = crypto.privateDecrypt(
// 	{
// 		key: privateKey,
// 		// In order to decrypt the data, we need to specify the
// 		// same hashing function and padding scheme that we used to
// 		// encrypt the data in the previous step
// 		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
// 		oaepHash: "sha256",
// 	},
// 	encryptedData
// )

// // The decrypted data is of the Buffer type, which we can convert to a
// // string to reveal the original data
// console.log("decrypted data: ", decryptedData.toString())

// // Create some sample data that we want to sign
// const verifiableData = "this need to be verified"

// // The signature method takes the data we want to sign, the
// // hashing algorithm, and the padding scheme, and generates
// // a signature in the form of bytes
// const signature = crypto.sign("sha256", Buffer.from(verifiableData), {
// 	key: privateKey,
// 	padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
// })

// console.log(signature.toString("base64"))

// // To verify the data, we provide the same hashing algorithm and
// // padding scheme we provided to generate the signature, along
// // with the signature itself, the data that we want to
// // verify against the signature, and the public key
// const isVerified = crypto.verify(
// 	"sha256",
// 	Buffer.from(verifiableData),
// 	{
// 		key: publicKey,
// 		padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
// 	},
// 	signature
// )

// // isVerified should be `true` if the signature is valid
// console.log("signature verified: ", isVerified)

// module.exports = new DBConnection().query;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
