'use strict';

/**
 * Streams.js controller
 *
 * @description: A set of functions called "actions" for managing `Streams`.
 */

const PassThrough = require('stream').PassThrough
const randomStrings = () => Math.random().toString(36).substr(2, 5)
const eventStreamFormat = (event, data) => `event: ${ event }\ndata: ${ data }\n\n`

var clientId = 0
var clients = {} // <- Keep a map of attached clients

setInterval(() => {
    console.log('Clients: ' + Object.keys(clients))
    for (clientId in clients) {

        const { res, streamName } = clients[clientId]

        let message = {
            clientId,
            name: streamName,
            body: randomStrings(),
            clientCount: Object.keys(clients).length,
            currentTime: new Date()
        }

        res.write(eventStreamFormat(streamName, JSON.stringify(message)))
    }
}, 1000)

module.exports = {
  findOne: async (ctx) => {

    const name = ctx.params._name
    console.log(`params name: ${name}`)
    switch (name) {
      case 'properties':
        // ctx.body = `name: ${name}`

         let stream = new PassThrough()

         ctx.type = 'text/event-stream'
         ctx.body = stream

         ctx.req.socket.setTimeout(2147483647) // HTTP Keep-Alive
         ctx.res.write('\n');
         (function (clientId) {
           clients[clientId] = { res: ctx.res, streamName: name }; // attach this client
           ['close', 'finish', 'error'].forEach(eventName => {
             ctx.req.on(eventName, () => {
               console.log(`eventName: ${ eventName } clientId: ${ clientId }`)
               ctx.res.end()
               delete clients[clientId]
             })
           }) // remove client when it disconnects
         })(++clientId)

        break
      default:
        return ctx.notFound();
    }

  },
};
