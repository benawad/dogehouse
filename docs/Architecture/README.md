# Architecture Of DogeHouse!

<img src= "https://github.com/RonaldColyar/dogehouse/blob/staging/docs/Architecture/Architecture.png"/>



# How does DogeHouse dish out communications?

Voice communications are routed directly to the node [voice server](https://github.com/benawad/dogehouse/tree/staging/shawarma) through the usage of [WebRTC](https://webrtc.org/) once the elixir API gathers credentials for connection to the node voice server through [RabbitMQ](https://www.rabbitmq.com/)!

<img src="https://github.com/RonaldColyar/dogehouse/blob/staging/docs/Architecture/ReactAndNode.png" />

# How is data fetched?

All of data is fetched from the Client([React Front-end](https://github.com/benawad/dogehouse/tree/staging/kofta)) to the server([Elixir Api](https://github.com/benawad/dogehouse/tree/staging/kousa)) directly through a websocket connection!

<img src= "https://github.com/RonaldColyar/dogehouse/blob/staging/docs/Architecture/clientandelixr.png" />

# How is data stored?
All data is stored using Postgresql that is directly managed using the [Elixir Api](https://github.com/benawad/dogehouse/tree/staging/kousa)!


<img src="https://github.com/RonaldColyar/dogehouse/blob/staging/docs/Architecture/ElixirAndPostgresql.png" />
