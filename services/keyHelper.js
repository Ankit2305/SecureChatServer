const generatorKey = 123456
const normalizerKey = 1000000007

//TODO: move public keys to Database
//contains userId to publicKey pairs
const publicKeyOf = {}

function addPublicKey(userId, publicKey) {
    publicKeyOf[userId] = publicKey
}

function getPublicKey(userId) {
    return publicKeyOf[userId]
}

function deletePublicKey(userId) {
    publicKeyOf[userId] = null
}

module.exports.keyHelper = {
    addPublicKey = addPublicKey,
    deletePublicKey = deletePublicKey,
    getPublicKey = getPublicKey
}