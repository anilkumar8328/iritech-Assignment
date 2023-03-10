const jwt = require('jsonwebtoken')

const userauthentication = async function(req, res, next){
    try {
        const token = req.headers.authorization
        if (!token) {
        return res.status(400).send({ status: false, message: `Token Not Found` })}    
        
        let splitToken = token.split(' ')
        let decodeToken = jwt.verify(splitToken[1], "IRITECH-USER-JWT")
    
        if (!decodeToken) {
        return res.status(401).send({ status: false, message: `Invalid Token` })}
        req.userId = decodeToken.userId

        next()
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const adminauthentication = async function(req, res, next){
    try {
        const token = req.headers.authorization
        if (!token) {
        return res.status(400).send({ status: false, message: `Token Not Found` })}    
        
        let splitToken = token.split(' ')
        let decodeToken = jwt.verify(splitToken[1], "IRITECH-ADMIN-JWT")
    
        if (!decodeToken) {
        return res.status(401).send({ status: false, message: `Invalid Token` })}
        req.adminId = decodeToken.adminId
        console.log(decodeToken);
        next()
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {userauthentication,adminauthentication}