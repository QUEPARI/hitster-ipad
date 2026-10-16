const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
function run(file, count) {
  let now=10000, timerId=0;const tasks=new Map(),events={};
  const elements = new Map();
  function el(key) {
    if (elements.has(key)) return elements.get(key);
    const classes = new Set(['#game', '#questionView', '#winnerView'].includes(key) ? ['hidden'] : []);
    const e = { value: key === '#questionSeconds' ? '30' : '', checked: true, dataset: {}, style: {setProperty(){}},
      classList: { add: (...xs) => xs.forEach(x => classes.add(x)), remove: (...xs) => xs.forEach(x => classes.delete(x)), contains: x => classes.has(x), toggle: (x, on) => { if(on) classes.add(x); else classes.delete(x); } },
      addEventListener() {}, appendChild() {}, querySelector: () => el(key + '/input') };
    elements.set(key, e); return e;
  }
  const zones = Array.from({length:4}, (_,i) => el('zone'+i));
  const inputs = Array.from({length:4}, (_,i) => {const e=el('#nameFields input:nth-child('+(i+1)+')');e.value='Naam '+(i+1);return e;});
  const document = {querySelector: el, querySelectorAll: s => s === '.player-zone' ? zones : s === '#nameFields input' ? inputs : [], getElementById: id => el('#'+id), createElement: () => el('created'+Math.random()), addEventListener() {}, documentElement:{setAttribute(){}},body:el('body')};
  const ctx = vm.createContext({document,window:{addEventListener:(n,f)=>events[n]=f},Date:{now:()=>now},setTimeout:(f,ms)=>{tasks.set(++timerId,{f,ms});return timerId},clearTimeout:id=>tasks.delete(id),requestAnimationFrame:()=>1,cancelAnimationFrame(){},getComputedStyle:()=>({paddingLeft:'0',paddingRight:'0',fontSize:'20'})});
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
  vm.runInContext('state.count='+count,ctx);
  vm.runInContext('startGameSafely()',ctx);
  assert.equal(vm.runInContext('state.phase',ctx),'open');
  assert(el('#setup').classList.contains('hidden'));
  assert(!el('#game').classList.contains('hidden'));
  assert.equal(vm.runInContext('state.names[0]',ctx),'Naam 1');
  vm.runInContext('chooseWinner(0); showQuestion()',ctx);
  assert.equal(vm.runInContext('state.phase',ctx),'question');
  assert.equal(vm.runInContext('state.winnerSeconds',ctx),2);
  assert.equal(vm.runInContext('state.questionSeconds',ctx),30);
  vm.runInContext('pauseQuestionForSettings(); resumeQuestionAfterSettings(); resetToSetup()',ctx);
  assert.equal(vm.runInContext('state.phase',ctx),'setup');
  return {ctx,el,events,tasks,setTime:t=>now=t,eval:s=>vm.runInContext(s,ctx)};
}


const file=__dirname+'/app.js';
for(const count of [2,3,4]) run(file,count);
const a=run(file,4);
a.eval('startGameSafely(); chooseWinner(0); showQuestion(); pauseQuestionForSettings(); resumeQuestionAfterSettings()');
a.setTime(41000);a.tasks.get(a.eval('state.timer')).f();
assert.equal(a.eval('state.phase'),'timeout');
assert(!a.el('#timeUpText').classList.contains('hidden'));
assert.equal(a.tasks.get(a.eval('state.timer')).ms,1500);
a.tasks.get(a.eval('state.timer')).f();assert.equal(a.eval('state.phase'),'open');
const zero=run(file,4);zero.eval('startGameSafely(); chooseWinner(0); showQuestion()');zero.setTime(41000);
zero.eval('pauseQuestionForSettings(); resumeQuestionAfterSettings()');assert.equal(zero.eval('state.phase'),'timeout');
const b=run(file,4);b.eval('startGameSafely(); chooseWinner(0); showQuestion()');
b.setTime(20000);b.el('#settingsGear').onclick();b.setTime(100000);b.events.pageshow();
assert(b.el('#settingsModal').classList.contains('hidden'));assert.equal(b.eval('settingsPausedQuestion'),false);
assert.equal(b.eval('questionDeadline'),120000);assert(b.tasks.has(b.eval('state.timer')));
b.setTime(120000);b.tasks.get(b.eval('state.timer')).f();assert.equal(b.eval('state.phase'),'timeout');
const c=run(file,4);
for(const [input,expected] of [['999',300],['300',300],['5',5],['-1',5],['0',5],['',30],['Infinity',30],['abc',30],['12.6',13]]) {
 c.el('#questionSeconds').value=input;c.eval('syncSettings()');assert.equal(c.eval('state.questionSeconds'),expected);assert.equal(c.el('#questionSeconds').value,String(expected));
}
console.log('PASS: baseline 2/3/4 players, resumed expiry + 1.5s timeout, zero remaining, pageshow preserves paused time and resumes, input bounds/default/rounding. Mocked DOM, no device test.');
