import http from 'k6/http'
import { check, sleep } from 'k6'

const baseUrl = __ENV.BASE_URL || 'https://localhost:5016/api'
const token = __ENV.ACCESS_TOKEN || ''
const headers = { Authorization: `Bearer ${token}`, 'X-Correlation-ID': `k6-${__VU}-${__ITER}` }
const profile = __ENV.PROFILE || '100'
const scenarios = {
  '100': { executor: 'ramping-vus', stages: [{ duration: '1m', target: 25 }, { duration: '3m', target: 100 }, { duration: '1m', target: 0 }] },
  '500': { executor: 'ramping-vus', stages: [{ duration: '2m', target: 100 }, { duration: '5m', target: 500 }, { duration: '2m', target: 0 }] },
  '1000': { executor: 'ramping-vus', stages: [{ duration: '3m', target: 250 }, { duration: '8m', target: 1000 }, { duration: '3m', target: 0 }] },
}
export const options = { scenarios: { api: scenarios[profile] || scenarios['100'] }, thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<800', 'p(99)<1500'] } }
const routes = ['/agents', '/workflows', '/reviews', '/customers?page=1&pageSize=25', '/posts', '/brandvoice', '/monitoring/report']
export default function () { const response = http.get(`${baseUrl}${routes[__ITER % routes.length]}`, { headers, tags: { endpoint: 'read-api' } }); check(response, { 'successful response': (r) => r.status >= 200 && r.status < 300 }); sleep(0.25) }
