/* ═══════════════════════════════════════════
   SHAHENDA STORE — admin.js v3.0
═══════════════════════════════════════════ */

/* ── LOGIN ── */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin 123';
const SESSION_KEY = 'shahenda_admin_auth';

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function initLogin() {
  const screen = document.getElementById('loginScreen');

  // Already logged in this session → hide screen immediately
  if (isLoggedIn()) { screen.style.display = 'none'; return; }

  // Show screen, focus username
  document.getElementById('loginUser').focus();

  function tryLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const err  = document.getElementById('loginErr');

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      screen.style.transition = 'opacity .3s ease';
      screen.style.opacity = '0';
      setTimeout(() => screen.style.display = 'none', 300);
    } else {
      err.style.display = 'block';
      document.getElementById('loginPass').value = '';
      document.getElementById('loginPass').focus();
      // Shake animation
      const box = screen.querySelector('.login-box');
      box.style.animation = 'none';
      box.style.transform = 'translateX(8px)';
      setTimeout(() => { box.style.transition = 'transform .3s ease'; box.style.transform = ''; }, 50);
      setTimeout(() => err.style.display = 'none', 3000);
    }
  }

  document.getElementById('loginBtn').addEventListener('click', tryLogin);
  document.getElementById('loginPass').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  document.getElementById('loginUser').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('loginPass').focus(); });
}
const SB_URL = 'https://aweuqtiqfxjoflvvturi.supabase.co';
const SB_KEY = 'sb_publishable_DIHyv13-yCxgBKIC8PYCvQ_394bcWSE';
const sb = typeof supabase !== 'undefined' ? supabase.createClient(SB_URL, SB_KEY) : null;
const WA = '20113156642';

/* ── Local fallback state ── */
let allOrders = [];
let allProducts = [];
let allPromos = [];
let allOffers = [];
let orderStatuses = {};
let uploadedImgBase64 = '';

function loadLS(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch(e) { return def; } }
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

/* ── Toast ── */
function toast(msg, type='', dur=3200) {
  const c = document.getElementById('tc');
  const t = document.createElement('div');
  t.className = 'tst' + (type ? ' '+type : '');
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('hid'); t.addEventListener('animationend',()=>t.remove(),{once:true}); }, dur);
}
const EGP = v => `${Number(v).toLocaleString('ar-EG')} ج`;
const dtFmt = s => new Date(s).toLocaleString('ar-EG',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ── Navigation ── */
function initNav() {
  document.querySelectorAll('.nav-link[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
      const tab = btn.dataset.tab;
      if (tab==='orders')   renderOrders();
      if (tab==='products') renderProducts();
      if (tab==='offers')   renderOffers();
      if (tab==='promos')   renderPromos();
      if (tab==='stats')    renderStats();
      closeSB();
    });
  });
  document.getElementById('mobToggle').addEventListener('click',()=>{
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sbOverlay').style.display='block';
  });
}
window.closeSB = function(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sbOverlay').style.display='none';
};

/* ── Modals ── */
window.closeMo = id => document.getElementById(id).classList.remove('open');
const openMo  = id => document.getElementById(id).classList.add('open');
document.addEventListener('click', e => { if(e.target.classList.contains('mo')) e.target.classList.remove('open'); });

/* ════════════════════════
   ORDERS
════════════════════════ */
async function loadOrders() {
  if (!sb) { allOrders=[]; renderOrders(); return; }
  try {
    const {data,error} = await sb.from('orders').select('*').order('created_at',{ascending:false});
    if(error) throw error;
    allOrders = data||[];
  } catch(e) { toast('خطأ في تحميل الطلبات','err'); }
  orderStatuses = loadLS('order_statuses',{});
  renderOrders();
  updateOrderStats();
}

function getOrdStatus(id) { return orderStatuses[String(id)]||'new'; }
function setOrdStatus(id,s) { orderStatuses[String(id)]=s; saveLS('order_statuses',orderStatuses); renderOrders(); updateOrderStats(); toast(s==='done'?'تم تحديده كمكتمل ✓':s==='cancelled'?'تم الإلغاء':'تمت إعادة الطلب'); }
window.setOrdStatus = setOrdStatus;

function renderOrders() {
  const q = (document.getElementById('orderSrch')?.value||'').toLowerCase();
  const sf = document.getElementById('orderStatus')?.value||'all';
  const list = allOrders.filter(o => {
    const ms = sf==='all'||getOrdStatus(o.id)===sf;
    const mq = !q||(o.customer_name||'').toLowerCase().includes(q)||(o.product_name||'').toLowerCase().includes(q)||(o.customer_phone||'').toLowerCase().includes(q);
    return ms&&mq;
  });
  const tb = document.getElementById('ordersTbody');
  if(!list.length){tb.innerHTML=`<tr><td colspan="9" class="empty-td">📭 لا توجد طلبات</td></tr>`;return;}
  tb.innerHTML = list.map((o,i)=>{
    const st=getOrdStatus(o.id);
    const bc=st==='done'?'s-done':st==='cancelled'?'s-cancelled':'s-new';
    const bl=st==='done'?'مكتمل':st==='cancelled'?'ملغي':'جديد';
    const waTxt=encodeURIComponent(`طلب #${o.id}\n${o.brand} ${o.product_name} ${o.size_ml}ml\nالكمية: ${o.quantity}\nالإجمالي: ${o.total} جنيه\nالعميل: ${o.customer_name}\nهاتف: ${o.customer_phone||'—'}\nعنوان: ${o.customer_address||'—'}`);
    return `<tr>
      <td style="color:var(--text-3);font-size:.75rem">${i+1}</td>
      <td><div class="t-name">${esc(o.customer_name)}</div><div class="t-phone">${esc(o.customer_phone||'—')}</div><div style="font-size:.7rem;color:var(--text-3);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(o.customer_address||'')}</div></td>
      <td><div style="font-weight:600;color:var(--text);font-size:.88rem">${esc(o.brand)} ${esc(o.product_name)}</div>${o.promo_code?`<div style="font-size:.7rem;color:var(--gold-dk)">كود: ${esc(o.promo_code)}</div>`:''}</td>
      <td>${o.size_ml||'—'}ml</td>
      <td style="text-align:center">${o.quantity||1}</td>
      <td><span class="t-price">${EGP(o.total)}</span>${o.discount_amount>0?`<div style="font-size:.7rem;color:var(--text-3)">خصم ${EGP(o.discount_amount)}</div>`:''}</td>
      <td style="font-size:.75rem;color:var(--text-3);white-space:nowrap">${dtFmt(o.created_at)}</td>
      <td><span class="status-badge ${bc}">${bl}</span></td>
      <td><div class="act-btns">
        <button class="act act-wa" onclick="window.open('https://wa.me/${WA}?text=${waTxt}','_blank')" title="واتساب">💬</button>
        ${st!=='done'?`<button class="act act-done" onclick="setOrdStatus('${o.id}','done')">✓</button>`:''}
        ${st!=='cancelled'?`<button class="act act-del" onclick="setOrdStatus('${o.id}','cancelled')">✕</button>`:''}
        ${st!=='new'?`<button class="act act-back" onclick="setOrdStatus('${o.id}','new')">↩</button>`:''}
      </div></td>
    </tr>`;
  }).join('');
}

function updateOrderStats() {
  const tot=allOrders.length, newC=allOrders.filter(o=>getOrdStatus(o.id)==='new').length;
  const rev=allOrders.reduce((s,o)=>s+Number(o.total||0),0);
  const tod=allOrders.filter(o=>new Date(o.created_at).toDateString()===new Date().toDateString()).length;
  document.getElementById('stTotal').textContent=tot;
  document.getElementById('stNew').textContent=newC;
  document.getElementById('stRev').textContent=EGP(rev);
  document.getElementById('stToday').textContent=tod;
  const b=document.getElementById('newBadge');
  if(newC>0){b.style.display='inline-block';b.textContent=newC;}else b.style.display='none';
}

function exportCSV() {
  if(!allOrders.length){toast('لا طلبات للتصدير','err');return;}
  const hdr=['#','العميل','الهاتف','العنوان','المنتج','الماركة','الحجم ml','الكمية','الإجمالي','كود الخصم','التاريخ','الحالة'];
  const rows=allOrders.map((o,i)=>[i+1,o.customer_name,o.customer_phone||'',o.customer_address||'',o.product_name,o.brand||'',o.size_ml||'',o.quantity||1,o.total||0,o.promo_code||'',dtFmt(o.created_at),getOrdStatus(o.id)].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  const csv='\uFEFF'+[hdr.join(','),...rows].join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
  a.download=`orders-${new Date().toISOString().split('T')[0]}.csv`;a.click();
  toast('تم تصدير الطلبات ✓','ok');
}

/* ════════════════════════
   PRODUCTS
════════════════════════ */
async function loadProducts() {
  if (!sb) { allProducts=loadLS('products',[]); renderProducts(); return; }
  try {
    const {data,error}=await sb.from('products').select('*').order('id');
    if(error) throw error;
    allProducts=data||[];
  } catch(e) { allProducts=loadLS('products',[]); }
  renderProducts();
}

function renderProducts() {
  const q=(document.getElementById('prodSrch')?.value||'').toLowerCase();
  const cf=document.getElementById('prodCat')?.value||'all';
  const list=allProducts.filter(p=>{
    const mc=cf==='all'||p.category===cf;
    const mq=!q||p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q);
    return mc&&mq;
  });
  const g=document.getElementById('prodGrid');
  if(!list.length){g.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-3)">🔍 لا توجد منتجات</div>`;return;}
  g.innerHTML=list.map(p=>{
    const sizes=Array.isArray(p.sizes)?p.sizes:JSON.parse(p.sizes||'[]');
    const szHtml=sizes.slice(0,5).map(s=>`<span class="pa-size">${s.ml}ml · ${EGP(s.price)}</span>`).join('');
    return `<div class="pa-card">
      <div class="pa-img">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy"/>`: '<span style="font-size:2.5rem">🧴</span>'}</div>
      <div class="pa-info">
        <div class="pa-name">${esc(p.name)}</div>
        <div class="pa-brand">${esc(p.brand)} · ${p.category==='Men / Unisex'?'رجالي':p.category==='Women'?'نسائي':'مسك/عود'}</div>
        ${p.discount>0?`<span style="font-size:.72rem;color:var(--red);font-weight:600">خصم ${p.discount}%</span>`:''}
        <div class="pa-sizes">${szHtml}</div>
        <div class="pa-acts">
          <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})">✏️ تعديل</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDel('product',${p.id},'${esc(p.name)}')">🗑️</button>
          <button class="btn btn-sm" style="background:rgba(45,106,79,.1);color:var(--green)" onclick="toggleProduct(${p.id},${!p.active})">${p.active?'إخفاء':'إظهار'}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* Size rows builder */
window.addSizeRow = function(ml='',price=''){
  const rows=document.getElementById('sizeRows');
  const div=document.createElement('div');div.className='size-row-input';
  div.innerHTML=`<input type="number" min="1" placeholder="ml (مثال: 30)" value="${ml}" class="sml"/><input type="number" min="0" placeholder="السعر (جنيه)" value="${price}" class="sprice"/><button type="button" class="size-del" onclick="this.parentElement.remove()">✕</button>`;
  rows.appendChild(div);
};

function getSizeRows(){
  return Array.from(document.querySelectorAll('#sizeRows .size-row-input')).map(row=>{
    const ml=Number(row.querySelector('.sml').value);
    const price=Number(row.querySelector('.sprice').value);
    return ml&&price?{ml,price}:null;
  }).filter(Boolean);
}

window.handleImgUpload = function(input){
  if(!input.files[0]) return;
  const reader=new FileReader();
  reader.onload=e=>{
    uploadedImgBase64=e.target.result;
    document.getElementById('imgPreview').src=uploadedImgBase64;
    document.getElementById('imgPreview').style.display='block';
    document.getElementById('imgPlaceholder').style.display='none';
    document.getElementById('pImgFinal').value=uploadedImgBase64;
  };
  reader.readAsDataURL(input.files[0]);
};

window.previewUrl = function(url){
  if(!url) return;
  document.getElementById('imgPreview').src=url;
  document.getElementById('imgPreview').style.display='block';
  document.getElementById('imgPlaceholder').style.display='none';
  document.getElementById('pImgFinal').value=url;
};

function openProductForm(reset=true){
  document.getElementById('prodFormCard').style.display='block';
  if(reset){
    document.getElementById('prodFormTitle').textContent='➕ منتج جديد';
    document.getElementById('editProdId').value='';
    ['pName','pBrand','pDesc','pImgUrl'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('pCat').value='Men / Unisex';
    document.getElementById('pDiscount').value='0';
    document.getElementById('pRating').value='4.5';
    document.getElementById('sizeRows').innerHTML='';
    document.getElementById('imgPreview').style.display='none';
    document.getElementById('imgPlaceholder').style.display='block';
    document.getElementById('pImgFinal').value='';
    uploadedImgBase64='';
    addSizeRow(30,'');addSizeRow(50,'');addSizeRow(100,'');
  }
  document.getElementById('prodFormCard').scrollIntoView({behavior:'smooth'});
}

window.editProduct = function(id){
  const p=allProducts.find(x=>x.id===id);if(!p)return;
  openProductForm(true);
  document.getElementById('prodFormTitle').textContent='✏️ تعديل المنتج';
  document.getElementById('editProdId').value=id;
  document.getElementById('pName').value=p.name;
  document.getElementById('pBrand').value=p.brand;
  document.getElementById('pDesc').value=p.description||'';
  document.getElementById('pCat').value=p.category;
  document.getElementById('pDiscount').value=p.discount||0;
  document.getElementById('pRating').value=p.rating||4.5;
  document.getElementById('pImgUrl').value=p.image_url||'';
  document.getElementById('pImgFinal').value=p.image_url||'';
  if(p.image_url){previewUrl(p.image_url);}
  document.getElementById('sizeRows').innerHTML='';
  const sizes=Array.isArray(p.sizes)?p.sizes:JSON.parse(p.sizes||'[]');
  sizes.forEach(s=>addSizeRow(s.ml,s.price));
};

async function saveProduct(){
  const name=document.getElementById('pName').value.trim();
  const brand=document.getElementById('pBrand').value.trim();
  const sizes=getSizeRows();
  if(!name||!brand){toast('اسم الماركة والعطر مطلوبان','err');return;}
  if(!sizes.length){toast('أضف حجماً واحداً على الأقل','err');return;}
  const payload={
    name,brand,
    category:document.getElementById('pCat').value,
    description:document.getElementById('pDesc').value.trim()||null,
    image_url:document.getElementById('pImgFinal').value||null,
    sizes:JSON.stringify(sizes),
    discount:Number(document.getElementById('pDiscount').value)||0,
    rating:parseFloat(document.getElementById('pRating').value)||4.5,
    active:true,
  };
  const editId=document.getElementById('editProdId').value;
  const btn=document.getElementById('btnSaveProd');
  btn.disabled=true;btn.textContent='⏳ جاري الحفظ...';
  try {
    if(sb){
      if(editId){
        const{error}=await sb.from('products').update(payload).eq('id',editId);
        if(error) throw error;
        allProducts=allProducts.map(p=>p.id==editId?{...p,...payload,id:Number(editId)}:p);
      } else {
        const{data,error}=await sb.from('products').insert([payload]).select();
        if(error) throw error;
        if(data) allProducts.push(data[0]);
      }
    } else {
      if(editId){allProducts=allProducts.map(p=>p.id==editId?{...p,...payload}:p);}
      else{const newP={...payload,id:Date.now(),sizes};allProducts.push(newP);}
      saveLS('products',allProducts);
    }
    toast(editId?`تم تعديل "${name}" ✓`:`تم إضافة "${name}" ✓`,'ok');
    document.getElementById('prodFormCard').style.display='none';
    renderProducts();
  } catch(e){ toast('خطأ في الحفظ: '+e.message,'err'); }
  btn.disabled=false;btn.textContent='💾 حفظ المنتج';
}

window.toggleProduct = async function(id,active){
  if(sb){try{await sb.from('products').update({active}).eq('id',id);}catch(e){}}
  allProducts=allProducts.map(p=>p.id===id?{...p,active}:p);
  saveLS('products',allProducts);
  renderProducts();
  toast(active?'تم إظهار المنتج':'تم إخفاء المنتج');
};

/* ════════════════════════
   OFFERS (localStorage)
════════════════════════ */
function loadOffers(){
  allOffers=loadLS('offers',[]);
  if(!allOffers.length){
    allOffers=[{id:1,name:'بوكس 10 عطور 30ml',price:1500,oldPrice:3000,qty:10,desc:'احصل على 10 قطع 30ml من اختيارك بسعر مميز',active:true}];
    saveLS('offers',allOffers);
  }
}
function renderOffers(){
  const c=document.getElementById('offersList');
  if(!allOffers.length){c.innerHTML=`<div style="text-align:center;padding:40px;color:var(--text-3)">لا توجد عروض. أضف عرضاً جديداً.</div>`;return;}
  c.innerHTML=allOffers.map(o=>`
    <div class="offer-adm">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
        <div><h3>${esc(o.name)}</h3><p style="margin-top:4px">${esc(o.desc||'')}</p></div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="editOffer(${o.id})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDel('offer',${o.id},'${esc(o.name)}')">🗑️</button>
        </div>
      </div>
      <div class="offer-meta">
        <span>السعر: <strong>${EGP(o.price)}</strong></span>
        ${o.oldPrice?`<span>الأصلي: <strong style="text-decoration:line-through;color:var(--text-3)">${EGP(o.oldPrice)}</strong></span>`:''}
        <span>القطع: <strong>${o.qty}</strong></span>
      </div>
      <div class="tog-wrap">
        <input type="checkbox" class="tog" id="ot${o.id}" ${o.active?'checked':''} onchange="toggleOffer(${o.id},this.checked)"/>
        <label for="ot${o.id}">${o.active?'✅ مفعّل':'❌ معطّل'}</label>
      </div>
    </div>`).join('');
}
window.toggleOffer = function(id,v){const o=allOffers.find(x=>x.id===id);if(o){o.active=v;saveLS('offers',allOffers);toast(v?'تم تفعيل العرض':'تم إيقاف العرض');}};
window.editOffer = function(id){
  const o=allOffers.find(x=>x.id===id);if(!o)return;
  document.getElementById('moOfferTitle').textContent='✏️ تعديل العرض';
  document.getElementById('editOfferId').value=id;
  document.getElementById('oName').value=o.name;
  document.getElementById('oPrice').value=o.price;
  document.getElementById('oOldPrice').value=o.oldPrice||'';
  document.getElementById('oQty').value=o.qty;
  document.getElementById('oDesc').value=o.desc||'';
  document.getElementById('oActive').checked=o.active;
  openMo('moOffer');
};
function saveOffer(){
  const name=document.getElementById('oName').value.trim();
  const price=Number(document.getElementById('oPrice').value);
  if(!name||!price){toast('اسم العرض والسعر مطلوبان','err');return;}
  const d={name,price,oldPrice:Number(document.getElementById('oOldPrice').value)||0,qty:Number(document.getElementById('oQty').value)||1,desc:document.getElementById('oDesc').value.trim(),active:document.getElementById('oActive').checked};
  const eid=document.getElementById('editOfferId').value;
  if(eid){allOffers=allOffers.map(o=>o.id==eid?{...o,...d}:o);toast('تم تعديل العرض ✓','ok');}
  else{d.id=Date.now();allOffers.push(d);toast('تم إضافة العرض ✓','ok');}
  saveLS('offers',allOffers);closeMo('moOffer');renderOffers();
}

/* ════════════════════════
   PROMOS
════════════════════════ */
async function loadPromos(){
  if(sb){try{const{data}=await sb.from('promo_codes').select('*').order('id');allPromos=data||[];}catch(e){allPromos=loadLS('promos',[]);}}
  else allPromos=loadLS('promos',[]);
  if(!allPromos.length){allPromos=[{id:1,code:'SAVE10',discount:10,max_uses:0,uses:0,active:true},{id:2,code:'SHAHENDA15',discount:15,max_uses:0,uses:0,active:true}];saveLS('promos',allPromos);}
  renderPromos();
}
function renderPromos(){
  const tb=document.getElementById('promosTbody');
  if(!allPromos.length){tb.innerHTML=`<tr><td colspan="5" class="empty-td">لا توجد كودات</td></tr>`;return;}
  tb.innerHTML=allPromos.map(p=>`<tr>
    <td><span class="promo-code">${esc(p.code)}</span></td>
    <td><span class="disc-badge">-${p.discount}%</span></td>
    <td style="color:var(--text-2)">${p.uses||0}${p.max_uses?` / ${p.max_uses}`:' (بلا حد)'}</td>
    <td><input type="checkbox" class="tog" ${p.active?'checked':''} onchange="togglePromo(${p.id},this.checked)"/></td>
    <td><div class="act-btns">
      <button class="act act-back" onclick="copyCode('${esc(p.code)}')">📋</button>
      <button class="act act-del" onclick="confirmDel('promo',${p.id},'${esc(p.code)}')">🗑️</button>
    </div></td>
  </tr>`).join('');
}
window.togglePromo = async function(id,v){
  if(sb){try{await sb.from('promo_codes').update({active:v}).eq('id',id);}catch(e){}}
  allPromos=allPromos.map(p=>p.id===id?{...p,active:v}:p);
  saveLS('promos',allPromos);toast(v?'تم تفعيل الكود':'تم إيقاف الكود');
};
window.copyCode = c=>navigator.clipboard.writeText(c).then(()=>toast(`تم نسخ: ${c} ✓`,'ok')).catch(()=>toast('الكود: '+c));
async function savePromo(){
  const code=document.getElementById('proCode').value.trim().toUpperCase();
  const disc=Number(document.getElementById('proDisc').value);
  if(!code||!disc){toast('الكود والخصم مطلوبان','err');return;}
  const exists=allPromos.find(p=>p.code===code);
  if(exists){toast('هذا الكود موجود بالفعل','err');return;}
  const d={code,discount:disc,max_uses:Number(document.getElementById('proMax').value)||0,uses:0,active:document.getElementById('proActive').checked};
  if(sb){try{const{data}=await sb.from('promo_codes').insert([d]).select();if(data)allPromos.push(data[0]);}catch(e){d.id=Date.now();allPromos.push(d);}}
  else{d.id=Date.now();allPromos.push(d);}
  saveLS('promos',allPromos);closeMo('moPromo');renderPromos();toast(`تم إضافة كود ${code} ✓`,'ok');
}

/* ════════════════════════
   DELETE CONFIRM
════════════════════════ */
function confirmDel(type,id,name){
  document.getElementById('delText').textContent=`هل تريد حذف "${name}"؟ هذا الإجراء لا يمكن التراجع عنه.`;
  document.getElementById('btnConfirmDel').onclick=async()=>{
    if(type==='product'){
      if(sb)try{await sb.from('products').delete().eq('id',id);}catch(e){}
      allProducts=allProducts.filter(p=>p.id!==id);
      saveLS('products',allProducts);renderProducts();
    } else if(type==='offer'){
      allOffers=allOffers.filter(o=>o.id!==id);
      saveLS('offers',allOffers);renderOffers();
    } else if(type==='promo'){
      if(sb)try{await sb.from('promo_codes').delete().eq('id',id);}catch(e){}
      allPromos=allPromos.filter(p=>p.id!==id);
      saveLS('promos',allPromos);renderPromos();
    }
    closeMo('moDel');toast('تم الحذف');
  };
  openMo('moDel');
}
window.confirmDel=confirmDel;

/* ════════════════════════
   STATS
════════════════════════ */
function renderStats(){
  const t=allOrders.length,rev=allOrders.reduce((s,o)=>s+Number(o.total||0),0);
  const avg=t?Math.round(rev/t):0,promo=allOrders.filter(o=>o.promo_code).length;
  document.getElementById('ss-total').textContent=t;
  document.getElementById('ss-rev').textContent=EGP(rev);
  document.getElementById('ss-avg').textContent=EGP(avg);
  document.getElementById('ss-promo').textContent=promo;

  const bar=(elId,data,color='')=>{ const max=Math.max(...Object.values(data),1);
    document.getElementById(elId).innerHTML=Object.entries(data).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`
      <div class="bar-row">
        <div class="bar-lbl">${k}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(v/max)*100}%;${color?`background:${color}`:''}" /></div>
        <div class="bar-val">${v} طلب</div>
      </div>`).join('')||'<div style="color:var(--text-3);padding:8px;font-size:.83rem">لا بيانات بعد</div>'; };

  const cats={};allOrders.forEach(o=>{ const p=allProducts.find(x=>x.name===o.product_name||(`${x.brand} ${x.name}`===`${o.brand} ${o.product_name}`));const c=p?p.category:'أخرى';cats[c]=(cats[c]||0)+1;});
  bar('catChart',cats);

  const prods={};allOrders.forEach(o=>{const k=`${o.brand} ${o.product_name}`;prods[k]=(prods[k]||{n:0,r:0});prods[k].n++;prods[k].r+=Number(o.total||0);});
  document.getElementById('topChart').innerHTML=Object.entries(prods).sort((a,b)=>b[1].n-a[1].n).slice(0,7).map(([name,d],i)=>`
    <div class="top-row">
      <div class="top-rank">${i+1}</div>
      <div class="top-name">${name}</div>
      <div class="top-cnt">${d.n} طلب</div>
      <div class="top-rev">${EGP(d.r)}</div>
    </div>`).join('')||'<div style="color:var(--text-3);padding:8px;font-size:.83rem">لا بيانات بعد</div>';

  const sizes={};allOrders.forEach(o=>{const k=(o.size_ml||'—')+'ml';sizes[k]=(sizes[k]||0)+1;});
  bar('sizeChart',sizes,'linear-gradient(90deg,#1a56a4,#3b82f6)');

  const bottles={};allOrders.forEach(o=>{const k=o.bottle_type||'غير محدد';bottles[k]=(bottles[k]||0)+1;});
  bar('bottleChart',bottles,'linear-gradient(90deg,#6b21a8,#a855f7)');
}

/* ════════════════════════
   INIT
════════════════════════ */
document.addEventListener('DOMContentLoaded',async()=>{
  initLogin();
  initNav();
  loadOffers();
  await Promise.all([loadOrders(),loadProducts(),loadPromos()]);

  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  document.getElementById('btnRefresh').addEventListener('click',loadOrders);
  document.getElementById('btnExport').addEventListener('click',exportCSV);
  document.getElementById('orderSrch').addEventListener('input',renderOrders);
  document.getElementById('orderStatus').addEventListener('change',renderOrders);

  document.getElementById('btnAddProd').addEventListener('click',()=>openProductForm(true));
  document.getElementById('btnSaveProd').addEventListener('click',saveProduct);
  document.getElementById('btnCancelProd').addEventListener('click',()=>{document.getElementById('prodFormCard').style.display='none';});
  document.getElementById('prodSrch').addEventListener('input',renderProducts);
  document.getElementById('prodCat').addEventListener('change',renderProducts);

  document.getElementById('btnAddOffer').addEventListener('click',()=>{document.getElementById('moOfferTitle').textContent='🎁 عرض جديد';['oName','oDesc'].forEach(i=>document.getElementById(i).value='');['oPrice','oOldPrice'].forEach(i=>document.getElementById(i).value='');document.getElementById('oQty').value='10';document.getElementById('oActive').checked=true;document.getElementById('editOfferId').value='';openMo('moOffer');});
  document.getElementById('btnSaveOffer').addEventListener('click',saveOffer);
  document.getElementById('btnAddPromo').addEventListener('click',()=>{['proCode','proDisc'].forEach(i=>document.getElementById(i).value='');document.getElementById('proMax').value='0';document.getElementById('proActive').checked=true;openMo('moPromo');});
  document.getElementById('btnSavePromo').addEventListener('click',savePromo);
  document.getElementById('btnRefreshStats').addEventListener('click',renderStats);

  // Add default size rows in form
  addSizeRow(30,'');addSizeRow(50,'');addSizeRow(100,'');
});
