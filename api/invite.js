import {createClient} from '@supabase/supabase-js';
export function createInviteHandler(env=process.env,clientFactory=createClient){
 return async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const reply=(status,message)=>res.status ? res.status(status).json({message}) : (res.writeHead(status,{'Content-Type':'application/json'}),res.end(JSON.stringify({message})));
  if(req.method!=='POST'){res.setHeader('Allow','POST');return reply(405,'Method not allowed.');}
  const url=env.SUPABASE_URL||env.VITE_SUPABASE_URL,anon=env.VITE_SUPABASE_ANON_KEY,secret=env.SUPABASE_SERVICE_ROLE_KEY,site=env.APP_URL;
  if(!url||!anon||!secret||!site)return reply(503,'Account invitations are not configured. Ask the app owner to finish ACCOUNT_SETUP.md.');
  const token=/^Bearer (\S+)$/i.exec(req.headers.authorization||'')?.[1];
  if(!token)return reply(401,'Sign in first.');
  try{
   const origin=new URL(site).origin;
   if(req.headers.origin && req.headers.origin!==origin)return reply(403,'Request origin is not allowed.');
   const client=clientFactory(url,anon,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:`Bearer ${token}`}}});
   const {data:userData,error:userError}=await client.auth.getUser(token);
   if(userError||!userData?.user)return reply(401,'Your session expired. Sign in again.');
   const {data:profile,error:profileError}=await client.from('profiles').select('role').eq('id',userData.user.id).single();
   if(profileError||profile?.role!=='admin')return reply(403,'Administrator access required.');
   let body=req.body;
   if(body===undefined){let raw='';for await(const part of req){raw+=part;if(Buffer.byteLength(raw)>4096)return reply(413,'Request too large.');}body=JSON.parse(raw||'{}');}
   if(typeof body==='string')body=JSON.parse(body);
   if(!body||typeof body!=='object'||Buffer.byteLength(JSON.stringify(body))>4096)return reply(400,'Invalid invitation.');
   const username=typeof body.username==='string'?body.username.trim().toLowerCase():'';
   const email=typeof body.email==='string'?body.email.trim():'';
   const display_name=typeof body.display_name==='string'?body.display_name.trim():'';
   if(!/^[a-z0-9_]{3,30}$/.test(username)||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||display_name.length>80)return reply(400,'Enter a valid email, username (3–30 letters, digits or underscores), and name (up to 80 characters).');
   const admin=clientFactory(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
   const {error}=await admin.auth.admin.inviteUserByEmail(email,{data:{username,display_name},redirectTo:`${origin}/?account=setup`});
   if(error)return reply(400,'Invitation could not be sent. The email or username may already be registered, or the email service may be unavailable. Check Supabase Auth logs.');
   return reply(200,'Account created. An invitation to choose a password has been emailed to the learner.');
  }catch{return reply(500,'The invitation could not be completed. Please check account-service configuration and try again.');}
 };
}
export default createInviteHandler();
