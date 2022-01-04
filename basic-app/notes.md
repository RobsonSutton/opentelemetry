# Implementation

- Create a local docker image for the hello world app: **docker build -t hello-world .**
- Run docker compose: **docker-compose up -d**

## Endpoints
Hello World app: http://localhost:8080
Prometheus UI: http://localhost:9090
Metrics endpoint: http://localhost:9464/metrics
Zipkin UI: http://localhost:9411

# Console tracing

Console tracing is not currently enabled by default. 
To enable you will update the startup.sh to npm run console-tracing and then re-build the local docker image before running docker-compose.

# Inaccurate Traces

As Prometheus is polling the metrics endpoint in the app container, traces will be generated based on the metrics gathering. 
A future task would be to create a custom sampler to disregard health check / metrics gathering data or look at better ways to resolve this.