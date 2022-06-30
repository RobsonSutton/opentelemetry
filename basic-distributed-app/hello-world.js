// dependencies
const express = require("express")
const axios = require("axios")

// create express instance
const app = express()

// metrics collection - Prometheus --------------
// const { countAllRequests } = require("./metrics/prometheus-metrics")
// app.use(countAllRequests())

// metrics collection - OTLP --------------
// const { countAllRequests } = require("./metrics/otlp-metrics")
// app.use(countAllRequests())

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


const getUrlContents = (url, fetch) => {
    return new Promise((resolve, reject) => {
        fetch(url, resolve, reject)
        .then(res => res.text())
        .then(body => resolve(body))
    }) 
}

app.get('/countries', async (req, res) => {
    const countries = await getUrlContents('http://world-countries:3000/countries', require("node-fetch")) // Restricted node-fetch version to below v3 as workaround for require()
    res.type('json')
    res.send(JSON.stringify({ dashboard: countries}))
})

// expose app endpoint
app.listen(parseInt(PORT,10), () => {
    console.log(`Listening for requests on http://localhost:${PORT}`)
})