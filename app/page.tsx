"use client";

import { useEffect, useMemo, useState } from "react";

const A = "/figma-task";

const nav = [
  ["home.svg", "首页"], ["benben.png", "犇犇"], ["consumer.svg", "消费者"],
  ["miniapp.svg", "小程序"], ["voc.svg", "VOC"], ["more.svg", "更多"],
  ["apps.svg", "应用"], ["search.svg", "搜索"], ["notifications.svg", "通知"],
] as const;

const taskData = [
  { title: "用户申请退款理赔，需核查诊断", time: "02/11 10:54", order: "6921739428437523559", risk: "high", tag: "", detail: "用户申请退款理赔，需核查诊断" },
  { title: "工单状态更新失败，需人工介入处理", time: "02/11 10:54", order: "6921739428437523559", risk: "medium", tag: "", detail: "工单状态更新失败，需人工介入处理" },
  { title: "用户投诉商品数量缺少，需核查发货记录", time: "02/11 10:54", order: "6921739428437523551", risk: "", tag: "", detail: "用户投诉商品数量缺少，需核查发货记录" },
  { title: "未按约定时间发货，赔付自动判定", time: "02/11 10:54", order: "6921739428437523552", risk: "", tag: "", detail: "未按约定时间发货，赔付自动判定" },
  { title: "订单咨询及售后流转记录", time: "02/11 10:54", order: "6921739428437523553", risk: "", tag: "", detail: "订单咨询及售后流转记录" },
  { title: "识别到羊毛党风险判定，需人工介入", time: "02/11 10:54", order: "6921739428437523554", risk: "high", tag: "", detail: "识别到羊毛党风险判定，需人工介入" },
  { title: "用户申请退款理赔，需核查诊断", time: "02/11 10:54", order: "6921739428437523555", risk: "", tag: "", detail: "用户申请退款理赔，需核查诊断" },
];

const experts = [
  ["system-refund.png", "退款原因分析专家"], ["system-dispute.png", "纠纷处理专家"], ["system-risk.png", "羊毛党风控专家"],
  ["system-delivery.png", "送装一体专家"], ["system-repair.png", "维修诊断专家"], ["system-transaction.png", "交易风控专家"],
  ["system-review.png", "评价管理专家"], ["system-conversation.png", "会话分析专家"],
] as const;

type ExpertSection = "experts" | "skills" | "connectors";

export default function Home() {
  const [designId, setDesignId] = useState("1404-1493");
  const [expertMode, setExpertMode] = useState(false);
  const [expertSection, setExpertSection] = useState<ExpertSection>("experts");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDesignId(params.get("design") || "1404-1493");
    setExpertMode(params.get("expert") === "1");
    const section = params.get("section");
    setExpertSection(section === "skills" ? "skills" : section === "connectors" ? "connectors" : "experts");
  }, []);

  if (expertMode) return <ExpertHub section={expertSection} onBack={() => { window.history.replaceState({}, "", "/?design=1404-1493"); setExpertMode(false); }} />;
  const chat = ["1404-1392", "1414-832", "1414-1072", "1423-474"].includes(designId);
  const menu = ["1404-1881", "1414-28", "1414-430", "1414-832", "1414-952", "1414-1072"].includes(designId);
  if (chat) return <ChatHome menuOpen={menu} />;
  return <TaskHome menuOpen={menu} />;
}

function TaskHome({ menuOpen }: { menuOpen: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(menuOpen);
  const [activeTask, setActiveTask] = useState(1);
  const [readTasks, setReadTasks] = useState<number[]>([2, 3, 4]);
  const [taskTab, setTaskTab] = useState("组内任务");
  const [detailTab, setDetailTab] = useState("概览");
  const [risk, setRisk] = useState("全部");
  const [search, setSearch] = useState("");
  const shownTasks = useMemo(() => taskData.filter((task) => task.title.includes(search) && (risk === "全部" || task.risk === risk)), [risk, search]);
  const selected = taskData[activeTask];

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeMenu = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && !target.closest(".product, .product-menu")) setIsMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setIsMenuOpen(false); };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeMenu); document.removeEventListener("keydown", closeOnEscape); };
  }, [isMenuOpen]);

  return <main className="task-app">
    <aside className="side-rail">
      <img className="brand" src={`${A}/brand-mark.svg`} alt="犇犇" />
      <RailButtons />
      <img className="user-avatar" src={`${A}/avatar.svg`} alt="用户头像" />
    </aside>
    <header className="topbar">
      <button className={`product ${isMenuOpen ? "open" : ""}`} type="button" onClick={() => setIsMenuOpen((open) => !open)}>犇犇Task <img src={`${A}/chevron.svg`} alt="" /></button>{isMenuOpen && <ProductMenu current="task" />}
      <div className="top-search"><img src={`${A}/search-top.svg`} alt="" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索历史对话" /></div>
      <a className="experts-button" href="/?design=1404-1493&expert=1"><img src={`${A}/benben.png`} alt="" />专家·技能·连接器</a><i />
      <button className="settings" type="button"><img src={`${A}/settings-16.svg`} alt="" />设置</button>
    </header>
    <section className="workspace">
      <FilterPanel risk={risk} onRisk={setRisk} />
      <section className="task-list">
        <div className="list-toolbar"><div className="list-switch"><button type="button" onClick={() => setTaskTab("待我处理")} className={taskTab === "待我处理" ? "on" : ""}>待我处理 <b>0</b></button><button type="button" onClick={() => setTaskTab("组内任务")} className={taskTab === "组内任务" ? "on" : ""}>组内任务 <b>147</b></button></div><button className="refresh" type="button"><img src={`${A}/refresh-list.svg`} alt="刷新" /></button></div>
        <div className="tasks">{shownTasks.map((task, listIndex) => { const index = taskData.indexOf(task); const isRead = readTasks.includes(index); return <button type="button" onClick={() => { setActiveTask(index); setReadTasks((items) => items.includes(index) ? items : [...items, index]); }} className={`task-row ${activeTask === index ? "active" : ""} ${isRead ? "read" : "unread"}`} key={`${task.order}-${listIndex}`}>
          <span className="task-time">{task.time}</span><p className="task-title">{task.risk && <img src={`${A}/${task.risk === "high" ? "task-risk-high.svg" : task.risk === "medium" ? "task-risk-medium.svg" : `risk-${task.risk}.svg`}`} alt="" />}{task.title}</p><small>订单号：{task.order} <img src={`${A}/copy.svg`} alt="复制" /></small></button>; })}</div>
      </section>
      <DetailPanel detailTab={detailTab} onTab={setDetailTab} selected={selected} />
    </section>
  </main>;
}

type ChatExpert = "insight" | "ipaas";
type ChatStage = "welcome" | "working" | "done";

const chatExperts = {
  insight: {
    image: "/chat-insight-expert.png", title: "退货退款洞察专家", conversation: "本周退款原因洞察报告",
    text: "深入分析全店售后经营指标、退货退款多维归因与 CSAT 体验大盘，自动生成一键诊断报告与改善策略。",
    items: ["退款原因智能归因与 CSAT / NPS 诊断", "售后数据大盘周报/月报一键导出", "极速退款策略与高频退货风险预警"],
    prompts: ["帮我生成本月店铺售后经营诊断报告", "生成上一个自然月售后诊断报告", "选择自定义时间生成售后诊断报告"],
  },
  ipaas: {
    image: "/chat-ipaas-expert.png", title: "iPaaS三方平台对接专家", conversation: "第三方平台对接方案",
    text: "描述第三方接口信息与认证规则，助手自动生成授权对接代码、参数签名与接口编排配置。",
    items: ["标准接口对接模板与自动解析", "OAuth 2.0 / API Key / Basic Auth / JWT 鉴权代码", "多语言 SDK 封装与自动接口配置输出"],
    prompts: ["生成第三方接口授权方案", "输出 iPaaS 接口编排配置", "生成多语言 SDK 示例"],
  },
} as const;

function ChatHome({ menuOpen }: { menuOpen: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(menuOpen);
  const [selectedExpert, setSelectedExpert] = useState<ChatExpert | null>(null);
  const [stage, setStage] = useState<ChatStage>("welcome");
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [historyOpen, setHistoryOpen] = useState(true);
  const expert = selectedExpert ? chatExperts[selectedExpert] : null;

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeMenu = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && !target.closest(".product, .product-menu")) setIsMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setIsMenuOpen(false); };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeMenu); document.removeEventListener("keydown", closeOnEscape); };
  }, [isMenuOpen]);

  const startConversation = (kind: ChatExpert, prompt?: string) => {
    setSelectedExpert(kind); setStage("welcome"); setExpanded(false); setMessage(prompt || "");
  };
  const sendMessage = () => {
    if (!message.trim()) return;
    setStage("working"); setExpanded(true);
    window.setTimeout(() => setStage("done"), 1200);
  };

  return <main className="task-app chat-home">
    <aside className="side-rail"><img className="brand" src={`${A}/brand-mark.svg`} alt="犇犇" /><RailButtons /><img className="user-avatar" src={`${A}/avatar.svg`} alt="用户头像" /></aside>
    <header className="topbar">
      <button className={`product ${isMenuOpen ? "open" : ""}`} type="button" onClick={() => setIsMenuOpen((open) => !open)}>犇犇Chat <img src={`${A}/chevron.svg`} alt="" /></button>
      {isMenuOpen && <ProductMenu current="chat" />}
      <div className="top-search"><img src={`${A}/search-top.svg`} alt="" /><input placeholder="搜索历史对话" /></div>
      <a className="experts-button" href="/?design=1404-1493&expert=1"><img src={`${A}/benben.png`} alt="" />专家·技能·连接器</a><i />
      <button className="settings chat-settings" type="button"><img src={`${A}/settings-16.svg`} alt="" />设置</button>
    </header>
    {!expert ? <ChatPicker onSelect={startConversation} /> : <section className={`chat-shell ${historyOpen ? "history-open" : ""}`}>
      <aside className="chat-history">
        <button className="history-expand" type="button" aria-label="展开历史对话" onClick={() => setHistoryOpen(true)}><span>›</span></button>
        <div className="history-home"><button type="button" aria-label="主页" onClick={() => setSelectedExpert(null)}><img src={`${A}/home.svg`} alt="" /><span>主页</span></button><button className="history-collapse" type="button" aria-label="收起历史对话" onClick={() => setHistoryOpen(false)}><i /><i /></button></div>
        <div className="history-divider" />
        <button className="history-new" type="button" onClick={() => { setStage("welcome"); setMessage(""); }}><span>＋</span><em>新建对话</em></button>
        <p>历史对话</p>
        {stage === "welcome" ? <small className="history-empty">暂无历史对话</small> : <>
          <button className="history-item active" type="button" onClick={() => setHistoryOpen(true)}><span className="history-message" aria-hidden="true" /><em>{expert.conversation}</em><small>刚刚</small><b>···</b></button>
          <button className="history-item" type="button" onClick={() => setHistoryOpen(true)}><span className="history-message" aria-hidden="true" /><em>{selectedExpert === "insight" ? "上月售后数据分析" : "接口鉴权配置"}</em><small>昨天</small><b>···</b></button>
        </>}
      </aside>
      <section className="chat-thread">
        {stage === "welcome" ? <ChatWelcome expert={expert} onPrompt={(prompt) => { setMessage(prompt); window.setTimeout(sendMessage, 0); }} /> : <ChatConversation expert={expert} stage={stage} expanded={expanded} onToggle={() => setExpanded((value) => !value)} message={message} />}
        <ChatComposer message={message} setMessage={setMessage} onSend={sendMessage} />
      </section>
    </section>}
  </main>;
}

function ChatPicker({ onSelect }: { onSelect: (kind: ChatExpert) => void }) {
  return <div className="chat-content chat-picker"><img className="chat-logo" src="/benben-live.gif" alt="犇犇" /><h1>Hi，今天想和哪位专家聊聊?</h1><div className="expert-cards">{(Object.keys(chatExperts) as ChatExpert[]).map((kind) => <ExpertCard key={kind} {...chatExperts[kind]} onClick={() => onSelect(kind)} />)}</div><p className="chat-footnote">支持在对话中随时切换不同专家，会话状态自动为您保存</p></div>;
}

function ExpertCard({ image, title, text, items, onClick }: { image: string; title: string; text: string; items: readonly string[]; onClick: () => void }) {
  return <button className="chat-card" type="button" onClick={onClick}><header><img src={image} alt="" /><strong>{title}</strong><span>开始对话　→</span></header><p>{text}</p><ul>{items.map((item) => <li key={item}><img src={`${A}/complete.svg`} alt="" />{item}</li>)}</ul></button>;
}

function ChatWelcome({ expert, onPrompt }: { expert: (typeof chatExperts)[ChatExpert]; onPrompt: (prompt: string) => void }) {
  return <div className="chat-welcome"><img src={expert.image} alt="" /><h1>{expert.title}</h1><p>{expert.text}</p><div>{expert.prompts.map((prompt) => <button type="button" onClick={() => onPrompt(prompt)} key={prompt}>{prompt}<span>→</span></button>)}</div></div>;
}

function ChatConversation({ expert, stage, expanded, onToggle, message }: { expert: (typeof chatExperts)[ChatExpert]; stage: ChatStage; expanded: boolean; onToggle: () => void; message: string }) {
  const doneSteps = selectedExpertSteps(expert.title, stage);
  return <div className="conversation-wrap"><h1>{expert.conversation}</h1><div className="message-user">{message || expert.prompts[0]}</div><article className={`assistant-flow ${stage}`}><header><img src={expert.image} alt="" /><div><strong>{expert.title}</strong><small>{stage === "done" ? "已完成分析" : "正在为你整理售后数据"}</small></div><button type="button" onClick={onToggle}>{stage === "done" ? "已处理 1m 27s" : "处理中…"}<span>{expanded ? "⌃" : "⌄"}</span></button></header>{expanded && <div className="flow-steps">{doneSteps.map((step, index) => <div className={index === doneSteps.length - 1 && stage === "working" ? "running" : "complete"} key={step}><i>{index === doneSteps.length - 1 && stage === "working" ? "" : "✓"}</i>{step}{index === doneSteps.length - 1 && stage === "working" && <em>处理中</em>}</div>)}</div>}</article>{stage === "done" && <ChatResult expert={expert} />}</div>;
}

function selectedExpertSteps(title: string, stage: ChatStage) {
  const insight = title.includes("退款");
  const steps = insight ? ["已读取本月售后订单与退款明细", "已完成退款原因与体验指标归因", "已生成本月售后经营诊断报告"] : ["已读取第三方接口及认证信息", "已完成接口鉴权与参数签名解析", "已生成平台对接与编排配置方案"];
  return stage === "working" ? steps.slice(0, 2) : steps;
}

function ChatResult({ expert }: { expert: (typeof chatExperts)[ChatExpert] }) {
  const insight = expert.title.includes("退款");
  return <article className="chat-result"><header><div><img src={expert.image} alt="" /><strong>{insight ? "本月售后经营诊断报告" : "第三方平台对接方案"}</strong></div><button type="button">查看完整报告　→</button></header><section><h2>{insight ? "退款原因洞察" : "接入建议"}</h2><p>{insight ? "本月售后退款申请主要集中在商品描述不符、物流时效与尺码问题。建议优先关注高频退款商品，并同步优化售前引导。" : "已为你整理 OAuth 2.0 鉴权、接口回调校验和参数签名方案，可直接用于后续编排配置。"}</p></section><footer>{["继续查看关键指标", "生成改善建议", "导出诊断报告"].map((item) => <button type="button" key={item}>{item}<span>→</span></button>)}</footer></article>;
}

function ChatComposer({ message, setMessage, onSend }: { message: string; setMessage: (value: string) => void; onSend: () => void }) {
  return <div className="chat-composer"><textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSend(); } }} placeholder="继续问我更多问题" /><footer><span>快捷工具</span><button className="quick-tool" type="button">ϟ　快捷配置填充</button><small>♢ 数据安全防护中</small><button type="button" disabled={!message.trim()} onClick={onSend}>发送　→</button></footer></div>;
}

function ProductMenu({ current }: { current: "task" | "chat" }) {
  return <div className="product-menu"><button type="button" className={current === "task" ? "current" : ""} onClick={() => window.location.assign("/?design=1404-1493")}><strong>犇犇Task</strong><small>端到端任务协同与履约焕新</small>{current === "task" && <b><img src={`${A}/complete-menu.svg`} alt="已选中" /></b>}</button><button type="button" className={current === "chat" ? "current" : ""} onClick={() => window.location.assign("/?design=1404-1392")}><strong>犇犇Chat</strong><small>对话式业务洞察与决策支持</small>{current === "chat" && <b><img src={`${A}/complete-menu.svg`} alt="已选中" /></b>}</button></div>;
}

const expertCatalog = [
  ["退款退款专家", "退货退款专家", "system-refund.png", "跟进售后物流流转状态，辅助退款审核研判，精准识别退货退款诉求。"],
  ["纠纷处理专家", "纠纷处理专家", "system-dispute.png", "汇总会话记录与凭证资料，自动判定纠纷风险等级，给出事件全貌。"],
  ["羊毛党风控专家", "羊毛党风控专家", "system-risk.png", "识别并防御各类恶意售后行为，归集整理纠纷举证材料。"],
  ["送装一体专家", "送装一体专家", "system-delivery.png", "智能调配配送安装服务资源，跟进上门履约全流程进度。"],
  ["维修诊断专家", "维修诊断专家", "system-repair.png", "面向售后维修场景，调度安排服务资源，保障维修诊断服务。"],
  ["交易风控专家", "交易风控专家", "system-transaction.png", "识别交易欺诈异常风险，校验各类费用合理性，守护商家交易安全。"],
  ["评价管理专家", "评价管理专家", "system-review.png", "统筹用户评价运营，跟进卖控负面反馈，保障评价相关舆情。"],
  ["会话分析专家", "会话分析专家", "system-conversation.png", "解析消费者沟通会话内容，自动校验业务逻辑信息。"],
  ["chat-insight-expert", "退货退款洞察专家", "/chat-insight-expert.png", "深入分析售后经营指标、退款原因与体验数据，自动生成洞察报告与改善策略。"],
  ["chat-ipaas-expert", "iPaaS三方平台对接专家", "/chat-ipaas-expert.png", "描述第三方接口信息与认证规则，自动生成授权对接代码与接口编排配置。"],
] as const;

type Expert = (typeof expertCatalog)[number];
type RecruitmentConfig = { shops: string[]; departments: string[]; members: string[] };

function expertProduct(expert: Expert) {
  return expert[0].startsWith("chat-") ? "chat" : "task";
}

function expertImage(expert: Expert) {
  return expert[2].startsWith("/") ? expert[2] : `${A}/${expert[2]}`;
}

function expertCategory(expert: Expert) {
  const name = expert[1];
  if (name.includes("纠纷") || name.includes("评价")) return "工单审核";
  if (name.includes("交易")) return "订单与交易";
  if (name.includes("送装") || name.includes("维修")) return "物流履约";
  if (name.includes("风控")) return "风险识别";
  return "售后处理";
}

function ExpertHub({ onBack, section }: { onBack: () => void; section: ExpertSection }) {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [selected, setSelected] = useState<Expert | null>(null);
  const [customExperts, setCustomExperts] = useState<Expert[]>([]);
  const [expertScope, setExpertScope] = useState<"market" | "mine">("market");
  const [productFilter, setProductFilter] = useState<"all" | "chat" | "task">("all");
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [workspaceExpert, setWorkspaceExpert] = useState<Expert | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [tab, setTab] = useState("我的简介");
  const [recruitedIds, setRecruitedIds] = useState<string[]>([]);
  const [recruitConfigs, setRecruitConfigs] = useState<Record<string, RecruitmentConfig>>({});
  const isCustom = (expert: Expert) => customExperts.some(([id]) => id === expert[0]);
  const isRecruited = (expert: Expert) => isCustom(expert) || recruitedIds.includes(expert[0]);
  const allExperts = [...expertCatalog, ...customExperts];
  const visibleExperts = allExperts.filter((expert) => (expertScope === "market" ? !isCustom(expert) : isRecruited(expert)) && (productFilter === "all" || expertProduct(expert) === productFilter) && (filter === "全部" || expertCategory(expert) === filter) && `${expert[1]}${expert[3]}`.includes(query.trim()));
  if (workspaceExpert) return <CustomExpertWorkspace expert={workspaceExpert} onBack={() => setWorkspaceExpert(null)} />;
  if (section === "connectors") return <ConnectorCenter onBack={onBack} />;
  return <main className="expert-hub"><PlatformRail /><header className="expert-hub-head"><button type="button" onClick={onBack}>‹ 返回</button><a className={section === "experts" ? "on" : ""} href="/?design=1404-1493&expert=1&section=experts">专家</a><a className={section === "skills" ? "on" : ""} href="/?design=1404-1493&expert=1&section=skills">技能</a><a className={section === "connectors" ? "on" : ""} href="/?design=1404-1493&expert=1&section=connectors">连接器</a><button className="management-settings" type="button" aria-label="设置"><img src={`${A}/settings-16.svg`} alt="" /></button></header>{section === "skills" ? <SkillsCenter /> : <section className="expert-hub-body"><div className="library-toolbar library-top-row expert-management-top"><div className="library-scope expert-scope"><button className={expertScope === "market" ? "on" : ""} type="button" onClick={() => { setExpertScope("market"); setFilter("全部"); }}>专家</button><button className={expertScope === "mine" ? "on" : ""} type="button" onClick={() => { setExpertScope("mine"); setFilter("全部"); }}>我的专家</button></div><div className="expert-view-tools"><button aria-label="列表视图" className={view === "list" ? "active" : ""} onClick={() => setView("list")} type="button"><img src={`${A}/view-list.svg`} alt="" /></button><button aria-label="卡片视图" className={view === "cards" ? "active" : ""} onClick={() => setView("cards")} type="button"><img src={`${A}/view-cards.svg`} alt="" /></button><label><img src={`${A}/search-expert.svg`} alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索专家名称" /></label><button className="new-expert" type="button" onClick={() => setCreateOpen(true)}>＋ 创建犇犇专家</button></div></div><div className="expert-toolbar expert-category-toolbar"><nav className="expert-product-filter" aria-label="产品筛选"><button aria-pressed={productFilter === "all"} className={productFilter === "all" ? "active" : ""} type="button" onClick={() => setProductFilter("all")}>全部</button><button aria-pressed={productFilter === "chat"} className={productFilter === "chat" ? "active" : ""} type="button" onClick={() => setProductFilter("chat")}>犇犇Chat</button><button aria-pressed={productFilter === "task"} className={productFilter === "task" ? "active" : ""} type="button" onClick={() => setProductFilter("task")}>犇犇Task</button></nav><nav aria-label="业务类型筛选">{["全部", "售后处理", "工单审核", "订单与交易", "物流履约", "风险识别"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} type="button" key={item}>{item}</button>)}</nav></div><div className={`expert-grid ${view}`}>{visibleExperts.map((expert) => { const custom = isCustom(expert); const recruited = isRecruited(expert); const openSystem = () => { setTab("我的简介"); setSelected(expert); }; return <article className={`expert-tile ${recruited ? "recruited" : "unrecruited"} ${custom ? "custom-expert" : "system-expert"}`} onClick={custom ? () => setWorkspaceExpert(expert) : openSystem} onKeyDown={(event) => { if (event.key === "Enter") custom ? setWorkspaceExpert(expert) : openSystem(); }} role="button" tabIndex={0} key={expert[0]}><header><img src={expertImage(expert)} alt="" /><div><strong>{expert[1]}</strong><div className="expert-tags"><em>{custom ? "自定义" : "系统专家"}</em><em className={`product-tag ${expertProduct(expert)}`}>{expertProduct(expert) === "chat" ? "犇犇Chat" : "犇犇Task"}</em><em className="category-tag">{expertCategory(expert)}</em></div></div>{recruited ? <span>✓ 已招募</span> : <span className="recruit-label"><i>未招募</i><b>去招募　→</b></span>}</header><p>{expert[3]}</p>{custom && <span className="open-config">打开配置　→</span>}</article>; })}</div>{expertScope === "mine" && !visibleExperts.length && <p className="custom-empty">还没有我的专家，先在专家中完成招募吧。</p>}</section>}{createOpen && <CreateExpertModal onClose={() => setCreateOpen(false)} onContinue={(expert) => { setCustomExperts((all) => all.some(([id]) => id === expert[0]) ? all : [...all, expert]); setExpertScope("mine"); setProductFilter("all"); setFilter("全部"); setCreateOpen(false); setWorkspaceExpert(expert); }} />}{selected && <RecruitModal expert={selected} tab={tab} setTab={setTab} recruited={recruitedIds.includes(selected[0])} config={recruitConfigs[selected[0]]} onConfigChange={(config) => setRecruitConfigs((all) => ({ ...all, [selected[0]]: config }))} onClose={() => setSelected(null)} onRecruit={() => { setRecruitedIds((ids) => ids.includes(selected[0]) ? ids : [...ids, selected[0]]); setSelected(null); }} onCancelRecruit={() => { setRecruitedIds((ids) => ids.filter((id) => id !== selected[0])); setSelected(null); }} />}</main>;
}

function CustomExpertWorkspace({ expert, onBack }: { expert: Expert; onBack: () => void }) {
  const [resourceTab, setResourceTab] = useState("店铺");
  const [workTab, setWorkTab] = useState("工作规划");
  const [published, setPublished] = useState(false);
  const [name, setName] = useState(expert[1]);
  const [description, setDescription] = useState(expert[3]);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [testedOrder, setTestedOrder] = useState("69251471071587401");
  const [plan, setPlan] = useState(`### 角色定义\n你是一名${expert[1]}，专门处理以下场景：\n\n消费者申请退货退款时，交叉比对订单、客服会话与仓库收货信息，判断差异是否合理，并给出清晰的处理建议。\n\n### 核心判定逻辑\n1. 核验消费者反馈、商品状态和沟通记录是否支持当前诉求。\n2. 对比订单、仓库收货和售后工单，识别可能存在的少发、破损或退款风险。\n3. 输出同意退款、拒绝退款或转人工处理的明确建议。\n\n### 输入信息清单\n- 售后单号、退款状态和申请说明\n- 订单商品、仓库收货信息与客服会话\n- 消费者标签与历史售后记录`);
  const shops = ["犇犇抖音旗舰店", "犇犇抖音官方旗舰店", "犇犇抖音优选旗舰店", "犇犇抖音渠道专卖店"];
  return <main className="custom-workspace"><PlatformRail /><header className="workspace-back"><button type="button" onClick={onBack}>← 返回犇犇专家</button></header><div className="workspace-title"><h1>Hi，把任务交给我吧</h1><b>BEN<br />EXPERT</b></div><section className="workspace-layout"><aside className="workspace-profile"><header><img src={expertImage(expert)} alt="" /><div className="editable-profile">{editingName ? <input value={name} onChange={(event) => setName(event.target.value)} onBlur={() => setEditingName(false)} autoFocus /> : <h2 onClick={() => setEditingName(true)}>{name} <span>⌑</span></h2>}<time>更新时间：2026-08-20 15:28:00</time></div></header>{editingDescription ? <div className="description-edit-wrap"><textarea className="editable-description" value={description} onChange={(event) => setDescription(event.target.value)} onBlur={() => setEditingDescription(false)} autoFocus maxLength={200} /><small>{description.length} / 200</small></div> : <p className="editable-description" onClick={() => setEditingDescription(true)}>{description || "请输入工作内容描述"}<span>⌑ 点击修改</span><small>{description.length} / 200</small></p>}<nav>{["店铺", "客服组", "技能", "工作表"].map((item) => <button className={resourceTab === item ? "on" : ""} onClick={() => setResourceTab(item)} type="button" key={item}>{item}</button>)}</nav><WorkspaceResources tab={resourceTab} shops={shops} /><section className="context-panel"><header><b>上下文</b><span>自定义上下文</span></header><nav>{["消费者标签", "订单", "售后单", "OMS", "aaa测试", "补发商品…", "抖音-售…", "会话智能…"].map((item, index) => <button className={index === 0 ? "on" : ""} type="button" key={item}>{item}</button>)}</nav><div className="context-box"><strong>消费者标签　⌄</strong><p>• 新客　　　　• aku测试标签名…</p><p>• 老客　　　　• 高频退款</p><p>• 风险用户　　• 售后偏好</p></div></section></aside><section className="workspace-editor"><header><nav>{["工作规划", "流程预览", "工作测试"].map((item) => <button className={workTab === item ? "on" : ""} onClick={() => setWorkTab(item)} type="button" key={item}>{item}</button>)}</nav><div><button type="button">查看历史版本</button><button type="button">保存草稿</button><button className="publish" type="button" onClick={() => { setPublished(true); onBack(); }}>{published ? "✓ 已发布" : "发布"}</button></div></header>{workTab === "工作规划" ? <div className="plan-editor"><textarea value={plan} onChange={(event) => setPlan(event.target.value)} /><small>{plan.length}/5000</small></div> : workTab === "流程预览" ? <div className="work-placeholder"><strong>工作流程预览</strong><p>接收任务 → 获取订单与上下文 → {name}分析 → 输出处理建议</p></div> : <section className="test-panel"><aside><h3>调试运行</h3><input value={orderNo} onChange={(event) => setOrderNo(event.target.value)} placeholder="输入订单号" /><button className="run-test" type="button" onClick={() => setTestedOrder(orderNo || "69251471071587401")}>▷　运行</button><hr /><h3>历史调试</h3><label>⌕　<input placeholder="搜索订单号" /></label>{[testedOrder, "69251471071587401", "69251471071587401", "69251471071587401", "69251471071587401"].map((item, index) => <button className={index === 0 ? "test-history on" : "test-history"} type="button" onClick={() => setTestedOrder(item)} key={`${item}-${index}`}><b>{item}</b><small>2026-05-07 10:12:46</small></button>)}</aside><main><header><h3>推理结果 <small>最近运行：2026-05-07 10:12:46</small></h3></header><p className="test-note">ⓘ 配置事件及运行仅用作推理结果展示，不触发任何真实的外部动作～</p><article className="test-result"><header><b>抖音退货退款-入库异常商品核实</b><time>2026-05-07 10:12:46</time><button type="button">▷ 过程回放</button></header><h4>工单创建</h4><p>① 识别自动退款成功状态</p><p>② 任务直接归档</p><div>售后单（147471644942854774）当前状态为【自动】退款成功，退款流程已完结。根据审核规则，已完成状态的售后单无需进行仓库异常核对及后续审核操作，任务已自动结束归档。</div></article></main></section>}</section></section></main>;
}

function ShopPlatformIcon({ shop }: { shop: string }) {
  if (shop.includes("抖音")) return <img className="shop-platform-icon douyin" src={`${A}/douyin-account.svg`} alt="抖音" />;
  if (shop.includes("快手")) return <img className="shop-platform-icon" src={`${A}/kuaishou-store.svg`} alt="快手" />;
  if (shop.includes("京东")) return <img className="shop-platform-icon" src={`${A}/jd-store.svg`} alt="京东" />;
  if (shop.includes("小米")) return <img className="shop-platform-icon" src={`${A}/xiaomi-store.svg`} alt="小米" />;
  if (shop.includes("有赞")) return <img className="shop-platform-icon" src={`${A}/youzan-store.svg`} alt="有赞" />;
  return <span className="shop-platform-icon commerce" aria-label="电商">电商</span>;
}

function WorkspaceResources({ tab, shops }: { tab: string; shops: string[] }) {
  if (tab === "店铺") return <section className="resource-content"><h3>已绑定店铺（4） <button type="button">管理</button></h3>{shops.map((shop) => <div className="resource-row shop-row" key={shop}><ShopPlatformIcon shop={shop} />{shop}</div>)}</section>;
  if (tab === "客服组") return <section className="resource-content"><h3>客服组 <button type="button">管理</button></h3><div className="resource-switch"><b>部门（3）</b><span>成员（10）</span></div><div className="team-tags">{["抖音售前接待组", "抖音售后接待组", "退货退款组", "售后质检组"].map((team) => <i key={team}>{team}</i>)}</div></section>;
  if (tab === "技能") return <section className="resource-content"><h3>已关联技能（3） <button type="button">管理</button></h3>{["消费者标签", "订单信息", "售后单查询"].map((skill) => <div className="resource-row" key={skill}>✦　{skill}<span>已启用</span></div>)}</section>;
  return <section className="resource-content"><h3>工作表 <button type="button">管理</button></h3>{["售后处理工作表", "退款风险判断工作表"].map((sheet) => <div className="resource-row" key={sheet}>▣　{sheet}</div>)}</section>;
}

function CreateExpertModal({ onClose, onContinue }: { onClose: () => void; onContinue: (expert: (typeof expertCatalog)[number]) => void }) {
  const [name, setName] = useState("");
  const [work, setWork] = useState("");
  return <div className="modal-layer"><section className="create-expert-modal"><button className="close" type="button" onClick={onClose}>×</button><img src={`${A}/benben.png`} alt="犇犇" /><h1>Hi，把任务交给我吧</h1><label>专家名称<input value={name} onChange={(event) => setName(event.target.value)} placeholder="请输入专家名称" autoFocus /></label><label>工作内容<textarea value={work} onChange={(event) => setWork(event.target.value)} maxLength={200} placeholder="例如：识别高风险退款申请，降低资损，同时减少对正常消费者的误判。" /></label><small>{work.length} / 200</small><button className="create-continue" type="button" disabled={!name.trim()} onClick={() => onContinue([name.trim(), name.trim(), "benben.png", work.trim() || "根据业务目标自动分析任务、识别风险并输出处理建议。"])}>更多配置　→</button></section></div>;
}

type Skill = { id: string; name: string; description: string; category: string; scope: "system" | "mine" };

const skillCatalog: Skill[] = [
  { id: "update-ticket", name: "更新工单状态", description: "本接口用于更新工作表中任务状态组件。", category: "工单", scope: "system" },
  { id: "refund-reason", name: "拒绝原因码查询", description: "退货退款拒绝时，查询接口获取拒绝原因 code。", category: "售后", scope: "system" },
  { id: "refund-manual", name: "退货退款-人工已处理", description: "当客服或系统需要对售后工单做出处理决策时调用。", category: "售后", scope: "system" },
  { id: "refund-approve", name: "退货退款-同意退款", description: "根据审核规则确认退款条件，完成售后处理。", category: "售后", scope: "system" },
  { id: "member-profile", name: "辅助回填-会员基本信息", description: "辅助回填会员基本信息，为任务判断提供上下文。", category: "通用", scope: "system" },
  { id: "refund-reject", name: "退货退款-拒绝退款", description: "结合拒绝原因与凭证信息，输出售后处理结果。", category: "售后", scope: "system" },
  { id: "order-note", name: "通用-订单备注", description: "为特定订单添加或更新备注信息和状态策略。", category: "订单", scope: "system" },
  { id: "refund-operation", name: "退货退款操作", description: "在人工处理场景中完成售后工单操作与结果回填。", category: "售后", scope: "system" },
  { id: "logistics-track", name: "物流轨迹查询", description: "查询包裹当前物流节点，识别履约异常与延误风险。", category: "物流", scope: "system" },
  { id: "order-detail", name: "订单详情查询", description: "读取订单商品、支付和收货信息，形成统一订单上下文。", category: "订单", scope: "system" },
];

function SkillsCenter() {
  const [view, setView] = useState<"list" | "cards">("cards");
  const [scope, setScope] = useState<"system" | "mine">("system");
  const [filter, setFilter] = useState("全部");
  const [queryDraft, setQueryDraft] = useState("");
  const [query, setQuery] = useState("");
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [editorSkill, setEditorSkill] = useState<Skill | null | undefined>(undefined);
  const [notice, setNotice] = useState("");
  const categories = ["全部", "订单", "工单", "售后", "物流", "通用"];
  const currentSkills = scope === "system" ? skillCatalog : mySkills;
  const filtered = currentSkills.filter((skill) => (filter === "全部" || skill.category === filter) && `${skill.name}${skill.description}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const reset = () => { setQueryDraft(""); setQuery(""); setFilter("全部"); };
  const saveSkill = (skill: Skill) => {
    setMySkills((items) => items.some((item) => item.id === skill.id) ? items.map((item) => item.id === skill.id ? skill : item) : [...items, skill]);
    setEditorSkill(undefined);
    setScope("mine");
    setNotice("技能已保存到我的技能");
  };

  return <section className="library-page skill-center"><div className="library-toolbar library-top-row"><div className="library-scope"><button className={scope === "system" ? "on" : ""} type="button" onClick={() => setScope("system")}>技能</button><button className={scope === "mine" ? "on" : ""} type="button" onClick={() => setScope("mine")}>我的技能</button></div><div className="library-actions"><div className="view-toggle"><button aria-label="列表视图" className={view === "list" ? "on" : ""} onClick={() => setView("list")} type="button"><img src={`${A}/view-list.svg`} alt="" /></button><button aria-label="卡片视图" className={view === "cards" ? "on" : ""} onClick={() => setView("cards")} type="button"><img src={`${A}/view-cards.svg`} alt="" /></button></div><label className="library-search"><img src={`${A}/search-expert.svg`} alt="" /><input value={queryDraft} onChange={(event) => setQueryDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") setQuery(queryDraft); }} placeholder="搜索技能名称" /></label><button className="library-query" type="button" onClick={() => setQuery(queryDraft)}>查询</button><button className="library-reset" type="button" onClick={reset}>重置</button><button className="library-add" type="button" onClick={() => setEditorSkill(null)}>＋ 添加关联技能</button></div></div><div className="library-toolbar library-filter-row"><nav className="library-categories">{categories.map((item) => <button className={filter === item ? "on" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</nav></div>{filtered.length ? <div className={`library-grid ${view}`}>{filtered.map((skill) => <article className="skill-card" key={skill.id} onClick={() => scope === "mine" ? setEditorSkill(skill) : setNotice("系统技能为平台能力，暂不支持直接修改")}><header><img src="/figma-connectors/skill-icon.svg" alt="" /><div><strong>{skill.name}</strong><span>{skill.category}</span></div><b>✓ 已启用</b></header><p>{skill.description}</p>{scope === "mine" && <button className="skill-edit" aria-label={`编辑 ${skill.name}`} type="button" onClick={(event) => { event.stopPropagation(); setEditorSkill(skill); }}><img src={`${A}/edit.svg`} alt="" /></button>}</article>)}</div> : <div className="library-empty"><img src="/figma-connectors/skill-icon.svg" alt="" /><strong>{scope === "mine" ? "还没有关联技能" : "没有匹配的技能"}</strong><p>{scope === "mine" ? "点击右上角添加关联技能，开始配置你的专家能力。" : "试试切换分类或调整搜索关键词。"}</p></div>}{editorSkill !== undefined && <SkillEditorModal skill={editorSkill} onClose={() => setEditorSkill(undefined)} onSave={saveSkill} />}{notice && <div className="library-toast">{notice}</div>}</section>;
}

function SkillEditorModal({ skill, onClose, onSave }: { skill: Skill | null; onClose: () => void; onSave: (skill: Skill) => void }) {
  const [name, setName] = useState(skill?.name ?? "");
  const [description, setDescription] = useState(skill?.description ?? "");
  const [category, setCategory] = useState(skill?.category ?? "通用");
  return <div className="modal-layer library-modal-layer"><section className="library-editor-modal"><button className="close" type="button" onClick={onClose}>×</button><header><img src="/figma-connectors/skill-icon.svg" alt="" /><div><h2>{skill ? "编辑关联技能" : "添加关联技能"}</h2><p>配置技能名称与说明，保存后可在我的技能中使用。</p></div></header><label>技能名称<input value={name} onChange={(event) => setName(event.target.value)} placeholder="请输入技能名称" autoFocus /></label><label>技能分类<select value={category} onChange={(event) => setCategory(event.target.value)}>{["订单", "工单", "售后", "物流", "通用"].map((item) => <option key={item}>{item}</option>)}</select></label><label>技能说明<textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={160} placeholder="请输入技能的使用说明" /></label><footer><button type="button" className="modal-secondary" onClick={onClose}>取消</button><button type="button" className="modal-primary" disabled={!name.trim()} onClick={() => onSave({ id: skill?.id ?? `custom-skill-${Date.now()}`, name: name.trim(), description: description.trim() || "暂无技能说明。", category, scope: "mine" })}>保存</button></footer></section></div>;
}

type Connector = { id: string; name: string; description: string; type: "ERP" | "应用"; logo: string; authorized: boolean };

const connectorCatalog: Connector[] = [
  { id: "bojun", name: "伯俊【云雀版】", description: "伯俊云雀 OMS，统一管理商品、进销存、订单与多平台库存同步。", type: "ERP", logo: "/figma-connectors/logo-bojun.svg", authorized: true },
  { id: "wangdian", name: "网店管家", description: "电商 ERP 一体化解决方案，覆盖订单、仓储、采购、财务与 CRM。", type: "ERP", logo: "/figma-connectors/logo-wangdian.png", authorized: true },
  { id: "guanyi", name: "管易云-数智版-Test", description: "管易云数智版测试环境，支持订单、库存与财务数据同步。", type: "ERP", logo: "/figma-connectors/logo-guanyi.svg", authorized: true },
  { id: "tongtianxiao", name: "通天晓", description: "WMS 供应链系统，覆盖订单履约与运输管理。", type: "ERP", logo: "/figma-connectors/logo-tongtianxiao.svg", authorized: true },
  { id: "kuaimai", name: "快麦ERP", description: "快麦 ERP，支持订单、库存和售后业务协同。", type: "ERP", logo: "/figma-connectors/logo-kuaimai.svg", authorized: true },
  { id: "jushuitan", name: "聚水潭", description: "聚水潭 ERP，覆盖多平台订单、仓储和库存管理。", type: "ERP", logo: "/figma-connectors/logo-jushuitan.svg", authorized: true },
  { id: "juyi", name: "巨益", description: "巨益 ERP 与开放接口，支持订单和售后流程接入。", type: "ERP", logo: "/figma-connectors/logo-guanyi.svg", authorized: true },
  { id: "dingtalk", name: "钉钉", description: "连接钉钉消息、通讯录与协作数据，授权后可在专家任务中调用。", type: "应用", logo: "/figma-connectors/logo-dingtalk.png", authorized: false },
  { id: "feishu", name: "飞书", description: "连接飞书消息、文档与协作数据，授权后可在专家任务中调用。", type: "应用", logo: "/figma-connectors/logo-feishu.svg", authorized: false },
];

function ConnectorCenter({ onBack }: { onBack: () => void }) {
  const [scope, setScope] = useState<"system" | "mine">("system");
  const [view, setView] = useState<"cards" | "list">("cards");
  const [filter, setFilter] = useState("全部");
  const [queryDraft, setQueryDraft] = useState("");
  const [query, setQuery] = useState("");
  const [connectorStates, setConnectorStates] = useState<Record<string, boolean>>(() => Object.fromEntries(connectorCatalog.map((connector) => [connector.id, connector.authorized])));
  const [accountCounts, setAccountCounts] = useState<Record<string, number>>(() => Object.fromEntries(connectorCatalog.map((connector) => [connector.id, connector.authorized ? 1 : 0])));
  const [authTarget, setAuthTarget] = useState<Connector | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Connector | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const categories = ["全部", "ERP", "应用"];
  const filtered = connectorCatalog.filter((connector) => (scope === "system" || connectorStates[connector.id]) && (filter === "全部" || connector.type === filter) && `${connector.name}${connector.description}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const reset = () => { setQueryDraft(""); setQuery(""); setFilter("全部"); };
  const getConnector = (id: string) => connectorCatalog.find((connector) => connector.id === id) ?? connectorCatalog[0];
  const saveAuthorization = (id: string, accounts: number) => {
    setConnectorStates((states) => ({ ...states, [id]: true }));
    setAccountCounts((counts) => ({ ...counts, [id]: Math.max(1, accounts) }));
    setAuthTarget(null);
    setMenu(null);
    setNotice("连接器授权配置已保存");
  };
  const cancelAuthorization = () => {
    if (!cancelTarget) return;
    setConnectorStates((states) => ({ ...states, [cancelTarget.id]: false }));
    setAccountCounts((counts) => ({ ...counts, [cancelTarget.id]: 0 }));
    setCancelTarget(null);
    setMenu(null);
    setNotice(`已取消与${cancelTarget.name}的连接`);
  };
  const openConnector = (connector: Connector) => { setMenu(null); setAuthTarget(connector); };

  return <main className="expert-hub connector-hub"><PlatformRail /><header className="expert-hub-head"><button type="button" onClick={onBack}>‹ 返回</button><a href="/?design=1404-1493&expert=1&section=experts">专家</a><a href="/?design=1404-1493&expert=1&section=skills">技能</a><a className="on" href="/?design=1404-1493&expert=1&section=connectors">连接器</a><button className="management-settings" type="button" aria-label="设置"><img src={`${A}/settings-16.svg`} alt="" /></button></header><section className="library-page connector-center"><div className="library-toolbar library-top-row"><div className="library-scope"><button className={scope === "system" ? "on" : ""} type="button" onClick={() => setScope("system")}>连接器</button><button className={scope === "mine" ? "on" : ""} type="button" onClick={() => setScope("mine")}>我的连接器</button></div><div className="library-actions"><div className="view-toggle"><button aria-label="列表视图" className={view === "list" ? "on" : ""} onClick={() => setView("list")} type="button"><img src={`${A}/view-list.svg`} alt="" /></button><button aria-label="卡片视图" className={view === "cards" ? "on" : ""} onClick={() => setView("cards")} type="button"><img src={`${A}/view-cards.svg`} alt="" /></button></div><label className="library-search"><img src={`${A}/search-expert.svg`} alt="" /><input value={queryDraft} onChange={(event) => setQueryDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") setQuery(queryDraft); }} placeholder="搜索连接器名称" /></label><button className="library-query" type="button" onClick={() => setQuery(queryDraft)}>查询</button><button className="library-reset" type="button" onClick={reset}>重置</button></div></div><div className="library-toolbar library-filter-row"><nav className="library-categories">{categories.map((item) => <button className={filter === item ? "on" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</nav></div>{filtered.length ? <div className={`connector-grid ${view}`}>{filtered.map((connector) => <article className="connector-card" key={connector.id} onClick={() => openConnector(connector)}><header><div className="connector-logo"><img src={connector.logo} alt="" /></div><div className="connector-name"><strong>{connector.name}</strong><span>{connector.type}</span></div><div className="connector-menu-wrap"><button className="connector-more" type="button" aria-label={`${connector.name}更多操作`} onClick={(event) => { event.stopPropagation(); setMenu(menu === connector.id ? null : connector.id); }}>···</button>{menu === connector.id && <div className="connector-menu"><button type="button" onClick={(event) => { event.stopPropagation(); openConnector(connector); }}>配置授权</button>{connectorStates[connector.id] && <button className="danger" type="button" onClick={(event) => { event.stopPropagation(); setMenu(null); setCancelTarget(connector); }}>取消连接</button>}</div>}</div></header><p>{connector.description}</p><footer><small>{accountCounts[connector.id] > 1 ? `${accountCounts[connector.id]} 个账号已授权` : connectorStates[connector.id] ? "已授权" : "尚未连接"}</small><button className={connectorStates[connector.id] ? "authorized" : "connect"} type="button" onClick={(event) => { event.stopPropagation(); openConnector(connector); }}>{connectorStates[connector.id] ? "✓ 已授权" : "授权连接"}</button></footer></article>)}</div> : <div className="library-empty"><strong>{scope === "mine" ? "还没有我的连接器" : "没有匹配的连接器"}</strong><p>{scope === "mine" ? "授权一个系统连接器后，它会出现在这里。" : "试试切换分类或调整搜索关键词。"}</p></div>}{authTarget && <ConnectorAuthModal connector={authTarget} accountCount={accountCounts[authTarget.id] || 1} onClose={() => setAuthTarget(null)} onSave={(accounts) => saveAuthorization(authTarget.id, accounts)} />}{cancelTarget && <ConnectorCancelModal connector={cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={cancelAuthorization} />}{notice && <div className="library-toast">{notice}</div>}</section></main>;
}

type AuthAccount = { name: string; customerId: string; aesKey: string; appSecret: string; iv: string };

function ConnectorAuthModal({ connector, accountCount, onClose, onSave }: { connector: Connector; accountCount: number; onClose: () => void; onSave: (accountCount: number) => void }) {
  const [mode, setMode] = useState<"single" | "multi">(accountCount > 1 ? "multi" : "single");
  const emptyAccount = (): AuthAccount => ({ name: "", customerId: "", aesKey: "", appSecret: "", iv: "" });
  const [accounts, setAccounts] = useState<AuthAccount[]>(() => Array.from({ length: Math.max(1, accountCount) }, (_, index) => ({ ...emptyAccount(), name: index === 0 ? `${connector.name}主账号` : "" })));
  const [activeIndex, setActiveIndex] = useState(0);
  const active = accounts[activeIndex] ?? accounts[0];
  const updateAccount = (field: keyof AuthAccount, value: string) => setAccounts((items) => items.map((item, index) => index === activeIndex ? { ...item, [field]: value } : item));
  const addAccount = () => { setAccounts((items) => [...items, emptyAccount()]); setActiveIndex(accounts.length); setMode("multi"); };
  const renderFields = (account: AuthAccount) => <div className="auth-fields"><label>连接名称<input value={account.name} onChange={(event) => updateAccount("name", event.target.value)} placeholder="请输入连接名称" /></label><label>customerId<input value={account.customerId} onChange={(event) => updateAccount("customerId", event.target.value)} placeholder="请输入 customerId" /></label><label>aesKey<input value={account.aesKey} onChange={(event) => updateAccount("aesKey", event.target.value)} placeholder="请输入 aesKey" /></label><label>appSecret<input type="password" value={account.appSecret} onChange={(event) => updateAccount("appSecret", event.target.value)} placeholder="请输入 appSecret" /></label><label>iv<input value={account.iv} onChange={(event) => updateAccount("iv", event.target.value)} placeholder="请输入 iv" /></label></div>;
  return <div className="modal-layer connector-modal-layer"><section className="connector-auth-modal"><button className="close" type="button" onClick={onClose}>×</button><header className="auth-title"><div className="connector-logo large"><img src={connector.logo} alt="" /></div><div><h2>授权配置 · {connector.name}</h2><p>接口权限已开通 · 支持套餐、物流轨迹、订单和实时库存</p></div></header><nav className="auth-tabs"><button className={mode === "single" ? "on" : ""} type="button" onClick={() => setMode("single")}>单账号</button><button className={mode === "multi" ? "on" : ""} type="button" onClick={() => setMode("multi")}>多账号</button></nav>{mode === "single" ? renderFields(active) : <div className="multi-auth"><header><strong>已配置账号（{accounts.length}）</strong><button type="button" onClick={addAccount}>＋ 添加账号</button></header><div className="account-list">{accounts.map((account, index) => <div className={`account-item ${activeIndex === index ? "open" : ""}`} key={`account-${index}`}><button className="account-heading" type="button" onClick={() => setActiveIndex(index)}><span>{account.name || `账号 ${index + 1}`}</span><i>{activeIndex === index ? "⌃" : "⌄"}</i></button>{activeIndex === index && renderFields(account)}</div>)}</div></div>}<footer className="auth-footer"><button className="modal-secondary" type="button" onClick={onClose}>取消</button><button className="modal-primary" type="button" onClick={() => onSave(mode === "multi" ? accounts.length : 1)}>保存</button></footer></section></div>;
}

function ConnectorCancelModal({ connector, onClose, onConfirm }: { connector: Connector; onClose: () => void; onConfirm: () => void }) {
  return <div className="modal-layer cancel-modal-layer"><section className="cancel-connector-modal"><button className="close" type="button" onClick={onClose}>×</button><div className="cancel-icon">!</div><h2>取消与{connector.name}的连接?</h2><p>取消后，相关专家将无法继续调用该连接器的数据与能力，你可以随时重新授权。</p><footer><button className="modal-secondary" type="button" onClick={onClose}>保留连接</button><button className="modal-danger" type="button" onClick={onConfirm}>取消连接</button></footer></section></div>;
}

function RailButtons() { return <><nav>{nav.slice(0, 6).map(([icon, label], index) => <button className={index === 1 ? "selected" : ""} type="button" key={label}><img src={`${A}/${icon}`} alt="" /><span>{label}</span></button>)}</nav><nav className="rail-bottom-nav">{nav.slice(6).map(([icon, label]) => <button type="button" key={label}><img src={`${A}/${icon}`} alt="" /><span>{label}</span></button>)}</nav></>; }
function PlatformRail() { return <aside className="side-rail"><img className="brand" src={`${A}/brand-mark.svg`} alt="犇犇" /><RailButtons /><img className="user-avatar" src={`${A}/avatar.svg`} alt="用户头像" /></aside>; }

function RecruitModal({ expert, tab, setTab, recruited, config, onConfigChange, onClose, onRecruit, onCancelRecruit }: { expert: Expert; tab: string; setTab: (value: string) => void; recruited: boolean; config?: RecruitmentConfig; onConfigChange: (config: RecruitmentConfig) => void; onClose: () => void; onRecruit: () => void; onCancelRecruit: () => void }) {
  const [manager, setManager] = useState<"shops" | "team" | null>(null);
  const [shops, setShops] = useState<string[]>(config?.shops ?? []);
  const [departments, setDepartments] = useState<string[]>(config?.departments ?? []);
  const [members, setMembers] = useState<string[]>(config?.members ?? []);
  const [resourceView, setResourceView] = useState<"部门" | "成员">("部门");
  const [teamView, setTeamView] = useState<"部门" | "成员">("部门");
  const [draftShops, setDraftShops] = useState<string[]>([]);
  const [draftDepartments, setDraftDepartments] = useState<string[]>([]);
  const [draftMembers, setDraftMembers] = useState<string[]>([]);
  const shopOptions = ["【抖音】犇犇旗舰店", "【快手】Y·X852", "【虚店】【测试京东自营】犇犇小店", "【小米有品】七宝小米有品1", "【有赞】云测试店铺SFgOM", "【京东自营(犇犇)】京东测试自营店铺"];
  const departmentOptions = ["售后客服组", "退款审核组", "风险处理组"];
  const memberOptions = ["朱迪", "朱迪5195", "客服小陈", "售后小吴", "质检小王", "犇犇客服A"];
  const openManager = (kind: "shops" | "team") => {
    setManager(kind);
    setDraftShops(shops);
    setDraftDepartments(departments);
    setDraftMembers(members);
    setTeamView("部门");
  };
  const toggle = (value: string) => {
    const update = (items: string[]) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
    if (manager === "shops") setDraftShops(update);
    else if (teamView === "部门") setDraftDepartments(update);
    else setDraftMembers(update);
  };
  const options = manager === "shops" ? shopOptions : teamView === "部门" ? departmentOptions : memberOptions;
  const draft = manager === "shops" ? draftShops : teamView === "部门" ? draftDepartments : draftMembers;
  const saveSelection = () => {
    if (manager === "shops") { setShops(draftShops); onConfigChange({ shops: draftShops, departments, members }); }
    else { setDepartments(draftDepartments); setMembers(draftMembers); onConfigChange({ shops, departments: draftDepartments, members: draftMembers }); }
    setManager(null);
  };
  const configured = shops.length > 0 && (departments.length > 0 || members.length > 0);
  const complete = () => { if (configured) onRecruit(); };
  const teamItems = resourceView === "部门" ? departments : members;
  return <div className="modal-layer"><section className="expert-detail-modal system-detail">
    <button className="close" onClick={onClose} type="button">×</button>
    <aside><img src={expertImage(expert)} alt="" /><h2>{expert[1]}专家</h2><small>v20260817–001</small><p>犇犇·履约Agent「{expert[1]}」专家，是面向电商售后场景的全流程智能履约引擎。</p>{recruited ? <><b className="recruited-badge">✓ 已招募</b><button type="button" className="cancel-recruit" onClick={onCancelRecruit}>取消招募</button></> : <button type="button" className={`recruit-status ${configured ? "ready" : ""}`} disabled={!configured} onClick={complete}>{configured ? "确认招募" : "请先配置店铺与成员"}</button>}</aside>
    <main><nav>{["我的简介", "技能", "工作规划", "店铺与成员"].map((item) => <button className={tab === item ? "on" : ""} onClick={() => setTab(item)} type="button" key={item}>{item}</button>)}</nav>
      {tab === "我的简介" && <section className="system-copy"><h3>服务体验与风险诊断复盘</h3><p>针对待办退货退款工单进行服务体验与风险诊断复盘。</p><h3>信息收集梳理</h3><p>收集订单、客户聊天、退货相关资料，还原事件完整经过并关注最终处理结果。</p><h3>风险与问题识别</h3><p>排查服务环节存在的问题及潜在风险点，对关键风险做重点标记。</p><h3>资料整理归档</h3><p>整理沟通截图、聊天记录、订单备注与退款情况，完整保留原始信息。</p></section>}
      {tab === "技能" && <section className="system-skills">{["退款金额一致性校验", "售后时效自动计算", "退货入库差异分析", "聊天记录结构化解析"].map((skill) => <article key={skill}><div className="system-skill-mark" aria-hidden="true">✦</div><div><strong>{skill}</strong><p>自动处理关键业务信息，输出清晰、可追溯的判断结果。</p></div></article>)}</section>}
      {tab === "工作规划" && <section className="system-copy"><h3>自动化运营排班与决策触发规则</h3><p>该专家按预设的工作规划自动执行。系统专家的规则、技能与工作规划均为只读内容。</p><div className="skill-row">服务响应时段 <b>7×24小时 实时在线</b></div><div className="skill-row">自动升单阈值 <b>赔偿金额 &gt; ¥100.00</b></div></section>}
      {tab === "店铺与成员" && <section className="system-resources"><header><h3>关联店铺 <i>*</i></h3>{shops.length > 0 && <button type="button" onClick={() => openManager("shops")}>管理</button>}</header>{shops.length ? <><div className="resource-chip-grid">{shops.map((shop) => <div className="resource-row shop-row" key={shop}><ShopPlatformIcon shop={shop} />{shop}</div>)}</div><small className="resource-page">1　/　{shops.length}</small></> : <button className="resource-empty" type="button" onClick={() => openManager("shops")}>＋　配置关联店铺</button>}<header><h3>关联客服组与团队 <i>*</i></h3>{(departments.length > 0 || members.length > 0) && <button type="button" onClick={() => openManager("team")}>管理</button>}</header>{departments.length || members.length ? <><div className="resource-switch"><button type="button" className={resourceView === "部门" ? "on" : ""} onClick={() => setResourceView("部门")}>部门（{departments.length}）</button><button type="button" className={resourceView === "成员" ? "on" : ""} onClick={() => setResourceView("成员")}>成员（{members.length}）</button></div><div className="team-tags">{teamItems.length ? teamItems.map((item) => <i key={item}>{item}</i>) : <small>暂未选择{resourceView}</small>}</div></> : <button className="resource-empty" type="button" onClick={() => openManager("team")}>＋　配置关联客服组与成员</button>}</section>}
    </main>
    {manager && <div className="manager-layer"><section className="resource-manager"><button className="close" type="button" onClick={() => setManager(null)}>×</button><header className="manager-title"><h2>{manager === "shops" ? "关联店铺" : "关联客服组与成员"}</h2><p className="manager-help">选择需要由该专家处理的{manager === "shops" ? "店铺" : "客服团队与成员"}，确认后将保存到当前配置。</p></header>{manager === "team" && <div className="manager-tabs"><button type="button" className={teamView === "部门" ? "on" : ""} onClick={() => setTeamView("部门")}>部门</button><button type="button" className={teamView === "成员" ? "on" : ""} onClick={() => setTeamView("成员")}>成员</button></div>}<label className="manager-search"><img src={`${A}/search-expert.svg`} alt="" /><input placeholder={manager === "shops" ? "搜索店铺名称" : teamView === "部门" ? "搜索部门名称" : "搜索成员名称"} /></label><h3 className="manager-list-title">{manager === "shops" ? "店铺名称" : `${teamView}名称`}<span>{draft.length}/{options.length}</span></h3><div className="manager-scroll-area">{options.map((option) => <label className="manager-option" key={option}><input type="checkbox" checked={draft.includes(option)} onChange={() => toggle(option)} />{option}</label>)}</div><footer className="manager-footer"><button className="manager-confirm" type="button" disabled={manager === "shops" ? !draftShops.length : !draftDepartments.length && !draftMembers.length} onClick={saveSelection}>确认选择</button></footer></section></div>}
  </section></div>;
}

function FilterPanel({ risk, onRisk }: { risk: string; onRisk: (value: string) => void }) {
  const risks = [["high", "高风险", 2], ["medium", "中风险", 13], ["low", "低风险", 0], ["other", "其他", 132]] as const;
  const [expertType, setExpertType] = useState("服务履约");
  const [activeQueue, setActiveQueue] = useState("processing");
  const chooseQueue = (queue: string) => { setActiveQueue(queue); onRisk(queue === "processing" ? "全部" : queue); };
  return <aside className="filters"><h2>任务中心</h2><button type="button" className={`processing ${activeQueue === "processing" ? "on" : ""}`} onClick={() => chooseQueue("processing")}><img src={`${A}/ongoing-task.svg`} alt="" />进行中 <b>147</b></button><div className="risk-options">{risks.map(([key, label, number]) => <button type="button" onClick={() => chooseQueue(key)} className={activeQueue === key ? "on" : ""} key={key}><img src={`${A}/risk-${key}.svg`} alt="" />{label}<b>{number}</b></button>)}</div><div className="expert-type"><span>专家类型</span></div><div className="expert-tabs">{["服务履约", "自定义"].map((item) => <button type="button" className={expertType === item ? "on" : ""} onClick={() => setExpertType(item)} key={item}>{item}</button>)}</div><div className="expert-list">{experts.map(([image, title]) => <button type="button" key={title}><img src={`${A}/${image}`} alt="" />{title}</button>)}</div><button className="unmatched" type="button"><img src={`${A}/unmatched.svg`} alt="" />未匹配任务记录 <b>35</b></button></aside>;
}

function DetailPanel({ detailTab, onTab, selected }: { detailTab: string; onTab: (tab: string) => void; selected: typeof taskData[number] }) {
  const tabs = ["概览", "工单", "订单", "物流", "会话"];
  return <section className="detail"><header><nav>{tabs.map((tab) => <button type="button" className={detailTab === tab ? "on" : ""} onClick={() => onTab(tab)} key={tab}>{tab}</button>)}</nav><button type="button" className="detail-refresh"><img src={`${A}/refresh-detail.svg`} alt="刷新" /></button></header>{detailTab === "概览" ? <div className="detail-body"><h1>{selected.detail}</h1><article className="agent-card"><div className="agent-head"><strong>退款原因分析专家 / 羊毛党风控专家</strong><span className="agent-avatars"><img src={`${A}/expert-avatar-3.png`} alt="退款原因分析专家" /><img src={`${A}/expert-avatar-4.png`} alt="羊毛党风控专家" /></span><time>2026-07-15 18:06:22</time></div><p className="muted">您想鉴别图片真伪并查询图库，但我需要您提供图片URL才能执行。请上传或提供图片链接。</p><footer><button type="button">◷ 完结任务</button><button type="button">↻ 重新执行</button><button className="ai" type="button">AI鉴图</button></footer></article><div className="order-meta"><b>交易被平台关闭</b><span>退款完结</span><span className="user-meta"><img src={`${A}/customer.svg`} alt="" />1@#z1Fzk...</span><span>订单号: 6927941774...</span><span>任务创建时间: 2026-07-...</span><b>查看详情</b></div><div className="note">⚑ 2026-07-14 16:37:42 这是一段订单备注，这是一段订单备注</div><h3 className="task-detail-heading"><img src={`${A}/task-detail.svg`} alt="" />任务详情</h3><TaskDetail name="测试Agent" /><TaskDetail name="波比退款处理Agent" /></div> : <div className="empty-detail"><img src={`${A}/task-detail.svg`} alt="" /><strong>{detailTab}信息</strong><p>当前任务的{detailTab}内容已准备就绪。</p></div>}</section>;
}

function TaskDetail({ name }: { name: string }) { return <button type="button" className="sub-task"><b>{name}</b><span>更新时间: 2026-07-28 10:02:38</span><em>关联工单 <img src={`${A}/chevron.svg`} alt="" /></em></button>; }
