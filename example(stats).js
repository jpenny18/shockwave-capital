let MetaStats = require('metaapi.cloud-sdk').MetaStats;
let MetaApi = require('metaapi.cloud-sdk').default;

// your MetaApi API token
let token = process.env.TOKEN || 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4MjYwNjU0NjkxY2M2MWVmNzY4MzEwMjJkN2YzMWNiMCIsImFjY2Vzc1J1bGVzIjpbeyJpZCI6InRyYWRpbmctYWNjb3VudC1tYW5hZ2VtZW50LWFwaSIsIm1ldGhvZHMiOlsidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjUwZTM2YmNiLWYwYzItNDlkMi05MzlmLTRhZWE0ZWE4ZWI5NCJdfSx7ImlkIjoibWV0YWFwaS1yZXN0LWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6NTBlMzZiY2ItZjBjMi00OWQyLTkzOWYtNGFlYTRlYThlYjk0Il19LHsiaWQiOiJtZXRhYXBpLXJwYy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo1MGUzNmJjYi1mMGMyLTQ5ZDItOTM5Zi00YWVhNGVhOGViOTQiXX0seyJpZCI6Im1ldGFhcGktcmVhbC10aW1lLXN0cmVhbWluZy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo1MGUzNmJjYi1mMGMyLTQ5ZDItOTM5Zi00YWVhNGVhOGViOTQiXX0seyJpZCI6Im1ldGFzdGF0cy1hcGkiLCJtZXRob2RzIjpbIm1ldGFzdGF0cy1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6NTBlMzZiY2ItZjBjMi00OWQyLTkzOWYtNGFlYTRlYThlYjk0Il19LHsiaWQiOiJyaXNrLW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJyaXNrLW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjUwZTM2YmNiLWYwYzItNDlkMi05MzlmLTRhZWE0ZWE4ZWI5NCJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjUwZTM2YmNiLWYwYzItNDlkMi05MzlmLTRhZWE0ZWE4ZWI5NCJdfSx7ImlkIjoiY29weWZhY3RvcnktYXBpIiwibWV0aG9kcyI6WyJjb3B5ZmFjdG9yeS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6NTBlMzZiY2ItZjBjMi00OWQyLTkzOWYtNGFlYTRlYThlYjk0Il19XSwiaWdub3JlUmF0ZUxpbWl0cyI6ZmFsc2UsInRva2VuSWQiOiIyMDIxMDIxMyIsImltcGVyc29uYXRlZCI6ZmFsc2UsInJlYWxVc2VySWQiOiI4MjYwNjU0NjkxY2M2MWVmNzY4MzEwMjJkN2YzMWNiMCIsImlhdCI6MTc0ODMwMzYxNiwiZXhwIjoxNzUwODk1NjE2fQ.NEWW1BguB3c-PYJm8XqSHjQdr7BXLhIAZHq-0ZgfJ40TuemfgZkZbPdS1FATj_Eje8I7Y7nRpygFjOV1SLmk7RuRtQI96oVoVhktB9cIXfuTarLQf125iB_d2uigQuO4gQw2PWOZw8UoOuDrSbgLqygbGfqeliG367wUYtBsi-RnD7jGad46l_7jRpr3aUkm43GhkWFjn7iMLpdiKXeAQI3YteKNROhC-WXJ4-cy8xKjG2CGPOwo2MYIgzHzTy41roUKOcVgBykP8vuRPH_t5Xmy5F5Q2f-v0y4zxbHULp8Zy2uEuZUGT_5auOmftsC_wnwrVaGxHGC7Tw9oTUaKi0mrcP0p8x9lkPBarKbBv4Uad6eS9NbZxUqRdRYMeUis3V2mfPI_pmbP9sF4mU6u2h7CIEPf9ZwgMNBEG0t0AlmmtEOxbRCWtiWkKIvTAnudeFR1WUs9KbpK6Mfo8gLMfkZRdSxFAIwMon2Qk2s82gg26J2fTXofJgR7XuZd8aTS6pp73F4z4Gih_oXqa-Uw2jbsyYnnv38l6fP4a2ilr9IixTnNUGAjRRkhYEliur0JEIs6e-dNLGvkMhv104wqJtQZNJLAJKmBlNaQQAbY1rDbyWjg_ltO3ORX4LMa0ydlC6ztbzQmY4lzyoRakChJPg2iSIF5GEeW_0XZsT8Iu1g';
// your MetaApi account id
let accountId = process.env.ACCOUNT_ID || '50e36bcb-f0c2-49d2-939f-4aea4ea8eb94';

const api = new MetaApi(token);
const metaStats = new MetaStats(token);
// you can configure http client via second parameter,
// see esdoc in-code documentation for full definition of possible configuration options

async function exampleRequest() {
  try {
    let account = await api.metatraderAccountApi.getAccount(accountId);

    // wait until account is deployed and connected to broker
    console.log('Deploying account');
    if (account.state !== 'DEPLOYED') {
      await account.deploy();
    } else {
      console.log('Account already deployed');
    }
    console.log('Waiting for API server to connect to broker (may take couple of minutes)');
    if (account.connectionStatus !== 'CONNECTED') {
      await account.waitConnected();
    }

    let metrics = await metaStats.getMetrics(accountId);
    console.log(metrics);//-> {trades: ..., balance: ..., ...}
    
    let trades = await metaStats.getAccountTrades(accountId, '0000-01-01 00:00:00.000', '9999-01-01 00:00:00.000');
    console.log(trades.slice(-5));//-> {_id: ..., gain: ..., ...}
    
    let openTrades = await metaStats.getAccountOpenTrades(accountId);
    console.log(openTrades);//-> {_id: ..., gain: ..., ...}

  } catch (err) {
    console.error(err);
  }
}

exampleRequest();
