const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { ConsoleMetricExporter, MeterProvider } = require('@opentelemetry/sdk-metrics-base')
const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-proto")


const metricsExporter = new OTLPMetricExporter({
  url: 'http://otel-collector:4318/v1/metrics',
  headers: {
    'Content-Type': 'application/x-protobuf'
  }
})

const meter = new MeterProvider({
    exporter: metricsExporter,
    interval: 1000,
}).getMeter('hello-world-metrics');

const requestCount = meter.createCounter("requests", {
    description: 'Hello World Requests Counter'
})

const boundInstruments = new Map();

module.exports.countAllRequests = () => {
    return (req, res, next) => {
    if (!boundInstruments.has(req.path)) {
        const labels = { route: req.path };
        const boundCounter = requestCount.bind(labels);
        boundInstruments.set(req.path, boundCounter);
    }

    boundInstruments.get(req.path).add(1);
    next();
    };
};  
