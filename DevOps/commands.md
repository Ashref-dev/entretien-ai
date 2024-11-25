# Create a resource group in the West Europe region
az group create \
  --name entretien-ai-rg \
  --location westeurope


# Create a Linux-based service plan in the same resource group (F1 is free tier)
az appservice plan create \
  --resource-group entretien-ai-rg \
  --location westeurope \
  --name entretien-ai-sp \
  --is-linux \
  --sku F1

# Create an App Service with an nginx image as a placeholder
az webapp create \
  --resource-group entretien-ai-rg \
  --plan entretien-ai-sp \
  --name entretien-ai-docker \
  --deployment-container-image-name nginx

# Retrieve and save the publish profile for the new App Service
az webapp deployment list-publishing-profiles \
  --resource-group entretien-ai-rg \
  --name entretien-ai-docker \
  --xml > publishProfileDocker.xml