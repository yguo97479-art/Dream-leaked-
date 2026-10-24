import React,{useState} from 'react';
import {Bell,MessageCircle,Heart,Repeat2,MoreHorizontal,Send} from 'lucide-react';
import './XNotifications.css';

// Fictional accounts and Korean-language posts for the in-game rumor arc.
// Nothing is sent to the real X service.
const examples=[
 {id:'xmention-1',user:'@afterhours_0423',name:'ㅇㅇ',ko:'@{handle} 너 진짜 제노랑 사귀는 거야? 아니라고 좀 해 봐',zh:'@{handle} 你真在和 JENO 交往？倒是说一句不是啊。',time:'3分钟前',kind:'mention'},
 {id:'xmention-2',user:'@onlyjeno__',name:'제노만',ko:'@{handle} 커플템 티 낸 거 맞지? 팬들 바보로 봤냐',zh:'@{handle} 是故意秀情侣同款的吧？把粉丝当傻子吗？',time:'5分钟前',kind:'mention'},
 {id:'xmention-3',user:'@bluehour_7',name:'blue hour',ko:'@{handle} 이 사람 계정까지 찾아가서 뭐 하는 건데... 그만 좀 해',zh:'@{handle} 都跑到人家账号下面干什么……差不多得了。',time:'6分钟前',kind:'mention'},
 {id:'xmention-4',user:'@wintercomma_',name:'겨울쉼표',ko:'@{handle} 연애는 자유라지만 이건 좀 현타 오네',zh:'@{handle} 虽说恋爱自由，但这事还是挺让人心凉的。',time:'8分钟前',kind:'mention'},
 {id:'xmention-5',user:'@sodamood_',name:'소다',ko:'@{handle} 혹시 이 사진 어디서 찍었는지 알려줄 수 있어?',zh:'@{handle} 可以问问那张照片是在哪里拍的吗？',time:'10分钟前',kind:'mention'},
 {id:'xmention-6',user:'@no_doxxing_kr',name:'그만해',ko:'@{handle} 확인된 것도 없는데 일반인 멘션 좀 그만해',zh:'@{handle} 什么都没证实，就别再艾特素人了。',time:'12分钟前',kind:'mention'},
 {id:'xmention-7',user:'@offstage_12',name:'offstage',ko:'@{handle} 둘이 언제부터 만난 거임? 아는 사람 있어?',zh:'@{handle} 他们什么时候开始交往的？有人知道吗？',time:'14分钟前',kind:'mention'},
 {id:'xmention-8',user:'@fan_ending',name:'ㄹㅇ',ko:'@{handle} 제발 아무 말이나 해 줘. 계속 새로고침하고 있음',zh:'@{handle} 拜托说点什么吧，我一直在刷新。',time:'17分钟前',kind:'mention'}
];
const interpolate=(text,handle)=>text.replaceAll('{handle}',handle);
export default function XNotifications({save,onReply,onMarkRead}){
 const [tab,setTab]=useState('全部');
 const [active,setActive]=useState(null);
 const [draft,setDraft]=useState('');
 const [showTranslate,setShowTranslate]=useState(true);
 const handle='@'+save.handle;
 // A small initial burst; additional mentions surface as the story develops.
 const progress=(save.xPosts||[]).length+(save.published||[]).length+(save.jenoChat||[]).filter(m=>m.role==='me').length;
 const visible=examples.slice(0,Math.min(examples.length,4+Math.floor(progress/2)));
 const custom=(save.xPosts||[]).length>0?[{id:'xmention-post',user:'@dreamwatch_07',name:'드림워치',ko:'@{handle} 본인 계정에서 글 올렸네. 이게 입장문이야?',zh:'@{handle} 本人在账号上发帖了，这是回应吗？',time:'刚刚',kind:'mention'}]:[];
 const items=[...custom,...visible];
 const filtered=tab==='提及'?items.filter(n=>n.kind==='mention'):items;
 const read=save.xNoticeRead||[];
 const unread=items.filter(n=>!read.includes(n.id)).length;
 function expand(n){setActive(active===n.id?null:n.id);onMarkRead(n.id)}
 function sendReply(n){if(!draft.trim())return;onReply(n.id,draft.trim(),n.user);setDraft('');setActive(null)}
 return <div className="xnotice-root">
   <div className="xnotice-heading"><div><strong>通知</strong><small>{unread?`${unread} 条未读提及`:'已查看全部通知'}</small></div><button title="切换翻译" onClick={()=>setShowTranslate(v=>!v)}>{showTranslate?'隐藏翻译':'显示翻译'}</button></div>
   <div className="xnotice-filters">{['全部','提及'].map(t=><button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
   <div className="xnotice-tip">关于 JENO 的恋爱传闻正在扩散。以下是游戏中的虚构账号与通知。</div>
   {filtered.map(n=><div className={'xnotice-entry '+(!read.includes(n.id)?'unread':'')} key={n.id}>
     <button className="xnotice-preview" onClick={()=>expand(n)}>
       <Bell className="xnotice-bell" size={24}/>
       <span className="xnotice-body"><span className="xnotice-top"><span className="xnotice-avatar">{n.name.slice(0,1)}</span><span><b>{n.name}</b> <span className="xnotice-handle">{n.user}</span><small> · {n.time}</small></span></span><span className="xnotice-action">提及了你</span><span className="xnotice-post">{interpolate(n.ko,handle)}</span>{showTranslate&&<span className="xnotice-translation">{interpolate(n.zh,handle)}</span>}</span>
       {!read.includes(n.id)&&<span className="xnotice-dot"/>}
     </button>
     {active===n.id&&<div className="xnotice-expanded"><div className="xnotice-context">回复 {n.user} · 公开回复可能被其他人截图传播</div><div className="xnotice-replies">{(save.comments?.[n.id]||[]).map((r,i)=><p key={i}><b>{r.handle}</b> {r.text}</p>)}</div><form onSubmit={e=>{e.preventDefault();sendReply(n)}}><input aria-label={'回复 '+n.user} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="发布回复…" maxLength={280}/><button type="submit" disabled={!draft.trim()}><Send size={17}/></button></form></div>}
   </div>)}
   <div className="xnotice-footer">你可以不回应。通知不会自动替玩家发布任何内容。</div>
 </div>
}
