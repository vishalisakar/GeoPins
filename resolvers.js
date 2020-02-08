const user = {
    _id: "1",
    name: "Vishu",
    email: "vishu@gmail.com",
    picture: "https://cloudinary.com/asdf"
}

module.exports = {
    Query: {
        me: () => user
    }
}