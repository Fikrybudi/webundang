/**
 * KHITANAN INVITATION - RSVP Handler
 * Handles: Form submission, wishes display
 * Connected to Node.js Express Backend API
 */

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initRSVPForm();
    loadWishes();
});

// ============================================
// RSVP FORM HANDLING
// ============================================
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    const btnSubmit = document.getElementById('btnSubmit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name')?.trim(),
            attendance: formData.get('attendance'),
            guestsCount: parseInt(formData.get('guests')) || 1,
            message: formData.get('message')?.trim()
        };

        // Validate
        if (!data.name) {
            showToast('Mohon masukkan nama Anda');
            return;
        }

        if (!data.attendance) {
            showToast('Mohon pilih konfirmasi kehadiran');
            return;
        }

        // Show loading state
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="loading"></span> Mengirim...';

        try {
            // Submit to API
            await API.Wishes.add(data);

            // Reset form
            form.reset();

            // Show success message
            showToast('Terima kasih! Konfirmasi Anda telah dikirim 🎉');

            // Reload wishes
            await loadWishes();

            // Scroll to wishes section
            setTimeout(() => {
                document.getElementById('wishes').scrollIntoView({ behavior: 'smooth' });
            }, 500);

        } catch (error) {
            console.error('Error submitting RSVP:', error);
            showToast('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Kirim Konfirmasi';
        }
    });
}

// ============================================
// WISHES MANAGEMENT
// ============================================
async function loadWishes() {
    const container = document.getElementById('wishesList');
    const noWishes = document.getElementById('noWishes');

    try {
        const wishes = await API.Wishes.getAll();

        if (wishes.length === 0) {
            noWishes.style.display = 'block';
            container.innerHTML = '';
            return;
        }

        noWishes.style.display = 'none';

        // Clear existing wishes
        container.innerHTML = '';

        // Sort by newest first
        const sortedWishes = wishes.sort((a, b) =>
            new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
        );

        // Render wishes
        sortedWishes.forEach(wish => {
            const item = createWishElement(wish);
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading wishes:', error);
        // Silent fail - show empty state
        noWishes.style.display = 'block';
        container.innerHTML = '';
    }
}

function createWishElement(wish) {
    const div = document.createElement('div');
    div.className = 'wish-item';

    const isAttending = wish.attendance === 'hadir';
    const attendanceText = isAttending ? '✓ Hadir' : '✗ Tidak Hadir';
    const attendanceClass = isAttending ? '' : 'not-attending';

    div.innerHTML = `
    <div class="wish-header">
      <span class="wish-name">${escapeHtml(wish.name)}</span>
      <span class="wish-attendance ${attendanceClass}">${attendanceText}</span>
    </div>
    ${wish.message ? `<p class="wish-message">${escapeHtml(wish.message)}</p>` : ''}
    <p class="wish-time">${formatRelativeTime(wish.createdAt || wish.timestamp)}</p>
  `;

    return div;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
        return formatDateShort(date);
    } else if (days > 0) {
        return `${days} hari yang lalu`;
    } else if (hours > 0) {
        return `${hours} jam yang lalu`;
    } else if (minutes > 0) {
        return `${minutes} menit yang lalu`;
    } else {
        return 'Baru saja';
    }
}

function formatDateShort(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
