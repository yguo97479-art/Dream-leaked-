import React,{useEffect,useRef,useState} from 'react';
import {Send,Plus,Smile} from 'lucide-react';
import './JenoChat.css';

// Local, deterministic dialogue rules. No remote AI, microphone, or external messaging.
// Replies deliberately don't claim to know events JENO hasn't been shown.
const variants={
  account:[
    ['네 계정 얘기까지 나오더라. 누가 처음 올렸는지는 아직 모르겠어.','连你的账号都被提到了。我还不知道最早是谁发的。'],
    ['계정은 네 거니까 내가 이래라저래라 할 생각은 없어. 근데 DM은 좀 걱정돼.','账号是你的，我不想指挥你怎么做。但我有点担心那些私信。']
  ],
  abuse:[
    ['그런 말까지 보냈다고? ...일단 답장은 하지 마. 캡처는 남겨 두고.','他们连这种话都发了？……先别回复，截图留着。'],
    ['아, 진짜. 너한테까지 왜 그러는 건데. 그 메시지 아직 있어?','啊，真是的。干吗连你也要骂。那条消息还在吗？']
  ],
  proof:[
    ['사진 몇 장으로 다 안다는 식으로 말하는 거, 좀 어이없네.','就凭几张照片说得好像什么都知道，挺离谱的。'],
    ['모자 얘기 계속 올라오네. 나도 방금 봤어.','帽子的事还在不断被提。我刚刚也看到了。']
  ],
  worried:[
    ['응. 나도 좀 신경 쓰여. 아까부터 계속 확인하고 있어.','嗯，我也挺在意的。从刚才开始就一直在看。'],
    ['알아. 갑자기 네 이름까지 나오니까 나도 당황했어.','我知道。突然连你的名字都被提到，我也有点慌。']
  ],
  okay:[
    ['응, 다행이다. 근데 억지로 괜찮은 척할 필요는 없어.','嗯，那就好。不过不用勉强装作没事。'],
    ['그래? 난 아직 좀 정신없네ㅋㅋ 지금 어디야?','是吗？我这边还有点乱ㅋㅋ 你现在在哪儿？']
  ],
  status:[
    ['나 지금 이동 중이야. 매니저 형이랑 같이 있어.','我现在在路上，和经纪人哥在一起。'],
    ['나는 괜찮아. 회사 쪽에서 연락은 왔는데 아직 정해진 건 없어.','我还好。公司那边联系我了，但目前还没定下来。']
  ],
  call:[
    ['통화하고 싶어? 지금 옆에 사람이 있어서... 조금만 있다가 내가 연락해도 돼?','想打电话吗？现在旁边有人……过一会儿我联系你可以吗？'],
    ['나도 목소리 듣고 싶긴 해. 지금은 통화하기가 좀 애매해.','我也想听听你的声音，但现在打电话有点不方便。']
  ],
  angry:[
    ['화날 만하지. 나도 보고 기분 좋진 않았어.','生气也正常。我看了心情也不好。'],
    ['응, 그건 너무하더라. 괜히 네가 욕먹는 게 싫어.','嗯，那确实太过分了。我不想看你无缘无故挨骂。']
  ],
  deny:[
    ['우리 둘이 아는 사실이랑 인터넷에서 하는 얘기는 다르잖아.','我们俩知道的事，和网上那些人说的又不是一回事。'],
    ['지금 뭘 설명해도 캡처해서 또 얘기할 것 같아.','感觉现在不管解释什么，都会被截图拿去继续说。']
  ],
  breakup:[
    ['잠깐. 그 얘기를 지금 여기서 결론 내리진 말자.','等等。这个话题别在这里急着下结论。'],
    ['그게 네 진심이면 듣겠는데... 오늘 일 때문에 급하게 정하진 않았으면 해.','如果那是你的真心话，我会听。但我不希望你因为今天的事仓促决定。']
  ],
  sleep:[
    ['그래. 폰 좀 내려놔. 나도 이따 연락할게.','好。先放下手机吧。我晚点再联系你。'],
    ['응, 쉬어. 답장 안 해도 돼.','嗯，休息吧。不用急着回。']
  ],
  default:[
    ['잠깐만, 방금 메시지 다시 읽고 있었어.','等一下，我刚刚在重新看你的消息。'],
    ['응. 근데 이건 우리끼리 먼저 얘기해 보자.','嗯。不过这件事我们先私下聊聊吧。'],
    ['...나도 지금 어떻게 하는 게 맞는지 생각 중이야.','……我也正在想现在怎么做才合适。'],
    ['그건 좀 더 생각해 봐야 할 것 같아.','那件事可能还得再想想。'],
    ['지금 X 분위기 진짜 별로네.','现在 X 上的氛围真的很糟。']
  ]
};
function detect(text){
  const t=text.toLowerCase();
  if(/分手|不想谈|结束关系|헤어지|그만 만나|break up/.test(t))return 'breakup';
  if(/骂|攻击|威胁|辱|恶评|私信|骚扰|욕|악플|디엠|dm|협박/.test(t))return 'abuse';
  if(/账号|账户|ig|ins|instagram|인스타|계정|关注|팔로우/.test(t))return 'account';
  if(/电话|通话|打给|声音|전화|통화|목소리|call/.test(t))return 'call';
  if(/帽子|照片|同款|证据|实锤|截图|모자|사진|커플|증거/.test(t))return 'proof';
  if(/生气|烦|无语|气死|讨厌|화나|짜증|열받/.test(t))return 'angry';
  if(/担心|害怕|怕|紧张|不安|怎么办|걱정|무서|불안|어떡/.test(t))return 'worried';
  if(/否认|澄清|解释|回应|公开|否定|해명|부인|입장/.test(t))return 'deny';
  if(/你那边|你怎么样|你还好|公司|经纪人|行程|바빠|회사|매니저|괜찮아\?/.test(t))return 'status';
  if(/休息|睡觉|累|晚安|先不聊|쉬|자야|피곤|잘 자/.test(t))return 'sleep';
  if(/没事|还好|我很好|괜찮아|괜찮/.test(t))return 'okay';
  return 'default';
}
export function makeJenoReply(text,history){
  const key=detect(text);
  const count=history.filter(m=>m.role==='me').length;
  const choices=variants[key];
  const [ko,zh]=choices[(count-1)%choices.length];
  return {ko,zh};
}
const intro=[
  {id:'j-intro-1',role:'jeno',text:'X 봤어?',translation:'你看 X 了吗？',time:'18:53'},
  {id:'j-intro-2',role:'jeno',text:'네 계정까지 올라왔더라.',translation:'连你的账号都被发上去了。',time:'18:54'},
  {id:'j-intro-3',role:'jeno',text:'지금 뭐 하고 있어?',translation:'你现在在干嘛？',time:'18:54'}
];
export default function JenoChat({save,avatar,onSend,legacyBeats=[]}){
  const [draft,setDraft]=useState('');
  const bottom=useRef(null);
  const chat=save.jenoChat||[];
  const old=(save.boyAnswers||[]).flatMap((a,i)=>[
    {id:'old-u-'+i,role:'me',text:a.text,time:legacyBeats[a.step]?.time||''},
    {id:'old-r-'+i,role:'jeno',text:a.reply,time:legacyBeats[a.step]?.time||''}
  ]);
  const messages=[...(old.length?[{id:'old-header',role:'system',text:'之前的聊天记录'}]:[]),...old,...intro,...chat];
  useEffect(()=>{bottom.current?.scrollIntoView({block:'end',behavior:'smooth'})},[chat.length]);
  function submit(e){e?.preventDefault();if(!draft.trim())return;onSend(draft);setDraft('')}
  return <div className="jeno-v48">
    <div className="jeno-v48-thread">
      <div className="jeno-v48-day">10月24日 星期六 · 私人聊天</div>
      {messages.map(m=>m.role==='system'?<div className="jeno-v48-day" key={m.id}>{m.text}</div>:m.role==='me'?<div className="jeno-v48-message own" key={m.id}><small>{m.time}</small><div className="jeno-v48-bubble">{m.text}</div></div>:<div className="jeno-v48-message" key={m.id}><div className="jeno-v48-avatar">{React.cloneElement(avatar,{className:(avatar.props.className||'')+' jeno-v48-img'})}</div><div className="jeno-v48-person"><b>JENO ♡</b><div className="jeno-v48-bubble">{m.text}{m.translation&&<span className="jeno-v48-translation">{m.translation}</span>}</div></div><small>{m.time}</small></div>)}
      <div ref={bottom}/>
    </div>
    <form className="jeno-v48-compose" onSubmit={submit}>
      <Plus size={22} color="#777"/>
      <input aria-label="发送给 JENO 的消息" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="发送消息…" maxLength={500}/>
      <button type="submit" disabled={!draft.trim()} aria-label="发送"><Send size={18}/></button>
    </form>
  </div>
}
