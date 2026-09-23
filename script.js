document.documentElement.classList.add('js');
const menu=document.querySelector('.menu');
const nav=document.querySelector('#navigation');
if(menu&&nav){
  menu.hidden=false;
  const closeMenu=()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open');};
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
  window.matchMedia('(min-width: 781px)').addEventListener('change',closeMenu);
}
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
  const mode=button.dataset.mode;
  document.querySelectorAll('[data-mode]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  document.querySelectorAll('.price').forEach(item=>item.querySelector('span').textContent=item.dataset[mode]);
  document.querySelectorAll('.price small,.payment-note').forEach(item=>item.textContent=item.dataset[mode]);
  const status=document.querySelector('#price-status');
  if(status)status.textContent=mode==='monthly'?'Managed monthly prices shown, including setup fees and first-year totals.':'One-off website build prices shown. Hosting and ongoing support are separate.';
}));
const costPlan=document.querySelector('#cost-plan');
if(costPlan){
  const costPeriod=document.querySelector('#cost-period');
  const care=document.querySelector('#cost-care');
  const plans=[{build:950,monthly:120,setup:250},{build:1850,monthly:195,setup:350},{build:3250,monthly:295,setup:500}];
  const money=value=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(value);
  const update=()=>{
    const plan=plans[Number(costPlan.value)],months=Number(costPeriod.value),careRate=care.checked?39:0,prefix=costPlan.value==='2'?'From ':'';
    document.querySelector('#build-total').textContent=prefix+money(plan.build+months*careRate);
    document.querySelector('#managed-total').textContent=prefix+money(plan.setup+months*plan.monthly);
    document.querySelector('#build-equation').textContent=`${money(plan.build)} build${care.checked?` + ${months} × £39 care`:'; ongoing hosting not included'}`;
    document.querySelector('#managed-equation').textContent=`${money(plan.setup)} setup + ${months} × ${money(plan.monthly)}`;
    document.querySelector('#cost-care-label').textContent=care.checked?'+ care':'only';
    document.querySelector('#cost-assumptions').textContent=`Guide totals over ${months} months. ${months===24?'Assumes current rates continue after the 12-month minimum; this is not a price lock. ':''}Managed includes hosting, care and a small editing allowance; standalone care does not include that editing allowance. Totals exclude third-party charges and any applicable VAT.`;
  };
  [costPlan,costPeriod,care].forEach(control=>control.addEventListener('change',update));
  update();
}
const form=document.querySelector('#brief-form');
if(form){
  form.querySelector('button[type=submit]').disabled=false;
  const requestedPlan=new URLSearchParams(location.search).get('plan');
  const select=form.querySelector('[name=plan]');
  if([...select.options].some(option=>option.value===requestedPlan))select.value=requestedPlan;
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const data=new FormData(form);
    const brief=`Website enquiry for Made Proper\n\nName: ${data.get('name')}\nBusiness: ${data.get('business')||'Not supplied'}\nEmail: ${data.get('email')||'Not supplied'}\nWebsite: ${data.get('website')||'Not supplied'}\nInterested in: ${data.get('plan')}\nBudget / payment preference: ${data.get('budget')||'Not supplied'}\n\n${data.get('message')}`;
    const output=document.querySelector('#brief-output'),status=document.querySelector('#form-status'),draft=document.querySelector('#email-draft');
    output.value=brief;output.hidden=false;
    if(form.dataset.email){draft.href=`mailto:${form.dataset.email}?subject=${encodeURIComponent('Website enquiry — '+(data.get('business')||data.get('name')))}&body=${encodeURIComponent(brief)}`;draft.hidden=false;status.textContent='Your brief is ready. Open your email draft below, review it and press Send in your email app. Nothing has been sent yet. If a long draft does not open correctly, copy the text below into an email.';}
    else {try{await navigator.clipboard.writeText(brief);status.textContent='Your brief has been copied. Nothing has been sent.';}catch{status.textContent='Your brief is ready below. Select and copy it; nothing has been sent.';}}
    output.focus();
  });
}
const year=document.querySelector('#year');
if(year)year.textContent=new Date().getFullYear();
