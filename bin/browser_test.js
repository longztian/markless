/* eslint no-console: 'off', max-len: 'off' */
const https = require('https')
const http = require('http')
const serveStatic = require('serve-static')
const conf = require('./saucelabs.conf')

const submitJobs = (config) => {
  const data = config
  data.platforms = data.platforms.filter(p => !('appiumVersion' in p)).map(p => [p.platform, p.browserName, p.version])
  const body = JSON.stringify(data)

  const options = {
    method: 'POST',
    path: '/rest/v1/longztian/js-tests',
    hostname: 'saucelabs.com',
    auth: 'longztian:ecd15b59-b05f-4a82-a54f-97e97b859965',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': body != null ? Buffer.byteLength(body) : 0,
    },
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let json = ''
      res.on('data', (chunk) => {
        json += chunk
      })
      res.on('error', (err) => {
        throw err
      })
      res.on('end', () => {
        console.log(`saucelabs jobs: ${json}`)
        const jobs = JSON.parse(json)
        if (jobs) {
          resolve(jobs)
        } else {
          reject('no job ids returned')
        }
      })
    })

    req.on('error', (err) => {
      throw err
    })

    // post the data
    if (body != null) {
      req.write(body)
    }

    req.end()
  })
}

const checkJobStatus = (jobs) => {
  const body = JSON.stringify(jobs)
  const options = {
    method: 'POST',
    path: '/rest/v1/longztian/js-tests/status',
    hostname: 'saucelabs.com',
    auth: 'longztian:ecd15b59-b05f-4a82-a54f-97e97b859965',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': body != null ? Buffer.byteLength(body) : 0,
    },
  }

  const queryStatus = () => new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let json = ''
      res.on('data', (chunk) => {
        json += chunk
      })
      res.on('error', (err) => {
        throw err
      })
      res.on('end', () => {
        const status = JSON.parse(json)
        if (status) {
          resolve(status)
        } else {
          reject('no job status returned')
        }
      })
    })

    req.on('error', (err) => {
      throw err
    })

    // post the data
    if (body != null) {
      req.write(body)
    }

    req.end()
  })

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      queryStatus().then(status => {
        // not completed yet
        if (!status.completed) {
          const pendingJobs = status['js tests'].filter(job => !job.result)
          console.log(`waiting for pending jobs: ${pendingJobs.length}`)
          return
        }

        const failedJobs = status['js tests'].filter(job => !job.result || job.result.tests !== job.result.passes)
        console.log(`successed jobs: ${status['js tests'].length - failedJobs.length}`)
        console.log(`failed    jobs: ${failedJobs.length}`)

        // completed
        clearInterval(timer)

        if (failedJobs.length > 0) {
          reject(`${failedJobs.length} jobs failed`)
        } else {
          resolve()
        }
      }).catch(err => {
        throw err
      })
    }, 10 * 1000)

    // timeout after 10 minutes
    setTimeout(() => {
      clearInterval(timer)
      reject('browser test jobs timeout')
    }, 600 * 1000)
  })
}


// Serve up module's root folder
const serve = serveStatic('.')
const next = () => {}

// Create server
const server = http.createServer((req, res) => {
  serve(req, res, next)
})

// start the server
server.listen(9000, () => {
  console.log('web server started at localhost:9000')

  submitJobs(conf)
    .then(jobs => checkJobStatus(jobs))
    .then(() => {
      server.close()
      process.exit(0)
    }).catch(err => {
      console.log(err)
      server.close()
      process.exit(1)
    })
})
