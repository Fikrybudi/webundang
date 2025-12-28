// ============================================
// CONFIGURATION
// ============================================
let CONFIG = null;

// Load configuration - prioritize API, fallback to static file
async function loadConfig() {
  try {
    // Try to load from API first
    CONFIG = await API.Config.get();
    console.log('Loaded config from API');
    initializeInvitation();
    return;
  } catch (apiError) {
    console.log('API not available, trying static file...');
  }

  // Fallback: load from config.json file
  try {
    const response = await fetch('data/config.json');
    CONFIG = await response.json();
    console.log('Loaded config from config.json file');
    initializeInvitation();
  } catch (error) {
    console.warn('Config not found, using defaults');
    initializeInvitation();
  }
}


// ============================================
// INITIALIZATION
// ============================================
function initializeInvitation() {
  // Get guest name from URL
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('name') || urlParams.get('to') || urlParams.get('kepada');

  if (guestName) {
    document.getElementById('guestName').textContent = decodeURIComponent(guestName);
  }

  // Apply config data if available
  if (CONFIG) {
    applyConfig();
  }

  // Initialize components
  initCover();
  initCountdown();
  initScrollReveal();
  initGallery();
  initMusicPlayer();
  initIslamicParticles();
}

// ============================================
// ISLAMIC ANIMATED PARTICLES
// ============================================
function initIslamicParticles() {
  // Cover particles
  const coverContainer = document.getElementById('islamicParticles');
  if (coverContainer) {
    createParticlesInContainer(coverContainer, 15);
  }

  // Hero particles
  const heroContainer = document.getElementById('heroParticles');
  if (heroContainer) {
    createParticlesInContainer(heroContainer, 12);
  }

  // Global floating stars for the entire content
  const globalStarsContainer = document.getElementById('globalIslamicStars');
  if (globalStarsContainer) {
    createGlobalFloatingStars(globalStarsContainer, 20);
  }
}

function createParticlesInContainer(container, count) {
  const symbols = ['✦', '✧', '❋', '✵', '⁂', '☪', '✴', '❂', '✷', '⋆', '۞', '✸'];

  for (let i = 0; i < count; i++) {
    createParticle(container, symbols, i);
  }
}

function createParticle(container, symbols, index) {
  const particle = document.createElement('span');
  particle.className = 'particle';
  particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  // Random position and timing
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDelay = (Math.random() * 8) + 's';
  particle.style.animationDuration = (6 + Math.random() * 4) + 's';
  particle.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';

  container.appendChild(particle);
}

// Create floating stars that appear throughout the content
function createGlobalFloatingStars(container, count) {
  const starSymbols = ['✦', '✧', '✶', '✷', '✸', '✹', '⋆', '✵', '❋', '☪'];

  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.className = 'floating-star';
    star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];

    // Random horizontal position
    star.style.left = Math.random() * 100 + '%';

    // Random animation timing (staggered)
    const delay = Math.random() * 15;
    star.style.animationDelay = delay + 's';

    // Random duration for variety
    const duration = 12 + Math.random() * 8;
    star.style.animationDuration = duration + 's';

    // Random size
    star.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';

    container.appendChild(star);
  }
}




// Apply configuration to DOM
function applyConfig() {
  const { event, prosesiKhitan, syukuran, digitalEnvelope, gallery } = CONFIG;

  // Child info
  if (event) {
    setTextContent('coverChildName', event.childName);
    setTextContent('heroName', event.childName);
    setTextContent('profileName', event.childName);
    setTextContent('fatherName', event.parentNames?.father);
    setTextContent('motherName', event.parentNames?.mother);
    setTextContent('footerFamily', `${event.parentNames?.father?.replace('Bapak ', '')} & ${event.parentNames?.mother?.replace('Ibu ', '')}`);

    if (event.quote) {
      setTextContent('quoteArabic', event.quote);
    }
    if (event.quoteTranslation) {
      setTextContent('quoteTranslation', event.quoteTranslation);
    }

    // Set photo
    if (event.childPhoto) {
      const photos = document.querySelectorAll('#heroPhoto, #profilePhoto');
      photos.forEach(photo => photo.src = event.childPhoto);
    }
  }

  // Prosesi Khitan
  if (prosesiKhitan) {
    const khitanDateObj = new Date(prosesiKhitan.date);
    setTextContent('khitanDate', formatDate(khitanDateObj));
    setTextContent('heroDate', formatDate(khitanDateObj));
    setTextContent('khitanTime', `${prosesiKhitan.time} - ${prosesiKhitan.endTime} WIB`);
    setTextContent('khitanLocation', prosesiKhitan.location);
    setTextContent('khitanAddress', prosesiKhitan.address);
    document.getElementById('khitanMaps').href = prosesiKhitan.mapsUrl;
  }

  // Syukuran
  if (syukuran) {
    const syukuranDateObj = new Date(syukuran.date);
    setTextContent('syukuranDate', formatDate(syukuranDateObj));
    setTextContent('syukuranTime', `${syukuran.time} - ${syukuran.endTime} WIB`);
    setTextContent('syukuranLocation', syukuran.location);
    setTextContent('syukuranAddress', syukuran.address);
    document.getElementById('syukuranMaps').href = syukuran.mapsUrl;
  }

  // Digital Envelope
  if (digitalEnvelope && digitalEnvelope.enabled) {
    renderBankCards(digitalEnvelope.banks);
  }

  // Gallery
  if (gallery && gallery.length > 0) {
    // Handle both array of strings and array of objects
    const galleryUrls = gallery.map(g => typeof g === 'string' ? g : g.url);
    renderGallery(galleryUrls);
  } else {
    renderDefaultGallery();
  }

  // Update page title
  if (event?.childName) {
    document.title = `Undangan Khitanan ${event.childName}`;
  }
}

// Helper function to set text content safely
function setTextContent(id, text) {
  const element = document.getElementById(id);
  if (element && text) {
    element.textContent = text;
  }
}

// ============================================
// COVER / OPENING
// ============================================
function initCover() {
  const cover = document.getElementById('cover');
  const btnOpen = document.getElementById('btnOpen');
  const mainContent = document.getElementById('mainContent');
  const bgMusic = document.getElementById('bgMusic');

  btnOpen.addEventListener('click', () => {
    // Open cover with animation
    cover.classList.add('open');
    mainContent.classList.add('visible');

    // Try to play music
    if (CONFIG?.music?.autoplay !== false) {
      playMusic();
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Trigger initial reveal animations
    setTimeout(() => {
      checkReveal();
    }, 500);
  });
}

// ============================================
// COUNTDOWN TIMER
// ============================================
let countdownInterval = null;

function initCountdown() {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  let targetDate;

  if (CONFIG?.prosesiKhitan?.date) {
    const dateStr = CONFIG.prosesiKhitan.date;
    const timeStr = CONFIG.prosesiKhitan.time || '08:00';
    targetDate = new Date(`${dateStr}T${timeStr}:00`);
  } else {
    // Default: 30 days from now
    targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
  }

  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById('countDays').textContent = '0';
    document.getElementById('countHours').textContent = '0';
    document.getElementById('countMinutes').textContent = '0';
    document.getElementById('countSeconds').textContent = '0';
    clearInterval(countdownInterval);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('countDays').textContent = String(days).padStart(2, '0');
  document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('countMinutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('countSeconds').textContent = String(seconds).padStart(2, '0');
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollReveal() {
  window.addEventListener('scroll', checkReveal);
  checkReveal(); // Initial check
}

function checkReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const windowHeight = window.innerHeight;

  reveals.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 100;

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add('active');
    }
  });
}

// ============================================
// GALLERY
// ============================================
function initGallery() {
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('galleryModalImg');
  const closeBtn = document.getElementById('galleryClose');

  // Close modal on click
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('active');
    }
  });
}

function renderGallery(images) {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';

  images.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${src}" alt="Gallery ${index + 1}" loading="lazy" 
      onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 200 200%27%3E%3Crect fill=%27%231e3a5f%27 width=%27200%27 height=%27200%27/%3E%3Ctext x=%27100%27 y=%27110%27 text-anchor=%27middle%27 fill=%27%23d4af37%27 font-size=%2740%27%3E📷%3C/text%3E%3C/svg%3E'">`;

    item.addEventListener('click', () => openGalleryModal(src));
    grid.appendChild(item);
  });
}

function renderDefaultGallery() {
  const placeholders = [];
  for (let i = 1; i <= 6; i++) {
    placeholders.push(`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%231e3a5f' width='200' height='200'/%3E%3Ctext x='100' y='110' text-anchor='middle' fill='%23d4af37' font-size='40'%3E📷%3C/text%3E%3C/svg%3E`);
  }
  renderGallery(placeholders);
}

function openGalleryModal(src) {
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('galleryModalImg');

  modalImg.src = src;
  modal.classList.add('active');
}

// ============================================
// MUSIC PLAYER
// ============================================
let isPlaying = false;

function initMusicPlayer() {
  const playerBtn = document.getElementById('musicPlayer');
  const bgMusic = document.getElementById('bgMusic');

  // Set music source from config
  if (CONFIG?.music?.src) {
    bgMusic.querySelector('source').src = CONFIG.music.src;
    bgMusic.load();
  }

  playerBtn.addEventListener('click', toggleMusic);

  // Update icon when music ends or is paused
  bgMusic.addEventListener('play', () => updateMusicIcon(true));
  bgMusic.addEventListener('pause', () => updateMusicIcon(false));
  bgMusic.addEventListener('ended', () => updateMusicIcon(false));
}

function playMusic() {
  const bgMusic = document.getElementById('bgMusic');

  bgMusic.play().then(() => {
    isPlaying = true;
    updateMusicIcon(true);
  }).catch(error => {
    console.log('Autoplay prevented:', error);
    isPlaying = false;
    updateMusicIcon(false);
  });
}

function toggleMusic() {
  const bgMusic = document.getElementById('bgMusic');

  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
  } else {
    bgMusic.play().then(() => {
      isPlaying = true;
    }).catch(error => {
      console.log('Play prevented:', error);
    });
  }

  updateMusicIcon(isPlaying);
}

function updateMusicIcon(playing) {
  const playIcon = document.getElementById('musicIconPlay');
  const pauseIcon = document.getElementById('musicIconPause');
  const playerBtn = document.getElementById('musicPlayer');

  if (playing) {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    playerBtn.classList.add('playing');
  } else {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playerBtn.classList.remove('playing');
  }
}

// ============================================
// DIGITAL ENVELOPE / BANK CARDS
// ============================================
function renderBankCards(banks) {
  const container = document.getElementById('bankCards');
  container.innerHTML = '';

  banks.forEach(bank => {
    const card = document.createElement('div');
    card.className = 'bank-card';
    card.innerHTML = `
      <p class="bank-name">${bank.bankName}</p>
      <p class="bank-number">${bank.accountNumber}</p>
      <p class="bank-holder">a.n. ${bank.accountHolder}</p>
      <button class="btn-copy" onclick="copyToClipboard('${bank.accountNumber}', this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
        </svg>
        Salin No. Rekening
      </button>
    `;
    container.appendChild(card);
  });
}

function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    button.classList.add('copied');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Tersalin!
    `;

    showToast('Nomor rekening berhasil disalin!');

    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
        </svg>
        Salin No. Rekening
      `;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    showToast('Gagal menyalin nomor rekening');
  });
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ============================================
// UTILITIES
// ============================================
function formatDate(date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

// ============================================
// START APPLICATION
// ============================================
document.addEventListener('DOMContentLoaded', loadConfig);
