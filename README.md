# Warpy 🚀🌎

a social live streaming platform **✨**

## Notes ⚠️

the project is archived until better times 🥲

Source code is published for scavenging purposes (there might be good ideas & approaches, but I'm not sure 🤣). 

A year ago, I wasn’t quite ready skill-wise for such a complex project. During the development, I’ve learned a lot and partially rewritten the app a few times, but there are still some places with awful code.

## Features

- audio/video rooms with up to 4 video streamers
- easily shareable content (allows people to watch streams in the browser w/o installing the app)
- bots api (music bots, restream, etc)
- (somewhat) scalable media architecture
- layered architecture (business logic doesn’t know framework details, etc.)
- WebSocket API
- UX with Reanimated 2
- gif avatars 🤩

## Gifs & Screenshots

TODO

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

