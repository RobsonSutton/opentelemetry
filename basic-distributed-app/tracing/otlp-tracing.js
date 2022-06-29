const process = require('process')
const opentelemetry = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')

const traceExporter = new OTLPTraceExporter({
    url: 'http://apm-server:8200',

    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {}, 
})

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "hello-world",
    [SemanticResourceAttributes.SERVICE_VERSION]: "1.1",
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: "development"
  }),
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
})

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error))

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0))
})