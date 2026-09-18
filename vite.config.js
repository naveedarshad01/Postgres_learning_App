import {defineConfig,loadEnv} from 'vite';
import {createInviteHandler} from './api/invite.js';
export default defineConfig(({mode})=>({
  plugins:[{name:'local-account-api',configureServer(server){const env={...process.env,...loadEnv(mode,process.cwd(),'')};const invite=createInviteHandler(env);server.middlewares.use('/api/invite',(req,res)=>{invite(req,res);});}}],
  optimizeDeps:{exclude:['@electric-sql/pglite']},
  worker:{format:'es'},
  server:{host:'0.0.0.0',port:4173,strictPort:true,allowedHosts:['terminal.local']},
  build:{chunkSizeWarningLimit:1200},
}));
