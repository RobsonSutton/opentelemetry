# OpenTelemetry

**Resources**
- Bootcamp - https://www.aspecto.io/opentelemetry-bootcamp/
- Registry - https://opentelemetry.io/registry/
- Docs - https://opentelemetry.io/docs/

# Intro to OpenTelemetry and basic deployment

- Logs - The error (e.g. can't write to db-1)
- Metrics - The technical why (e.g. High CPU)
- Traces - The context (e.g. The path within the system)

# OpenTelemetry SDK break down

One specification, implemented for each programming language

[SDK Architecture Diagram](images/sdk_architecture.png)

Main Steps:
1. Collect data about the application
2. Propogate context between services (distributed systems)
3. Ship data

## SDK / SDK API

### Provider (Collect Data)
- Instrumentation 
- Sampler
- Propagator + Context
- Resources + Detectors
- Tracer

### Processor (Process Data)
- Acts as a pipeline, Read/Update/Delete
- Enforce sampling
- Example: BatchSpanProcessor -> queues spans before then flushing to exporter, providing performance benefits compared to SimpleSpanProcessor

### Exporters (Send Data)
- Send the data from SDK
- Authorisation
- Protocols: HTTP and gRPC
- Formats: JSON and proto

## Provider

**Instrumentation**
- Patch / attach to library
- Collect data at runtime 
- Produce spans (based on specification and semantic conventions)
- May offer additional configuration/features
- Auto Instrumentation -> Listed in OpenTelemetry Registry (https://opentelemetry.io/registry/)
- Manual Instrumentation -> Manually write instrumentation (set span start/end, set status, add attributes and add events etc.)

**Resources**

Add specific metadata at instrumentation stage (add user defined details to span)
**Detectors**
- Predefined classes for collecting data
- Specific metadata detected can be then merged with any resources and applied to the tracer

**Sampler** 
- Determine when to sample or not
- Respect upstream services decisions 
    **pre-defined:**
    - AlwaysOn / AlwaysOff
    - Parent Based
    - Trace ID Ratio

**Propagator** 

Objects used to read and write context data to and from messages exchanged by applications
- Inject context on outgoing activities
- Extract context from incoming activities
- Often completed via HTTP headers

**Trace Context (Required)**

Refers to metadata defined to allow for correlating trace information across service boundaries
- Version
- Trace ID
- Span ID (parent span)
- Trace Flags (sampling)
- Trace State (vendor specific information)

**Baggage / Correlation Context (Optional)**
- Sending key value pair along with trace context
- Use cases: "Decision" made upstream; business oriented data; upstream services

# Deployment methods and production ready

## Collectors 

**Collector Gateway** - Different host to app
**Collector Agent** - Same host as app

**Receivers**
- Define how data is being received (e.g. OTLP)
- Define listening port

**Processors**
- Gets data from receiver and moves to exporter / another processor
- Batch, Sampler, etc.
- Used to control rate / alter data / sample
- Exclusive ownership vs Shared ownership (cloning data from receiver to multiple processors)
- Order of processors used is important
- Add additional attributes

**Exporters**
- Define how data will be sent (e.g. OTLP)
- Export to console, vendors etc.

**Extensions**
- Extra functions not related to collector pipelines
- Health check, performance extension (logging performance data) etc.

**Service**
- Define extensions used
- Define pipelines of receivers, processors (can be multiple), exporters

**Example configuration**
App (containing OTEL SDK implementation) -> OTEL Collector Agent -> OTEL Collector Gateway -> ElasticSearch

# Sampling and dealing with high volumes

## Sampling

What percentage of traces do you wish to collect?
Can be configured based on log level to reduce cost (e.g. collect 10% of all traces (get application baseline) + 100% of all ERROR level traces)

### Head Sampling
Sample when span starts (SDK - spanStart())
Completed during processor
Use cases:
- Only specific routes (only traces with user.paying etc.)

### Tail Sampling
Sample when traces are completed (Collector - Processor)
(Above 10% + 100% example would require sampling at collector level to understand whether a trace has errored)
Use cases:
- Only errors
- Above certain latency

**Simple implementation**
- Single collector
**Resilient implementation**
- More complex when using Load Balancer and multiple collectors as spans will be across multiple collectors preventing trace identification
- Optimal Solution: 2 layers of collectors using otel collector load balancers behind load balancer to send related spans to same collector

**Sampling Performance** - refer to OpenTelemetry Github

Monitor Cost based on spans and underlying infrastructure / resources cost when implementing OpenTelemetry

# Custom Instrumentation

**Span**
- Is important and has a duration
- Has a start and end time

**Span attributes**
- Missing data without a duration

**Span events**
- An event that takes place within a span
- Takes place at a single point in time

