# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with SvelteKit and configured to run as an HTTPS server. The site appears to be a multilingual personal portfolio/garden with individual pages for different people (Felix, Nadège, Nicole).

## Architecture

- **Framework**: SvelteKit with Node.js adapter
- **Server**: Custom HTTPS server (server.js) that wraps the SvelteKit handler
- **SSL**: Requires SSL certificates in `./ssl/` directory (private.key and certificate.crt)
- **Logging**: Custom access logging middleware in hooks.server.js that logs to `logs/access.log`
- **Port**: Configured to run on port 443 (HTTPS)
- **Font**: Uses Geist variable font loaded from `/static/fonts/`

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start production server (requires SSL certs)
npm run start
```

## Key Files and Structure

- `server.js` - Custom HTTPS server wrapper around SvelteKit
- `src/hooks.server.js` - Request logging middleware
- `src/routes/+layout.svelte` - Global layout with Geist font setup
- `src/routes/+page.svelte` - Main homepage
- `src/routes/[person]/+page.svelte` - Individual person pages
- `static/fonts/` - Contains Geist variable font
- `ssl/` - Required SSL certificate directory (not in repo)

## Production Deployment

The production server requires:
1. SSL certificates in `./ssl/` directory
2. Build artifacts from `npm run build`
3. Access to port 443
4. `logs/` directory for access logging

## Important Notes

- The server expects to run with root privileges (port 443)
- SSL certificates are required and loaded from filesystem
- Access logs are written to `logs/access.log`
- The project uses ES modules (`"type": "module"`)
- Graceful shutdown handling for SIGTERM and SIGINT