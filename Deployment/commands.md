# Azure Deployment Guide for Entretien AI

## Prerequisites

- Azure CLI installed and configured
- Active Azure subscription (available free through Github Student Pack)
- Docker registry access (GitHub Container Registry in this case)

## Resource Creation

### 1. Create Resource Group

Create a resource group in the West Europe region:

```bash
az group create \
  --name entretien-ai-rg \
  --location westeurope
```

### 2. Create App Service Plan

Create a Linux-based service plan (F1 is free tier):

```bash
az appservice plan create \
  --resource-group entretien-ai-rg \
  --location westeurope \
  --name entretien-ai-sp \
  --is-linux \
  --sku F1
```

### 3. Create Web App

Create an App Service with nginx as placeholder:

```bash
az webapp create \
  --resource-group entretien-ai-rg \
  --plan entretien-ai-sp \
  --name entretien-ai-docker \
  --deployment-container-image-name nginx
```

### 4. Get Publishing Profile

Save the deployment credentials:

```bash
az webapp deployment list-publishing-profiles \
  --resource-group entretien-ai-rg \
  --name entretien-ai-docker \
  --xml > publishProfileDocker.xml
```

## Environment Configuration

### 1. Application Settings

Configure the application environment variables:

```bash
az webapp config appsettings set \
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
```

### 2. Docker Registry Configuration

Configure the GitHub Container Registry credentials:

```bash
az webapp config appsettings set \
  --name entretien-ai-docker \
  --resource-group entretien-ai-rg \
  --settings \
    DOCKER_REGISTRY_SERVER_URL=https://ghcr.io \
    DOCKER_REGISTRY_SERVER_USERNAME=yourgithubusername \
    DOCKER_REGISTRY_SERVER_PASSWORD=yourgithubpat
```

## Notes

- Replace empty values (`""`) with your actual configuration values
- Replace `yourgithubusername` with your GitHub username
- Replace `yourgithubpat` with your GitHub Personal Access Token
- Make sure your PAT has the necessary permissions for container registry access