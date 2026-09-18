// Result-based learning checks, not a secure anti-cheating system.
// Reference queries run against a clean, separate database.
function canonical(v) {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  if (Array.isArray(v)) return v.map(canonical);
  if (typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])]));
  // int8 / numeric are often strings. Preserve precision by comparing normalized
  // decimal strings instead of coercing arbitrary values to JavaScript numbers.
  if (typeof v === 'number' || (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v))) {
    const s=String(v); if (/e/i.test(s)) return s;
    const [whole, fraction='']=s.split('.');
    const w=whole.replace(/^(-?)0+(?=\d)/,'$1'); const f=fraction.replace(/0+$/,'');
    return (w==='-0'?'0':w)+(f?'.'+f:'');
  }
  return v;
}
export function rowsAsArrays(result) {
  return result.rows.map(r=>result.fields.map(f=>r[f.name]));
}
export function compareRows(actual, expected, ordered=false) {
  const a=actual.map(r=>JSON.stringify(canonical(r))), b=expected.map(r=>JSON.stringify(canonical(r)));
  if(!ordered){a.sort();b.sort();}
  return a.length===b.length && a.every((v,i)=>v===b[i]);
}
// Remove quoted strings, dollar bodies and comments before looking for transaction control.
export function codeOnly(sql) {
 return sql.replace(/(\$(?:[A-Za-z_][A-Za-z_0-9]*)?\$)[\s\S]*?\1|'(?:''|[^'])*'|"(?:""|[^"])*"|--[^\n]*|\/\*[\s\S]*?\*\//g, ' ');
}
export async function grade(db, exercise, sql) {
  if(!sql.trim() || sql.length>50000) throw new Error('Enter SQL between 1 and 50,000 characters.');
  const bare=codeOnly(sql);
  if(/(^|;)\s*(begin|commit|end|rollback|start|savepoint|release|prepare|vacuum|set|reset|discard|do|call)\b/i.test(bare)) throw new Error('The checker manages its own transaction. Remove transaction/session control, DO or CALL statements; use Run SQL for free practice.');
  await db.exec('BEGIN; SET LOCAL search_path TO lab,academy,public;');
  try {
    let actual,expected,columns,expectedColumns;
    if(exercise.kind==='query') {
      await db.exec('SET TRANSACTION READ ONLY;');
      const reference=await db.query(exercise.solution);
      const result=await db.query(sql); // Extended protocol rejects multiple commands.
      actual=rowsAsArrays(result); expected=rowsAsArrays(reference);
      columns=result.fields.map(f=>f.name); expectedColumns=reference.fields.map(f=>f.name);
    } else {
      if(exercise.setup) await db.exec(exercise.setup);
      await db.exec(sql);
      for(const [i,check] of (exercise.checks||[]).entries()) {
        await db.exec('SAVEPOINT validation_check');
        let error;
        try {if(check.expected){const checked=await db.query(check.sql);if(!compareRows(rowsAsArrays(checked),check.expected,true))throw new Error(check.message||"Schema metadata did not match the requested design.");}else await db.exec(check.sql);} catch(e) {error=e;}
        if(error) await db.exec('ROLLBACK TO SAVEPOINT validation_check');
        await db.exec('RELEASE SAVEPOINT validation_check');
        if(check.error && error?.code!==check.error) throw new Error(`Constraint check ${i+1} failed: expected SQLSTATE ${check.error}, received ${error?.code||'a successful write'}.`);
        if(!check.error && error) throw new Error(`Behavior check ${i+1} failed: ${error.message}`);
      }
      const result=await db.query(exercise.verify);
      actual=rowsAsArrays(result); expected=exercise.expectedQuery?rowsAsArrays(await db.query(exercise.expectedQuery)):exercise.expected; columns=result.fields.map(f=>f.name); expectedColumns=columns;
    }
    const columnsMatch=columns.length===expectedColumns.length && columns.every((v,i)=>v===expectedColumns[i]);
    const passed=columnsMatch && compareRows(actual,expected,exercise.ordered||exercise.kind==='build');
    return {passed,actualCount:actual.length,expectedCount:expected.length,columns,expectedColumns,
      sample:actual.slice(0,5),expectedSample:expected.slice(0,5),
      message:passed?'Passed. Your result matches the reference and the applicable behavior checks.':!columnsMatch?'Check your output column names and order. Use the aliases requested in the task.':actual.length!==expected.length?'The row count differs. Check filters, join grain and missing matches.':'The values or required row ordering differ. Check calculations, NULL handling and tie-breakers.'};
  } finally {await db.exec('ROLLBACK');}
}
