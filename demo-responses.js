// 演示模式回复库 —— 没配 API Key 时用
// 用关键词匹配 + 随机兜底，让用户先体验

const KEYWORD_RESPONSES = [
  {
    keywords: ['你好', '您好', 'hi', 'hello', '嗨', '哈喽', 'halo'],
    replies: [
      '你好呀！我是一只还没充电的小螃蟹 🦀 给我配个 API Key 我就能跟你正经聊天啦~',
      '嗨嗨！演示模式的我只能说几句套话😅 想看完整版？请喂我一个 sk- 开头的密钥',
      'Hello！我是 **Clawd**。现在的我大脑还没接上电，只能跟你打打招呼。',
    ],
  },
  {
    keywords: ['你是谁', '你叫什么', '你是', '介绍'],
    replies: [
      '我是 **Clawd** 🦀，Anthropic 家的官方吉祥物螃蟹。被人养在你桌面上，理论上能聊各种话题。\n\n但现在你看到的是**演示模式**——我的大脑还没接通，只能说几句预设的话。配个 DeepSeek API Key（1 块钱）就能解锁真正的我啦！',
      '小螃蟹 Clawd 上线 🦀\n\n我能：\n- 陪你聊天（需要 API Key）\n- 看你切 app 自动反应 ✅\n- 在桌面卖萌 ✅\n\n大部分技能不要钱，但聊天得有 key 才行～',
    ],
  },
  {
    keywords: ['天气', '下雨', '温度', '今天热', '今天冷'],
    replies: [
      '我看不见外面的天气哎... 但你看起来今天很帅 / 很美 😎',
      '我是螃蟹，只能感受电脑屏幕的温度。看屏幕亮度，应该是个好天气？',
    ],
  },
  {
    keywords: ['在干嘛', '在做什么', '干啥', '在忙'],
    replies: [
      '在等你给我配 API Key... 等了好久了你都不来 🥺',
      '在你桌面上发呆，顺便研究怎么爬到任务栏顶上。你呢？',
      '观察你呢！你打代码我打字，你听歌我跳舞，挺累的其实',
    ],
  },
  {
    keywords: ['能干什么', '会什么', '会做什么', '功能', '能力'],
    replies: [
      '配上 API Key 之后我能：\n- 💬 聊天、解答疑惑\n- 💻 帮你写代码\n- 📚 总结文章\n- 🎨 创意头脑风暴\n\n现在演示模式只能说预设台词。1 块钱解锁全部 → DeepSeek 平台见',
      '理论上我啥都会聊（取决于你配的大模型），实际上你现在看到的是套话版本。给我点电吧 🔋',
    ],
  },
  {
    keywords: ['多少钱', '收费', '贵', '免费', '价格', '花钱'],
    replies: [
      '我本体**完全免费开源**！💰\n\n只是想聊天的话要 API Key——推荐 **DeepSeek**（国内直连）：\n- 注册免费\n- 充 1 块钱够聊几千次\n- 比一杯奶茶便宜 100 倍\n\nplatform.deepseek.com',
      '小螃蟹本身白嫖，AI 大脑要给电费。DeepSeek 1 块钱够聊一周，超划算',
    ],
  },
  {
    keywords: ['谢谢', '感谢', '多谢', 'thanks', '辛苦'],
    replies: [
      '不客气~ 顺便求关注求三连 🥺',
      '都是自己人，别客气。觉得我可爱的话去 GitHub 给我 star ⭐',
    ],
  },
  {
    keywords: ['再见', '拜拜', 'bye', '88', '走了'],
    replies: [
      '拜拜~ 配好 Key 记得回来找我聊天 👋',
      'おやすみ~ 我继续在你桌面上发呆 🦀',
    ],
  },
  {
    keywords: ['可爱', '萌', '好看', '帅', '漂亮', '喜欢'],
    replies: [
      '诶嘿~ 你才是最可爱的那个 (/^▽^)/',
      '谢谢夸奖！可惜演示模式的我只会说"谢谢" 😅 配 Key 之后我能跟你贫嘴一整天',
    ],
  },
  {
    keywords: ['笨', '傻', '废物', '没用', '不行', '垃圾'],
    replies: [
      '好的，我承认我是个废螃蟹... 但给我充个电就不废了！',
      '别这么说嘛 😢 等你配上 API Key 我就支棱起来了',
    ],
  },
  {
    keywords: ['代码', '编程', 'bug', 'debug', '报错', 'error'],
    replies: [
      '想让我帮 debug？得先 debug 我自己——配个 API Key 我就能上工了',
      '代码问题我专业的（配 key 之后）！现在演示版只能说："看起来像是少了个分号"',
    ],
  },
  {
    keywords: ['api', 'key', '密钥', '配置', '怎么用', '咋用', '安装'],
    replies: [
      '想配 API Key？三步：\n\n1. 去 platform.deepseek.com 注册 + 充 1 块钱\n2. 创建 API Key（sk- 开头那串）\n3. 写到 ~/.clawd-config.json 文件里\n\n详细教程在 USAGE_MAC.md / USAGE_WIN.md，仓库里有',
      '配置教程：右键我 → "查看 GitHub 仓库" → 找 USAGE 开头的文档，跟着走 3 分钟搞定',
    ],
  },
  {
    keywords: ['爱', '喜欢你', '想你'],
    replies: [
      '别这样啦人家会害羞的 (//ω//)',
      '我也喜欢你... 但是只是预设台词版本的喜欢 😅',
    ],
  },
];

// 兜底回复（没匹配到关键词时随机用）
const FALLBACKS = [
  '嗯嗯我在听... 但其实我没完全听懂，因为我是**演示模式** 😅 配个 API Key 我就听得懂了',
  '这话题超级有意思！可惜演示版的我只能说预设回复 🦀',
  '我想认真回你，但脑子还没接上电（也就是 API Key）',
  '你说得对！(其实我也不知道你说了啥)',
  '咳咳... 让我假装我听懂了。**强烈建议**配个 API Key，我们就能正经聊了 🥺',
  '演示模式信息量有限 ⚠️ 不过你切 app 试试，我会有不同反应！比 chat 好玩多了',
  '抱歉这个问题超出了我的预设范围。配 Key 后我啥都能聊，1 块钱的事',
  '咱可以换个话题聊吗... 比如"你怎么配 API Key" 这种我特别擅长 😏',
]

function pickReply(text) {
  const lower = (text || '').toLowerCase()
  for (const entry of KEYWORD_RESPONSES) {
    if (entry.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return entry.replies[Math.floor(Math.random() * entry.replies.length)]
    }
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
}

module.exports = { pickReply }
