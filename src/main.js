import './styles.css';

const themes = [
  {
    id: 'newyear',
    name: '新年焕新',
    description: '红金气氛，烟花与灯笼',
    colors: ['#F40024', '#FFCA61', '#F74A1E'],
    accent: '#FFD166',
    tagline: '新年好运来',
    sticker: '🎆',
    shape: 'round'
  },
  {
    id: 'graduation',
    name: '毕业纪念',
    description: '黑金帽穗，沉稳纪念',
    colors: ['#0F172A', '#B68C3A', '#E1C16E'],
    accent: '#F0E7CF',
    tagline: '前程似锦',
    sticker: '🎓',
    shape: 'square'
  },
  {
    id: 'fandom',
    name: '粉丝应援',
    description: '霓虹光效，现场应援',
    colors: ['#7C3AED', '#22D3EE', '#FB37FF'],
    accent: '#C084FC',
    tagline: '一直在现场',
    sticker: '✨',
    shape: 'round'
  },
  {
    id: 'nature',
    name: '绿色守护',
    description: '叶脉渐变，环保守护',
    colors: ['#0EA15D', '#4ADE80', '#22C55E'],
    accent: '#C7F9CC',
    tagline: '为地球续航',
    sticker: '🍃',
    shape: 'round'
  }
];

const fallbackAvatar = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7C3AED"/>
        <stop offset="100%" stop-color="#22D3EE"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="32" fill="url(#bg)"/>
    <circle cx="200" cy="170" r="90" fill="#fff" fill-opacity="0.15"/>
    <text x="200" y="185" text-anchor="middle" font-size="46" fill="#F8FAFC" font-family="Inter, system-ui">Avatar</text>
    <rect x="90" y="260" width="220" height="24" rx="12" fill="#0F172A" fill-opacity="0.35"/>
    <text x="200" y="278" text-anchor="middle" font-size="16" fill="#E2E8F0" font-family="Inter, system-ui">点击上传替换示例</text>
  </svg>
`)}`;

const canvas = document.createElement('canvas');
canvas.width = 900;
canvas.height = 900;
const ctx = canvas.getContext('2d');

const state = {
  image: new Image(),
  imageReady: false,
  theme: themes[0],
  shape: 'round',
  frameWidth: 0.12,
  overlayOpacity: 0.6,
  tagline: themes[0].tagline,
  stickerSize: 84
};

const dom = {};

function init() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <header class="hero">
      <div>
        <p class="eyebrow">社交平台头像边框工厂</p>
        <h1>三步定制：上传头像 · 选主题 · 导出</h1>
        <p class="lede">新年、毕业、粉丝应援、绿色守护等主题，一键加框，适配圆形/方形头像，支持 PNG 透明导出。</p>
        <div class="actions">
          <label class="btn primary">
            <input id="fileInput" type="file" accept="image/*" hidden />
            上传头像
          </label>
          <button id="downloadBtn" class="btn ghost">导出 PNG</button>
          <button id="resetBtn" class="btn text">重置示例</button>
        </div>
      </div>
      <div class="meta">
        <div>· 支持 1024px 输出</div>
        <div>· 渐变描边 + 文案徽标</div>
        <div>· 本地运行，无需上传服务器</div>
      </div>
    </header>
    <main class="layout">
      <section class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">1. 选择主题</p>
            <h3>框体与情绪色</h3>
          </div>
          <button id="shuffleBtn" class="btn ghost small">随机推荐</button>
        </div>
        <div class="theme-grid" id="themeGrid"></div>
      </section>
      <section class="panel preview-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">2. 实时预览</p>
            <h3>调整形状与描边</h3>
          </div>
          <div class="toggles">
            <button id="shapeRound" class="chip active">圆形</button>
            <button id="shapeSquare" class="chip">方形</button>
          </div>
        </div>
        <div class="controls">
          <label class="control">
            <span>描边厚度</span>
            <input id="frameRange" type="range" min="6" max="18" value="12" />
          </label>
          <label class="control">
            <span>内层遮罩</span>
            <input id="overlayRange" type="range" min="0" max="90" value="60" />
          </label>
          <label class="control">
            <span>角标大小</span>
            <input id="stickerRange" type="range" min="48" max="128" value="84" />
          </label>
          <label class="control">
            <span>角标/文案</span>
            <input id="taglineInput" type="text" maxlength="20" placeholder="输入一句宣言" />
          </label>
        </div>
        <div class="preview-wrap">
          <canvas id="avatarCanvas" width="900" height="900" aria-label="生成头像预览"></canvas>
          <div class="tips">导出图片为 1024x1024 PNG，可直接上传至社交平台</div>
        </div>
      </section>
    </main>
  `;

  dom.themeGrid = document.querySelector('#themeGrid');
  dom.fileInput = document.querySelector('#fileInput');
  dom.downloadBtn = document.querySelector('#downloadBtn');
  dom.resetBtn = document.querySelector('#resetBtn');
  dom.shuffleBtn = document.querySelector('#shuffleBtn');
  dom.taglineInput = document.querySelector('#taglineInput');
  dom.frameRange = document.querySelector('#frameRange');
  dom.overlayRange = document.querySelector('#overlayRange');
  dom.stickerRange = document.querySelector('#stickerRange');
  dom.shapeRound = document.querySelector('#shapeRound');
  dom.shapeSquare = document.querySelector('#shapeSquare');
  dom.avatarCanvas = document.querySelector('#avatarCanvas');

  renderThemes();
  bindEvents();
  loadFallback();
}

function renderThemes() {
  dom.themeGrid.innerHTML = themes
    .map(
      (theme) => `
      <button class="theme-card" data-id="${theme.id}">
        <div class="theme-swatch" style="background: linear-gradient(135deg, ${theme.colors.join(',')});">
          <span class="badge">${theme.sticker}</span>
        </div>
        <div class="theme-info">
          <div class="theme-name">${theme.name}</div>
          <div class="theme-desc">${theme.description}</div>
        </div>
      </button>
    `
    )
    .join('');
  updateThemeActive();
}

function bindEvents() {
  dom.themeGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.theme-card');
    if (!card) return;
    const theme = themes.find((t) => t.id === card.dataset.id);
    if (!theme) return;
    state.theme = theme;
    state.tagline = theme.tagline;
    state.shape = theme.shape;
    dom.taglineInput.value = theme.tagline;
    updateShapeButtons();
    updateThemeActive();
    draw();
  });

  dom.fileInput.addEventListener('change', handleUpload);
  dom.downloadBtn.addEventListener('click', handleDownload);
  dom.resetBtn.addEventListener('click', loadFallback);
  dom.shuffleBtn.addEventListener('click', () => {
    const index = Math.floor(Math.random() * themes.length);
    const theme = themes[index];
    state.theme = theme;
    state.tagline = theme.tagline;
    state.shape = theme.shape;
    dom.taglineInput.value = theme.tagline;
    updateShapeButtons();
    updateThemeActive();
    draw();
  });

  dom.taglineInput.addEventListener('input', (e) => {
    state.tagline = e.target.value.slice(0, 20);
    draw();
  });

  dom.frameRange.addEventListener('input', (e) => {
    state.frameWidth = Number(e.target.value) / 100;
    draw();
  });

  dom.overlayRange.addEventListener('input', (e) => {
    state.overlayOpacity = Number(e.target.value) / 100;
    draw();
  });

  dom.stickerRange.addEventListener('input', (e) => {
    state.stickerSize = Number(e.target.value);
    draw();
  });

  dom.shapeRound.addEventListener('click', () => {
    state.shape = 'round';
    updateShapeButtons();
    draw();
  });

  dom.shapeSquare.addEventListener('click', () => {
    state.shape = 'square';
    updateShapeButtons();
    draw();
  });
}

function handleUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => setImageSource(e.target?.result);
  reader.readAsDataURL(file);
}

function setImageSource(src) {
  state.image = new Image();
  state.image.onload = () => {
    state.imageReady = true;
    draw();
  };
  state.image.src = src;
}

function loadFallback() {
  dom.fileInput.value = '';
  state.theme = themes[0];
  state.shape = themes[0].shape;
  state.tagline = themes[0].tagline;
  dom.taglineInput.value = state.tagline;
  updateShapeButtons();
  updateThemeActive();
  setImageSource(fallbackAvatar);
}

function handleDownload() {
  const downloadCanvas = document.createElement('canvas');
  downloadCanvas.width = 1024;
  downloadCanvas.height = 1024;
  const downloadCtx = downloadCanvas.getContext('2d');

  downloadCtx.drawImage(
    dom.avatarCanvas,
    0,
    0,
    dom.avatarCanvas.width,
    dom.avatarCanvas.height,
    0,
    0,
    1024,
    1024
  );

  const link = document.createElement('a');
  link.href = downloadCanvas.toDataURL('image/png');
  link.download = `avatar-${state.theme.id}.png`;
  link.click();
}

function updateThemeActive() {
  dom.themeGrid.querySelectorAll('.theme-card').forEach((card) => {
    if (card.dataset.id === state.theme.id) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

function updateShapeButtons() {
  dom.shapeRound.classList.toggle('active', state.shape === 'round');
  dom.shapeSquare.classList.toggle('active', state.shape === 'square');
}

function draw() {
  const target = dom.avatarCanvas;
  const size = target.width;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const margin = 40;
  const renderSize = canvas.width - margin * 2;
  const image = state.image;

  if (state.imageReady) {
    const { sx, sy, sSize } = computeCover(image, renderSize);
    ctx.save();
    if (state.shape === 'round') {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, renderSize / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(
      image,
      sx,
      sy,
      sSize,
      sSize,
      margin,
      margin,
      renderSize,
      renderSize
    );
    ctx.restore();
  }

  ctx.fillStyle = `rgba(0,0,0,${state.overlayOpacity})`;
  ctx.fillRect(margin, margin, renderSize, renderSize);

  drawFrame(renderSize, margin);
  drawSticker(renderSize, margin);
  drawTagline(renderSize, margin);

  target.getContext('2d').clearRect(0, 0, size, size);
  target.getContext('2d').drawImage(canvas, 0, 0, size, size);
}

function computeCover(image, boxSize) {
  const { width, height } = image;
  if (!width || !height) return { sx: 0, sy: 0, sSize: boxSize };
  const minSide = Math.min(width, height);
  const sx = (width - minSide) / 2;
  const sy = (height - minSide) / 2;
  return { sx, sy, sSize: minSide };
}

function drawFrame(renderSize, margin) {
  const center = canvas.width / 2;
  const radius = renderSize / 2;
  const stroke = renderSize * state.frameWidth;

  const gradient = ctx.createLinearGradient(margin, margin, renderSize + margin, renderSize + margin);
  state.theme.colors.forEach((color, idx) => gradient.addColorStop(idx / (state.theme.colors.length - 1), color));

  ctx.lineWidth = stroke;
  ctx.strokeStyle = gradient;
  ctx.shadowColor = `${state.theme.colors[0]}55`;
  ctx.shadowBlur = 26;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.beginPath();
  if (state.shape === 'round') {
    ctx.arc(center, center, radius - stroke / 2, 0, Math.PI * 2);
  } else {
    const r = 46;
    roundRect(ctx, margin + stroke / 2, margin + stroke / 2, renderSize - stroke, renderSize - stroke, r);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawSticker(renderSize, margin) {
  const size = state.stickerSize;
  const pad = 32;
  ctx.save();
  ctx.fillStyle = `${state.theme.colors[1]}BB`;
  roundRect(
    ctx,
    margin + pad,
    margin + pad,
    size + 24,
    size + 24,
    18
  );
  ctx.fill();

  ctx.font = `${Math.round(size * 0.55)}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.theme.sticker, margin + pad + (size + 24) / 2, margin + pad + (size + 24) / 2 + 2);
  ctx.restore();
}

function drawTagline(renderSize, margin) {
  const text = state.tagline?.trim() || state.theme.tagline;
  if (!text) return;
  const barHeight = 80;
  const barY = margin + renderSize - barHeight - 28;

  const gradient = ctx.createLinearGradient(margin, barY, margin + renderSize, barY + barHeight);
  gradient.addColorStop(0, `${state.theme.colors[0]}DD`);
  gradient.addColorStop(1, `${state.theme.colors[state.theme.colors.length - 1]}DD`);

  ctx.save();
  roundRect(ctx, margin + 24, barY, renderSize - 48, barHeight, 20);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.font = '28px "HarmonyOS Sans", "Inter", system-ui, -apple-system, sans-serif';
  ctx.fillStyle = state.theme.accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, barY + barHeight / 2 + 2);
  ctx.restore();
}

function roundRect(context, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + w - radius, y);
  context.quadraticCurveTo(x + w, y, x + w, y + radius);
  context.lineTo(x + w, y + h - radius);
  context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  context.lineTo(x + radius, y + h);
  context.quadraticCurveTo(x, y + h, x, y + h - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

init();
draw();
