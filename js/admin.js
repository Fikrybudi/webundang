/**
 * ADMIN PANEL - JavaScript
 * Handles: Authentication, CRUD operations, data management
 * Connected to Node.js Express Backend API
 */

// ============================================
// STORAGE KEYS (for auth only)
// ============================================
const ADMIN_STORAGE = {
    PASSWORD: 'khitanan_admin_password',
    LOGGED_IN: 'khitanan_admin_logged_in'
};

// Default password
const DEFAULT_PASSWORD = 'admin123';

// In-memory cache
let cachedConfig = null;
let cachedGuests = [];
let cachedWishes = [];
let cachedGallery = [];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initNavigation();
    initMobileToggle();
});

// ============================================
// AUTHENTICATION
// ============================================
function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('btnLogout');

    // Check if already logged in
    if (isLoggedIn()) {
        showDashboard();
        loadAllData();
    }

    // Login form handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const storedPassword = localStorage.getItem(ADMIN_STORAGE.PASSWORD) || DEFAULT_PASSWORD;

        if (password === storedPassword) {
            localStorage.setItem(ADMIN_STORAGE.LOGGED_IN, 'true');
            showDashboard();
            loadAllData();
        } else {
            document.getElementById('loginError').classList.add('show');
            setTimeout(() => {
                document.getElementById('loginError').classList.remove('show');
            }, 3000);
        }
    });

    // Logout handler
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(ADMIN_STORAGE.LOGGED_IN);
        location.reload();
    });
}

function isLoggedIn() {
    return localStorage.getItem(ADMIN_STORAGE.LOGGED_IN) === 'true';
}

function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            switchSection(section);

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Close mobile sidebar
            document.getElementById('sidebar').classList.remove('open');
        });
    });
}

function switchSection(sectionId) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));

    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function initMobileToggle() {
    const toggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// ============================================
// LOAD ALL DATA FROM API
// ============================================
async function loadAllData() {
    showToast('Memuat data...', 'info');

    try {
        // Load all data from API
        const [config, guests, wishes, gallery] = await Promise.all([
            API.Config.get().catch(() => null),
            API.Guests.getAll().catch(() => []),
            API.Wishes.getAll().catch(() => []),
            API.Gallery.getAll().catch(() => [])
        ]);

        // Cache data
        cachedConfig = config || {};
        cachedGuests = guests || [];
        cachedWishes = wishes || [];
        cachedGallery = gallery || [];

        // Populate UI
        if (cachedConfig) {
            populateEventForm(cachedConfig);
        }
        renderGuestsTable(cachedGuests);
        renderRSVPTable(cachedWishes);
        renderRecentWishes(cachedWishes.slice(0, 5));
        renderGalleryAdmin(cachedGallery);
        updateDashboardStats();
        loadHeroPhotoPreview();

        showToast('Data berhasil dimuat!', 'success');
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Gagal memuat data. Pastikan server berjalan.', 'error');
    }
}

// ============================================
// CONFIG / EVENT DATA
// ============================================
function loadConfig() {
    // Config already loaded in loadAllData
    if (cachedConfig) {
        populateEventForm(cachedConfig);
    }
}

function populateEventForm(config) {
    if (!config) return;

    // Child info
    if (config.event) {
        setInputValue('childName', config.event.childName);
        setInputValue('childNickname', config.event.childNickname);
        setInputValue('fatherNameInput', config.event.parentNames?.father);
        setInputValue('motherNameInput', config.event.parentNames?.mother);
        setInputValue('quoteArabicInput', config.event.quote);
        setInputValue('quoteTranslationInput', config.event.quoteTranslation);
    }

    // Prosesi Khitan
    if (config.prosesiKhitan) {
        setInputValue('khitanDateInput', config.prosesiKhitan.date);
        setInputValue('khitanTimeStart', config.prosesiKhitan.time);
        setInputValue('khitanTimeEnd', config.prosesiKhitan.endTime);
        setInputValue('khitanLocationInput', config.prosesiKhitan.location);
        setInputValue('khitanAddressInput', config.prosesiKhitan.address);
        setInputValue('khitanMapsInput', config.prosesiKhitan.mapsUrl);
    }

    // Syukuran
    if (config.syukuran) {
        setInputValue('syukuranDateInput', config.syukuran.date);
        setInputValue('syukuranTimeStart', config.syukuran.time);
        setInputValue('syukuranTimeEnd', config.syukuran.endTime);
        setInputValue('syukuranLocationInput', config.syukuran.location);
        setInputValue('syukuranAddressInput', config.syukuran.address);
        setInputValue('syukuranMapsInput', config.syukuran.mapsUrl);
    }

    // Digital Envelope
    if (config.digitalEnvelope?.banks) {
        const banks = config.digitalEnvelope.banks;
        if (banks[0]) {
            setInputValue('bank1Name', banks[0].bankName);
            setInputValue('bank1Number', banks[0].accountNumber);
            setInputValue('bank1Holder', banks[0].accountHolder);
        }
        if (banks[1]) {
            setInputValue('bank2Name', banks[1].bankName);
            setInputValue('bank2Number', banks[1].accountNumber);
            setInputValue('bank2Holder', banks[1].accountHolder);
        }
    }

    // Music
    if (config.music) {
        setInputValue('musicUrl', config.music.src);
        document.getElementById('musicAutoplay').checked = config.music.autoplay !== false;
    }
}

async function saveEventData() {
    const config = getFullConfig();

    // Update event data
    config.event = {
        childName: getInputValue('childName'),
        childNickname: getInputValue('childNickname'),
        childPhoto: config.event?.childPhoto || 'assets/images/child.jpg',
        parentNames: {
            father: getInputValue('fatherNameInput'),
            mother: getInputValue('motherNameInput')
        },
        quote: getInputValue('quoteArabicInput'),
        quoteTranslation: getInputValue('quoteTranslationInput')
    };

    config.prosesiKhitan = {
        title: 'Prosesi Khitan',
        date: getInputValue('khitanDateInput'),
        time: getInputValue('khitanTimeStart'),
        endTime: getInputValue('khitanTimeEnd'),
        location: getInputValue('khitanLocationInput'),
        address: getInputValue('khitanAddressInput'),
        mapsUrl: getInputValue('khitanMapsInput')
    };

    config.syukuran = {
        title: 'Syukuran',
        date: getInputValue('syukuranDateInput'),
        time: getInputValue('syukuranTimeStart'),
        endTime: getInputValue('syukuranTimeEnd'),
        location: getInputValue('syukuranLocationInput'),
        address: getInputValue('syukuranAddressInput'),
        mapsUrl: getInputValue('syukuranMapsInput')
    };

    await saveConfig(config);
    showToast('Data acara berhasil disimpan!', 'success');
}

async function saveEnvelopeData() {
    const config = getFullConfig();

    config.digitalEnvelope = {
        enabled: true,
        banks: [
            {
                bankName: getInputValue('bank1Name'),
                accountNumber: getInputValue('bank1Number'),
                accountHolder: getInputValue('bank1Holder')
            },
            {
                bankName: getInputValue('bank2Name'),
                accountNumber: getInputValue('bank2Number'),
                accountHolder: getInputValue('bank2Holder')
            }
        ].filter(bank => bank.bankName && bank.accountNumber)
    };

    await saveConfig(config);
    showToast('Data amplop digital berhasil disimpan!', 'success');
}

async function saveMusicSettings() {
    const config = getFullConfig();

    config.music = {
        enabled: true,
        autoplay: document.getElementById('musicAutoplay').checked,
        src: getInputValue('musicUrl') || 'assets/audio/background.mp3'
    };

    await saveConfig(config);
    showToast('Pengaturan musik berhasil disimpan!', 'success');
}

function getFullConfig() {
    return cachedConfig || {};
}

async function saveConfig(config) {
    try {
        await API.Config.save(config);
        cachedConfig = config;
    } catch (error) {
        console.error('Error saving config:', error);
        showToast('Gagal menyimpan. Pastikan server berjalan.', 'error');
        throw error;
    }
}

// ============================================
// GUESTS MANAGEMENT
// ============================================
function loadGuests() {
    renderGuestsTable(cachedGuests);
}

function getGuests() {
    return cachedGuests;
}

function renderGuestsTable(guests) {
    const tbody = document.getElementById('guestsTableBody');

    if (guests.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          <p>Belum ada data tamu</p>
        </td>
      </tr>
    `;
        return;
    }

    tbody.innerHTML = guests.map((guest, index) => {
        const link = generateGuestLink(guest.name);
        return `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(guest.name)}</td>
        <td>
          <input type="text" value="${link}" readonly style="width: 200px; padding: 5px; font-size: 0.8rem;">
          <button class="btn btn-sm btn-secondary" onclick="copyToClipboard('${link}')">📋</button>
        </td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-danger" onclick="deleteGuest('${guest.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
    }).join('');
}

function openGuestModal() {
    document.getElementById('guestModal').classList.add('active');
    document.getElementById('newGuestName').value = '';
    document.getElementById('newGuestName').focus();
}

function closeGuestModal() {
    document.getElementById('guestModal').classList.remove('active');
}

async function addGuest() {
    const name = document.getElementById('newGuestName').value.trim();

    if (!name) {
        showToast('Nama tamu tidak boleh kosong', 'error');
        return;
    }

    try {
        const result = await API.Guests.add(name);
        cachedGuests.push(result.guest);
        renderGuestsTable(cachedGuests);
        closeGuestModal();
        updateDashboardStats();
        showToast('Tamu berhasil ditambahkan!', 'success');
    } catch (error) {
        console.error('Error adding guest:', error);
        showToast('Gagal menambah tamu', 'error');
    }
}

async function deleteGuest(id) {
    if (!confirm('Yakin ingin menghapus tamu ini?')) return;

    try {
        await API.Guests.delete(id);
        cachedGuests = cachedGuests.filter(g => g.id !== id);
        renderGuestsTable(cachedGuests);
        updateDashboardStats();
        showToast('Tamu berhasil dihapus', 'success');
    } catch (error) {
        console.error('Error deleting guest:', error);
        showToast('Gagal menghapus tamu', 'error');
    }
}

function generateGuestLink(name) {
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
    return `${baseUrl}?name=${encodeURIComponent(name)}`;
}

function generateQuickLink() {
    const name = document.getElementById('quickGuestName').value.trim();

    if (!name) {
        showToast('Masukkan nama tamu terlebih dahulu', 'error');
        return;
    }

    const link = generateGuestLink(name);
    document.getElementById('quickLinkOutput').value = link;
    document.getElementById('quickLinkResult').style.display = 'block';
}

function copyQuickLink() {
    const link = document.getElementById('quickLinkOutput').value;
    copyToClipboard(link);
}

// ============================================
// RSVP / WISHES
// ============================================
function loadRSVPData() {
    renderRSVPTable(cachedWishes);
    renderRecentWishes(cachedWishes.slice(0, 5));
}

function getWishes() {
    return cachedWishes;
}

function renderRSVPTable(wishes) {
    const tbody = document.getElementById('rsvpTableBody');

    if (wishes.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <p>Belum ada RSVP masuk</p>
        </td>
      </tr>
    `;
        return;
    }

    tbody.innerHTML = wishes.map((wish) => {
        const isAttending = wish.attendance === 'hadir';
        const badgeClass = isAttending ? 'badge-success' : 'badge-danger';
        const badgeText = isAttending ? 'Hadir' : 'Tidak Hadir';

        return `
      <tr>
        <td>${escapeHtml(wish.name)}</td>
        <td><span class="badge ${badgeClass}">${badgeText}</span></td>
        <td>${wish.guestsCount || wish.guests || 1} orang</td>
        <td>${wish.message ? escapeHtml(wish.message.substring(0, 50)) + (wish.message.length > 50 ? '...' : '') : '-'}</td>
        <td>${formatDateTime(wish.createdAt || wish.timestamp)}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteWish('${wish.id}')">🗑️</button>
        </td>
      </tr>
    `;
    }).join('');
}

function renderRecentWishes(wishes) {
    const container = document.getElementById('recentWishes');

    if (wishes.length === 0) {
        container.innerHTML = `
      <div class="empty-state">
        <p>Belum ada ucapan masuk</p>
      </div>
    `;
        return;
    }

    container.innerHTML = wishes.map(wish => `
    <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <strong>${escapeHtml(wish.name)}</strong>
        <span style="font-size: 0.8rem; color: #6c757d;">${formatRelativeTime(wish.createdAt || wish.timestamp)}</span>
      </div>
      ${wish.message ? `<p style="margin: 0; color: #495057;">${escapeHtml(wish.message)}</p>` : ''}
    </div>
  `).join('');
}

async function deleteWish(id) {
    if (!confirm('Yakin ingin menghapus ucapan ini?')) return;

    try {
        await API.Wishes.delete(id);
        cachedWishes = cachedWishes.filter(w => w.id !== id);
        loadRSVPData();
        updateDashboardStats();
        showToast('Ucapan berhasil dihapus', 'success');
    } catch (error) {
        console.error('Error deleting wish:', error);
        showToast('Gagal menghapus ucapan', 'error');
    }
}

async function clearAllWishes() {
    if (!confirm('Yakin ingin menghapus SEMUA ucapan dan RSVP? Tindakan ini tidak dapat dibatalkan.')) return;

    try {
        await API.Wishes.deleteAll();
        cachedWishes = [];
        loadRSVPData();
        updateDashboardStats();
        showToast('Semua ucapan dan RSVP berhasil dihapus', 'success');
    } catch (error) {
        console.error('Error clearing wishes:', error);
        showToast('Gagal menghapus ucapan', 'error');
    }
}

// ============================================
// GALLERY MANAGEMENT
// ============================================
function loadGalleryData() {
    renderGalleryAdmin(cachedGallery);
}

function getGallery() {
    return cachedGallery;
}

function renderGalleryAdmin(gallery) {
    const grid = document.getElementById('galleryAdminGrid');

    if (gallery.length === 0) {
        grid.innerHTML = '<p style="color: #6c757d;">Belum ada foto di galeri</p>';
        return;
    }

    grid.innerHTML = gallery.map((item) => {
        const src = typeof item === 'string' ? item : item.url;
        const id = typeof item === 'string' ? null : item.id;
        return `
    <div class="gallery-admin-item">
      <img src="${src}" alt="Gallery" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 200 200%27%3E%3Crect fill=%27%231e3a5f%27 width=%27200%27 height=%27200%27/%3E%3Ctext x=%27100%27 y=%27110%27 text-anchor=%27middle%27 fill=%27%23d4af37%27 font-size=%2740%27%3E📷%3C/text%3E%3C/svg%3E'">
      <button class="delete-btn" onclick="deleteGalleryItem('${id}')">×</button>
    </div>
  `;
    }).join('');
}

function handleGalleryUpload(input) {
    const files = input.files;
    if (!files.length) return;

    Array.from(files).forEach(file => {
        if (file.size > 2 * 1024 * 1024) {
            showToast(`File ${file.name} terlalu besar (max 2MB)`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const result = await API.Gallery.add(e.target.result);
                cachedGallery.push(result.image);
                renderGalleryAdmin(cachedGallery);
                showToast('Foto berhasil diupload!', 'success');
            } catch (error) {
                console.error('Error uploading gallery:', error);
                showToast('Gagal upload foto', 'error');
            }
        };
        reader.readAsDataURL(file);
    });

    input.value = '';
}

async function addGalleryUrl() {
    const url = document.getElementById('galleryUrlInput').value.trim();

    if (!url) {
        showToast('Masukkan URL gambar', 'error');
        return;
    }

    try {
        const result = await API.Gallery.add(url);
        cachedGallery.push(result.image);
        renderGalleryAdmin(cachedGallery);
        document.getElementById('galleryUrlInput').value = '';
        showToast('Gambar berhasil ditambahkan!', 'success');
    } catch (error) {
        console.error('Error adding gallery:', error);
        showToast('Gagal menambah gambar', 'error');
    }
}

async function deleteGalleryItem(id) {
    if (!confirm('Yakin ingin menghapus foto ini?')) return;

    try {
        await API.Gallery.delete(id);
        cachedGallery = cachedGallery.filter(g => g.id !== id);
        renderGalleryAdmin(cachedGallery);
        showToast('Foto berhasil dihapus', 'success');
    } catch (error) {
        console.error('Error deleting gallery:', error);
        showToast('Gagal menghapus foto', 'error');
    }
}

// ============================================
// HERO PHOTO MANAGEMENT
// ============================================
function loadHeroPhotoPreview() {
    const config = getFullConfig();
    const heroPhoto = config.event?.childPhoto;
    const previewImg = document.getElementById('heroPhotoPreviewImg');
    const placeholder = document.getElementById('noPhotoPlaceholder');

    if (heroPhoto && heroPhoto !== 'assets/images/child.jpg') {
        previewImg.src = heroPhoto;
        previewImg.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    } else {
        previewImg.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
    }
}

function handleHeroPhotoUpload(input) {
    const file = input.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showToast('File terlalu besar (max 2MB)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        saveHeroPhoto(e.target.result);
        showToast('Foto profil berhasil diupload!', 'success');
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function setHeroPhotoUrl() {
    const url = document.getElementById('heroPhotoUrl').value.trim();

    if (!url) {
        showToast('Masukkan URL gambar', 'error');
        return;
    }

    saveHeroPhoto(url);
    document.getElementById('heroPhotoUrl').value = '';
    showToast('Foto profil berhasil diatur!', 'success');
}

async function saveHeroPhoto(photoUrl) {
    const config = getFullConfig();

    if (!config.event) {
        config.event = {};
    }
    config.event.childPhoto = photoUrl;

    await saveConfig(config);
    loadHeroPhotoPreview();
}

async function removeHeroPhoto() {
    if (!confirm('Yakin ingin menghapus foto profil anak?')) return;

    const config = getFullConfig();
    if (config.event) {
        config.event.childPhoto = 'assets/images/child.jpg';
    }

    await saveConfig(config);
    loadHeroPhotoPreview();
    showToast('Foto profil berhasil dihapus', 'success');
}


// ============================================
// SETTINGS
// ============================================
function changePassword() {
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;

    if (!newPass) {
        showToast('Password tidak boleh kosong', 'error');
        return;
    }

    if (newPass !== confirmPass) {
        showToast('Password tidak cocok', 'error');
        return;
    }

    if (newPass.length < 4) {
        showToast('Password minimal 4 karakter', 'error');
        return;
    }

    localStorage.setItem(ADMIN_STORAGE.PASSWORD, newPass);
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    showToast('Password berhasil diubah!', 'success');
}

async function exportAllData() {
    try {
        const fullData = await API.Config.getFull();
        const data = {
            ...fullData,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `undangan-khitanan-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('Data berhasil di-export!', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showToast('Gagal export data', 'error');
    }
}

// Export config.json untuk di-upload ke hosting
async function exportConfigJson() {
    try {
        const config = getFullConfig();
        const gallery = getGallery();

        // Merge gallery into config
        config.gallery = gallery.map(g => typeof g === 'string' ? g : g.url);

        // Add default theme if not exists
        if (!config.theme) {
            config.theme = {
                primaryColor: "#1e3a5f",
                secondaryColor: "#d4af37",
                backgroundColor: "#faf8f5"
            };
        }

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.json';
        a.click();
        URL.revokeObjectURL(url);

        showToast('config.json berhasil di-download! Upload ke folder data/ di hosting.', 'success');
    } catch (error) {
        console.error('Error exporting config:', error);
        showToast('Gagal export config', 'error');
    }
}


// ============================================
// DASHBOARD STATS
// ============================================
function updateDashboardStats() {
    const guests = getGuests();
    const wishes = getWishes();

    const attending = wishes.filter(w => w.attendance === 'hadir').length;
    const notAttending = wishes.filter(w => w.attendance === 'tidak').length;

    document.getElementById('statTotalGuests').textContent = guests.length;
    document.getElementById('statAttending').textContent = attending;
    document.getElementById('statNotAttending').textContent = notAttending;
    document.getElementById('statWishes').textContent = wishes.length;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined && value !== null) {
        element.value = value;
    }
}

function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDateTime(timestamp) {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    if (minutes > 0) return `${minutes} menit lalu`;
    return 'Baru saja';
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Berhasil disalin!', 'success');
    }).catch(() => {
        showToast('Gagal menyalin', 'error');
    });
}

function showToast(message, type = '') {
    const toast = document.getElementById('adminToast');
    toast.textContent = message;
    toast.className = 'admin-toast show ' + type;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
