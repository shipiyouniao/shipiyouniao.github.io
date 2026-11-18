export default {
  zh: {
    "incremental-eviction": {
      title: "释放一个缓存块，为什么要扫一遍整个池子？",
      summary:
        "缓存池里留着 1000 个块时，每释放一个块，旧代码就要把候选块重新分组、排序。改成只更新有变化的页后，这一步从约 260 微秒降到了约 20 微秒。",
      problem: "每次缓存裁剪都重新分组和排序全部可淘汰块。",
      change: "仅刷新变化的页，按代价与近期使用顺序选择候选。",
      evidence:
        "T4 单块裁剪微基准从约 260 微秒降至约 20 微秒，不等于推理吞吐提升。",
    },
    "async-unmap": {
      title: "等最后一批 GPU 任务跑完，再回收缓存页",
      summary:
        "一个请求已经返回，排在后面的 GPU 任务却还可能读取它用过的页。现在等这些任务跑完，再把页交回分配器。",
      problem: "后续批次仍持有 block table，物理页却已被撤销映射。",
      change: "先记录退休页，再通过 Worker 队列屏障确认安全释放。",
      evidence:
        "真实 CUDA 映射故障注入与单 T4 服务 A/B 验证，明确区分多卡与退出阶段边界。",
    },
    "hybrid-retry": {
      title: "显存分配失败后，撤回这一次的改动",
      summary:
        "几个缓存组一起申请显存，前一组已经改了记录，后一组才失败。重试前得撤回这一次的改动，还要留住请求之前算好的状态。",
      problem: "后一个缓存组分配失败时，前一个组可能已移动哈希并排入复制任务。",
      change: "只撤销本轮未发布的分配，并阻止运行态覆盖旧检查点。",
      evidence:
        "vLLM 0.28/0.29 原生管理器测试及 T4 tiny hybrid 故障恢复，未扩展为完整模型质量结论。",
    },
    name: "石皮幼鸟",
    home: "首页",
    notes: "PR 手记",
    projects: "项目",
    about: "关于我",
    skip: "跳到正文",
    nav: "主导航",
    mobileNav: "移动导航",
    toggleNav: "切换导航",
    language: "语言",
    location: "中国 · 深圳",
    mountainAlt: "森林环绕的山谷，远处是云下的雪山",
    allNotes: "全部 PR 手记",
    notesCount: "{count} 篇手记",
    all: "全部",
    filter: "按项目筛选",
    search: "搜索 PR",
    merged: "已合入",
    mergedOn: "合入于 {date}",
    empty: "没有找到匹配的 PR，试试其他关键词。",
    backNotes: "返回 PR 手记",
    problem: "问题",
    change: "修改",
    evidence: "验证与边界",
    source: "查看原始 PR 与讨论",
    gameLabel: "浏览器游戏",
    gameText:
      "我把扫雷做成了一款冒险游戏。你可以一边根据数字推断地雷的位置，一边解谜、探索地图，推进剧情。",
    gameAlt: "Minefarer 游戏中的旅人与灯火营地",
    gameDesign: "游戏设计",
    play: "在浏览器中游玩",
    code: "源代码",
    openSource: "开源项目",
    kvText:
      "KVCached 让推理服务按需申请和归还 GPU 显存。我主要维护它与 vLLM、SGLang 的集成，也处理缓存分配和回收中的问题。",
    repo: "项目仓库",
    nnrpText: "跨语言运行时协议实践。Rust、Python 与 C#。",
    unityText: "面向 Unity 的轻量依赖注入工具。",
    print: "打印或保存为 PDF",
    avatar: "石皮幼鸟的 GitHub 头像",
    fullstack: "全栈工程师",
    company: "深信服 · 中国深圳",
    contributor: "KVCached 维护者之一，参与 vLLM 与 SGLang 开源协作。",
    aboutBody:
      "我最早做 Web 和监控系统，现在主要做大模型推理。平时喜欢写 C#，也用 Unity 和浏览器做游戏。",
    stack: "技术栈",
    frontend: "前端",
    backend: "后端与运行时",
    systems: "系统与推理",
    infra: "基础设施",
    data: "数据库",
    monitoring: "监控与可观测性",
    games: "游戏开发",
    embedded: "嵌入式开发经历",
    native: "原生应用开发经历",
    browserGames: "浏览器游戏",
    contactTitle: "邮箱",
    copyFallback: "请通过邮件地址联系。",
    copied: "邮箱已复制",
    copy: "复制邮箱",
    missing: "这一页还没有写下。",
    backHome: "回到首页",
    biliTitle: "视频、课程与攻略",
    biliBody:
      "我在 B 站用「石皮幼鸟」这个名字发视频，内容从 IIDX 游玩记录到给 Java 程序员录的 C# 课都有。",
    biliHistory:
      "曾在猫霸汉化组担任攻略作者，编写《逆转裁判 6》《大逆转裁判 2》的中文攻略，均为全网首发。",
    biliCourse: "技术课程",
    biliCourseTitle: "面向 Java 程序员的 C# 基础课程",
    biliGuideTitle: "逆转裁判系列 · 中文攻略",
    loadingArticle: "正在加载正文…",
    articleError: "正文加载失败，请刷新重试。",
    contents: "目录",
    copyCode: "复制代码",
    codeCopied: "已复制",
    codeCopyFailed: "复制失败，请选中代码手动复制。",
    sequenceDiagram: "执行时序",
    expandDiagram: "放大时序图",
    closeDiagram: "关闭时序图",
    loadingDiagram: "正在绘制时序图…",
    biliVisit: "Bilibili 主页",
    biliRhythm: "音游记录",
    biliGuide: "游戏攻略",
    biliVideo1: "IIDX · 全皿皆传（EMERALDAS组）",
    biliVideo2: "《魔女之泉》多结局攻略",
    biliWatch: "观看视频",
    description:
      "石皮幼鸟的个人网站，收录 KVCached 和 vLLM 的 PR 手记、个人项目与游戏攻略。",
    "prefix-cache": {
      title: "两个缓存块存了同一段前缀，只登记了一个",
      summary:
        "两个块的内容相同，编号却不同。旧代码看到相同的缓存键就跳过登记，第二个块因此缺少哈希，后续请求可能触发断言。",
      problem:
        "旧索引只为每个缓存 key 保存一个 block。不同请求产生相同前缀时，后登记的物理块可能被当成重复调用跳过，遗漏哈希标记与反向索引。",
      change:
        "将索引改为 cache key → block ID → block。查找仍返回一个可复用块，释放和淘汰则精确到 block ID，避免误删同哈希的其他副本。",
      evidence:
        "PR 记录了 30 项前缀缓存单测通过，以及双实例高并发回放 1440/1440 请求完成。这是该 PR 的验证记录，不是所有模型与版本的通用性能结论。",
    },
    observability: {
      title: "KV 缓存究竟占了多少显存？",
      summary:
        "一个缓存池可以留出很大的地址空间，却只用到其中几页显存。新的查询接口把这两项分开报告，也能查到分配器登记了多少块，其中包括留作备用的块。",
      problem:
        "外部监控需要知道 KV 池的已用、预留、虚拟和已映射容量；直接读取内部字段容易与引擎适配实现耦合。",
      change:
        "提供只读快照、能力查询与弱引用池注册表，接入 vLLM 和 SGLang。指标由 KVCached 维护，采集频率与传输方式留给调用方。",
      evidence:
        "公开 PR 包含 CPU 单测及 RTX 4090 上真实 CUDA VMM 池的分配、快照、释放验证。接口不引入调度策略或容量准入。",
    },
    "worker-rpc": {
      title: "上一条请求为什么还占着内存？",
      summary:
        "上一条请求已经处理完，Python 循环却还引用着它的参数和结果。把一次调用放进单独的函数，两批数据就不必同时留在内存里。",
      problem:
        "Worker 循环在取下一个请求时仍持有上一次的参数和输出引用。含 CPU Tensor 的 RPC 会出现两批反序列化对象同时存活，抬高瞬时内存峰值。",
      change:
        "把单次 RPC 执行移入独立方法，在下一次 dequeue 前释放局部引用。保留错误响应行为，不在热路径加入全局 gc.collect()。",
      evidence:
        "弱引用测试验证了下次出队时旧负载已释放。公开 PR 还记录了 T4 上方法级移植的性能 A/B；正确性测试与这组旧版本容器中的性能测量属于不同验证范围。",
    },
    experience: "工作经历",
    repositoryStats: "GitHub 仓库数据",
    refreshStats: "刷新仓库数据",
    statsLoading: "正在读取 GitHub 数据…",
    statsUnavailable: "暂时无法获取数据，可稍后刷新或前往 GitHub 查看。",
    statsStale: "刷新失败，当前保留上次获取的数据。",
    statsUpdated: "GitHub · 更新于 {time}",
    "allocator-snapshots": {
      title: "让总页数和空闲页数对得上",
      summary:
        "监控先读总页数，再读空闲页数，分配器可能刚好在中间扩容。现在总页数、空闲页、使用中和预留页一起读取，调度器也可以单独查空闲页数。",
      problem: "分配线程与观测线程并发访问页计数器。",
      change: "区分单字段无数据竞争与多字段一致性。",
      evidence: "T4 对比了无同步、互斥锁和原子计数三种实现。",
    },
    "shared-gpu-startup": {
      title: "同卡的另一个进程释放显存，vLLM 却启动失败了",
      summary:
        "vLLM 启动时要估算自己用了多少显存。同卡另一个实例恰好释放显存，整张卡的读数就会误导它，甚至触发启动断言。",
      problem: "整卡空闲显存变化不是本实例的显存开销。",
      change: "使用稳定预算与进程内成本计算逻辑容量。",
      evidence: "vLLM 与 SGLang 在 T4 上完成启动和请求验证。",
    },
    "inference-mode": {
      title: "追查启动时多出来的 11 GiB 显存",
      summary:
        "同一张图、同一个模型，差别出在视觉编码器上。替换启动方法时漏了一行，PyTorch 在试跑时也留下了反向传播要用的数据。",
      problem: "替换方法时遗漏推理模式，保留了不必要的反向图。",
      change: "恢复外层 inference_mode 并增加执行上下文回归测试。",
      evidence: "同输入 A/B 将问题定位到多模态 encoder profiling。",
    },
    openExperience: "开源经历",
    openMemoryTitle: "GPU 显存管理与推理稳定性",
    openMemoryBody: [
      "作为 KVCached 维护者之一，参与弹性 KV Cache 管理、推理引擎适配和代码评审。",
      "重点处理同卡多实例运行中的物理页竞争、多进程映射一致性、异步释放时序，以及前缀缓存块的登记与淘汰问题。",
      "结合真实 GPU 压测和故障注入，检查修复是否兼顾正确性、吞吐和实例间公平性。",
    ],
    openEngineTitle: "vLLM 和 SGLang 的引擎适配",
    openEngineBody: [
      "在 vLLM 里，我处理过 worker 在两次调用之间多占内存的问题。在 KVCached 这边，我会跟进 vLLM 和 SGLang 的版本变化，调整缓存接口。",
      "问题出在引擎本身时，我会把修复提交给上游，后续升级也就少维护一份补丁。",
    ],
    openCollaboration: "可观测性与协作",
    openObservabilityTitle: "KV 缓存监控和代码评审",
    openObservabilityBody: [
      "我给 KVCached 加了只读查询接口，监控可以分别看到池子预留了多少地址空间、实际映射了多少显存、还有多少页可用。",
      "评审相关改动时，我会看复现问题的最小用例，核对计数，再和 GPU 上的实际结果对照。",
    ],
    joined: "深信服 · 2025 年 6 月 25 日入职",
    current: "2026.03 至今",
    sccTitle: "深信服分布式云（SCC）· 前沿技术团队",
    sccBody: [
      "在智算产品团队做大模型推理基础设施，负责技术预研和产品实现。",
      "主要做模型权重共享、KV Cache 池化和弹性调度，让多个推理实例可以共用 GPU 显存。",
    ],
    previous: "2025.06–2026.02",
    foundations: "理论基础",
    foundationMl: "机器学习基础",
    foundationDl: "深度学习基础",
    foundationGraphics: "计算机图形学",
    learningTitle: "从 AI 应用走向推理基础设施",
    learningBody: [
      "2026 年 3 月以前，我主要用 AI 工具、写 Agent。转做推理基础设施后，我花了一个月重新学起大一的线性代数、概率论和数理统计，也补了机器学习和深度学习。",
      "学到的东西很快就在工作里用上了。我开始读推理引擎的源码，跟着一次请求看显存怎么分配，再把能复现的问题修掉。现在也在学模型训练。",
    ],
    scpTitle: "SCP 私有云平台 · 基础架构团队",
    scpBody: [
      "负责监控系统，带领两位外包驻场同事组成开发小组，将全系统 Round Robin Database（RRD）存储迁移至 VictoriaMetrics。",
      "亲自承担方案设计与核心代码开发，涵盖高可用、冷备份和集群副本。",
      "同时定制修改 VictoriaMetrics 源码，加入基于 Ed25519 的握手等安全功能。",
    ],
    dslBody:
      "为内部监控开发写了一个 Python DSL，用它生成 PromQL 和 MetricsQL 查询。工具尚未开源。",
    education: "教育与在校经历",
    university: "成都信息工程大学",
    degree: "软件工程学院 · 软件工程专业 · 本科",
    studioTitle: "Think Different Studio · Web 组组长",
    studioBody:
      "在非同凡想游戏开发协会担任 Web 组组长，负责 Web 前后端技术体系搭建及新人培训。",
    labTitle: "研究生实验室 · 项目开发",
    labBody: [
      "本科期间进入研究生实验室，在教授指导下带领研究生完成多个项目。",
      "其中，负责中国科学院国家授时中心“高精度地基授时系统”操作与监控平台的前后端开发。该系统属于国家“十三五”重大科技基础设施项目。",
    ],
    intro:
      "我是全栈工程师，在深信服做大模型推理。作为 KVCached 的维护者之一，我主要解决多个模型共用一张 GPU 时的显存分配和回收问题。",
    interests: "工作之外，我喜欢写 C#、做扫雷游戏，也在 B 站发音游录像和攻略。",
    allProjects: "全部项目",
  },
  en: {
    "incremental-eviction": {
      title: "Why scan the whole cache to free one block?",
      summary:
        "With 1,000 blocks cached, freeing one block meant sorting candidates across the pool. Updating only the pages that changed cut a single trim from about 260 to 20 microseconds.",
      problem: "Each trim regrouped and sorted the entire evictable pool.",
      change:
        "Refresh changed pages and select candidates by cost and recency.",
      evidence:
        "T4 single-block trim microbenchmarks fell from about 260 to 20 microseconds, not a serving-throughput claim.",
    },
    "async-unmap": {
      title: "Waiting for the last GPU batch before freeing its memory",
      summary:
        "A batch already in the worker queue could still read the page. The fix keeps its memory mapped until the workers finish that batch.",
      problem:
        "A queued batch can retain a block table after its backing page is unmapped.",
      change:
        "Retire empty pages, then establish a worker-queue barrier before release.",
      evidence:
        "Real CUDA fault probes and single-T4 serving A/B, with explicit multi-rank and shutdown limitations.",
    },
    "hybrid-retry": {
      title: "Undoing a half-finished cache allocation",
      summary:
        "One cache group had already moved a block’s lookup key and queued a copy when the next group ran out of memory. Retrying safely meant undoing just that attempt.",
      problem:
        "An earlier group may move hashes and queue copies before a later group fails allocation.",
      change:
        "Undo only the unpublished attempt and protect the existing checkpoint boundary.",
      evidence:
        "Native vLLM 0.28/0.29 tests and T4 tiny-hybrid recovery checks, not full-model quality qualification.",
    },
    name: "shipiyouniao",
    home: "Home",
    notes: "PR notes",
    projects: "Projects",
    about: "About",
    skip: "Skip to content",
    nav: "Main navigation",
    mobileNav: "Mobile navigation",
    toggleNav: "Toggle navigation",
    language: "Language",
    location: "Shenzhen, China",
    mountainAlt: "A forested valley with snow-covered peaks beneath the clouds",
    allNotes: "All PR notes",
    notesCount: "{count} notes",
    all: "All",
    filter: "Filter by project",
    search: "Search PR notes",
    merged: "Merged",
    mergedOn: "Merged on {date}",
    empty: "No matching PRs. Try another search.",
    backNotes: "Back to PR notes",
    problem: "Problem",
    change: "Change",
    evidence: "Evidence and scope",
    source: "Read the original PR and discussion",
    gameLabel: "Browser game",
    gameText:
      "I built a browser adventure around Minesweeper. Use the numbers to work out where the mines are as you explore the map and play through the story.",
    gameAlt: "Travelers at the lantern-lit camp in Minefarer",
    gameDesign: "Game design",
    play: "Play in browser",
    code: "Source code",
    openSource: "Open source",
    kvText:
      "KVCached lets inference servers request GPU memory as they need it and return it when they finish. I work on allocation, reclamation, and integration with vLLM and SGLang.",
    repo: "Repository",
    nnrpText:
      "A cross-language runtime protocol project in Rust, Python, and C#.",
    unityText: "Lightweight dependency injection for Unity.",
    print: "Print or save as PDF",
    avatar: "shipiyouniao's GitHub avatar",
    fullstack: "Full-stack engineer",
    company: "Sangfor Technologies · Shenzhen, China",
    contributor:
      "One of the KVCached maintainers; a contributor to vLLM and SGLang.",
    aboutBody:
      "I started out building web applications and monitoring systems. These days I work on LLM inference. I also enjoy writing C# and making games in Unity and for the browser.",
    stack: "Toolbox",
    frontend: "Frontend",
    backend: "Backend & runtimes",
    systems: "Systems & inference",
    infra: "Infrastructure",
    data: "Databases",
    monitoring: "Monitoring & observability",
    games: "Game development",
    embedded: "Embedded development experience",
    native: "Native app development experience",
    browserGames: "Browser games",
    contactTitle: "Email",
    copyFallback: "Please use the email link to get in touch.",
    copied: "Email copied",
    copy: "Copy email",
    missing: "This page hasn't been written yet.",
    backHome: "Back home",
    biliTitle: "Videos, courses and walkthroughs",
    biliBody:
      "I post on Bilibili as 石皮幼鸟. My videos include IIDX play sessions and a C# course I recorded for Java programmers.",
    biliHistory:
      "Previously a walkthrough author with the 猫霸汉化组 translation team, I published the first Chinese walkthroughs online for Ace Attorney 6 and The Great Ace Attorney 2.",
    biliCourse: "Programming",
    biliCourseTitle: "C# fundamentals for Java programmers",
    biliGuideTitle: "Ace Attorney · Chinese walkthroughs",
    loadingArticle: "Loading article…",
    articleError: "Could not load this article. Please refresh to retry.",
    contents: "Contents",
    copyCode: "Copy code",
    codeCopied: "Copied",
    codeCopyFailed: "Copy failed. Please select and copy the code manually.",
    sequenceDiagram: "Execution sequence",
    expandDiagram: "Expand diagram",
    closeDiagram: "Close diagram",
    loadingDiagram: "Rendering diagram…",
    biliVisit: "Bilibili channel",
    biliRhythm: "Rhythm games",
    biliGuide: "Walkthroughs",
    biliVideo1: "IIDX · All-Scratch Kaiden (EMERALDAS course)",
    biliVideo2: "WitchSpring · Multiple-ending walkthrough",
    biliWatch: "Watch video",
    description:
      "Engineering notes on KVCached and vLLM, browser games, and walkthroughs by shipiyouniao.",
    "prefix-cache": {
      title: "The prefix cache recorded only one of two copies",
      summary:
        "Two blocks can hold the same prefix. The index skipped the second block when it recognized the key, leaving that block without the hash vLLM expected.",
      problem:
        "The old index kept one block per cache key. A distinct block with the same prefix could be mistaken for an idempotent repeat, leaving its hash stamp and reverse-index entry unset.",
      change:
        "Use a cache key → block ID → block index. Lookups still return one reusable block, while release and eviction target an exact ID without deleting sibling copies.",
      evidence:
        "The PR reports 30 passing prefix-cache tests and 1,440/1,440 completed requests in a two-instance high-concurrency replay. This is scoped validation, not a performance claim for every model and version.",
    },
    observability: {
      title: "How much GPU memory is the KV cache actually using?",
      summary:
        "A pool can reserve a large address range while backing only a few pages with GPU memory. A new query reports both figures alongside the allocator’s block count, including blocks held in reserve.",
      problem:
        "Monitoring needs allocated, reserved, virtual, and mapped capacity. Reading private fields couples consumers to allocator and engine-patch implementation details.",
      change:
        "Add read-only snapshots, capability discovery, and a weak-reference pool registry, with vLLM and SGLang integration. KVCached owns measurements; consumers choose polling and transport.",
      evidence:
        "The public PR includes CPU tests and allocation/snapshot/free checks on a real CUDA VMM pool on an RTX 4090. The interface adds no scheduling or admission policy.",
    },
    "worker-rpc": {
      title: "Why was the previous request still in memory?",
      summary:
        "While the worker unpacked its next message, local variables still held the previous payload. Giving each call its own function lets those references go first.",
      problem:
        "The worker loop retained arguments and output while dequeuing the next request. RPCs with CPU tensors could keep two deserialized payloads alive at once, increasing transient memory use.",
      change:
        "Execute each RPC in a separate method so local references are released before the next dequeue. Preserve error responses without forcing global gc.collect() on the hot path.",
      evidence:
        "A weak-reference test checks that the previous payload is gone before the next dequeue. The PR also reports a method-level T4 performance A/B in an older container; that measurement and current-source correctness tests have different scopes.",
    },
    experience: "Experience",
    repositoryStats: "GitHub repository statistics",
    refreshStats: "Refresh repository statistics",
    statsLoading: "Loading GitHub data…",
    statsUnavailable:
      "Data unavailable. Retry later or view the repository on GitHub.",
    statsStale: "Refresh failed. Showing the last retrieved data.",
    statsUpdated: "GitHub · Updated at {time}",
    "allocator-snapshots": {
      title: "Reading page counts that agree with each other",
      summary:
        "The pool could resize between two reads. Monitoring now reads total, free, in-use and reserved pages under one lock, while the scheduler can still read a single counter cheaply.",
      problem: "Allocation and observation access page counters concurrently.",
      change: "Separate data-race freedom from snapshot consistency.",
      evidence:
        "T4 measurements compare unsynchronized, mutex and atomic variants.",
    },
    "shared-gpu-startup": {
      title: "A neighbor freed GPU memory and vLLM failed to start",
      summary:
        "vLLM estimated its own memory use from two device-wide readings. A second process could free memory between them and trip the first process’s startup check.",
      problem: "Device-wide memory changes are not process-local costs.",
      change:
        "Use a stable budget and process-local costs for logical capacity.",
      evidence: "T4 startup and request validation with vLLM and SGLang.",
    },
    "inference-mode": {
      title: "Tracing an extra 11 GiB of memory at startup",
      summary:
        "The model and image were identical. A replacement worker method lost its inference-mode decorator, so PyTorch kept tensors for a backward pass during the vision encoder’s test run.",
      problem: "Replacing a method dropped its inference-mode contract.",
      change: "Restore the decorator and test the execution context.",
      evidence: "Identical-input A/B isolated multimodal encoder profiling.",
    },
    openExperience: "Open-source experience",
    openMemoryTitle: "GPU memory management and inference reliability",
    openMemoryBody: [
      "As one of the KVCached maintainers, I contribute to elastic KV cache management, inference-engine integration and code review.",
      "My work focuses on physical-page contention between instances sharing a GPU, cross-process mapping consistency, asynchronous release ordering, and prefix-cache block registration and eviction.",
      "I use real-GPU workloads and fault injection to assess correctness, throughput and fairness together.",
    ],
    openEngineTitle: "Integrating with vLLM and SGLang",
    openEngineBody: [
      "In vLLM I fixed a worker that held on to memory between calls. In KVCached I adapt the cache integration as vLLM and SGLang change across releases.",
      "When the issue belongs in the engine itself, I send the fix upstream so we have one fewer patch to carry.",
    ],
    openCollaboration: "Observability & collaboration",
    openObservabilityTitle: "KV cache monitoring and code review",
    openObservabilityBody: [
      "I added read-only queries to KVCached so monitoring can show reserved address space, mapped GPU memory, and available pages separately.",
      "When reviewing changes in this area, I look at a small reproducer, check the counters, and compare them with measurements on the GPU.",
    ],
    joined: "Sangfor Technologies · Joined June 25, 2025",
    current: "Mar 2026–present",
    sccTitle: "Sangfor Cloud-service Center (SCC) · Emerging Technology Team",
    sccBody: [
      "I research and implement LLM inference features for Sangfor’s AI computing products.",
      "My work covers model weight sharing, KV cache pooling, and elastic scheduling for inference instances that share GPU memory.",
    ],
    previous: "Jun 2025–Feb 2026",
    foundations: "Foundations",
    foundationMl: "Machine learning fundamentals",
    foundationDl: "Deep learning fundamentals",
    foundationGraphics: "Computer graphics",
    learningTitle: "From AI applications to inference infrastructure",
    learningBody: [
      "Before March 2026, most of my AI experience came from using AI tools and building agents. When I moved into inference infrastructure, I spent a month revisiting first-year linear algebra, probability, and statistics, alongside machine learning and deep learning.",
      "At work I started following individual requests through the engine to see how it allocated memory, then writing fixes for issues I could reproduce. I’m now studying model training as well.",
    ],
    scpTitle: "SCP (Sangfor Cloud Platform) · Infrastructure Team",
    scpBody: [
      "Led a development team with two on-site contract engineers to migrate the platform's monitoring storage from Round Robin Database (RRD) to VictoriaMetrics.",
      "Personally designed the solution and implemented core components covering high availability, cold backups, and cluster replication.",
      "Also customized the VictoriaMetrics source code to add security features, including an Ed25519-based handshake.",
    ],
    dslBody:
      "I wrote an internal Python DSL for building PromQL and MetricsQL queries for monitoring.",
    education: "Education & campus experience",
    university: "Chengdu University of Information Technology",
    degree:
      "School of Software Engineering · Bachelor's degree in Software Engineering",
    studioTitle: "Think Different Studio · Web Team Lead",
    studioBody:
      "Led the Web team at Think Different Studio, a game development association, building the frontend and backend technical foundations and training new members.",
    labTitle: "Graduate research lab · Project development",
    labBody: [
      "As an undergraduate, worked in a graduate research lab under a professor's guidance and led graduate students on multiple projects.",
      "Developed the frontend and backend of the operations and monitoring platform for the High Precision Ground-based Time Service System at the National Time Service Center, Chinese Academy of Sciences. The system is a major national science and technology infrastructure project under China's 13th Five-Year Plan.",
    ],
    intro:
      "I’m a full-stack engineer at Sangfor working on LLM inference. I help maintain KVCached, where I work on how models share GPU memory.",
    interests:
      "Outside work, I write C#, make games, and share rhythm game recordings and walkthroughs on Bilibili.",
    allProjects: "All projects",
  },
};
