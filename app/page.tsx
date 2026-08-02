"use client";

import { useMemo, useState } from "react";

type View = "market" | "profile" | "workbench";
type Direction = "brand" | "warm";

const experts = [
  {
    id: "refund",
    name: "朱迪",
    role: "售后退款审核专家",
    image: "/expert-manager.png",
    tint: "peach",
    intro: "稳妥处理退货、退款与高风险客诉，让售后高峰也保持从容。",
    tags: ["退款审核", "情绪安抚", "风险识别"],
    fit: "95%",
    used: "32 家团队在用",
    category: "售后服务",
  },
  {
    id: "ops",
    name: "多来米",
    role: "店铺运营导航专家",
    image: "/expert-navigator.png",
    tint: "cream",
    intro: "熟悉店铺规则与经营路径，帮新人快速找到正确的下一步。",
    tags: ["店铺导航", "规则问答", "流程指引"],
    fit: "91%",
    used: "18 家团队在用",
    category: "店铺运营",
  },
  {
    id: "content",
    name: "元吉",
    role: "内容创意与转化专家",
    image: "/expert-wizard.png",
    tint: "lilac",
    intro: "把产品卖点变成更好懂、更有吸引力的内容与活动方案。",
    tags: ["内容生成", "活动策划", "素材优化"],
    fit: "88%",
    used: "24 家团队在用",
    category: "内容营销",
  },
  {
    id: "support",
    name: "犇犇助手",
    role: "通用业务协同专家",
    image: "/expert-default.png",
    tint: "sky",
    intro: "从资料整理到任务跟进，接住团队里重复却重要的日常工作。",
    tags: ["资料整理", "任务跟进", "跨团队协同"],
    fit: "84%",
    used: "46 家团队在用",
    category: "团队协作",
  },
];

const tasks = [
  { title: "核对退货入库差异", owner: "朱迪", state: "等你确认", tone: "warn", progress: 82, time: "刚刚", detail: "已比对订单、物流和仓库记录，发现少入库 1 件。" },
  { title: "处理高风险退款申请", owner: "朱迪", state: "正在处理", tone: "run", progress: 56, time: "3 分钟前", detail: "正在核验买家沟通记录与历史退款情况。" },
  { title: "整理本周售后问题趋势", owner: "多来米", state: "已完成", tone: "done", progress: 100, time: "12 分钟前", detail: "已生成 5 条趋势洞察和 3 项优化建议。" },
];

const navItems: Array<{ id: View; icon: string; label: string }> = [
  { id: "market", icon: "⌁", label: "招聘大厅" },
  { id: "profile", icon: "◎", label: "我的专家" },
  { id: "workbench", icon: "✓", label: "协同工作台" },
];

export default function Home() {
  const [view, setView] = useState<View>("market");
  const [direction, setDirection] = useState<Direction>("brand");
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof experts)[number] | null>(null);
  const [hired, setHired] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => experts.filter((expert) => {
    const inCategory = category === "全部" || expert.category === category;
    const matches = `${expert.name}${expert.role}${expert.tags.join("")}`.includes(query.trim());
    return inCategory && matches;
  }), [category, query]);

  const hire = (expert: (typeof experts)[number]) => {
    setHired((items) => items.includes(expert.id) ? items : [...items, expert.id]);
    setToast(`${expert.name} 已加入你的数字团队`);
    setSelected(null);
    window.setTimeout(() => setToast(""), 2600);
  };

  return (
    <main className={`app-shell ${direction === "warm" ? "direction-warm" : "direction-brand"}`}>
      <aside className="rail" aria-label="一级导航">
        <button className="brand-mark" aria-label="犇犇AI首页"><span>犇</span></button>
        <div className="rail-group">
          <button className="rail-item"><span>⌂</span><small>首页</small></button>
          <button className="rail-item active"><span>●</span><small>犇犇</small></button>
          <button className="rail-item"><span>◫</span><small>消费者</small></button>
          <button className="rail-item"><span>⌁</span><small>小程序</small></button>
          <button className="rail-item"><span>◇</span><small>罗盘</small></button>
          <button className="rail-item"><span>⌘</span><small>安维</small></button>
        </div>
        <div className="rail-spacer" />
        <button className="rail-item"><span>⌕</span><small>搜索</small></button>
        <button className="rail-avatar" aria-label="个人中心">米</button>
      </aside>

      <aside className="section-nav">
        <div className="product-title">
          <span className="mini-logo">犇</span>
          <div><strong>犇犇AI</strong><small>数字员工工作台</small></div>
        </div>
        <p className="section-eyebrow">数字团队</p>
        <nav>
          {navItems.map((item) => (
            <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}>
              <span>{item.icon}</span>{item.label}
              {item.id === "workbench" && <b>3</b>}
            </button>
          ))}
        </nav>
        <div className="nav-divider" />
        <p className="section-eyebrow">团队管理</p>
        <nav className="secondary-links">
          <button><span>▦</span>专家考核</button>
          <button><span>◇</span>入职资料</button>
          <button><span>⚙</span>团队设置</button>
        </nav>
        <div className="nav-insight">
          <span>本周团队进展</span>
          <strong>节省 42.5 小时</strong>
          <div><i style={{ width: "72%" }} /></div>
          <small>比上周多释放 8.2 小时</small>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="breadcrumb">犇犇AI / {view === "market" ? "招聘大厅" : view === "profile" ? "专家档案" : "协同工作台"}</span>
          </div>
          <div className="top-actions">
            <div className="direction-switch" aria-label="方案切换">
              <button className={direction === "brand" ? "active" : ""} onClick={() => setDirection("brand")}>A · 品牌克制版</button>
              <button className={direction === "warm" ? "active" : ""} onClick={() => setDirection("warm")}>B · 温暖伙伴版</button>
            </div>
            <button className="icon-button" aria-label="帮助">?</button>
            <button className="user-pill"><span>田</span>天成</button>
          </div>
        </header>

        {view === "market" && (
          <MarketPage
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            experts={filtered}
            hired={hired}
            onSelect={setSelected}
            onHire={hire}
          />
        )}
        {view === "profile" && <ProfilePage direction={direction} />}
        {view === "workbench" && <WorkbenchPage />}
      </section>

      {selected && <ExpertModal expert={selected} hired={hired.includes(selected.id)} onClose={() => setSelected(null)} onHire={() => hire(selected)} />}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}

function MarketPage({ query, setQuery, category, setCategory, experts: cards, hired, onSelect, onHire }: {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  experts: typeof experts;
  hired: string[];
  onSelect: (expert: (typeof experts)[number]) => void;
  onHire: (expert: (typeof experts)[number]) => void;
}) {
  const categories = ["全部", "售后服务", "店铺运营", "内容营销", "团队协作"];
  return (
    <div className="page market-page">
      <section className="market-hero">
        <div className="hero-copy">
          <span className="hero-kicker">数字专家招聘大厅</span>
          <h1>今天，想让哪位专家<br />帮团队轻松一点？</h1>
          <p>说出你想解决的工作，我们会推荐能立即上岗的数字员工。</p>
          <label className="hero-search">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="试试搜索：处理退款、生成活动文案…" />
            <kbd>⌘ K</kbd>
          </label>
          <div className="quick-needs">
            <span>最近大家在找</span>
            <button onClick={() => setQuery("退款")}>高峰期退款处理</button>
            <button onClick={() => setQuery("内容")}>活动内容生成</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <span className="spark spark-one">✦</span>
          <span className="spark spark-two">✦</span>
          <div className="hero-bubble bubble-one"><i>✓</i>工作交付更稳定</div>
          <div className="hero-bubble bubble-two"><i>↗</i>每天释放 3.5 小时</div>
          <div className="hero-image-wrap">
            <img src="/expert-navigator.png" alt="" />
          </div>
        </div>
      </section>

      <section className="market-content">
        <div className="section-heading">
          <div><span>官方精选</span><h2>为你的业务挑一位合拍的专家</h2><p>能力已经过验证，入职后仍可按团队习惯继续培养。</p></div>
          <button className="text-button">查看全部 18 位 <span>→</span></button>
        </div>
        <div className="category-tabs" role="tablist">
          {categories.map((item) => <button key={item} className={item === category ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="expert-grid">
          {cards.map((expert) => (
            <article className={`expert-card ${expert.tint}`} key={expert.id}>
              <button className="card-main" onClick={() => onSelect(expert)} aria-label={`查看${expert.name}的简历`}>
                <div className="expert-portrait"><img src={expert.image} alt={`${expert.name}形象`} /></div>
                <div className="expert-info">
                  <div className="expert-meta"><span className="official">官方专家</span><span>{expert.fit} 岗位适配</span></div>
                  <h3>{expert.name}</h3>
                  <strong>{expert.role}</strong>
                  <p>{expert.intro}</p>
                  <div className="tags">{expert.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </button>
              <footer><span><i className="online-dot" />{expert.used}</span><button className={hired.includes(expert.id) ? "hired" : ""} onClick={() => onHire(expert)}>{hired.includes(expert.id) ? "已在团队" : "邀请加入"}</button></footer>
            </article>
          ))}
        </div>
        {cards.length === 0 && <div className="empty-state"><span>⌕</span><h3>暂时没找到合适的专家</h3><p>换个更简单的工作描述试试，我们会继续帮你找。</p></div>}
      </section>
    </div>
  );
}

function ProfilePage({ direction }: { direction: Direction }) {
  const [step, setStep] = useState(1);
  const [advanced, setAdvanced] = useState(false);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState<string[]>(["你好，我是朱迪。可以给我一笔退款订单，看看我会如何处理。"]);
  const steps = [
    { title: "专家名片", sub: "姓名、岗位与工作风格", icon: "01" },
    { title: "工作职责", sub: "告诉她做什么、如何判断", icon: "02" },
    { title: "专业技能", sub: "选择工作中可使用的工具", icon: "03" },
    { title: "入职资料", sub: "补充业务知识与协作对象", icon: "04" },
  ];
  const send = () => {
    if (!chat.trim()) return;
    setMessages((items) => [...items, chat, "我会先核对订单、退货入库和沟通记录；若差异确认无误，再给出退款建议并请你确认。"]);
    setChat("");
  };
  return (
    <div className="page profile-page">
      <div className="profile-header">
        <div className="profile-identity">
          <div className="profile-avatar"><img src="/expert-manager.png" alt="朱迪专家形象" /><i /></div>
          <div><div className="title-line"><h1>朱迪</h1><span>在岗</span></div><p>售后退款审核专家 · 客服解决方案组</p><small>“把复杂的售后问题，处理得有理也有温度。”</small></div>
        </div>
        <div className="profile-stats"><div><strong>246</strong><span>已完成工作</span></div><div><strong>94%</strong><span>独立完成率</span></div><div><strong>4.8</strong><span>团队满意度</span></div></div>
        <div className="header-buttons"><button className="ghost-button">预览简历</button><button className="primary-button">保存并安排上岗</button></div>
      </div>

      <div className="onboarding-banner"><div><span>✦</span><strong>入职准备度 75%</strong><p>再补充一份退款规则，朱迪就能更准确地独立处理。</p></div><button onClick={() => setStep(3)}>去补充资料 <span>→</span></button></div>

      <div className="profile-layout">
        <aside className="steps-card">
          <div className="steps-title"><span>专家入职</span><b>3 / 4 已完成</b></div>
          {steps.map((item, index) => (
            <button key={item.title} className={step === index ? "active" : ""} onClick={() => setStep(index)}>
              <span className={index < 3 ? "complete" : ""}>{index < 3 ? "✓" : item.icon}</span>
              <div><strong>{item.title}</strong><small>{item.sub}</small></div>
              <i>›</i>
            </button>
          ))}
          <div className="advanced-link"><button onClick={() => setAdvanced(!advanced)}>⚙ 高级能力设置 <span>{advanced ? "−" : "+"}</span></button>{advanced && <div><label>推理模型<select defaultValue="auto"><option value="auto">智能选择（推荐）</option></select></label><label>自主行动上限<input type="range" defaultValue="60" /></label></div>}</div>
        </aside>

        <section className="resume-editor">
          <div className="editor-heading"><span>02</span><div><h2>工作职责</h2><p>像给新同事做入职介绍一样，说明她要完成的工作。</p></div><button>查看填写示例</button></div>
          <div className="form-block">
            <div className="form-label"><div><strong>她主要负责什么？</strong><span>用一句话说清楚岗位价值</span></div><small>30 / 80</small></div>
            <input defaultValue="审核退货退款申请，识别风险并给出清晰、稳妥的处理建议" />
          </div>
          <div className="form-block">
            <div className="form-label"><div><strong>遇到一项工作时，她会怎么做？</strong><span>我们已把配置语言整理成可读的工作准则</span></div><button className="ai-button">✦ AI 帮我优化</button></div>
            <div className="guideline-editor">
              <div className="guideline"><span>1</span><div><strong>先了解情况</strong><p>核对订单、售后申请、仓库入库差异与客户沟通记录。</p></div><button aria-label="拖动">⋮⋮</button></div>
              <div className="guideline"><span>2</span><div><strong>判断退款是否合理</strong><p>结合团队规则和历史记录，识别信息缺失、高风险或需要升级的情况。</p></div><button aria-label="拖动">⋮⋮</button></div>
              <div className="guideline"><span>3</span><div><strong>给出下一步建议</strong><p>清楚说明建议同意、拒绝或补充材料，并标注判断依据。</p></div><button aria-label="拖动">⋮⋮</button></div>
              <button className="add-guideline">＋ 添加一条工作准则</button>
            </div>
          </div>
          <div className="form-block compact-block"><div className="form-label"><div><strong>她的工作风格</strong><span>决定与客户和同事协作时的表达方式</span></div></div><div className="choice-chips"><button className="active">稳妥细致</button><button>耐心友好</button><button>简洁直接</button><button>先给结论</button><button>＋ 自定义</button></div></div>
        </section>

        <aside className="preview-panel">
          <div className="preview-heading"><div><span>●</span><strong>试岗对话</strong></div><button>清空</button></div>
          <p className="preview-tip">给朱迪一项真实工作，立即感受她的判断与表达。</p>
          <div className="chat-window">
            {messages.map((message, index) => <div key={`${message}-${index}`} className={index % 3 === 1 ? "chat-user" : "chat-expert"}>{index % 3 !== 1 && <span><img src="/expert-manager.png" alt="" /></span>}<p>{message}</p></div>)}
          </div>
          <div className="suggestions"><button onClick={() => setChat("订单已退款但仓库少入库 1 件，应该怎么处理？")}>试试：仓库少入库 1 件</button><button onClick={() => setChat("客户情绪激动并要求立即全额退款")}>试试：客户情绪激动</button></div>
          <div className="chat-input"><textarea value={chat} onChange={(event) => setChat(event.target.value)} placeholder="交给朱迪一项工作…" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} /><button onClick={send} aria-label="发送">↑</button></div>
          <small className="preview-footnote">试岗不会影响真实业务数据</small>
        </aside>
      </div>
      {direction === "warm" && <div className="warm-helper"><img src="/expert-wizard.png" alt="元吉助手" /><div><strong>需要一点灵感？</strong><span>我可以帮你把岗位说明变得更好懂。</span></div><button>帮我完善</button></div>}
    </div>
  );
}

function WorkbenchPage() {
  const [filter, setFilter] = useState("全部工作");
  const shown = filter === "全部工作" ? tasks : filter === "需要我处理" ? tasks.filter((task) => task.tone === "warn") : tasks.filter((task) => task.tone === "run");
  return (
    <div className="page workbench-page">
      <div className="page-title-row"><div><span className="hero-kicker">协同工作台</span><h1>早上好，团队正在稳稳推进</h1><p>3 位专家在岗，只有 1 项工作需要你确认。</p></div><button className="primary-button">＋ 交办新工作</button></div>
      <section className="metric-strip">
        <div className="metric-card main"><span>今日团队进展</span><strong>已完成 86 项工作</strong><p><i>↗</i> 比昨天提前 1.8 小时</p><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
        <div className="metric-card"><span>独立完成率</span><strong>92.4%</strong><p className="good">稳定提升 3.2%</p></div>
        <div className="metric-card"><span>为团队释放时间</span><strong>12.6 <small>小时</small></strong><p>相当于 1.6 个工作日</p></div>
        <div className="metric-card attention"><span>需要你接力</span><strong>1 <small>项</small></strong><p>预计 2 分钟可完成</p></div>
      </section>
      <div className="work-layout">
        <section className="task-board">
          <div className="board-header"><div><h2>今天的工作</h2><span>共 3 项</span></div><div>{["全部工作", "需要我处理", "处理中"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
          <div className="task-list">
            {shown.map((task) => <article key={task.title} className={`task-row ${task.tone}`}><div className="task-status"><span>{task.tone === "done" ? "✓" : task.tone === "warn" ? "!" : "↻"}</span></div><div className="task-copy"><div><h3>{task.title}</h3><span>{task.time}</span></div><p>{task.detail}</p><div className="task-progress"><i style={{ width: `${task.progress}%` }} /></div><footer><span className={`state ${task.tone}`}>{task.state}</span><span>负责人 · {task.owner}</span></footer></div><button className={task.tone === "warn" ? "primary-small" : "more-button"}>{task.tone === "warn" ? "查看并确认" : "•••"}</button></article>)}
          </div>
        </section>
        <aside className="team-panel"><div className="team-title"><h2>今天谁在忙</h2><button>查看团队</button></div>{experts.slice(0, 3).map((expert, index) => <div className="team-member" key={expert.id}><span className={`member-avatar ${expert.tint}`}><img src={expert.image} alt="" /><i /></span><div><strong>{expert.name}</strong><small>{index === 0 ? "正在审核 2 笔退款" : index === 1 ? "正在整理周报" : "等待新的工作"}</small></div><b>{index === 2 ? "空闲" : `${index + 1} 项`}</b></div>)}<div className="team-quote"><span>“</span><p>复杂任务减少了，团队更有时间做好客户沟通。</p><small>— 客服解决方案组 · 本周反馈</small></div></aside>
      </div>
    </div>
  );
}

function ExpertModal({ expert, hired, onClose, onHire }: { expert: (typeof experts)[number]; hired: boolean; onClose: () => void; onHire: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section className="expert-modal" role="dialog" aria-modal="true" aria-label={`${expert.name}的专家简历`}><button className="modal-close" onClick={onClose} aria-label="关闭">×</button><div className={`modal-hero ${expert.tint}`}><div className="modal-portrait"><img src={expert.image} alt={`${expert.name}形象`} /></div><div><span className="official">官方认证专家</span><h2>{expert.name}</h2><strong>{expert.role}</strong><p>{expert.intro}</p><div className="tags">{expert.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></div><div className="modal-body"><div className="resume-section"><span>01</span><div><h3>适合什么时候邀请她？</h3><p>售后高峰、规则判断复杂，或团队希望减少重复核对时。她会先整理事实，再给出有依据的建议。</p></div></div><div className="resume-section"><span>02</span><div><h3>她会如何开展工作？</h3><ul><li>先核对订单、沟通与履约记录</li><li>按业务规则识别风险和信息缺口</li><li>给出清晰结论，并把需要你决定的事单独标出</li></ul></div></div><div className="resume-section"><span>03</span><div><h3>入职后你仍然掌控</h3><p>可随时调整职责、资料与权限。正式上岗前，先通过真实案例试岗。</p></div></div></div><footer><div><span>{expert.fit}</span><small>与你当前团队的岗位适配度</small></div><button className="ghost-button" onClick={onClose}>再看看</button><button className="primary-button" onClick={onHire}>{hired ? "已在团队" : "邀请加入团队"}</button></footer></section></div>;
}
