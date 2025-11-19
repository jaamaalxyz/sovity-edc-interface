# Docker Deployment Guide

This guide covers deploying the Sovity EDC Interface application using Docker.

## Overview

The application is containerized using Docker with the following features:

- **Multi-stage build** for optimized image size (~150MB)
- **Alpine Linux** base image (lightweight)
- **Non-root user** for security
- **Health checks** for monitoring

## Quick Start

### Using Docker Compose (Recommended)

```bash
# 1. Copy environment file
cp .env.docker.example .env.docker

# 2. Edit .env.docker with your configuration
nano .env.docker

# 3. Start the application
docker-compose up -d

# 4. Check logs
docker-compose logs -f sovity-edc-interface

# 5. Access the application
open http://localhost:3000
```

### Using Docker CLI

```bash
# Build the image
docker build -t sovity-edc-interface \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:11002 \
  --build-arg NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management \
  --build-arg NEXT_PUBLIC_API_KEY=your-api-key \
  .

# Run the container
docker run -d \
  -p 3000:3000 \
  --name sovity-edc-interface \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:11002 \
  -e NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management \
  -e NEXT_PUBLIC_API_KEY=your-api-key \
  sovity-edc-interface
```

## Configuration

### Environment Variables

| Variable                          | Description            | Default                  | Required |
| --------------------------------- | ---------------------- | ------------------------ | -------- |
| `NEXT_PUBLIC_API_BASE_URL`        | EDC connector base URL | `http://localhost:11002` | Yes      |
| `NEXT_PUBLIC_MANAGEMENT_API_PATH` | Management API path    | `/api/management`        | Yes      |
| `NEXT_PUBLIC_API_KEY`             | API authentication key | -                        | Yes      |
| `NODE_ENV`                        | Node environment       | `production`             | No       |
| `PORT`                            | Application port       | `3000`                   | No       |

### Build Arguments

You can customize the build with these arguments:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://your-edc:11002 \
  --build-arg NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/v3/management \
  --build-arg NEXT_PUBLIC_API_KEY=your-secret-key \
  -t sovity-edc-interface .
```

## Docker Compose

### Full Stack Deployment

The `docker-compose.yml` includes both the frontend and optionally the EDC connector:

```yaml
services:
  sovity-edc-interface:
    # Frontend application
    ports:
      - "3000:3000"

  edc-connector:
    # EDC connector (optional)
    ports:
      - "11002:11002"
```

### Commands

```bash
# Start all services
docker-compose up -d

# Start only frontend
docker-compose up -d sovity-edc-interface

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove volumes
docker-compose down -v
```

## Image Details

### Multi-Stage Build

The Dockerfile uses a 3-stage build process:

1. **Dependencies Stage**: Installs production dependencies
2. **Builder Stage**: Builds the Next.js application
3. **Runner Stage**: Creates minimal runtime image

### Image Size

- **Base image**: `node:18-alpine` (~40MB)
- **Built image**: ~150MB (optimized)
- **Build time**: 2-5 minutes (depending on hardware)

### Security Features

- ✅ Runs as non-root user (`nextjs`)
- ✅ Minimal attack surface (Alpine Linux)
- ✅ No unnecessary files in final image
- ✅ Health check endpoint
- ✅ Read-only container filesystem (recommended)

## Health Checks

The container includes a health check that runs every 30 seconds:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' sovity-edc-interface

# View health check logs
docker inspect --format='{{json .State.Health}}' sovity-edc-interface | jq
```

Health check endpoint: `http://localhost:3000/`

## Networking

### Container Network

The docker-compose setup creates a bridge network:

```bash
sovity-edc-network
├── sovity-edc-interface (3000)
└── edc-connector (11002, 11003)
```

### Port Mapping

| Service       | Container Port | Host Port | Purpose        |
| ------------- | -------------- | --------- | -------------- |
| Frontend      | 3000           | 3000      | Web UI         |
| EDC Connector | 11002          | 11002     | Management API |
| EDC Connector | 11003          | 11003     | DSP Protocol   |

## Production Deployment

### Best Practices

1. **Use Environment Files**

   ```bash
   # Don't commit .env.docker with secrets
   echo ".env.docker" >> .gitignore
   ```

2. **Set Resource Limits**

   ```yaml
   services:
     sovity-edc-interface:
       deploy:
         resources:
           limits:
             cpus: "1"
             memory: 512M
   ```

3. **Enable Restart Policy**

   ```yaml
   services:
     sovity-edc-interface:
       restart: unless-stopped
   ```

4. **Use Docker Secrets** (Kubernetes)

5. **Run Health Checks**

   ```bash
   # Add to docker-compose.yml
   healthcheck:
     test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

### Reverse Proxy Setup

#### Nginx Example

```nginx
upstream sovity-interface {
    server localhost:3000;
}

server {
    listen 80;
    server_name edc.yourdomain.com;

    location / {
        proxy_pass http://sovity-interface;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Traefik Example

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.sovity-interface.rule=Host(`edc.yourdomain.com`)"
  - "traefik.http.services.sovity-interface.loadbalancer.server.port=3000"
```

## Monitoring

### Container Logs

```bash
# View real-time logs
docker logs -f sovity-edc-interface

# Last 100 lines
docker logs --tail 100 sovity-edc-interface

# Logs with timestamps
docker logs -t sovity-edc-interface
```

### Container Stats

```bash
# Real-time stats
docker stats sovity-edc-interface

# JSON output
docker stats --no-stream --format "{{json .}}" sovity-edc-interface
```

### Health Status

```bash
# Check if container is healthy
docker ps --filter "name=sovity-edc-interface" --format "{{.Status}}"
```

## Troubleshooting

### Common Issues

**Issue**: Container exits immediately

```bash
# Check logs
docker logs sovity-edc-interface

# Common cause: Missing environment variables
# Solution: Ensure all required env vars are set
```

**Issue**: Cannot connect to EDC connector

```bash
# Check network
docker network inspect sovity-edc-network

# Test connectivity
docker exec sovity-edc-interface wget -O- http://edc-connector:11002/api/check/health
```

**Issue**: Build fails

```bash
# Clear Docker cache
docker builder prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

**Issue**: Port already in use

```bash
# Check what's using port 3000
lsof -i :3000

# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Host:Container
```

### Debug Mode

Run container in debug mode:

```bash
# Override entrypoint to get shell access
docker run -it --entrypoint /bin/sh sovity-edc-interface

# Or attach to running container
docker exec -it sovity-edc-interface /bin/sh
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          docker build -t sovity-edc-interface:${{ github.sha }} .

      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push sovity-edc-interface:${{ github.sha }}
```

## Advanced Configuration

### Custom Next.js Config

The Dockerfile uses standalone output mode for optimal Docker deployment:

```javascript
// next.config.js
module.exports = {
  output: "standalone", // Required for Docker
};
```

### Volume Mounts (Development)

For development with hot reload:

```yaml
services:
  sovity-edc-interface-dev:
    build:
      context: .
      target: builder # Stop at builder stage
    command: npm run dev
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    ports:
      - "3000:3000"
```

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi sovity-edc-interface

# Remove volumes
docker volume prune

# Complete cleanup
docker system prune -a --volumes
```

## Support

For issues related to Docker deployment:

1. Check container logs: `docker logs sovity-edc-interface`
2. Verify environment variables
3. Review this guide's troubleshooting section
4. Open an issue on GitHub

---

**Last Updated**: 2025-11-19
**Docker Version**: 20.10+
**Docker Compose Version**: 2.0+
