targetScope = 'resourceGroup'

@description('Prefix used to create globally unique resource names.')
param namePrefix string
param location string = resourceGroup().location
@secure()
param sqlAdministratorLoginPassword string
param appServicePlanSku string = 'P1v3'
@description('Fully qualified API container image, for example contoso.azurecr.io/digitech-api:1.0.0.')
param apiContainerImage string
@description('Fully qualified web container image, for example contoso.azurecr.io/digitech-web:1.0.0.')
param webContainerImage string

var normalizedPrefix = toLower(replace(namePrefix, '-', ''))
var storageName = take('${normalizedPrefix}${uniqueString(resourceGroup().id)}', 24)
var keyVaultName = take('${normalizedPrefix}-kv-${uniqueString(resourceGroup().id)}', 24)
var sqlServerName = take('${normalizedPrefix}-sql-${uniqueString(resourceGroup().id)}', 63)
var redisName = take('${normalizedPrefix}-redis-${uniqueString(resourceGroup().id)}', 63)
var appInsightsName = '${namePrefix}-appi'
var planName = '${namePrefix}-plan'
var apiAppName = '${namePrefix}-api-${uniqueString(resourceGroup().id)}'
var webAppName = '${namePrefix}-web-${uniqueString(resourceGroup().id)}'
var frontDoorName = '${namePrefix}-afd'

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${namePrefix}-logs'
  location: location
  properties: { sku: { name: 'PerGB2018' }, retentionInDays: 30 }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: { Application_Type: 'web', WorkspaceResourceId: logAnalytics.id }
}

resource storage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageName
  location: location
  sku: { name: 'Standard_RAGRS' }
  kind: 'StorageV2'
  properties: { minimumTlsVersion: 'TLS1_2', allowBlobPublicAccess: false, supportsHttpsTrafficOnly: true }
}

resource uploadsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: storage
  name: 'default/uploads'
  properties: { publicAccess: 'None' }
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: { tenantId: tenant().tenantId, sku: { family: 'A', name: 'standard' }, enableRbacAuthorization: true, enablePurgeProtection: true, enableSoftDelete: true }
}

resource sqlServer 'Microsoft.Sql/servers@2023-08-01-preview' = {
  name: sqlServerName
  location: location
  properties: { administratorLogin: 'digitechadmin', administratorLoginPassword: sqlAdministratorLoginPassword, publicNetworkAccess: 'Disabled', minimalTlsVersion: '1.2' }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-08-01-preview' = {
  parent: sqlServer
  name: 'DIGITECH'
  location: location
  sku: { name: 'GP_S_Gen5_1', tier: 'GeneralPurpose' }
  properties: { zoneRedundant: false }
}

resource redis 'Microsoft.Cache/redis@2023-08-01' = {
  name: redisName
  location: location
  properties: { sku: { name: 'Standard', family: 'C', capacity: 1 }, minimumTlsVersion: '1.2', enableNonSslPort: false }
}

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  sku: { name: appServicePlanSku, tier: 'PremiumV3' }
  properties: { reserved: true }
}

resource apiApp 'Microsoft.Web/sites@2023-12-01' = {
  name: apiAppName
  location: location
  kind: 'app,linux,container'
  identity: { type: 'SystemAssigned' }
  properties: { serverFarmId: plan.id, httpsOnly: true, siteConfig: { linuxFxVersion: 'DOCKER|${apiContainerImage}', alwaysOn: true, appSettings: [ { name: 'ASPNETCORE_ENVIRONMENT', value: 'Production' }, { name: 'KeyVault__Uri', value: keyVault.properties.vaultUri }, { name: 'ApplicationInsights__ConnectionString', value: appInsights.properties.ConnectionString }, { name: 'Storage__Provider', value: 'AzureBlob' }, { name: 'Storage__AzureBlob__ServiceUri', value: storage.properties.primaryEndpoints.blob }, { name: 'Redis__ConnectionString', value: '${redis.name}.redis.cache.windows.net:6380,ssl=True,abortConnect=False' } ] } }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: webAppName
  location: location
  kind: 'app,linux,container'
  identity: { type: 'SystemAssigned' }
  properties: { serverFarmId: plan.id, httpsOnly: true, siteConfig: { linuxFxVersion: 'DOCKER|${webContainerImage}', alwaysOn: true } }
}

resource frontDoorProfile 'Microsoft.Cdn/profiles@2023-05-01' = {
  name: frontDoorName
  location: 'global'
  sku: { name: 'Standard_AzureFrontDoor' }
}

resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2023-05-01' = {
  parent: frontDoorProfile
  name: '${namePrefix}-endpoint'
  location: 'global'
  properties: { enabledState: 'Enabled' }
}

output apiAppName string = apiApp.name
output webAppName string = webApp.name
output keyVaultUri string = keyVault.properties.vaultUri
output storageServiceUri string = storage.properties.primaryEndpoints.blob
output applicationInsightsConnectionString string = appInsights.properties.ConnectionString
