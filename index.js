const {DiscoveryBackendServer, Client, Wrapper} = require('./pico')

/**
 * On the Clever Cloud platform
 * http port have to be 8080
 * and you can reach the service with the 80 http port
 */

let port = process.env.PORT || 9099;

let backend = new DiscoveryBackendServer()

/*
class Down extends Wrapper {}
class Up extends Wrapper {}

let check = service => service.status=="DOWN" ? Down.of(service) : Up.of(service)
*/

backend.start({port: port}, res => {
  res.when({
    Failure: error => console.log("😡 Houston? We have a problem!"),
    Success: port => {
      console.log(`🌍 pico discovery backend server is started on ${port}`)

      backend.checkServices({interval: 5000, f: updatedService => {
        updatedService.when({
          Failure: failure => console.log(failure.error, failure.service),
          Success: result => {
            // Success.of({record, service})
            console.log(result.record, result.service)
          }
        })
      }})

    }
  })
})
