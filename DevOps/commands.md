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

# set env variables
azaz webapp config appsettings set \
  --name entretien-ai-docker \
  --resource-group entretien-ai-rg \
  --settings \
    NEXT_PUBLIC_APP_URL="https://www.entretien-ai.com" \
    AUTH_SECRET="" \
    GOOGLE_CLIENT_ID="" \
    GOOGLE_CLIENT_SECRET="" \
    AUTH_GITHUB_ID="" \
    AUTH_GITHUB_SECRET="" \
    AI_API_KEY="" \
    GROQ_API_KEY="" \
    GROK_API_KEY="" \
    GROQ_MODEL="" \
    GROK_MODEL="grok-beta" \
    TOGETHER_MODEL="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" \
    DATABASE_URL="" \
    RESEND_API_KEY="" \
    EMAIL_FROM="Entretien AI <noreply@entretien-ai.com>" \
    STRIPE_API_KEY="" \
    STRIPE_WEBHOOK_SECRET="" \
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID="" \
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID="" \
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID="" \
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID=""


# Make sure to add the needed env variables in the App Service so it can pull the docker image
 az webapp config appsettings set \
     --name entretien-ai-docker \
     --resource-group entretien-ai-rg \
     --settings DOCKER_REGISTRY_SERVER_URL=https://ghcr.io \
     DOCKER_REGISTRY_SERVER_USERNAME=yourgithubusername \
     DOCKER_REGISTRY_SERVER_PASSWORD=yourgithubpat