# Multi-Cloud Deployment Configurations

## Deployment Philosophy

### Infrastructure as Code (IaC) First
- All deployments use declarative configuration
- Version-controlled infrastructure definitions
- Automated rollback capabilities
- Environment parity enforcement

### Multi-Cloud Support Matrix
| Service | AWS | GCP | Azure |
|---------|-----|-----|-------|
| Compute | ECS/Fargate | Cloud Run | Container Apps |
| Database | RDS | Cloud SQL | Azure Database |
| Cache | ElastiCache | Memorystore | Redis Cache |
| Storage | S3 | Cloud Storage | Blob Storage |
| Monitoring | CloudWatch | Stackdriver | Monitor |
| CDN | CloudFront | Cloud CDN | Front Door |

---

## AWS Deployment Configuration

### ECS with Fargate
```yaml
# docker-compose.aws.yml
version: '3.8'
services:
  app:
    image: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${APP_NAME}:${VERSION}
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DB_HOST=${RDS_ENDPOINT}
      - REDIS_URL=${ELASTICACHE_ENDPOINT}
      - AWS_REGION=${AWS_REGION}
    deploy:
      replicas: ${REPLICA_COUNT:-3}
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

### Terraform AWS Infrastructure
```hcl
# infrastructure/aws/main.tf
provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "${var.app_name}-vpc"
    Environment = var.environment
  }
}

# Subnets
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "${var.app_name}-private-${count.index + 1}"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 10}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "${var.app_name}-public-${count.index + 1}"
  }
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier     = "${var.app_name}-${var.environment}"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class
  
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_window      = "03:00-04:00"
  maintenance_window = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = var.environment == "dev"
  deletion_protection = var.environment == "production"
  
  performance_insights_enabled = true
  monitoring_interval         = 60
  monitoring_role_arn        = aws_iam_role.rds_monitoring.arn
  
  tags = {
    Name        = "${var.app_name}-database"
    Environment = var.environment
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.app_name}-cache-subnet"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_replication_group" "main" {
  replication_group_id         = "${var.app_name}-${var.environment}"
  description                  = "Redis cluster for ${var.app_name}"
  
  num_cache_clusters         = 3
  node_type                  = var.redis_node_type
  port                       = 6379
  parameter_group_name       = "default.redis7"
  
  subnet_group_name = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  automatic_failover_enabled = true
  multi_az_enabled          = true
  
  tags = {
    Name        = "${var.app_name}-redis"
    Environment = var.environment
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-${var.environment}"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = {
    Name        = "${var.app_name}-cluster"
    Environment = var.environment
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.app_name}-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = aws_subnet.public[*].id
  
  enable_deletion_protection = var.environment == "production"
  
  tags = {
    Name        = "${var.app_name}-alb"
    Environment = var.environment
  }
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = var.app_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = var.service_desired_count
  launch_type     = "FARGATE"
  
  network_configuration {
    security_groups  = [aws_security_group.app.id]
    subnets         = aws_subnet.private[*].id
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = var.app_name
    container_port   = 8000
  }
  
  depends_on = [aws_lb_listener.main]
  
  tags = {
    Name        = "${var.app_name}-service"
    Environment = var.environment
  }
}

# Auto Scaling
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = var.max_capacity
  min_capacity       = var.min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.main.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "scale_up" {
  name               = "${var.app_name}-scale-up"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
```

### AWS Deployment Script
```bash
#!/bin/bash
# deploy-aws.sh

set -e

APP_NAME=${1:-"production-app"}
ENVIRONMENT=${2:-"production"}
VERSION=${3:-"latest"}
AWS_REGION=${4:-"us-west-2"}

echo "🚀 Deploying $APP_NAME to AWS ($ENVIRONMENT)"

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t $APP_NAME:$VERSION .

# Tag for ECR
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Create ECR repository if it doesn't exist
aws ecr describe-repositories --repository-names $APP_NAME --region $AWS_REGION || \
  aws ecr create-repository --repository-name $APP_NAME --region $AWS_REGION

# Get ECR login token
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Tag and push image
docker tag $APP_NAME:$VERSION $ECR_REGISTRY/$APP_NAME:$VERSION
docker push $ECR_REGISTRY/$APP_NAME:$VERSION

# Deploy infrastructure
echo "🏗️  Deploying infrastructure..."
cd infrastructure/aws
terraform init
terraform plan -var="app_name=$APP_NAME" -var="environment=$ENVIRONMENT" -var="image_tag=$VERSION"
terraform apply -auto-approve -var="app_name=$APP_NAME" -var="environment=$ENVIRONMENT" -var="image_tag=$VERSION"

# Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service \
  --cluster "$APP_NAME-$ENVIRONMENT" \
  --service "$APP_NAME" \
  --force-new-deployment \
  --region $AWS_REGION

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
aws ecs wait services-stable \
  --cluster "$APP_NAME-$ENVIRONMENT" \
  --services "$APP_NAME" \
  --region $AWS_REGION

echo "✅ Deployment complete!"

# Get load balancer URL
ALB_DNS=$(terraform output -raw load_balancer_dns)
echo "🌐 Application URL: https://$ALB_DNS"
```

---

## Google Cloud Platform (GCP) Configuration

### Cloud Run Deployment
```yaml
# cloudbuild.yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/${_SERVICE_NAME}:${_VERSION}', '.']
  
  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/${_SERVICE_NAME}:${_VERSION}']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - '${_SERVICE_NAME}'
      - '--image'
      - 'gcr.io/$PROJECT_ID/${_SERVICE_NAME}:${_VERSION}'
      - '--region'
      - '${_REGION}'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'NODE_ENV=production,DB_HOST=${_DB_HOST},REDIS_HOST=${_REDIS_HOST}'
      - '--memory'
      - '4Gi'
      - '--cpu'
      - '2'
      - '--max-instances'
      - '100'
      - '--concurrency'
      - '80'

substitutions:
  _SERVICE_NAME: 'production-app'
  _VERSION: '${BUILD_ID}'
  _REGION: 'us-central1'
  _DB_HOST: '${_DB_CONNECTION_NAME}'
  _REDIS_HOST: '${_REDIS_IP}'

options:
  logging: CLOUD_LOGGING_ONLY
```

### Terraform GCP Infrastructure
```hcl
# infrastructure/gcp/main.tf
provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud SQL PostgreSQL
resource "google_sql_database_instance" "main" {
  name             = "${var.app_name}-${var.environment}"
  database_version = "POSTGRES_15"
  region          = var.region
  
  settings {
    tier              = var.db_tier
    availability_type = var.environment == "production" ? "REGIONAL" : "ZONAL"
    disk_type         = "PD_SSD"
    disk_size         = var.db_disk_size
    disk_autoresize   = true
    
    backup_configuration {
      enabled    = true
      start_time = "03:00"
      location   = var.region
      backup_retention_settings {
        retained_backups = 30
      }
    }
    
    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.main.id
      require_ssl     = true
    }
    
    maintenance_window {
      day          = 7
      hour         = 4
      update_track = "stable"
    }
  }
  
  deletion_protection = var.environment == "production"
}

resource "google_sql_database" "main" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "main" {
  name     = var.db_username
  instance = google_sql_database_instance.main.name
  password = var.db_password
}

# Memorystore Redis
resource "google_redis_instance" "main" {
  name           = "${var.app_name}-${var.environment}"
  memory_size_gb = var.redis_memory_size_gb
  region         = var.region
  
  authorized_network = google_compute_network.main.id
  connect_mode       = "PRIVATE_SERVICE_ACCESS"
  
  redis_version     = "REDIS_7_0"
  display_name      = "${var.app_name} Redis Cache"
  
  auth_enabled      = true
  transit_encryption_mode = "SERVER_AUTHENTICATION"
  
  labels = {
    environment = var.environment
    app         = var.app_name
  }
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "${var.app_name}-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "main" {
  name          = "${var.app_name}-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.main.id
  
  private_ip_google_access = true
}

# Cloud Run Service
resource "google_cloud_run_service" "main" {
  name     = var.app_name
  location = var.region
  
  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/${var.app_name}:${var.image_tag}"
        
        ports {
          container_port = 8000
        }
        
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        
        env {
          name  = "DB_HOST"
          value = google_sql_database_instance.main.private_ip_address
        }
        
        env {
          name  = "REDIS_HOST"
          value = google_redis_instance.main.host
        }
        
        resources {
          limits = {
            cpu    = "2000m"
            memory = "4Gi"
          }
          requests = {
            cpu    = "1000m"
            memory = "2Gi"
          }
        }
      }
      
      container_concurrency = 80
      timeout_seconds      = 300
    }
    
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "100"
        "autoscaling.knative.dev/minScale" = var.environment == "production" ? "3" : "0"
      }
    }
  }
  
  traffic {
    percent         = 100
    latest_revision = true
  }
}

# IAM Policy
resource "google_cloud_run_service_iam_member" "public" {
  location = google_cloud_run_service.main.location
  project  = google_cloud_run_service.main.project
  service  = google_cloud_run_service.main.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
```

### GCP Deployment Script
```bash
#!/bin/bash
# deploy-gcp.sh

set -e

PROJECT_ID=${1:-"your-project-id"}
SERVICE_NAME=${2:-"production-app"}
REGION=${3:-"us-central1"}
VERSION=${4:-$(date +%Y%m%d-%H%M%S)}

echo "🚀 Deploying $SERVICE_NAME to GCP ($PROJECT_ID)"

# Set project
gcloud config set project $PROJECT_ID

# Build and submit to Cloud Build
echo "📦 Building with Cloud Build..."
gcloud builds submit \
  --substitutions=_SERVICE_NAME=$SERVICE_NAME,_VERSION=$VERSION,_REGION=$REGION \
  --config cloudbuild.yaml

# Deploy infrastructure
echo "🏗️  Deploying infrastructure..."
cd infrastructure/gcp
terraform init
terraform plan \
  -var="project_id=$PROJECT_ID" \
  -var="app_name=$SERVICE_NAME" \
  -var="image_tag=$VERSION" \
  -var="region=$REGION"
terraform apply -auto-approve \
  -var="project_id=$PROJECT_ID" \
  -var="app_name=$SERVICE_NAME" \
  -var="image_tag=$VERSION" \
  -var="region=$REGION"

echo "✅ Deployment complete!"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')
echo "🌐 Application URL: $SERVICE_URL"
```

---

## Microsoft Azure Configuration

### Container Apps Deployment
```yaml
# azure-pipelines.yml
trigger:
- main

variables:
  containerRegistry: 'yourregistry.azurecr.io'
  imageRepository: 'production-app'
  dockerfilePath: '$(Build.SourcesDirectory)/Dockerfile'
  tag: '$(Build.BuildId)'
  azureSubscription: 'Your-Subscription'
  resourceGroup: 'production-rg'
  location: 'East US 2'

stages:
- stage: Build
  jobs:
  - job: Build
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: Docker@2
      displayName: Build and push image
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(containerRegistry)
        tags: |
          $(tag)
          latest

- stage: Deploy
  jobs:
  - job: Deploy
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: AzureResourceManagerTemplateDeployment@3
      inputs:
        deploymentScope: 'Resource Group'
        azureResourceManagerConnection: $(azureSubscription)
        subscriptionId: '$(subscriptionId)'
        action: 'Create Or Update Resource Group'
        resourceGroupName: $(resourceGroup)
        location: $(location)
        templateLocation: 'Linked artifact'
        csmFile: 'infrastructure/azure/main.bicep'
        csmParametersFile: 'infrastructure/azure/parameters.json'
        overrideParameters: |
          -containerImage $(containerRegistry)/$(imageRepository):$(tag)
          -environment production
```

### Bicep Azure Infrastructure
```bicep
// infrastructure/azure/main.bicep
@description('The name of the application')
param appName string

@description('The environment (dev, staging, production)')
param environment string = 'production'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The container image to deploy')
param containerImage string

@description('The minimum number of replicas')
param minReplicas int = 3

@description('The maximum number of replicas')
param maxReplicas int = 100

// Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2021-12-01-preview' = {
  name: '${appName}${environment}acr'
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    adminUserEnabled: true
  }
}

// PostgreSQL Flexible Server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: '${appName}-${environment}-postgres'
  location: location
  sku: {
    name: 'Standard_D2s_v3'
    tier: 'GeneralPurpose'
  }
  properties: {
    version: '15'
    administratorLogin: 'dbadmin'
    administratorLoginPassword: 'YourSecurePassword123!'
    storage: {
      storageSizeGB: 128
    }
    backup: {
      backupRetentionDays: 30
      geoRedundantBackup: 'Enabled'
    }
    highAvailability: {
      mode: environment == 'production' ? 'ZoneRedundant' : 'Disabled'
    }
  }
}

resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2022-12-01' = {
  parent: postgresServer
  name: '${appName}_db'
  properties: {
    charset: 'utf8'
    collation: 'en_US.utf8'
  }
}

// Redis Cache
resource redisCache 'Microsoft.Cache/redis@2022-06-01' = {
  name: '${appName}-${environment}-redis'
  location: location
  properties: {
    sku: {
      name: 'Standard'
      family: 'C'
      capacity: 1
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    redisConfiguration: {
      'maxmemory-policy': 'allkeys-lru'
    }
  }
}

// Container Apps Environment
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2022-10-01' = {
  name: '${appName}-${environment}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${appName}-${environment}-logs'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 90
  }
}

// Application Insights
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${appName}-${environment}-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

// Container App
resource containerApp 'Microsoft.App/containerApps@2022-10-01' = {
  name: '${appName}-${environment}'
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      secrets: [
        {
          name: 'db-password'
          value: 'YourSecurePassword123!'
        }
        {
          name: 'redis-connection'
          value: redisCache.listKeys().primaryKey
        }
      ]
      ingress: {
        external: true
        targetPort: 8000
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          username: containerRegistry.properties.adminUserEnabled ? containerRegistry.name : null
          passwordSecretRef: 'registry-password'
        }
      ]
    }
    template: {
      containers: [
        {
          name: appName
          image: containerImage
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PORT'
              value: '8000'
            }
            {
              name: 'DB_HOST'
              value: postgresServer.properties.fullyQualifiedDomainName
            }
            {
              name: 'DB_PASSWORD'
              secretRef: 'db-password'
            }
            {
              name: 'REDIS_HOST'
              value: redisCache.properties.hostName
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: applicationInsights.properties.ConnectionString
            }
          ]
          resources: {
            cpu: json('2.0')
            memory: '4Gi'
          }
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '80'
              }
            }
          }
        ]
      }
    }
  }
}

output containerAppUrl string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
output postgresHost string = postgresServer.properties.fullyQualifiedDomainName
output redisHost string = redisCache.properties.hostName
```

### Azure Deployment Script
```bash
#!/bin/bash
# deploy-azure.sh

set -e

SUBSCRIPTION_ID=${1:-"your-subscription-id"}
RESOURCE_GROUP=${2:-"production-rg"}
APP_NAME=${3:-"production-app"}
LOCATION=${4:-"eastus2"}
VERSION=${5:-$(date +%Y%m%d-%H%M%S)}

echo "🚀 Deploying $APP_NAME to Azure"

# Login and set subscription
az login
az account set --subscription $SUBSCRIPTION_ID

# Create resource group if it doesn't exist
az group create --name $RESOURCE_GROUP --location $LOCATION

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t $APP_NAME:$VERSION .

# Create Azure Container Registry
ACR_NAME="${APP_NAME}${RANDOM}acr"
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Standard --admin-enabled true

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)

# Login to ACR
az acr login --name $ACR_NAME

# Tag and push image
docker tag $APP_NAME:$VERSION $ACR_LOGIN_SERVER/$APP_NAME:$VERSION
docker push $ACR_LOGIN_SERVER/$APP_NAME:$VERSION

# Deploy infrastructure
echo "🏗️  Deploying infrastructure..."
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file infrastructure/azure/main.bicep \
  --parameters appName=$APP_NAME \
  --parameters containerImage=$ACR_LOGIN_SERVER/$APP_NAME:$VERSION \
  --parameters environment=production

echo "✅ Deployment complete!"

# Get application URL
APP_URL=$(az deployment group show \
  --resource-group $RESOURCE_GROUP \
  --name main \
  --query properties.outputs.containerAppUrl.value \
  --output tsv)
echo "🌐 Application URL: $APP_URL"
```

---

## Kubernetes (Multi-Cloud)

### Helm Chart Configuration
```yaml
# helm/values.yaml
replicaCount: 3

image:
  repository: yourapp
  pullPolicy: IfNotPresent
  tag: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
  hosts:
    - host: your-app.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: app-tls
      hosts:
        - your-app.com

resources:
  limits:
    cpu: 2000m
    memory: 4Gi
  requests:
    cpu: 1000m
    memory: 2Gi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 100
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

postgresql:
  enabled: true
  auth:
    postgresPassword: "your-secure-password"
    database: "yourapp"
  primary:
    persistence:
      enabled: true
      size: 100Gi

redis:
  enabled: true
  auth:
    enabled: true
    password: "your-redis-password"
  master:
    persistence:
      enabled: true
      size: 10Gi
```

### Kubernetes Deployment Script
```bash
#!/bin/bash
# deploy-k8s.sh

set -e

NAMESPACE=${1:-"production"}
RELEASE_NAME=${2:-"production-app"}
VERSION=${3:-"latest"}

echo "🚀 Deploying to Kubernetes cluster"

# Create namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Add Helm repositories
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Deploy with Helm
helm upgrade --install $RELEASE_NAME ./helm \
  --namespace $NAMESPACE \
  --set image.tag=$VERSION \
  --set environment=production \
  --wait --timeout=10m

echo "✅ Deployment complete!"

# Get service URL
kubectl get ingress -n $NAMESPACE
```

This comprehensive deployment configuration supports all three major cloud providers with infrastructure-as-code, automated scaling, monitoring, and production-ready security configurations.