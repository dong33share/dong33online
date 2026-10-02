// Dán URL Web App của Google Apps Script vào đây (xem README.md → "Kết nối form với Google Sheet")
const LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxnCbNBAhaaYhCowa2axF8FgVvJI0QVLmvkTEuAn_cOrmeKMMgyPR7w6LFPedSGB6cF0w/exec';

// Video giới thiệu: link YouTube lấy từ ô B1, tab "Cau hinh" trong Google Sheet (qua LEAD_ENDPOINT)
const VIDEO_CACHE_KEY = 'dong33-intro-video';
function youtubeId(url){
  const match = String(url||'').match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return match ? match[1] : null;
}
function applyIntroVideo(url){
  const id = youtubeId(url);
  if(!id) return;
  const dialog = document.getElementById('video-dialog');
  const embed = dialog.querySelector('.video-embed');
  const cover = document.querySelector('.video-cover img');
  dialog.classList.add('has-video');
  embed.hidden = false;
  embed.dataset.id = id;
  cover.onerror = () => { cover.onerror = null; cover.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; };
  cover.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  cover.alt = 'Video giới thiệu Đông 33';
  document.querySelector('.video-status').lastChild.textContent = 'Xem video giới thiệu';
}
function loadIntroVideo(){
  try{ applyIntroVideo(localStorage.getItem(VIDEO_CACHE_KEY)); }catch(err){}
  if(!LEAD_ENDPOINT) return;
  fetch(LEAD_ENDPOINT).then(res=>res.json()).then(({video})=>{
    try{ localStorage.setItem(VIDEO_CACHE_KEY, video || ''); }catch(err){}
    if(video) applyIntroVideo(video);
  }).catch(()=>{});
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Dialogs
const dialogs = [...document.querySelectorAll('dialog')];
function openDialog(id){const dialog=document.getElementById(id);dialog.showModal();document.body.classList.add('modal-open');
  const embed=dialog.querySelector('.video-embed');
  if(embed&&embed.dataset.id&&!embed.firstChild){embed.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${embed.dataset.id}?autoplay=1&rel=0" title="Video giới thiệu Đông 33" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;}
}
document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>openDialog(button.dataset.dialog)));
dialogs.forEach(dialog=>{dialog.querySelectorAll('.close,.dismiss').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});dialog.addEventListener('close',()=>{const embed=dialog.querySelector('.video-embed');if(embed)embed.innerHTML='';if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');});});

// Opt-in form: validate, send to Google Sheet, then show the thank-you popup
const form = document.getElementById('dang-ky');
const normalizePhone = value => value.replace(/[^\d+]/g,'').replace(/^\+?84/,'0');
const checks = {
  name: value => value.trim().length >= 2 || 'Vui lòng nhập họ và tên',
  phone: value => /^0\d{9}$/.test(normalizePhone(value)) || 'Số điện thoại chưa hợp lệ (10 số, VD: 0901234567)',
  facebook: value => /^(https?:\/\/)?([\w-]+\.)?(facebook|fb)\.com\/\S+/i.test(value.trim()) || /^[\w.]{3,}$/.test(value.trim()) || 'Vui lòng nhập link Facebook, VD: facebook.com/ten-cua-ban',
};
function validate(input){
  const result = checks[input.name](input.value);
  const field = input.closest('.field');
  field.classList.toggle('invalid', result !== true);
  field.querySelector('.field-error').textContent = result === true ? '' : result;
  return result === true;
}
form.querySelectorAll('input[name]').forEach(input=>{
  if(!checks[input.name]) return;
  input.addEventListener('blur',()=>input.value && validate(input));
  input.addEventListener('input',()=>input.closest('.field').classList.contains('invalid') && validate(input));
});
form.addEventListener('submit', async event=>{
  event.preventDefault();
  const inputs = [...form.querySelectorAll('input[name]')].filter(input=>checks[input.name]);
  const valid = inputs.map(validate).every(Boolean);
  if(!valid){ form.querySelector('.invalid input').focus(); return; }
  if(form.elements.website.value) return; // bot đã điền ô ẩn

  const button = form.querySelector('button[type=submit]');
  const label = button.querySelector('.btn-label');
  const error = form.querySelector('.form-error');
  const data = {
    name: form.elements['name'].value.trim(),
    phone: normalizePhone(form.elements.phone.value),
    facebook: form.elements.facebook.value.trim(),
    page: location.href,
    submittedAt: new Date().toISOString(),
  };
  button.disabled = true; label.textContent = 'Đang gửi…'; error.hidden = true;
  try{
    if(LEAD_ENDPOINT){
      await fetch(LEAD_ENDPOINT,{method:'POST',mode:'no-cors',body:new URLSearchParams(data)});
    }else{
      console.warn('LEAD_ENDPOINT chưa được cấu hình — dữ liệu form chưa được lưu.', data);
    }
    document.querySelector('.thanks-name').textContent = data.name.split(/\s+/).pop();
    form.reset();
    document.getElementById('booking-dialog').close();
    openDialog('thanks-dialog');
  }catch(err){
    error.hidden = false;
  }finally{
    button.disabled = false; label.textContent = 'Gửi đăng ký';
  }
});

// Sticky nav gets a glass background once the page scrolls
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScroll, {passive:true});
onScroll();

// Reveal on scroll, staggered within each group
if('IntersectionObserver' in window && !reduceMotion){
  document.documentElement.classList.add('js');
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);setTimeout(()=>entry.target.style.transitionDelay='',1300);}});},{threshold:.12,rootMargin:'0px 0px -40px'});
  document.querySelectorAll('.reveal').forEach(element=>{
    const siblings=[...element.parentElement.children].filter(child=>child.classList.contains('reveal'));
    element.style.transitionDelay=`${siblings.indexOf(element)%4*90}ms`;
    observer.observe(element);
  });
}

// Soft spotlight that follows the cursor on project cards
if(matchMedia('(hover: hover)').matches && !reduceMotion){
  document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('pointermove',event=>{
    const box=card.getBoundingClientRect();
    card.style.setProperty('--x',`${event.clientX-box.left}px`);
    card.style.setProperty('--y',`${event.clientY-box.top}px`);
  }));
}

loadIntroVideo();
