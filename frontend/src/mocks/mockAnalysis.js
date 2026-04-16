const cache = new Map();

const getGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  return 'C-';
};

const hashSeed = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) || 42;
};

const generateShotPositions = (seed) => {
  const rand = (min, max, offset) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };
  const shotTypes = [
    { type: 'smash', color: '#ef4444', zone: 'back' },
    { type: 'clear', color: '#3b82f6', zone: 'mid' },
    { type: 'drop', color: '#f59e0b', zone: 'mid' },
    { type: 'netKill', color: '#10b981', zone: 'front' },
    { type: 'drive', color: '#8b5cf6', zone: 'mid' },
  ];
  const total = rand(10, 15, 100);
  const shots = [];
  for (let i = 0; i < total; i++) {
    const st = shotTypes[rand(0, shotTypes.length - 1, i * 10)];
    let x, y;
    if (st.zone === 'back') {
      x = rand(140, 470, i * 5); y = rand(80, 250, i * 7);
    } else if (st.zone === 'front') {
      x = rand(140, 470, i * 5); y = rand(630, 800, i * 7);
    } else {
      x = rand(140, 470, i * 5); y = rand(350, 530, i * 7);
    }
    shots.push({
      id: `shot-${i}`,
      type: st.type,
      color: st.color,
      x, y,
      timestamp: rand(5, 90, i * 3),
      accuracy: rand(60, 95, i * 11),
      power: rand(70, 100, i * 13),
      outcome: rand(0, 1, i * 17) === 1 ? 'success' : 'miss',
    });
  }
  return shots;
};

const generateMovementDensity = (seed) => {
  const rand = (min, max, offset) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };
  const cells = [];
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 8; col++) {
      const dc = Math.abs(col - 4);
      const dm = Math.abs(row - 10);
      const base = 100 - (dc * 10 + dm * 3);
      cells.push({ x: col, y: row, density: Math.max(0, Math.min(100, base + rand(-20, 20, row * 8 + col))) });
    }
  }
  return cells;
};

export function getAnalysisFor(videoId, baseScore = 72) {
  const key = `${videoId}:${baseScore}`;
  if (cache.has(key)) return cache.get(key);

  const seed = hashSeed(videoId || 'v-default');
  const rand = (min, max, offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const clamp = (v) => Math.max(20, Math.min(100, v));
  const skills = {
    footwork: clamp(baseScore + rand(-20, 20, 1)),
    netPlay: clamp(baseScore + rand(-15, 15, 2)),
    defense: clamp(baseScore + rand(-25, 10, 3)),
    smash: clamp(baseScore + rand(-10, 25, 4)),
    endurance: clamp(baseScore + rand(-20, 15, 5)),
  };

  const shots = {
    totalShots: rand(30, 60, 6),
    smashes: { count: rand(8, 15, 7), accuracy: rand(65, 90, 8), avgPower: rand(75, 95, 9) },
    netPlay: { count: rand(5, 12, 10), accuracy: rand(60, 85, 11), avgTouch: rand(55, 80, 12) },
    clears: { count: rand(6, 14, 13), accuracy: rand(70, 90, 14), avgHeight: rand(75, 95, 15) },
    dropShots: { count: rand(4, 12, 16), accuracy: rand(55, 80, 17), avgDeception: rand(60, 85, 18) },
    drives: { count: rand(3, 10, 19), accuracy: rand(60, 85, 20), avgSpeed: rand(70, 90, 21) },
  };

  const momentTitles = {
    strength: ['Powerful Smash', 'Quick Net Play', 'Excellent Footwork', 'Solid Defense'],
    weakness: ['Footwork Recovery', 'Net Play Timing', 'Defense Positioning', 'Shot Selection'],
    highlight: ['Match-Winning Point', 'Spectacular Rally', 'Perfect Shot', 'Great Recovery'],
  };
  const momentDesc = {
    strength: ['Excellent shoulder rotation', 'Quick reaction time', 'Efficient movement', 'Strong positioning'],
    weakness: ['Needs improvement', 'Timing could be better', 'Watch your positioning', 'Consider shot variety'],
    highlight: ['Outstanding execution', 'Perfect technique', 'Incredible athleticism', 'Masterful control'],
  };
  const momentThumbs = [
    '/assets/thumbnail1.webp',
    '/assets/thumbnail2.webp',
    '/assets/thumbnail3.webp',
    '/assets/thumbnail4.webp',
  ];
  const types = ['strength', 'weakness', 'highlight'];
  const skillNames = ['footwork', 'netPlay', 'defense', 'smash'];

  const numMoments = rand(3, 5, 22);
  const keyMoments = Array.from({ length: numMoments }, (_, i) => {
    const t = types[rand(0, 2, 23 + i)];
    const titles = momentTitles[t];
    const descs = momentDesc[t];
    return {
      timestamp: rand(5, 120, 24 + i),
      type: t,
      title: titles[rand(0, titles.length - 1, 25 + i)],
      description: descs[rand(0, descs.length - 1, 26 + i)],
      skill: skillNames[rand(0, skillNames.length - 1, 27 + i)],
      score: rand(t === 'weakness' ? 40 : 75, t === 'highlight' ? 98 : 85, 28 + i),
      thumbnail: momentThumbs[i % momentThumbs.length],
    };
  });

  const sortedSkills = Object.entries(skills).sort((a, b) => b[1] - a[1]);
  const topSkills = sortedSkills.slice(0, 2);
  const weakSkills = sortedSkills.slice(-2);
  const insights = {
    strengths: [
      `Powerful ${topSkills[0][0]} execution showing excellent technique`,
      `Excellent ${topSkills[1][0]} performance with consistent quality`,
    ],
    weaknesses: [`${weakSkills[0][0]} recovery speed needs improvement`],
    suggestions: [
      `Practice ${weakSkills[0][0]} drills to build consistency`,
      `Work on ${weakSkills[1][0]} exercises to strengthen fundamentals`,
    ],
  };

  const drillLib = [
    { name: 'Perfect Doubles Net Shot', duration: '15 min', difficulty: 'Medium', focus: 'Net Play & Control', description: 'Precision net shot drill for doubles play', icon: '🎯', thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&h=120&fit=crop' },
    { name: 'Smash Defense Training', duration: '20 min', difficulty: 'Hard', focus: 'Defense & Recovery', description: 'Defensive drills against powerful smashes', icon: '🛡️', thumbnail: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=200&h=120&fit=crop' },
    { name: 'Footwork Fundamentals', duration: '15 min', difficulty: 'Medium', focus: 'Footwork & Movement', description: 'Shadow footwork to improve court coverage', icon: '🏃‍♂️', thumbnail: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=200&h=120&fit=crop' },
    { name: 'Smash Power Training', duration: '10 min', difficulty: 'Hard', focus: 'Power & Technique', description: 'High-intensity smash drills with form focus', icon: '💥', thumbnail: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=200&h=120&fit=crop' },
    { name: 'Endurance Circuit', duration: '25 min', difficulty: 'Hard', focus: 'Stamina & Conditioning', description: 'Multi-drill circuit to build match endurance', icon: '⚡', thumbnail: 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?w=200&h=120&fit=crop' },
  ];

  const recommendedDrills = drillLib.slice(0, 3).map((d, i) => ({ ...d, id: `drill_${videoId}_${i}` }));

  const comparison = {
    vsAverage: { overall: rand(-10, 15, 34) },
    vsPreviousVideo: { overall: rand(-5, 8, 40), improvementHighlight: topSkills[0][0] },
  };

  const heatmapData = {
    shotPositions: generateShotPositions(seed),
    movementDensity: generateMovementDensity(seed),
  };

  const durationMin = rand(20, 45, 41);
  const intensityMultiplier = skills.endurance / 70;
  const estimatedCalories = Math.round(5 * intensityMultiplier * durationMin);
  const activity = {
    estimatedSteps: rand(2500, 5000, 42),
    distanceMeters: rand(500, 1500, 43),
    estimatedCalories,
    intensity: skills.endurance >= 75 ? 'high' : skills.endurance >= 50 ? 'moderate' : 'low',
    durationMin,
    predictedSetKcal: 96,
    predictedSetSteps: 1920,
    playerLevel: 'Intermediate',
  };

  const analysis = {
    overallScore: baseScore,
    performanceGrade: getGrade(baseScore),
    skills,
    shots,
    keyMoments,
    insights,
    recommendedDrills,
    comparison,
    heatmapData,
    activity,
  };

  cache.set(key, analysis);
  return analysis;
}
