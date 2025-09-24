(function(){
  // Simple in-view reveal for metrics and timeline
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('reveal');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.metric, .tl-item, .eco-card, .leader-card')
    .forEach(el=>{
      el.style.opacity = 0;
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      io.observe(el);
    });

  const style = document.createElement('style');
  style.textContent = `
    .reveal{opacity:1 !important; transform:translateY(0) !important;}
  `;
  document.head.appendChild(style);
})();
