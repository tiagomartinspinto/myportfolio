/* ============================================================
   Pocket Manager — a pocket football manager inspired by Elifoot
   Vanilla JS, no dependencies. State persists in localStorage.
   ============================================================ */
(() => {
  'use strict';

  const SAVE_KEY = 'pocketManager.save.v1';

  /* ---------- Small utilities ---------- */
  const rnd = () => Math.random();
  const randInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const round0 = (v) => Math.round(v);
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  let _id = 1;
  const uid = () => _id++;

  const fmtMoney = (n) => {
    const sign = n < 0 ? '-' : '';
    const a = Math.abs(n);
    if (a >= 1e6) return `${sign}€${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M`;
    if (a >= 1e3) return `${sign}€${Math.round(a / 1e3)}k`;
    return `${sign}€${a}`;
  };

  /* Poisson sampler (Knuth) for match goals */
  const poisson = (lambda) => {
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  };

  /* ---------- Name & club data ---------- */
  const FIRST = ['Tiago','João','Bruno','Diogo','Rui','André','Pedro','Miguel','Luís','Hugo',
    'Marco','Nuno','Ricardo','Carlos','Fábio','Gonçalo','Tomás','Eduardo','Rafael','Vitor',
    'Leo','Marcus','Ivan','Sergei','Karim','Yuki','Diego','Mateo','Noah','Liam','Omar','Kai'];
  const LAST = ['Silva','Santos','Ferreira','Costa','Pereira','Oliveira','Martins','Sousa','Rocha',
    'Carvalho','Gomes','Lopes','Marques','Almeida','Ribeiro','Pinto','Mendes','Nunes','Cardoso',
    'Moreira','Fonseca','Vieira','Barros','Reis','Antunes','Coelho','Faria','Cruz','Tavares','Neto'];
  const CLUBS = [
    { name: 'Estrela FC',        short: 'EST', color: '#e63946' },
    { name: 'Atlético Mar',      short: 'ATM', color: '#457b9d' },
    { name: 'União Norte',       short: 'UNO', color: '#2a9d8f' },
    { name: 'Real Aurora',       short: 'AUR', color: '#9b5de5' },
    { name: 'Sporting Vale',     short: 'SPV', color: '#f4a261' },
    { name: 'Dínamo Cidade',     short: 'DIN', color: '#06d6a0' },
    { name: 'Académica Sul',     short: 'ACS', color: '#118ab2' },
    { name: 'Os Leões',          short: 'LEO', color: '#ffd166' },
    { name: 'Ferroviária',       short: 'FER', color: '#ef476f' },
    { name: 'Boavista Velha',    short: 'BOA', color: '#8ecae6' },
  ];

  const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];
  const FORMATIONS = {
    '4-4-2': { DEF: 4, MID: 4, FWD: 2 },
    '4-3-3': { DEF: 4, MID: 3, FWD: 3 },
    '3-5-2': { DEF: 3, MID: 5, FWD: 2 },
    '5-3-2': { DEF: 5, MID: 3, FWD: 2 },
    '4-5-1': { DEF: 4, MID: 5, FWD: 1 },
  };
  const MENTALITIES = ['Defensive', 'Balanced', 'Attacking'];

  /* ---------- Player / squad generation ---------- */
  function makePlayer(pos, base) {
    const skill = clamp(round0(base + randInt(-12, 12)), 30, 96);
    const age = randInt(17, 35);
    return {
      id: uid(),
      name: `${pick(FIRST)} ${pick(LAST)}`,
      pos,
      skill,
      age,
      energy: 100,
      value: playerValue(skill, age),
      goals: 0,
    };
  }

  function playerValue(skill, age) {
    // Value rises steeply with skill, peaks around age 25.
    const ageFactor = 1 - Math.abs(age - 25) * 0.035;
    const base = Math.pow(skill / 50, 3.2) * 850000;
    return Math.max(40000, round0(base * clamp(ageFactor, 0.45, 1) / 10000) * 10000);
  }

  function makeSquad(strength) {
    // strength 1..5 -> base skill
    const base = 44 + strength * 8;
    const squad = [];
    const plan = { GK: 2, DEF: 6, MID: 6, FWD: 4 };
    for (const pos of POSITIONS) {
      for (let i = 0; i < plan[pos]; i++) squad.push(makePlayer(pos, base));
    }
    return squad;
  }

  function teamStrengthOf(squad) {
    const top11 = squad.slice().sort((a, b) => b.skill - a.skill).slice(0, 11);
    return top11.reduce((s, p) => s + p.skill, 0) / 11;
  }

  /* ---------- League / fixtures ---------- */
  function generateFixtures(teamIds) {
    // Double round-robin (circle method).
    let ids = teamIds.slice();
    if (ids.length % 2 !== 0) ids.push(null); // bye
    const n = ids.length;
    const rounds = [];
    const half = n / 2;
    let arr = ids.slice();
    for (let r = 0; r < n - 1; r++) {
      const pairings = [];
      for (let i = 0; i < half; i++) {
        const a = arr[i], b = arr[n - 1 - i];
        if (a !== null && b !== null) {
          // alternate home/away for fairness
          pairings.push(r % 2 === 0 ? [a, b] : [b, a]);
        }
      }
      rounds.push(pairings);
      // rotate (fix first element)
      arr = [arr[0], arr[n - 1], ...arr.slice(1, n - 1)];
    }
    // Second leg with reversed venues
    const second = rounds.map((rd) => rd.map(([a, b]) => [b, a]));
    return rounds.concat(second).map((pairings, i) => ({
      round: i + 1,
      matches: pairings.map(([home, away]) => ({ home, away, played: false, hg: 0, ag: 0 })),
    }));
  }

  function freshTable(teams) {
    const t = {};
    for (const tm of teams) {
      t[tm.id] = { id: tm.id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    }
    return t;
  }

  function standingsArray(state) {
    const arr = Object.values(state.table).map((r) => {
      const team = state.teams.find((t) => t.id === r.id);
      return { ...r, name: team.name, short: team.short, color: team.color, gd: r.gf - r.ga };
    });
    arr.sort((a, b) =>
      b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name));
    return arr;
  }

  function clubPosition(state) {
    return standingsArray(state).findIndex((r) => r.id === state.clubId) + 1;
  }

  /* ---------- Lineup selection ---------- */
  function effectiveSkill(p) {
    return p.skill * (0.55 + 0.45 * (p.energy / 100));
  }

  function autoLineup(squad, formation) {
    const need = FORMATIONS[formation];
    const byPos = (pos) =>
      squad.filter((p) => p.pos === pos).sort((a, b) => effectiveSkill(b) - effectiveSkill(a));
    const lineup = [];
    const used = new Set();

    const take = (pos, count) => {
      const pool = byPos(pos).filter((p) => !used.has(p.id));
      for (let i = 0; i < count && i < pool.length; i++) {
        lineup.push(pool[i].id);
        used.add(pool[i].id);
      }
      return count - Math.min(count, pool.length); // shortfall
    };

    let short = 0;
    short += take('GK', 1);
    short += take('DEF', need.DEF);
    short += take('MID', need.MID);
    short += take('FWD', need.FWD);

    // Fill any shortfall with best remaining outfielders.
    if (lineup.length < 11) {
      const rest = squad
        .filter((p) => !used.has(p.id) && p.pos !== 'GK')
        .sort((a, b) => effectiveSkill(b) - effectiveSkill(a));
      for (const p of rest) {
        if (lineup.length >= 11) break;
        lineup.push(p.id);
        used.add(p.id);
      }
    }
    return lineup.slice(0, 11);
  }

  function lineupRatings(state, teamId) {
    const team = state.teams.find((t) => t.id === teamId);
    let lineupIds, formation, mentality;
    if (teamId === state.clubId) {
      formation = state.formation;
      mentality = state.mentality;
      lineupIds = state.lineup && state.lineup.length === 11
        ? state.lineup
        : autoLineup(team.squad, formation);
    } else {
      formation = team.formation || '4-4-2';
      mentality = 'Balanced';
      lineupIds = autoLineup(team.squad, formation);
    }
    const byId = new Map(team.squad.map((p) => [p.id, p]));
    const players = lineupIds.map((id) => byId.get(id)).filter(Boolean);
    const grp = (pos) => players.filter((p) => p.pos === pos);
    const avg = (list) => (list.length ? list.reduce((s, p) => s + effectiveSkill(p), 0) / list.length : 45);

    const gk = grp('GK');
    const def = grp('DEF');
    const mid = grp('MID');
    const fwd = grp('FWD');

    const defRating = avg(def) * 0.7 + avg(gk) * 0.3 + def.length * 0.6;
    const midRating = avg(mid);
    const attRating = avg(fwd) * 0.65 + midRating * 0.35 + fwd.length * 1.0;

    const mentAdj = mentality === 'Attacking' ? 1.12 : mentality === 'Defensive' ? 0.9 : 1;
    const defMentAdj = mentality === 'Defensive' ? 1.12 : mentality === 'Attacking' ? 0.9 : 1;

    return {
      att: attRating * mentAdj,
      mid: midRating,
      def: defRating * defMentAdj,
      players,
      formation,
    };
  }

  /* ---------- Match engine ---------- */
  function simulateMatch(state, homeId, awayId) {
    const H = lineupRatings(state, homeId);
    const A = lineupRatings(state, awayId);
    const homeTeam = state.teams.find((t) => t.id === homeId);
    const awayTeam = state.teams.find((t) => t.id === awayId);

    // Midfield battle nudges expected goals.
    const midEdgeH = (H.mid - A.mid) / 60;
    const midEdgeA = (A.mid - H.mid) / 60;

    const HOME_ADV = 0.28;
    let xgH = clamp(1.25 + (H.att - A.def) / 26 + midEdgeH + HOME_ADV, 0.18, 5.2);
    let xgA = clamp(1.25 + (A.att - H.def) / 26 + midEdgeA, 0.15, 5.0);

    let hg = poisson(xgH);
    let ag = poisson(xgA);

    // Build goal-minute events with scorers.
    const events = [];
    const addGoals = (team, count, side) => {
      const scorers = team.players.filter((p) => p.pos !== 'GK');
      const weighted = [];
      for (const p of scorers) {
        const w = p.pos === 'FWD' ? 5 : p.pos === 'MID' ? 3 : 1;
        for (let i = 0; i < w; i++) weighted.push(p);
      }
      for (let i = 0; i < count; i++) {
        const scorer = weighted.length ? pick(weighted) : null;
        events.push({
          min: randInt(1, 90),
          type: 'goal',
          side,
          scorer: scorer ? scorer.name : 'Own goal',
          scorerId: scorer ? scorer.id : null,
        });
      }
    };
    addGoals(H, hg, 'home');
    addGoals(A, ag, 'away');

    // Flavor events (chances, cards) — purely cosmetic.
    const flavorPool = [
      { type: 'chance', side: 'home', text: `${homeTeam.short} forces a great save` },
      { type: 'chance', side: 'away', text: `${awayTeam.short} rattles the crossbar` },
      { type: 'card', side: 'home', text: `Yellow card for ${homeTeam.short}` },
      { type: 'card', side: 'away', text: `Yellow card for ${awayTeam.short}` },
      { type: 'chance', side: 'home', text: `${homeTeam.short} appeals for a penalty — waved away` },
    ];
    const flavorCount = randInt(2, 4);
    for (let i = 0; i < flavorCount; i++) {
      const f = pick(flavorPool);
      events.push({ min: randInt(1, 90), type: f.type, side: f.side, text: f.text });
    }

    events.sort((a, b) => a.min - b.min);

    return { homeId, awayId, hg, ag, events, H, A };
  }

  /* Apply a played match result to the league table. */
  function applyResult(state, m) {
    const th = state.table[m.home];
    const ta = state.table[m.away];
    th.p++; ta.p++;
    th.gf += m.hg; th.ga += m.ag;
    ta.gf += m.ag; ta.ga += m.hg;
    if (m.hg > m.ag) { th.w++; ta.l++; th.pts += 3; }
    else if (m.hg < m.ag) { ta.w++; th.l++; ta.pts += 3; }
    else { th.d++; ta.d++; th.pts++; ta.pts++; }
  }

  /* ---------- Energy / recovery ---------- */
  function tireLineup(team, lineupIds) {
    const set = new Set(lineupIds);
    for (const p of team.squad) {
      if (set.has(p.id)) p.energy = clamp(p.energy - randInt(16, 30), 5, 100);
    }
  }
  function recoverSquad(team) {
    for (const p of team.squad) {
      const rest = team.lastLineup && team.lastLineup.has(p.id) ? randInt(14, 24) : randInt(30, 45);
      p.energy = clamp(p.energy + rest, 0, 100);
    }
  }

  /* ---------- New game / state ---------- */
  function newGame(clubIndex) {
    _id = 1;
    const teams = CLUBS.map((c, i) => {
      const strength = 5 - Math.floor(i / 2); // spread 5..1
      const squad = makeSquad(clamp(strength, 1, 5));
      return {
        id: i + 1,
        name: c.name,
        short: c.short,
        color: c.color,
        squad,
        formation: pick(['4-4-2', '4-3-3', '3-5-2']),
      };
    });
    const clubId = teams[clubIndex].id;
    const club = teams[clubIndex];

    const state = {
      version: 1,
      clubId,
      season: 1,
      budget: 6500000,
      teams,
      table: freshTable(teams),
      fixtures: generateFixtures(teams.map((t) => t.id)),
      roundIdx: 0,
      formation: '4-4-2',
      mentality: 'Balanced',
      lineup: autoLineup(club.squad, '4-4-2'),
      market: buildMarket(teams, clubId),
      log: [],
      finished: false,
      champion: null,
      lastMatch: null,
    };
    return state;
  }

  function buildMarket(teams, clubId) {
    // Free agents available to sign.
    const market = [];
    const count = randInt(7, 10);
    for (let i = 0; i < count; i++) {
      const pos = pick(POSITIONS);
      const p = makePlayer(pos, randInt(48, 84));
      market.push(p);
    }
    return market.sort((a, b) => b.skill - a.skill);
  }

  /* ---------- Persistence ---------- */
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(STATE)); } catch (e) { /* ignore */ }
  }
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      // restore id counter so new players don't collide
      let maxId = 0;
      for (const t of s.teams) for (const p of t.squad) maxId = Math.max(maxId, p.id);
      for (const p of s.market || []) maxId = Math.max(maxId, p.id);
      _id = maxId + 1;
      return s;
    } catch (e) { return null; }
  }
  function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  /* ============================================================
     UI
     ============================================================ */
  let STATE = null;
  let TAB = 'squad';
  const IS_BROWSER = typeof document !== 'undefined' && typeof window !== 'undefined';
  const $ = (id) => document.getElementById(id);
  const screen = IS_BROWSER ? $('screen') : null;
  const topbar = IS_BROWSER ? $('topbar') : null;
  const tabbar = IS_BROWSER ? $('tabbar') : null;

  const club = () => STATE.teams.find((t) => t.id === STATE.clubId);
  const currentRound = () => STATE.fixtures[STATE.roundIdx];
  const clubFixture = () => {
    const rd = currentRound();
    if (!rd) return null;
    return rd.matches.find((m) => m.home === STATE.clubId || m.away === STATE.clubId);
  };

  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function refreshTopbar() {
    if (!STATE) { topbar.hidden = true; tabbar.hidden = true; return; }
    topbar.hidden = false; tabbar.hidden = false;
    const c = club();
    $('club-badge').textContent = c.short.slice(0, 3);
    $('club-badge').style.background = c.color;
    $('club-name').textContent = c.name;
    $('club-budget').textContent = fmtMoney(STATE.budget);
    $('club-position').textContent = clubPosition(STATE);
  }

  function setTab(tab) {
    TAB = tab;
    document.querySelectorAll('.tab').forEach((b) =>
      b.classList.toggle('is-active', b.dataset.tab === tab));
    render();
  }

  /* ---------- Renderers ---------- */
  function render() {
    if (!STATE) { renderStart(); return; }
    if (STATE.finished && TAB !== 'league') { renderSeasonEnd(); return; }
    refreshTopbar();
    switch (TAB) {
      case 'squad': renderSquad(); break;
      case 'tactics': renderTactics(); break;
      case 'match': renderMatch(); break;
      case 'transfers': renderTransfers(); break;
      case 'league': renderLeague(); break;
      default: renderSquad();
    }
    screen.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function posClass(pos) { return `pos pos--${pos}`; }
  function energyClass(e) { return e < 30 ? 'energy crit' : e < 60 ? 'energy low' : 'energy'; }

  function playerRow(p, opts = {}) {
    const right = opts.right != null ? opts.right :
      `<div class="${energyClass(p.energy)}"><i style="width:${p.energy}%"></i></div>
       <div class="skill">${p.skill}</div>`;
    return `
      <div class="player ${opts.bench ? 'is-bench' : ''}" ${opts.onclick ? `data-act="${opts.onclick}" data-id="${p.id}"` : ''} style="${opts.onclick ? 'cursor:pointer' : ''}">
        <div class="${posClass(p.pos)}">${p.pos}</div>
        <div class="player__main">
          <div class="player__name">${p.name}${p.goals ? ` <span class="faint">· ${p.goals}⚽</span>` : ''}</div>
          <div class="player__sub">Age ${p.age} · ${fmtMoney(p.value)}</div>
        </div>
        ${right}
      </div>`;
  }

  function renderStart() {
    topbar.hidden = true; tabbar.hidden = true;
    screen.className = 'screen screen--full';
    const opts = CLUBS.map((c, i) => {
      const strength = 5 - Math.floor(i / 2);
      const stars = '★'.repeat(strength) + '☆'.repeat(5 - strength);
      return `
        <button class="btn btn--ghost club-opt" data-act="choose" data-i="${i}">
          <span class="topbar__badge" style="background:${c.color}">${c.short.slice(0,3)}</span>
          <span class="club-opt__meta">
            <b>${c.name}</b>
            <small>Squad rating <span class="stars">${stars}</span></small>
          </span>
        </button>`;
    }).join('');

    const hasSave = !!localStorage.getItem(SAVE_KEY);
    screen.innerHTML = `
      <div class="hero">
        <div class="ball">⚽</div>
        <h1>Pocket Manager</h1>
        <p>Pick a club. Set your tactics. Win the league.</p>
      </div>
      ${hasSave ? `<div class="card"><button class="btn btn--primary" data-act="continue">Continue saved game</button></div>` : ''}
      <div class="card">
        <div class="card__title">Choose your club</div>
        <div class="club-pick">${opts}</div>
      </div>
      <p class="center faint" style="font-size:12px">Inspired by Elifoot · Add to Home Screen for full-screen play</p>
    `;
  }

  function renderSquad() {
    screen.className = 'screen';
    const c = club();
    const lineupSet = new Set(STATE.lineup || []);
    const sorted = c.squad.slice().sort((a, b) => {
      const order = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
      return order[a.pos] - order[b.pos] || b.skill - a.skill;
    });
    const starters = sorted.filter((p) => lineupSet.has(p.id));
    const bench = sorted.filter((p) => !lineupSet.has(p.id));
    const rating = round0(teamStrengthOf(c.squad));

    screen.innerHTML = `
      <p class="view-title">Squad · ${c.squad.length} players · rating ${rating}</p>
      <div class="card">
        <div class="row"><div class="card__title">Starting XI (${STATE.formation})</div>
        <span class="faint" style="font-size:12px">${STATE.mentality}</span></div>
        <div class="plist">${starters.map((p) => playerRow(p)).join('')}</div>
      </div>
      <div class="card">
        <div class="card__title">Bench & reserves</div>
        <div class="plist">${bench.map((p) => playerRow(p, { bench: true, onclick: 'sellPrompt' })).join('') || '<p class="faint center">No reserves</p>'}</div>
      </div>
      <p class="center faint" style="font-size:12px">Tap a reserve to sell · set your XI in Tactics</p>
    `;
  }

  function renderTactics() {
    screen.className = 'screen';
    const c = club();
    if (!STATE.lineup || STATE.lineup.length !== 11) {
      STATE.lineup = autoLineup(c.squad, STATE.formation);
    }
    const r = lineupRatings(STATE, STATE.clubId);
    const need = FORMATIONS[STATE.formation];

    // pitch coordinates per line
    const lines = [
      { pos: 'GK', count: 1, y: 90 },
      { pos: 'DEF', count: need.DEF, y: 68 },
      { pos: 'MID', count: need.MID, y: 44 },
      { pos: 'FWD', count: need.FWD, y: 20 },
    ];
    const byId = new Map(c.squad.map((p) => [p.id, p]));
    const inLineup = STATE.lineup.map((id) => byId.get(id)).filter(Boolean);
    const dots = [];
    for (const ln of lines) {
      const group = inLineup.filter((p) => p.pos === ln.pos).slice(0, ln.count);
      group.forEach((p, i) => {
        const x = ((i + 1) / (group.length + 1)) * 100;
        dots.push(`
          <div class="dot dot--${p.pos}" style="left:${x}%;top:${ln.y}%">
            <span class="dot__chip">${p.skill}</span>
            <span class="dot__lbl">${p.name.split(' ').slice(-1)[0]}</span>
          </div>`);
      });
    }

    const formChips = Object.keys(FORMATIONS).map((f) =>
      `<button class="chip ${f === STATE.formation ? 'is-active' : ''}" data-act="setFormation" data-f="${f}">${f}</button>`).join('');
    const mentChips = MENTALITIES.map((m) =>
      `<button class="chip ${m === STATE.mentality ? 'is-active' : ''}" data-act="setMentality" data-m="${m}">${m}</button>`).join('');

    screen.innerHTML = `
      <p class="view-title">Tactics</p>
      <div class="pitch">${dots.join('')}</div>
      <div class="card">
        <div class="card__title">Formation</div>
        <div class="chips">${formChips}</div>
      </div>
      <div class="card">
        <div class="card__title">Mentality</div>
        <div class="chips">${mentChips}</div>
      </div>
      <div class="card">
        <div class="card__title">Team strength</div>
        <div class="row"><span class="muted">Attack</span><b>${round0(r.att)}</b></div>
        <div class="row"><span class="muted">Midfield</span><b>${round0(r.mid)}</b></div>
        <div class="row"><span class="muted">Defence</span><b>${round0(r.def)}</b></div>
      </div>
      <div class="btn-row">
        <button class="btn btn--ghost" data-act="editXI">Pick XI manually</button>
        <button class="btn btn--ghost" data-act="autoPick">Auto-pick best XI</button>
      </div>
    `;
  }

  function renderEditXI() {
    screen.className = 'screen';
    const c = club();
    const lineupSet = new Set(STATE.lineup);
    const need = FORMATIONS[STATE.formation];
    const counts = { GK: 1, DEF: need.DEF, MID: need.MID, FWD: need.FWD };
    const inByPos = (pos) => STATE.lineup.map((id) => c.squad.find((p) => p.id === id)).filter((p) => p && p.pos === pos).length;

    const sorted = c.squad.slice().sort((a, b) => {
      const order = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
      return order[a.pos] - order[b.pos] || effectiveSkill(b) - effectiveSkill(a);
    });

    const rows = sorted.map((p) => {
      const inXI = lineupSet.has(p.id);
      const right = `<button class="btn btn--sm ${inXI ? 'btn--danger' : 'btn--primary'}" data-act="toggleXI" data-id="${p.id}">${inXI ? 'Remove' : 'Add'}</button>`;
      return playerRow(p, { right, bench: !inXI });
    }).join('');

    const valid = STATE.lineup.length === 11;
    const summary = POSITIONS.map((pos) => `${pos} ${inByPos(pos)}/${counts[pos]}`).join(' · ');

    screen.innerHTML = `
      <p class="view-title">Select XI · ${STATE.lineup.length}/11</p>
      <div class="card">
        <div class="faint" style="font-size:12px;margin-bottom:6px">${summary}</div>
        <div class="plist">${rows}</div>
      </div>
      <div class="sticky-action btn-row">
        <button class="btn btn--ghost" data-act="autoPick">Auto-pick</button>
        <button class="btn btn--primary" data-act="doneXI" ${valid ? '' : 'disabled'}>${valid ? 'Done' : `Need ${11 - STATE.lineup.length} more`}</button>
      </div>
    `;
  }

  function renderMatch() {
    screen.className = 'screen';
    const fx = clubFixture();
    if (STATE.finished) { renderSeasonEnd(); return; }
    if (!fx) {
      screen.innerHTML = `<div class="card center"><p>No fixture this round.</p><button class="btn btn--primary" data-act="advance">Advance</button></div>`;
      return;
    }
    const isHome = fx.home === STATE.clubId;
    const oppId = isHome ? fx.away : fx.home;
    const opp = STATE.teams.find((t) => t.id === oppId);
    const oppRating = round0(teamStrengthOf(opp.squad));
    const myRating = round0(teamStrengthOf(club().squad));

    screen.innerHTML = `
      <p class="view-title">Season ${STATE.season} · Round ${STATE.roundIdx + 1} / ${STATE.fixtures.length}</p>
      <div class="card center">
        <p class="muted" style="margin:0 0 12px">Next match</p>
        <div class="scoreboard" style="margin-bottom:8px">
          <div class="scoreboard__team left"><b>${club().short}</b><small>${club().name}</small></div>
          <div class="scoreboard__score">vs</div>
          <div class="scoreboard__team right"><b>${opp.short}</b><small>${opp.name}</small></div>
        </div>
        <p><span class="pill ${isHome ? 'pill--home' : 'pill--away'}">${isHome ? 'HOME' : 'AWAY'}</span></p>
        <div class="row" style="margin-top:10px"><span class="muted">Your rating</span><b>${myRating}</b></div>
        <div class="row"><span class="muted">Opponent rating</span><b>${oppRating}</b></div>
      </div>
      <button class="btn btn--primary" data-act="playMatch">▶ Play match</button>
      <p class="center faint" style="font-size:12px;margin-top:10px">Set your lineup in Tactics first</p>
    `;
  }

  /* Animated match playback */
  function playMatch() {
    const fx = clubFixture();
    if (!fx) return;
    // Ensure a valid lineup.
    const c = club();
    if (!STATE.lineup || STATE.lineup.length !== 11) STATE.lineup = autoLineup(c.squad, STATE.formation);

    const result = simulateMatch(STATE, fx.home, fx.away);
    const homeTeam = STATE.teams.find((t) => t.id === fx.home);
    const awayTeam = STATE.teams.find((t) => t.id === fx.away);

    screen.className = 'screen';
    screen.innerHTML = `
      <p class="view-title">Live · ${homeTeam.name} v ${awayTeam.name}</p>
      <div class="scoreboard">
        <div class="scoreboard__team left"><b>${homeTeam.short}</b><small>${homeTeam.name}</small></div>
        <div class="scoreboard__score" id="live-score">0 – 0</div>
        <div class="scoreboard__team right"><b>${awayTeam.short}</b><small>${awayTeam.name}</small></div>
      </div>
      <div class="clock" id="live-clock">0'</div>
      <div class="feed" id="live-feed"></div>
    `;

    const scoreEl = $('live-score');
    const clockEl = $('live-clock');
    const feedEl = $('live-feed');
    let sh = 0, sa = 0;
    const events = result.events.slice();
    let evIdx = 0;
    let minute = 0;

    const finish = () => {
      clockEl.textContent = 'Full time';
      commitMatchResult(result);
      const btn = document.createElement('button');
      btn.className = 'btn btn--primary';
      btn.style.marginTop = '14px';
      btn.textContent = 'Continue';
      btn.setAttribute('data-act', 'afterMatch');
      screen.appendChild(btn);
    };

    const stepTo = (target) => {
      while (evIdx < events.length && events[evIdx].min <= target) {
        const e = events[evIdx++];
        if (e.type === 'goal') {
          if (e.side === 'home') sh++; else sa++;
          scoreEl.textContent = `${sh} – ${sa}`;
          const tm = e.side === 'home' ? homeTeam.short : awayTeam.short;
          feedEl.insertAdjacentHTML('afterbegin',
            `<div class="ev ev--goal"><span class="ev__min">${e.min}'</span>⚽ <b>GOAL ${tm}</b> — ${e.scorer}</div>`);
        } else {
          feedEl.insertAdjacentHTML('afterbegin',
            `<div class="ev"><span class="ev__min">${e.min}'</span>${e.text}</div>`);
        }
      }
    };

    const tick = () => {
      minute += 5;
      if (minute >= 90) { minute = 90; clockEl.textContent = `90'`; stepTo(90); finish(); return; }
      clockEl.textContent = `${minute}'`;
      stepTo(minute);
      timer = setTimeout(tick, 240);
    };
    let timer = setTimeout(tick, 240);

    // Tap to skip to full time.
    screen.addEventListener('click', function skip(ev) {
      if (ev.target.closest('[data-act]')) return;
      clearTimeout(timer);
      minute = 90;
      clockEl.textContent = `90'`;
      stepTo(90);
      scoreEl.textContent = `${result.hg} – ${result.ag}`;
      if (!document.querySelector('[data-act="afterMatch"]')) finish();
      screen.removeEventListener('click', skip);
    }, { once: false });
  }

  /* Persist a played club match + simulate the rest of the round. */
  function commitMatchResult(result) {
    const rd = currentRound();
    const c = club();

    // Tire the club lineup and record scorers.
    const homeTeam = STATE.teams.find((t) => t.id === result.homeId);
    const awayTeam = STATE.teams.find((t) => t.id === result.awayId);
    for (const e of result.events) {
      if (e.type === 'goal' && e.scorerId) {
        const t = e.side === 'home' ? homeTeam : awayTeam;
        const p = t.squad.find((pp) => pp.id === e.scorerId);
        if (p) p.goals = (p.goals || 0) + 1;
      }
    }

    // Find & finalize the club's match in fixtures.
    const myMatch = rd.matches.find((m) => m.home === result.homeId && m.away === result.awayId);
    if (myMatch && !myMatch.played) {
      myMatch.played = true; myMatch.hg = result.hg; myMatch.ag = result.ag;
      applyResult(STATE, myMatch);
    }

    // Track lineup for energy/recovery accounting.
    c.lastLineup = new Set(STATE.lineup);
    tireLineup(c, STATE.lineup);

    // Simulate all other matches of this round.
    for (const m of rd.matches) {
      if (m.played) continue;
      const r = simulateMatch(STATE, m.home, m.away);
      m.played = true; m.hg = r.hg; m.ag = r.ag;
      applyResult(STATE, m);
      // tire & record scorers for AI teams
      const ht = STATE.teams.find((t) => t.id === m.home);
      const at = STATE.teams.find((t) => t.id === m.away);
      ht.lastLineup = new Set(r.H.players.map((p) => p.id));
      at.lastLineup = new Set(r.A.players.map((p) => p.id));
      tireLineup(ht, [...ht.lastLineup]);
      tireLineup(at, [...at.lastLineup]);
      for (const e of r.events) {
        if (e.type === 'goal' && e.scorerId) {
          const t = e.side === 'home' ? ht : at;
          const p = t.squad.find((pp) => pp.id === e.scorerId);
          if (p) p.goals = (p.goals || 0) + 1;
        }
      }
    }

    STATE.lastMatch = {
      homeShort: homeTeam.short, awayShort: awayTeam.short,
      homeName: homeTeam.name, awayName: awayTeam.name,
      hg: result.hg, ag: result.ag,
    };
    save();
  }

  /* Move to next round (recover squads, gate receipts, season end). */
  function afterMatch() {
    const wasHome = STATE.lastMatch && STATE.lastMatch.homeShort === club().short;
    // Recover all squads for next round.
    for (const t of STATE.teams) recoverSquad(t);

    // Home gate receipts based on club position (more fans when doing well).
    const pos = clubPosition(STATE);
    const gate = round0((220000 + (STATE.teams.length - pos) * 35000) * (0.8 + rnd() * 0.5));
    if (wasHome) { STATE.budget += gate; }
    // Sponsorship every round.
    STATE.budget += 60000;

    STATE.roundIdx++;
    if (STATE.roundIdx >= STATE.fixtures.length) {
      endSeason();
    } else {
      // Refresh market occasionally.
      if (STATE.roundIdx % 3 === 0) STATE.market = buildMarket(STATE.teams, STATE.clubId);
    }
    save();
    setTab('match');
    if (wasHome) toast(`Gate receipts: ${fmtMoney(gate)}`);
  }

  function endSeason() {
    const table = standingsArray(STATE);
    STATE.finished = true;
    STATE.champion = table[0];
  }

  function renderSeasonEnd() {
    refreshTopbar();
    screen.className = 'screen';
    const table = standingsArray(STATE);
    const champ = STATE.champion;
    const youPos = table.findIndex((r) => r.id === STATE.clubId) + 1;
    const youWon = champ.id === STATE.clubId;
    const prize = round0((STATE.teams.length - youPos + 1) * 350000 + (youWon ? 2000000 : 0));

    screen.innerHTML = `
      <div class="banner ${youWon ? 'banner--win' : ''}">
        <div style="font-size:40px">${youWon ? '🏆' : '🏁'}</div>
        <h2>${youWon ? 'Champions!' : 'Season over'}</h2>
        <p class="muted">${champ.name} ${youWon ? 'win the league!' : `won the league. You finished #${youPos}.`}</p>
      </div>
      <div class="card">
        <div class="card__title">Final table</div>
        ${leagueTableHTML(table)}
      </div>
      <div class="card">
        <div class="row"><span class="muted">Prize money</span><b>${fmtMoney(prize)}</b></div>
      </div>
      <button class="btn btn--primary" data-act="newSeason" data-prize="${prize}">Start season ${STATE.season + 1}</button>
      <button class="btn btn--danger" data-act="quit" style="margin-top:10px">Quit to menu</button>
    `;
  }

  function newSeason(prize) {
    STATE.budget += prize;
    STATE.season++;
    // Age players a year; drift skill (young improve, old decline).
    for (const t of STATE.teams) {
      for (const p of t.squad) {
        p.age++;
        if (p.age <= 24) p.skill = clamp(p.skill + randInt(0, 3), 30, 97);
        else if (p.age >= 31) p.skill = clamp(p.skill - randInt(0, 3), 30, 97);
        p.energy = 100;
        p.goals = 0;
        p.value = playerValue(p.skill, p.age);
      }
    }
    STATE.table = freshTable(STATE.teams);
    STATE.fixtures = generateFixtures(STATE.teams.map((t) => t.id));
    STATE.roundIdx = 0;
    STATE.finished = false;
    STATE.champion = null;
    STATE.lastMatch = null;
    STATE.market = buildMarket(STATE.teams, STATE.clubId);
    STATE.lineup = autoLineup(club().squad, STATE.formation);
    save();
    setTab('match');
  }

  function leagueTableHTML(table) {
    const zoneTop = 1;
    return `
      <table class="table">
        <thead><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
        <tbody>
          ${table.map((r, i) => `
            <tr class="${r.id === STATE.clubId ? 'is-you' : ''} ${i < zoneTop ? 'zone-top' : ''}">
              <td>${i + 1}</td>
              <td>${r.short}</td>
              <td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td>
              <td>${r.gd > 0 ? '+' : ''}${r.gd}</td>
              <td class="pts">${r.pts}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function renderLeague() {
    screen.className = 'screen';
    const table = standingsArray(STATE);

    // Top scorers across the league.
    const scorers = [];
    for (const t of STATE.teams) for (const p of t.squad) if (p.goals) scorers.push({ ...p, team: t.short });
    scorers.sort((a, b) => b.goals - a.goals);
    const topScorers = scorers.slice(0, 5);

    // Last round results.
    const lastRd = STATE.roundIdx > 0 ? STATE.fixtures[STATE.roundIdx - 1] : null;
    const resultsHTML = lastRd ? lastRd.matches.map((m) => {
      const h = STATE.teams.find((t) => t.id === m.home);
      const a = STATE.teams.find((t) => t.id === m.away);
      const mine = m.home === STATE.clubId || m.away === STATE.clubId;
      return `<div class="row" style="padding:5px 0;${mine ? 'color:var(--accent)' : ''}">
        <span>${h.short}</span><b>${m.hg} – ${m.ag}</b><span>${a.short}</span></div>`;
    }).join('') : '<p class="faint center">No matches played yet</p>';

    screen.innerHTML = `
      <p class="view-title">League · Season ${STATE.season} · Round ${Math.min(STATE.roundIdx + 1, STATE.fixtures.length)} / ${STATE.fixtures.length}</p>
      <div class="card">${leagueTableHTML(table)}</div>
      <div class="card">
        <div class="card__title">Round ${lastRd ? STATE.roundIdx : '-'} results</div>
        ${resultsHTML}
      </div>
      <div class="card">
        <div class="card__title">Top scorers</div>
        ${topScorers.length ? topScorers.map((s) =>
          `<div class="row" style="padding:4px 0"><span>${s.name} <span class="faint">${s.team}</span></span><b>${s.goals}</b></div>`).join('')
          : '<p class="faint center">No goals yet</p>'}
      </div>
      ${STATE.finished ? `<button class="btn btn--primary" data-act="seasonEnd">Season summary</button>` : ''}
    `;
  }

  function renderTransfers() {
    screen.className = 'screen';
    const c = club();
    const squadSize = c.squad.length;
    const market = STATE.market.slice().sort((a, b) => b.skill - a.skill);

    const buyRows = market.map((p) => {
      const canAfford = STATE.budget >= p.value;
      const hasRoom = squadSize < 24;
      const ok = canAfford && hasRoom;
      const right = `<button class="btn btn--sm ${ok ? 'btn--primary' : ''}" data-act="buy" data-id="${p.id}" ${ok ? '' : 'disabled'}>${fmtMoney(p.value)}</button>`;
      return playerRow(p, { right });
    }).join('');

    const sellRows = c.squad.slice().sort((a, b) => b.skill - a.skill).map((p) => {
      const sell = round0(p.value * 0.85);
      const canSell = squadSize > 14;
      const right = `<button class="btn btn--sm btn--danger" data-act="sell" data-id="${p.id}" ${canSell ? '' : 'disabled'}>Sell ${fmtMoney(sell)}</button>`;
      return playerRow(p, { right });
    }).join('');

    screen.innerHTML = `
      <p class="view-title">Transfer market</p>
      <div class="card">
        <div class="row"><span class="muted">Budget</span><b>${fmtMoney(STATE.budget)}</b></div>
        <div class="row"><span class="muted">Squad size</span><b>${squadSize} / 24</b></div>
        <p class="faint" style="font-size:12px;margin:8px 0 0">Squad must stay between 14 and 24 players.</p>
      </div>
      <div class="card">
        <div class="card__title">Available players (${market.length})</div>
        <div class="plist">${buyRows || '<p class="faint center">Market empty — check back next round</p>'}</div>
      </div>
      <div class="card">
        <div class="card__title">Sell from your squad</div>
        <div class="plist">${sellRows}</div>
      </div>
    `;
  }

  /* ---------- Actions / event delegation ---------- */
  function buyPlayer(id) {
    const c = club();
    if (c.squad.length >= 24) { toast('Squad full (max 24)'); return; }
    const idx = STATE.market.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const p = STATE.market[idx];
    if (STATE.budget < p.value) { toast('Not enough budget'); return; }
    STATE.budget -= p.value;
    p.energy = 100;
    c.squad.push(p);
    STATE.market.splice(idx, 1);
    save();
    toast(`Signed ${p.name}`);
    render();
  }

  function sellPlayer(id) {
    const c = club();
    if (c.squad.length <= 14) { toast('Squad too small (min 14)'); return; }
    const idx = c.squad.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const p = c.squad[idx];
    const fee = round0(p.value * 0.85);
    STATE.budget += fee;
    c.squad.splice(idx, 1);
    // remove from lineup if present
    STATE.lineup = (STATE.lineup || []).filter((x) => x !== id);
    save();
    toast(`Sold ${p.name} for ${fmtMoney(fee)}`);
    render();
  }

  function toggleXI(id) {
    const c = club();
    const p = c.squad.find((pp) => pp.id === id);
    if (!p) return;
    const i = STATE.lineup.indexOf(id);
    if (i >= 0) { STATE.lineup.splice(i, 1); }
    else {
      if (STATE.lineup.length >= 11) { toast('XI full — remove someone first'); return; }
      STATE.lineup.push(id);
    }
    save();
    renderEditXI();
  }

  // Expose internals for Node-based tests; harmless in the browser.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      newGame, generateFixtures, simulateMatch, applyResult, standingsArray,
      autoLineup, lineupRatings, teamStrengthOf, freshTable, poisson,
      playerValue, FORMATIONS, POSITIONS,
    };
  }

  if (!IS_BROWSER) return; // Node test context: skip all DOM wiring/boot.

  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    switch (act) {
      case 'choose':
        STATE = newGame(parseInt(el.dataset.i, 10));
        save();
        setTab('match');
        toast(`Welcome to ${club().name}!`);
        break;
      case 'continue':
        STATE = load();
        if (STATE) setTab('match'); else renderStart();
        break;
      case 'setFormation':
        STATE.formation = el.dataset.f;
        STATE.lineup = autoLineup(club().squad, STATE.formation);
        save(); renderTactics();
        break;
      case 'setMentality':
        STATE.mentality = el.dataset.m; save(); renderTactics();
        break;
      case 'editXI': renderEditXI(); break;
      case 'autoPick':
        STATE.lineup = autoLineup(club().squad, STATE.formation);
        save(); toast('Best XI selected'); renderTactics();
        break;
      case 'toggleXI': toggleXI(parseInt(el.dataset.id, 10)); break;
      case 'doneXI': save(); setTab('tactics'); break;
      case 'sellPrompt': sellPlayer(parseInt(el.dataset.id, 10)); break;
      case 'buy': buyPlayer(parseInt(el.dataset.id, 10)); break;
      case 'sell': sellPlayer(parseInt(el.dataset.id, 10)); break;
      case 'playMatch': playMatch(); break;
      case 'afterMatch': afterMatch(); break;
      case 'advance': afterMatch(); break;
      case 'seasonEnd': renderSeasonEnd(); break;
      case 'newSeason': newSeason(parseInt(el.dataset.prize, 10) || 0); break;
      case 'quit':
        if (confirm('Quit to menu? Your season is saved and can be continued.')) {
          STATE = null; renderStart();
        }
        break;
      default: break;
    }
  });

  document.querySelectorAll('.tab').forEach((b) =>
    b.addEventListener('click', () => setTab(b.dataset.tab)));

  /* ---------- Boot ---------- */
  STATE = load();
  if (STATE) { setTab('match'); } else { renderStart(); }

  // Register service worker for offline / home-screen play.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
