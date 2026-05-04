// ============================================================
//  HRE QUIZ — SERVER  (final build with pause + tiebreaker fix)
//  node server.js
// ============================================================
const express   = require('express');
const http      = require('http');
const WebSocket = require('ws');
const os        = require('os');
const fs        = require('fs');
const questions = require('./questions');

const PORT   = 3000;
const BACKUP = __dirname + '/state-backup.json';
const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });

// ── IP ────────────────────────────────────────────────────────
function getLocalIP () {
  for (const nets of Object.values(os.networkInterfaces()))
    for (const n of nets)
      if (n.family === 'IPv4' && !n.internal) return n.address;
  return 'localhost';
}
const LOCAL_IP = getLocalIP();

// ── ROUTES ────────────────────────────────────────────────────
app.use(express.static(__dirname + '/public'));
app.get('/display', (_, r) => r.sendFile(__dirname + '/public/display.html'));
app.get('/host',    (_, r) => r.sendFile(__dirname + '/public/host.html'));
app.get('/join',    (_, r) => r.sendFile(__dirname + '/public/join.html'));
app.get('/buzzer',  (_, r) => r.sendFile(__dirname + '/public/join.html')); // legacy
app.get('/ip',      (_, r) => r.json({ ip: LOCAL_IP, port: PORT }));

// ── POOLS ─────────────────────────────────────────────────────
const pool1 = questions.filter(q => q.round === 1);
const pool2 = questions.filter(q => q.round === 2);
const pool3 = questions.filter(q => q.round === 3);

function buildCatMap (pool) {
  const m = {};
  pool.forEach((q, i) => { if (!m[q.category]) m[q.category] = []; m[q.category].push(i); });
  return m;
}

// Build RF sets: { 1: [q,q,q,...], 2: [...], ... } sorted by order
function buildRFSets () {
  const sets = {};
  pool3.forEach(q => {
    if (!sets[q.set]) sets[q.set] = [];
    sets[q.set].push(q);
  });
  Object.keys(sets).forEach(s => sets[s].sort((a, b) => a.order - b.order));
  return sets;
}
const rfSets = buildRFSets();

// ── REJOIN CODES ──────────────────────────────────────────────
const rejoinCodes = {};

function generateRejoinCode (teamId) {
  Object.keys(rejoinCodes).forEach(k => {
    if (rejoinCodes[k].teamId === teamId) delete rejoinCodes[k];
  });
  let code;
  do { code = String(Math.floor(1000 + Math.random() * 9000)); }
  while (rejoinCodes[code]);
  rejoinCodes[code] = { teamId, expires: Date.now() + 5 * 60 * 1000 };
  return code;
}

function cleanExpiredCodes () {
  const now = Date.now();
  Object.keys(rejoinCodes).forEach(k => {
    if (rejoinCodes[k].expires < now) delete rejoinCodes[k];
  });
}

// ── FRESH STATE ───────────────────────────────────────────────
function freshState () {
  return {
    phase:               'lobby',
    activeRound:         0,
    teams:               {},
    scores:              {},
    pendingScore:        {},
    teamOrder:           [],
    currentIntended:     0,
    currentQuestionTeam: 0,
    currentPasser:       0,
    passChain:           [],
    currentQ:            null,
    currentQFull:        null,
    usedR1:              [],
    usedR2:              [],
    r1Total:             40,
    r2Total:             20,
    r1Count:             0,
    r2Count:             0,
    bzAttempt:           0,
    bzLockedTeams:       [],
    bzActiveAnswerer:    null,
    bzAnsweringTeamName: null,
    splashData:          null,
    revealData:          null,
    timerEnd:            null,
    timerHandle:         null,
    anticip:             false,
    bzCountdown:         0,
    bzCountHandle:       null,
    // ── PAUSE STATE ──
    paused:              false,
    pausedTimerMs:       null,   // remaining ms on main timer when paused
    pausedTimerCb:       null,   // string key for callback: 'rrTimeout'|'bzNoBuzz'|'bzAnswer'|'bzCountdown'
    pausedBzCountdown:   0,      // bzCountdown value when paused
    pausedBzCbKey:       null,   // 'bzAnticip' | 'bzReopen' — which countdown was running
    // ── TIEBREAKER ──
    isTiebreaker:        false,
    catMap1:             buildCatMap(pool1),
    catMap2:             buildCatMap(pool2),
    // ── RAPID FIRE ──
    rfAssignment:        {},    // { teamId: setNumber }
    rfRevealedSets:      [],    // set numbers that have been flipped
    rfTeamIdx:           0,     // current team index in teamOrder
    rfQuestionIdx:       0,     // current question index within rfCurrentSet (0-5)
    rfCurrentSet:        [],    // full set of questions for active team (server-only)
    rfSkippedQ:          []     // permanently skipped question indices in current set
  };
}
let state = freshState();

// ── CLIENTS ───────────────────────────────────────────────────
const clients = new Map();

// ── SEND HELPERS ──────────────────────────────────────────────
const send   = (ws, d)  => { if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(d)); };
const toRole = (r, d)   => wss.clients.forEach(ws => { const c=clients.get(ws); if (c?.role===r) send(ws,d); });
const toTeam = (tid, d) => wss.clients.forEach(ws => { const c=clients.get(ws); if (c?.teamId===tid) send(ws,d); });
const toAll  = ()       => wss.clients.forEach(ws => {
  const c = clients.get(ws); if (!c) return;
  if      (c.role==='host')               send(ws, hostSnap());
  else if (c.role==='display')            send(ws, dispSnap());
  else if (c.role==='buzzer' && c.teamId) send(ws, buzzSnap(c.teamId));
});

// ── SNAPSHOTS ─────────────────────────────────────────────────
function remCounts () {
  const map  = state.activeRound===2 ? state.catMap2 : state.catMap1;
  const used = state.activeRound===2 ? state.usedR2  : state.usedR1;
  const o = {};
  Object.keys(map).forEach(c => { o[c]=map[c].filter(i=>!used.includes(i)).length; });
  return o;
}

function pubQ (q) {
  if (!q) return null;
  return { question:q.question, category:q.category, difficulty:q.difficulty,
           timeout:q.timeout, options:{...q.options} };
}

const hostSnap = () => ({
  type:'host_state', phase:state.phase, activeRound:state.activeRound,
  teams:state.teams, scores:state.scores, teamOrder:state.teamOrder,
  currentIntended:state.currentIntended, currentQuestionTeam:state.currentQuestionTeam,
  currentPasser:state.currentPasser, passChain:state.passChain,
  currentQ:state.currentQ,
  currentQCorrect: state.phase==='rr_answering' ? state.currentQFull?.correct : null,
  splashData:state.splashData, revealData:state.revealData,
  timerEnd:state.timerEnd, bzCountdown:state.bzCountdown,
  r1Total:state.r1Total, r2Total:state.r2Total,
  r1Count:state.r1Count, r2Count:state.r2Count,
  bzAttempt:state.bzAttempt, bzLockedTeams:state.bzLockedTeams,
  bzActiveAnswerer:state.bzActiveAnswerer, bzAnsweringTeamName:state.bzAnsweringTeamName,
  remainingCats:remCounts(), anticip:state.anticip,
  paused:state.paused, isTiebreaker:state.isTiebreaker,
  // RF
  rfAssignment:state.rfAssignment, rfRevealedSets:state.rfRevealedSets,
  rfTeamIdx:state.rfTeamIdx, rfQuestionIdx:state.rfQuestionIdx,
  rfCurrentQ: state.activeRound===3 && state.rfCurrentSet.length>0
    ? { ...state.rfCurrentSet[state.rfQuestionIdx], idx:state.rfQuestionIdx }
    : null
});

const dispSnap = () => ({
  type:'display_state', phase:state.phase, activeRound:state.activeRound,
  teams:state.teams, scores:state.scores, teamOrder:state.teamOrder,
  currentIntended:state.currentIntended, currentQuestionTeam:state.currentQuestionTeam,
  currentPasser:state.currentPasser, passChain:state.passChain,
  currentQ:state.currentQ,
  splashData:state.splashData, revealData:state.revealData,
  timerEnd:state.timerEnd, bzCountdown:state.bzCountdown,
  r1Total:state.r1Total, r2Total:state.r2Total,
  r1Count:state.r1Count, r2Count:state.r2Count,
  bzAttempt:state.bzAttempt, bzLockedTeams:state.bzLockedTeams,
  bzActiveAnswerer:state.bzActiveAnswerer, bzAnsweringTeamName:state.bzAnsweringTeamName,
  anticip:state.anticip, paused:state.paused, isTiebreaker:state.isTiebreaker,
  // RF — question visible on display during active phase
  rfAssignment:state.rfAssignment, rfRevealedSets:state.rfRevealedSets,
  rfTeamIdx:state.rfTeamIdx, rfQuestionIdx:state.rfQuestionIdx,
  rfCurrentQ: state.activeRound===3 && state.phase==='rf_active' && state.rfCurrentSet.length>0
    ? { question:state.rfCurrentSet[state.rfQuestionIdx]?.question, idx:state.rfQuestionIdx }
    : null
});

const buzzSnap = (tid) => ({
  type:'buzzer_state', phase:state.phase, activeRound:state.activeRound,
  scores:state.scores, teams:state.teams, teamOrder:state.teamOrder,
  currentQ:state.currentQ,
  myTurn:          state.teamOrder[state.currentPasser]===tid && state.phase==='rr_answering',
  intendedTeamId:  state.teamOrder[state.currentQuestionTeam],
  isIntended:      state.teamOrder[state.currentQuestionTeam]===tid,
  isActiveAnswerer:state.bzActiveAnswerer===tid,
  isLocked:        state.bzLockedTeams.includes(tid),
  bzAttempt:state.bzAttempt, bzLockedTeams:state.bzLockedTeams,
  bzActiveAnswerer:state.bzActiveAnswerer, bzAnsweringTeamName:state.bzAnsweringTeamName,
  splashData:state.splashData, revealData:state.revealData,
  timerEnd:state.timerEnd, bzCountdown:state.bzCountdown,
  anticip:state.anticip, paused:state.paused, isTiebreaker:state.isTiebreaker,
  // RF
  rfAssignment:state.rfAssignment, rfRevealedSets:state.rfRevealedSets,
  rfTeamIdx:state.rfTeamIdx, rfQuestionIdx:state.rfQuestionIdx,
  isRFActiveTeam: state.activeRound===3 && state.teamOrder[state.rfTeamIdx]===tid,
  rfCurrentQ: state.activeRound===3 && state.phase==='rf_active'
    && state.teamOrder[state.rfTeamIdx]===tid && state.rfCurrentSet.length>0
    ? { question:state.rfCurrentSet[state.rfQuestionIdx]?.question, idx:state.rfQuestionIdx }
    : null
});

// ── SCORE HELPERS ─────────────────────────────────────────────
function queueScore (teamId, delta) {
  state.pendingScore[teamId] = (state.pendingScore[teamId] || 0) + delta;
}
function applyPendingScores () {
  Object.entries(state.pendingScore).forEach(([id, delta]) => {
    state.scores[id]       = (state.scores[id] || 0) + delta;
    if (state.teams[id]) state.teams[id].score = state.scores[id];
  });
  state.pendingScore = {};
}

// ── TIMERS ────────────────────────────────────────────────────
function startTimer (secs, cb) {
  stopTimer();
  state.timerEnd    = Date.now() + secs * 1000;
  state.timerHandle = setTimeout(() => { state.timerHandle=null; cb(); }, secs * 1000);
}
function stopTimer () {
  if (state.timerHandle) { clearTimeout(state.timerHandle); state.timerHandle=null; }
  state.timerEnd = null;
}
function stopBzCountdown () {
  if (state.bzCountHandle) { clearTimeout(state.bzCountHandle); state.bzCountHandle=null; }
  state.bzCountdown = 0;
}

// ── PAUSE LOGIC ───────────────────────────────────────────────
const UNPAUSABLE = ['lobby','starting','rr_complete','bz_transition','bz_complete','rf_assign','rf_reveal','rf_between','rf_complete','finale'];

function pauseQuiz () {
  if (state.paused) return;
  if (UNPAUSABLE.includes(state.phase)) return;

  state.paused = true;

  // Capture remaining main timer ms
  if (state.timerEnd) {
    state.pausedTimerMs = Math.max(0, state.timerEnd - Date.now());
  } else {
    state.pausedTimerMs = null;
  }

  // Determine what callback to restore
  const cbMap = {
    rr_answering: 'rrTimeout',
    bz_ready:     'bzNoBuzz',
    bz_answering: 'bzAnswer',
    tiebreaker:   'bzNoBuzz',
    rf_active:    'rfTimeout'
  };
  state.pausedTimerCb = cbMap[state.phase] || null;

  // Capture countdown state
  if (state.bzCountdown > 0) {
    state.pausedBzCountdown = state.bzCountdown;
    state.pausedBzCbKey = state.phase === 'bz_anticip' ? 'bzAnticip' : 'bzReopen';
  } else {
    state.pausedBzCountdown = 0;
    state.pausedBzCbKey = null;
  }

  stopTimer();
  stopBzCountdown();
  toAll();
}

function resumeQuiz () {
  if (!state.paused) return;
  state.paused = false;

  // Restore countdown first (anticip or reopen)
  if (state.pausedBzCbKey && state.pausedBzCountdown > 0) {
    let n = state.pausedBzCountdown;
    state.bzCountdown = n;
    const isBzAnticip = state.pausedBzCbKey === 'bzAnticip';
    const tick = () => {
      n--; state.bzCountdown = n;
      if (n <= 0) { state.bzCountHandle=null; bzOpenAttempt(); }
      else { toAll(); state.bzCountHandle = setTimeout(tick, 1000); }
    };
    state.bzCountHandle = setTimeout(tick, 1000);
    state.pausedBzCbKey = null;
    state.pausedBzCountdown = 0;
    toAll();
    return;
  }

  // Restore main timer
  if (state.pausedTimerMs !== null && state.pausedTimerCb) {
    const msLeft = state.pausedTimerMs;
    const cbKey  = state.pausedTimerCb;
    state.pausedTimerMs = null;
    state.pausedTimerCb = null;

    const cbFn = () => {
      if (cbKey === 'rrTimeout')  rrOnPass(state.teamOrder[state.currentPasser], 'timeout');
      if (cbKey === 'bzNoBuzz')   bzOnNoBuzz();
      if (cbKey === 'bzAnswer')   bzOnTimeout(state.bzActiveAnswerer);
      if (cbKey === 'rfTimeout')  rfOnTimeout();
    };

    state.timerEnd    = Date.now() + msLeft;
    state.timerHandle = setTimeout(() => { state.timerHandle=null; cbFn(); }, msLeft);
    toAll();
    return;
  }

  // No timer to restore — just unpause and broadcast
  toAll();
}

// ── PERSISTENCE ───────────────────────────────────────────────
function saveState () {
  try {
    fs.writeFileSync(BACKUP, JSON.stringify({
      scores:state.scores, teams:state.teams, teamOrder:state.teamOrder,
      r1Count:state.r1Count, r2Count:state.r2Count, activeRound:state.activeRound,
      usedR1:state.usedR1, usedR2:state.usedR2, phase:state.phase
    }));
  } catch (e) { console.error('Save failed:', e.message); }
}

// ── PICK QUESTION ─────────────────────────────────────────────
function pickQ (category) {
  const pool    = state.activeRound===2 ? pool2 : pool1;
  const used    = state.activeRound===2 ? state.usedR2 : state.usedR1;
  const catMap  = state.activeRound===2 ? state.catMap2 : state.catMap1;
  const indices = (category && category !== 'Mix')
    ? (catMap[category] || []).filter(i => !used.includes(i))
    : pool.map((_, i) => i).filter(i => !used.includes(i));
  if (!indices.length) return null;
  const idx = indices[Math.floor(Math.random() * indices.length)];
  used.push(idx);
  return pool[idx];
}

// Tiebreaker pool: try pool2 unused first, then pool1 unused
function pickTiebreakerQ () {
  const unused2 = pool2.map((_,i) => i).filter(i => !state.usedR2.includes(i));
  if (unused2.length) {
    const idx = unused2[Math.floor(Math.random() * unused2.length)];
    state.usedR2.push(idx);
    return pool2[idx];
  }
  const unused1 = pool1.map((_,i) => i).filter(i => !state.usedR1.includes(i));
  if (unused1.length) {
    const idx = unused1[Math.floor(Math.random() * unused1.length)];
    state.usedR1.push(idx);
    return pool1[idx];
  }
  return null;
}

function setCurrentQ (q) {
  state.currentQFull = q;
  state.currentQ     = pubQ(q);
}

// ── ANTICIPATION ─────────────────────────────────────────────
function startAnticip (then) {
  state.anticip      = true;
  state.currentQ     = null;
  state.currentQFull = null;
  state.revealData   = null;
  toAll();
  setTimeout(() => { state.anticip=false; then(); }, 2000);
}

// ══════════════════════════════════════════════════════════════
//  ROUND ROBIN
// ══════════════════════════════════════════════════════════════
function rrServeQuestion (q, intendedIdx) {
  state.phase               = 'rr_answering';
  state.currentQuestionTeam = intendedIdx;
  state.currentPasser       = intendedIdx;
  state.passChain           = [];
  state.pendingScore        = {};
  setCurrentQ(q);
  startTimer(q.timeout, () => rrOnPass(state.teamOrder[state.currentPasser], 'timeout'));
  toAll();
  toTeam(state.teamOrder[intendedIdx], {
    type:'your_turn', question:q.question, options:q.options,
    timerEnd:state.timerEnd, timeout:q.timeout, isIntended:true, round:1
  });
  saveState();
}

function rrNextIdx (from) { return (from + 1) % state.teamOrder.length; }
function rrCheckExpiry (nextIdx) {
  return nextIdx === state.currentQuestionTeam || state.passChain.length >= state.teamOrder.length;
}
function rrMoveToNext (nextIdx) {
  state.currentPasser = nextIdx;
  state.phase         = 'rr_answering';
  startTimer(state.currentQFull.timeout, () => rrOnPass(state.teamOrder[nextIdx], 'timeout'));
  toAll();
  toTeam(state.teamOrder[nextIdx], {
    type:'your_turn', question:state.currentQFull.question, options:state.currentQFull.options,
    timerEnd:state.timerEnd, timeout:state.currentQFull.timeout, isIntended:false, round:1
  });
}

function rrOnPass (teamId, reason) {
  const teamName = state.teams[teamId]?.name || 'Team';
  const nextIdx  = rrNextIdx(state.currentPasser);
  stopTimer();
  state.passChain.push(teamId);
  const nextName = !rrCheckExpiry(nextIdx) ? state.teams[state.teamOrder[nextIdx]]?.name : null;
  state.splashData = { type: reason==='timeout' ? 'timeout_pass' : 'pass', teamName, nextTeam: nextName };
  state.phase = 'rr_reveal';
  toAll();
  setTimeout(() => {
    state.splashData = null;
    if (rrCheckExpiry(nextIdx)) { rrExpire(); return; }
    rrMoveToNext(nextIdx);
  }, 2000);
}

function rrOnWrong (teamId) {
  stopTimer();
  const isIntended = state.teamOrder[state.currentQuestionTeam] === teamId;
  const pts        = isIntended ? -5 : -3;
  const teamName   = state.teams[teamId]?.name || 'Team';
  queueScore(teamId, pts);
  state.passChain.push(teamId);
  state.phase = 'rr_answered'; state.splashData = null; state.revealData = null;
  toAll();
  setTimeout(() => {
    applyPendingScores();
    state.splashData = { type:'wrong', teamName, points:pts };
    state.phase = 'rr_reveal';
    toAll(); saveState();
    const nextIdx = rrNextIdx(state.currentPasser);
    setTimeout(() => {
      state.splashData = null;
      if (rrCheckExpiry(nextIdx)) { rrExpire(); return; }
      rrMoveToNext(nextIdx);
    }, 2500);
  }, 3000);
}

function rrOnCorrect (teamId) {
  stopTimer();
  const isIntended = state.teamOrder[state.currentQuestionTeam] === teamId;
  const pts        = isIntended ? 10 : 5;
  const teamName   = state.teams[teamId]?.name || 'Team';
  queueScore(teamId, pts);
  state.phase = 'rr_answered'; state.splashData = null; state.revealData = null;
  toAll();
  setTimeout(() => {
    applyPendingScores();
    state.splashData = { type:'correct', teamName, points:pts,
      answer:state.currentQFull.options[state.currentQFull.correct],
      correct:state.currentQFull.correct };
    state.phase = 'rr_reveal';
    toAll(); saveState();
    setTimeout(() => {
      state.splashData = null;
      state.revealData = { correct:state.currentQFull.correct,
        answerText:state.currentQFull.options[state.currentQFull.correct],
        question:state.currentQ.question, options:state.currentQ.options };
      state.phase = 'rr_reveal_answer';
      toAll();
      if (state.r1Count >= state.r1Total) setTimeout(() => autoEndRR(), 5000);
    }, 3500);
  }, 3000);
}

function rrExpire () {
  applyPendingScores();
  state.splashData = null;
  state.revealData = { correct:state.currentQFull.correct,
    answerText:state.currentQFull.options[state.currentQFull.correct],
    question:state.currentQ.question, options:state.currentQ.options };
  state.phase = 'rr_reveal_answer';
  toAll(); saveState();
  if (state.r1Count >= state.r1Total) setTimeout(() => autoEndRR(), 5000);
}

function autoEndRR () {
  state.phase = 'rr_complete'; state.splashData = null; state.revealData = null;
  toAll();
}

// ══════════════════════════════════════════════════════════════
//  BUZZER ROUND
// ══════════════════════════════════════════════════════════════
function bzLoadQuestion (q) {
  setCurrentQ(q);
  state.bzAttempt = 0; state.bzLockedTeams = [];
  state.bzActiveAnswerer = null; state.bzAnsweringTeamName = null;
  state.splashData = null; state.revealData = null; state.pendingScore = {};
  state.phase = 'bz_anticip';
  stopTimer();
  let n = 8; state.bzCountdown = n;
  toAll();
  const tick = () => {
    n--; state.bzCountdown = n;
    if (n <= 0) { state.bzCountHandle=null; bzOpenAttempt(); }
    else { toAll(); state.bzCountHandle=setTimeout(tick, 1000); }
  };
  state.bzCountHandle = setTimeout(tick, 1000);
}

function bzOpenAttempt () {
  state.bzAttempt++;
  state.bzActiveAnswerer = null; state.bzAnsweringTeamName = null; state.bzCountdown = 0;
  const eligible = state.teamOrder.filter(id => !state.bzLockedTeams.includes(id));
  if (!eligible.length) { bzExpire(); return; }
  state.phase = 'bz_ready';
  startTimer(30, () => bzOnNoBuzz());
  toAll();
}

function bzOnNoBuzz () {
  stopTimer(); applyPendingScores();
  state.splashData = { type:'no_buzz', message:'Nobody buzzed — question expired' };
  state.phase = 'bz_reveal';
  toAll();
  setTimeout(() => {
    state.splashData = null;
    if (state.isTiebreaker) { state.isTiebreaker=false; state.phase='finale'; toAll(); return; }
    bzExpire();
  }, 2500);
}

function bzOnBuzz (teamId) {
  stopTimer();
  state.bzActiveAnswerer = teamId;
  state.bzAnsweringTeamName = state.teams[teamId]?.name || 'Team';
  state.phase = 'bz_answering';
  startTimer(30, () => bzOnTimeout(teamId));
  toAll();
  toTeam(teamId, { type:'your_turn', question:state.currentQFull.question,
    options:state.currentQFull.options, timerEnd:state.timerEnd, timeout:30, isIntended:true, round:2 });
}

function bzOnTimeout (teamId) {
  stopTimer();
  const teamName = state.teams[teamId]?.name || 'Team';
  queueScore(teamId, -5);
  state.bzLockedTeams = [...state.bzLockedTeams, teamId];
  state.bzActiveAnswerer = null; state.bzAnsweringTeamName = null;
  state.phase = 'bz_answered'; state.splashData = null;
  toAll();
  setTimeout(() => {
    applyPendingScores();
    state.splashData = { type:'timeout_bz', teamName, points:-5 };
    state.phase = 'bz_reveal';
    toAll(); saveState();
    setTimeout(() => { state.splashData=null; bzNextAttemptOrExpire(); }, 2500);
  }, 3000);
}

function bzOnWrong (teamId) {
  stopTimer();
  const teamName = state.teams[teamId]?.name || 'Team';
  queueScore(teamId, -5);
  state.bzLockedTeams = [...state.bzLockedTeams, teamId];
  state.bzActiveAnswerer = null; state.bzAnsweringTeamName = null;
  state.phase = 'bz_answered'; state.splashData = null;
  toAll();
  setTimeout(() => {
    applyPendingScores();
    state.splashData = { type:'wrong', teamName, points:-5 };
    state.phase = 'bz_reveal';
    toAll(); saveState();
    setTimeout(() => { state.splashData=null; bzNextAttemptOrExpire(); }, 2500);
  }, 3000);
}

function bzOnCorrect (teamId) {
  stopTimer();
  const teamName = state.teams[teamId]?.name || 'Team';
  queueScore(teamId, 10);
  state.bzActiveAnswerer = null; state.bzAnsweringTeamName = null;
  state.phase = 'bz_answered'; state.splashData = null;
  toAll();
  setTimeout(() => {
    applyPendingScores();
    state.splashData = { type:'correct', teamName, points:10,
      answer:state.currentQFull.options[state.currentQFull.correct],
      correct:state.currentQFull.correct };
    state.phase = 'bz_reveal';
    toAll(); saveState();
    setTimeout(() => {
      state.splashData = null;
      state.revealData = { correct:state.currentQFull.correct,
        answerText:state.currentQFull.options[state.currentQFull.correct],
        question:state.currentQ.question, options:state.currentQ.options };
      // Tiebreaker correct → go straight to finale
      if (state.isTiebreaker) {
        state.isTiebreaker = false;
        state.phase = 'finale';
        toAll(); return;
      }
      state.phase = 'bz_reveal_answer';
      toAll();
      if (state.r2Count >= state.r2Total) setTimeout(() => autoEndBZ(), 5000);
    }, 3500);
  }, 3000);
}

function bzNextAttemptOrExpire () {
  const eligible = state.teamOrder.filter(id => !state.bzLockedTeams.includes(id));
  if (state.bzAttempt >= 3 || !eligible.length) { bzExpire(); return; }
  stopBzCountdown();
  state.phase = 'bz_reopen'; state.bzCountdown = 4;
  toAll();
  let n = 4;
  const tick = () => {
    n--; state.bzCountdown = n;
    if (n <= 0) { state.bzCountHandle=null; bzOpenAttempt(); }
    else { toAll(); state.bzCountHandle=setTimeout(tick, 1000); }
  };
  state.bzCountHandle = setTimeout(tick, 1000);
}

function bzExpire () {
  stopBzCountdown(); stopTimer(); applyPendingScores();
  state.bzActiveAnswerer = null; state.bzAnsweringTeamName = null;
  state.splashData = null;
  state.revealData = { correct:state.currentQFull.correct,
    answerText:state.currentQFull.options[state.currentQFull.correct],
    question:state.currentQ.question, options:state.currentQ.options };
  // Tiebreaker expired → back to finale
  if (state.isTiebreaker) {
    state.isTiebreaker = false;
    state.phase = 'finale'; toAll(); saveState(); return;
  }
  state.phase = 'bz_reveal_answer';
  toAll(); saveState();
  if (state.r2Count >= state.r2Total) setTimeout(() => autoEndBZ(), 5000);
}

function autoEndBZ () {
  state.phase = 'bz_complete'; state.splashData = null; state.revealData = null;
  toAll();
}

// ══════════════════════════════════════════════════════════════
//  RAPID FIRE ROUND
// ══════════════════════════════════════════════════════════════

// Assign sets to teams in teamOrder order (wraps if fewer sets than teams)
function rfAssignSets () {
  const setNums = Object.keys(rfSets).map(Number).sort((a, b) => a - b);
  state.rfAssignment = {};
  state.teamOrder.forEach((tid, i) => {
    state.rfAssignment[tid] = setNums[i % setNums.length];
  });
  state.rfRevealedSets = [];
  state.rfTeamIdx      = 0;
  state.rfQuestionIdx  = 0;
  state.rfCurrentSet   = [];
  state.rfSkippedQ     = [];
}

function rfFlipCard (setNumber) {
  if (!state.rfRevealedSets.includes(setNumber)) {
    state.rfRevealedSets = [...state.rfRevealedSets, setNumber];
  }
  const assignedSets = Object.values(state.rfAssignment);
  const allRevealed  = assignedSets.every(s => state.rfRevealedSets.includes(s));
  state.phase = allRevealed ? 'rf_setup' : 'rf_reveal';
  toAll();
}

function rfFlipAll () {
  state.rfRevealedSets = [...new Set(Object.values(state.rfAssignment))];
  state.phase = 'rf_setup';
  toAll();
}

function rfBeginTurn () {
  const tid    = state.teamOrder[state.rfTeamIdx];
  const setNum = state.rfAssignment[tid];
  state.rfCurrentSet  = rfSets[setNum] ? [...rfSets[setNum]] : [];
  state.rfQuestionIdx = 0;
  state.rfSkippedQ    = [];
  state.phase         = 'rf_active';
  startTimer(60, rfOnTimeout);
  toAll();
  toTeam(tid, { type:'rf_your_turn',
    question: state.rfCurrentSet[0]?.question || '',
    questionIdx: 0, timerEnd: state.timerEnd });
  saveState();
}

function rfActiveQuestion () {
  const tid = state.teamOrder[state.rfTeamIdx];
  const q   = state.rfCurrentSet[state.rfQuestionIdx];
  toAll();
  if (state.phase === 'rf_active') {
    toTeam(tid, { type:'rf_your_turn',
      question: q?.question || '',
      questionIdx: state.rfQuestionIdx, timerEnd: state.timerEnd });
  }
}

function rfOnCorrect () {
  if (state.phase !== 'rf_active') return;
  const tid = state.teamOrder[state.rfTeamIdx];
  state.scores[tid] = (state.scores[tid] || 0) + 10;
  if (state.teams[tid]) state.teams[tid].score = state.scores[tid];
  saveState();
  rfAdvanceQuestion();
}

function rfOnPassQ () {
  if (state.phase !== 'rf_active') return;
  rfAdvanceQuestion();
}

function rfAdvanceQuestion () {
  let next = state.rfQuestionIdx + 1;
  while (next < 6 && state.rfSkippedQ.includes(next)) next++;
  if (next >= 6) { rfEndTurn(); return; }
  state.rfQuestionIdx = next;
  rfActiveQuestion();
}

function rfOnTimeout () {
  if (state.phase !== 'rf_active') return;
  stopTimer();
  rfEndTurn();
}

function rfEndTurn () {
  stopTimer();
  const assignedTeams = state.teamOrder.filter(tid => state.rfAssignment[tid] != null);
  const nextIdx       = state.rfTeamIdx + 1;
  state.rfCurrentSet  = [];
  state.rfSkippedQ    = [];
  if (nextIdx >= assignedTeams.length) {
    state.phase = 'rf_complete';
  } else {
    state.rfTeamIdx     = nextIdx;
    state.rfQuestionIdx = 0;
    state.phase         = 'rf_between';
  }
  toAll();
  saveState();
}

// ── ROUND SWITCHER ────────────────────────────────────────────
function switchToRound (round) {
  stopTimer(); stopBzCountdown();
  state.splashData = null; state.revealData = null;
  state.anticip    = false; state.currentQ = null; state.currentQFull = null;
  if (round === 1) {
    state.activeRound = 1;
    state.phase       = 'rr_setup';
    state.currentIntended = 0; state.currentQuestionTeam = 0;
    state.currentPasser   = 0; state.passChain = [];
  } else if (round === 2) {
    state.activeRound = 2;
    state.phase       = 'bz_setup';
    state.bzAttempt   = 0; state.bzLockedTeams = [];
    state.bzActiveAnswerer = null; state.bzAnsweringTeamName = null;
  } else if (round === 3) {
    state.activeRound = 3;
    if (!Object.keys(state.rfAssignment).length) rfAssignSets();
    state.phase = 'rf_assign';
  }
  toAll();
}

// ── FULL RESET ────────────────────────────────────────────────
function fullReset () {
  stopTimer(); stopBzCountdown();
  Object.keys(rejoinCodes).forEach(k => delete rejoinCodes[k]);
  wss.clients.forEach(ws => {
    const c = clients.get(ws);
    if (c?.role === 'buzzer') { send(ws, { type:'force_rejoin' }); c.teamId=null; c.teamName=null; }
  });
  try { if (fs.existsSync(BACKUP)) fs.unlinkSync(BACKUP); } catch {}
  state = freshState();
  toAll();
}

// ── WEBSOCKET ─────────────────────────────────────────────────
wss.on('connection', ws => {
  clients.set(ws, { role:null, teamId:null, teamName:null });

  ws.on('message', raw => {
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    const c = clients.get(ws);

    switch (msg.type) {

      // Host adds a team directly during pause
      case 'identify_host_add_team': {
        if (c.role !== 'host') break;
        if (!state.paused && !['lobby','rr_setup','bz_setup','rr_complete','bz_complete'].includes(state.phase)) break;
        const teamId   = 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        const teamName = (msg.teamName || 'Team').trim().slice(0, 20);
        state.teams[teamId]  = { name:teamName, score:0, connected:false };
        state.scores[teamId] = 0;
        if (!state.teamOrder.includes(teamId)) state.teamOrder.push(teamId);
        send(ws, { type:'team_added', teamId, teamName });
        toAll();
        break;
      }

      case 'ping': send(ws, { type:'pong' }); break;

      case 'identify_host':
        c.role = 'host'; send(ws, hostSnap());
        if (fs.existsSync(BACKUP)) send(ws, { type:'backup_available' });
        break;

      case 'identify_display':
        c.role = 'display'; send(ws, dispSnap()); break;

      case 'validate_identity': {
        const tid = msg.teamId;
        if (tid && state.teams[tid]) {
          c.role='buzzer'; c.teamId=tid; c.teamName=state.teams[tid].name;
          state.teams[tid].connected = true;
          send(ws, { type:'identity_valid', teamId:tid, teamName:state.teams[tid].name });
          send(ws, buzzSnap(tid));
          toRole('host', hostSnap()); toRole('display', dispSnap());
        } else { send(ws, { type:'force_rejoin' }); }
        break;
      }

      case 'identify_buzzer': {
        // Allow joining during pause or normal entry phases
        const canJoin = ['lobby','rr_setup','bz_setup','rr_complete','bz_complete'].includes(state.phase)
                      || state.paused;
        if (!canJoin) { send(ws, { type:'quiz_in_progress' }); break; }
        const teamId   = 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        const teamName = (msg.teamName || 'Team').trim().slice(0, 20);
        c.role='buzzer'; c.teamId=teamId; c.teamName=teamName;
        state.teams[teamId]  = { name:teamName, score:0, connected:true };
        state.scores[teamId] = 0;
        if (!state.teamOrder.includes(teamId)) state.teamOrder.push(teamId);
        send(ws, { type:'identified', teamId, teamName });
        send(ws, buzzSnap(teamId));
        toRole('host', hostSnap()); toRole('display', dispSnap());
        break;
      }

      case 'generate_rejoin': {
        if (c.role !== 'host') break;
        const tid = msg.teamId;
        if (!state.teams[tid]) break;
        cleanExpiredCodes();
        const code = generateRejoinCode(tid);
        send(ws, { type:'rejoin_code', teamId:tid, code });
        break;
      }

      case 'use_rejoin': {
        cleanExpiredCodes();
        const code = String(msg.code || '').trim();
        const entry = rejoinCodes[code];
        if (!entry || entry.expires < Date.now()) {
          send(ws, { type:'rejoin_failed', reason:'Invalid or expired code.' }); break;
        }
        const tid = entry.teamId;
        if (!state.teams[tid]) { send(ws, { type:'rejoin_failed', reason:'Team no longer exists.' }); break; }
        delete rejoinCodes[code];
        c.role='buzzer'; c.teamId=tid; c.teamName=state.teams[tid].name;
        state.teams[tid].connected = true;
        send(ws, { type:'identity_valid', teamId:tid, teamName:state.teams[tid].name });
        send(ws, buzzSnap(tid));
        toRole('host', hostSnap()); toRole('display', dispSnap());
        console.log(`  [Rejoin] ${state.teams[tid].name} rejoined via code ${code}`);
        break;
      }

      // ── HOST: PAUSE / RESUME ──
      case 'pause_quiz':
        if (c.role !== 'host') break;
        pauseQuiz(); break;

      case 'resume_quiz':
        if (c.role !== 'host') break;
        resumeQuiz(); break;

      // ── HOST: LOBBY ──
      case 'start_quiz':
        if (c.role !== 'host') break;
        state.phase = 'starting'; toAll(); break;

      case 'update_team_order':
        if (c.role !== 'host') break;
        state.teamOrder = msg.order; toAll(); break;

      case 'rename_team':
        if (c.role !== 'host' || !state.teams[msg.teamId]) break;
        state.teams[msg.teamId].name = msg.name.trim().slice(0, 20); toAll(); break;

      case 'remove_team':
        if (c.role !== 'host') break;
        // Only allow removal during lobby/setup or when paused
        if (!['lobby','rr_setup','bz_setup'].includes(state.phase) && !state.paused) break;
        delete state.teams[msg.teamId]; delete state.scores[msg.teamId];
        state.teamOrder = state.teamOrder.filter(id => id !== msg.teamId); toAll(); break;

      case 'set_score_override': {
        // Host can manually adjust a team score during pause
        if (c.role !== 'host' || !state.paused) break;
        const { teamId, score } = msg;
        if (!state.teams[teamId]) break;
        const parsed = parseInt(score);
        if (isNaN(parsed)) break;
        state.scores[teamId] = parsed;
        state.teams[teamId].score = parsed;
        toAll(); break;
      }

      // ── HOST: ROUND ROBIN ──
      case 'start_rr':
        if (c.role !== 'host') break;
        state.phase='rr_setup'; state.activeRound=1;
        state.currentIntended=0; state.currentQuestionTeam=0;
        state.currentPasser=0; state.r1Count=0;
        toAll(); break;

      case 'next_rr_question': {
        if (c.role !== 'host') break;
        if (state.paused || state.anticip || state.phase === 'rr_answering') break;
        if (state.r1Count >= state.r1Total) { send(ws, { type:'error', message:'Round Robin complete.' }); break; }
        const q = pickQ(msg.category || null);
        if (!q) { send(ws, { type:'error', message:'No questions left in that category.' }); break; }
        state.r1Count++;
        state.splashData = null;
        const intIdx = state.currentIntended;
        state.currentPasser   = intIdx;
        state.currentIntended = rrNextIdx(state.currentIntended);
        startAnticip(() => rrServeQuestion(q, intIdx));
        break;
      }

      case 'rr_mark_correct':
        if (c.role !== 'host' || state.phase !== 'rr_answering' || state.paused) break;
        rrOnCorrect(state.teamOrder[state.currentPasser]); break;

      case 'rr_mark_wrong':
        if (c.role !== 'host' || state.phase !== 'rr_answering' || state.paused) break;
        rrOnWrong(state.teamOrder[state.currentPasser]); break;

      case 'rr_mark_pass':
        if (c.role !== 'host' || state.phase !== 'rr_answering' || state.paused) break;
        rrOnPass(state.teamOrder[state.currentPasser], 'pass'); break;

      case 'host_rr_submit': {
        if (c.role !== 'host' || state.phase !== 'rr_answering' || state.paused) break;
        const teamId = state.teamOrder[state.currentPasser];
        if (msg.answer === state.currentQFull?.correct) rrOnCorrect(teamId);
        else rrOnWrong(teamId);
        break;
      }

      case 'rr_skip_timer':
        if (c.role !== 'host' || state.paused) break;
        stopTimer(); toAll(); break;

      case 'set_r1_total':
        if (c.role !== 'host') break;
        state.r1Total = Math.max(state.r1Count, Math.min(pool1.length, parseInt(msg.total) || state.r1Total));
        toAll(); break;

      case 'advance_to_bz':
        if (c.role !== 'host') break;
        state.phase = 'bz_transition'; toAll();
        setTimeout(() => {
          state.phase='bz_setup'; state.activeRound=2;
          state.r2Count=0; state.currentQ=null; state.currentQFull=null;
          toAll();
        }, 3500);
        break;

      // ── HOST: BUZZER ROUND ──
      case 'next_bz_question': {
        if (c.role !== 'host' || state.paused) break;
        if (state.r2Count >= state.r2Total) { send(ws, { type:'error', message:'Buzzer Round complete.' }); break; }
        const q = pickQ(msg.category || null);
        if (!q) { send(ws, { type:'error', message:'No questions left in that category.' }); break; }
        state.r2Count++;
        stopBzCountdown();
        bzLoadQuestion(q);
        break;
      }

      case 'set_r2_total':
        if (c.role !== 'host') break;
        state.r2Total = Math.max(state.r2Count, Math.min(pool2.length, parseInt(msg.total) || state.r2Total));
        toAll(); break;

      case 'bz_mark_correct':
        if (c.role !== 'host' || !state.bzActiveAnswerer || state.phase !== 'bz_answering' || state.paused) break;
        bzOnCorrect(state.bzActiveAnswerer); break;

      case 'bz_mark_wrong':
        if (c.role !== 'host' || !state.bzActiveAnswerer || state.phase !== 'bz_answering' || state.paused) break;
        bzOnWrong(state.bzActiveAnswerer); break;

      case 'bz_skip_timer':
        if (c.role !== 'host' || state.paused) break;
        stopTimer(); toAll(); break;

      // ── HOST: END ──
      case 'end_event':
        if (c.role !== 'host') break;
        stopTimer(); state.phase = 'finale'; toAll(); break;

      case 'advance_to_finale':
        if (c.role !== 'host') break;
        state.phase = 'finale'; toAll(); break;

      case 'start_tiebreaker': {
        if (c.role !== 'host') break;
        const q = pickTiebreakerQ();
        if (!q) { send(ws, { type:'error', message:'No questions left for tiebreaker.' }); break; }
        state.isTiebreaker = true;
        stopTimer(); stopBzCountdown();
        state.bzAttempt=0; state.bzLockedTeams=[];
        state.bzActiveAnswerer=null; state.bzAnsweringTeamName=null;
        state.splashData=null; state.revealData=null; state.pendingScore={};
        // Use bzLoadQuestion for proper 8s prep countdown
        bzLoadQuestion(q);
        // Override phase label for tiebreaker context
        state.phase = 'tiebreaker';
        toAll(); break;
      }

      case 'reset_all':
        if (c.role !== 'host') break;
        fullReset(); break;

      // ── TEAM ACTIONS ──
      case 'rr_submit': {
        if (c.role !== 'buzzer' || state.phase !== 'rr_answering' || state.paused) break;
        if (state.teamOrder[state.currentPasser] !== c.teamId) break;
        if (msg.answer === state.currentQFull?.correct) rrOnCorrect(c.teamId);
        else rrOnWrong(c.teamId);
        break;
      }

      case 'rr_pass': {
        if (c.role !== 'buzzer' || state.phase !== 'rr_answering' || state.paused) break;
        if (state.teamOrder[state.currentPasser] !== c.teamId) break;
        rrOnPass(c.teamId, 'pass');
        break;
      }

      case 'buzz': {
        if (c.role !== 'buzzer' || state.paused) break;
        if (state.phase !== 'bz_ready' && state.phase !== 'tiebreaker') break;
        if (state.bzLockedTeams.includes(c.teamId)) break;
        if (state.bzActiveAnswerer) break;
        bzOnBuzz(c.teamId);
        break;
      }

      case 'bz_submit': {
        if (c.role !== 'buzzer' || state.phase !== 'bz_answering' || state.paused) break;
        if (c.teamId !== state.bzActiveAnswerer) break;
        if (msg.answer === state.currentQFull?.correct) bzOnCorrect(c.teamId);
        else bzOnWrong(c.teamId);
        break;
      }

      // ── HOST: ROUND SWITCHER ──
      case 'switch_to_rr':
        if (c.role !== 'host') break;
        switchToRound(1); break;

      case 'switch_to_bz':
        if (c.role !== 'host') break;
        switchToRound(2); break;

      case 'switch_to_rf':
        if (c.role !== 'host') break;
        switchToRound(3); break;

      // ── HOST: SKIP CURRENT QUESTION ──
      case 'skip_question': {
        if (c.role !== 'host') break;
        if (state.phase === 'rr_answering') {
          // Mark used, skip without score, expiry behaviour
          stopTimer(); rrExpire();
        } else if (state.phase === 'bz_answering' || state.phase === 'bz_ready') {
          stopTimer(); stopBzCountdown(); bzExpire();
        } else if (state.phase === 'rf_active') {
          state.rfSkippedQ = [...state.rfSkippedQ, state.rfQuestionIdx];
          rfAdvanceQuestion();
        }
        break;
      }

      // ── HOST: RAPID FIRE ──
      case 'advance_to_rf':
        if (c.role !== 'host') break;
        switchToRound(3); break;

      case 'rf_flip_card': {
        if (c.role !== 'host') break;
        if (!['rf_assign','rf_reveal'].includes(state.phase)) break;
        const sn = Number(msg.setNumber);
        if (!rfSets[sn]) break;
        rfFlipCard(sn);
        break;
      }

      case 'rf_flip_all':
        if (c.role !== 'host') break;
        if (!['rf_assign','rf_reveal'].includes(state.phase)) break;
        rfFlipAll(); break;

      case 'rf_begin':
        if (c.role !== 'host' || state.phase !== 'rf_setup') break;
        rfBeginTurn(); break;

      case 'rf_start_team':
        if (c.role !== 'host' || state.phase !== 'rf_between') break;
        rfBeginTurn(); break;

      case 'rf_correct':
        if (c.role !== 'host' || state.phase !== 'rf_active' || state.paused) break;
        rfOnCorrect(); break;

      case 'rf_pass':
        if (state.paused) break;
        if (state.phase !== 'rf_active') break;
        if (c.role === 'host') { rfOnPassQ(); break; }
        // Team pass — only active RF team
        if (c.role === 'buzzer' && state.teamOrder[state.rfTeamIdx] === c.teamId) {
          rfOnPassQ();
        }
        break;
    }
  });

  ws.on('close', () => {
    const c = clients.get(ws);
    if (c?.teamId && state.teams[c.teamId]) {
      state.teams[c.teamId].connected = false;
      toRole('host', hostSnap()); toRole('display', dispSnap());
    }
    clients.delete(ws);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║         HRE QUIZ — SERVER RUNNING            ║');
  console.log('  ║                                              ║');
  console.log(`  ║  Display : http://localhost:${PORT}/display     ║`);
  console.log(`  ║  Host    : http://localhost:${PORT}/host        ║`);
  console.log(`  ║  Join    : http://${LOCAL_IP}:${PORT}/join`);
  console.log('  ║                                              ║');
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');
  if (fs.existsSync(BACKUP)) console.log('  [!] Previous session backup found.');
});
