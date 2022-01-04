// dependencies
const express = require("express")
const axios = require("axios")

// create express instance
const app = express()

// metrics collection - Prometheus --------------
 const { countAllRequests } = require("./metrics/prometheus-metrics")
 app.use(countAllRequests())

// set endpoint port
const PORT = process.env.PORT || "8080"

// home route
app.get('/', (req,res) => {
    axios
        .get(`http://localhost:${PORT}/middle-tier`)
        .then(() => axios.get(`http://localhost:${PORT}/middle-tier`))
        .then(result => {
            res.send(result.data)
        })
        .catch(err => {
            console.error(err)
            res.status(500).send()
        })
})

// middle-tier route
app.get('/middle-tier', (req,res) => {
    axios
        .get(`http://localhost:${PORT}/backend`)
        .then(() => axios.get(`http://localhost:${PORT}/backend`))
        .then(result => {
            res.send(result.data)
        })
        .catch(err => {
            console.error(err)
            res.status(500).send()
        })
})

// backend route
app.get('/backend', (req,res) => {
    res.send('Hello World! (from the backend)')
})

// date route
app.get('/date', (req,res) => {
    res.json({ Date: new Date() })
})

// expose app endpoint
app.listen(parseInt(PORT,10), () => {
    console.log(`Listening for requests on http://localhost:${PORT}`)
})