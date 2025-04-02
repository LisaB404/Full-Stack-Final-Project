const express = require('express')
const bcrypt = require('bcrypt')
const { User } = require('./config')
const session = require('express-session')

const port = 3000;
const app = express()

// CORS to manage frontend requests
const cors = require('cors')
app.use(cors({ origin: "http://localhost:5173" }))

// Middleware to parsre JSON and form data
app.use(express.json()) // convert data into json
app.use(express.urlencoded({ extended: false })) // pallows access to form data

// Middleware to handle user sessions
app.use(session({
    secret: 'your-secret-key', // Cambialo con una chiave più sicura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true } // secure: true se usi HTTPS
}));

// ==========================
// API RESTful Routes
// ==========================

// connect to style.css static path
app.use(express.static('public'))


// homepage you see when you are logged in
/*  app.get('/', (req, res) => {
    res.render('home.ejs')
})  */


// SIGNUP ROUTE

/* app.get('/signup', (req, res) => {
    res.render('signup.ejs')
}) */

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
/*     const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    } */
    
        //user if user already exists
        const existingUser = await User.findOne({name})

        if(existingUser) {
            return res.status(400).json({ message: 'User already exists. Please choose another username.' })
        }
        //hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10) //10 standard and secure
        //password = hashedPassword //replace password with hashed password

        //create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        /* await collection.insertMany(data) //send data to database */
        return res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})


// LOGIN ROUTE

/* app.get('/login', (req, res) => {
    res.render('login.ejs')
}) */

app.post('/api/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        //search user in the database
        const user = await User.findOne({name})
        if(!user){
            return res.status(404).send('User does not exist')
        }
        //compare hashed password from database with plain text
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        } 
        //save user session
        req.session.user = { id: user._id, name: user.name, email: user.email };

        res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})


// LOGOUT ROUTE
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
