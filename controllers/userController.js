const User = require('../models/User')
const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)


exports.findOrCreateUser = async token => {
    // verify auth token 
 const googleUser = await verifyAuthToken(token)
 console.log(`after verifying the user: ${googleUser}`)
    // check if the user exists 
    const user = await checkifUserExists(googleUser.email)
    console.log(`checking the user is exists: ${user}`)
    // if user exist , return them; otherwise, create new user in data base 
    return user ? user : createNewUser(googleUser)
}

const verifyAuthToken = async token => {
    try {

     const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID  
        })
        return ticket.getPayload()
    }catch (err){

        console.error("Error verifying auth token", err)
    }
}

const checkifUserExists = async email => await User.findOne({ email }).exec()

const createNewUser = googleUser => {
    const { name, email, picture } = googleUser

    const user = { name, email, picture }

    return new User(user).save()
}