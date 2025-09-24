(function(){
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const submitBtn = document.getElementById('submitBtn');

  function showToast(msg, type='success'){
    toast.innerHTML = (type === 'success'
      ? '<i class="fa-solid fa-circle-check"></i>'
      : '<i class="fa-solid fa-circle-exclamation"></i>') + ' ' + msg;
    toast.style.background = type === 'success' ? '#0f5132' : '#7f1d1d';
    toast.classList.add('show');
    setTimeout(()=> toast.classList.remove('show'), 3000);
  }

  function validate(){
    let ok = true;
    const fields = [
      { id:'name', message:'Enter full name' },
      { id:'email', message:'Enter a valid email', type:'email' },
      { id:'topic', message:'Select a topic' },
      { id:'message', message:'Write your message (min 10 chars)', min:10 },
      { id:'consent', message:'Consent required', type:'checkbox' }
    ];

    fields.forEach(f=>{
      const el = document.getElementById(f.id);
      const msgEl = el.closest('.form-field')?.querySelector('.error-msg') || (f.id==='consent'? form.querySelector('.form-disclaimer') : null);
      let valid = true;

      if(f.type === 'checkbox'){
        valid = el.checked;
      } else if(f.type === 'email'){
        const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        valid = re.test(el.value.trim());
      } else if(f.min){
        valid = (el.value.trim().length >= f.min);
      } else {
        valid = el.value.trim() !== '';
      }

      // visual
      if(f.type !== 'checkbox'){
        el.classList.toggle('error', !valid);
      }
      if(msgEl && f.type !== 'checkbox'){
        msgEl.textContent = valid ? '' : f.message;
      }

      if(!valid) ok = false;
    });

    return ok;
  }

  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!validate()) return;

    // Simulate async submit
    submitBtn.disabled = true;
    const original = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try{
      await new Promise(r=> setTimeout(r, 1200));
      form.reset();
      showToast('Message sent successfully');
    }catch(err){
      showToast('Could not send message. Try again','error');
    }finally{
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
    }
  });
})();
