# Lazarus Proxy 🔗

A smart URL proxy service that resurrects dead links using the Internet Archive's Wayback Machine.

## What it does

Lazarus Proxy checks if a URL is alive and accessible. If the link is dead, it automatically redirects you to an archived version from the Wayback Machine - bringing dead links back to life!

## Features

- ✅ **Health Check**: Verifies if URLs are accessible
- 🗄️ **Archive Fallback**: Automatically redirects to Wayback Machine archives for dead links
- ⚡ **Caching**: Prevents redundant API calls for better performance
- 🚀 **Fast Timeouts**: 3-second timeout for quick user experience
- 📝 **Detailed Logging**: Clear console feedback for debugging

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/lazarus-proxy.git
cd lazarus-proxy
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node index.js
```

The server will run on `http://localhost:3000` by default.

## Usage

Make a GET request to `/go` with a URL parameter:

```
http://localhost:3000/go?url=https://example.com
```

### Examples

- **Live link**: `http://localhost:3000/go?url=https://google.com`
  - Redirects directly to Google
  
- **Dead link**: `http://localhost:3000/go?url=https://some-dead-website.com`
  - Attempts to find and redirect to a Wayback Machine snapshot

## How it works

1. Receives a URL via query parameter
2. Checks cache for previous results
3. Pings the target URL with a HEAD request
4. If alive → redirects directly
5. If dead → queries Wayback Machine API
6. If archive exists → redirects to archived snapshot
7. If no archive → returns 404 error

## Tech Stack

- **Node.js** with Express.js
- **Axios** for HTTP requests
- **Wayback Machine API** for archives

## Environment Variables

- `PORT`: Server port (default: 3000)

## License

ISC
