//pm2 nodejs
module.exports = {
    apps : [{
      name: 'dtc_verver',
      script: 'src/server.js',
      watch: '.'
    // }, {
    //   script: './service-worker/',
    //   watch: ['./service-worker']
    }],
  
    deploy : {
      production : {
        user : 'SSH_USERNAME',
        host : 'SSH_HOSTMACHINE',
        ref  : 'origin/master',
        repo : 'GIT_REPOSITORY',
        path : 'DESTINATION_PATH',
        'pre-deploy-local': '',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
        'pre-setup': ''
      }
    }
  };
  