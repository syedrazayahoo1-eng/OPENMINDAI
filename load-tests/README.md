# DIGITECH load testing

Install [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) and obtain a non-production bearer token.

```powershell
$env:BASE_URL='https://your-api.example.com/api'
$env:ACCESS_TOKEN='short-lived-test-token'
k6 run -e PROFILE=100 digitech-api.js
k6 run -e PROFILE=500 digitech-api.js
k6 run -e PROFILE=1000 digitech-api.js
```

The script covers authenticated read APIs and captures throughput, error rate, average, P95, and P99 latency. Run workflow/AI load separately against sandbox integrations only, because those actions can send messages or invoke billable providers.

Acceptance targets: error rate below 1%, P95 below 800 ms, P99 below 1.5 s for cached/read APIs. Export k6 JSON output and correlate it with Application Insights CPU, memory, SQL dependency duration, Redis latency, SignalR connections, and workflow queue depth.
