const fastify = require('fastify')({
    logger: true
  })
const index = require('./index.js')

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

  //start countdown for updating tasks
  index.executeFunctionAtSpecificTime(0, 0, 0, index.updatingTasks);
  