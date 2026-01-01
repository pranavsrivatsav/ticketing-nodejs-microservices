#!/bin/bash

# Unified script to build and push Docker images for all services
# Services: auth, client, expiration, orders, payments, tickets

set -e  # Exit on any error

# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Define services and their corresponding Docker image names
declare -A SERVICES=(
  ["auth"]="pranavsrivatsav/ticketing-auth"
  ["client"]="pranavsrivatsav/ticketing-client"
  ["expiration"]="pranavsrivatsav/ticketing-expiration"
  ["orders"]="pranavsrivatsav/ticketing-orders"
  ["payments"]="pranavsrivatsav/ticketing-payments"
  ["tickets"]="pranavsrivatsav/ticketing-tickets"
)

echo "=========================================="
echo "Building and pushing Docker images"
echo "=========================================="
echo ""

# Process each service
for service in "${!SERVICES[@]}"; do
  image_name="${SERVICES[$service]}"
  
  echo "----------------------------------------"
  echo "Processing service: $service"
  echo "Image name: $image_name"
  echo "----------------------------------------"
  
  # Check if service directory exists
  service_dir="$PROJECT_ROOT/$service"
  if [ ! -d "$service_dir" ]; then
    echo "ERROR: Service directory '$service_dir' does not exist. Skipping..."
    echo ""
    continue
  fi
  
  # Check if Dockerfile exists
  if [ ! -f "$service_dir/Dockerfile" ]; then
    echo "ERROR: Dockerfile not found in '$service_dir'. Skipping..."
    echo ""
    continue
  fi
  
  # Navigate to service directory
  cd "$service_dir"
  
  echo "Building Docker image: $image_name"
  docker build -t "$image_name" .
  
  if [ $? -eq 0 ]; then
    echo "Build successful for $service"
    echo "Pushing Docker image: $image_name"
    docker push "$image_name"
    
    if [ $? -eq 0 ]; then
      echo "✓ Successfully built and pushed $image_name"
    else
      echo "✗ Failed to push $image_name"
      exit 1
    fi
  else
    echo "✗ Failed to build $image_name"
    exit 1
  fi
  
  # Return to project root
  cd "$PROJECT_ROOT"
  
  echo ""
done

echo "=========================================="
echo "All services processed successfully!"
echo "=========================================="

