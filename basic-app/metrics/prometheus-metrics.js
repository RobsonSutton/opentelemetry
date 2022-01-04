'use strict'

// dependencies
const { MeterProvider} = require("@opentelemetry/sdk-metrics-base")
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus')

// create exporter instance for prometheus
const exporter = new PrometheusExporter(
  {
    startServer: true,
  },
  () => {
    console.log(
      `Prometheus scrape endpoint: http://localhost:${PrometheusExporter.DEFAULT_OPTIONS.port}${PrometheusExporter.DEFAULT_OPTIONS.endpoint}`,
    )
  },
)

const meter = new MeterProvider({
exporter,
interval: 1000,
}).getMeter('example-prometheus')

const requestCount = meter.createCounter('requests', {
  description: 'Example of a Counter',
})

const boundInstruments = new Map()

module.exports.countAllRequests = () => {
  return (req, res, next) => {
    if (!boundInstruments.has(req.path)) {
      const labels = { route: req.path }
      const boundCounter = requestCount.bind(labels)
      boundInstruments.set(req.path, boundCounter)
    }

    boundInstruments.get(req.path).add(1)
    next()
  }
}
