# Warpy 🚀🌎

a social live streaming platform **✨**


## Features

- audio/video rooms with up to 4 video streamers
- easily shareable content (allows people to watch streams in the browser w/o installing the app)
- bots api (music bots, restream, etc)
- (somewhat) scalable media architecture
- WebSocket API


## Structure

| directory | description |
| --- | --- |
| [warpy](https://github.com/artieeg/Warpy/tree/main/warpy) | react native app |
| [warpy-web-next](https://github.com/artieeg/Warpy/tree/main/warpy-web-next) | nextjs web client for stream previews & invites |
| [media](https://github.com/artieeg/Warpy/tree/main/media) | mediasoup pub/sub server (beware of spaghetti code 🍝) |
| [lib](https://github.com/artieeg/Warpy/tree/main/lib) | common ts definitions |
| [backend](https://github.com/artieeg/Warpy/tree/main/backend) | NestJS backend |
| [api_client](https://github.com/artieeg/Warpy/tree/main/api_client) | WS API client |
| [ws_gateway](https://github.com/artieeg/Warpy/tree/main/ws_gateway) | WS API gateway |
| [media-client](https://github.com/artieeg/Warpy/tree/main/media-client) | abstractions over mediasoup-client |
| [client](https://github.com/artieeg/Warpy/tree/main/packages/client) | client-side business logic |
| [shared-components](https://github.com/artieeg/Warpy/tree/main/packages/shared-components) | shared components between web and mobile |
| [shared-store](https://github.com/artieeg/Warpy/tree/main/packages/shared-store) | shared zustand store between web and mobile |

