const SPREADSHEET_ID='1CWRrwiZMmoYzyEraIQYhHsG-T_uwuyS4F0IzCLETmSg';
const TAB='Planner Data';
function doGet(){
 return HtmlService.createHtmlOutputFromFile('Index').setTitle('Weekly Planner');
}
function getSheet_(){
 const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB);
 if(!sheet)throw new Error('Planner Data tab not found');
 return sheet;
}
function loadPlanner(){
 try{
  const sheet=getSheet_();
  const revision=Number(sheet.getRange('D2').getValue())||0;
  const parts=Number(sheet.getRange('E2').getValue())||0;
  const rows=parts?sheet.getRange(2,2,parts,1).getValues():[];
  return {ok:true,revision,data:rows.map(r=>r[0]).join('')};
 }catch(e){return {ok:false,error:e.message}}
}
function savePlanner(json,expectedRevision){
 const lock=LockService.getScriptLock();
 if(!lock.tryLock(15000))return {ok:false,error:'Planner busy; please retry'};
 try{
  const sheet=getSheet_();
  const revision=Number(sheet.getRange('D2').getValue())||0;
  if(revision!==expectedRevision)return {ok:false,error:'This planner changed on another device. Export your local backup, then reload before merging changes.'};
  const parsed=JSON.parse(json);
  if(!parsed.weeks||!Array.isArray(parsed.projects))throw new Error('Invalid planner data');
  const chunks=json.match(/[\\s\\S]{1,40000}/g)||[''];
  const oldCount=Number(sheet.getRange('E2').getValue())||0;
  const count=Math.max(chunks.length,oldCount);
  if(sheet.getMaxRows()<count+1)sheet.insertRowsAfter(sheet.getMaxRows(),count+1-sheet.getMaxRows());
  const values=Array.from({length:count},(_,i)=>[chunks[i]||'']);
  sheet.getRange(2,2,count,1).setValues(values);
  sheet.getRange('A2').setValue('planner');
  sheet.getRange('C2').setValue(new Date());
  sheet.getRange('D2').setValue(revision+1);
  sheet.getRange('E2').setValue(chunks.length);
  return {ok:true,revision:revision+1};
 }catch(e){return {ok:false,error:e.message}}
 finally{lock.releaseLock()}
}
