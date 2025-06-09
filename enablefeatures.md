Enables features or APIs for trading account
About
Enables features or APIs for trading account. Currently available features and APIs are metastats API, riskmanagement API, increase account reliability. The account will be temporary stopped to perform this action. Note that this is a paid option

POST /users/current/accounts/:accountId/enable-account-features
For more information see swagger documentation

Headers
Name Type Required Description
auth-token string Yes Authorization token. See Authentication and authorization
Path parameters
Name Type Required Description
accountId string Yes Trading account id
Body
Name Type Required Description
copyFactoryApi object Configuration for CopyFactory2 API. Configuration must contain copyFactoryRoles field as array of CopyFactory2 roles and copyFactoryResourceSlots field which stands for number of CopyFactory2 resource slots to allocate to account.
riskManagementApiEnabled boolean Flag indicating that risk management API will be enabled on account
metastatsApiEnabled boolean Flag indicating that metaStats API will be enabled on account
reliabilityIncreased boolean Flag indicating that reliability will be increased on account
allocateDedicatedIp string If set, allocates a dedicated IP with specified protocol to connect to the trading account terminal. If an account has replicas deployed in different regions at the same time, a separate IP address will be dedicated for the account in each region. Allowed value is ipv4
Response
204 - New features enabled for account
401 - Authorization failed. Response schema: Error
403 - Method or resource access permissions are missing. Response schema: Error
404 - Account not found. Response schema: Error
Examples
Example request:

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'auth-token: token' -d '{
"copyFactoryApi": {
"copyFactoryRoles": [
"PROVIDER"
],
"copyFactoryResourceSlots": 1
},
"riskManagementApiEnabled": true,
"metastatsApiEnabled": true,
"reliabilityIncreased": true,
"allocateDedicatedIp": "ipv4"
}' 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/1eda642a-a9a3-457c-99af-3bc5e8d5c4c9/enable-account-features'
