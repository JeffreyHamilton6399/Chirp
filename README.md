# Chirp

Chirp is a browser push-to-talk app. Open a channel, hold the button (or press Space), and your voice streams live to everyone in the same channel. No accounts, no installs — just a URL.

## Running locally

```powershell
npm.cmd install
npm.cmd start
```

Open the printed URL on each device on the same network.

## Features

- **Push-to-talk** — hold the PTT button or Space bar to transmit
- **Voice Activity Detection** — optional hands-free mode that transmits automatically when you speak
- **Channels** — create or join named channels; public or private
- **Recordings** — record the session audio and download it as a file
- **Noise suppression & echo cancellation** — toggle per-device in settings
- **Moderator controls** — mute, kick, or adjust per-peer volume as channel host

## Deploying for phones and remote networks

The app requires HTTPS for microphone access on mobile browsers. Deploy to any Node-capable HTTPS host (Fly.io, Railway, Render, etc.) and open that HTTPS URL on each device. The PeerJS signaling server is bundled and runs on the same origin automatically.

Environment variables:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Port the server listens on |
| `KEEP_ALIVE_TIMEOUT` | `65000` | Keep-alive timeout in ms (set above your proxy's idle timeout) |

## Tech

- **WebRTC** via [PeerJS](https://peerjs.com) for peer-to-peer audio
- **Express** + Node HTTP server with a bundled PeerJS signaling endpoint at `/peerjs`
- No build step — a single `index.html` and `server.js`
