# Wiener Netze Smart Meter API node for Node-RED

This package provides a node for [Node-RED](https://nodered.org/) to access the Wiener Netze Smart Meter API (see references). You can retrieve consumption values (Verbrauchsdaten), meter readings (Zählerstände) and metadata of metering points (Zählpunkte). Minimal example flows are included in directory `contrib`.

# Installation

```
npm i @vrilcode/node-red-wnsm
```

# Usage without Node-RED

You can use this package also with your regular JS/TS application without Node-RED. An example code is provided in `contrib/wnsm-client.mjs`, which can be executed via `npm run client`, if an according `.env` file exists.

# References

* [Wiener Netze Smart Meter-Portale](https://www.wienernetze.at/smart-meter-webportal) (German)
* [Wiener Stadtwerke Developer-Portal](https://api-portal.wienerstadtwerke.at/portal/) (German)
* [Docs for Wiener Netze Smart Meter API](https://api-portal.wienerstadtwerke.at/portal/apis/7f8a1cce-2a7e-4b18-840b-b0387ed9a3fc/apidocumentation) (German)