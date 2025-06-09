Create account
About
Adds a trading account and starts a cloud API server for the trading account. It can take some time for the API server and trading terminal to start and connect to broker. You can use the connectionStatus replica field to monitor the current status of the trading account.

POST /users/current/accounts
For more information see swagger documentation

Headers
Name Type Required Description
auth-token string Yes Authorization token. See Authentication and authorization
transaction-id string Yes Transaction id is used to identify a unique transaction. For the new request please generate a random 32-character transaction id. If your request has returned 202 status code, please reuse the same transaction id value to poll the result of the request you've sent earlier.
Body
Name Type Required Description
login string Trading account number. Only digits are allowed
password string Trading account password. The password can be either investor password for read-only access or master password to enable trading features. Required for cloud account
name string Yes Human-readable account name
server string Yes Trading server name to connect to
provisioningProfileId string Id of the provisioning profile that was used as the basis for creating this account. You need to provide provisioning profile id in case automatic broker settings detection has failed for your broker
platform string MetaTrader platform, enum: mt4, mt5. Required if provisioningProfileId is not specified
magic number Yes Magic value the trades should be performed using. When manualTrades field is set to true, magic value must be 0
type string Account type. Executing accounts as cloud-g2 is faster and cheaper. Cloud and cloud-g2 are aliases, enum: cloud-g1, cloud-g2, default: cloud-g2
region string Region id to deploy account at
symbol string Any trading symbol your broker provides historical market data for. This value should be specified for G1 accounts only and only in case your MT account fails to connect to broker
copyFactoryResourceSlots number Number of CopyFactory 2 resource slots to allocate to account. Allocating extra resource slots results in lower trade copying latency. Please note that allocating extra resource slots is a paid option. Please also note that CopyFactory 2 uses redundant infrastructure so that each CopyFactory resource slot is billed as 2 standard resource slots. You will be billed for CopyFactory 2 resource slots only if you have added your account to CopyFactory 2 by specifying copyFactoryRoles field. Default is 1
manualTrades boolean Flag indicating if trades placed on this account are manual trades. Default is false
slippage number Default trade slippage in points. Should be greater or equal to zero. If not specified, system internal setting will be used which we believe is reasonable for most cases
quoteStreamingIntervalInSeconds number Quote streaming interval in seconds. Set to 0 in order to receive quotes on each tick. Default value is 2.5 seconds. Intervals less than 2.5 seconds are supported only for G2
tags Array User-defined account tags
metadata object Extra information which can be stored together with your account. Total length of this field after serializing it to JSON is limited to 1024 characters
reliability string Used to increase the reliability of the account. Allowed values are regular and high. High is a recommended value for production environment. Default is high
baseCurrency string 3-character ISO currency code of the account base currency. Default value is USD. The setting is to be used for copy trading accounts which use national currencies only, such as some Brazilian brokers. You should not alter this setting unless you understand what you are doing
copyFactoryRoles Array Account roles for CopyFactory2 application. Allowed values are PROVIDER and SUBSCRIBER
resourceSlots number Number of resource slots to allocate to account. Allocating extra resource slots results in better account performance under load which is useful for some applications. E.g. if you have many accounts copying the same strategy via CooyFactory API, then you can increase resourceSlots to get a lower trade copying latency. Please note that allocating extra resource slots is a paid option. Default is 1
riskManagementApiEnabled boolean Flag indicating that risk management API should be enabled on account. Default is false
metastatsApiEnabled boolean Flag indicating that MetaStats API should be enabled on account. Default is false
allocateDedicatedIp string If set, allocates a dedicated IP with specified protocol to connect to the trading account terminal. If an account has replicas deployed in different regions at the same time, a separate IP address will be dedicated for the account in each region. Allowed value is ipv4
keywords Array Keywords to be used for broker server search. We recommend to include exact broker company name in this list
Response
201 - New trading account created successfully. Schema:
Name Type Required Description
id string Yes Trading account id
state string Yes State of the account. Possible values are 'UNDEPLOYED', 'DEPLOYED', 'DRAFT'
202 - Request accepted. Reponse schema: AcceptedError
400 - Validation failed. Response schema: Error
401 - Authorization failed. Response schema: Error
403 - Method or resource access permissions are missing. Response schema: Error
404 - Provisioning profile with specified id not found. Response schema: Error
Examples
Creating an account using automatic broker settings detection
To create an account, supply a request with account data and the platform field indicating the MetaTrader version.

Example request:

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'auth-token: token' --header 'transaction-id: transactionId' -d '{
"login": "123456",
"password": "password",
"name": "testAccount",
"server": "ICMarketsSC-Demo",
"platform": "mt5",
"magic": 123456,
"keywords": ["Raw Trading Ltd"]
}' 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts'
If the account has been created successfully, you will receive a response with account id and state:

{
"id": "1eda642a-a9a3-457c-99af-3bc5e8d5c4c9",
"state": "DEPLOYED"
}
Broker settings detection or connection validation might take some time. If so you will receive response with request processing stage and amount of seconds after which another attempt can be made:

{
"message": "Automatic broker settings detection is in progress, please retry in 60 seconds",
}
Response headers:

{
"Retry-After": "Thu, 04 May 2023 13:42:20 GMT"
}
The retry-after header indicates when it is recommended to repeat the request for its successful completion. If process has been successfully completed, your next request will return the standard response:

{
"id": "1eda642a-a9a3-457c-99af-3bc5e8d5c4c9",
"state": "DEPLOYED"
}
Errors
Several types of errors are possible during the request:

Server file not found
Authentication error
Settings detection error
Resource slots error
Server file not found
This error is returned if the server file for the specified server name has not been found. In case of this error it is recommended to check the server name. If the issue persists, it is recommended to create the account using a provisioning profile. Error also includes existing server names that are similar to provided one.

Example:

{
"id": 3,
"error": "ValidationError",
"message": ".dat file for server ICMarkets-Demo not found, please check the server name or use a provisioning profile instead. Suggested server names:
ICMarketsSC-Demo, ICMarketsSC-MT5.",
"details": {
"code": "E_SRV_NOT_FOUND",
"serversByBrokers": {
"Raw Trading Ltd": [
"ICMarketsSC-Demo",
"ICMarketsSC-MT5"
]
}
}
}
Authentication error
This error is returned if the server has failed to connect to the broker using your credentials. In case of this error it is recommended to check your login and password, and try again.

Example:

{
"id": 3,
"error": "ValidationError",
"message": "We failed to authenticate to your broker using credentials provided. This means that there is an \"Invalid account\" or \"Account disabled\" error on the trading terminal. Please check that your trading account platform version, login, password and server name are correct.",
"details": "E_AUTH"
}
Settings detection error
This error is return if the server has failed to detect the broker settings. In case of this error it is recommended to retry the request later, or create the account using a provisioning profile.

Example:

{
"id": 3,
"error": "ValidationError",
"message": "We were not able to retrieve server settings using credentials provided. Please try again later or configure the provisioning profile manually.",
"details": "E_SERVER_TIMEZONE"
}
Resource slots error
Depending on your broker and trading account some trading accounts might require extra resource slots to be executed successfully in the cloud. If your trading account requires extra resource slots then you will receive a E_RESOURCE_SLOTS error in response. You will then need to re-submit your request with updated resource slots value in order for your trading account to be added to MetaApi cloud.

Example:

{
"id": 3,
"error": "ValidationError",
"message": "Account resource slots should be equal or above estimated",
"details": {
"code": "E_RESOURCE_SLOTS",
"recommendedResourceSlots": 2
}
}
Creating an account using a provisioning profile
If creating the account with automatic broker settings detection has failed, you can create it using a provisioning profile. To create an account using a provisioning profile, create a provisioning profile for the trading server, and then add the provisioningProfileId field to the request:

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'auth-token: token' --header 'transaction-id: transactionId' -d '{
"login": "123456",
"password": "password",
"name": "testAccount",
"server": "ICMarketsSC-Demo",
"provisioningProfileId": "f9ce1f12-e720-4b9a-9477-c2d4cb25f076",
"magic": 123456
}' 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts'
If the account has been created successfully, you will receive a response with account id and state:

{
"id": "1eda642a-a9a3-457c-99af-3bc5e8d5c4c9",
"state": "DEPLOYED"
}
Securely configuring trading account by end user
MetaApi allows you to choose the trading account login and password to be securely configured by your end user. If you want to use this feature, you must create a trading account without login and password in API request to create account. You can later request a link which the end user can use to enter the login and password. After initial account configuration, you can request a link using the same API to allow your end user to change the password. Please note that we will not be able to disclose the account password if your user has configured the account this way.

Example request:

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'auth-token: token' --header 'transaction-id: transactionId' -d '{
"name": "testAccount",
"server": "ICMarketsSC-Demo",
"platform": "mt5",
"magic": 123456
}' 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts'
To request the configuration link, use Create configuration link
