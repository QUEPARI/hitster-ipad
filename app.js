const APP_VERSION = 'v38 PWA';
const QUESTIONS=[
  {id:'multi',text:'EÉN OF MEERDERE ARTIESTEN',color:'#7e57c2'},
  {id:'decade',text:'DECENNIUM',color:'#2979ff'},
  {id:'title',text:'SONGTITEL',color:'#ef5350'},
  {id:'year',text:'EXACTE JAAR',color:'#fb8c00'},
  {id:'artist',text:'ARTIEST',color:'#43a047'},
  {id:'three',text:'3 JAAR ERVOOR OF ERNA',color:'#00acc1'},
  {id:'sing',text:'ZING MEE',color:'#fdd835',dark:true}
];
const state={count:4,names:['Speler 1','Speler 2','Speler 3','Speler 4'],phase:'setup',winner:null,question:null,bag:[],timer:null,auto:true,winnerSeconds:2,questionSeconds:30,showTimer:true,active:new Set(QUESTIONS.map(q=>q.id))};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const setup=$('#setup'),game=$('#game'),board=$('#board'),statusText=$('#statusText'),winnerView=$('#winnerView'),questionView=$('#questionView'),winnerMini=$('#winnerMini'),questionBox=$('#questionBox'),questionText=$('#questionText'),timerText=$('#timerText'),nextRound=$('#nextRound'),manualStart=$('#manualStart'),timeoutSequence=$('#timeoutSequence'),timeUpText=$('#timeUpText');


function hideTimeoutSequence(){
  if(!timeoutSequence) return;
  timeoutSequence.classList.add('hidden');
  timeUpText?.classList.add('hidden');
}

function showTimeoutSequence(){
  clearQuestionTension();
  clearTimers();
  state.phase='timeout';
  updateSettingsGear();
  statusText.classList.add('hidden');
  winnerView.classList.add('hidden');
  questionView.classList.add('hidden');
  manualStart.classList.add('hidden');
  $$('.player-zone').forEach(z=>z.classList.add('disabled'));

  hideTimeoutSequence();
  timeoutSequence.classList.remove('hidden');
  timeUpText.classList.remove('hidden');

  state.timer=setTimeout(()=>{
    hideTimeoutSequence();
    startRound();
  },1500);
}

function setTheme(theme){
  const next = ['dark','light','hitster'].includes(theme) ? theme : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.body.classList.toggle('light-mode', next === 'light');
  document.body.classList.toggle('hitster-mode', next === 'hitster');
  localStorage.setItem('hitster-ipad-theme', next);

  const darkBtn = document.getElementById('darkModeBtn');
  const lightBtn = document.getElementById('lightModeBtn');
  const hitsterBtn = document.getElementById('hitsterModeBtn');
  if (darkBtn) darkBtn.classList.toggle('active', next === 'dark');
  if (lightBtn) lightBtn.classList.toggle('active', next === 'light');
  if (hitsterBtn) hitsterBtn.classList.toggle('active', next === 'hitster');
}
{
  const saved = localStorage.getItem('hitster-ipad-theme');
  setTheme(['dark','light','hitster'].includes(saved) ? saved : 'dark');
}


function forceCloseAllModals(){
  const settingsModal = document.getElementById('settingsModal');
  if(settingsModal) settingsModal.classList.add('hidden');
}
forceCloseAllModals();
window.addEventListener('pageshow', forceCloseAllModals);

const darkModeBtn = document.getElementById('darkModeBtn');
const lightModeBtn = document.getElementById('lightModeBtn');
const hitsterModeBtn = document.getElementById('hitsterModeBtn');
if (darkModeBtn) darkModeBtn.addEventListener('click', () => setTheme('dark'));
if (lightModeBtn) lightModeBtn.addEventListener('click', () => setTheme('light'));
if (hitsterModeBtn) hitsterModeBtn.addEventListener('click', () => setTheme('hitster'));


let pausedQuestionRemaining = null;
let questionDeadline = null;
let settingsPausedQuestion = false;

function updateSettingsGear(){
  const gear = document.getElementById('settingsGear');
  if(!gear) return;
  const gameVisible = !game.classList.contains('hidden');
  const shouldShow = gameVisible && state.phase === 'question';
  gear.classList.toggle('hidden', !shouldShow);
}

function pauseQuestionForSettings(){
  clearQuestionTension();
  if(state.phase !== 'question') return;
  settingsPausedQuestion = true;
  if(questionDeadline){
    pausedQuestionRemaining = Math.max(0, Math.ceil((questionDeadline - Date.now()) / 1000));
  } else {
    pausedQuestionRemaining = state.questionSeconds;
  }
  clearTimers();
}

function resumeQuestionAfterSettings(){
  if(!settingsPausedQuestion || state.phase !== 'question') return;
  settingsPausedQuestion = false;
  let left = Math.max(0, pausedQuestionRemaining ?? state.questionSeconds);
  pausedQuestionRemaining = null;

  timerText.textContent = state.showTimer ? format(left) : '';
  timerText.classList.toggle('hidden', !state.showTimer);
  updateQuestionTension();

  if(left <= 0){
    startRound();
    return;
  }

  questionDeadline = Date.now() + left * 1000;
  const tick = ()=>{
    if(state.phase !== 'question' || settingsPausedQuestion) return;
    const remaining = Math.max(0, Math.ceil((questionDeadline - Date.now()) / 1000));
    if(state.showTimer) timerText.textContent = format(remaining);
    if(remaining <= 0){
      questionDeadline = null;
      if(state.auto) startRound();
      else showIdle();
      return;
    }
    state.timer = setTimeout(tick, 250);
  };
  state.timer = setTimeout(tick, 250);
}

updateSettingsGear();
function renderNameFields(){
  const c=$('#nameFields');
  c.innerHTML='';
  for(let i=0;i<state.count;i++){
    const inp=document.createElement('input');
    const fallback=`Speler ${i+1}`;
    inp.placeholder=fallback;
    inp.value=state.names[i]||fallback;
    inp.dataset.defaultName=fallback;

    inp.addEventListener('focus',()=>{
      if(inp.value===inp.dataset.defaultName){
        inp.value='';
      }
    });

    inp.addEventListener('blur',()=>{
      const value=inp.value.trim();
      if(!value){
        inp.value=inp.dataset.defaultName;
        state.names[i]=inp.dataset.defaultName;
      }else{
        state.names[i]=value;
      }
    });

    inp.addEventListener('input',()=>{
      state.names[i]=inp.value.trim()||fallback;
    });

    c.appendChild(inp);
  }
}
$$('#playerCount button').forEach(b=>b.onclick=()=>{state.count=+b.dataset.count;$$('#playerCount button').forEach(x=>x.classList.toggle('active',x===b));renderNameFields()});renderNameFields();
function renderQuestions(){const c=$('#questionOptions');c.innerHTML='';QUESTIONS.forEach(q=>{const l=document.createElement('label');l.className='question-check';l.innerHTML=`<input type="checkbox" ${state.active.has(q.id)?'checked':''}><span>${q.text}</span>`;const inp=l.querySelector('input');inp.onchange=()=>{if(inp.checked)state.active.add(q.id);else{if(state.active.size===1){inp.checked=true;return}state.active.delete(q.id)}state.bag=[]};c.appendChild(l)})}renderQuestions();

function syncSettings(){
  state.auto=true;
  state.winnerSeconds=2;
  state.questionSeconds=Math.max(5,+$('#questionSeconds').value||30);
  state.showTimer=$('#showTimer').checked;
  manualStart.classList.add('hidden');
}


const setupSettingsBtn=document.getElementById('setupSettingsBtn');
if(setupSettingsBtn){
  setupSettingsBtn.onclick=()=>{
    $('#settingsModal').classList.remove('hidden');
  };
}

const settingsGear=document.getElementById('settingsGear');
if(settingsGear){
  settingsGear.onclick=()=>{
    pauseQuestionForSettings();
    $('#settingsModal').classList.remove('hidden');
  };
}

$$('[data-close]').forEach(b=>{
  b.onclick=()=>{
    $('#'+b.dataset.close).classList.add('hidden');
    resumeQuestionAfterSettings();
  };
});

const saveSettingsBtn=document.getElementById('saveSettings');
if(saveSettingsBtn){
  saveSettingsBtn.onclick=()=>{
    syncSettings();
    $('#settingsModal').classList.add('hidden');
    resumeQuestionAfterSettings();
  };
}

$('#resetBtn').onclick=()=>{
  $('#settingsModal').classList.add('hidden');
  settingsPausedQuestion=false;
  pausedQuestionRemaining=null;
  resetToSetup();
};
$('#startGame').onclick=()=>{for(let i=0;i<state.count;i++){const v=$('#nameFields input:nth-child('+(i+1)+')').value.trim();state.names[i]=v||`Speler ${i+1}`};setup.classList.add('hidden');game.classList.remove('hidden');updateSettingsGear();board.className=`board players-${state.count}`;$$('.player-zone').forEach((z,i)=>{z.classList.remove('winner','disabled','phase-hidden')});syncSettings();state.phase='idle';updateSettingsGear();startRound()};
function showIdle(){clearQuestionTension();clearTimers();hideTimeoutSequence();state.phase='idle';updateSettingsGear();statusText.textContent='Klaar voor volgende ronde';statusText.classList.remove('hidden');winnerView.classList.add('hidden');questionView.classList.add('hidden');$$('.player-zone').forEach(z=>{z.classList.add('disabled');z.classList.remove('phase-hidden')});manualStart.classList.add('hidden')}
function startRound(){clearQuestionTension();clearTimers();hideTimeoutSequence();state.phase='open';updateSettingsGear();state.winner=null;statusText.textContent='';statusText.classList.add('hidden');winnerView.classList.add('hidden');questionView.classList.add('hidden');manualStart.classList.add('hidden');$$('.player-zone').forEach((z,i)=>{z.classList.toggle('disabled',i>=state.count);z.classList.remove('winner','phase-hidden')})}
manualStart.onclick=startRound;
$$('.player-zone').forEach((z,i)=>{const down=e=>{e.preventDefault();if(state.phase!=='open'||i>=state.count)return;chooseWinner(i)};z.addEventListener('pointerdown',down,{passive:false})});
function chooseWinner(i){clearQuestionTension();state.phase='winner';updateSettingsGear();state.winner=i;$$('.player-zone').forEach((z,j)=>{z.classList.toggle('winner',j===i);z.classList.add('disabled')});statusText.classList.add('hidden');winnerView.textContent=state.names[i];winnerView.classList.remove('hidden');questionView.classList.add('hidden');state.timer=setTimeout(showQuestion,2000)}
function refillBag(){const active=QUESTIONS.filter(q=>state.active.has(q.id));const prev=state.question?.id;let arr=[...active];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}if(arr.length>1&&arr[0]?.id===prev)[arr[0],arr[1]]=[arr[1],arr[0]];state.bag=arr}
function nextQuestion(){if(!state.bag.length)refillBag();return state.bag.shift()}

function fitQuestionToOneLine(){
  const box = questionBox;
  const text = questionText;
  if(!box || !text) return;

  text.style.fontSize = '';

  const style = getComputedStyle(box);
  const padLeft = parseFloat(style.paddingLeft) || 0;
  const padRight = parseFloat(style.paddingRight) || 0;
  const maxWidth = Math.max(120, box.clientWidth - padLeft - padRight);

  let size = parseFloat(getComputedStyle(text).fontSize);
  while (text.scrollWidth > maxWidth && size > 18){
    size -= 1;
    text.style.fontSize = size + 'px';
  }
}



let tensionRaf = null;
let tensionPhase = 0;
let tensionLastFrame = 0;

function hexToRgb(hex){
  const value=hex.replace('#','');
  const n=parseInt(value.length===3 ? value.split('').map(c=>c+c).join('') : value,16);
  return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
}

function mixChannel(a,b,t){
  return Math.round(a+(b-a)*t);
}

function mixHex(hex,target,t){
  const c=hexToRgb(hex);
  const targetRgb=target==='white'?{r:255,g:255,b:255}:{r:0,g:0,b:0};
  return `rgb(${mixChannel(c.r,targetRgb.r,t)}, ${mixChannel(c.g,targetRgb.g,t)}, ${mixChannel(c.b,targetRgb.b,t)})`;
}

function renderQuestionTensionFrame(ts){
  if(state.phase!=='question' || settingsPausedQuestion || !state.question || !questionDeadline){
    clearQuestionTension();
    return;
  }

  const remainingMs=Math.max(0,questionDeadline-Date.now());

  if(remainingMs<=0){
    clearQuestionTension();
    return;
  }

  if(remainingMs>10000){
    questionBox.style.background=state.question.color;
    questionBox.style.transform='';
    questionBox.style.boxShadow='';
    tensionLastFrame=ts;
    tensionRaf=requestAnimationFrame(renderQuestionTensionFrame);
    return;
  }

  const progress=Math.min(1,Math.max(0,1-(remainingMs/10000)));
  const eased=progress*progress;

  const dt=tensionLastFrame ? Math.min(50,ts-tensionLastFrame) : 16.67;
  tensionLastFrame=ts;

  // Van rustig naar sterk: ongeveer 0,65 -> 3,1 pulsen per seconde.
  const pulsesPerSecond=0.65 + eased*2.45;
  tensionPhase += (dt/1000) * pulsesPerSecond * Math.PI * 2;

  // Volledig vloeiende sinus, 0..1.
  const wave=(Math.sin(tensionPhase)+1)/2;

  // Richting 0 wordt de helderheidsuitslag sterker.
  const lightMix=(0.035 + eased*0.24) * wave;
  const darkMix=(0.025 + eased*0.25) * (1-wave);

  let background=state.question.color;
  if(wave>=0.5){
    background=mixHex(state.question.color,'white',lightMix);
  }else{
    background=mixHex(state.question.color,'black',darkMix);
  }

  const scaleAmount=0.002 + eased*0.008;
  const scale=1 + (wave-0.5)*2*scaleAmount;

  const glow=0.05 + eased*0.13;
  questionBox.style.background=background;
  questionBox.style.transform=`scale(${scale.toFixed(4)})`;
  questionBox.style.boxShadow=`0 15px 50px rgba(0,0,0,.30), 0 0 ${Math.round(12+eased*18)}px rgba(255,255,255,${(glow*wave).toFixed(3)})`;

  tensionRaf=requestAnimationFrame(renderQuestionTensionFrame);
}

function updateQuestionTension(){
  if(tensionRaf) return;
  tensionPhase=0;
  tensionLastFrame=0;
  tensionRaf=requestAnimationFrame(renderQuestionTensionFrame);
}

function clearQuestionTension(){
  if(tensionRaf){
    cancelAnimationFrame(tensionRaf);
    tensionRaf=null;
  }
  tensionPhase=0;
  tensionLastFrame=0;
  if(!questionBox) return;
  questionBox.style.transform='';
  questionBox.style.boxShadow='';
  if(state.question) questionBox.style.background=state.question.color;
}

function showQuestion(){state.phase='question';updateSettingsGear();state.question=nextQuestion();winnerView.classList.add('hidden');$$('.player-zone').forEach(z=>z.classList.add('phase-hidden'));winnerMini.textContent=state.names[state.winner];questionText.textContent=state.question.text;questionBox.style.background=state.question.color;questionBox.style.color=state.question.dark?'#111':'#fff';questionView.classList.remove('hidden');fitQuestionToOneLine();requestAnimationFrame(fitQuestionToOneLine);
  let left=state.questionSeconds;
  timerText.textContent=state.showTimer?format(left):'';
  timerText.classList.toggle('hidden',!state.showTimer);
  updateQuestionTension();
  if(state.timer)clearTimeout(state.timer);
  questionDeadline=Date.now()+left*1000;
  const tick=()=>{
    if(state.phase!=='question' || settingsPausedQuestion)return;
    const remaining=Math.max(0,Math.ceil((questionDeadline-Date.now())/1000));
    if(state.showTimer)timerText.textContent=format(remaining);
    updateQuestionTension();
    if(remaining<=0){
      questionDeadline=null;
      showTimeoutSequence();
      return;
    }
    state.timer=setTimeout(tick,250);
  };
  state.timer=setTimeout(tick,250);
}
function format(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
nextRound.onclick=()=>{if(state.phase==='question')startRound()};
function clearTimers(){if(state.timer){clearTimeout(state.timer);state.timer=null}}
function resetToSetup(){clearQuestionTension();clearTimers();hideTimeoutSequence();state.phase='setup';updateSettingsGear();game.classList.add('hidden');setup.classList.remove('hidden');state.bag=[];renderNameFields()}

window.addEventListener('resize',()=>{if(state.phase==='question')fitQuestionToOneLine()});


document.addEventListener('DOMContentLoaded',()=>{
  const versionEl=document.getElementById('appVersion');
  if(versionEl) versionEl.textContent='Versie: '+APP_VERSION;
});


// v21: defensieve startstatus
document.addEventListener('DOMContentLoaded', ()=>{
  forceCloseAllModals();
});
