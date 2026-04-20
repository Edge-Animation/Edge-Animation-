/**
 * EDGE ANIMATION — script.js
 * Flight Path Visualizer
 * Vanilla JS, Canvas 2D, SVG-inspired rendering
 * ------------------------------------------------
 */

'use strict';

/* ================================================
   CITY DATABASE
   Lat/Lng for major world cities for autocomplete
   ================================================ */
const CITIES = [
  { name: 'New York',       country: 'USA',         flag: '🇺🇸', lat: 40.7128,   lng: -74.0060  },
  { name: 'Los Angeles',    country: 'USA',         flag: '🇺🇸', lat: 34.0522,   lng: -118.2437 },
  { name: 'Chicago',        country: 'USA',         flag: '🇺🇸', lat: 41.8781,   lng: -87.6298  },
  { name: 'Houston',        country: 'USA',         flag: '🇺🇸', lat: 29.7604,   lng: -95.3698  },
  { name: 'Miami',          country: 'USA',         flag: '🇺🇸', lat: 25.7617,   lng: -80.1918  },
  { name: 'San Francisco',  country: 'USA',         flag: '🇺🇸', lat: 37.7749,   lng: -122.4194 },
  { name: 'Seattle',        country: 'USA',         flag: '🇺🇸', lat: 47.6062,   lng: -122.3321 },
  { name: 'Boston',         country: 'USA',         flag: '🇺🇸', lat: 42.3601,   lng: -71.0589  },
  { name: 'Atlanta',        country: 'USA',         flag: '🇺🇸', lat: 33.7490,   lng: -84.3880  },
  { name: 'Las Vegas',      country: 'USA',         flag: '🇺🇸', lat: 36.1699,   lng: -115.1398 },
  { name: 'London',         country: 'UK',          flag: '🇬🇧', lat: 51.5074,   lng: -0.1278   },
  { name: 'Paris',          country: 'France',      flag: '🇫🇷', lat: 48.8566,   lng: 2.3522    },
  { name: 'Berlin',         country: 'Germany',     flag: '🇩🇪', lat: 52.5200,   lng: 13.4050   },
  { name: 'Rome',           country: 'Italy',       flag: '🇮🇹', lat: 41.9028,   lng: 12.4964   },
  { name: 'Madrid',         country: 'Spain',       flag: '🇪🇸', lat: 40.4168,   lng: -3.7038   },
  { name: 'Amsterdam',      country: 'Netherlands', flag: '🇳🇱', lat: 52.3676,   lng: 4.9041    },
  { name: 'Vienna',         country: 'Austria',     flag: '🇦🇹', lat: 48.2082,   lng: 16.3738   },
  { name: 'Zurich',         country: 'Switzerland', flag: '🇨🇭', lat: 47.3769,   lng: 8.5417    },
  { name: 'Stockholm',      country: 'Sweden',      flag: '🇸🇪', lat: 59.3293,   lng: 18.0686   },
  { name: 'Moscow',         country: 'Russia',      flag: '🇷🇺', lat: 55.7558,   lng: 37.6173   },
  { name: 'Istanbul',       country: 'Turkey',      flag: '🇹🇷', lat: 41.0082,   lng: 28.9784   },
  { name: 'Dubai',          country: 'UAE',         flag: '🇦🇪', lat: 25.2048,   lng: 55.2708   },
  { name: 'Mumbai',         country: 'India',       flag: '🇮🇳', lat: 19.0760,   lng: 72.8777   },
  { name: 'Delhi',          country: 'India',       flag: '🇮🇳', lat: 28.7041,   lng: 77.1025   },
  { name: 'Bangalore',      country: 'India',       flag: '🇮🇳', lat: 12.9716,   lng: 77.5946   },
  { name: 'Singapore',      country: 'Singapore',   flag: '🇸🇬', lat: 1.3521,    lng: 103.8198  },
  { name: 'Bangkok',        country: 'Thailand',    flag: '🇹🇭', lat: 13.7563,   lng: 100.5018  },
  { name: 'Tokyo',          country: 'Japan',       flag: '🇯🇵', lat: 35.6762,   lng: 139.6503  },
  { name: 'Osaka',          country: 'Japan',       flag: '🇯🇵', lat: 34.6937,   lng: 135.5023  },
  { name: 'Seoul',          country: 'South Korea', flag: '🇰🇷', lat: 37.5665,   lng: 126.9780  },
  { name: 'Beijing',        country: 'China',       flag: '🇨🇳', lat: 39.9042,   lng: 116.4074  },
  { name: 'Shanghai',       country: 'China',       flag: '🇨🇳', lat: 31.2304,   lng: 121.4737  },
  { name: 'Hong Kong',      country: 'Hong Kong',   flag: '🇭🇰', lat: 22.3193,   lng: 114.1694  },
  { name: 'Sydney',         country: 'Australia',   flag: '🇦🇺', lat: -33.8688,  lng: 151.2093  },
  { name: 'Melbourne',      country: 'Australia',   flag: '🇦🇺', lat: -37.8136,  lng: 144.9631  },
  { name: 'Toronto',        country: 'Canada',      flag: '🇨🇦', lat: 43.6532,   lng: -79.3832  },
  { name: 'Vancouver',      country: 'Canada',      flag: '🇨🇦', lat: 49.2827,   lng: -123.1207 },
  { name: 'São Paulo',      country: 'Brazil',      flag: '🇧🇷', lat: -23.5505,  lng: -46.6333  },
  { name: 'Rio de Janeiro', country: 'Brazil',      flag: '🇧🇷', lat: -22.9068,  lng: -43.1729  },
  { name: 'Buenos Aires',   country: 'Argentina',   flag: '🇦🇷', lat: -34.6037,  lng: -58.3816  },
  { name: 'Mexico City',    country: 'Mexico',      flag: '🇲🇽', lat: 19.4326,   lng: -99.1332  },
  { name: 'Cairo',          country: 'Egypt',       flag: '🇪🇬', lat: 30.0444,   lng: 31.2357   },
  { name: 'Nairobi',        country: 'Kenya',       flag: '🇰🇪', lat: -1.2921,   lng: 36.8219   },
  { name: 'Lagos',          country: 'Nigeria',     flag: '🇳🇬', lat: 6.5244,    lng: 3.3792    },
  { name: 'Johannesburg',   country: 'S.Africa',    flag: '🇿🇦', lat: -26.2041,  lng: 28.0473   },
  { name: 'Casablanca',     country: 'Morocco',     flag: '🇲🇦', lat: 33.5731,   lng: -7.5898   },
  { name: 'Kuala Lumpur',   country: 'Malaysia',    flag: '🇲🇾', lat: 3.1390,    lng: 101.6869  },
  { name: 'Jakarta',        country: 'Indonesia',   flag: '🇮🇩', lat: -6.2088,   lng: 106.8456  },
  { name: 'Manila',         country: 'Philippines', flag: '🇵🇭', lat: 14.5995,   lng: 120.9842  },
  { name: 'Karachi',        country: 'Pakistan',    flag: '🇵🇰', lat: 24.8607,   lng: 67.0011   },
  { name: 'Riyadh',         country: 'Saudi Arabia',flag: '🇸🇦', lat: 24.7136,   lng: 46.6753   },
  { name: 'Doha',           country: 'Qatar',       flag: '🇶🇦', lat: 25.2854,   lng: 51.5310   },
  { name: 'Tel Aviv',       country: 'Israel',      flag: '🇮🇱', lat: 32.0853,   lng: 34.7818   },
  { name: 'Athens',         country: 'Greece',      flag: '🇬🇷', lat: 37.9838,   lng: 23.7275   },
  { name: 'Copenhagen',     country: 'Denmark',     flag: '🇩🇰', lat: 55.6761,   lng: 12.5683   },
  { name: 'Helsinki',       country: 'Finland',     flag: '🇫🇮', lat: 60.1699,   lng: 24.9384   },
  { name: 'Oslo',           country: 'Norway',      flag: '🇳🇴', lat: 59.9139,   lng: 10.7522   },
  { name: 'Warsaw',         country: 'Poland',      flag: '🇵🇱', lat: 52.2297,   lng: 21.0122   },
  { name: 'Prague',         country: 'Czechia',     flag: '🇨🇿', lat: 50.0755,   lng: 14.4378   },
  { name: 'Budapest',       country: 'Hungary',     flag: '🇭🇺', lat: 47.4979,   lng: 19.0402   },
  { name: 'Lisbon',         country: 'Portugal',    flag: '🇵🇹', lat: 38.7223,   lng: -9.1393   },
  { name: 'Barcelona',      country: 'Spain',       flag: '🇪🇸', lat: 41.3851,   lng: 2.1734    },
  { name: 'Milan',          country: 'Italy',       flag: '🇮🇹', lat: 45.4654,   lng: 9.1859    },
  { name: 'Zurich',         country: 'Switzerland', flag: '🇨🇭', lat: 47.3769,   lng: 8.5417    },
  { name: 'Auckland',       country: 'New Zealand', flag: '🇳🇿', lat: -36.8509,  lng: 174.7645  },
  { name: 'Honolulu',       country: 'USA',         flag: '🇺🇸', lat: 21.3069,   lng: -157.8583 },
  { name: 'Anchorage',      country: 'USA',         flag: '🇺🇸', lat: 61.2181,   lng: -149.9003 },
  { name: 'Lima',           country: 'Peru',        flag: '🇵🇪', lat: -12.0464,  lng: -77.0428  },
  { name: 'Bogotá',         country: 'Colombia',    flag: '🇨🇴', lat: 4.7110,    lng: -74.0721  },
  { name: 'Santiago',       country: 'Chile',       flag: '🇨🇱', lat: -33.4489,  lng: -70.6693  },
];

/* ================================================
   PRESET ROUTES (gallery)
   ================================================ */
const PRESET_ROUTES = [
  { from: 'New York',    to: 'London',        emoji: '✈️' },
  { from: 'Tokyo',       to: 'Los Angeles',   emoji: '🌅' },
  { from: 'Dubai',       to: 'Singapore',     emoji: '🌏' },
  { from: 'Paris',       to: 'New York',      emoji: '🗼' },
  { from: 'Sydney',      to: 'London',        emoji: '🦘' },
  { from: 'Mumbai',      to: 'Dubai',         emoji: '🌴' },
  { from: 'São Paulo',   to: 'Lisbon',        emoji: '🎯' },
  { from: 'Beijing',     to: 'Moscow',        emoji: '🐉' },
  { from: 'Cairo',       to: 'Istanbul',      emoji: '🕌' },
  { from: 'Singapore',   to: 'Tokyo',         emoji: '🌸' },
  { from: 'Lagos',       to: 'London',        emoji: '🌍' },
  { from: 'Bangkok',     to: 'Seoul',         emoji: '🏯' },
];

/* ================================================
   WORLD MAP POLYGON DATA (simplified)
   Mercator projection outlines for major landmasses
   ================================================ */
// Each entry is [lng, lat] pairs for a polygon
const WORLD_OUTLINES = [
  // North America (simplified)
  [[-168,72],[-140,72],[-130,60],[-124,49],[-124,37],[-117,32],[-97,26],[-80,25],[-80,32],[-75,35],
   [-71,42],[-66,45],[-60,47],[-64,44],[-70,44],[-70,47],[-66,47],[-60,46],[-55,47],[-55,52],
   [-64,58],[-64,63],[-72,63],[-72,68],[-83,63],[-90,68],[-95,60],[-87,60],[-80,52],[-80,47],
   [-83,45],[-88,42],[-90,42],[-95,42],[-100,38],[-104,38],[-110,32],[-117,32],[-124,37],[-124,49],
   [-130,60],[-140,72],[-168,72]],
  // Greenland (simplified)
  [[-73,83],[-40,84],[-18,77],[-18,70],[-26,63],[-45,60],[-56,60],[-68,65],[-73,75],[-73,83]],
  // South America
  [[-80,12],[-62,12],[-50,5],[-35,-5],[-35,-12],[-39,-18],[-44,-23],[-43,-23],[-40,-20],[-38,-12],
   [-35,-8],[-35,-5],[-50,5],[-62,12],[-73,12],[-76,2],[-76,-2],[-73,-8],[-72,-18],[-67,-22],
   [-65,-28],[-67,-34],[-68,-42],[-72,-50],[-75,-52],[-68,-55],[-65,-55],[-66,-50],[-68,-42],
   [-67,-34],[-65,-28],[-63,-22],[-60,-18],[-58,-12],[-55,-8],[-50,-5],[-48,-2],[-44,2],
   [-50,5],[-62,12],[-80,12]],
  // Europe (simplified)
  [[-10,36],[2,36],[10,38],[16,38],[28,38],[30,42],[28,46],[26,48],[20,54],[14,54],[10,55],
   [5,58],[8,62],[14,68],[16,72],[10,72],[0,70],[-10,62],[-10,54],[-6,48],[-2,44],[-8,38],[-10,36]],
  // Africa
  [[-18,16],[0,16],[10,18],[22,22],[34,22],[38,18],[42,12],[44,12],[44,8],[42,4],[40,0],[38,-4],
   [34,-8],[32,-12],[34,-18],[34,-24],[28,-34],[26,-34],[18,-34],[16,-28],[14,-22],[12,-16],[10,-10],
   [8,-4],[4,4],[2,8],[0,6],[2,6],[4,8],[8,6],[10,6],[8,4],[4,2],[0,6],[2,8],[2,16],[0,16],[-8,16],
   [-16,16],[-18,16]],
  // Asia (simplified, large)
  [[26,42],[36,38],[38,36],[44,38],[54,22],[62,22],[68,24],[72,20],[80,10],[90,8],[100,8],[104,2],
   [108,4],[110,20],[114,22],[120,22],[126,24],[130,30],[135,34],[140,38],[142,46],[140,52],[138,54],
   [132,52],[130,46],[126,42],[120,40],[116,40],[110,42],[104,42],[96,44],[90,48],[82,52],[74,54],
   [68,54],[60,52],[52,48],[44,44],[38,44],[34,46],[28,46],[26,42]],
  // South/Southeast Asia extra
  [[80,10],[90,8],[100,8],[104,2],[108,4],[110,20],[114,22],[100,6],[96,4],[92,8],[88,14],[84,14],[80,10]],
  // Australia
  [[114,-22],[120,-20],[128,-18],[132,-12],[136,-12],[140,-18],[148,-20],[152,-24],[154,-28],[152,-36],
   [148,-38],[144,-38],[140,-36],[138,-34],[134,-32],[128,-32],[122,-34],[114,-28],[114,-22]],
  // Japan (simplified)
  [[131,32],[135,34],[140,36],[142,38],[140,40],[138,40],[136,36],[132,34],[131,32]],
  // UK (simplified)
  [[-6,50],[-2,50],[2,52],[0,58],[-4,58],[-8,56],[-6,52],[-6,50]],
  // Iceland
  [[-24,64],[-14,64],[-14,66],[-18,67],[-24,66],[-24,64]],
];

/* ================================================
   STATE
   ================================================ */
const state = {
  fromCity: null,
  toCity: null,
  accentColor: '#1a6b4a',
  trailStyle: 'dashed',
  mapStyle: 'world',
  speed: 3,
  duration: 6,
  showLabels: true,
  showTrail: true,
  loop: false,
  // animation
  animating: false,
  paused: false,
  progress: 0,    // 0 → 1
  startTime: null,
  rafId: null,
  // recording
  recording: false,
  recorder: null,
  chunks: [],
};

/* ================================================
   DOM REFERENCES
   ================================================ */
const $ = id => document.getElementById(id);

const DOM = {
  fromInput:    $('fromCity'),
  toInput:      $('toCity'),
  fromList:     $('fromList'),
  toList:       $('toList'),
  speedSlider:  $('speedSlider'),
  speedLabel:   $('speedLabel'),
  durationSlider: $('durationSlider'),
  durationLabel:  $('durationLabel'),
  showLabels:   $('showLabels'),
  showTrail:    $('showTrail'),
  loopAnim:     $('loopAnim'),
  btnGenerate:  $('btnGenerate'),
  btnReset:     $('btnReset'),
  btnPlay:      $('btnPlay'),
  btnRewind:    $('btnRewind'),
  btnRecord:    $('btnRecord'),
  btnScreenshot:$('btnScreenshot'),
  mainCanvas:   $('mainCanvas'),
  placeholder:  $('placeholder'),
  loadingOverlay: $('loadingOverlay'),
  loadingText:  $('loadingText'),
  stageStatus:  $('stageStatus'),
  progressBar:  $('progressBar'),
  progressTime: $('progressTime'),
  fromLabel:    $('fromLabel'),
  toLabel:      $('toLabel'),
  statDist:     $('statDist'),
  statBear:     $('statBear'),
  statTime:     $('statTime'),
  statProg:     $('statProg'),
  recordStatus: $('recordStatus'),
  heroGlobe:    $('heroGlobe'),
  toast:        $('toast'),
  galleryGrid:  $('galleryGrid'),
  stageInfo:    $('stageInfo'),
  playIcon:     $('playIcon'),
};

/* Canvas 2D context */
let ctx = null;

/* ================================================
   HERO GLOBE ANIMATION (decorative)
   ================================================ */
function initHeroGlobe() {
  const canvas = DOM.heroGlobe;
  if (!canvas) return;
  const c = canvas.getContext('2d');
  const W = 420, H = 420;
  canvas.width = W; canvas.height = H;

  let t = 0;

  const drawGlobe = () => {
    c.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2, R = 170;

    // Gradient sphere
    const grad = c.createRadialGradient(cx - 40, cy - 40, 20, cx, cy, R);
    grad.addColorStop(0, 'rgba(220, 245, 230, 0.8)');
    grad.addColorStop(0.6, 'rgba(185, 228, 200, 0.4)');
    grad.addColorStop(1, 'rgba(140, 200, 165, 0.15)');
    c.beginPath();
    c.arc(cx, cy, R, 0, Math.PI * 2);
    c.fillStyle = grad;
    c.fill();

    // Globe outline
    c.beginPath();
    c.arc(cx, cy, R, 0, Math.PI * 2);
    c.strokeStyle = 'rgba(26, 107, 74, 0.3)';
    c.lineWidth = 1.5;
    c.stroke();

    // Latitude lines
    c.save();
    c.beginPath();
    c.arc(cx, cy, R, 0, Math.PI * 2);
    c.clip();
    c.strokeStyle = 'rgba(26, 107, 74, 0.15)';
    c.lineWidth = 0.8;
    for (let lat = -60; lat <= 60; lat += 30) {
      const ry = Math.cos((lat * Math.PI) / 180) * R;
      const py = cy + (lat / 90) * R;
      c.beginPath();
      c.ellipse(cx, py, ry, Math.abs(ry) * 0.25, 0, 0, Math.PI * 2);
      c.stroke();
    }
    // Longitude ellipse (animated)
    c.strokeStyle = 'rgba(26, 107, 74, 0.2)';
    for (let i = 0; i < 3; i++) {
      const angle = (t * 0.3 + i * 60) * (Math.PI / 180);
      c.beginPath();
      c.ellipse(cx, cy, Math.abs(Math.sin(angle)) * R, R, angle, 0, Math.PI * 2);
      c.stroke();
    }
    c.restore();

    // Animated flight path on globe
    const pathT = (t * 0.5) % 360;
    const fromAngle = 200 * Math.PI / 180;
    const toAngle   = 340 * Math.PI / 180;
    const progress  = (pathT % 360) / 360;

    const p1x = cx + R * 0.7 * Math.cos(fromAngle);
    const p1y = cy + R * 0.5 * Math.sin(fromAngle);
    const p2x = cx + R * 0.8 * Math.cos(toAngle);
    const p2y = cy + R * 0.4 * Math.sin(toAngle);
    const cpx = cx, cpy = cy - R * 0.6;

    // Trail
    c.save();
    c.strokeStyle = 'rgba(26, 107, 74, 0.5)';
    c.lineWidth = 1.5;
    c.setLineDash([4, 4]);
    c.beginPath();
    c.moveTo(p1x, p1y);
    c.quadraticCurveTo(cpx, cpy, p2x, p2y);
    c.stroke();
    c.setLineDash([]);
    c.restore();

    // Plane on path
    const bx = bezierPoint(p1x, cpx, p2x, progress);
    const by = bezierPoint(p1y, cpy, p2y, progress);
    const bx2 = bezierPoint(p1x, cpx, p2x, Math.min(progress + 0.01, 1));
    const by2 = bezierPoint(p1y, cpy, p2y, Math.min(progress + 0.01, 1));
    const angle = Math.atan2(by2 - by, bx2 - bx);

    drawPlaneIcon(c, bx, by, angle, 14, '#1a6b4a', 1);

    // Dot markers
    [{ x: p1x, y: p1y }, { x: p2x, y: p2y }].forEach((pt, i) => {
      c.beginPath();
      c.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      c.fillStyle = '#1a6b4a';
      c.fill();
      c.beginPath();
      c.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      c.strokeStyle = 'rgba(26,107,74,0.3)';
      c.lineWidth = 1.5;
      c.stroke();
    });

    t++;
    requestAnimationFrame(drawGlobe);
  };

  drawGlobe();
}

/* ================================================
   MATH UTILITIES
   ================================================ */

/** Quadratic bezier single axis interpolation */
function bezierPoint(p0, p1, p2, t) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

/** Great-circle distance in km */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
    * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Initial bearing between two points (degrees) */
function bearing(lat1, lng1, lat2, lng2) {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

/** Mercator projection: lat/lng → canvas x/y */
function mercator(lat, lng, canvasW, canvasH, margin = 40) {
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const x = margin + ((lng + 180) / 360) * (canvasW - margin * 2);
  const y = margin + ((1 - mercN / Math.PI) / 2) * (canvasH - margin * 2);
  return { x, y };
}

/** Ease in-out cubic */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Format km */
function fmtKm(km) {
  return km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${Math.round(km)} km`;
}

/** Estimate flight time (avg 900km/h) */
function estFlightTime(km) {
  const hrs = km / 900;
  if (hrs < 1) return `${Math.round(hrs * 60)}min`;
  const h = Math.floor(hrs), m = Math.round((hrs - h) * 60);
  return `${h}h ${m}m`;
}

/* ================================================
   AUTOCOMPLETE
   ================================================ */
function setupAutocomplete(input, listEl, onSelect) {
  let current = -1;
  let filtered = [];

  const show = (items) => {
    filtered = items;
    listEl.innerHTML = '';
    if (!items.length) { listEl.classList.remove('open'); return; }
    items.slice(0, 6).forEach((city, i) => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.innerHTML = `<span class="city-flag">${city.flag}</span>${city.name}<small style="margin-left:auto;opacity:0.5;font-size:0.8em">${city.country}</small>`;
      div.addEventListener('mousedown', e => {
        e.preventDefault();
        onSelect(city);
        input.value = city.name;
        listEl.classList.remove('open');
      });
      listEl.appendChild(div);
    });
    listEl.classList.add('open');
    current = -1;
  };

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { listEl.classList.remove('open'); return; }
    show(CITIES.filter(c => c.name.toLowerCase().startsWith(q) || c.name.toLowerCase().includes(q)));
  });

  input.addEventListener('keydown', e => {
    const items = listEl.querySelectorAll('.autocomplete-item');
    if (e.key === 'ArrowDown') { current = Math.min(current + 1, items.length - 1); }
    else if (e.key === 'ArrowUp') { current = Math.max(current - 1, 0); }
    else if (e.key === 'Enter') {
      if (current >= 0 && filtered[current]) {
        onSelect(filtered[current]);
        input.value = filtered[current].name;
        listEl.classList.remove('open');
      }
      return;
    } else if (e.key === 'Escape') { listEl.classList.remove('open'); return; }
    items.forEach((el, i) => el.classList.toggle('active', i === current));
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !listEl.contains(e.target)) {
      listEl.classList.remove('open');
    }
  });
}

/* ================================================
   CANVAS SETUP
   ================================================ */
function setupCanvas() {
  const container = document.querySelector('.canvas-container');
  const canvas = DOM.mainCanvas;
  // Size to container
  const resize = () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };
  resize();
  window.addEventListener('resize', () => {
    resize();
    if (!DOM.placeholder.classList.contains('hidden')) return;
    // Redraw if animation was done
    if (!state.animating && state.progress >= 1) {
      drawFrame(1);
    }
  });
  ctx = canvas.getContext('2d');
}

/* ================================================
   WORLD MAP DRAWING
   ================================================ */
function drawWorldMap(style) {
  const W = DOM.mainCanvas.width;
  const H = DOM.mainCanvas.height;

  // Background
  if (style === 'dark') {
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);
  } else if (style === 'minimal') {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#f0f7f4');
    bg.addColorStop(1, '#e8f3fb');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  } else {
    // World style — ocean gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#e8f4f0');
    bg.addColorStop(0.5, '#d4ecf7');
    bg.addColorStop(1, '#e0f4e8');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  // Latitude grid lines
  const gridColor = style === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(26,107,74,0.06)';
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.6;
  // Horizontal (latitude)
  for (let lat = -80; lat <= 80; lat += 20) {
    const { y } = mercator(lat, 0, W, H, 0);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  // Vertical (longitude)
  for (let lng = -180; lng <= 180; lng += 20) {
    const { x } = mercator(0, lng, W, H, 0);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Land polygons
  const landFill = style === 'dark'
    ? 'rgba(30, 80, 55, 0.7)'
    : style === 'minimal'
      ? 'rgba(200, 225, 210, 0.7)'
      : 'rgba(180, 220, 195, 0.75)';
  const landStroke = style === 'dark'
    ? 'rgba(50, 140, 90, 0.4)'
    : 'rgba(100, 160, 120, 0.3)';

  ctx.fillStyle = landFill;
  ctx.strokeStyle = landStroke;
  ctx.lineWidth = 0.8;

  WORLD_OUTLINES.forEach(poly => {
    if (poly.length < 3) return;
    ctx.beginPath();
    poly.forEach(([lng, lat], i) => {
      const { x, y } = mercator(lat, lng, W, H, 0);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
}

/* ================================================
   PLANE ICON (canvas)
   ================================================ */
function drawPlaneIcon(c, x, y, angle, size, color, alpha) {
  c.save();
  c.globalAlpha = alpha;
  c.translate(x, y);
  c.rotate(angle);
  c.scale(size / 12, size / 12);

  // Shadow
  c.shadowColor = 'rgba(0,0,0,0.25)';
  c.shadowBlur = 6;

  // Body
  c.beginPath();
  c.moveTo(12, 0);
  c.lineTo(-8, -4);
  c.lineTo(-6, 0);
  c.lineTo(-8, 4);
  c.closePath();
  c.fillStyle = color;
  c.fill();

  // Wing
  c.beginPath();
  c.moveTo(2, 0);
  c.lineTo(-2, -10);
  c.lineTo(-6, -8);
  c.lineTo(-4, 0);
  c.closePath();
  c.fillStyle = color;
  c.fill();

  ctx && (c.shadowBlur = 0);

  // Tail
  c.beginPath();
  c.moveTo(-5, 0);
  c.lineTo(-8, -5);
  c.lineTo(-10, -4);
  c.lineTo(-8, 0);
  c.closePath();
  c.fillStyle = color;
  c.fill();

  c.restore();
}

/* ================================================
   MAIN DRAW FRAME
   ================================================ */
function drawFrame(progress) {
  if (!ctx) return;

  const W = DOM.mainCanvas.width;
  const H = DOM.mainCanvas.height;
  const from = state.fromCity;
  const to   = state.toCity;

  // Clear
  ctx.clearRect(0, 0, W, H);

  // Map
  drawWorldMap(state.mapStyle);

  if (!from || !to) return;

  // Get screen positions
  const fp = mercator(from.lat, from.lng, W, H);
  const tp = mercator(to.lat, to.lng, W, H);

  // Control point for arc (perpendicular, 1/3 of distance above midpoint)
  const mx = (fp.x + tp.x) / 2;
  const my = (fp.y + tp.y) / 2;
  const dx = tp.x - fp.x;
  const dy = tp.y - fp.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const arcHeight = Math.min(dist * 0.35, Math.min(W, H) * 0.3);
  const cpx = mx - (dy / dist) * arcHeight;
  const cpy = my + (dx / dist) * arcHeight;

  // ---- TRAIL ---- //
  if (state.showTrail && progress > 0) {
    const segments = 80;
    const steps = Math.floor(segments * progress);

    if (state.trailStyle === 'dotted') {
      ctx.fillStyle = hexToRgba(state.accentColor, 0.5);
      for (let i = 0; i <= steps; i++) {
        const t = i / segments;
        const x = bezierPoint(fp.x, cpx, tp.x, t);
        const y = bezierPoint(fp.y, cpy, tp.y, t);
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // Draw the trail as segments with gradient opacity
      ctx.save();
      ctx.lineCap = 'round';

      // Full path clipping
      const trailProgress = progress;
      const clipPath = buildBezierClipPath(fp, { x: cpx, y: cpy }, tp, trailProgress, W, H);

      // Glow pass
      ctx.save();
      ctx.strokeStyle = hexToRgba(state.accentColor, 0.15);
      ctx.lineWidth = 8;
      ctx.beginPath();
      traceBezier(ctx, fp.x, fp.y, cpx, cpy, tp.x, tp.y, trailProgress);
      ctx.stroke();
      ctx.restore();

      // Main line
      if (state.trailStyle === 'dashed') {
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -progress * 40;
      }
      ctx.strokeStyle = hexToRgba(state.accentColor, 0.7);
      ctx.lineWidth = 2;
      ctx.beginPath();
      traceBezier(ctx, fp.x, fp.y, cpx, cpy, tp.x, tp.y, trailProgress);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
  }

  // ---- ORIGIN MARKER ---- //
  drawLocationMarker(ctx, fp.x, fp.y, state.accentColor, 'FROM', from.name, 'left', state.showLabels, state.mapStyle);

  // ---- DESTINATION MARKER ---- //
  if (progress >= 0.95) {
    drawLocationMarker(ctx, tp.x, tp.y, state.accentColor, 'TO', to.name, 'right', state.showLabels, state.mapStyle);
  } else if (progress > 0.7) {
    const alpha = (progress - 0.7) / 0.25;
    ctx.globalAlpha = alpha;
    drawLocationMarker(ctx, tp.x, tp.y, state.accentColor, 'TO', to.name, 'right', state.showLabels, state.mapStyle);
    ctx.globalAlpha = 1;
  }

  // ---- PLANE ---- //
  if (progress > 0 && progress < 1) {
    const t1 = progress;
    const t2 = Math.min(progress + 0.005, 1);
    const px  = bezierPoint(fp.x, cpx, tp.x, t1);
    const py  = bezierPoint(fp.y, cpy, tp.y, t1);
    const px2 = bezierPoint(fp.x, cpx, tp.x, t2);
    const py2 = bezierPoint(fp.y, cpy, tp.y, t2);
    const planeAngle = Math.atan2(py2 - py, px2 - px);
    const planeSize = Math.min(W, H) * 0.04;

    drawPlaneIcon(ctx, px, py, planeAngle, planeSize, state.accentColor, 1);

    // Speed lines behind plane
    if (state.speed >= 4) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = state.accentColor;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        const bt = Math.max(0, progress - i * 0.015);
        const bx = bezierPoint(fp.x, cpx, tp.x, bt);
        const by = bezierPoint(fp.y, cpy, tp.y, bt);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // ---- ARRIVAL EFFECT ---- //
  if (progress >= 1) {
    drawPlaneIcon(ctx, tp.x, tp.y, Math.atan2(tp.y - fp.y, tp.x - fp.x), Math.min(W, H) * 0.035, state.accentColor, 1);
    // Ripple rings
    const rippleAnim = (Date.now() % 2000) / 2000;
    for (let i = 0; i < 3; i++) {
      const r = (rippleAnim + i / 3) % 1;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, r * 30 + 6, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(state.accentColor, (1 - r) * 0.5);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    // Keep redrawing for ripple
    requestAnimationFrame(() => { if (state.progress >= 1) drawFrame(1); });
  }
}

/* ------------------------------------------------
   Helper: Trace bezier to a progress point
   ------------------------------------------------ */
function traceBezier(c, x0, y0, cx, cy, x1, y1, progress) {
  c.moveTo(x0, y0);
  const steps = 60;
  for (let i = 1; i <= Math.floor(steps * progress); i++) {
    const t = i / steps;
    c.lineTo(bezierPoint(x0, cx, x1, t), bezierPoint(y0, cy, y1, t));
  }
}

function buildBezierClipPath(from, cp, to, progress, W, H) {
  /* Not used for actual clipping, kept for reference */
}

/* ------------------------------------------------
   Helper: Location marker with label
   ------------------------------------------------ */
function drawLocationMarker(c, x, y, color, tag, cityName, side, showLabel, mapStyle) {
  const isDark = mapStyle === 'dark';

  // Pulse ring
  c.beginPath();
  c.arc(x, y, 10, 0, Math.PI * 2);
  c.strokeStyle = hexToRgba(color, 0.25);
  c.lineWidth = 3;
  c.stroke();

  // Outer ring
  c.beginPath();
  c.arc(x, y, 6, 0, Math.PI * 2);
  c.strokeStyle = hexToRgba(color, 0.5);
  c.lineWidth = 1.5;
  c.stroke();

  // Dot
  c.beginPath();
  c.arc(x, y, 4, 0, Math.PI * 2);
  c.fillStyle = color;
  c.fill();
  c.strokeStyle = '#fff';
  c.lineWidth = 1.5;
  c.stroke();

  if (!showLabel) return;

  // Label
  const lx = side === 'left' ? x - 14 : x + 14;
  const ly = y - 20;

  c.save();
  c.font = 'bold 10px "Cormorant Garamond", serif';
  const tagW = c.measureText(tag).width;
  c.font = '11px "Cormorant Garamond", serif';
  const nameW = c.measureText(cityName).width;
  const boxW = Math.max(tagW, nameW) + 16;
  const boxH = 34;
  const bx = side === 'left' ? lx - boxW : lx;
  const by = ly - boxH / 2;

  // Box shadow
  c.shadowColor = 'rgba(0,0,0,0.15)';
  c.shadowBlur = 8;

  // Box background
  c.fillStyle = isDark ? 'rgba(15, 40, 25, 0.92)' : 'rgba(255, 255, 255, 0.92)';
  roundRect(c, bx, by, boxW, boxH, 6);
  c.fill();

  // Box border
  c.shadowBlur = 0;
  c.strokeStyle = hexToRgba(color, 0.4);
  c.lineWidth = 1;
  roundRect(c, bx, by, boxW, boxH, 6);
  c.stroke();

  // Tag label
  c.fillStyle = color;
  c.font = 'bold 8px "Cormorant Garamond", serif';
  c.letterSpacing = '0.1em';
  c.fillText(tag, bx + 8, by + 12);

  // City name
  c.fillStyle = isDark ? '#e8f4f0' : '#1a2117';
  c.font = '11px "Cormorant Garamond", serif';
  c.fillText(cityName, bx + 8, by + 26);

  // Connector line
  const lineFromX = side === 'left' ? bx + boxW : bx;
  c.strokeStyle = hexToRgba(color, 0.3);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(lineFromX, by + boxH / 2);
  c.lineTo(x, y);
  c.stroke();

  c.restore();
}

/* ---- round rect helper ---- */
function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
}

/* ---- hex to rgba ---- */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ================================================
   ANIMATION LOOP
   ================================================ */
function startAnimation() {
  if (state.rafId) cancelAnimationFrame(state.rafId);
  state.animating = true;
  state.paused = false;
  state.startTime = null;
  state.progress = 0;

  const speedFactor = [0.3, 0.5, 1, 1.6, 2.5][state.speed - 1];
  const totalMs = (state.duration / speedFactor) * 1000;

  setStageStatus('active', 'Animating…');
  updatePlayIcon(true);
  DOM.btnPlay.disabled = false;
  DOM.btnRewind.disabled = false;

  const tick = (timestamp) => {
    if (!state.animating) return;
    if (state.paused) { state.rafId = requestAnimationFrame(tick); return; }

    if (!state.startTime) state.startTime = timestamp;
    const elapsed = timestamp - state.startTime;
    const rawProgress = Math.min(elapsed / totalMs, 1);
    state.progress = easeInOutCubic(rawProgress);

    drawFrame(state.progress);
    updateHUD(state.progress);

    if (rawProgress < 1) {
      state.rafId = requestAnimationFrame(tick);
    } else {
      state.progress = 1;
      drawFrame(1);
      updateHUD(1);
      if (state.loop) {
        setTimeout(() => {
          state.startTime = null;
          state.progress = 0;
          state.rafId = requestAnimationFrame(tick);
        }, 1200);
      } else {
        state.animating = false;
        setStageStatus('active', 'Animation complete');
        updatePlayIcon(false);
      }
    }
  };

  state.rafId = requestAnimationFrame(tick);
}

function pauseAnimation() {
  state.paused = !state.paused;
  updatePlayIcon(!state.paused);
  setStageStatus(state.paused ? 'loading' : 'active', state.paused ? 'Paused' : 'Animating…');
}

function rewindAnimation() {
  if (state.rafId) cancelAnimationFrame(state.rafId);
  state.startTime = null;
  state.progress = 0;
  state.paused = false;
  drawFrame(0);
  updateHUD(0);
  startAnimation();
}

/* ================================================
   HUD UPDATE
   ================================================ */
function updateHUD(progress) {
  DOM.progressBar.style.width = `${progress * 100}%`;
  DOM.progressTime.textContent = `${Math.round(progress * 100)}%`;

  const from = state.fromCity;
  const to   = state.toCity;
  if (!from || !to) return;

  DOM.fromLabel.textContent = from.name;
  DOM.toLabel.textContent   = to.name;

  const km = haversineKm(from.lat, from.lng, to.lat, to.lng);
  const br = bearing(from.lat, from.lng, to.lat, to.lng);
  DOM.statDist.textContent = fmtKm(km);
  DOM.statBear.textContent = `${Math.round(br)}°`;
  DOM.statTime.textContent = estFlightTime(km);
  DOM.statProg.textContent = `${Math.round(progress * 100)}%`;
}

function setStageStatus(type, msg) {
  DOM.stageStatus.textContent = msg;
  const dot = DOM.stageInfo.querySelector('.dot');
  dot.className = `dot dot-${type}`;
}

function updatePlayIcon(playing) {
  DOM.playIcon.innerHTML = playing
    ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
    : '<path d="M5 3l14 9-14 9V3z"/>';
}

/* ================================================
   GENERATE
   ================================================ */
async function generate() {
  const fromName = DOM.fromInput.value.trim();
  const toName   = DOM.toInput.value.trim();

  if (!fromName || !toName) {
    showToast('Please enter both departure and destination cities', 'error');
    return;
  }

  // Find cities
  const from = CITIES.find(c => c.name.toLowerCase() === fromName.toLowerCase())
             || CITIES.find(c => c.name.toLowerCase().includes(fromName.toLowerCase()));
  const to   = CITIES.find(c => c.name.toLowerCase() === toName.toLowerCase())
             || CITIES.find(c => c.name.toLowerCase().includes(toName.toLowerCase()));

  if (!from) { showToast(`City not found: "${fromName}"`, 'error'); return; }
  if (!to)   { showToast(`City not found: "${toName}"`, 'error'); return; }
  if (from === to) { showToast('Please choose different cities', 'error'); return; }

  state.fromCity = from;
  state.toCity   = to;

  // Loading
  DOM.loadingOverlay.classList.remove('hidden');
  DOM.loadingText.textContent = 'Resolving coordinates…';
  await delay(400);
  DOM.loadingText.textContent = 'Building flight path…';
  await delay(500);
  DOM.loadingText.textContent = 'Initializing canvas…';
  await delay(300);
  DOM.loadingOverlay.classList.add('hidden');

  // Show canvas
  DOM.placeholder.classList.add('hidden');

  // Stats
  updateHUD(0);

  // Start
  startAnimation();
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ================================================
   RESET
   ================================================ */
function resetAll() {
  if (state.rafId) cancelAnimationFrame(state.rafId);
  state.animating = false;
  state.paused = false;
  state.progress = 0;
  state.fromCity = null;
  state.toCity = null;

  DOM.fromInput.value = '';
  DOM.toInput.value = '';
  DOM.fromList.classList.remove('open');
  DOM.toList.classList.remove('open');
  DOM.placeholder.classList.remove('hidden');
  DOM.progressBar.style.width = '0%';
  DOM.progressTime.textContent = '0%';
  DOM.fromLabel.textContent = '—';
  DOM.toLabel.textContent = '—';
  DOM.statDist.textContent = '—';
  DOM.statBear.textContent = '—';
  DOM.statTime.textContent = '—';
  DOM.statProg.textContent = '—';
  DOM.btnPlay.disabled = true;
  DOM.btnRewind.disabled = true;
  setStageStatus('idle', 'Ready to generate');
  updatePlayIcon(false);

  if (ctx) ctx.clearRect(0, 0, DOM.mainCanvas.width, DOM.mainCanvas.height);
}

/* ================================================
   SCREENSHOT
   ================================================ */
function takeScreenshot() {
  if (!state.fromCity || !state.toCity) {
    showToast('Generate an animation first', 'error');
    return;
  }
  const link = document.createElement('a');
  link.download = `edge-animation-${state.fromCity.name}-${state.toCity.name}.png`;
  link.href = DOM.mainCanvas.toDataURL('image/png');
  link.click();
  showToast('Screenshot saved!', 'success');
}

/* ================================================
   VIDEO RECORDING (MediaRecorder API)
   ================================================ */
async function toggleRecording() {
  if (state.recording) {
    stopRecording();
  } else {
    startRecording();
  }
}

async function startRecording() {
  if (!state.fromCity || !state.toCity) {
    showToast('Generate an animation first', 'error');
    return;
  }

  try {
    const stream = DOM.mainCanvas.captureStream(30); // 30fps
    state.recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    state.chunks = [];

    state.recorder.ondataavailable = e => {
      if (e.data.size > 0) state.chunks.push(e.data);
    };

    state.recorder.onstop = () => {
      const blob = new Blob(state.chunks, { type: 'video/webm' });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `edge-animation-${state.fromCity.name}-${state.toCity.name}.webm`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Video downloaded!', 'success');
      DOM.recordStatus.textContent = 'Video saved ✓';
    };

    state.recorder.start();
    state.recording = true;

    DOM.btnRecord.textContent = '⏹ Stop Recording';
    DOM.recordStatus.classList.remove('hidden');
    DOM.recordStatus.textContent = '🔴 Recording…';

    // Rewind and play from start
    rewindAnimation();
  } catch (err) {
    showToast('Recording not supported in this browser', 'error');
    console.error(err);
  }
}

function stopRecording() {
  if (state.recorder && state.recorder.state !== 'inactive') {
    state.recorder.stop();
  }
  state.recording = false;
  DOM.btnRecord.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
    </svg>
    Record Video`;
}

/* ================================================
   TOAST
   ================================================ */
let toastTimer;
function showToast(msg, type = '') {
  clearTimeout(toastTimer);
  DOM.toast.textContent = msg;
  DOM.toast.className = `toast ${type}`;
  toastTimer = setTimeout(() => {
    DOM.toast.classList.add('hidden');
  }, 3000);
}

/* ================================================
   GALLERY
   ================================================ */
function buildGallery() {
  DOM.galleryGrid.innerHTML = '';
  PRESET_ROUTES.forEach(route => {
    const from = CITIES.find(c => c.name === route.from);
    const to   = CITIES.find(c => c.name === route.to);
    if (!from || !to) return;

    const km = Math.round(haversineKm(from.lat, from.lng, to.lat, to.lng));
    const div = document.createElement('div');
    div.className = 'gallery-card';
    div.innerHTML = `
      <div class="gallery-card-route">${route.emoji} ${from.name} → ${to.name}</div>
      <div class="gallery-card-info">${from.flag} ${from.country} → ${to.flag} ${to.country}</div>
      <div class="gallery-card-dist">${fmtKm(km)} · ${estFlightTime(km)}</div>
    `;
    div.addEventListener('click', () => {
      DOM.fromInput.value = route.from;
      DOM.toInput.value   = route.to;
      document.getElementById('studio').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => generate(), 600);
    });
    DOM.galleryGrid.appendChild(div);
  });
}

/* ================================================
   EVENT LISTENERS
   ================================================ */
function bindEvents() {
  // Autocomplete
  setupAutocomplete(DOM.fromInput, DOM.fromList, city => { state.fromCity = city; });
  setupAutocomplete(DOM.toInput,   DOM.toList,   city => { state.toCity   = city; });

  // Generate
  DOM.btnGenerate.addEventListener('click', generate);

  // Enter key on inputs
  [DOM.fromInput, DOM.toInput].forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
  });

  // Reset
  DOM.btnReset.addEventListener('click', resetAll);

  // Play/Pause
  DOM.btnPlay.addEventListener('click', () => {
    if (state.animating || state.paused) pauseAnimation();
  });

  // Rewind
  DOM.btnRewind.addEventListener('click', () => {
    if (state.fromCity && state.toCity) rewindAnimation();
  });

  // Screenshot
  DOM.btnScreenshot.addEventListener('click', takeScreenshot);

  // Record
  DOM.btnRecord.addEventListener('click', toggleRecording);

  // Speed slider
  DOM.speedSlider.addEventListener('input', () => {
    state.speed = +DOM.speedSlider.value;
    const labels = ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'];
    DOM.speedLabel.textContent = labels[state.speed - 1];
  });

  // Duration slider
  DOM.durationSlider.addEventListener('input', () => {
    state.duration = +DOM.durationSlider.value;
    DOM.durationLabel.textContent = `${state.duration}s`;
  });

  // Trail style
  document.getElementById('trailStyle').addEventListener('click', e => {
    const btn = e.target.closest('.toggle-btn');
    if (!btn) return;
    document.querySelectorAll('#trailStyle .toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.trailStyle = btn.dataset.val;
  });

  // Map style
  document.getElementById('mapStyle').addEventListener('click', e => {
    const btn = e.target.closest('.toggle-btn');
    if (!btn) return;
    document.querySelectorAll('#mapStyle .toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mapStyle = btn.dataset.val;

    // Update CSS vars for dark mode feel
    const root = document.documentElement;
    if (state.mapStyle === 'dark') {
      root.style.setProperty('--bg', '#0d1117');
    } else {
      root.style.setProperty('--bg', '#f5f7f2');
    }
  });

  // Color swatches
  document.getElementById('colorTheme').addEventListener('click', e => {
    const btn = e.target.closest('.swatch');
    if (!btn) return;
    document.querySelectorAll('.swatch').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.accentColor = btn.dataset.color;
    // Update CSS variable
    document.documentElement.style.setProperty('--accent', state.accentColor);
    // Derive lighter version
    document.documentElement.style.setProperty('--accent-light', state.accentColor + 'cc');
    document.documentElement.style.setProperty('--accent-faint', hexToRgba(state.accentColor, 0.08));
    document.documentElement.style.setProperty('--border', hexToRgba(state.accentColor, 0.15));
  });

  // Checkboxes
  DOM.showLabels.addEventListener('change', () => { state.showLabels = DOM.showLabels.checked; });
  DOM.showTrail.addEventListener('change',  () => { state.showTrail  = DOM.showTrail.checked;  });
  DOM.loopAnim.addEventListener('change',   () => { state.loop       = DOM.loopAnim.checked;   });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ' && (state.animating || state.paused)) {
      e.preventDefault();
      pauseAnimation();
    }
    if (e.key === 'r') rewindAnimation();
  });
}

/* ================================================
   INIT
   ================================================ */
function init() {
  setupCanvas();
  initHeroGlobe();
  buildGallery();
  bindEvents();

  // Initial status
  setStageStatus('idle', 'Ready to generate');
  DOM.btnPlay.disabled = true;
  DOM.btnRewind.disabled = true;

  console.log('%cEDGE ANIMATION', 'font-size:20px;font-weight:bold;color:#1a6b4a;');
  console.log('%cFlight Path Visualizer — Vanilla JS', 'color:#5a6b57;');
}

// Boot
document.addEventListener('DOMContentLoaded', init);
