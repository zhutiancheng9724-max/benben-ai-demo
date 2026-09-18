"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

const A = "/figma-task";

const nav = [
  ["home.svg", "首页"], ["benben.png", "犇犇"], ["consumer.svg", "消费者"],
  ["miniapp.svg", "小程序"], ["voc.svg", "VOC"], ["more.svg", "更多"],
  ["apps.svg", "应用"], ["search.svg", "搜索"], ["notifications.svg", "通知"],
] as const;

type TaskRisk = "high" | "medium" | "low" | "other";
type TaskMode = "人工" | "犇犇";

const taskData: Array<{
  title: string; time: string; order: string; risk: TaskRisk; mode: TaskMode; detail: string; summary: string; store: string;
  expert: string; status: string; pending: boolean; criterion: string; confidence: string; evidence: string[]; conclusion: string;
}> = [
  { title: "包裹破损图片识别", time: "08/21", order: "6955163168553571440", risk: "high", mode: "人工", detail: "包裹破损图片识别", summary: "图片识别完成，待人工确认退款需求", store: "班牛数码专营店", expert: "图片识别专家", status: "待确认", pending: true, criterion: "识别包裹图片，判断是否符合破损退款需求", confidence: "92%", evidence: ["外包装存在明显挤压变形和破损，箱角处有撕裂痕迹。", "纸箱结构受损，可能导致内部商品受损。", "符合“外包装破损/二次封包”等破损类售后退款场景。"], conclusion: "符合破损退款需求" },
  { title: "买家反馈少件，核对出库称重", time: "14:18", order: "6921739428437523559", risk: "medium", mode: "人工", detail: "买家反馈少件，核对出库称重", summary: "包裹重量存在差异，需核对打包记录", store: "班牛数码专营店", expert: "出库核验专家", status: "待处理", pending: true, criterion: "核对商品出库称重记录，确认是否存在少件", confidence: "86%", evidence: ["订单出库重量与商品标准重量存在偏差。", "打包视频记录待补充核验。", "建议优先核对仓内称重与面单信息。"], conclusion: "需要进一步核对出库记录" },
  { title: "物流滞留超过 48 小时，发起催派", time: "13:56", order: "4491028394810293847", risk: "low", mode: "犇犇", detail: "物流滞留催派", summary: "已联系承运商，等待最新物流反馈", store: "班牛官方旗舰店", expert: "物流履约专家", status: "处理中", pending: true, criterion: "识别物流滞留节点并向承运商发起催派", confidence: "98%", evidence: ["包裹已在中转站停留超过 48 小时。", "承运商接口已返回催派受理结果。", "系统将持续跟踪下一条物流节点。"], conclusion: "已发起催派，等待物流更新" },
  { title: "发送商品售后说明书", time: "13:42", order: "7351169018351009822", risk: "other", mode: "犇犇", detail: "商品售后说明书发送", summary: "已匹配说明书，等待确认发送", store: "班牛官方旗舰店", expert: "售后服务专家", status: "待确认", pending: true, criterion: "匹配对应商品的售后说明书并推送给买家", confidence: "100%", evidence: ["已根据商品编码匹配售后说明书。", "买家会话渠道可正常发送附件。", "等待客服确认后自动发送。"], conclusion: "说明书已准备完成" },
  { title: "退款争议处理，核验退货凭证", time: "13:26", order: "8829103948192039182", risk: "high", mode: "人工", detail: "退款争议处理", summary: "退货信息与原订单不符，待复核", store: "天马数码专营店", expert: "退款审核专家", status: "待处理", pending: true, criterion: "核验退货凭证与原订单信息的一致性", confidence: "78%", evidence: ["退货单号与原订单关联信息不完整。", "商品照片需人工复核。", "建议联系买家补充凭证。"], conclusion: "存在争议，需人工复核" },
  { title: "退货退款凭证工单创建", time: "12:48", order: "3315273205661033387", risk: "high", mode: "人工", detail: "凭证工单创建", summary: "已生成物流凭证，可查看并下载", store: "班牛数码专营店", expert: "凭证创建专家", status: "已完成", pending: false, criterion: "生成订单物流凭证并创建关联工单", confidence: "100%", evidence: ["物流节点与订单信息已同步。", "凭证文件已脱敏处理。", "关联工单创建成功。"], conclusion: "成功创建凭证工单" },
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
  const [chatSettings, setChatSettings] = useState(false);
  const [settingsMode, setSettingsMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDesignId(params.get("design") || "1404-1493");
    setExpertMode(params.get("expert") === "1");
    setChatSettings(params.get("chatView") === "settings");
    setSettingsMode(params.get("settings") === "1");
    const section = params.get("section");
    setExpertSection(section === "skills" ? "skills" : section === "connectors" ? "connectors" : "experts");
  }, []);

  const expertParams = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const previousExpertSource = typeof window === "undefined" ? null : window.sessionStorage.getItem("benben-expert-source");
  const expertSource = expertParams.get("from") === "chat" || (expertParams.get("from") !== "task" && previousExpertSource === "chat") ? "chat" : "task";
  if (expertMode) return <ExpertHub section={expertSection} onBack={() => {
    const fallback = expertSource === "chat" ? "/?design=1404-1392" : "/?design=1404-1493";
    const saved = window.sessionStorage.getItem(`benben-expert-return-${expertSource}`);
    window.location.assign(saved?.startsWith("/") ? saved : fallback);
  }} />;
  if (settingsMode) {
    const source = expertParams.get("from") === "chat" ? "chat" : "task";
    return <SettingsCenter onBack={() => window.location.assign(source === "chat" ? "/?design=1404-1392" : "/?design=1404-1493")} />;
  }
  const chat = ["1404-1392", "1414-832", "1414-1072", "1423-474"].includes(designId);
  const automation = expertParams.get("automation") === "1";
  const menu = ["1404-1881", "1414-28", "1414-430", "1414-832", "1414-952", "1414-1072"].includes(designId);
  if (chat) return <ChatHome menuOpen={menu} initialSettings={chatSettings} initialAutomation={automation} />;
  return <TaskHome menuOpen={menu} />;
}

function TaskHome({ menuOpen }: { menuOpen: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(menuOpen);
  const [activeTask, setActiveTask] = useState(0);
  const [detailTab, setDetailTab] = useState("概览");
  const [taskScope, setTaskScope] = useState<"pending" | "all">("pending");
  const [risk, setRisk] = useState<"all" | TaskRisk>("all");
  const [search, setSearch] = useState("");
  const [taskSearchOpen, setTaskSearchOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const defaultAdvanced = { mode: "全部", store: "全部店铺", status: "全部状态" } as const;
  const [advanced, setAdvanced] = useState<{ mode: "全部" | TaskMode; store: string; status: string }>(defaultAdvanced);
  const [draftAdvanced, setDraftAdvanced] = useState(advanced);
  const shownTasks = useMemo(() => taskData.filter((task) => {
    const searchMatch = !search.trim() || [task.title, task.order, task.store, task.expert].some((value) => value.includes(search.trim()));
    const scopeMatch = taskScope === "all" || task.pending;
    const riskMatch = risk === "all" || task.risk === risk;
    const modeMatch = advanced.mode === "全部" || task.mode === advanced.mode;
    const storeMatch = advanced.store === "全部店铺" || task.store === advanced.store;
    const statusMatch = advanced.status === "全部状态" || task.status === advanced.status;
    return searchMatch && scopeMatch && riskMatch && modeMatch && storeMatch && statusMatch;
  }), [advanced, risk, search, taskScope]);
  const selected = taskData[activeTask];
  const riskCounts: Record<TaskRisk, number> = { high: 12, medium: 24, low: 56, other: 36 };

  const resetAdvanced = () => setDraftAdvanced(defaultAdvanced);
  const applyAdvanced = () => { setAdvanced(draftAdvanced); setAdvancedOpen(false); };
  const hasAdvancedFilter = advanced.mode !== "全部" || advanced.store !== "全部店铺" || advanced.status !== "全部状态";
  const openTaskSearch = () => { setManualOpen(false); setDraftAdvanced(advanced); setTaskSearchOpen(true); };
  const announce = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2200); };

  useEffect(() => {
    const closeFloatingPanels = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (isMenuOpen && !target.closest(".task-v2-product-wrap")) setIsMenuOpen(false);
      if (taskSearchOpen && !target.closest(".task-v2-search-modal")) setTaskSearchOpen(false);
      if (manualOpen && !target.closest(".task-v2-trigger-wrap")) setManualOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false); setTaskSearchOpen(false); setAdvancedOpen(false); setManualOpen(false);
    };
    document.addEventListener("mousedown", closeFloatingPanels);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeFloatingPanels); document.removeEventListener("keydown", closeOnEscape); };
  }, [advancedOpen, isMenuOpen, manualOpen]);

  useEffect(() => {
    if (shownTasks.some((task) => task === selected)) return;
    const firstVisible = shownTasks[0];
    if (firstVisible) setActiveTask(taskData.indexOf(firstVisible));
  }, [selected, shownTasks]);

  return <main className="task-app task-home-v2">
    <aside className="side-rail">
      <img className="brand" src={`${A}/brand-mark.svg`} alt="犇犇" />
      <RailButtons />
      <img className="user-avatar" src={`${A}/avatar.svg`} alt="用户头像" />
    </aside>
    <header className="task-v2-topbar">
      <div className="task-v2-product-wrap"><button className={`task-v2-product ${isMenuOpen ? "open" : ""}`} type="button" onClick={() => setIsMenuOpen((open) => !open)}>犇犇Task <img src={`${A}/chevron.svg`} alt="" /></button>{isMenuOpen && <ProductMenu current="task" />}</div>
      <div className="task-v2-search-wrap">
        <label className="task-v2-search"><img src={`${A}/search-top.svg`} alt="" /><input readOnly value={search} onClick={openTaskSearch} onFocus={openTaskSearch} placeholder="搜索" /></label>
      </div>
      <div className="task-v2-trigger-wrap"><button type="button" className="task-v2-manual-trigger" onClick={() => { setAdvancedOpen(false); setManualOpen((open) => !open); }}><img src={`${A}/smart-trigger.svg`} alt="" />智能触发</button>{manualOpen && <div className="task-v2-trigger-popover"><strong>智能触发任务</strong><p>选择专家后可立即创建一条待处理任务。</p><button type="button" onClick={() => { setManualOpen(false); announce("已创建一条待处理任务"); }}>创建任务</button></div>}</div>
      <a className="task-v2-management" href="/?design=1404-1493&expert=1&from=task" onClick={() => { window.sessionStorage.setItem("benben-expert-return-task", `${window.location.pathname}${window.location.search}`); window.sessionStorage.setItem("benben-expert-source", "task"); }}><span>✧</span>专家·技能·连接器</a>
      <button className="task-v2-settings" type="button" onClick={() => { window.sessionStorage.setItem("benben-settings-return-task", `${window.location.pathname}${window.location.search}`); window.location.assign("/?design=1404-1493&settings=1&from=task"); }}><img src={`${A}/settings-16.svg`} alt="" />设置</button>
    </header>
    <section className="task-v2-workspace">
      <aside className="task-v2-list">
        <header className="task-v2-list-header"><div className="task-v2-scope"><strong>执行任务</strong><span>128</span><nav><button type="button" className={taskScope === "pending" ? "on" : ""} onClick={() => setTaskScope("pending")}>待处理</button><button type="button" className={taskScope === "all" ? "on" : ""} onClick={() => setTaskScope("all")}>全部任务</button></nav></div><nav className="task-v2-risk-filters"><button type="button" className={risk === "all" ? "on" : ""} onClick={() => setRisk("all")}>全部</button>{(["high", "medium", "low", "other"] as TaskRisk[]).map((item) => <button key={item} type="button" className={risk === item ? "on" : ""} onClick={() => setRisk(item)}><i className={item} />{({ high: "高风险", medium: "中风险", low: "低风险", other: "其他" } as Record<TaskRisk, string>)[item]} <span>{riskCounts[item]}</span></button>)}</nav></header>
        <div className="task-v2-task-scroll">{shownTasks.length ? shownTasks.map((task) => { const index = taskData.indexOf(task); return <button type="button" onClick={() => { setActiveTask(index); setDetailTab("概览"); }} className={`task-v2-row ${activeTask === index ? "active" : ""}`} key={task.order}>
          <span className="task-v2-row-top"><i className={task.risk} /> <em>{({ high: "高风险", medium: "中风险", low: "低风险", other: "其他" } as Record<TaskRisk, string>)[task.risk]}</em><strong>{task.title}</strong><time>{task.time}</time></span><p>{task.summary}</p><span className="task-v2-store"><span>♜</span>{task.store}<b className={task.mode === "人工" ? "manual" : "benben"}>{task.mode}</b></span><small>订单号 {task.order}<span className="task-v2-copy" role="button" tabIndex={0} aria-label="复制订单号" onClick={(event) => { event.stopPropagation(); announce("订单号已复制"); }} onKeyDown={(event) => { if (event.key === "Enter") announce("订单号已复制"); }}><img src={`${A}/copy.svg`} alt="" /></span></small>
        </button>; }) : <div className="task-v2-empty"><strong>暂无匹配任务</strong><span>试试调整筛选条件</span></div>}</div>
        <footer className="task-v2-list-footer"><button type="button" onClick={() => announce("已打开未匹配任务记录")}><span>♧</span><em>未匹配任务记录</em><b>46</b><i>›</i></button><div className="task-v2-list-divider" /><button className="task-v2-list-entry" type="button"><span>⌁</span><em>评估中心</em></button><button className="task-v2-list-entry" type="button"><span>◷</span><em>效能中心</em></button></footer>
      </aside>
      <TaskDetailPanel detailTab={detailTab} onTab={setDetailTab} selected={selected} onNotice={announce} />
    </section>
    {taskSearchOpen && <div className="chat-v3-modal-layer chat-v3-search-layer" onMouseDown={() => setTaskSearchOpen(false)}><section className="chat-v3-search-modal task-v2-search-modal" role="dialog" aria-label="搜索任务" onMouseDown={(event) => event.stopPropagation()}>
      <header><img src={`${A}/search-top.svg`} alt="" /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索任务、订单号或买家 ID" /><button type="button" onClick={() => setTaskSearchOpen(false)} aria-label="关闭">×</button></header>
      <div className="task-v2-search-modal-body">
        <div className="task-v2-search-modal-toolbar"><strong>任务搜索</strong><button type="button" className={advancedOpen || hasAdvancedFilter ? "on" : ""} onClick={() => { setDraftAdvanced(advanced); setAdvancedOpen((open) => !open); }}>高级筛选{hasAdvancedFilter && <i />}</button></div>
        {advancedOpen && <div className="task-v2-search-filters">
          <label>处理方式<select value={draftAdvanced.mode} onChange={(event) => setDraftAdvanced({ ...draftAdvanced, mode: event.target.value as "全部" | TaskMode })}><option>全部</option><option>人工</option><option>犇犇</option></select></label>
          <label>关联店铺<select value={draftAdvanced.store} onChange={(event) => setDraftAdvanced({ ...draftAdvanced, store: event.target.value })}><option>全部店铺</option><option>班牛数码专营店</option><option>班牛官方旗舰店</option><option>天马数码专营店</option></select></label>
          <label>任务状态<select value={draftAdvanced.status} onChange={(event) => setDraftAdvanced({ ...draftAdvanced, status: event.target.value })}><option>全部状态</option><option>待确认</option><option>待处理</option><option>处理中</option><option>已完成</option></select></label>
          <footer><button type="button" onClick={resetAdvanced}>重置</button><button type="button" onClick={applyAdvanced}>应用筛选</button></footer>
        </div>}
        {search.trim() ? <div className="task-v2-search-results">{shownTasks.length ? shownTasks.map((task) => <button type="button" key={task.order} onClick={() => { setActiveTask(taskData.indexOf(task)); setTaskSearchOpen(false); }}><span className={task.risk}>{({ high: "高风险", medium: "中风险", low: "低风险", other: "其他" } as Record<TaskRisk, string>)[task.risk]}</span><strong>{task.title}</strong><time>{task.order}</time><p>{task.summary}</p></button>) : <p>未找到匹配任务</p>}</div> : <p className="task-v2-search-empty">输入任务标题、订单号或买家 ID</p>}
      </div>
    </section></div>}
    {notice && <div className="task-v2-toast" role="status">{notice}</div>}
  </main>;
}

type SettingsView = "chatSettings" | "intents" | "shopNavigation" | "dataManagement" | "dataAnalysis" | "orderConfig" | "tuning" | "sessions" | "shopManagement";

const settingPageMeta: Record<SettingsView, { title: string; subtitle: string }> = {
  chatSettings: { title: "犇犇Chat 设置", subtitle: "管理 Chat 的外观偏好与 IM 绑定。" },
  intents: { title: "会话意图分发", subtitle: "CHAT INTENT DISTRIBUTION" },
  shopNavigation: { title: "店铺AI导航配置", subtitle: "SHOP AI NAVIGATION CONFIGURATION" },
  dataManagement: { title: "数据管理", subtitle: "TASK DATA MANAGEMENT" },
  dataAnalysis: { title: "数据分析", subtitle: "TASK DATA ANALYSIS" },
  orderConfig: { title: "建单配置", subtitle: "TASK CREATION CONFIGURATION" },
  tuning: { title: "调优中心", subtitle: "TASK OPTIMIZATION CENTER" },
  sessions: { title: "会话记录", subtitle: "MASTER-DETAIL SESSION EXPLORER" },
  shopManagement: { title: "店铺管理", subtitle: "SHOP MANAGEMENT" },
};

function SettingsCenter({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState<SettingsView>("chatSettings");
  const [notice, setNotice] = useState("");
  const announce = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2200); };
  const groups: Array<{ name: string; icon: string; pages: Array<[SettingsView, string]> }> = [
    { name: "犇犇AI导航", icon: "◉", pages: [["intents", "会话意图分发"], ["shopNavigation", "店铺导航配置"]] },
    { name: "犇犇AI建单", icon: "▦", pages: [["dataManagement", "数据管理"], ["dataAnalysis", "数据分析"], ["orderConfig", "建单配置"], ["tuning", "调优中心"]] },
    { name: "会话管理", icon: "◔", pages: [["sessions", "会话记录"], ["shopManagement", "店铺管理"]] },
  ];
  const meta = settingPageMeta[page];

  return <main className="settings-center">
    <PlatformRail />
    <div className="settings-center-surface">
      <header className="settings-center-topbar">
        <button className="settings-back" type="button" onClick={onBack}>← 返回</button>
        <strong>设置</strong>
        <div className="settings-center-topbar-spacer" />
      </header>
      <div className="settings-center-body">
        <aside className="settings-center-nav">
          <nav>
            <button className={`settings-chat-entry ${page === "chatSettings" ? "on" : ""}`} type="button" onClick={() => setPage("chatSettings")}>犇犇Chat 设置</button>
            {groups.map((group) => <section key={group.name}><header><span>{group.icon}</span>{group.name}<i>⌃</i></header>{group.pages.map(([id, label]) => <button className={page === id ? "on" : ""} type="button" onClick={() => setPage(id)} key={id}>{label}</button>)}</section>)}
          </nav>
        </aside>
        <section className="settings-center-workspace">
          {page === "chatSettings" ? <ChatSettings announce={announce} /> : <><header className="settings-page-heading"><div><h1>{meta.title}</h1><p>{meta.subtitle}</p></div></header><SettingsPage view={page} announce={announce} /></>}
        </section>
      </div>
    </div>
    {notice && <p className="settings-toast" role="status">✓ {notice}</p>}
  </main>;
}

function SettingsPage({ view, announce }: { view: SettingsView; announce: (message: string) => void }) {
  if (view === "chatSettings") return <ChatSettings announce={announce} />;
  if (view === "intents") return <IntentDistribution announce={announce} />;
  if (view === "shopNavigation") return <ShopNavigation announce={announce} />;
  if (view === "dataManagement") return <TaskDataManagement announce={announce} />;
  if (view === "dataAnalysis") return <DataAnalysis />;
  if (view === "orderConfig") return <OrderConfiguration announce={announce} />;
  if (view === "tuning") return <TuningCenter announce={announce} />;
  if (view === "sessions") return <SessionManagement announce={announce} />;
  return <ShopManagement announce={announce} />;
}

function ChatSettings({ announce }: { announce: (message: string) => void }) {
  const [theme, setTheme] = useState("浅色");
  const [binding, setBinding] = useState("新建绑定");
  const [channel, setChannel] = useState("飞书");
  const themes = [
    ["浅色", "theme-light"], ["深色", "theme-dark"], ["玻璃", "theme-glass"], ["清透", "theme-clear"],
  ] as const;
  return <article className="chat-settings-card">
    <h1>犇犇Chat 设置</h1>
    <p className="chat-settings-intro">管理 Chat 的外观偏好与 IM 绑定。</p>
    <section className="chat-settings-section">
      <h2>主题切换</h2>
      <div className="chat-settings-themes">{themes.map(([label, tone]) => <button type="button" className={`chat-settings-theme ${theme === label ? "on" : ""}`} key={label} onClick={() => { setTheme(label); announce(`已切换为${label}主题`); }}><span className={`chat-settings-theme-preview ${tone}`}><i /><i /></span><strong>{label}</strong>{theme === label && <b>✓</b>}</button>)}</div>
    </section>
    <section className="chat-settings-section chat-settings-binding">
      <h2>IM 绑定</h2>
      <p className="chat-settings-label">已有绑定</p>
      <select value={binding} onChange={(event) => setBinding(event.target.value)}><option>新建绑定</option><option>售后工作群</option><option>犇犇客服群</option></select>
      <div className="chat-settings-channel-tabs">{["飞书", "钉钉"].map((item) => <button type="button" className={channel === item ? "on" : ""} key={item} onClick={() => setChannel(item)}>{item}</button>)}</div>
      <div className="chat-settings-fields"><label>App ID<input placeholder="请输入 App ID" /></label><label>App Secret<input type="password" placeholder="请输入 App Secret" /></label></div>
      <label className="chat-settings-wide-field">备注<input placeholder="为这条绑定添加说明（选填）" /></label>
      <label className="chat-settings-wide-field">会话标题<input placeholder="例如：售后经营日报" /></label>
      <button type="button" className="chat-settings-submit" onClick={() => announce(`已生成${channel}绑定`)}>生成绑定</button>
    </section>
  </article>;
}

function IntentDistribution({ announce }: { announce: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [intents, setIntents] = useState([{ name: "少发", description: "消费者反馈收到的包裹中商品数量不足，缺少部分商品。", cards: 0 }, { name: "改地址", description: "买家需要改地址时触发该意图。", cards: 1 }, { name: "售后咨询", description: "消费者咨询退换货、退款进度或售后处理规则。", cards: 1 }]);
  const visible = intents.filter((item) => `${item.name}${item.description}`.includes(query));
  return <><div className="settings-toolbar"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索意图名称" /></label><button className="settings-primary" type="button" onClick={() => { setIntents((items) => [...items, { name: `新意图 ${items.length + 1}`, description: "请在详情配置中补充触发条件与智能卡片。", cards: 0 }]); announce("已新增意图"); }}>＋ 新增意图</button></div><div className="intent-grid">{visible.map((intent) => <article key={intent.name}><header><span>◇</span><div><strong>{intent.name}</strong><em>消费者意图</em><p>{intent.description}</p></div><button type="button" aria-label={`编辑${intent.name}`} onClick={() => announce(`正在配置「${intent.name}」`)}>⌑</button><button type="button" aria-label={`删除${intent.name}`} onClick={() => { setIntents((items) => items.filter((item) => item.name !== intent.name)); announce("意图已删除"); }}>⌫</button></header><footer><span>智能卡片: {intent.cards} 个</span><button type="button" onClick={() => announce(`已打开「${intent.name}」详情配置`)}>详情配置</button></footer></article>)}</div></>;
}

function ShopNavigation({ announce }: { announce: (message: string) => void }) {
  const [stores, setStores] = useState([{ name: "【淘宝】tb482158388801", id: "2217815690081", enabled: true, updated: "2026-07-29 14:17:10" }, { name: "【抖音】班牛小小店", id: "542710737", enabled: false, updated: "2026-08-17 14:02:03" }]);
  return <><div className="settings-toolbar"><label><span>⌕</span><input placeholder="搜索店铺名称" /></label></div><div className="setting-table"><header><span>店铺名称</span><span>AI导航状态</span><span>订阅场景</span><span>最后更新</span><span>操作</span></header>{stores.map((store, index) => <article key={store.id}><div><b>◒</b><strong>{store.name}</strong><small>ID: {store.id}</small></div><button className={`setting-switch ${store.enabled ? "on" : ""}`} type="button" aria-pressed={store.enabled} onClick={() => setStores((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: !item.enabled } : item))}><i /></button><span>0 个已订阅</span><time>{store.updated}</time><button className="settings-link" type="button" onClick={() => announce(`已打开「${store.name}」导航配置`)}>配置</button></article>)}</div></>;
}

const taskRows = [{ id: "2331", buyer: "陈晓", shop: "班牛小小店", order: "AI建单测试", status: "分析完成", duration: "6s" }, { id: "2330", buyer: "多来米", shop: "班牛小小店", order: "AI建单测试", status: "分析完成", duration: "6s" }, { id: "2315", buyer: "赤丸", shop: "班牛小小店", order: "cw-AI-训练", status: "异常", duration: "-" }];

function TaskDataManagement({ announce }: { announce: (message: string) => void }) {
  const [keyword, setKeyword] = useState("");
  const filtered = taskRows.filter((row) => `${row.id}${row.buyer}${row.order}`.includes(keyword));
  return <><div className="setting-stat-row"><strong>今日建单量 <b>0</b></strong><strong>平均分析时长 <b>0s</b></strong></div><div className="setting-filter-grid"><label>平台<select><option>请选择</option><option>抖音</option><option>淘宝</option></select></label><label>订单号<input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="请输入订单号" /></label><label>店铺<select><option>请选择店铺</option><option>班牛小小店</option></select></label><label>状态<select><option>待处理</option><option>分析完成</option><option>异常</option></select></label><div><button className="settings-dark" type="button">查询</button><button className="settings-secondary" type="button" onClick={() => setKeyword("")}>重置</button></div></div><div className="settings-list-heading"><strong>任务列表</strong><button className="settings-secondary" type="button" onClick={() => announce("已取消选中任务")}>批量取消</button></div><TaskTable rows={filtered} announce={announce} /></>;
}

function TaskTable({ rows, announce }: { rows: typeof taskRows; announce: (message: string) => void }) {
  return <div className="setting-table task-data-table"><header><span>任务ID</span><span>平台</span><span>买家昵称</span><span>店铺</span><span>订单号</span><span>任务时间</span><span>状态</span><span>分析时长</span><span>操作</span></header>{rows.map((row) => <article key={row.id}><b>{row.id}</b><span>抖音</span><span>{row.buyer}</span><span>{row.shop}</span><span>{row.order}</span><time>2026-09-15 17:12</time><em className={row.status === "异常" ? "warning" : "success"}>{row.status}</em><span>{row.duration}</span><div><button type="button" onClick={() => announce(`已打开任务 ${row.id} 详情`)}>任务详情</button><button type="button" onClick={() => announce("已打开聊天记录")}>聊天记录</button></div></article>)}</div>;
}

function DataAnalysis() { return <section className="settings-analysis"><div className="analysis-cards">{[["本周建单总量", "128", "+18.6%"], ["分析完成率", "96.8%", "+2.4%"], ["平均处理时长", "8.4s", "-1.2s"]].map(([label, value, trend]) => <article key={label}><span>{label}</span><strong>{value}</strong><em>{trend}</em></article>)}</div><article className="settings-panel"><header><strong>近七日建单趋势</strong><span>按任务量统计</span></header><div className="analysis-bars">{[42, 68, 53, 83, 61, 78, 92].map((height, index) => <span style={{ height: `${height}%` }} key={index}><i>{["周一", "周二", "周三", "周四", "周五", "周六", "周日"][index]}</i></span>)}</div></article></section>; }

function OrderConfiguration({ announce }: { announce: (message: string) => void }) { const [enabled, setEnabled] = useState(true); return <section className="settings-config-list"><article><div><strong>自动建单开关</strong><p>满足意图识别与店铺规则时，自动创建后续处理任务。</p></div><button className={`setting-switch ${enabled ? "on" : ""}`} type="button" onClick={() => setEnabled((value) => !value)}><i /></button></article>{["订单类型映射", "默认工作表", "异常处理策略"].map((item) => <article key={item}><div><strong>{item}</strong><p>已配置默认规则，可按店铺或业务场景继续调整。</p></div><button className="settings-link" type="button" onClick={() => announce(`已打开${item}`)}>配置 ›</button></article>)}</section>; }

function TuningCenter({ announce }: { announce: (message: string) => void }) { return <section className="settings-tuning"><article><header><strong>建单提示词调优</strong><span>当前版本 v3.2</span></header><textarea defaultValue="根据会话意图、订单信息与店铺策略，生成清晰、可执行的建单建议。" /><footer><button className="settings-secondary" type="button">恢复默认</button><button className="settings-dark" type="button" onClick={() => announce("调优配置已保存")}>保存配置</button></footer></article><article><strong>最近调优记录</strong><p>2026-09-15　更新了售后场景的风险识别规则。</p><p>2026-09-11　补充了异常订单的转人工条件。</p></article></section>; }

function SessionManagement({ announce }: { announce: (message: string) => void }) { const [query, setQuery] = useState(""); const rows = [{ id: "S20260915001", name: "王小明", shop: "班牛小小店", summary: "咨询退款进度与包裹状态", time: "2026-09-15 17:12" }, { id: "S20260915002", name: "李青", shop: "班牛数码专营店", summary: "咨询修改收货地址", time: "2026-09-15 16:48" }].filter((row) => `${row.id}${row.name}`.includes(query)); return <><div className="setting-filter-grid session-filter"><label>店铺<select><option>全部店铺</option><option>班牛小小店</option></select></label><label>会员昵称<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="请输入会员昵称" /></label><label>最后进线时间<input type="date" /></label><div><button className="settings-dark" type="button">搜索</button><button className="settings-secondary" type="button" onClick={() => setQuery("")}>重置</button></div></div><div className="settings-list-heading"><strong>会员会话列表 <small>共 {rows.length} 条记录</small></strong></div><div className="setting-table session-table"><header><span>店铺</span><span>会员会话ID</span><span>会员昵称</span><span>会话总结</span><span>最近会话时间</span><span>操作</span></header>{rows.map((row) => <article key={row.id}><span>{row.shop}</span><b>{row.id}</b><span>{row.name}</span><span>{row.summary}</span><time>{row.time}</time><button className="settings-link" type="button" onClick={() => announce(`已打开 ${row.name} 的会话详情`)}>查看详情</button></article>)}</div></>;
}

function ShopManagement({ announce }: { announce: (message: string) => void }) { const [stores, setStores] = useState([{ name: "班牛小小店", platform: "抖音", enabled: true }, { name: "班牛数码专营店", platform: "淘宝", enabled: true }]); return <><div className="settings-toolbar"><label><span>⌕</span><input placeholder="搜索店铺名称" /></label><button className="settings-primary" type="button" onClick={() => announce("已打开新增店铺流程")}>＋ 新增店铺</button></div><div className="setting-table shops-table"><header><span>店铺名称</span><span>平台</span><span>会话管理状态</span><span>最后更新</span><span>操作</span></header>{stores.map((store, index) => <article key={store.name}><strong>{store.name}</strong><span>{store.platform}</span><button className={`setting-switch ${store.enabled ? "on" : ""}`} type="button" onClick={() => setStores((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: !item.enabled } : item))}><i /></button><time>2026-09-16 10:24</time><button className="settings-link" type="button" onClick={() => announce(`已打开「${store.name}」配置`)}>配置</button></article>)}</div></>;
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

function ChatUiIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    new: "M12 8v8m-4-4h8M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
    plus: "M12 5v14M5 12h14", close: "m6 6 12 12M6 18 18 6",
    panel: "M8 3v18M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1",
    chat: "M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7l-5 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2M7 10h.01M12 10h.01M17 10h.01",
    more: "M5 12h.01M12 12h.01M19 12h.01",
    model: "m12 3 10 5-10 5L2 8l10-5M2 12l10 5 10-5M2 16l10 5 10-5",
    attach: "m8 12 7-7a3 3 0 0 1 4 4L9 19a5 5 0 0 1-7-7L13 1m-7 13 9-9",
    expert: "M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0M4 21v-2a8 8 0 0 1 16 0v2",
    plugin: "m8 16 8-8m-9 5-3 3a4 4 0 0 0 6 6l3-3m-2-14 3-3a4 4 0 0 1 6 6l-3 3",
    file: "M14 3H5v18h14V8l-5-5v5h5M8 12h8M8 16h6",
    globe: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2c-5 5-5 15 0 20 5-5 5-15 0-20",
    down: "m6 9 6 6 6-6", arrow: "M4 12h16m-6-6 6 6-6 6",
    stop: "M6 6h12v12H6z", shield: "m12 2 9 3v6c0 6-9 11-9 11S3 17 3 11V5l9-3m-5 9 3 3 6-6",
    automation: "M8 3h8M8 21h8M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2m7 3v4l2 2"
  };
  return <svg className="chat-ui-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.chat} /></svg>;
}

type AutomationFrequency = "单次" | "每天" | "每周" | "每月";
type AutomationNotifyChannel = "会话框" | "钉钉机器人" | "企业微信" | "飞书机器人";
type AutomationAudience = "all" | "specific";
type AutomationTask = {
  id: string;
  name: string;
  prompt: string;
  frequency: AutomationFrequency;
  runAt: string;
  runDate: string;
  weekdays: string[];
  monthDay: string;
  permission: string;
  notify: string;
  notifyChannels: AutomationNotifyChannel[];
  notifySession: string;
  notifyAudience: AutomationAudience;
  notifyRecipients: string;
  webhook: string;
  hasExpiry: boolean;
  validUntil: string;
  validDate: string;
  enabled: boolean;
  nextRun: string;
  lastRun: string;
};
type AutomationDraft = Omit<AutomationTask, "id" | "enabled" | "nextRun" | "lastRun">;

const automationDraftDefaults: AutomationDraft = {
  name: "",
  prompt: "",
  frequency: "每天",
  runAt: "09:00",
  runDate: "2026-09-17",
  weekdays: ["周一"],
  monthDay: "1号",
  permission: "允许完全访问",
  notify: "当前会话",
  notifyChannels: ["会话框"],
  notifySession: "当前活跃会话（默认）",
  notifyAudience: "all",
  notifyRecipients: "",
  webhook: "",
  hasExpiry: false,
  validUntil: "长期有效",
  validDate: "2026-12-31",
};

const automationTimeOptions = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "18:00", "20:00"];
const automationWeekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const automationNotifyOptions: Array<{ label: AutomationNotifyChannel; mark: string; tone: string }> = [
  { label: "会话框", mark: "会", tone: "blue" },
  { label: "钉钉机器人", mark: "钉", tone: "cyan" },
  { label: "企业微信", mark: "企", tone: "green" },
  { label: "飞书机器人", mark: "飞", tone: "purple" },
];
const automationRobotChannels: AutomationNotifyChannel[] = ["钉钉机器人", "企业微信", "飞书机器人"];

function formatAutomationSchedule(task: Pick<AutomationTask, "frequency" | "runAt" | "runDate" | "weekdays" | "monthDay">) {
  if (task.frequency === "单次") return `单次 ${task.runDate} ${task.runAt}`;
  if (task.frequency === "每周") return `每周 ${task.weekdays.join("、")} ${task.runAt}`;
  if (task.frequency === "每月") return `每月 ${task.monthDay} ${task.runAt}`;
  return `每天 ${task.runAt}`;
}

function isAutomationExpired(task: Pick<AutomationTask, "hasExpiry" | "validDate">) {
  return task.hasExpiry && Boolean(task.validDate) && new Date(`${task.validDate}T23:59:59`).getTime() < Date.now();
}

function AutomationDialog({ editingId, draft, error, onChange, onClose, onSubmit }: {
  editingId: string | null;
  draft: AutomationDraft;
  error: string;
  onChange: (draft: AutomationDraft) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const robotSelected = draft.notifyChannels.some((channel) => automationRobotChannels.includes(channel));
  const toggleNotifyChannel = (channel: AutomationNotifyChannel) => {
    const nextChannels = draft.notifyChannels.includes(channel)
      ? draft.notifyChannels.filter((item) => item !== channel)
      : [...draft.notifyChannels, channel];
    onChange({ ...draft, notifyChannels: nextChannels, notify: nextChannels.join("、") });
  };
  return <div className="chat-v3-modal-layer" onMouseDown={onClose}><form className="chat-v3-automation-dialog" role="dialog" aria-modal="true" aria-label={editingId ? "编辑定时任务" : "新建定时任务"} onMouseDown={(event) => event.stopPropagation()} onSubmit={onSubmit}>
    <header><div><h2>{editingId ? "编辑定时任务" : "新建定时任务"}</h2><p>配置后，犇犇会在指定时间自动执行提示词。</p></div><button type="button" aria-label="关闭" onClick={onClose}>×</button></header>
    <div className="chat-v3-automation-form-grid"><label>名称<input maxLength={20} value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} placeholder="输入任务名称" /></label></div>
    <label className="chat-v3-automation-field">提示词<textarea value={draft.prompt} onChange={(event) => onChange({ ...draft, prompt: event.target.value })} placeholder="添加提示词，例如：整理昨天的售后订单并输出异常变化" /><small>到点自动执行的 AI 指令，将提交至犇犇Chat执行。建议描述执行周期、数据范围、店铺范围。</small></label>
    <div className="chat-v3-automation-schedule-grid"><label>执行周期<select value={draft.frequency} onChange={(event) => onChange({ ...draft, frequency: event.target.value as AutomationFrequency })}><option>每天</option><option>每周</option><option>每月</option></select></label><label>执行时间<select value={draft.runAt} onChange={(event) => onChange({ ...draft, runAt: event.target.value })}>{automationTimeOptions.map((time) => <option key={time}>{time}</option>)}</select></label>{draft.frequency === "每周" && <div className="chat-v3-weekday-picker full"><span>选择周几</span><div>{automationWeekdays.map((day) => <button type="button" className={draft.weekdays.includes(day) ? "on" : ""} key={day} onClick={() => onChange({ ...draft, weekdays: draft.weekdays.includes(day) ? draft.weekdays.filter((item) => item !== day) : [...draft.weekdays, day] })}>{day.slice(1)}</button>)}</div></div>}{draft.frequency === "每月" && <label>执行日期<select value={draft.monthDay} onChange={(event) => onChange({ ...draft, monthDay: event.target.value })}>{Array.from({ length: 28 }, (_, index) => <option key={index}>{index + 1}号</option>)}</select></label>}</div>
    <div className="chat-v3-automation-expiry"><label className="chat-v3-automation-checkbox"><input type="checkbox" checked={draft.hasExpiry} onChange={(event) => onChange({ ...draft, hasExpiry: event.target.checked, validUntil: event.target.checked ? "设置到期日期" : "长期有效" })} />设置到期日期</label>{draft.hasExpiry && <label>到期日期<input type="date" value={draft.validDate} onChange={(event) => onChange({ ...draft, validDate: event.target.value })} /></label>}<small>到期后自动禁用任务。</small></div>
    <section className="chat-v3-automation-notify"><h3>通知推送方式 <em>* 至少选择一项</em></h3><div className="chat-v3-automation-channel-grid">{automationNotifyOptions.map((option) => <button type="button" className={draft.notifyChannels.includes(option.label) ? "on" : ""} key={option.label} onClick={() => toggleNotifyChannel(option.label)}><i className={`tone-${option.tone}`}>{option.mark}</i><span>{option.label}</span>{draft.notifyChannels.includes(option.label) && <b>✓</b>}</button>)}</div><label>会话选择<select value={draft.notifySession} onChange={(event) => onChange({ ...draft, notifySession: event.target.value })}><option>当前活跃会话（默认）</option><option>新建会话</option><option>本周退款原因洞察报告</option><option>退货退款方案总结</option></select></label>{robotSelected && <><div className="chat-v3-automation-audience"><strong>通知对象</strong><label><input type="radio" name="automation-audience" checked={draft.notifyAudience === "all"} onChange={() => onChange({ ...draft, notifyAudience: "all" })} />@所有人</label><label><input type="radio" name="automation-audience" checked={draft.notifyAudience === "specific"} onChange={() => onChange({ ...draft, notifyAudience: "specific" })} />指定人</label></div>{draft.notifyAudience === "specific" && <input className="chat-v3-automation-recipients" value={draft.notifyRecipients} onChange={(event) => onChange({ ...draft, notifyRecipients: event.target.value })} placeholder="输入多个手机号 / 账号，用逗号分隔" />}<label className="chat-v3-automation-webhook"><span>Webhook 地址 <a href="#webhook-help" onClick={(event) => event.preventDefault()}>如何获取</a></span><input type="url" value={draft.webhook} onChange={(event) => onChange({ ...draft, webhook: event.target.value })} placeholder="https://" /><small>仅校验 URL 格式，不会发起真实调用。</small></label></>}</section>
    {error && <p className="chat-v3-automation-error" role="alert">{error}</p>}
    <footer><button type="button" className="secondary" onClick={onClose}>取消</button><button type="submit" className="primary">保存</button></footer>
  </form></div>;
}

function AutomationCenter({ tasks, onCreate, onUpdate, onToggle, onDelete, onBack }: {
  tasks: AutomationTask[];
  onCreate: (draft: AutomationDraft) => void;
  onUpdate: (id: string, draft: AutomationDraft) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<"tasks" | "runs">("tasks");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AutomationDraft>(automationDraftDefaults);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [runHistory, setRunHistory] = useState([
    { id: "run-1", name: "每日售后经营提醒", time: "2026-09-17 09:00", status: "已完成" },
    { id: "run-2", name: "退款异常跟进", time: "2026-09-16 18:00", status: "已完成" },
  ]);

  const openCreate = () => {
    setEditingId(null);
    setDraft(automationDraftDefaults);
    setError("");
    setModalOpen(true);
  };
  const openEdit = (task: AutomationTask) => {
    setEditingId(task.id);
    setDraft({ name: task.name, prompt: task.prompt, frequency: task.frequency, runAt: task.runAt, runDate: task.runDate, weekdays: task.weekdays, monthDay: task.monthDay, permission: task.permission, notify: task.notify, notifyChannels: task.notifyChannels, notifySession: task.notifySession, notifyAudience: task.notifyAudience, notifyRecipients: task.notifyRecipients, webhook: task.webhook, hasExpiry: task.hasExpiry || task.validUntil === "设置到期日期", validUntil: task.validUntil, validDate: task.validDate });
    setError("");
    setModalOpen(true);
  };
  const submitDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.prompt.trim()) {
      setError("请填写任务名称和提示词");
      return;
    }
    if (!draft.notifyChannels.length) {
      setError("至少选择一种通知推送方式");
      return;
    }
    if (draft.hasExpiry && !draft.validDate) {
      setError("请选择到期日期");
      return;
    }
    const robotSelected = draft.notifyChannels.some((channel) => automationRobotChannels.includes(channel));
    if (robotSelected && (!draft.webhook.trim() || !/^https?:\/\/[^\s]+$/i.test(draft.webhook.trim()))) {
      setError("请输入正确的 Webhook URL");
      return;
    }
    if (robotSelected && draft.notifyAudience === "specific" && !draft.notifyRecipients.trim()) {
      setError("请输入指定人的手机号或账号");
      return;
    }
    const readyDraft = { ...draft, name: draft.name.trim(), prompt: draft.prompt.trim(), notify: draft.notifyChannels.join("、"), webhook: draft.webhook.trim(), validUntil: draft.hasExpiry ? "设置到期日期" : "长期有效" };
    if (editingId) onUpdate(editingId, readyDraft);
    else onCreate(readyDraft);
    setModalOpen(false);
    setNotice(editingId ? "定时任务已更新" : "定时任务已创建");
    window.setTimeout(() => setNotice(""), 2400);
  };
  const runTask = (task: AutomationTask) => {
    setRunHistory((items) => [{ id: `run-${Date.now()}`, name: task.name, time: "刚刚", status: "已完成" }, ...items]);
    setNotice(`「${task.name}」已立即执行`);
    window.setTimeout(() => setNotice(""), 2400);
  };

  return <section className="chat-v3-automation-page" aria-label="定时任务">
    <header className="chat-v3-automation-header">
      <div><button type="button" className="chat-v3-automation-back" onClick={onBack}>‹ 返回犇犇Chat</button><h1>自动化</h1><p>让犇犇按计划执行重复性的业务任务，并将结果推送到指定会话。</p></div>
      {tab === "tasks" && <button type="button" className="chat-v3-automation-primary" onClick={openCreate}><ChatUiIcon name="plus" />添加自动化任务</button>}
    </header>
    <nav className="chat-v3-automation-tabs" aria-label="自动化视图"><button type="button" className={tab === "tasks" ? "on" : ""} onClick={() => setTab("tasks")}><ChatUiIcon name="automation" />定时任务</button><button type="button" className={tab === "runs" ? "on" : ""} onClick={() => setTab("runs")}><ChatUiIcon name="chat" />运行记录</button></nav>
    {notice && <p className="chat-v3-automation-notice" role="status">✓ {notice}</p>}
    {tab === "tasks" ? <div className="chat-v3-automation-list">{tasks.length ? tasks.map((task) => <article className="chat-v3-automation-card" key={task.id}>
      <header><div className="chat-v3-automation-card-title"><span className={task.enabled ? "enabled" : "paused"} /><strong>{task.name}</strong><em>{task.enabled ? "运行中" : "已暂停"}</em></div><button type="button" className={`chat-v3-automation-switch ${task.enabled ? "on" : ""}`} aria-label={`${task.name}${task.enabled ? "暂停" : "启用"}`} aria-pressed={task.enabled} onClick={() => onToggle(task.id)}><i /></button></header>
      <p className="chat-v3-automation-prompt">{task.prompt}</p>
      <dl><div><dt>执行频率</dt><dd>{formatAutomationSchedule(task)}</dd></div><div><dt>通知到</dt><dd>{task.notify}</dd></div><div><dt>有效期</dt><dd>{task.validUntil === "设置到期日期" ? task.validDate : task.validUntil}</dd></div><div><dt>下一次执行</dt><dd>{task.enabled ? task.nextRun : "已暂停"}</dd></div></dl>
      <footer><span>上次运行：{task.lastRun}</span><div><button type="button" onClick={() => runTask(task)}>立即执行</button><button type="button" onClick={() => openEdit(task)}>编辑</button><button type="button" className="danger" onClick={() => onDelete(task.id)}>删除</button></div></footer>
    </article>) : <div className="chat-v3-automation-empty"><ChatUiIcon name="automation" /><strong>暂无定时任务</strong><p>创建一个任务，让犇犇按计划帮你处理重复工作。</p><button type="button" onClick={openCreate}>添加自动化任务</button></div>}</div> : <div className="chat-v3-run-list">{runHistory.map((run) => <article key={run.id}><div><span className="chat-v3-run-icon">✓</span><strong>{run.name}</strong></div><time>{run.time}</time><em>{run.status}</em></article>)}</div>}
    {modalOpen && <AutomationDialog editingId={editingId} draft={draft} error={error} onChange={setDraft} onClose={() => setModalOpen(false)} onSubmit={submitDraft} />}
  </section>;
}

function ChatHome({ menuOpen, initialSettings = false, initialAutomation = false }: { menuOpen: boolean; initialSettings?: boolean; initialAutomation?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(menuOpen);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [automationOpen, setAutomationOpen] = useState(initialAutomation);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [thread, setThread] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [sending, setSending] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [model, setModel] = useState("DeepSeek V4 Flash");
  const [composerMenu, setComposerMenu] = useState<"root" | "experts" | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [settingsPage, setSettingsPage] = useState(initialSettings);
  const settingsOpen = false;
  const setSettingsOpen = (_open?: boolean) => {
    const params = new URLSearchParams({ design: "1404-1392", settings: "1", from: "chat" });
    if (settingsPage) params.set("chatView", "settings");
    window.sessionStorage.setItem("benben-settings-return-chat", `/?${params.toString()}`);
    window.location.assign(`/?${params.toString()}`);
  };
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "glass" | "clear">("light");
  const [attachments, setAttachments] = useState<string[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState([
    { id: "weekly", title: "本周退款原因洞察报告" }, { id: "solution", title: "退货退款方案总结" },
    { id: "review", title: "评价自动分类与派发" }, { id: "risk", title: "退货退款风险原因分析" }, { id: "after", title: "售后策略生成" },
  ]);
  const [historyMenu, setHistoryMenu] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [threadCache, setThreadCache] = useState<Record<string, Array<{role: "user" | "assistant"; text: string}>>>({});
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [automationTasks, setAutomationTasks] = useState<AutomationTask[]>([
    { id: "daily-after-sales", name: "每日售后经营提醒", prompt: "每天整理昨天的售后订单，输出异常变化和需要优先跟进的事项。", frequency: "每天", runAt: "09:00", runDate: "2026-09-17", weekdays: ["周一"], monthDay: "1号", workspace: "售后运营", permission: "允许完全访问", notify: "会话框", notifyChannels: ["会话框"], notifySession: "当前活跃会话（默认）", notifyAudience: "all", notifyRecipients: "", webhook: "", hasExpiry: false, validUntil: "长期有效", validDate: "2026-12-31", enabled: true, nextRun: "明天 09:00", lastRun: "今天 09:00" },
    { id: "refund-watch", name: "退款异常跟进", prompt: "检查近 24 小时退款异常，整理高风险订单并给出处理建议。", frequency: "每周", runAt: "18:00", runDate: "2026-09-17", weekdays: ["周五"], monthDay: "1号", permission: "仅允许读取", notify: "会话框", notifyChannels: ["会话框"], notifySession: "当前活跃会话（默认）", notifyAudience: "all", notifyRecipients: "", webhook: "", hasExpiry: false, validUntil: "长期有效", validDate: "2026-12-31", enabled: false, nextRun: "周五 18:00", lastRun: "2026-09-12 18:00" },
  ]);
  const models = ["DeepSeek V4 Flash", "DeepSeek V4 Pro", "DeepSeek V4 Flash Vision", "Qwen3.8 Flash", "Qwen3.8 Max"];
  const experts = ["退款报告分析专家", "售后策略专家", "物流履约专家"];
  const activeTitle = history.find((item) => item.id === activeConversation)?.title || "新建对话";
  const searchResults = history.filter((item) => item.title.includes(searchQuery.trim()));
  const createAutomationTask = (draft: AutomationDraft) => {
    const expired = isAutomationExpired(draft);
    setAutomationTasks((items) => [{ ...draft, id: `automation-${Date.now()}`, enabled: !expired, nextRun: expired ? "已到期" : formatAutomationSchedule(draft), lastRun: "尚未执行" }, ...items]);
  };
  const updateAutomationTask = (id: string, draft: AutomationDraft) => {
    const expired = isAutomationExpired(draft);
    setAutomationTasks((items) => items.map((item) => item.id === id ? { ...item, ...draft, enabled: expired ? false : item.enabled, nextRun: expired ? "已到期" : formatAutomationSchedule(draft) } : item));
  };
  const toggleAutomationTask = (id: string) => {
    setAutomationTasks((items) => items.map((item) => item.id === id ? { ...item, enabled: isAutomationExpired(item) ? false : !item.enabled } : item));
  };

  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) setHistoryOpen(false);
  }, []);

  useEffect(() => {
    const closeFloatingPanels = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest(".chat-v3-history-row")) setHistoryMenu(null);
      if (!target.closest(".chat-v3-product-wrap")) setIsMenuOpen(false);
      if (!target.closest(".chat-v3-model-wrap")) setModelOpen(false);
      if (!target.closest(".chat-v3-composer-tools")) setComposerMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false); setSearchOpen(false); setModelOpen(false); setComposerMenu(null); setHistoryMenu(null); setRenameTarget(null);
    };
    document.addEventListener("mousedown", closeFloatingPanels);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeFloatingPanels); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  useEffect(() => setSettingsPage(initialSettings), [initialSettings]);
  useEffect(() => setAutomationOpen(initialAutomation), [initialAutomation]);

  useEffect(() => () => { if (replyTimer.current) clearTimeout(replyTimer.current); }, []);
  const stopReply = () => { if (replyTimer.current) clearTimeout(replyTimer.current); setSending(false); };
  const saveCurrentThread = () => { if (activeConversation) setThreadCache((cache) => ({ ...cache, [activeConversation]: thread })); };
  const newConversation = () => {
    saveCurrentThread(); stopReply(); setHistoryMenu(null);
    if (window.matchMedia("(max-width: 900px)").matches) setHistoryOpen(false);
    setActiveConversation(null); setThread([]); setMessage(""); setAttachments([]); setSelectedExpert(null); setSending(false); setSettingsPage(false); setAutomationOpen(false);
  };
  const selectConversation = (id: string) => {
    saveCurrentThread(); stopReply(); setHistoryMenu(null);
    if (window.matchMedia("(max-width: 900px)").matches) setHistoryOpen(false);
    const selected = history.find((item) => item.id === id);
    setActiveConversation(id); setThread(threadCache[id] || (selected ? [{ role: "assistant", text: `已为你打开「${selected.title}」。你可以继续提问，或选择专家协助处理。` }] : [])); setSending(false); setSettingsPage(false); setAutomationOpen(false);
  };
  const sendMessage = () => {
    const text = message.trim();
    if (!text || sending) return;
    const conversationId = activeConversation || `local-${Date.now()}`;
    if (!activeConversation) { setActiveConversation(conversationId); setHistory((items) => [{ id: conversationId, title: text.slice(0, 32) }, ...items]); }
    setThread((items) => [...items, { role: "user", text }]);
    setMessage(""); setAttachments([]); setSending(true);
    replyTimer.current = setTimeout(() => { setThread((items) => [...items, { role: "assistant", text: selectedExpert ? `「${selectedExpert}」已收到你的问题。我已整理关键经营信息，并给出下一步处理建议。` : "我已收到你的问题。可以选择专家、附加资料，或继续补充业务背景。" }]); setSending(false); }, 700);
  };

  const rememberChatReturn = () => {
    const params = new URLSearchParams({ design: "1404-1392" });
    if (settingsPage) params.set("chatView", "settings");
    window.sessionStorage.setItem("benben-expert-return-chat", `/?${params.toString()}`);
  };

  return <main className={`task-app chat-home chat-home-v3 theme-${theme} ${historyOpen ? "history-is-open" : "history-is-collapsed"} ${settingsPage ? "settings-page-open" : ""}`} onClickCapture={(event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a[href*="expert=1"]') as HTMLAnchorElement | null;
    if (link) {
      rememberChatReturn();
      window.sessionStorage.setItem("benben-expert-source", "chat");
      link.href = "/?design=1404-1493&expert=1&from=chat";
    }
  }}>
    <aside className="side-rail"><img className="brand" src={`${A}/brand-mark.svg`} alt="犇犇" /><RailButtons /><img className="user-avatar" src={`${A}/avatar.svg`} alt="用户头像" /></aside>
    <header className="chat-v3-topbar"><div className="chat-v3-product-wrap"><button className={`chat-v3-product ${isMenuOpen ? "open" : ""}`} type="button" aria-label="切换产品" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>犇犇Chat <img src={`${A}/chevron.svg`} alt="" /></button>{isMenuOpen && <ProductMenu current="chat" />}</div><div className="chat-v3-search-wrap"><label className="chat-v3-search"><img src={`${A}/search-top.svg`} alt="" /><input readOnly aria-label="搜索会话" value={searchQuery} onClick={() => setSearchOpen(true)} onFocus={() => setSearchOpen(true)} placeholder="搜索" /></label></div><button className="chat-v3-mobile-history" type="button" aria-label="展开会话列表" onClick={() => setHistoryOpen((open) => !open)}><ChatUiIcon name="panel" /></button><a className="chat-v3-hub-link" href="/?design=1404-1493&expert=1"><span>✧</span>专家·技能·连接器</a><i /><button className="chat-v3-settings" type="button" onClick={() => setSettingsOpen(true)}><img src={`${A}/settings-16.svg`} alt="" />设置</button></header>
    <section className={`chat-v3-shell ${historyOpen ? "history-open" : "history-collapsed"}`}><aside className="chat-v3-history" aria-label="会话列表">
      <header><div className="chat-v3-sidebar-actions"><button type="button" onClick={newConversation}><ChatUiIcon name="new" /><span>新建对话</span></button><button type="button" className={`chat-v3-automation-entry ${automationOpen ? "active" : ""}`} aria-pressed={automationOpen} onClick={() => { stopReply(); setHistoryMenu(null); setAutomationOpen(true); }}><ChatUiIcon name="automation" /><span>定时任务</span></button></div><button type="button" aria-label={historyOpen ? "收起会话列表" : "展开会话列表"} onClick={() => setHistoryOpen((open) => !open)}><ChatUiIcon name="panel" /></button></header>
      {historyOpen && <><h2>历史对话</h2><div className="chat-v3-history-list">{history.map((item) => <div className={`chat-v3-history-row ${activeConversation === item.id ? "active" : ""}`} key={item.id}>
        <button type="button" title={item.title} onClick={() => selectConversation(item.id)}><ChatUiIcon name="chat" /><em>{item.title}</em></button>
        <button type="button" className="chat-v3-history-more" aria-label={`${item.title}更多操作`} aria-expanded={historyMenu === item.id} onClick={() => setHistoryMenu(historyMenu === item.id ? null : item.id)}><ChatUiIcon name="more" /></button>
        {historyMenu === item.id && <div className="chat-v3-history-menu"><button type="button" onClick={() => { setRenameTarget(item.id); setRenameDraft(item.title); setHistoryMenu(null); }}>重命名</button><button type="button" onClick={() => { setHistory((items) => items.filter((entry) => entry.id !== item.id)); if(activeConversation === item.id) newConversation(); setHistoryMenu(null); }}>删除对话</button></div>}
      </div>)}</div></>}
    </aside><main className={`chat-v3-main ${automationOpen ? "is-automation" : activeConversation ? "has-conversation" : "is-welcome"}`}>{automationOpen ? <AutomationCenter tasks={automationTasks} onCreate={createAutomationTask} onUpdate={updateAutomationTask} onToggle={toggleAutomationTask} onDelete={(id) => setAutomationTasks((items) => items.filter((item) => item.id !== id))} onBack={() => setAutomationOpen(false)} /> : <>{activeConversation ? <section className="chat-v3-thread"><header><h1>{activeTitle}</h1><span>{selectedExpert ? `已选择 ${selectedExpert}` : "犇犇Chat"}</span></header><div className="chat-v3-messages">{thread.map((item, index) => <article className={item.role} key={`${item.role}-${index}`}><b>{item.role === "user" ? "我" : "犇犇"}</b><p>{item.text}</p></article>)}{sending && <article className="assistant pending"><b>犇犇</b><p><i />正在思考…</p></article>}</div></section> : <section className="chat-v3-empty"><img src="/benben-chat-banner.png" alt="BENBEN" /></section>}<div className="chat-v3-composer"><div className="chat-v3-attachments">{attachments.map((file) => <span key={file}>{file}<button type="button" onClick={() => setAttachments((items) => items.filter((item) => item !== file))}>×</button></span>)}</div><textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); sendMessage(); } }} placeholder="给犇犇发送消息" /><footer><div className="chat-v3-composer-tools"><input ref={uploadRef} type="file" multiple hidden onChange={(event) => setAttachments(Array.from(event.target.files || []).map((file) => file.name))} /><button className={`chat-v3-plus ${composerMenu ? "open" : ""}`} type="button" aria-label="添加功能" aria-expanded={!!composerMenu} onClick={() => setComposerMenu((open) => open ? null : "root")}><ChatUiIcon name={composerMenu ? "close" : "plus"} /></button>{composerMenu && <div className="chat-v3-composer-menu">{composerMenu === "root" ? <><button type="button" onClick={() => { uploadRef.current?.click(); setComposerMenu(null); }}><ChatUiIcon name="attach" />文件和图片</button><button type="button" onClick={() => setComposerMenu("experts")}><ChatUiIcon name="expert" />专家 <i>›</i></button><button type="button" disabled><ChatUiIcon name="plugin" />插件 <i>›</i></button><button type="button" disabled><ChatUiIcon name="file" />技能 <i>›</i></button><button type="button" disabled><ChatUiIcon name="globe" />联网搜索 <i>›</i></button></> : <><button type="button" className="chat-v3-back" onClick={() => setComposerMenu("root")}>‹　专家</button>{experts.map((expert) => <button type="button" onClick={() => { setSelectedExpert(expert); setComposerMenu(null); }} key={expert}>{selectedExpert === expert ? "✓　" : "　　"}{expert}</button>)}<a href="/?design=1404-1493&expert=1">✧　召唤更多专家</a></>}</div>}</div>{selectedExpert && <span className="chat-v3-expert-chip">{selectedExpert}<button type="button" aria-label="取消选择专家" onClick={() => setSelectedExpert(null)}><ChatUiIcon name="close" /></button></span>}<div className="chat-v3-model-wrap"><button type="button" className="chat-v3-model" aria-expanded={modelOpen} onClick={() => setModelOpen((open) => !open)}><ChatUiIcon name="model" />{model}<ChatUiIcon name="down" /></button>{modelOpen && <div className="chat-v3-model-menu">{models.map((item) => <button type="button" className={model === item ? "on" : ""} onClick={() => { setModel(item); setModelOpen(false); }} key={item}><ChatUiIcon name="model" />{item}{model === item && <i>●</i>}</button>)}<button type="button" className="chat-v3-model-manage" onClick={() => setSettingsOpen(true)}>⚙　模型管理</button></div>}</div><button type="button" className="chat-v3-send" disabled={!sending && !message.trim()} onClick={sending ? stopReply : sendMessage}>{sending ? "停止" : "发送"}<ChatUiIcon name={sending ? "stop" : "arrow"} /></button></footer><small><ChatUiIcon name="shield" />数据安全防护中</small></div>
      {!activeConversation && <section className="chat-v3-more-content"><h2>更多内容</h2><p>主题切换</p><div>{([["light", "浅色"], ["dark", "深色"], ["glass", "玻璃"], ["clear", "清透"]] as const).map(([value,label]) => <button key={value} type="button" className={`chat-v3-theme-card ${value} ${theme === value ? "on" : ""}`} aria-pressed={theme === value} onClick={() => setTheme(value)}><i /><span>{label}</span>{theme === value && <b>✓</b>}</button>)}</div></section>}
    </>}</main></section>
    {renameTarget && <div className="chat-v3-modal-layer" onMouseDown={() => setRenameTarget(null)}><form className="chat-v3-rename-dialog" role="dialog" aria-label="重命名对话" onMouseDown={(event) => event.stopPropagation()} onSubmit={(event) => { event.preventDefault(); if (!renameDraft.trim()) return; setHistory((items) => items.map((item) => item.id === renameTarget ? {...item, title: renameDraft.trim()} : item)); setRenameTarget(null); }}><h2>重命名对话</h2><input autoFocus aria-label="对话名称" value={renameDraft} onChange={(event) => setRenameDraft(event.target.value)} /><footer><button type="button" onClick={() => setRenameTarget(null)}>取消</button><button type="submit" disabled={!renameDraft.trim()}>保存</button></footer></form></div>}
    {searchOpen && <div className="chat-v3-modal-layer chat-v3-search-layer" onMouseDown={() => setSearchOpen(false)}><section className="chat-v3-search-modal" role="dialog" aria-label="搜索会话" onMouseDown={(event) => event.stopPropagation()}><header><img src={`${A}/search-top.svg`} alt="" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索会话内容..." /><button type="button" onClick={() => setSearchOpen(false)} aria-label="关闭">×</button></header>{searchQuery ? <div>{searchResults.length ? searchResults.map((item) => <button type="button" onClick={() => { selectConversation(item.id); setSearchOpen(false); }} key={item.id}><span>▢</span>{item.title}</button>) : <p>未找到匹配会话</p>}</div> : <p>输入关键词搜索会话内容</p>}</section></div>}
    {skillsOpen && <div className="chat-v3-modal-layer" onMouseDown={() => setSkillsOpen(false)}><section className="chat-v3-side-modal" onMouseDown={(event) => event.stopPropagation()}><header><strong>我的技能</strong><button type="button" onClick={() => setSkillsOpen(false)}>×</button></header>{["售后订单查询", "退款原因归因", "物流履约跟进"].map((skill) => <button type="button" onClick={() => { setMessage(`请使用「${skill}」帮我处理当前问题`); setSkillsOpen(false); }} key={skill}><span>✦</span>{skill}<i>›</i></button>)}</section></div>}
    {settingsOpen && <div className="chat-v3-modal-layer" onMouseDown={() => setSettingsOpen(false)}><section className="chat-v3-settings-modal" onMouseDown={(event) => event.stopPropagation()}><header><strong>主题切换</strong><button type="button" onClick={() => setSettingsOpen(false)}>×</button></header><div>{([ ["light", "浅色"], ["dark", "深色"], ["glass", "玻璃"], ["clear", "清透"] ] as const).map(([value, label]) => <button type="button" className={theme === value ? "on" : ""} onClick={() => setTheme(value)} key={value}><i /><span>{label}</span></button>)}</div></section></div>}
    {settingsPage && <ChatV3SettingsPage theme={theme} onThemeChange={setTheme} />}
  </main>;
}

function ChatV3SettingsPage({ theme, onThemeChange }: { theme: "light" | "dark" | "glass" | "clear"; onThemeChange: (theme: "light" | "dark" | "glass" | "clear") => void }) {
  const [platform, setPlatform] = useState<"飞书" | "钉钉">("飞书");
  const [binding, setBinding] = useState("新建");
  const [appId, setAppId] = useState("18114015046");
  const [secret, setSecret] = useState("123456789012");
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("飞书对话");
  const [notice, setNotice] = useState("");
  const themeOptions = [["light", "浅色"], ["dark", "深色"], ["glass", "玻璃"], ["clear", "清透"]] as const;

  return <section className="chat-v3-settings-page" aria-label="设置">
    <div className="chat-v3-settings-content">
      <h1>设置</h1>
      <section className="chat-v3-settings-section">
        <h2>主题切换</h2>
        <div className="chat-v3-theme-options">{themeOptions.map(([value, label]) => <button type="button" className={`${theme === value ? "on" : ""} ${value}`} aria-pressed={theme === value} onClick={() => onThemeChange(value)} key={value}><i><span /><b /><em /></i><strong>{label}</strong>{theme === value && <small>✓</small>}</button>)}</div>
      </section>
      <section className="chat-v3-settings-section chat-v3-im-section">
        <h2>IM 绑定</h2>
        <label className="chat-v3-settings-label">已有绑定<select value={binding} onChange={(event) => setBinding(event.target.value)}><option>新建</option><option>飞书售后助手</option><option>钉钉客服助手</option></select></label>
        <div className="chat-v3-platform-switch"><button type="button" className={platform === "飞书" ? "on" : ""} onClick={() => setPlatform("飞书")}>飞书</button><button type="button" className={platform === "钉钉" ? "on" : ""} onClick={() => setPlatform("钉钉")}>钉钉</button></div>
        <div className="chat-v3-binding-fields">
          <label>App ID<input value={appId} onChange={(event) => setAppId(event.target.value)} /></label>
          <label>App Secret<input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} /></label>
          <label>备注<input value={note} onChange={(event) => setNote(event.target.value)} placeholder="请输入备注（可选）" /></label>
          <label>会话标题<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={`${platform}对话`} /></label>
        </div>
        <button className="chat-v3-generate" type="button" onClick={() => setNotice(`${platform}会话「${title || `${platform}对话`}」已生成`)}>生成</button>
        {notice && <p className="chat-v3-settings-notice" role="status">✓ {notice}</p>}
      </section>
    </div>
  </section>;
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
  return <div className="product-menu"><button type="button" className={current === "chat" ? "current" : ""} onClick={() => window.location.assign("/?design=1404-1392")}><strong>犇犇Chat</strong><small>对话式业务洞察与决策支持</small>{current === "chat" && <b aria-label="已选中">✓</b>}</button><button type="button" className={current === "task" ? "current" : ""} onClick={() => window.location.assign("/?design=1404-1493")}><strong>犇犇Task</strong><small>端到端任务协同与履约焕新</small>{current === "task" && <b aria-label="已选中">✓</b>}</button></div>;
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
  const [customExpertsLoaded, setCustomExpertsLoaded] = useState(false);
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [workspaceExpert, setWorkspaceExpert] = useState<Expert | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [tab, setTab] = useState("我的简介");
  const [recruitedIds, setRecruitedIds] = useState<string[]>([]);
  const [cancelledRecruitIds, setCancelledRecruitIds] = useState<string[]>([]);
  const [recruitConfigs, setRecruitConfigs] = useState<Record<string, RecruitmentConfig>>({});
  const isCustom = (expert: Expert) => customExperts.some(([id]) => id === expert[0]);
  const isRecruited = (expert: Expert) => !cancelledRecruitIds.includes(expert[0]) && (isCustom(expert) || recruitedIds.includes(expert[0]));
  const recruitExpert = (id: string) => {
    setCancelledRecruitIds((ids) => ids.filter((item) => item !== id));
    setRecruitedIds((ids) => ids.includes(id) ? ids : [...ids, id]);
  };
  const cancelExpert = (id: string) => {
    setRecruitedIds((ids) => ids.filter((item) => item !== id));
    setCancelledRecruitIds((ids) => ids.includes(id) ? ids : [...ids, id]);
  };
  const allExperts = [...expertCatalog, ...customExperts];
  const visibleExperts = allExperts.filter((expert) => (filter === "全部" || expertCategory(expert) === filter) && `${expert[1]}${expert[3]}`.includes(query.trim()));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("benben-custom-experts");
      if (saved) setCustomExperts(JSON.parse(saved) as Expert[]);
    } catch { /* 忽略旧版本中不可解析的本地数据。 */ }
    setCustomExpertsLoaded(true);
  }, []);

  useEffect(() => {
    if (!customExpertsLoaded) return;
    window.localStorage.setItem("benben-custom-experts", JSON.stringify(customExperts));
  }, [customExperts, customExpertsLoaded]);
  if (workspaceExpert) return <CustomExpertWorkspace expert={workspaceExpert} onBack={() => setWorkspaceExpert(null)} />;
  if (section === "connectors") return <ConnectorCenter onBack={onBack} />;
  return <main className="expert-hub"><PlatformRail /><header className="expert-hub-head"><button type="button" onClick={onBack}>‹ 返回</button><a className={section === "experts" ? "on" : ""} href="/?design=1404-1493&expert=1&section=experts">专家</a><a className={section === "skills" ? "on" : ""} href="/?design=1404-1493&expert=1&section=skills">技能</a><a className={section === "connectors" ? "on" : ""} href="/?design=1404-1493&expert=1&section=connectors">连接器</a></header>{section === "skills" ? <SkillsCenter /> : <section className="expert-hub-body"><div className="expert-toolbar expert-category-toolbar expert-management-row"><nav aria-label="业务类型筛选">{["全部", "售后处理", "工单审核", "订单与交易", "物流履约", "风险识别"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} type="button" key={item}>{item}</button>)}</nav><div className="expert-view-tools"><button aria-label="列表视图" className={view === "list" ? "active" : ""} onClick={() => setView("list")} type="button"><img src={`${A}/view-list.svg`} alt="" /></button><button aria-label="卡片视图" className={view === "cards" ? "active" : ""} onClick={() => setView("cards")} type="button"><img src={`${A}/view-cards.svg`} alt="" /></button><label><img src={`${A}/search-expert.svg`} alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索专家名称" /></label><button className="new-expert" type="button" onClick={() => setCreateOpen(true)}>＋ 创建专家</button></div></div><div className={`expert-grid ${view}`}>{visibleExperts.map((expert) => { const custom = isCustom(expert); const recruited = isRecruited(expert); const openSystem = () => { setTab("我的简介"); setSelected(expert); }; return <article className={`expert-tile ${recruited ? "recruited" : "unrecruited"} ${custom ? "custom-expert" : "system-expert"}`} onClick={custom ? () => setWorkspaceExpert(expert) : openSystem} onKeyDown={(event) => { if (event.key === "Enter") custom ? setWorkspaceExpert(expert) : openSystem(); }} role="button" tabIndex={0} key={expert[0]}><header><img src={expertImage(expert)} alt="" /><div><div className="expert-title-row"><strong>{expert[1]}</strong></div><span className="expert-category-tag">{expertCategory(expert)}</span></div>{recruited ? <button className="expert-recruit-status" type="button" onClick={(event) => { event.stopPropagation(); cancelExpert(expert[0]); }}><span className="active-label">✓ 已招募</span><span className="cancel-label">取消招募</span></button> : <span className="recruit-label"><i>未招募</i><b>去招募　→</b></span>}</header><p>{expert[3]}</p></article>; })}</div></section>}{createOpen && <CreateExpertModal onClose={() => setCreateOpen(false)} onContinue={(expert) => { setCustomExperts((all) => all.some(([id]) => id === expert[0]) ? all : [...all, expert]); setFilter("全部"); setCreateOpen(false); setWorkspaceExpert(expert); }} />}{selected && <RecruitModal expert={selected} tab={tab} setTab={setTab} recruited={isRecruited(selected)} config={recruitConfigs[selected[0]]} onConfigChange={(config) => setRecruitConfigs((all) => ({ ...all, [selected[0]]: config }))} onClose={() => setSelected(null)} onRecruit={() => { recruitExpert(selected[0]); setSelected(null); }} onCancelRecruit={() => { cancelExpert(selected[0]); setSelected(null); }} />}</main>;
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
  const [filter, setFilter] = useState("全部");
  const [queryDraft, setQueryDraft] = useState("");
  const [query, setQuery] = useState("");
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [mySkillsLoaded, setMySkillsLoaded] = useState(false);
  const [disabledSkillIds, setDisabledSkillIds] = useState<string[]>([]);
  const [editorSkill, setEditorSkill] = useState<Skill | null | undefined>(undefined);
  const [notice, setNotice] = useState("");
  const categories = ["全部", "订单", "工单", "售后", "物流", "通用"];
  const currentSkills = [...skillCatalog, ...mySkills];
  const filtered = currentSkills.filter((skill) => (filter === "全部" || skill.category === filter) && `${skill.name}${skill.description}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("benben-custom-skills");
      if (saved) setMySkills(JSON.parse(saved) as Skill[]);
    } catch { /* 忽略旧版本中不可解析的本地数据。 */ }
    setMySkillsLoaded(true);
  }, []);

  useEffect(() => {
    if (!mySkillsLoaded) return;
    window.localStorage.setItem("benben-custom-skills", JSON.stringify(mySkills));
  }, [mySkills, mySkillsLoaded]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const saveSkill = (skill: Skill) => {
    setMySkills((items) => items.some((item) => item.id === skill.id) ? items.map((item) => item.id === skill.id ? skill : item) : [...items, skill]);
    setEditorSkill(undefined);
    setNotice("技能已保存到我的技能");
  };

  return <section className="library-page skill-center"><div className="expert-toolbar expert-category-toolbar skill-management-row"><nav aria-label="技能分类筛选">{categories.map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</nav><div className="library-actions"><div className="view-toggle"><button aria-label="列表视图" className={view === "list" ? "on" : ""} onClick={() => setView("list")} type="button"><img src={`${A}/view-list.svg`} alt="" /></button><button aria-label="卡片视图" className={view === "cards" ? "on" : ""} onClick={() => setView("cards")} type="button"><img src={`${A}/view-cards.svg`} alt="" /></button></div><label className="library-search"><img src={`${A}/search-expert.svg`} alt="" /><input value={queryDraft} onChange={(event) => setQueryDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") setQuery(queryDraft); }} placeholder="搜索技能名称" /></label><button className="library-query" type="button" onClick={() => setQuery(queryDraft)}>查询</button><button className="library-add" type="button" onClick={() => setEditorSkill(null)}>＋ 创建技能</button></div></div>{filtered.length ? <div className={`library-grid ${view}`}>{filtered.map((skill) => { const enabled = !disabledSkillIds.includes(skill.id); return <article className="skill-card" key={skill.id} onClick={() => skill.scope === "mine" ? setEditorSkill(skill) : setNotice("系统技能为平台能力，暂不支持直接修改")}><header><img src="/figma-connectors/skill-icon.svg" alt="" /><div><strong>{skill.name}</strong><span>{skill.category}</span></div><button className={`skill-status ${enabled ? "enabled" : "disabled"}`} type="button" onClick={(event) => { event.stopPropagation(); setDisabledSkillIds((ids) => ids.includes(skill.id) ? ids.filter((id) => id !== skill.id) : [...ids, skill.id]); }}><span className="active-label">{enabled ? "✓ 已启用" : "已取消"}</span><span className="cancel-label">{enabled ? "取消" : "重新启用"}</span></button></header><p>{skill.description}</p>{skill.scope === "mine" && <button className="skill-edit" aria-label={`编辑 ${skill.name}`} type="button" onClick={(event) => { event.stopPropagation(); setEditorSkill(skill); }}><img src={`${A}/edit.svg`} alt="" /></button>}</article>; })}</div> : <div className="library-empty"><img src="/figma-connectors/skill-icon.svg" alt="" /><strong>没有匹配的技能</strong><p>试试切换分类或调整搜索关键词。</p></div>}{editorSkill !== undefined && <SkillEditorModal skill={editorSkill} onClose={() => setEditorSkill(undefined)} onSave={saveSkill} />}{notice && <div className="library-toast">{notice}</div>}</section>;
}

function SkillEditorModal({ skill, onClose, onSave }: { skill: Skill | null; onClose: () => void; onSave: (skill: Skill) => void }) {
  const [name, setName] = useState(skill?.name ?? "");
  const [description, setDescription] = useState(skill?.description ?? "");
  const [category, setCategory] = useState(skill?.category ?? "通用");
  return <div className="modal-layer library-modal-layer"><section className="library-editor-modal"><button className="close" type="button" onClick={onClose}>×</button><header><img src="/figma-connectors/skill-icon.svg" alt="" /><div><h2>{skill ? "编辑关联技能" : "创建技能"}</h2><p>配置技能名称与说明，保存后可在我的技能中使用。</p></div></header><label>技能名称<input value={name} onChange={(event) => setName(event.target.value)} placeholder="请输入技能名称" autoFocus /></label><label>技能分类<select value={category} onChange={(event) => setCategory(event.target.value)}>{["订单", "工单", "售后", "物流", "通用"].map((item) => <option key={item}>{item}</option>)}</select></label><label>技能说明<textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={160} placeholder="请输入技能的使用说明" /></label><footer><button type="button" className="modal-secondary" onClick={onClose}>取消</button><button type="button" className="modal-primary" disabled={!name.trim()} onClick={() => onSave({ id: skill?.id ?? `custom-skill-${Date.now()}`, name: name.trim(), description: description.trim() || "暂无技能说明。", category, scope: "mine" })}>保存</button></footer></section></div>;
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
  const [view, setView] = useState<"cards" | "list">("cards");
  const [filter, setFilter] = useState("全部");
  const [queryDraft, setQueryDraft] = useState("");
  const [query, setQuery] = useState("");
  const [connectorStates, setConnectorStates] = useState<Record<string, boolean>>(() => Object.fromEntries(connectorCatalog.map((connector) => [connector.id, connector.authorized])));
  const [accountCounts, setAccountCounts] = useState<Record<string, number>>(() => Object.fromEntries(connectorCatalog.map((connector) => [connector.id, connector.authorized ? 1 : 0])));
  const [authTarget, setAuthTarget] = useState<Connector | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Connector | null>(null);
  const [notice, setNotice] = useState("");
  const categories = ["全部", "ERP", "应用"];
  const filtered = connectorCatalog.filter((connector) => (filter === "全部" || connector.type === filter) && `${connector.name}${connector.description}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const getConnector = (id: string) => connectorCatalog.find((connector) => connector.id === id) ?? connectorCatalog[0];
  const saveAuthorization = (id: string, accounts: number) => {
    setConnectorStates((states) => ({ ...states, [id]: true }));
    setAccountCounts((counts) => ({ ...counts, [id]: Math.max(1, accounts) }));
    setAuthTarget(null);
    setNotice("连接器授权配置已保存");
  };
  const cancelAuthorization = () => {
    if (!cancelTarget) return;
    setConnectorStates((states) => ({ ...states, [cancelTarget.id]: false }));
    setAccountCounts((counts) => ({ ...counts, [cancelTarget.id]: 0 }));
    setCancelTarget(null);
    setNotice(`已取消与${cancelTarget.name}的连接`);
  };
  const openConnector = (connector: Connector) => { setAuthTarget(connector); };

  return <main className="expert-hub connector-hub"><PlatformRail /><header className="expert-hub-head"><button type="button" onClick={onBack}>‹ 返回</button><a href="/?design=1404-1493&expert=1&section=experts">专家</a><a href="/?design=1404-1493&expert=1&section=skills">技能</a><a className="on" href="/?design=1404-1493&expert=1&section=connectors">连接器</a></header><section className="library-page connector-center"><div className="expert-toolbar expert-category-toolbar skill-management-row"><nav aria-label="连接器类型筛选">{categories.map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</nav><div className="library-actions"><div className="view-toggle"><button aria-label="列表视图" className={view === "list" ? "on" : ""} onClick={() => setView("list")} type="button"><img src={`${A}/view-list.svg`} alt="" /></button><button aria-label="卡片视图" className={view === "cards" ? "on" : ""} onClick={() => setView("cards")} type="button"><img src={`${A}/view-cards.svg`} alt="" /></button></div><label className="library-search"><img src={`${A}/search-expert.svg`} alt="" /><input value={queryDraft} onChange={(event) => setQueryDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") setQuery(queryDraft); }} placeholder="搜索连接器名称" /></label><button className="library-query" type="button" onClick={() => setQuery(queryDraft)}>查询</button></div></div>{filtered.length ? <div className={`connector-grid ${view}`}>{filtered.map((connector) => <article className="connector-card" key={connector.id} onClick={() => openConnector(connector)}><header><div className="connector-logo"><img src={connector.logo} alt="" /></div><div className="connector-name"><strong>{connector.name}</strong><span>{connector.type}</span></div>{connectorStates[connector.id] && <button className="connector-auth-status" type="button" onClick={(event) => { event.stopPropagation(); setCancelTarget(connector); }}><span className="active-label">✓ 已授权</span><span className="cancel-label">取消授权</span></button>}</header><p>{connector.description}</p><footer><small>{connectorStates[connector.id] ? (accountCounts[connector.id] > 1 ? `${accountCounts[connector.id]} 个账号` : "") : "尚未连接"}</small>{!connectorStates[connector.id] && <button className="connect" type="button" onClick={(event) => { event.stopPropagation(); openConnector(connector); }}>授权连接</button>}</footer></article>)}</div> : <div className="library-empty"><strong>没有匹配的连接器</strong><p>试试切换分类或调整搜索关键词。</p></div>}{authTarget && <ConnectorAuthModal connector={authTarget} accountCount={accountCounts[authTarget.id] || 1} onClose={() => setAuthTarget(null)} onSave={(accounts) => saveAuthorization(authTarget.id, accounts)} />}{cancelTarget && <ConnectorCancelModal connector={cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={cancelAuthorization} />}{notice && <div className="library-toast">{notice}</div>}</section></main>;
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

function TaskDetailPanel({ detailTab, onTab, selected, onNotice }: { detailTab: string; onTab: (tab: string) => void; selected: typeof taskData[number]; onNotice: (message: string) => void }) {
  const tabs = ["概览", "工单", "订单", "物流", "会话"];
  const [pendingTickets, setPendingTickets] = useState(["941525", "941387", "941320", "941179", "941162", "940895"]);
  const [openRecords, setOpenRecords] = useState<Set<number>>(new Set());
  useEffect(() => {
    setPendingTickets(["941525", "941387", "941320", "941179", "941162", "940895"]);
    setOpenRecords(new Set());
  }, [selected.order]);
  const expertRecords = [
    { name: "朱迪测试3", updated: "2026-09-03 15:44:14", trigger: "工单编辑", steps: ["读取售后单与订单信息", "判断售后处理条件", "等待人工确认", "输出处理结论"], conclusion: selected.conclusion },
    { name: "打款工单审核", updated: "2026-09-03 15:43:44", trigger: "手动触发", steps: ["读取打款工单上下文", "核对退款申请信息", "生成审核建议"], conclusion: "已完成打款工单信息核验，等待人工确认" },
    { name: "朱迪测试2", updated: "2026-08-18 14:22:14", trigger: "工单编辑", steps: ["读取当前任务", "同步平台订单状态", "保存专家判断"], conclusion: "任务上下文已同步完成" },
    { name: "「退货退款审核决策」专家", updated: "2026-08-18 11:14:49", trigger: "手动触发", steps: ["解析订单及会话数据", "核对退款申请信息", "输出结构化审核报告"], conclusion: "订单、凭证与会话信息已完成交叉核验" },
    { name: "未知类型", updated: "2026-08-17 16:33:54", trigger: "手动触发", steps: ["读取任务输入", "等待关联工单", "结束当前处理链路"], conclusion: "当前专家记录已归档" },
  ];
  const toggleRecord = (index: number) => setOpenRecords((current) => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index); else next.add(index);
    return next;
  });
  const closeTicket = (ticket: string) => {
    setPendingTickets((tickets) => tickets.filter((item) => item !== ticket));
    onNotice(`工单 ${ticket} 已关闭`);
  };
  const copyOrder = () => {
    if (navigator.clipboard) void navigator.clipboard.writeText(selected.order).catch(() => undefined);
    onNotice("订单号已复制");
  };
  return <section className="task-v2-detail">
    <header className="task-v2-detail-tabs"><nav>{tabs.map((tab) => <button type="button" className={detailTab === tab ? "on" : ""} onClick={() => onTab(tab)} key={tab}>{tab}</button>)}</nav><button type="button" aria-label="刷新详情" onClick={() => onNotice("任务详情已刷新")}><img src={`${A}/refresh-detail.svg`} alt="" /></button></header>
    {detailTab === "概览" ? <div className="task-v2-detail-scroll"><div className="task-v2-detail-content task-v2-figma-detail"><h1>{selected.detail}</h1>
      <article className="task-v2-task-card task-v2-primary-card">
        <h2>{selected.expert}</h2>
        <p className="task-v2-description">已准备跳转抖音售后详情页面，需人工确认后执行。</p>
        <strong className="task-v2-card-label">售后信息：</strong>
        <ul className="task-v2-bullet-list"><li>售后单号：147631274984062150</li><li>订单号：{selected.order}</li><li>商品：家用桌面收纳盒含化妆品杂物零食玩具整理置物储物筐</li><li>售后类型：发货前退款</li><li>售后状态：售后成功</li></ul>
        <p className="task-v2-instruction">请点击「前往平台售后详情」按钮跳转售后台处理。</p>
        <footer className="task-v2-task-actions"><button type="button" className="task-v2-button-primary" onClick={() => onNotice("已打开平台售后详情")}><span aria-hidden="true">↗</span>前往平台售后详情</button><button type="button" className="task-v2-button-secondary" onClick={() => onNotice("任务已标记为完成")}><span aria-hidden="true">✓</span>任务完成</button></footer>
      </article>
      <article className="task-v2-task-card task-v2-interrupted-card">
        <h2>售后处理专家</h2>
        <p className="task-v2-description">工单 941549 已被删除，无法更新。其余 6 个工单已停止执行，当前任务挂起。</p>
        <section className="task-v2-interrupted-actions"><header><strong>待关闭工单</strong><span>{pendingTickets.length} 项</span></header><p>点击下列工单逐项执行关闭，全部处理后再完成当前任务。</p>{pendingTickets.length ? <div className="task-v2-ticket-grid">{pendingTickets.map((ticket) => <button type="button" className="task-v2-ticket-button" onClick={() => closeTicket(ticket)} key={ticket}><span aria-hidden="true">↗</span>关闭工单 {ticket}</button>)}</div> : <div className="task-v2-ticket-complete"><img src={`${A}/complete.svg`} alt="" />待关闭工单已全部处理</div>}<button type="button" className="task-v2-button-secondary task-v2-complete-button" onClick={() => onNotice(pendingTickets.length ? "请先关闭全部待关闭工单" : "任务已标记为完成")}><span aria-hidden="true">✓</span>任务完成</button></section>
      </article>
      <section className="task-v2-order-context"><div className="task-v2-order-line"><span>交易被平台关闭</span><b>退款完结</b><span>订单号：{selected.order}</span><button type="button" className="task-v2-copy-button" onClick={copyOrder} aria-label="复制订单号"><img src={`${A}/copy-detail.svg`} alt="" /></button><span>创建：2026-08-14 09:17:12</span><button type="button" className="task-v2-link" onClick={() => onNotice("已打开订单详情")}>查看详情</button></div><p><span aria-hidden="true">▧</span>1234覆盖备注：2026-09-03 15:43:04</p></section>
      <section className="task-v2-records task-v2-figma-records"><header><img src={`${A}/task-detail.svg`} alt="" /><strong>任务详情</strong></header>{expertRecords.map((record, recordIndex) => { const isOpen = openRecords.has(recordIndex); return <article className={`task-v2-expert-record ${isOpen ? "open" : ""}`} key={record.name}><header><button type="button" onClick={() => toggleRecord(recordIndex)} aria-expanded={isOpen}><img src={`${A}/expand.svg`} alt="" /><strong>{record.name}</strong><span>更新于 {record.updated}</span></button><button type="button" onClick={() => onNotice(`已打开${record.name}的关联工单`)}>关联工单</button></header>{isOpen && <div className="task-v2-record-body"><div><b>处理记录</b><button type="button" onClick={() => onNotice("已打开过程回放")}>⌁　过程回放</button></div><section><header><span>{record.trigger}</span><b>最新</b><time>{record.updated}</time></header>{record.steps.map((step, index) => <p key={step}><i>{index + 1}</i>{step}<time>0.{index + 1}{index + 2}s</time><img src={`${A}/expand.svg`} alt="" /></p>)}</section><footer><strong>✓　结论</strong><p>{record.conclusion}。任务处理记录已保存，可继续关联工单或查看完整过程。</p></footer></div>}</article>; })}</section>
    </div></div> : <div className="task-v2-placeholder"><img src={`${A}/task-detail.svg`} alt="" /><strong>{detailTab}信息</strong><p>当前任务的{detailTab}内容已准备就绪。</p></div>}
  </section>;
}

function LegacyTaskDetailPanel({ detailTab, onTab, selected, onNotice }: { detailTab: string; onTab: (tab: string) => void; selected: typeof taskData[number]; onNotice: (message: string) => void }) {
  const tabs = ["概览", "工单", "订单", "物流", "会话"];
  const [openRecords, setOpenRecords] = useState<Set<number>>(new Set([0]));
  useEffect(() => setOpenRecords(new Set([0])), [selected.order]);
  const canShowEvidence = selected.expert.includes("图片") || selected.detail.includes("包裹");
  const expertRecords = [
    { name: selected.expert, updated: "2026-09-03 15:44:14", steps: ["读取任务上下文", "执行专家判断", "输出处理结论"], conclusion: selected.conclusion },
    { name: "「工单创建与跟进」专家", updated: "2026-09-03 15:42:08", steps: ["读取处理方案", "调用工具创建工单", "更新工单截止时间", "保存关联结果"], conclusion: `已根据“${selected.title}”创建跟进工单，并同步任务处理状态` },
    { name: "「退货退款审核决策」专家", updated: "2026-09-03 15:39:26", steps: ["解析订单及会话数据", "核对退款申请信息", "输出结构化审核报告"], conclusion: "订单、凭证与会话信息已完成交叉核验，审核依据已归档" },
  ];
  const toggleRecord = (index: number) => setOpenRecords((current) => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index); else next.add(index);
    return next;
  });
  return <section className="task-v2-detail">
    <header className="task-v2-detail-tabs"><nav>{tabs.map((tab) => <button type="button" className={detailTab === tab ? "on" : ""} onClick={() => onTab(tab)} key={tab}>{tab}</button>)}</nav><button type="button" aria-label="刷新详情" onClick={() => onNotice("任务详情已刷新")}><img src={`${A}/refresh-detail.svg`} alt="" /></button></header>
    {detailTab === "概览" ? <div className="task-v2-detail-scroll"><div className="task-v2-detail-content"><h1>{selected.detail}</h1><article className="task-v2-result-card"><header><span><i />{selected.expert}</span><time>2026-09-03 15:44:14</time></header><h2>{selected.criterion}</h2><p className="task-v2-result-request">识别需求：{selected.summary}，并给出可追溯的判断依据。</p><div className={`task-v2-evidence ${canShowEvidence ? "with-evidence" : ""}`}><div className="task-v2-evidence-preview"><div><span>图片凭证</span></div>{canShowEvidence && <div><span>参考图片</span></div>}<small>{canShowEvidence ? "买家上传的凭证图片 · 2 张" : "任务上下文数据 · 已同步"}</small></div><div className="task-v2-evidence-copy"><strong>{selected.conclusion}</strong><p>置信度　{selected.confidence}</p><b>判断依据</b><ol>{selected.evidence.map((item) => <li key={item}>{item}</li>)}</ol></div></div><div className="task-v2-conclusion">结论：{selected.conclusion}，建议根据当前结果继续执行后续处理流程。</div><footer><button type="button" onClick={() => onNotice("已打开平台售后详情")}>↗　前往平台售后详情</button><button type="button" onClick={() => onNotice("任务已标记为完成")}>✓　标记任务完成</button></footer></article><section className="task-v2-context"><div><span>{selected.status === "已完成" ? "任务执行完成" : "图片识别完成"}</span><b>{selected.status}</b><span>订单号：{selected.order}</span><button type="button" onClick={() => onNotice("订单号已复制")} aria-label="复制订单号"><img src={`${A}/copy.svg`} alt="" /></button><span>创建：2026-08-14 09:17:12</span><button type="button" className="task-v2-link" onClick={() => onNotice("已打开任务详情")}>查看详情</button></div><p>▧　{selected.summary}</p></section><section className="task-v2-records"><header><img src={`${A}/task-detail.svg`} alt="" /><strong>任务详情</strong><span>{expertRecords.length} 个专家记录</span></header>{expertRecords.map((record, recordIndex) => { const isOpen = openRecords.has(recordIndex); return <article className={`task-v2-expert-record ${isOpen ? "open" : ""}`} key={record.name}><header><button type="button" onClick={() => toggleRecord(recordIndex)} aria-expanded={isOpen}><i>›</i><strong>{record.name}</strong><span>更新于 {record.updated}</span></button><button type="button" onClick={() => onNotice("已打开关联工单")}>关联工单</button></header>{isOpen && <div className="task-v2-record-body"><div><b>处理记录</b><button type="button" onClick={() => onNotice("已打开过程回放")}>⌁　过程回放</button></div><section><header><span>{selected.mode === "人工" ? "手动触发" : "自动触发"}</span><b>最新</b><time>{record.updated}</time></header>{record.steps.map((step, index) => <p key={step}><i>{index + 1}</i>{step}<time>0.{index + 1}{index + 2}s</time></p>)}</section><footer><strong>✓　结论</strong><p>{record.conclusion}。任务处理记录已保存，可继续关联工单或查看完整过程。</p></footer></div>}</article>; })}</section></div></div> : <div className="task-v2-placeholder"><img src={`${A}/task-detail.svg`} alt="" /><strong>{detailTab}信息</strong><p>当前任务的{detailTab}内容已准备就绪。</p></div>}
  </section>;
}
