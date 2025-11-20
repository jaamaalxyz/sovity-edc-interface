# Docker Local Testing Guide

## Quick Start

### Automated Full Test (Recommended)

Run the comprehensive test script that builds, runs, and tests the Docker container:

```bash
./docker-test.sh
```

This script will:

1. ✅ Clean up any existing containers
2. ✅ Build the Docker image with Node.js 22
3. ✅ Check image size and details
4. ✅ Start the container
5. ✅ Wait for the application to be ready
6. ✅ Test all endpoints (health, home, assets, policies, contracts)
7. ✅ Show container stats and logs
8. ✅ Provide interactive menu for further actions

### Manual Testing

#### 1. Build the Image

```bash
# Using npm script
npm run docker:build

# Or directly with docker
docker build -t sovity-edc-interface .
```

**Expected output:**

- Multi-stage build completes successfully
- Final image size: ~150-200MB

#### 2. Run the Container

```bash
# Using npm script
npm run docker:run

# Or with custom environment variables
docker run -d \
  -p 3000:3000 \
  --name edc-interface \
  -e NEXT_PUBLIC_USE_MOCK_API=true \
  -e NEXT_PUBLIC_MOCK_ERROR_RATE=0 \
  sovity-edc-interface
```

#### 3. Verify Container is Running

```bash
docker ps
```

You should see `edc-interface` container running.

#### 4. Test the Application

**Health Check:**

```bash
curl http://localhost:3000/api/health
```

**Access in Browser:**

```
http://localhost:3000
```

**Test All Pages:**

```bash
# Home
curl http://localhost:3000/

# Assets
curl http://localhost:3000/assets

# Policies
curl http://localhost:3000/policies

# Contracts
curl http://localhost:3000/contracts
```

#### 5. View Logs

```bash
# Follow logs in real-time
docker logs -f edc-interface

# Last 50 lines
docker logs --tail 50 edc-interface
```

#### 6. Check Container Stats

```bash
docker stats edc-interface
```

**Expected metrics:**

- Memory: ~100-200MB
- CPU: <5% when idle

#### 7. Stop and Clean Up

```bash
# Using npm script
npm run docker:stop

# Or manually
docker stop edc-interface
docker rm edc-interface
```

## Testing with Real EDC Backend

Build with real backend configuration:

```bash
docker build \
  --build-arg NEXT_PUBLIC_USE_MOCK_API=false \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://your-edc-backend:11002 \
  --build-arg NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management \
  --build-arg NEXT_PUBLIC_API_KEY=your-api-key \
  -t sovity-edc-interface:real-backend \
  .
```

Run with real backend:

```bash
docker run -d \
  -p 3000:3000 \
  --name edc-interface \
  -e NEXT_PUBLIC_USE_MOCK_API=false \
  -e NEXT_PUBLIC_API_BASE_URL=http://your-edc-backend:11002 \
  -e NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management \
  -e NEXT_PUBLIC_API_KEY=your-api-key \
  sovity-edc-interface:real-backend
```

## Docker Compose Testing

### Development Mode

```bash
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Check All Services

```bash
# List all services
docker-compose ps

# Check specific service logs
docker-compose logs sovity-edc-interface
```

## Interactive Container Debugging

### Access Container Shell

```bash
docker exec -it edc-interface sh
```

Inside the container, you can:

- Check file structure: `ls -la`
- View environment: `env | grep NEXT_PUBLIC`
- Check processes: `ps aux`
- Test internal network: `wget -O- http://localhost:3000/api/health`

### Inspect Container

```bash
# Full container details
docker inspect edc-interface

# Just the environment variables
docker inspect edc-interface | jq '.[0].Config.Env'

# Network settings
docker inspect edc-interface | jq '.[0].NetworkSettings'
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Install ab (if not already installed)
# macOS: brew install httpd
# Ubuntu: apt-get install apache2-utils

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3000/

# Test health endpoint
ab -n 1000 -c 50 http://localhost:3000/api/health
```

### Memory Profiling

```bash
# Monitor memory usage over time
docker stats edc-interface --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## Common Issues & Solutions

### Issue: Build fails at npm ci

**Solution:**

```bash
# Clear Docker build cache
docker builder prune

# Rebuild without cache
docker build --no-cache -t sovity-edc-interface .
```

### Issue: Container exits immediately

**Solution:**

```bash
# Check logs for errors
docker logs edc-interface

# Check if port 3000 is already in use
lsof -i :3000

# Run on different port
docker run -d -p 3001:3000 --name edc-interface sovity-edc-interface
```

### Issue: Application not accessible

**Solution:**

```bash
# Verify container is running
docker ps

# Check health endpoint
curl http://localhost:3000/api/health

# Check container network
docker port edc-interface
```

### Issue: High memory usage

**Solution:**

```bash
# Set memory limits
docker run -d \
  -p 3000:3000 \
  --name edc-interface \
  --memory="512m" \
  --memory-swap="512m" \
  sovity-edc-interface
```

## CI/CD Simulation

Simulate GitHub Actions workflow locally:

```bash
# Run all checks like CI does
echo "Running linter..."
npm run lint

echo "Running tests..."
npm test -- --coverage

echo "Building application..."
npm run build

echo "Building Docker image..."
docker build -t sovity-edc-interface .

echo "Starting container..."
docker run -d -p 3000:3000 --name edc-interface sovity-edc-interface

echo "Waiting for health check..."
sleep 5

echo "Testing health endpoint..."
curl -f http://localhost:3000/api/health

echo "Cleaning up..."
docker stop edc-interface
docker rm edc-interface

echo "✅ CI/CD simulation complete!"
```

## NPM Scripts Reference

```bash
npm run docker:build    # Build Docker image
npm run docker:run      # Run container
npm run docker:stop     # Stop and remove container
npm run docker:test     # Run full automated test
npm run docker:clean    # Clean up containers
```

## Best Practices

1. **Always test locally** before pushing to CI/CD
2. **Check image size** - should be ~150-200MB
3. **Verify health endpoint** responds within 5 seconds
4. **Test all pages** load correctly
5. **Monitor resource usage** - memory should stay under 300MB
6. **Review logs** for any errors or warnings

## Next Steps

After successful local testing:

1. Commit your changes
2. Push to GitHub
3. GitHub Actions will automatically build and deploy
4. Monitor the workflow in Actions tab

---

**Quick Test Checklist:**

- [ ] Docker build succeeds
- [ ] Container starts without errors
- [ ] Health check responds with 200
- [ ] All pages load (/, /assets, /policies, /contracts)
- [ ] Memory usage < 300MB
- [ ] No errors in logs
- [ ] Application accessible at http://localhost:3000
