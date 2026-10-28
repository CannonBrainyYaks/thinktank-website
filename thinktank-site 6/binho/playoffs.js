function playoffState(){
 const ranked=standings(),results={};
 for(const m of data.playoffs||[]){
  const resolve=ref=>{if(!ref)return null;if(ref[0]==='S')return ranked[Number(ref.slice(1))-1]?.p||null;const previous=results[Number(ref.slice(1))];return previous?previous[ref[0]==='W'?'winner':'loser']:null};
  const id=Number(m.id.slice(1)),p1=resolve(m.ref1),p2=resolve(m.ref2);
  const played=p1&&p2&&m.s1!==''&&m.s2!==''&&m.s1!=null&&m.s2!=null&&Number(m.s1)!==Number(m.s2);
  results[id]={...m,p1,p2,winner:played?(Number(m.s1)>Number(m.s2)?p1:p2):null,loser:played?(Number(m.s1)<Number(m.s2)?p1:p2):null,played};
 }
 return results;
}
function playoffEditor(){
 if(!data.playoffs?.length)return '<p>Playoff scores will become available when the updated Google Apps Script is deployed.</p>';
 const results=playoffState();
 return '<h3>Championship match scores</h3><p class="muted">Save scores to Google Sheets. Winners and losers fill subsequent matchups automatically. Ties are not permitted.</p><div class="playoff-edit">'+data.playoffs.map(m=>{
  const x=results[Number(m.id.slice(1))];const active=x?.p1&&x?.p2;
  return '<div class="playoff-match"><strong>'+esc(m.id)+' · '+esc(m.round)+'</strong><span>'+esc(x.p1||m.ref1)+' vs '+esc(x.p2||m.ref2)+'</span><input id="a'+esc(m.id)+'" type="number" min="0" aria-label="First score" value="'+(x.played?esc(m.s1):'')+'" '+(!active?'disabled':'')+'><input id="b'+esc(m.id)+'" type="number" min="0" aria-label="Second score" value="'+(x.played?esc(m.s2):'')+'" '+(!active?'disabled':'')+'><button '+(!active?'disabled':'')+' onclick="savePlayoff(\''+esc(m.id)+'\')">Save</button></div>'
 }).join('')+'</div>';
}
async function savePlayoff(id){
 const m=playoffState()[Number(id.slice(1))];if(!m?.p1||!m?.p2)return;
 const a=document.getElementById('a'+id),b=document.getElementById('b'+id);
 if(a.value===''||b.value===''||!Number.isInteger(Number(a.value))||!Number.isInteger(Number(b.value))||Number(a.value)<0||Number(b.value)<0||Number(a.value)===Number(b.value))return alert('Enter two valid, different whole-number scores.');
 await saveScore(id);
}
