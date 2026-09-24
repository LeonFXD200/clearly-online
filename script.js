document.documentElement.classList.add('js');
const menu=document.querySelector('.menu');
const nav=document.querySelector('#navigation');
if(menu&&nav){
  const header=menu.closest('header');
  const websites=nav.querySelector('.nav-websites');
  const closeWebsites=()=>{if(websites)websites.open=false;};
  menu.hidden=false;
  const closeMenu=()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open');closeWebsites();};
  menu.addEventListener('click',()=>{
    const open=menu.getAttribute('aria-expanded')!=='true';
    menu.setAttribute('aria-expanded',String(open));
    nav.classList.toggle('open',open);
    if(!open)closeWebsites();
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    if(websites?.open){event.preventDefault();closeWebsites();websites.querySelector('summary').focus();}
    else if(nav.classList.contains('open')){event.preventDefault();closeMenu();menu.focus();}
  });
  document.addEventListener('click',event=>{if(!header.contains(event.target))closeMenu();});
  document.addEventListener('focusin',event=>{
    if(!header.contains(event.target))closeMenu();
    else if(websites&&!websites.contains(event.target))closeWebsites();
  });
  window.matchMedia('(min-width: 781px)').addEventListener('change',closeMenu);
}
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
  const mode=button.dataset.mode;
  document.querySelectorAll('[data-mode]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  document.querySelectorAll('.price').forEach(item=>item.querySelector('span').textContent=item.dataset[mode]);
  document.querySelectorAll('.price small,.payment-note').forEach(item=>item.textContent=item.dataset[mode]);
  document.querySelectorAll('[data-plan-enquiry]').forEach(link=>{
    const target=new URL(link.href);
    target.searchParams.set('payment',mode);
    link.href=target.href;
  });
  const status=document.querySelector('#price-status');
  if(status)status.textContent=mode==='monthly'?'Managed monthly prices shown, including setup fees and first-year totals.':'One-off website build prices shown. Hosting and ongoing support are separate.';
}));
const costPlan=document.querySelector('#cost-plan');
if(costPlan){
  const costPeriod=document.querySelector('#cost-period');
  const care=document.querySelector('#cost-care');
  [costPlan,costPeriod,care].forEach(control=>control.disabled=false);
  const plans=[{build:795,monthly:99,setup:195},{build:1495,monthly:159,setup:295},{build:2495,monthly:239,setup:395}];
  const money=value=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(value);
  const update=()=>{
    const plan=plans[Number(costPlan.value)],months=Number(costPeriod.value),careRate=care.checked?39:0,prefix=costPlan.value==='2'?'From ':'';
    document.querySelector('#build-total').textContent=prefix+money(plan.build+months*careRate);
    document.querySelector('#managed-total').textContent=prefix+money(plan.setup+months*plan.monthly);
    document.querySelector('#build-equation').textContent=`${money(plan.build)} build${care.checked?` + ${months} × £39 care`:'; ongoing hosting not included'}`;
    document.querySelector('#managed-equation').textContent=`${money(plan.setup)} setup + ${months} × ${money(plan.monthly)}`;
    document.querySelector('#cost-care-label').textContent=care.checked?'+ care':'only';
    document.querySelector('#cost-assumptions').textContent=`Guide totals over ${months} months. ${months===24?'Assumes current rates continue after the 12-month minimum; this is not a price lock. ':''}Managed includes hosting, care and a small editing allowance; standalone care does not include that editing allowance. Totals exclude third-party charges and any applicable VAT.`;
    document.querySelectorAll('[data-cost-enquiry]').forEach(link=>{
      const target=new URL(link.href);
      target.searchParams.set('plan',['Starter','Business','Growth'][Number(costPlan.value)]);
      link.href=target.href;
    });
  };
  [costPlan,costPeriod,care].forEach(control=>control.addEventListener('change',update));
  update();
}
const form=document.querySelector('#brief-form');
if(form){
  const submitButton=form.querySelector('button[type=submit]');
  submitButton.disabled=false;
  const preparationHelp=submitButton.nextElementSibling;
  if(form.dataset.email&&preparationHelp)preparationHelp.firstChild.nodeValue='Preparing your enquiry copies it automatically. You can then open Gmail, use your normal email app, or copy it again. ';
  const parameters=new URLSearchParams(location.search);
  const requestedPlan=parameters.get('plan');
  const select=form.querySelector('[name=plan]');
  if([...select.options].some(option=>option.value===requestedPlan))select.value=requestedPlan;
  const payment=form.querySelector('[name=payment]');
  const requestedPayment=parameters.get('payment');
  if(['build','monthly'].includes(requestedPayment))payment.value=requestedPayment;
  const output=document.querySelector('#brief-output'),status=document.querySelector('#form-status'),draft=document.querySelector('#email-draft'),actions=document.querySelector('#brief-actions'),copy=document.querySelector('#copy-brief');
  const mailApp=draft.cloneNode(true);
  mailApp.id='email-app';mailApp.className='button outline';mailApp.firstChild.nodeValue='Open email app ';
  actions.insertBefore(mailApp,copy);
  draft.firstChild.nodeValue='Open in Gmail ';draft.target='_blank';draft.rel='noopener';
  copy.className='button accent';
  let prepared=false;
  const copyPreparedBrief=async brief=>{
    try{await navigator.clipboard.writeText(brief);return true;}
    catch{
      output.focus();output.select();
      try{return document.execCommand('copy');}catch{return false;}
    }
  };
  const invalidate=event=>{
    if(!prepared||event.target===output)return;
    prepared=false;
    output.hidden=true;
    output.value='';
    actions.hidden=true;
    draft.removeAttribute('href');
    mailApp.removeAttribute('href');
    status.textContent='Your details have changed. Prepare your enquiry again to include the latest version.';
  };
  form.addEventListener('input',invalidate);
  form.addEventListener('change',invalidate);
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const data=new FormData(form);
    const paymentLabel={unsure:'I would like advice',build:'One-off build',monthly:'Managed monthly'}[data.get('payment')];
    const brief=`Website enquiry for Clearly Online\n\nName: ${data.get('name').trim()}\nBusiness: ${data.get('business').trim()||'Not supplied'}\nEmail: ${data.get('email').trim()||'Not supplied'}\nWebsite: ${data.get('website').trim()||'Not supplied'}\nInterested in: ${data.get('plan')}\nPayment preference: ${paymentLabel}\nBudget: ${data.get('budget').trim()||'Not supplied'}\n\n${data.get('message').trim()}`;
    output.value=brief;output.hidden=false;actions.hidden=false;prepared=true;
    if(form.dataset.email){
      const subject='Website enquiry - '+(data.get('business').trim()||data.get('name').trim());
      const encodedSubject=encodeURIComponent(subject),encodedBrief=encodeURIComponent(brief);
      draft.href=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(form.dataset.email)}&su=${encodedSubject}&body=${encodedBrief}`;
      mailApp.href=`mailto:${form.dataset.email}?subject=${encodedSubject}&body=${encodedBrief}`;
      draft.hidden=false;mailApp.hidden=false;
      const copied=await copyPreparedBrief(brief);
      status.textContent=copied?`Your enquiry has been copied. Open Gmail or your email app, then send it to ${form.dataset.email}. Nothing has been sent yet.`:'Your enquiry is ready below. Open Gmail, open your email app, or use Copy enquiry. Nothing has been sent yet.';
    }
    else {draft.hidden=true;status.textContent='Your brief is ready below. You can copy it using the button. Nothing has been sent.';}
    output.focus();
  });
  copy.addEventListener('click',async()=>{
    if(!prepared)return;
    const currentBrief=output.value;
    const copied=await copyPreparedBrief(currentBrief);
    if(prepared&&output.value===currentBrief)status.textContent=copied?`Enquiry copied. Paste it into an email${form.dataset.email?' to '+form.dataset.email:''} and send when you are ready. Nothing has been sent by this website.`:'Automatic copying is unavailable. Your enquiry text is selected below; use your device’s Copy command, then paste it into an email.';
  });
}
const year=document.querySelector('#year');
if(year)year.textContent=new Date().getFullYear();
