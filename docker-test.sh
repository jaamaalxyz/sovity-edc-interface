#!/bin/bash

# Docker Local Test Script
# Tests the complete Docker build and deployment flow

set -e  # Exit on error

echo "🐳 Docker Local Test & Build Flow"
echo "================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

IMAGE_NAME="sovity-edc-interface"
CONTAINER_NAME="edc-interface-test"
PORT="3000"

# Function to print colored output
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Cleanup function
cleanup() {
    print_step "Cleaning up existing containers and images..."
    docker rm -f $CONTAINER_NAME 2>/dev/null || true
    print_success "Cleanup complete"
}

# Build the Docker image
build_image() {
    print_step "Building Docker image with Node.js 22..."
    echo ""

    docker build \
        --build-arg NEXT_PUBLIC_USE_MOCK_API=true \
        --build-arg NEXT_PUBLIC_MOCK_ERROR_RATE=0 \
        -t $IMAGE_NAME \
        . || {
            print_error "Docker build failed!"
            exit 1
        }

    echo ""
    print_success "Docker image built successfully"
}

# Check image size
check_image() {
    print_step "Checking image details..."
    echo ""

    docker images $IMAGE_NAME

    echo ""
    IMAGE_SIZE=$(docker images $IMAGE_NAME --format "{{.Size}}")
    print_success "Image size: $IMAGE_SIZE"
}

# Run the container
run_container() {
    print_step "Starting container on port $PORT..."

    docker run -d \
        --name $CONTAINER_NAME \
        -p $PORT:3000 \
        -e NEXT_PUBLIC_USE_MOCK_API=true \
        -e NEXT_PUBLIC_MOCK_ERROR_RATE=0 \
        $IMAGE_NAME || {
            print_error "Failed to start container!"
            exit 1
        }

    print_success "Container started: $CONTAINER_NAME"
}

# Wait for application to be ready
wait_for_app() {
    print_step "Waiting for application to start..."

    MAX_ATTEMPTS=30
    ATTEMPT=0

    while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
        if curl -f http://localhost:$PORT/api/health >/dev/null 2>&1; then
            print_success "Application is ready!"
            return 0
        fi

        ATTEMPT=$((ATTEMPT + 1))
        echo -n "."
        sleep 1
    done

    echo ""
    print_error "Application failed to start within 30 seconds"
    print_step "Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
}

# Test the application
test_app() {
    print_step "Testing application endpoints..."
    echo ""

    # Test health check
    print_step "Testing health check endpoint..."
    HEALTH_RESPONSE=$(curl -s http://localhost:$PORT/api/health)
    if [ $? -eq 0 ]; then
        print_success "Health check: OK"
        echo "  Response: $HEALTH_RESPONSE"
    else
        print_error "Health check failed"
    fi

    echo ""

    # Test home page
    print_step "Testing home page..."
    HOME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/)
    if [ "$HOME_STATUS" = "200" ]; then
        print_success "Home page: OK (Status: $HOME_STATUS)"
    else
        print_warning "Home page returned status: $HOME_STATUS"
    fi

    echo ""

    # Test assets page
    print_step "Testing assets page..."
    ASSETS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/assets)
    if [ "$ASSETS_STATUS" = "200" ]; then
        print_success "Assets page: OK (Status: $ASSETS_STATUS)"
    else
        print_warning "Assets page returned status: $ASSETS_STATUS"
    fi

    echo ""

    # Test policies page
    print_step "Testing policies page..."
    POLICIES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/policies)
    if [ "$POLICIES_STATUS" = "200" ]; then
        print_success "Policies page: OK (Status: $POLICIES_STATUS)"
    else
        print_warning "Policies page returned status: $POLICIES_STATUS"
    fi

    echo ""

    # Test contracts page
    print_step "Testing contracts page..."
    CONTRACTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/contracts)
    if [ "$CONTRACTS_STATUS" = "200" ]; then
        print_success "Contracts page: OK (Status: $CONTRACTS_STATUS)"
    else
        print_warning "Contracts page returned status: $CONTRACTS_STATUS"
    fi
}

# Show container stats
show_stats() {
    echo ""
    print_step "Container statistics..."
    docker stats --no-stream $CONTAINER_NAME
}

# Show logs
show_logs() {
    echo ""
    print_step "Container logs (last 20 lines)..."
    echo ""
    docker logs --tail 20 $CONTAINER_NAME
}

# Interactive menu
interactive_menu() {
    echo ""
    echo "================================="
    print_success "Container is running at http://localhost:$PORT"
    echo "================================="
    echo ""
    echo "What would you like to do?"
    echo "1) View logs"
    echo "2) View container stats"
    echo "3) Open shell in container"
    echo "4) Stop and remove container"
    echo "5) Keep running and exit script"
    echo ""
    read -p "Enter choice [1-5]: " choice

    case $choice in
        1)
            docker logs -f $CONTAINER_NAME
            ;;
        2)
            docker stats $CONTAINER_NAME
            ;;
        3)
            print_step "Opening shell in container (type 'exit' to leave)..."
            docker exec -it $CONTAINER_NAME sh
            interactive_menu
            ;;
        4)
            cleanup
            print_success "Container stopped and removed"
            ;;
        5)
            print_success "Container is still running. Use 'docker stop $CONTAINER_NAME' to stop it."
            ;;
        *)
            print_error "Invalid choice"
            interactive_menu
            ;;
    esac
}

# Main execution
main() {
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi

    cleanup
    echo ""

    build_image
    echo ""

    check_image
    echo ""

    run_container
    echo ""

    wait_for_app
    echo ""

    test_app
    echo ""

    show_stats
    echo ""

    show_logs

    interactive_menu
}

# Run main function
main
