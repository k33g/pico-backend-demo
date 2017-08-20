const {DiscoveryBackendServer, Client} = require('./pico')

/**
 * On the Clever Cloud platform
 * http port have to be 8080
 * and you can reach the service with the 80 http port
 */

let port = process.env.PORT || 9099;

let backend = new DiscoveryBackendServer()

backend.start({port: port}, res => {
  res.when({
    Failure: error => console.log("😡 Houston? We have a problem!"),
    Success: port => {
      console.log(`🌍 pico discovery backend server is started on ${port}`)

      backend.checkServices({interval: 5000, f: updatedService => {
        updatedService.when({
          Failure: failure => console.log(failure.error, failure.service),
          Success: service => {
            console.log(`👋 🍄 this service ${service.registration} is ${service.status}`)
          }
        })
      }})

    }
  })
})

/*

      function updateStatusOfServices() {
        for(var keyServices in backend.servicesDirectory) { 
          console.log(keyServices, ":") 
          backend.servicesDirectory[keyServices].forEach(service => {
            let client = new Client({service: service})
            client.healthCheck()
              .then(serviceHealth => {
                if(serviceHealth.status=="DOWN") {
                  console.log(`👎 The service with the id ${serviceHealth.registration} is marked to "DOWN"`)
                  console.log(`It probably belongs to a stopped/removed VM or container`)
                } else {
                  console.log(`👍 The service with the id ${serviceHealth.registration} is marked to "UP"`)
                }
                // updating the status in the services lis
                service.status = serviceHealth.status
              })
          })
        }
      } // end function updateStatusOfServices()
      setInterval(updateStatusOfServices, 5000);



  // remove phantom services
  watchServiceList({interval}) {
    let servicesList = this.servicesDirectory
    function clean() {
      //var d = new Date();
      for(var keyServices in servicesList) { 
        console.log(keyServices) 
        console.log(" -", servicesList[keyServices])
        servicesList[keyServices].forEach(service => {
          let client = new Client({service: service})
          client.healthCheck()
            .then(data => {
              console.log("  =>", data)
              // if data.registration <> service.registration => remove this service
              if(data.registration!==service.registration) {
                let index = servicesList[keyServices].indexOf(service)
                if (index > -1) {
                  servicesList[keyServices].splice(index, 1)
                }
              }
            })
            .catch(err => {
              //TODO
            })

        })
      }
    }

    let t = setInterval(clean, interval);
    

  }
*/


/*
    this.service.post({uri:`/api/clean/services`, f: (request, response) => {
      let data = request.body
      let domain = data.domain
      let name = data.name

      if(this.servicesDirectory[data.keyServices]) {
        let serviceObject = this.servicesDirectory[keyServices].filter(item=>item.name==data.name && item.domain==data.domain)
      } 
      response.sendJson({registration: data.record.registration})
    }})
*/