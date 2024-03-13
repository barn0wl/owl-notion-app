const fastify = require('fastify')({
    logger: true
  })
const index = require('./index.js');
var cron = require('node-cron');


  // Declare a route
  fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
  })
  
  // Run the server!
  fastify.listen({ port: process.env.PORT, host: "0.0.0.0" }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    console.log(`Server is now listening on ${address}`)
  })

  //keep updating every 14 min to prevent app from going to sleep
  cron.schedule('*/14 * * * *', () => {
    index.updatingTasks();
  });
  