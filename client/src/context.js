// createContext to store our user data 
import { createContext } from 'react'

const Context = createContext({
    currentUser : null,
    isAuth: false
})

export default Context;