export const routes={
JENO:{name:'李帝努',en:'JENO',trait:'克制、注重隐私',clue:'机场黑色棒球帽与玩家 IG 中的同款帽檐刺绣',post:'同一顶帽子？刺绣的位置都一样…但也可能是普通同款。',dm:'看到 X 上的帖子了。你现在还好吗？先别急着回复陌生人，我们商量一下。',fan:'机场那顶帽子和她上周发的好像一样。'},
HAECHAN:{name:'李楷灿',en:'HAECHAN',trait:'机敏、私下细腻',clue:'直播提过的歌单与玩家限时动态的歌曲重合',post:'直播那首歌和她 story 的 BGM 一样，时间也太巧了吧？',dm:'刚看到有人把歌单截图拼在一起了。你别一个人扛着，我在。',fan:'直播说的那首歌，她前天也发过。'},
JAEMIN:{name:'罗渽民',en:'JAEMIN',trait:'温柔、认真',clue:'两人的摄影构图中出现相似的陶瓷杯与窗景',post:'照片里的杯子和窗框是不是同一个地方？我不确定。',dm:'网上开始讨论照片了。我想先听听你的想法，再决定下一步。',fan:'那个杯子和窗户角度，真的好像。'},
RENJUN:{name:'黄仁俊',en:'RENJUN',trait:'细腻、理性',clue:'同一场虚构画展的票根和相近时间的展厅照片',post:'两个人都去了那个画展？票根日期好像挨得很近。',dm:'有人在对比画展照片。我知道这很突然，你先照顾好自己。',fan:'他们发过同一个画展的照片诶。'},
CHENLE:{name:'钟辰乐',en:'CHENLE',trait:'坦率、自然',clue:'玩家分享的虚构咖啡店杯套与成员照片背景相似',post:'咖啡店杯套和照片里的桌面太像了，但店里很多人都会拍吧。',dm:'热帖我看见了。要不要先打个电话？我想知道你怎么想。',fan:'杯套图案和他照片背景一模一样？'},
JISUNG:{name:'朴志晟',en:'JISUNG',trait:'慢热、认真',clue:'旅行照中相似的钥匙扣与同一款限定纪念品',post:'两个人都有那款钥匙扣？限定款也不是只有一份吧。',dm:'我刚看到那条帖子。有点担心你。如果方便，我们聊聊好吗？',fan:'那只钥匙扣真的太像了。'}
};
export const npc=[{id:'curious',handle:'@dreamwatch_07',tone:'质疑',message:'请问你和他真的在交往吗？现在 X 上都在讨论。'},{id:'angry',handle:'@onlydreams_24',tone:'攻击',message:'为什么要发那些照片让人猜？你是不是故意的？'},{id:'neutral',handle:'@bluehour_note',tone:'理性',message:'网上的截图不一定能证明什么，希望大家别骚扰你。'},{id:'support',handle:'@warmcloud_11',tone:'支持',message:'看到很多人来打扰你，希望你照顾好自己。'}];
export function classify(text){if(/男朋友|在交往|在一起|사귀|boyfriend/i.test(text))return 'admit';if(/没有|不是|不认识|误会|아니|not dating/i.test(text))return 'deny';if(/隐私|别打扰|不要再|骚扰|举报|律师|사생활/i.test(text))return 'boundary';return 'ambiguous'}
