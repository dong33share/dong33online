const dialogs = [...document.querySelectorAll('dialog')];
function openDialog(id){const dialog=document.getElementById(id);dialog.showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>openDialog(button.dataset.dialog)));
dialogs.forEach(dialog=>{dialog.querySelectorAll('.close,.dismiss').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));});
document.querySelectorAll('[data-social]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('social-title').textContent='Gặp Đông trên '+button.dataset.social;openDialog('social-dialog');}));


const latButton=document.getElementById('lat-hello');
const greetings=['Hè lô! Lát chào bạn nha ☺','Ghé đây rồi thì thả lỏng vai một chút nha.','Chúc bạn hôm nay rì lát hơn một chút!'];
let greetingIndex=0;
latButton.addEventListener('click',()=>{document.getElementById('lat-speech').textContent=greetings[greetingIndex++ % greetings.length];latButton.classList.remove('waving');void latButton.offsetWidth;latButton.classList.add('waving');});
latButton.addEventListener('animationend',()=>latButton.classList.remove('waving'));
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.08});document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));}
