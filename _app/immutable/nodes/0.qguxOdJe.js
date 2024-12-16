var xt=Object.defineProperty;var Q=t=>{throw TypeError(t)};var yt=(t,s,e)=>s in t?xt(t,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[s]=e;var tt=(t,s,e)=>yt(t,typeof s!="symbol"?s+"":s,e),It=(t,s,e)=>s.has(t)||Q("Cannot "+e);var W=(t,s,e)=>(It(t,s,"read from private field"),e?e.call(t):s.get(t)),et=(t,s,e)=>s.has(t)?Q("Cannot add the same private member more than once"):s instanceof WeakSet?s.add(t):s.set(t,e);import{a as I,t as O,c as J}from"../chunks/disclose-version.C6IdZLUf.js";import{h as ht,a as Ut,z as Ct,A as Dt,u as $t,k as X,B as Pt,C as St,D as st,g,F as Lt,G as Ot,y as Et,q as P,e as U,j as B,o as k,x as D,v as L,l as A,r as S,$ as Mt,w as K,n as qt,H as Ft}from"../chunks/runtime.D9uCNo2r.js";import{a as M,i as V,e as Bt,b as ut,s as _t,d as ct,p as dt,o as kt,c as jt}from"../chunks/index-client.BdaLqaGv.js";import{a as Tt,e as At,i as zt,S as it,h as Nt,t as F,f as G,m as C,s as Rt,b as rt,r as Vt,c as pt,d as Gt}from"../chunks/mouse.svelte.BSWMctXo.js";import"../chunks/paths.DqXphG8L.js";function Yt(t,s,e,i,n){var v;ht&&Ut();var o=(v=s.$$slots)==null?void 0:v[e],c=!1;o===!0&&(o=s.children,c=!0),o===void 0||o(t,c?()=>i:i)}function Ht(t,s,e,i=e){t.addEventListener(s,e);const n=t.__on_r;n?t.__on_r=()=>{n(),i()}:t.__on_r=i,Tt()}function Wt(t,s,e=s){var i=Ct();Ht(t,"input",()=>{var n=at(t)?nt(t.value):t.value;e(n),i&&n!==(n=s())&&(t.value=n??"")}),Dt(()=>{var n=s();if(ht&&t.defaultValue!==t.value){e(t.value);return}at(t)&&n===nt(t.value)||t.type==="date"&&!n&&!t.value||n!==t.value&&(t.value=n??"")})}function at(t){var s=t.type;return s==="number"||s==="range"}function nt(t){return t===""?null:+t}function ft(t=!1){const s=Pt,e=s.l.u;if(!e)return;let i=()=>Ot(s.s);if(t){let n=0,o={};const c=Et(()=>{let v=!1;const _=s.s;for(const d in _)_[d]!==o[d]&&(o[d]=_[d],v=!0);return v&&n++,n});i=()=>g(c)}e.b.length&&$t(()=>{ot(s,i),st(e.b)}),X(()=>{const n=St(()=>e.m.map(Lt));return()=>{for(const o of n)typeof o=="function"&&o()}}),e.a.length&&X(()=>{ot(s,i),st(e.a)})}function ot(t,s){if(t.l.s)for(const e of t.l.s)g(e);s()}const Xt=!0,Ce=Object.freeze(Object.defineProperty({__proto__:null,prerender:Xt},Symbol.toStringTag,{value:"Module"}));function Jt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var gt={exports:{}};(function(t){var s=(()=>{var e=Object.defineProperty,i=Object.getOwnPropertyDescriptor,n=Object.getOwnPropertyNames,o=Object.getOwnPropertySymbols,c=Object.prototype.hasOwnProperty,v=Object.prototype.propertyIsEnumerable,_=(m,u,p)=>u in m?e(m,u,{enumerable:!0,configurable:!0,writable:!0,value:p}):m[u]=p,d=(m,u)=>{for(var p in u||(u={}))c.call(u,p)&&_(m,p,u[p]);if(o)for(var p of o(u))v.call(u,p)&&_(m,p,u[p]);return m},w=(m,u)=>{for(var p in u)e(m,p,{get:u[p],enumerable:!0})},x=(m,u,p,R)=>{if(u&&typeof u=="object"||typeof u=="function")for(let E of n(u))!c.call(m,E)&&E!==p&&e(m,E,{get:()=>u[E],enumerable:!(R=i(u,E))||R.enumerable});return m},q=m=>x(e({},"__esModule",{value:!0}),m),a=(m,u,p)=>(_(m,typeof u!="symbol"?u+"":u,p),p),z={};w(z,{DEFAULT_OPTIONS:()=>Z,DEFAULT_UUID_LENGTH:()=>N,default:()=>mt});var vt="5.2.0",N=6,Z={dictionary:"alphanum",shuffle:!0,debug:!1,length:N,counter:0},Y=class{constructor(u={}){a(this,"counter"),a(this,"debug"),a(this,"dict"),a(this,"version"),a(this,"dictIndex",0),a(this,"dictRange",[]),a(this,"lowerBound",0),a(this,"upperBound",0),a(this,"dictLength",0),a(this,"uuidLength"),a(this,"_digit_first_ascii",48),a(this,"_digit_last_ascii",58),a(this,"_alpha_lower_first_ascii",97),a(this,"_alpha_lower_last_ascii",123),a(this,"_hex_last_ascii",103),a(this,"_alpha_upper_first_ascii",65),a(this,"_alpha_upper_last_ascii",91),a(this,"_number_dict_ranges",{digits:[this._digit_first_ascii,this._digit_last_ascii]}),a(this,"_alpha_dict_ranges",{lowerCase:[this._alpha_lower_first_ascii,this._alpha_lower_last_ascii],upperCase:[this._alpha_upper_first_ascii,this._alpha_upper_last_ascii]}),a(this,"_alpha_lower_dict_ranges",{lowerCase:[this._alpha_lower_first_ascii,this._alpha_lower_last_ascii]}),a(this,"_alpha_upper_dict_ranges",{upperCase:[this._alpha_upper_first_ascii,this._alpha_upper_last_ascii]}),a(this,"_alphanum_dict_ranges",{digits:[this._digit_first_ascii,this._digit_last_ascii],lowerCase:[this._alpha_lower_first_ascii,this._alpha_lower_last_ascii],upperCase:[this._alpha_upper_first_ascii,this._alpha_upper_last_ascii]}),a(this,"_alphanum_lower_dict_ranges",{digits:[this._digit_first_ascii,this._digit_last_ascii],lowerCase:[this._alpha_lower_first_ascii,this._alpha_lower_last_ascii]}),a(this,"_alphanum_upper_dict_ranges",{digits:[this._digit_first_ascii,this._digit_last_ascii],upperCase:[this._alpha_upper_first_ascii,this._alpha_upper_last_ascii]}),a(this,"_hex_dict_ranges",{decDigits:[this._digit_first_ascii,this._digit_last_ascii],alphaDigits:[this._alpha_lower_first_ascii,this._hex_last_ascii]}),a(this,"_dict_ranges",{_number_dict_ranges:this._number_dict_ranges,_alpha_dict_ranges:this._alpha_dict_ranges,_alpha_lower_dict_ranges:this._alpha_lower_dict_ranges,_alpha_upper_dict_ranges:this._alpha_upper_dict_ranges,_alphanum_dict_ranges:this._alphanum_dict_ranges,_alphanum_lower_dict_ranges:this._alphanum_lower_dict_ranges,_alphanum_upper_dict_ranges:this._alphanum_upper_dict_ranges,_hex_dict_ranges:this._hex_dict_ranges}),a(this,"log",(...r)=>{const l=[...r];if(l[0]=`[short-unique-id] ${r[0]}`,this.debug===!0&&typeof console<"u"&&console!==null)return console.log(...l)}),a(this,"_normalizeDictionary",(r,l)=>{let h;if(r&&Array.isArray(r)&&r.length>1)h=r;else{h=[];let f;this.dictIndex=f=0;const y=`_${r}_dict_ranges`,b=this._dict_ranges[y];Object.keys(b).forEach($=>{const H=$;for(this.dictRange=b[H],this.lowerBound=this.dictRange[0],this.upperBound=this.dictRange[1],this.dictIndex=f=this.lowerBound;this.lowerBound<=this.upperBound?f<this.upperBound:f>this.upperBound;this.dictIndex=this.lowerBound<=this.upperBound?f+=1:f-=1)h.push(String.fromCharCode(this.dictIndex))})}return l&&(h=h.sort(()=>Math.random()-.5)),h}),a(this,"setDictionary",(r,l)=>{this.dict=this._normalizeDictionary(r,l),this.dictLength=this.dict.length,this.setCounter(0)}),a(this,"seq",()=>this.sequentialUUID()),a(this,"sequentialUUID",()=>{let r,l,h="";r=this.counter;do l=r%this.dictLength,r=Math.trunc(r/this.dictLength),h+=this.dict[l];while(r!==0);return this.counter+=1,h}),a(this,"rnd",(r=this.uuidLength||N)=>this.randomUUID(r)),a(this,"randomUUID",(r=this.uuidLength||N)=>{let l,h,f;if(r===null||typeof r>"u"||r<1)throw new Error("Invalid UUID Length Provided");for(l="",f=0;f<r;f+=1)h=parseInt((Math.random()*this.dictLength).toFixed(0),10)%this.dictLength,l+=this.dict[h];return l}),a(this,"fmt",(r,l)=>this.formattedUUID(r,l)),a(this,"formattedUUID",(r,l)=>{const h={$r:this.randomUUID,$s:this.sequentialUUID,$t:this.stamp};return r.replace(/\$[rs]\d{0,}|\$t0|\$t[1-9]\d{1,}/g,y=>{const b=y.slice(0,2),$=parseInt(y.slice(2),10);return b==="$s"?h[b]().padStart($,"0"):b==="$t"&&l?h[b]($,l):h[b]($)})}),a(this,"availableUUIDs",(r=this.uuidLength)=>parseFloat(Math.pow([...new Set(this.dict)].length,r).toFixed(0))),a(this,"approxMaxBeforeCollision",(r=this.availableUUIDs(this.uuidLength))=>parseFloat(Math.sqrt(Math.PI/2*r).toFixed(20))),a(this,"collisionProbability",(r=this.availableUUIDs(this.uuidLength),l=this.uuidLength)=>parseFloat((this.approxMaxBeforeCollision(r)/this.availableUUIDs(l)).toFixed(20))),a(this,"uniqueness",(r=this.availableUUIDs(this.uuidLength))=>{const l=parseFloat((1-this.approxMaxBeforeCollision(r)/r).toFixed(20));return l>1?1:l<0?0:l}),a(this,"getVersion",()=>this.version),a(this,"stamp",(r,l)=>{const h=Math.floor(+(l||new Date)/1e3).toString(16);if(typeof r=="number"&&r===0)return h;if(typeof r!="number"||r<10)throw new Error(["Param finalLength must be a number greater than or equal to 10,","or 0 if you want the raw hexadecimal timestamp"].join(`
`));const f=r-9,y=Math.round(Math.random()*(f>15?15:f)),b=this.randomUUID(f);return`${b.substring(0,y)}${h}${b.substring(y)}${y.toString(16)}`}),a(this,"parseStamp",(r,l)=>{if(l&&!/t0|t[1-9]\d{1,}/.test(l))throw new Error("Cannot extract date from a formated UUID with no timestamp in the format");const h=l?l.replace(/\$[rs]\d{0,}|\$t0|\$t[1-9]\d{1,}/g,y=>{const b={$r:j=>[...Array(j)].map(()=>"r").join(""),$s:j=>[...Array(j)].map(()=>"s").join(""),$t:j=>[...Array(j)].map(()=>"t").join("")},$=y.slice(0,2),H=parseInt(y.slice(2),10);return b[$](H)}).replace(/^(.*?)(t{8,})(.*)$/g,(y,b,$)=>r.substring(b.length,b.length+$.length)):r;if(h.length===8)return new Date(parseInt(h,16)*1e3);if(h.length<10)throw new Error("Stamp length invalid");const f=parseInt(h.substring(h.length-1),16);return new Date(parseInt(h.substring(f,f+8),16)*1e3)}),a(this,"setCounter",r=>{this.counter=r}),a(this,"validate",(r,l)=>{const h=l?this._normalizeDictionary(l):this.dict;return r.split("").every(f=>h.includes(f))});const p=d(d({},Z),u);this.counter=0,this.debug=!1,this.dict=[],this.version=vt;const{dictionary:R,shuffle:E,length:bt,counter:wt}=p;return this.uuidLength=bt,this.setDictionary(R,E),this.setCounter(wt),this.debug=p.debug,this.log(this.dict),this.log(`Generator instantiated with Dictionary Size ${this.dictLength} and counter set to ${this.counter}`),this.log=this.log.bind(this),this.setDictionary=this.setDictionary.bind(this),this.setCounter=this.setCounter.bind(this),this.seq=this.seq.bind(this),this.sequentialUUID=this.sequentialUUID.bind(this),this.rnd=this.rnd.bind(this),this.randomUUID=this.randomUUID.bind(this),this.fmt=this.fmt.bind(this),this.formattedUUID=this.formattedUUID.bind(this),this.availableUUIDs=this.availableUUIDs.bind(this),this.approxMaxBeforeCollision=this.approxMaxBeforeCollision.bind(this),this.collisionProbability=this.collisionProbability.bind(this),this.uniqueness=this.uniqueness.bind(this),this.getVersion=this.getVersion.bind(this),this.stamp=this.stamp.bind(this),this.parseStamp=this.parseStamp.bind(this),this}};a(Y,"default",Y);var mt=Y;return q(z)})();t.exports=s.default,typeof window<"u"&&(s=s.default)})(gt);var Kt=gt.exports;const Zt=Jt(Kt);var T;class Qt{constructor(){tt(this,"uuid",new Zt({length:20}));et(this,T,P(M([])))}get toast(){return g(W(this,T))}set toast(s){U(W(this,T),M(s))}push(s,e){const i=this.uuid.rnd();e||(e={});const n={status:e.status??"neutral",timeout:e.timeout??2e3};this.toast.push({conteudo:s,id:i,status:n.status}),setTimeout(()=>{this.remove(i)},n.timeout)}sucess(s,e){const i=this.uuid.rnd();e||(e={});const n={status:"sucess",timeout:e.timeout??2e3};this.toast.push({conteudo:s,id:i,status:n.status}),setTimeout(()=>{this.remove(i)},n.timeout)}error(s,e){const i=this.uuid.rnd();e||(e={});const n={status:"error",timeout:e.timeout??2e3};this.toast.push({conteudo:s,id:i,status:n.status}),setTimeout(()=>{this.remove(i)},n.timeout)}remove(s){this.toast=this.toast.filter(e=>e.id!==s)}}T=new WeakMap;const te=new Qt;function ee(t){return t===0?t:Math.pow(2,10*(t-1))}function se(t){return t===1?t:1-Math.pow(2,-10*t)}function ie(t){return t*t}function re(t){return-t*(t-2)}var ae=O('<div class="flex flex-row items-center gap-1 text-body-large font-semibold text-[#555] p-5 py-3 rounded-md shadow-lg border border-[rgba(0,0,0,.05)] bg-[#ffffff]"><!> <!></div>'),ne=O('<div class="fixed pointer-events-none z-50 top-0 left-0 w-screen h-screen p-12 flex flex-col items-center gap-4"></div>');function oe(t,s){B(s,!1),ft();var e=ne();At(e,5,()=>te.toast,zt,(i,n)=>{var o=ae(),c=L(o);V(c,()=>g(n).status==="error",_=>{it(_,{src:"/icons/x2.svg",width:"10px",height:"10px",fill:"red"})},_=>{var d=J(),w=A(d);V(w,()=>g(n).status==="sucess",x=>{it(x,{src:"/icons/check.svg",width:"15px",height:"20px",fill:"green"})},null,!0),I(_,d)});var v=S(c,2);Nt(v,()=>g(n).conteudo),D(o),F(1,o,()=>G,()=>({y:20,duration:1e3,easing:se})),F(2,o,()=>G,()=>({y:-20,duration:100,easing:ee})),I(i,o)}),D(e),I(t,e),k()}var le=O('<div class="fixed duration-0 transition-none lg:block hidden pointer-events-none z-50"><svg width="26" height="26" viewBox="0 0 267 267" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_21_727)"><path d="M266.494 116.459C266.494 116.723 266.488 116.976 266.476 117.251C266.139 123.353 262.002 128.583 256.129 130.297L167.102 156.364L148.235 251.567C147.041 257.581 142.176 262.181 136.112 263.043C130.05 263.901 124.096 260.842 121.28 255.393L1.61701 24.352C-1.17499 18.995 -0.28999 12.438 3.80001 7.97701C7.90101 3.50301 14.35 2.09201 19.946 4.41501L257.601 103.158C263.018 105.398 266.494 110.659 266.494 116.459Z" fill="white" stroke="black" stroke-width="8"></path></g><defs><clipPath id="clip0_21_727"><rect width="266.495" height="266.494" fill="white" transform="matrix(0 -1 1 0 0 266.495)"></rect></clipPath></defs></svg> <span class="bg-slate-200 p-1 px-4 text-[12px] rounded-xl translate-x-4 absolute translate-y-[2px]"> </span></div>');function he(t,s){B(s,!0);let e=P(void 0),i=P(50),n=P(150);X(()=>{U(i,M(C.state.nameCursor.length*18>50?C.state.nameCursor.length*18:200)),U(n,g(i)/2+50)});let o=P(0),c=P(0);function v(w){U(o,M(w.clientX)),U(c,M(w.clientY)),g(e)&&(g(e).style.left=`${g(o)}px`,g(e).style.top=`${g(c)}px`)}var _=J();Bt("mousemove",Mt,v);var d=A(_);V(d,()=>C.state.haveCustomCursor,w=>{var x=le();ut(x,z=>U(e,z),()=>g(e));var q=S(L(x),2),a=L(q);D(q),D(x),K(()=>_t(a,C.state.nameCursor)),I(w,x)}),I(t,_),k()}var ue=(t,s)=>{s()},_e=O('<div class="w-screen flex justify-center items-center h-screen top-0 left-0 fixed bg-[rgba(0,0,0,.5)] z-[99999]"><div class="rounded-xl text-[rgb(26, 26, 26)] flex flex-col items-center gap-2 z-30 justify-center p-6 px-12 bg-[#F2F2F2]"><!></div> <button class="absolute top-0 left-0 w-full h-full z-10">.</button></div>');function ce(t,s){B(s,!0);let e=P(!1);async function i(){U(e,!0)}async function n(){U(e,!1)}var o=J(),c=A(o);return V(c,()=>g(e),v=>{var _=_e(),d=L(_),w=L(d);Rt(w,()=>s.children??qt),D(d);var x=S(d,2);x.__click=[ue,n],D(_),F(1,d,()=>G,()=>({y:1200,duration:700,easing:re})),F(2,d,()=>G,()=>({y:3200,duration:700,easing:ie})),F(1,_,()=>rt),F(2,_,()=>rt),I(v,_)}),I(t,o),k({pop:i,drop:n})}ct(["click"]);var de=O('<input placeholder="Your name here" class="block w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 text-gray-500 focus:text-gray-700" type="text">');function pe(t,s){let e=dt(s,"value",15,"");var i=de();Vt(i),Wt(i,e),I(t,i)}var fe=O("<button> </button>");function lt(t,s){B(s,!0);let e=dt(s,"onClick",3,()=>{});var i=fe();i.__click=function(...o){var c;(c=e())==null||c.apply(this,o)};var n=L(i);D(i),K(()=>{pt(i,`rounded-full p-2 px-4 hover:shadow-[rgba(0,0,0,.3)] shadow-xl
${(C.state.haveCustomCursor?"hover:cursor-none":"")??""}`),Gt(i,"style",`background:${s.bg??""};color:${s.color??""};`),_t(n,s.label)}),I(t,i),k()}ct(["click"]);var ge=O('<h1 class="text-24 text-[#2E2E2E]">Insert your name</h1> <!> <div class="flex gap-4 mt-2"><!> <!></div>',1);function ve(t,s){B(s,!0);let e=P(void 0),i=P("");function n(){localStorage.setItem("username",g(i)),C.state.nameCursor=g(i),C.state.haveCustomCursor=!0,document.body.style.cursor="none",g(e).drop()}kt(()=>{window.innerWidth<900||(localStorage.getItem("username")?(C.state.nameCursor=localStorage.getItem("username"),C.state.haveCustomCursor=!0):setTimeout(()=>g(e).pop(),2e3))}),ut(ce(t,{children:(o,c)=>{var v=ge(),_=S(A(v),2);pe(_,{get value(){return g(i)},set value(q){U(i,M(q))}});var d=S(_,2),w=L(d);lt(w,{bg:"#8685EF",color:"#2E2E2E",label:"Let's Start",onClick:n});var x=S(w,2);lt(x,{bg:"#FAF8FF",color:"#2E2E2E",label:"I don't want to",onClick:()=>{g(e).drop()}}),D(d),I(o,v)},$$slots:{default:!0}}),o=>U(e,M(o)),()=>g(e)),k()}var me=O('<div class="fixed flex w-screen justify-center h-screen top-0 left-0 z-50 pointer-events-none"><!></div> <!> <div><!> <!></div>',1);function $e(t,s){B(s,!1),ft();var e=me();jt(d=>{Ft.title="Portfolio"});var i=A(e),n=L(i);oe(n,{}),D(i);var o=S(i,2);ve(o,{});var c=S(o,2),v=L(c);Yt(v,s,"default",{});var _=S(v,2);he(_,{}),D(c),K(()=>pt(c,`relative overflow-clip max-w-svw bg-[#090A15] ${(C.state.haveCustomCursor?"lg:cursor-none":"")??""}`)),I(t,e),k()}export{$e as component,Ce as universal};