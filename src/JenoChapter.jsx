import React,{useEffect,useRef,useState} from 'react';
import {ArrowLeft,Phone,PhoneOff,MicOff,Volume2,MessageCircle,Heart,Repeat2,Send,Instagram,AtSign,Clock3} from 'lucide-react';
import jenoKakao from './assets/jeno-kakao.jpg';
import jenoInstagram from './assets/jeno-instagram.jpg';

const initial={stage:0,tab:'x',chat:[],comments:[],posts:[],likes:[],privacy:'public',readRumor:false,seenDms:false,call:'',callSeconds:0,callLines:[],ignored:false,followup:false};
const reactions=[
 ['@archive_0423','아니 제노 그 재킷이랑 사진 속 옷이랑 똑같은데? 소매 자수까지?','不是，JENO 那件外套和照片里的一样吧？连袖口刺绣都一样？'],
 ['@dreaming_7','근데 저거 흔한 옷 아님? 너무 억지인데','但那不是挺常见的衣服吗？这也太牵强了。'],
 ['@onlyjenoo','한두 개면 몰라도 겹치는 게 몇 개인데ㅋㅋ','要是一两样就算了，重合的东西有多少个了ㅋㅋ'],
 ['@jeno_0423','아 진짜 기분 이상해… 럽스타만 아니었으면','啊真的心情好复杂……只希望不是故意秀恩爱。'],
 ['@stop_searching','일반인 계정 찾으러 다니는 건 선 넘지','跑去找素人账号就越界了吧。']
];
const dms=[
 ['@jjj_04','너 그 사진 올린 사람 맞지?','那张照片是你发的吧？'],
 ['@dreamonly__','팬들 바보로 봤냐? 커플템 티 내는 거 진짜 짜증나','把粉丝当傻子吗？故意晒情侣同款真的很烦。'],
 ['@no_more_rumors','모르는 사람들이 연락 많이 할 텐데 답장 안 해도 돼요','可能很多陌生人来找你，不回复也没关系。'],
 ['@xx_092','제노랑 사귀는 거 맞아요? 부정 안 하면 맞는 거죠?','你真的和 JENO 交往吗？不否认就是默认了吧？']
];
const stamp=()=>new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false});
function phoneReply(input,stage){
 const s=input.trim();
 if(/不接|别打|不方便|忙|나중|바빠/.test(s))return '알겠어. 그럼 문자로 할게.（知道了，那我发消息给你。）';
 if(/害怕|怕|难受|哭|무서|힘들/.test(s))return '…지금 혼자 있어?（……你现在一个人吗？）';
 if(/账号|私信|评论|骂|인스타|디엠/.test(s))return '나도 봤어. 그거 너한테까지 간 건 몰랐어.（我也看到了。没想到已经找到你那边去了。）';
 if(/公司|经纪|回应|입장|회사/.test(s))return '매니저 형이랑 얘기 중이야. 아직 정해진 건 없어.（我在跟经纪人哥商量，还没有定下来。）';
 if(/在哪|哪里|어디/.test(s))return '지금 차 안. 곧 이동해야 해.（在车里，马上要出发了。）';
 return stage>=2?'응. 나도 지금 계속 보고 있어.（嗯，我也一直在看。）':'응, 말해. 듣고 있어.（嗯，你说，我在听。）';
}
export default function JenoChapter({save,patch,notify,onExit}){
 const s={...initial,...(save.jenoChapter||{})};
 const [input,setInput]=useState('');const [postDraft,setPostDraft]=useState('');const [callInput,setCallInput]=useState('');
 const [tick,setTick]=useState(0);const first=useRef(false);
 const update=p=>patch({jenoChapter:{...s,...p}});
 useEffect(()=>{if(first.current)return;first.current=true;if(!save.jenoChapter){patch({jenoChapter:{...initial}})}},[]);
 useEffect(()=>{if(s.stage<1)return;const t=setInterval(()=>setTick(v=>v+1),1000);return()=>clearInterval(t)},[s.stage]);
 useEffect(()=>{if(s.call!=='active')return;const t=setInterval(()=>patch({jenoChapter:{...s,callSeconds:(s.callSeconds||0)+1}}),1000);return()=>clearInterval(t)},[s.call,s.callSeconds]);
 const enterTab=tab=>{let next={tab};if(tab==='x'&&!s.readRumor){next.readRumor=true;next.stage=Math.max(s.stage,1)}if(tab==='ig'&&s.stage>=2&&!s.seenDms){next.seenDms=true;next.stage=Math.max(s.stage,3)}update(next)};
 const advance=()=>{if(s.stage<2){update({stage:2});notify('JENO ❤️：你现在方便吗？','chat')}else if(s.stage<3){update({stage:3});notify('Instagram：收到新的私信请求','ig')}else if(s.stage<4){update({stage:4});notify('X：有人提到了你的账号','x')}else if(s.stage<5){update({stage:5,call:'incoming'});notify('JENO ❤️ 来电','calls')}};
 const sendChat=()=>{const text=input.trim();if(!text)return;const answer=phoneReply(text,s.stage);update({chat:[...s.chat,{who:'me',text},{who:'jeno',text:answer}],stage:Math.max(2,s.stage)});setInput('');if(s.stage<3)notify('Instagram：新的关注请求','ig')};
 const post=()=>{const text=postDraft.trim();if(!text)return;update({posts:[{text,time:stamp()},...s.posts],stage:Math.max(s.stage,4)});setPostDraft('');notify('X：你的帖子收到新的回复','x')};
 const respondDM=(who)=>{const text=input.trim();if(!text)return;update({comments:[...s.comments,{who,text}],stage:Math.max(s.stage,4)});setInput('');notify('X：有人截图讨论了你的回复','x')};
 const callAction=(action)=>{if(action==='accept'){update({call:'active',callSeconds:0,callLines:['여보세요? …지금 혼자 있어?（喂？……你现在一个人吗？）']})}else if(action==='decline'){update({call:'',ignored:true,stage:Math.max(s.stage,5)});notify('电话：JENO ❤️ 未接来电','calls')}else{update({call:'',stage:Math.max(s.stage,5)});notify('电话：通话已结束','calls')}};
 const callSend=()=>{if(!callInput.trim())return;update({callLines:[...s.callLines,'你：'+callInput.trim(),'JENO：'+phoneReply(callInput,s.stage)]});setCallInput('')};
 const timeDisplay=`${String(Math.floor(s.callSeconds/60)).padStart(2,'0')}:${String(s.callSeconds%60).padStart(2,'0')}`;
 return <div className="dl-chapter">
  <div className="dl-story-head"><button onClick={onExit}><ArrowLeft size={19}/></button><div><b>{s.tab==='x'?'X · 为你推荐':s.tab==='kkt'?'JENO ❤️':s.tab==='ig'?'Instagram · 消息请求':'第一章'}</b><small>CHAPTER 01 · 传闻</small></div><button onClick={()=>update({tab:'home'})}>···</button></div>
  <div className="dl-story-body" key={s.tab}>
  {s.tab==='home'&&<div className="dl-story-intro"><span>18:48 · 星期五</span><h2>有人发现了什么。</h2><p>你刚拿起手机。X 的通知停在锁屏上。那条帖子已经有几百次转发了。</p><button onClick={()=>enterTab('x')}>查看 X 上的帖子 →</button><button onClick={()=>enterTab('kkt')}>打开 KakaoTalk</button></div>}
  {s.tab==='x'&&<><div className="dl-section-label">韩国 · 正在讨论</div><div className="dl-xpost"><b>@archive_0423</b><small> · 18:48</small><p>아니 제노 그 재킷이랑 사진 속 옷이랑 똑같은데? 소매 자수까지?</p><p className="dl-translation">不是，JENO 那件外套和照片里的一样吧？连袖口刺绣都一样？</p><div className="dl-fake-media">图片对比帖 · 同款外套与袖口细节<br/><small>未经证实的网友整理</small></div><div className="dl-poststats"><span>💬 {s.stage>=4?'1,482':'284'}</span><span>↻ {s.stage>=4?'6,704':'1,206'}</span><span>♡ {s.stage>=4?'11,203':'3,819'}</span></div></div>{reactions.map(([who,kr,zh],i)=><div className="dl-xpost" key={who}><b>{who}</b><p>{kr}</p><p className="dl-translation">{zh}</p><button className="dl-like" onClick={()=>update({likes:s.likes.includes(who)?s.likes.filter(v=>v!==who):[...s.likes,who]})}>{s.likes.includes(who)?'♥ 已赞':'♡ 喜欢'}</button></div>)}{s.stage>=4&&<div className="dl-xpost"><b>@who_is_she_</b><p>인스타 계정까지 찾았대… 진짜라고?</p><p className="dl-translation">连 IG 账号都找到了……是真的吗？</p><p className="dl-translation">有人提及 @{save.handle}，但身份仍未经证实。</p></div>}{s.posts.map((p,i)=><div className="dl-xpost" key={i}><b>@{save.handle}</b><small> · {p.time}</small><p>{p.text}</p></div>)}<div className="dl-post-composer"><textarea placeholder="你想在 X 上说什么？也可以保持沉默。" value={postDraft} onChange={e=>setPostDraft(e.target.value)}/><button onClick={post}>发布</button></div></>}
  {s.tab==='kkt'&&<div className="dl-kkt"><div className="dl-kkt-note">仅你与 JENO 可见的私人聊天</div><div className="dl-kkt-line"><img src={jenoKakao}/><div><b>JENO</b><p>뭐 하고 있어?<small>在干嘛？</small></p><p>혹시 지금 X 봤어?<small>你刚才看 X 了吗？</small></p></div></div>{s.chat.map((m,i)=><div key={i} className={'dl-kkt-line '+(m.who==='me'?'out':'')}>
  {m.who==='jeno'&&<img src={jenoKakao}/>}<div><p>{m.text}</p></div></div>)}{s.stage>=3&&<div className="dl-kkt-line"><img src={jenoKakao}/><div><p>너 인스타 계정까지 올라왔어.<small>他们连你的 IG 账号都发出来了。</small></p><p>전화할 수 있어?<small>方便接电话吗？</small></p></div></div>}<div className="dl-inline-input"><input placeholder="自由输入消息…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()}/><button onClick={sendChat}><Send size={17}/></button></div></div>}
  {s.tab==='ig'&&<><div className="dl-ig-member"><img src={jenoInstagram}/><div><b>@leejen_o_423</b><small>已关注 · JENO 的 Instagram</small></div></div><div className="dl-section-label">消息请求 {s.stage>=3?'· 23':'· 0'}</div>{s.stage<3?<p className="dl-empty">暂时没有新的陌生私信。</p>:dms.map(([who,kr,zh])=><div className="dl-dm" key={who}><b>{who}</b><p>{kr}</p><small>{zh}</small>{s.comments.filter(v=>v.who===who).map((v,i)=><p className="dl-my-dm" key={i}>你：{v.text}</p>)}<div className="dl-inline-input"><input placeholder="回复这条私信（可能被截图）" value={input} onChange={e=>setInput(e.target.value)}/><button onClick={()=>respondDM(who)}><Send size={17}/></button></div></div>)}<div className="dl-privacy">账号设置：<button onClick={()=>update({privacy:s.privacy==='private'?'public':'private'})}>{s.privacy==='private'?'已设为私密 · 点击公开':'当前公开 · 设为私密'}</button></div></>}
  </div>
  <div className="dl-story-bottom"><button onClick={()=>enterTab('x')} className={s.tab==='x'?'on':''}><AtSign size={19}/><small>X</small></button><button onClick={()=>enterTab('kkt')} className={s.tab==='kkt'?'on':''}><MessageCircle size={19}/><small>KKT</small></button><button onClick={()=>enterTab('ig')} className={s.tab==='ig'?'on':''}><Instagram size={19}/><small>IG</small></button><button onClick={advance}><Clock3 size={19}/><small>推进</small></button></div>
  {s.call==='incoming'&&<div className="dl-incoming"><div className="dl-call-top"><small>iPhone · 来电</small><img src={jenoKakao}/><h2>JENO ❤️</h2><p>手机来电…</p></div><div className="dl-call-actions"><button onClick={()=>callAction('decline')}><span className="decline"><PhoneOff size={30}/></span>拒绝</button><button onClick={()=>callAction('accept')}><span className="accept"><Phone size={30}/></span>接听</button></div></div>}
  {s.call==='active'&&<div className="dl-incoming dl-active"><div className="dl-call-top"><small>{timeDisplay}</small><img src={jenoKakao}/><h2>JENO ❤️</h2><p>通话中 · 模拟通话（文字剧情）</p></div><div className="dl-call-lines">{s.callLines.map((line,i)=><p key={i}>{line}</p>)}</div><div className="dl-inline-input"><input placeholder="你想对他说什么？" value={callInput} onChange={e=>setCallInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&callSend()}/><button onClick={callSend}><Send size={18}/></button></div><div className="dl-call-controls"><span><MicOff/> 静音</span><span><Volume2/> 扬声器</span></div><div className="dl-hang"><button onClick={()=>callAction('end')}><PhoneOff size={26}/></button><small>挂断</small></div></div>}
 </div>
}
