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

export default function Home() {
  const [designId, setDesignId] = useState("1404-1493");
  const [expertMode, setExpertMode] = useState(false);
  const [expertSection, setExpertSection] = useState("experts");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDesignId(params.get("design") || "1404-1493");
    setExpertMode(params.get("expert") === "1");
    setExpertSection(params.get("section") === "skills" ? "skills" : "experts");
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
      <a className="experts-button" href="/?design=1404-1493&expert=1"><img src={`${A}/benben.png`} alt="" />犇犇专家</a><i />
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
      <a className="experts-button" href="/?design=1404-1493&expert=1"><img src={`${A}/benben.png`} alt="" />犇犇专家</a><i />
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
] as const;

type Expert = (typeof expertCatalog)[number];
type RecruitmentConfig = { shops: string[]; departments: string[]; members: string[] };

function ExpertHub({ onBack, section }: { onBack: () => void; section: string }) {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [selected, setSelected] = useState<Expert | null>(null);
  const [customExperts, setCustomExperts] = useState<Expert[]>([]);
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
  const visibleExperts = allExperts.filter((expert) => (filter === "全部" || (filter === "自定义" && isCustom(expert)) || (filter === "系统专家" && !isCustom(expert))) && `${expert[1]}${expert[3]}`.includes(query.trim()));
  if (workspaceExpert) return <CustomExpertWorkspace expert={workspaceExpert} onBack={() => setWorkspaceExpert(null)} />;
  return <main className="expert-hub"><PlatformRail /><header className="expert-hub-head"><button type="button" onClick={onBack}>‹ 返回</button><a className={section === "experts" ? "on" : ""} href="/?design=1404-1493&expert=1">专家</a><a className={section === "skills" ? "on" : ""} href="/?design=1404-1493&expert=1&section=skills">技能</a></header>{section === "skills" ? <SkillsCenter /> : <section className="expert-hub-body"><div className="expert-toolbar"><nav>{["全部", "系统专家", "自定义"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} type="button" key={item}>{item}</button>)}</nav><div className="expert-view-tools"><button aria-label="列表视图" className={view === "list" ? "active" : ""} onClick={() => setView("list")} type="button"><img src={`${A}/view-list.svg`} alt="" /></button><button aria-label="卡片视图" className={view === "cards" ? "active" : ""} onClick={() => setView("cards")} type="button"><img src={`${A}/view-cards.svg`} alt="" /></button><label><img src={`${A}/search-expert.svg`} alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索专家" /></label><button className="new-expert" type="button" onClick={() => setCreateOpen(true)}>＋ 创建犇犇专家</button></div></div><div className={`expert-grid ${view}`}>{visibleExperts.map((expert) => { const custom = isCustom(expert); const recruited = isRecruited(expert); const openSystem = () => { setTab("我的简介"); setSelected(expert); }; return <article className={`expert-tile ${recruited ? "recruited" : "unrecruited"} ${custom ? "custom-expert" : "system-expert"}`} onClick={custom ? () => setWorkspaceExpert(expert) : openSystem} onKeyDown={(event) => { if (event.key === "Enter") custom ? setWorkspaceExpert(expert) : openSystem(); }} role="button" tabIndex={0} key={expert[0]}><header><img src={`${A}/${expert[2]}`} alt="" /><div><strong>{expert[1]}</strong><em>{custom ? "自定义" : "系统专家"}</em></div>{recruited ? <span>✓ 已招募</span> : <span className="recruit-label"><i>未招募</i><b>去招募　→</b></span>}</header><p>{expert[3]}</p>{custom && <span className="open-config">打开配置　→</span>}</article>; })}</div>{filter === "自定义" && !customExperts.length && <p className="custom-empty">还没有自定义专家，点击右上角创建一个吧。</p>}</section>}{createOpen && <CreateExpertModal onClose={() => setCreateOpen(false)} onContinue={(expert) => { setCustomExperts((all) => all.some(([id]) => id === expert[0]) ? all : [...all, expert]); setFilter("自定义"); setCreateOpen(false); setWorkspaceExpert(expert); }} />}{selected && <RecruitModal expert={selected} tab={tab} setTab={setTab} recruited={recruitedIds.includes(selected[0])} config={recruitConfigs[selected[0]]} onConfigChange={(config) => setRecruitConfigs((all) => ({ ...all, [selected[0]]: config }))} onClose={() => setSelected(null)} onRecruit={() => { setRecruitedIds((ids) => ids.includes(selected[0]) ? ids : [...ids, selected[0]]); setSelected(null); }} onCancelRecruit={() => { setRecruitedIds((ids) => ids.filter((id) => id !== selected[0])); setSelected(null); }} />}</main>;
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
  return <main className="custom-workspace"><PlatformRail /><header className="workspace-back"><button type="button" onClick={onBack}>← 返回犇犇专家</button></header><div className="workspace-title"><h1>Hi，把任务交给我吧</h1><b>BEN<br />EXPERT</b></div><section className="workspace-layout"><aside className="workspace-profile"><header><img src={`${A}/${expert[2]}`} alt="" /><div className="editable-profile">{editingName ? <input value={name} onChange={(event) => setName(event.target.value)} onBlur={() => setEditingName(false)} autoFocus /> : <h2 onClick={() => setEditingName(true)}>{name} <span>⌑</span></h2>}<time>更新时间：2026-08-20 15:28:00</time></div></header>{editingDescription ? <div className="description-edit-wrap"><textarea className="editable-description" value={description} onChange={(event) => setDescription(event.target.value)} onBlur={() => setEditingDescription(false)} autoFocus maxLength={200} /><small>{description.length} / 200</small></div> : <p className="editable-description" onClick={() => setEditingDescription(true)}>{description || "请输入工作内容描述"}<span>⌑ 点击修改</span><small>{description.length} / 200</small></p>}<nav>{["店铺", "客服组", "技能", "工作表"].map((item) => <button className={resourceTab === item ? "on" : ""} onClick={() => setResourceTab(item)} type="button" key={item}>{item}</button>)}</nav><WorkspaceResources tab={resourceTab} shops={shops} /><section className="context-panel"><header><b>上下文</b><span>自定义上下文</span></header><nav>{["消费者标签", "订单", "售后单", "OMS", "aaa测试", "补发商品…", "抖音-售…", "会话智能…"].map((item, index) => <button className={index === 0 ? "on" : ""} type="button" key={item}>{item}</button>)}</nav><div className="context-box"><strong>消费者标签　⌄</strong><p>• 新客　　　　• aku测试标签名…</p><p>• 老客　　　　• 高频退款</p><p>• 风险用户　　• 售后偏好</p></div></section></aside><section className="workspace-editor"><header><nav>{["工作规划", "流程预览", "工作测试"].map((item) => <button className={workTab === item ? "on" : ""} onClick={() => setWorkTab(item)} type="button" key={item}>{item}</button>)}</nav><div><button type="button">查看历史版本</button><button type="button">保存草稿</button><button className="publish" type="button" onClick={() => { setPublished(true); onBack(); }}>{published ? "✓ 已发布" : "发布"}</button></div></header>{workTab === "工作规划" ? <div className="plan-editor"><textarea value={plan} onChange={(event) => setPlan(event.target.value)} /><small>{plan.length}/5000</small></div> : workTab === "流程预览" ? <div className="work-placeholder"><strong>工作流程预览</strong><p>接收任务 → 获取订单与上下文 → {name}分析 → 输出处理建议</p></div> : <section className="test-panel"><aside><h3>调试运行</h3><input value={orderNo} onChange={(event) => setOrderNo(event.target.value)} placeholder="输入订单号" /><button className="run-test" type="button" onClick={() => setTestedOrder(orderNo || "69251471071587401")}>▷　运行</button><hr /><h3>历史调试</h3><label>⌕　<input placeholder="搜索订单号" /></label>{[testedOrder, "69251471071587401", "69251471071587401", "69251471071587401", "69251471071587401"].map((item, index) => <button className={index === 0 ? "test-history on" : "test-history"} type="button" onClick={() => setTestedOrder(item)} key={`${item}-${index}`}><b>{item}</b><small>2026-05-07 10:12:46</small></button>)}</aside><main><header><h3>推理结果 <small>最近运行：2026-05-07 10:12:46</small></h3></header><p className="test-note">ⓘ 配置事件及运行仅用作推理结果展示，不触发任何真实的外部动作～</p><article className="test-result"><header><b>抖音退货退款-入库异常商品核实</b><time>2026-05-07 10:12:46</time><button type="button">▷ 过程回放</button></header><h4>工单创建</h4><p>① 识别自动退款成功状态</p><p>② 任务直接归档</p><div>售后单（147471644942854774）当前状态为【自动】退款成功，退款流程已完结。根据审核规则，已完成状态的售后单无需进行仓库异常核对及后续审核操作，任务已自动结束归档。</div></article></main></section>}</section></section></main>;
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

const skills = [
  ["更新工单状态", "本接口用于更新工作表中任务状态组件"], ["拒绝原因码查询", "退货退款拒绝时，需要先查询这个接口获取拒绝原因 code"], ["退货退款-人工已处理", "当客服或系统需要对售后工单做出处理决策时调用—用户申请退款。"], ["退货退款-同意退款", "当客服或系统需要对售后工单做出处理决策时调用—用户申请退款。"], ["辅助回填-会员基本信息", "辅助回填会员基本信息。"], ["退货退款-拒绝退款", "当客服或系统需要对售后工单做出处理决策时调用—用户申请退款。"], ["通用-订单备注", "本接口用于在电商平台上为特定订单添加或更新备注信息和状态策略。"], ["退货退款操作", "当客服或系统需要对售后工单做出处理决策时调用，常见场景包括人工处理。"],
] as const;

function SkillsCenter() {
  const [view, setView] = useState<"list" | "cards">("list");
  const [query, setQuery] = useState("");
  const filtered = skills.filter(([name, description]) => `${name}${description}`.includes(query));
  return <section className="skill-center"><div className="skill-toolbar"><h1>技能中心</h1><div className="skill-view-tools"><button aria-label="列表视图" className={view === "list" ? "active" : ""} onClick={() => setView("list")} type="button"><img src={`${A}/view-list.svg`} alt="" /></button><button aria-label="卡片视图" className={view === "cards" ? "active" : ""} onClick={() => setView("cards")} type="button"><img src={`${A}/view-cards.svg`} alt="" /></button><label><img src={`${A}/search-expert.svg`} alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="请输入技能名称" /></label><button className="query" type="button">查询</button><button className="reset" type="button" onClick={() => setQuery("")}>重置</button><button className="add-skill" type="button">＋ 添加关联技能</button></div></div><div className={`skill-grid ${view}`}>{[...filtered, ...filtered].slice(0, view === "list" ? filtered.length : 12).map(([name, description], index) => <article key={`${name}-${index}`}><div className="skill-mark">✦</div><div><strong>{name}</strong><p>{description}</p></div><button aria-label={`编辑 ${name}`} type="button"><img src={`${A}/edit.svg`} alt="" /></button></article>)}</div></section>;
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
    <aside><img src={`${A}/${expert[2]}`} alt="" /><h2>{expert[1]}专家</h2><small>v20260817–001</small><p>犇犇·履约Agent「{expert[1]}」专家，是面向电商售后场景的全流程智能履约引擎。</p>{recruited ? <><b className="recruited-badge">✓ 已招募</b><button type="button" className="cancel-recruit" onClick={onCancelRecruit}>取消招募</button></> : <button type="button" className={`recruit-status ${configured ? "ready" : ""}`} disabled={!configured} onClick={complete}>{configured ? "确认招募" : "请先配置店铺与成员"}</button>}</aside>
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
