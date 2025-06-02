let RiskManagement = require('metaapi.cloud-sdk').RiskManagement;
let TrackerEventListener = require('metaapi.cloud-sdk').TrackerEventListener;

// your MetaApi API token
let token = process.env.TOKEN || 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4MjYwNjU0NjkxY2M2MWVmNzY4MzEwMjJkN2YzMWNiMCIsImFjY2Vzc1J1bGVzIjpbeyJpZCI6InRyYWRpbmctYWNjb3VudC1tYW5hZ2VtZW50LWFwaSIsIm1ldGhvZHMiOlsidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjUwZTM2YmNiLWYwYzItNDlkMi05MzlmLTRhZWE0ZWE4ZWI5NCJdfSx7ImlkIjoibWV0YWFwaS1yZXN0LWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6NTBlMzZiY2ItZjBjMi00OWQyLTkzOWYtNGFlYTRlYThlYjk0Il19LHsiaWQiOiJtZXRhYXBpLXJwYy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo1MGUzNmJjYi1mMGMyLTQ5ZDItOTM5Zi00YWVhNGVhOGViOTQiXX0seyJpZCI6Im1ldGFhcGktcmVhbC10aW1lLXN0cmVhbWluZy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo1MGUzNmJjYi1mMGMyLTQ5ZDItOTM5Zi00YWVhNGVhOGViOTQiXX0seyJpZCI6Im1ldGFzdGF0cy1hcGkiLCJtZXRob2RzIjpbIm1ldGFzdGF0cy1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6NTBlMzZiY2ItZjBjMi00OWQyLTkzOWYtNGFlYTRlYThlYjk0Il19LHsiaWQiOiJyaXNrLW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJyaXNrLW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjUwZTM2YmNiLWYwYzItNDlkMi05MzlmLTRhZWE0ZWE4ZWI5NCJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjUwZTM2YmNiLWYwYzItNDlkMi05MzlmLTRhZWE0ZWE4ZWI5NCJdfSx7ImlkIjoiY29weWZhY3RvcnktYXBpIiwibWV0aG9kcyI6WyJjb3B5ZmFjdG9yeS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6NTBlMzZiY2ItZjBjMi00OWQyLTkzOWYtNGFlYTRlYThlYjk0Il19XSwiaWdub3JlUmF0ZUxpbWl0cyI6ZmFsc2UsInRva2VuSWQiOiIyMDIxMDIxMyIsImltcGVyc29uYXRlZCI6ZmFsc2UsInJlYWxVc2VySWQiOiI4MjYwNjU0NjkxY2M2MWVmNzY4MzEwMjJkN2YzMWNiMCIsImlhdCI6MTc0ODMwMzgxMiwiZXhwIjoxNzUwODk1ODEyfQ.NgS1-TV6vn2PXGRaMvkRgN7cJqrSzVJXZGUv4AgftAPbajA-pPVq18MnccuYoIVie63pMA6Zwqz4QN-BJTF-uPEfUOLQxudcf8SJr9NqGne0vEcILKc8KLu1MPMDXigmxIVQ3sUw6EJCTR9swopyTRh1JO1c5e5ZX4ttzGHLj9Bs5NOtZ-ARRBI0FYmAgu-WYVFJSPiHee1YDHO6o_uFOEajNmxj-d-IikXEEAcZEKsiCOC7xhiZw7CIpC0LEPoHDrMgXE5Ojea9zrhpIsIVjqhSPdvd2HmHb-nn6vMkJhHerq6ZZlZk9YZvv2Yup3yN53aYma24-iLbI2ntBcRjlM8Ujv2CI6MGfF0indItlK3XAYX-b2I7zmo9GHcugqmLGl87HivHF24LwsPkFfycdYV0ghAQj02DjEswtC3RHJhu-c61PEr3DV0agLxOxnpTbHOHb2YgH6bH03WDLoQpN3WKs9mPXMhlpaqlSRiZMrzYLAC3W06F9A4e0IrBPn14W7JZ4cnYMBkcuDCL9M1tsCptSlETXbwmUj6wrBuuWt--BkXgmViwToVz-8LRdO_cb0y2rRorissQlya6wPum_LyDFPzm2rnclL2vjNvTmUE0mpqD22XTlnaLz4T4ZGRl-yBOVMuMKe17w6ukuhgAmoZD9tENe9e1tR3SNcq7Fi4';
// your MetaApi account id
// the account must have field riskManagementApiEnabled set to true
let accountId = process.env.ACCOUNT_ID || '50e36bcb-f0c2-49d2-939f-4aea4ea8eb94';
let domain = process.env.DOMAIN;

const riskManagement = new RiskManagement(token, {domain});
const riskManagementApi = riskManagement.riskManagementApi;

class ExampleTrackerEventListener extends TrackerEventListener {
  async onTrackerEvent(trackerEvent) {
    console.log('tracker event received', JSON.stringify(trackerEvent));
  }

  async onError(error) {
    console.log('error event received', error);
  }
}

async function main() {
  try {
    // creating a tracker
    let trackerId = await riskManagementApi.createTracker(accountId, {
      name: 'example-tracker',
      absoluteDrawdownThreshold: 5,
      period: 'day'
    });
    console.log('Created an event tracker ' + trackerId.id);

    // adding a tracker event listener
    let trackerEventListener = new ExampleTrackerEventListener(accountId, trackerId.id);
    let listenerId = riskManagementApi.addTrackerEventListener(trackerEventListener, accountId, trackerId.id);

    console.log('Streaming tracking events for 1 minute...');
    await new Promise(res => setTimeout(res, 1000 * 60));
    riskManagementApi.removeTrackerEventListener(listenerId);

    console.log('Receiving statistics with REST API');
    let events = await riskManagementApi.getTrackerEvents(undefined, undefined, accountId, trackerId.id);
    console.log('tracking events', JSON.stringify(events));
    let statistics = await riskManagementApi.getTrackingStatistics(accountId, trackerId.id);
    console.log('tracking statistics', JSON.stringify(statistics));
    let equityChart = await riskManagementApi.getEquityChart(accountId);
    console.log('equity chart', JSON.stringify(equityChart));

    // removing the tracker
    await riskManagementApi.deleteTracker(accountId, trackerId.id);
    console.log('Removed the tracker');
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

main();
