import React,{useState,useEffect} from 'react';
import {Code2,ArrowRight,ShieldCheck,Cloud,Users,BookOpen,Mail,Eye,EyeOff} from 'lucide-react';
import {supabase,passwordFlow,authCallbackError,callbackURL} from './client.js';
import {normalizeProgress} from './progress.js';
import './account.css';
const credit=<strong className="account-credit">Powered by Muhammad Naveed Arshad</strong>;
function Frame({children}){return <div className="auth-shell"><section className="auth-story"><a href="/" className="auth-brand"><Code2 size={27}/> PG Workbench</a><span className="auth-kicker">YOUR NEXT CHAPTER STARTS HERE</span><h1>Small steps.<br/>Stronger SQL.<br/><em>Real progress.</em></h1><p>Build the PostgreSQL skills you can put to work. Pick your pace, practice on real data, and keep your learning together.</p><div className="auth-benefits"><span><BookOpen/>7, 15 & 30-day learning plans</span><span><Cloud/>Your progress, across devices</span><span><ShieldCheck/>A private practice lab for your account</span></div><div className="auth-stat"><strong>90</strong><span>hands-on exercises</span><strong>25</strong><span>connected tables</span></div></section><section className="auth-content">{children}<footer>{credit}</footer></section></div>;}
function Password({value,onChange,label='Password',newPassword=false}){const [show,setShow]=useState(false);return <label>{label}<div className="password-input"><input type={show?'text':'password'} autoComplete={newPassword?'new-password':'current-password'} required minLength={newPassword?12:undefined} maxLength={128} value={value} onChange={e=>onChange(e.target.value)}/><button type="button" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>;}
function AuthForm(){
 const [mode,setMode]=useState('signin'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[username,setUsername]=useState(''),[name,setName]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(authCallbackError||''),[message,setMessage]=useState('');
 const change=value=>{setMode(value);setError('');setMessage('');setPassword('');setConfirm('');};
 async function submit(e){e.preventDefault();setBusy(true);setError('');setMessage('');try{
  if(mode==='signup'){
   if(password!==confirm)throw new Error('Passwords do not match.');
   const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{username:username.toLowerCase().trim(),display_name:name.trim()},emailRedirectTo:location.origin+'/'}});
   if(error)throw new Error(error.message.includes('Database')?'That username may be unavailable. Try a different username; if the problem persists, contact the app owner.':error.message);
   if(!data.session)setMessage('Check your email to confirm your account, then sign in. If you already have an account, sign in or reset your password.');
  }else if(mode==='reset'){
   const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:callbackURL()});if(error)throw error;
   setMessage('If an account exists for this email, a password-reset link has been sent. Check your inbox and spam folder.');
  }else{const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;}
 }catch(e){setError(e.message);}finally{setBusy(false);}}
 async function resend(){setBusy(true);setError('');try{const {error}=await supabase.auth.resend({type:'signup',email:email.trim(),options:{emailRedirectTo:location.origin+'/'}});if(error)throw error;setMessage('If confirmation is pending, a new confirmation email has been sent.');}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <Frame><div className="auth-card"><div className="auth-card-icon"><Users/></div><span className="auth-kicker">LEARN WITH PURPOSE</span><h2>{mode==='signup'?'Create your account':mode==='reset'?'Reset your password':'Welcome back.'}</h2><p>{mode==='signup'?'Choose a username so your instructor can follow your progress.':mode==='reset'?'We’ll email you a link to choose a new password.':'Sign in and pick up where you left off.'}</p>{mode!=='reset'&&<div className="auth-tabs"><button className={mode==='signin'?'selected':''} onClick={()=>change('signin')}>Sign in</button><button className={mode==='signup'?'selected':''} onClick={()=>change('signup')}>Sign up</button></div>}<form className="account-form" onSubmit={submit}>
 {mode==='signup'&&<><label>Full name<input autoComplete="name" maxLength={80} value={name} onChange={e=>setName(e.target.value)} required/></label><label>Username<input autoComplete="username" pattern="[a-z0-9_]{3,30}" minLength={3} maxLength={30} value={username} onChange={e=>setUsername(e.target.value.toLowerCase())} required/><small>3–30 lowercase letters, numbers or underscores.</small></label></>}
 <label>Email address<input type="email" autoComplete="email" maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} required/></label>
 {mode!=='reset'&&<Password value={password} onChange={setPassword} newPassword={mode==='signup'}/>}
 {mode==='signup'&&<><Password label="Confirm password" value={confirm} onChange={setConfirm} newPassword/><small>Use at least 12 characters. Your instructor can see completion, review activity and quiz scores; your notes and SQL drafts stay private to your account.</small></>}
 {error&&<div className="account-error" role="alert">{error}</div>}{message&&<div className="account-success" role="status">{message}</div>}
 <button className="btn primary auth-submit" disabled={busy}>{busy?'Please wait…':mode==='signup'?'Create account':mode==='reset'?'Send reset link':'Sign in'}<ArrowRight size={17}/></button>
 </form>{mode==='signin'?<button className="text-link auth-link" onClick={()=>change('reset')}>Forgot password?</button>:<button className="text-link auth-link" onClick={()=>change('signin')}>Back to sign in</button>}{mode==='signup'&&message&&<button className="text-link auth-link" disabled={busy||!email} onClick={resend}><Mail size={15}/> Resend confirmation</button>}<p className="auth-help">Invited by your instructor? Open the invitation email to set your password, then sign in here.</p></div></Frame>;
}
function SetPassword({done}){
 const [password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e){e.preventDefault();setError('');if(password!==confirm){setError('Passwords do not match.');return;}setBusy(true);try{const {error}=await supabase.auth.updateUser({password});if(error)throw error;done();}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <Frame><div className="auth-card"><div className="auth-card-icon"><ShieldCheck/></div><h2>Choose your password</h2><p>Use at least 12 characters to secure your learning account.</p><form className="account-form" onSubmit={submit}><Password value={password} onChange={setPassword} newPassword/><Password label="Confirm password" value={confirm} onChange={setConfirm} newPassword/>{error&&<p className="account-error" role="alert">{error}</p>}<button className="btn primary" disabled={busy}>{busy?'Saving…':'Save password & continue'}</button></form></div></Frame>;
}
function SignedIn({user,App}){
 const [boot,setBoot]=useState(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let alive=true;setError('');(async()=>{
  const [p,r]=await Promise.all([supabase.from('profiles').select('*').eq('id',user.id).single(),supabase.from('learner_progress').select('state,revision').eq('user_id',user.id).single()]);
  if(p.error||r.error)throw p.error||r.error;
  if(alive)setBoot({profile:p.data,state:normalizeProgress(r.data.state),revision:r.data.revision});
 })().catch(e=>alive&&setError(e.message));
 const touch=()=>{if(document.visibilityState==='visible')supabase.rpc('touch_my_activity').then(()=>{}).catch(()=>{});};touch();const timer=setInterval(touch,60000);
 return()=>{alive=false;clearInterval(timer);};},[user.id,attempt]);
 if(error)return <Frame><div className="auth-card"><h2>We couldn’t load your account</h2><p role="alert">{error}</p><p>Your saved progress has not been changed. Check the connection, or ask the owner to finish account setup.</p><button className="btn primary" onClick={()=>setAttempt(n=>n+1)}>Try again</button><button className="btn" onClick={()=>supabase.auth.signOut({scope:'local'})}>Sign out</button></div></Frame>;
 if(!boot)return <Frame><div className="auth-card" role="status"><h2>Loading your workspace…</h2><p>Bringing your learning progress back to you.</p></div></Frame>;
 return <App account={{...boot,user}}/>;
}
export default function AccountRoot({App}){
 const [session,setSession]=useState(null),[loading,setLoading]=useState(true),[reset,setReset]=useState(passwordFlow),[error,setError]=useState('');
 useEffect(()=>{if(!supabase){setLoading(false);return;}let alive=true;
 const {data:{subscription}}=supabase.auth.onAuthStateChange((event,next)=>{if(!alive)return;setSession(next);setLoading(false);if(event==='PASSWORD_RECOVERY')setReset(true);});
 supabase.auth.getSession().then(({data,error})=>{if(!alive)return;if(error)setError(error.message);setSession(data.session);setLoading(false);}).catch(e=>{if(alive){setError(e.message);setLoading(false);}});
 return()=>{alive=false;subscription.unsubscribe();};},[]);
 if(!supabase)return <Frame><div className="auth-card"><h2>Accounts are being prepared.</h2><p>The app owner needs to connect the account service before learners can sign in.</p><p>Owner: follow <strong>ACCOUNT_SETUP.md</strong> in your download, then rebuild and redeploy.</p></div></Frame>;
 if(loading)return <Frame><div className="auth-card" role="status"><h2>Opening PG Workbench…</h2></div></Frame>;
 if(error)return <Frame><div className="auth-card"><p className="account-error" role="alert">{error}</p><button className="btn" onClick={()=>location.reload()}>Try again</button></div></Frame>;
 if(!session)return <AuthForm/>;
 if(reset)return <SetPassword done={()=>{setReset(false);history.replaceState(null,'','/#path');}}/>;
 return <SignedIn key={session.user.id} user={session.user} App={App}/>;
}
