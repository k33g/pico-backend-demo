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
      
      function clean() {
        for(var keyServices in backend.servicesDirectory) { 
          console.log(keyServices, ":") 
          //console.log(" -", backend.servicesDirectory[keyServices])
          backend.servicesDirectory[keyServices].forEach(service => {
            let client = new Client({service: service})
            client.healthCheck()
              .then(data => {
                if(service.registration == data.registration) {
                  console.log("   ❤️", service.registration, "rep:", data.registration)
                } else {
                  let index = backend.servicesDirectory[keyServices].indexOf(service)
                  console.log("   💔", service.registration, "rep:", data.registration, index)
                  // so we need to delete the service of the directory
                  console.log("   👋", backend.servicesDirectory[keyServices][index])

                }
                
              })
          })
        }
      } // end function clean()
      let t = setInterval(clean, 5000);

    }
  })
})

/*
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