const fastify = require('fastify')({
    logger: true
  })
  
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