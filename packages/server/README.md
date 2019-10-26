# scorekeep

- Input board game results
- Get statistics based on said results
- Pretty visualizations

## Authentication

Supports registering / logging in with Google.

The auth token can be passed either via a Bearer token or a `token` cookie.

## Development

1. Start the database - `docker-compose up postgres`
1. Install dependencies - `yarn`
1. Start server - `yarn dev`
