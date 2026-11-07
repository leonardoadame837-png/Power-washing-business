const $ = (id) => document.getElementById(id);
$('year').textContent = new Date().getFullYear();
const nav = $('mainNav');
$('menuToggle').addEventListener('click', () => { const open = nav.classList.toggle('open'); $('menuToggle').setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { $('service').value = link.dataset.service; }));
$('photos').addEventListener('change', event => {
  const preview=$('photoPreview'); preview.replaceChildren();
  [...event.target.files].slice(0,8).forEach(file=>{
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)return;
    const img=document.createElement('img');img.alt='Selected property photo preview';img.src=URL.createObjectURL(file);preview.append(img);
  });
});
$('estimateForm').addEventListener('submit',event=>{
  event.preventDefault();const service=$('service').value,address=$('address').value.trim();if(!service||!address)return;
  $('estimateResult').hidden=false;$('estimateResult').textContent='Request preview ready for '+service+' at '+address+'. This demo does not upload customer data or photos; connect the secure estimate API before launch.';
});

// The live API returns only genuinely available slots. The server must re-check and
// reserve the chosen slot atomically when POST /api/bookings is received.
const API_BASE=(window.POWERWASH_CONFIG&&window.POWERWASH_CONFIG.apiBaseUrl||'').replace(/\/$/,'');
const monthCursor=new Date();monthCursor.setDate(1);
let availability=new Map(),selectedDate='',selectedSlot=null;
const dateKey=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const monthKey=d=>dateKey(d).slice(0,7);
function renderCalendar(){
 const year=monthCursor.getFullYear(),month=monthCursor.getMonth();$('calendarMonth').textContent=monthCursor.toLocaleDateString(undefined,{month:'long',year:'numeric'});
 const first=new Date(year,month,1),start=new Date(year,month,1-first.getDay()),today=new Date();today.setHours(0,0,0,0);
 const grid=$('calendarDays');grid.replaceChildren();
 for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=dateKey(d),day=availability.get(key),b=document.createElement('button');b.type='button';b.className='calendar-day';b.textContent=String(d.getDate());
 if(d.getMonth()!==month)b.classList.add('outside-month');if(d<today||!day||!day.slots.some(s=>s.available))b.disabled=true;
 if(key===selectedDate)b.classList.add('selected');if(day&&day.slots.some(s=>s.available))b.classList.add('has-slots');
 b.setAttribute('aria-label',d.toLocaleDateString(undefined,{dateStyle:'full'})+(day&&day.slots.some(s=>s.available)?', available':''));b.addEventListener('click',()=>selectDate(key));grid.append(b);}
}
function renderSlots(){
 const list=$('slotList');list.replaceChildren();const day=availability.get(selectedDate);
 $('slotHeading').textContent=selectedDate?'Available times for '+new Date(selectedDate+'T12:00:00').toLocaleDateString(undefined,{month:'long',day:'numeric'}):'Select an available date';
 const slots=(day?.slots||[]).filter(s=>s.available);
 if(!slots.length){const span=document.createElement('span');span.className='slot-empty';span.textContent='No available times for this date. Choose another highlighted day.';list.append(span);return;}
 slots.forEach(slot=>{const b=document.createElement('button');b.type='button';b.className='slot-button'+(selectedSlot?.id===slot.id?' selected':'');b.textContent=String(slot.label||'Available');
 b.addEventListener('click',()=>{selectedSlot=slot;$('selectedSlot').value=slot.id;renderSlots();$('bookSlotButton').disabled=false;$('bookSlotButton').innerHTML='Book this appointment <span>→</span>';});list.append(b);});
}
function selectDate(key){selectedDate=key;selectedSlot=null;$('selectedSlot').value='';$('bookSlotButton').disabled=true;$('bookSlotButton').textContent='Choose a time first';renderCalendar();renderSlots();}
async function loadAvailability(){
 availability=new Map();selectedDate='';selectedSlot=null;$('selectedSlot').value='';$('bookSlotButton').disabled=true;renderCalendar();renderSlots();
 if(!API_BASE){$('calendarStatus').textContent='Online booking is not connected yet. Real available dates appear after the secure booking API is configured.';return;}
 $('calendarStatus').textContent='Loading available appointment dates…';
 try{const response=await fetch(API_BASE+'/api/availability?month='+encodeURIComponent(monthKey(monthCursor)),{headers:{Accept:'application/json'}});
 if(!response.ok)throw new Error('Availability service returned '+response.status);const payload=await response.json();
 (payload.days||[]).forEach(day=>availability.set(day.date,day));renderCalendar();
 $('calendarStatus').textContent=availability.size?'Select a highlighted date to see open appointment times.':'No open appointments were returned for this month.';
 }catch(error){$('calendarStatus').textContent='Could not load live availability. Please try again later.';console.error(error);}
}
$('prevMonth').addEventListener('click',()=>{monthCursor.setMonth(monthCursor.getMonth()-1);loadAvailability();});
$('nextMonth').addEventListener('click',()=>{monthCursor.setMonth(monthCursor.getMonth()+1);loadAvailability();});
$('bookingForm').addEventListener('submit',async event=>{
 event.preventDefault();if(!API_BASE){$('bookingResult').hidden=false;$('bookingResult').textContent='Online booking is not connected yet. No appointment was created.';return;}
 if(!$('bookingForm').reportValidity()||!selectedSlot)return;
 const button=$('bookSlotButton');button.disabled=true;button.textContent='Checking and booking…';
 const payload={slot_id:selectedSlot.id,service:$('bookingService').value,name:$('customerName').value.trim(),email:$('customerEmail').value.trim(),phone:$('customerPhone').value.trim(),address:$('bookingAddress').value.trim(),notes:$('bookingNotes').value.trim()};
 try{const response=await fetch(API_BASE+'/api/bookings',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)});
 const result=await response.json().catch(()=>({}));if(response.status===409){$('bookingResult').hidden=false;$('bookingResult').textContent='That appointment was just taken. Please select another available time.';await loadAvailability();return;}
 if(!response.ok)throw new Error(result.message||'Booking could not be completed.');
 $('bookingResult').hidden=false;$('bookingResult').textContent='Appointment confirmed. Confirmation reference: '+String(result.confirmation_code||result.booking_id||'confirmed')+'.';
 $('bookingForm').reset();await loadAvailability();
 }catch(error){$('bookingResult').hidden=false;$('bookingResult').textContent=error.message||'Booking failed. Please try again.';}
 finally{button.disabled=!API_BASE||!selectedSlot;if(!selectedSlot)button.textContent='Choose a time first';}
});
renderCalendar();renderSlots();loadAvailability();
