const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('.mobile-nav');
menuButton?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.querySelector('b').textContent=open?'×':'+'});
mobileNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileNav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');if(menuButton)menuButton.querySelector('b').textContent='+'}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.14});
document.querySelectorAll('.reveal').forEach((element,index)=>{element.style.transitionDelay=`${Math.min(index*55,220)}ms`;observer.observe(element)});
document.querySelector('#year').textContent=new Date().getFullYear();
