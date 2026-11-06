const $ = (id) => document.getElementById(id);
$('year').textContent = new Date().getFullYear();
const nav = $('mainNav');
$('menuToggle').addEventListener('click', () => { const open = nav.classList.toggle('open'); $('menuToggle').setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { $('service').value = link.dataset.service; }));
const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); $('bookingDate').min = today.toISOString().slice(0,10);
$('photos').addEventListener('change', (event) => {
  const preview = $('photoPreview'); preview.replaceChildren();
  [...event.target.files].slice(0,8).forEach(file => {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) return;
    const img = document.createElement('img'); img.alt = 'Selected property photo preview'; img.src = URL.createObjectURL(file); preview.append(img);
  });
});
$('estimateForm').addEventListener('submit', event => {
  event.preventDefault();
  const service = $('service').value, address = $('address').value.trim();
  if (!service || !address) return;
  $('estimateResult').hidden = false;
  $('estimateResult').textContent = 'Request preview ready for ' + service + ' at ' + address + '. No data or photos have been uploaded. A secure backend is needed to send this to the business.';
});
$('bookingForm').addEventListener('submit', event => {
  event.preventDefault();
  if (!$('bookingForm').reportValidity()) return;
  $('bookingResult').hidden = false;
  $('bookingResult').textContent = 'Booking request preview for ' + $('customerName').value + ' on ' + $('bookingDate').value + ' (' + $('bookingTime').value + '). This is not a confirmed appointment: live availability checks, calendar sync, and notifications still need backend setup.';
});
