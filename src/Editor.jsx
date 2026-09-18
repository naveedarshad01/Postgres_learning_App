import React, {useEffect,useRef,forwardRef,useImperativeHandle} from 'react';
import {EditorView,basicSetup} from 'codemirror';
import {sql,PostgreSQL} from '@codemirror/lang-sql';
const theme=EditorView.theme({
 '&':{height:'300px',fontSize:'14px',backgroundColor:'#0c1b30',color:'#dbe8f5'},
 '.cm-scroller':{fontFamily:'"SFMono-Regular",Consolas,"Liberation Mono",monospace',lineHeight:'1.75'},
 '.cm-content':{padding:'18px 0',caretColor:'#73edca'},
 '.cm-gutters':{backgroundColor:'#0c1b30',color:'#6f849f',border:'none',padding:'18px 6px 18px 10px'},
 '.cm-activeLineGutter,.cm-activeLine':{backgroundColor:'#12253e'},
 '&.cm-focused .cm-cursor':{borderLeftColor:'#73edca'},
 '&.cm-focused .cm-selectionBackground,.cm-selectionBackground':{backgroundColor:'#28516b'},
 '.cm-tooltip':{backgroundColor:'#142b44',color:'#e6eff8',borderColor:'#34536e'},
 '.cm-foldPlaceholder':{backgroundColor:'#203c53',border:'none',color:'white'},
 '.cm-searchMatch':{backgroundColor:'#286758'},
},{dark:true});
export default forwardRef(function Editor({value,onChange,onRun,schema},ref){
 const holder=useRef(),view=useRef(),change=useRef(onChange);change.current=onChange;
 useImperativeHandle(ref,()=>({getSQL:()=>{const v=view.current;if(!v)return value;const range=v.state.selection.main;return range.empty?v.state.doc.toString():v.state.sliceDoc(range.from,range.to);}}));
 useEffect(()=>{
 const tables={};for(const t of schema?.tables||[])tables[`${t.table_schema}.${t.table_name}`]=t.columns.map(c=>c.column_name);
 view.current=new EditorView({doc:value,parent:holder.current,extensions:[basicSetup,sql({dialect:PostgreSQL,schema:tables,defaultSchema:'academy'}),theme,EditorView.lineWrapping,EditorView.contentAttributes.of({'aria-label':'SQL editor'}),EditorView.updateListener.of(update=>{if(update.docChanged)change.current(update.state.doc.toString());})]});
 return()=>view.current?.destroy();
 },[]);
 useEffect(()=>{const v=view.current;if(v&&value!==v.state.doc.toString())v.dispatch({changes:{from:0,to:v.state.doc.length,insert:value}});},[value]);
 return <div ref={holder} className="code-editor" onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();onRun();}}}/>;
});
