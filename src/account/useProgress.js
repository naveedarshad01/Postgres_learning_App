import {useState,useEffect,useRef} from 'react';
import {supabase} from './client.js';
import {createProgressWriter} from './progress.js';
export function useProgress(state,revision){
 const [saved,setSaved]=useState(state),[status,setStatus]=useState('Saved');
 const ref=useRef(null);
 if(!ref.current)ref.current=createProgressWriter(state,revision,async(p_state,p_revision)=>{
  const {data,error}=await supabase.rpc('save_my_progress',{p_state,p_revision});
  if(error)throw error;return data;
 },setStatus);
 const writer=ref.current;
 useEffect(()=>{writer.set(saved);const timer=setTimeout(()=>writer.flush().catch(()=>{}),650);return()=>clearTimeout(timer);},[saved,writer]);
 useEffect(()=>{
  const before=e=>{if(writer.dirty()){e.preventDefault();e.returnValue='';}};
  const online=()=>writer.flush().catch(()=>{});
  window.addEventListener('beforeunload',before);window.addEventListener('online',online);
  return()=>{window.removeEventListener('beforeunload',before);window.removeEventListener('online',online);writer.close();};
 },[writer]);
 return {saved,setSaved,status,flush:()=>{writer.set(saved);return writer.flush();}};
}
