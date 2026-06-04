document.body.classList.add("has-js");

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const scrollProgress = document.querySelector("[data-scroll-progress]");
const topButton = document.querySelector("[data-top-button]");

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

const syncScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

  if (scrollProgress) {
    scrollProgress.style.transform = `scaleX(${Math.min(progress, 1)})`;
  }

  topButton?.classList.toggle("is-visible", window.scrollY > 680);
};

const closeNav = () => {
  nav?.classList.remove("is-open");
  header?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  header?.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

topButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener(
  "scroll",
  () => {
    syncHeader();
    syncScrollProgress();
  },
  { passive: true },
);
syncHeader();
syncScrollProgress();

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-32% 0px -58% 0px",
      threshold: [0.1, 0.25, 0.5],
    },
  );

  sections.forEach((section) => navObserver.observe(section));
}

const hero = document.querySelector(".hero");
hero?.addEventListener("pointermove", (event) => {
  const rect = hero.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  hero.style.setProperty("--pointer-x", `${x}%`);
  hero.style.setProperty("--pointer-y", `${y}%`);
});

const consoleData = {
  quality: {
    title: "ケアの質を可視化する",
    text: "ケア資源追跡データ、看護記録、画像、センサー情報をつなぎ、看護実践を評価可能なプロセスとして捉えます。",
    project: "JST BOOST / 基盤B",
    method: "RWD・反実仮想ML",
    term: "2025-2030",
  },
  ai: {
    title: "AIで看護技能評価を支援する",
    text: "動画、画像、言語情報をマルチモーダルに扱い、ケア場面の観察・判断・手技を教育可能な知識へ変換します。",
    project: "しのはら財団",
    method: "マルチモーダルLLM",
    term: "2026-2027",
  },
  dx: {
    title: "訪問看護DXを実装へ近づける",
    text: "医療過疎地や在宅療養の現場で、生体情報遠隔モニタリングとICTを組み合わせた看護支援を設計します。",
    project: "基盤研究(B) Co-I",
    method: "遠隔モニタリング",
    term: "2025-2029",
  },
  ultrasound: {
    title: "超音波と画像処理を看護へひらく",
    text: "血管穿刺、点滴漏れ、便秘、骨盤底筋評価など、見えにくい身体情報を臨床判断に使える形へ近づけます。",
    project: "科研費・共同研究",
    method: "超音波・画像AI",
    term: "2016-現在",
  },
};

const consoleRoot = document.querySelector("[data-console]");
const consoleTabs = Array.from(document.querySelectorAll("[data-console-tab]"));

const setConsoleFocus = (key) => {
  const data = consoleData[key];

  if (!data || !consoleRoot) {
    return;
  }

  consoleRoot.dataset.active = key;
  document.querySelector("[data-console-title]").textContent = data.title;
  document.querySelector("[data-console-text]").textContent = data.text;
  document.querySelector("[data-console-project]").textContent = data.project;
  document.querySelector("[data-console-method]").textContent = data.method;
  document.querySelector("[data-console-term]").textContent = data.term;

  consoleTabs.forEach((button) => {
    const isActive = button.dataset.consoleTab === key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
};

consoleTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setConsoleFocus(button.dataset.consoleTab);
  });
});

const newsLabels = {
  paper: "Paper",
  talk: "Talk",
  award: "Award",
  grant: "Grant",
  role: "Role",
};

const classifyNews = (item) => {
  const text = item.textContent;
  const href = item.querySelector(".source-link")?.href ?? "";

  if (href.includes("/awards/") || text.includes("受賞") || text.includes("Finalist")) {
    return "award";
  }

  if (href.includes("/published_papers/") || text.includes("論文")) {
    return "paper";
  }

  if (href.includes("/research_projects/") || text.includes("科研費") || text.includes("研究助成")) {
    return "grant";
  }

  if (href.includes("/presentations/") || href.includes("/social_contribution/") || text.includes("講演") || text.includes("発表") || text.includes("登壇")) {
    return "talk";
  }

  return "role";
};

const newsItems = Array.from(document.querySelectorAll("[data-news-list] li"));
const newsSearch = document.querySelector("[data-news-search]");
const newsFilterButtons = Array.from(document.querySelectorAll("[data-news-filter]"));
const newsCount = document.querySelector("[data-news-count]");
const newsToggle = document.querySelector("[data-news-toggle]");
const collapsedListLimit = 10;
let activeNewsFilter = "all";
let isNewsExpanded = false;

newsItems.forEach((item) => {
  const type = classifyNews(item);
  item.dataset.newsType = type;

  const textContainer = item.querySelector(":scope > span") ?? item.querySelector("span");
  if (textContainer && !textContainer.querySelector(".news-chip")) {
    const chip = document.createElement("span");
    chip.className = `news-chip ${type}`;
    chip.textContent = newsLabels[type];
    textContainer.prepend(chip);
  }
});

const applyNewsFilter = () => {
  const query = newsSearch?.value.trim().toLowerCase() ?? "";
  let matchedCount = 0;
  let visibleCount = 0;

  newsItems.forEach((item) => {
    const matchesType = activeNewsFilter === "all" || item.dataset.newsType === activeNewsFilter;
    const matchesQuery = !query || item.textContent.toLowerCase().includes(query);
    const isMatched = matchesType && matchesQuery;
    const shouldShow = isMatched && (isNewsExpanded || matchedCount < collapsedListLimit);

    if (isMatched) {
      matchedCount += 1;
    }

    item.classList.toggle("is-filter-hidden", !isMatched);
    item.classList.toggle("is-archive-hidden", isMatched && !shouldShow);
    item.classList.toggle("is-visible", shouldShow);
    visibleCount += shouldShow ? 1 : 0;
  });

  if (newsCount) {
    newsCount.textContent = `${visibleCount}/${matchedCount}件を表示`;
  }

  if (newsToggle) {
    const remaining = Math.max(matchedCount - collapsedListLimit, 0);
    const collapsedLabel = newsToggle.dataset.collapsedLabel ?? "続きを表示";
    const expandedLabel = newsToggle.dataset.expandedLabel ?? "10件表示に戻す";

    newsToggle.hidden = remaining === 0;
    newsToggle.textContent = isNewsExpanded ? expandedLabel : `${collapsedLabel}（残り${remaining}件）`;
    newsToggle.setAttribute("aria-expanded", String(isNewsExpanded));
  }
};

newsFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeNewsFilter = button.dataset.newsFilter;
    isNewsExpanded = false;
    newsFilterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    applyNewsFilter();
  });
});

newsSearch?.addEventListener("input", () => {
  isNewsExpanded = false;
  applyNewsFilter();
});

newsToggle?.addEventListener("click", () => {
  isNewsExpanded = !isNewsExpanded;
  applyNewsFilter();
});

applyNewsFilter();

const fundingItems = Array.from(document.querySelectorAll("[data-funding-list] li"));
const fundingSearch = document.querySelector("[data-funding-search]");
const fundingFilterButtons = Array.from(document.querySelectorAll("[data-funding-filter]"));
const fundingCount = document.querySelector("[data-funding-count]");
const fundingToggle = document.querySelector("[data-funding-toggle]");
let activeFundingFilter = "all";
let isFundingExpanded = false;

const classifyFundingRole = (item) => {
  const text = item.textContent;

  if (text.includes("関連・役割確認中")) {
    return "related";
  }

  if (text.includes("研究代表者")) {
    return "pi";
  }

  if (text.includes("研究分担者") || text.includes("Co-I")) {
    return "co";
  }

  return "participant";
};

const isCurrentFunding = (item) => {
  const term = item.querySelector("time")?.textContent ?? "";

  if (term.includes("現在")) {
    return true;
  }

  const end = term.split("-").at(-1)?.trim() ?? "";
  const match = end.match(/(\d{4})年(?:([0-9]+)月)?/);

  if (!match) {
    return false;
  }

  const endYear = Number(match[1]);
  const endMonth = match[2] ? Number(match[2]) : 12;

  return endYear > 2026 || (endYear === 2026 && endMonth >= 6);
};

const fundingLabels = {
  pi: "PI",
  co: "Co-I",
  related: "確認中",
  participant: "参画",
};

fundingItems.forEach((item) => {
  const role = classifyFundingRole(item);
  item.dataset.fundingRole = role;
  item.dataset.current = String(isCurrentFunding(item));

  const content = item.querySelector("div");
  if (content && !content.querySelector(".funding-chip")) {
    const chip = document.createElement("span");
    chip.className = `funding-chip ${role}`;
    chip.textContent = fundingLabels[role];
    content.prepend(chip);
  }

  if (content && !content.querySelector(".item-toggle")) {
    item.classList.add("is-collapsed");
    const button = document.createElement("button");
    button.className = "item-toggle";
    button.type = "button";
    button.textContent = "詳しく見る";
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      const isExpanded = item.classList.toggle("is-expanded");
      item.classList.toggle("is-collapsed", !isExpanded);
      button.textContent = isExpanded ? "閉じる" : "詳しく見る";
      button.setAttribute("aria-expanded", String(isExpanded));
    });
    content.append(button);
  }
});

const applyFundingFilter = () => {
  const query = fundingSearch?.value.trim().toLowerCase() ?? "";
  let matchedCount = 0;
  let visibleCount = 0;

  fundingItems.forEach((item) => {
    const role = item.dataset.fundingRole;
    const matchesFilter =
      activeFundingFilter === "all" ||
      role === activeFundingFilter ||
      (activeFundingFilter === "current" && item.dataset.current === "true");
    const matchesQuery = !query || item.textContent.toLowerCase().includes(query);
    const isMatched = matchesFilter && matchesQuery;
    const shouldShow = isMatched && (isFundingExpanded || matchedCount < collapsedListLimit);

    if (isMatched) {
      matchedCount += 1;
    }

    item.classList.toggle("is-filter-hidden", !isMatched);
    item.classList.toggle("is-archive-hidden", isMatched && !shouldShow);
    item.classList.toggle("is-visible", shouldShow);
    visibleCount += shouldShow ? 1 : 0;
  });

  if (fundingCount) {
    fundingCount.textContent = `${visibleCount}/${matchedCount}件を表示`;
  }

  if (fundingToggle) {
    const remaining = Math.max(matchedCount - collapsedListLimit, 0);
    const collapsedLabel = fundingToggle.dataset.collapsedLabel ?? "続きを表示";
    const expandedLabel = fundingToggle.dataset.expandedLabel ?? "10件表示に戻す";

    fundingToggle.hidden = remaining === 0;
    fundingToggle.textContent = isFundingExpanded ? expandedLabel : `${collapsedLabel}（残り${remaining}件）`;
    fundingToggle.setAttribute("aria-expanded", String(isFundingExpanded));
  }
};

fundingFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFundingFilter = button.dataset.fundingFilter;
    isFundingExpanded = false;
    fundingFilterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    applyFundingFilter();
  });
});

fundingSearch?.addEventListener("input", () => {
  isFundingExpanded = false;
  applyFundingFilter();
});

fundingToggle?.addEventListener("click", () => {
  isFundingExpanded = !isFundingExpanded;
  applyFundingFilter();
});

applyFundingFilter();

const committeeItems = Array.from(document.querySelectorAll("[data-committee-list] article"));
const committeeCount = document.querySelector("[data-committee-count]");
const committeeToggle = document.querySelector("[data-committee-toggle]");
const committeeListLimit = 5;
let isCommitteeExpanded = false;

const applyCommitteeCollapse = () => {
  let visibleCount = 0;

  committeeItems.forEach((item, index) => {
    const shouldShow = isCommitteeExpanded || index < committeeListLimit;
    item.classList.toggle("is-archive-hidden", !shouldShow);
    item.classList.toggle("is-visible", shouldShow);
    visibleCount += shouldShow ? 1 : 0;
  });

  if (committeeCount) {
    committeeCount.textContent = `${visibleCount}/${committeeItems.length}件を表示`;
  }

  if (committeeToggle) {
    const remaining = Math.max(committeeItems.length - committeeListLimit, 0);
    const collapsedLabel = committeeToggle.dataset.collapsedLabel ?? "続きを表示";
    const expandedLabel = committeeToggle.dataset.expandedLabel ?? "5件表示に戻す";

    committeeToggle.hidden = remaining === 0;
    committeeToggle.textContent = isCommitteeExpanded ? expandedLabel : `${collapsedLabel}（残り${remaining}件）`;
    committeeToggle.setAttribute("aria-expanded", String(isCommitteeExpanded));
  }
};

committeeToggle?.addEventListener("click", () => {
  isCommitteeExpanded = !isCommitteeExpanded;
  applyCommitteeCollapse();
});

applyCommitteeCollapse();

const revealTargets = Array.from(
  document.querySelectorAll(
    ".home-card, .research-console, .profile-main, .profile-side div, .topic, .timeline article, .grant-spotlight, .funding-overview div, .funding-ledger li, .activity-grid article, .award-list article, .committee-list article, .publication-list article, .career-grid article, .keyword-cloud span, .contact-card",
  ),
);

revealTargets.forEach((target, index) => {
  target.classList.add("js-reveal");
  target.style.transitionDelay = `${Math.min((index % 8) * 35, 210)}ms`;
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08,
    },
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}
