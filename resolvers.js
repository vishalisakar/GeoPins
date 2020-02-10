const { AuthenticationError } = require('apollo-server')

 /* const user = {
    _id: "1",
    name: "Vishu",
    email: "vishu@gmail.com",
    picture: "https://cloudinary.com/asdf"
}  */

const authenticated = next => (root, args, ctx, info ) => {

    if(!ctx.currentUser) {
        throw new AuthenticationError('You must be Logged in ')
    }
    console.log(ctx.currentUser)
    return next(root, args, ctx, info)
}

module.exports = {
    Query: {
        me: authenticated( (root, args, ctx) => ctx.currentUser )
        // me : () => user 
    }
}