/* ==========================================================
 * 李宁个人介绍 · 内容数据
 * 内容来源：李宁简历.pdf + 用户补充
 * ========================================================== */

window.RESUME = {

  /* ============ 01 基本信息 / PROFILE ============ */
  profile: {
    name: "李宁",
    title: "个人介绍",
    tagline: "Stay curious. Make things happen.",
    intro: "热爱用镜头与文字记录生活。本科主修网络与新媒体，研究生方向为新闻与传播。擅长视频脚本、拍摄剪辑与新闻评论，坚信好内容源于对生活的细致观察，期待持续创作有温度的作品。",
    photo: "assets/id-photo.jpg",
    mbti: "ESFJ",
    mbtiDetail: {
      name: "ESFJ · 执政官",
      en: "The Consul",
      traits: "热情友善、富有责任心、注重团队和谐、善于沟通",
      strength: "组织协调能力强，能敏锐察觉他人情绪，在团队中起凝聚作用",
      fit: "教育 · 传媒 · 公关 · 公共事务"
    },
    /* 顶部大卡片：证件照 + 名字 + 联系方式 */
    basic: [
      { label: "姓名",   value: "李宁",                      type: "text" },
      { label: "MBTI",   value: "ESFJ",                      type: "text" },
      { label: "联系电话", value: "13051663892",            type: "tel"  },
      { label: "电子邮箱", value: "lixiaolingllll@163.com", type: "mail" }
    ],
    /* 学历：两个时间线节点 */
    education: [
      { school: "河北大学",     degree: "新闻与传播",     level: "硕士研究生", tag: "在读" },
      { school: "沈阳师范大学", degree: "网络与新媒体",   level: "统招本科",   tag: "已毕业" }
    ],
    /* 能力概览 */
    abilities: [
      { group: "英语水平", items: [
        { name: "CET-4", desc: "大学英语四级" },
        { name: "CET-6", desc: "大学英语六级" }
      ]},
      { group: "普通话", items: [
        { name: "一级乙等", desc: "普通话水平测试" }
      ]},
      { group: "工具", items: [
        { name: "Office",  desc: "办公软件" },
        { name: "PS",      desc: "Photoshop" },
        { name: "PR",      desc: "Premiere" }
      ]}
    ]
  },

  /* ============ 02 项目经验 / PROJECTS ============ */
  projects: [
    {
      title: "《新媒体环境下微视频的制作与传播分析》",
      role: "期刊论文",
      time: "2019.03",
      desc: "在新媒体时代下，对微视频制作进行简单介绍、分析微视频传播方式的分类以及未来发展趋势，旨在通过讨论新媒体环境下微视频的相关问题，促进行业不断发展前进。",
      stack: ["学术写作", "新媒体研究"],
      link: "",
      linkLabel: ""
    },
    {
      title: "《画中缘》数媒微电影",
      role: "核心成员 / 现场代表",
      time: "2019.06 — 2019.09",
      desc: "在全国计算机设计大赛中，主要负责撰写视频脚本、协调沟通演员、现场拍摄及后期剪辑，并作为主要代表参加比赛，向评委老师现场阐述作品。荣获校级一等奖、省级一等奖以及国家级二等奖。",
      stack: ["视频脚本", "现场拍摄", "后期剪辑", "现场答辩"],
      link: "",
      linkLabel: ""
    },
    {
      title: "中国新闻出版广电报 · 评论",
      role: "评论作者",
      time: "研究生阶段",
      desc: "在国家级媒体《中国新闻出版广电报》发表评论文章。",
      stack: ["新闻评论", "时事分析"],
      link: "",
      linkLabel: ""
    }
  ],

  /* ============ 03 工作经历 / WORK EXPERIENCE ============ */
  experience: [
    /* === 校园经历 === */
    {
      category: "校园",
      company: "新闻传播学院研究生会",
      role: "副主席",
      time: "2026.09 — 至今",
      location: "河北大学",
      bullets: []
    },
    {
      category: "校园",
      company: "新闻传播学院研究生会",
      role: "组宣部干事",
      time: "2025.09 — 2026.09",
      location: "河北大学",
      bullets: []
    },
    {
      category: "校园",
      company: "沈阳师范大学新闻中心电视台",
      role: "栏目编导",
      time: "2016.09 — 2018.06",
      location: "沈阳师范大学",
      bullets: [
        "主要负责组织报道校园内各类大型活动，如新生报到、院系迎新晚会等",
        "所作报道浏览量高达 2000+"
      ]
    },
    {
      category: "校园",
      company: "学生会女工部",
      role: "部员",
      time: "2016.09 — 2017.06",
      location: "沈阳师范大学",
      bullets: [
        "主要负责学院内各大型活动的礼仪工作",
        "组织举办学院内新生礼仪模特大赛等大型活动，所组织的活动均得到了同学们的积极参与，所作工作得到了学院老师同学的一致认可"
      ]
    },
    /* === 实习与正式工作 === */
    {
      category: "工作",
      company: "中国农业电影电视中心",
      role: "新媒体运营",
      time: "2024.05 — 至今",
      location: "",
      bullets: [
        "主要负责图像处理、短视频剪辑制作、新闻稿件撰写、公众号推文排版等工作",
        "累计制作海报 53 张",
        "输出 svg 动画互动推文 10 篇",
        "撰写新闻通稿 8 篇",
        "剪辑制作短视频 18 条"
      ]
    },
    {
      category: "工作",
      company: "新东方在线",
      role: "新媒体运营",
      time: "2020.04 — 2022.04",
      location: "",
      bullets: [
        "从 0 到 1 搭建全平台短视频矩阵账号，策划、协调、拍摄制作视频百余部，累计粉丝 90w+",
        "关注各维度数据情况，定期复盘并优化视频内容，打造爆款视频",
        "单个视频播放量达 2000w+、互动量 203w+"
      ]
    },
    {
      category: "工作",
      company: "腾讯",
      role: "短视频编导",
      time: "2019.11 — 2020.01",
      location: "",
      bullets: [
        "参与金鸡百花电影节及《通灵妃》漫改番项目的宣传推广工作",
        "负责运营抖音、微视等短视频矩阵账号，包括选题策划及视频剪辑",
        "抖音账号 1 月内获赞 93w+、增粉 8w+",
        "微视账号累计浏览量 1000w+、增粉 1w+"
      ]
    },
    {
      category: "工作",
      company: "新浪微博",
      role: "新媒体运营",
      time: "2019.07 — 2019.10",
      location: "",
      bullets: [
        "主要负责 @微博教育 官方账号的运营工作，账号日均阅读量 100w+",
        "参与策划、执行的全站话题活动 #暑假来了#，阅读量达 30 亿+、讨论量 500w+",
        "负责领域内 KOL 的联络、拓展以及管理工作"
      ]
    }
  ],

  /* ============ 04 奖项 / HONORS ============ */
  honors: [
    { name: "国家奖学金",     org: "教育部",                     time: "研究生阶段" },
    { name: "优秀共青团员",   org: "学校团委",                   time: "研究生阶段" },
    { name: "一等学业奖学金",  org: "学校",                       time: "研究生阶段" },
    { name: "全国计算机设计大赛 · 国家级二等奖", org: "全国计算机设计大赛组委会", time: "2019" },
    { name: "《画中缘》校级一等奖 / 省级一等奖", org: "全国计算机设计大赛", time: "2019" },
    { name: "校媒「优秀干部」",  org: "学校",                       time: "" },
    { name: "社会实践「先进个人」", org: "学校",                       time: "" }
  ]

};

/* ============ 卡片元数据 ============ */
window.CARDS = [
  { no: "01", title: "基本信息",   sub: "PROFILE",         key: "profile",    state: "char-1" },
  { no: "02", title: "项目经验",   sub: "PROJECTS",        key: "projects",   state: "char-2" },
  { no: "03", title: "工作经历",   sub: "WORK EXPERIENCE", key: "experience", state: "char-3" },
  { no: "04", title: "奖项",       sub: "HONORS",          key: "honors",     state: "char-4" }
];
