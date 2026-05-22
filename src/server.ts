import { app } from './app.js'
import { env } from './env/index.js'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    app.log.info('API rodando!')
    app.log.info(`Docs: ${env.API_URL}/docs/`)
  })
