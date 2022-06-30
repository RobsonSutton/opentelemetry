const express = require("express")
const app = express()

// metrics collection - OTLP --------------
// const { countAllRequests } = require("./metrics/otlp-metrics")
// app.use(countAllRequests())

// set endpoint port
const PORT = process.env.PORT || "3000"

// root route
app.get("/", (req, res) => {
    res.send("World Countries!")
})

// countries route
app.get("/countries", async (req, res) => {
    res.type("json")
    res.send(JSON.stringify({ countries: [
        { country: "England", iso_alpha_3: "ENG"},
        { country: "Scotland", iso_alpha_3: "SCO"},
        { country: "Wales", iso_alpha_3: "WAL"},
        { country: "Ireland", iso_alpha_3: "IRL"},
    ]}))
})

// expose app endpoint
app.listen(parseInt(PORT,10), () => {
    console.log(`Listening for requests on http://localhost:${PORT}`)
})