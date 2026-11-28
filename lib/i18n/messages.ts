import type { BookGroupId } from "../content/books";
import type { ContactChannelId } from "./contact";
import type { Locale } from "./locale";

export const REPO_URL = "https://github.com/tinwritescode/moingaymotdoan";

export type QuickMoodShortcut = {
  slug: string;
  label: string;
  hue: string;
};

type TourPoint = { title: string; body: string };

/** Where the install guide has its own steps. */
export type InstallPlatformId = "ios" | "android" | "desktop" | "mac";

export type Messages = {
  locale: Locale;
  htmlLang: string;
  ogLocale: string;
  ogLocaleAlternate: string;
  bibleVersionName: string;
  bibleVersionShort: string;
  bibleSourceUrl: string;
  aiNotice: string;
  seo: {
    siteName: string;
    defaultTitle: string;
    defaultDescription: string;
    ogImageAlt: string;
    chapterTitle: (book: string, chapter: number, title: string) => string;
    chapterFallbackDesc: (book: string, chapter: number, title: string) => string;
    moodsTitle: string;
    moodsDescription: string;
    moodDetailTitle: (title: string) => string;
    ebookTitle: string;
    ebookDescription: string;
    historyTitle: string;
    historyDescription: string;
    accountTitle: string;
    accountDescription: string;
    contactTitle: string;
    contactDescription: string;
    installTitle: string;
    installDescription: string;
    notFoundTitle: string;
    notFoundDescription: string;
  };
  header: {
    brand: string;
    booksButton: string;
    pickBookAndChapter: string;
    booksNavLabel: string;
    oldTestament: string;
    newTestament: string;
    chaptersOfBook: (book: string) => string;
    backToToc: string;
    searchByMood: string;
    accountLabel: (name: string) => string;
    signInLabel: string;
    switchLanguageLabel: string;
    switchLanguageShort: string;
  };
  dock: {
    navLabel: string;
    read: string;
    moods: string;
    history: string;
    me: string;
  };
  footer: {
    scripturePrefix: string;
    sourceWord: string;
    downloadEbook: string;
    privacy: string;
    terms: string;
    contact: string;
    install: string;
    contributeLanguage: string;
    contributeLanguageUrl: string;
    openSourcePrefix: string;
    openSourceLink: string;
  };
  legal: {
    updatedLabel: string;
    contactPrompt: string;
    contactLink: string;
  };
  install: {
    kicker: string;
    heading: string;
    intro: string;
    benefits: readonly [string, string, string];
    choosePlatform: string;
    detected: (platform: string) => string;
    tabsLabel: string;
    platforms: Record<InstallPlatformId, string>;
    guides: Record<InstallPlatformId, { heading: string; steps: readonly string[] }>;
    shareButton: string;
    shareMenu: readonly [string, string, string];
    newSafari: string;
    pageMenu: readonly [string, string, string];
    appName: string;
    iosChromeNote: string;
    installButton: string;
    orByHand: string;
    installed: string;
    cornerToggle: string;
    cornerToggleHint: string;
    faqHeading: string;
    faq: readonly { q: string; a: string }[];
    corner: { open: string; tip: string; dismiss: string; dismissed: string; undo: string };
  };
  contact: {
    kicker: string;
    heading: string;
    intro: string;
    directHeading: string;
    communityHeading: string;
    copy: string;
    copied: string;
    copyAriaLabel: (label: string) => string;
    channels: Record<ContactChannelId, { label: string; description: string }>;
    noteHeading: string;
    noteBody: string;
    noteFootnote: string;
  };
  display: {
    switchToLight: string;
    switchToDark: string;
    triggerLabel: string;
    title: string;
    colorMode: string;
    readingSize: string;
    readingFont: string;
    previewLabel: string;
    previewVerse: string;
    themes: { system: string; light: string; dark: string };
    scales: { sm: string; md: string; lg: string };
    fonts: Record<
      "source-serif" | "literata" | "lora" | "newsreader" | "be-vietnam" | "lexend",
      { tag: string; description: string }
    >;
  };
  home: {
    weekdays: readonly [string, string, string, string, string, string, string];
    months: readonly [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ];
    formatDateLine: (now: Date) => string;
    morning: string;
    afternoon: string;
    evening: string;
    fallbackKicker: string;
    fallbackHeadline: string;
    subtitle: string;
    emptyFallback: string;
    startReading: (book: string, chapter: number) => string;
    readThisChapter: string;
    moodsLink: string;
    ebookLink: string;
    booksHeading: string;
    chooseTestamentLabel: string;
    filterAll: string;
    filterOld: (count: number) => string;
    filterNew: (count: number) => string;
    chaptersCount: (count: number) => string;
    readOfTotal: (read: number, total: number) => string;
    bookGroups: Record<BookGroupId, string>;
    closeBook: string;
    legendCompleted: string;
    legendSeen: string;
    legendUnread: string;
    chapterDisplayLabel: string;
    viewDots: string;
    viewTitles: string;
    chapterTitleAttr: (chapter: number, title: string, lastReadDate?: string) => string;
    chapterAriaLabel: (chapter: number, title: string) => string;
    seenBadge: string;
  };
  streak: {
    regionLabel: string;
    daysLabel: (days: number) => string;
    record: (days: number) => string;
    /** Monday to Sunday. */
    weekdays: readonly [string, string, string, string, string, string, string];
    marks: Record<"read" | "rest" | "rekindled" | "missed" | "today" | "future", string>;
    startTitle: string;
    startBody: string;
    todayTitle: string;
    todayBody: (days: number) => string;
    readNext: (label: string) => string;
    atRiskTitle: (days: number) => string;
    timeLeft: (hours: number, minutes: number) => string;
    shortTitle: string;
    shortBody: string;
    shortMeta: (verses: number, minutes: number) => string;
    rescueTitle: string;
    rescueBody: (days: number) => string;
    rekindleTitle: string;
    rekindleBody: (needed: number, days: number) => string;
    recommended: string;
    restTitle: string;
    restBody: (days: number) => string;
    restartBtn: string;
    recordKept: (record: number) => string;
    doneTitle: string;
    doneBody: (days: number) => string;
    milestoneBadge: (flame: string) => string;
    nextMilestone: (at: number, flame: string) => string;
    daysLeft: (left: number) => string;
    allFlames: string;
    share: (days: number) => string;
    sharePost: string;
    shareStory: string;
    shareFailed: string;
    sharePreview: string;
    shareSend: string;
    shareSave: string;
    shareClose: string;
    cardTagline: (days: number) => string;
    sheetLabel: string;
    sheetClose: string;
    remindMe: (hour: number) => string;
    remindHourLabel: string;
    remindOff: string;
    remindTry: string;
    remindBlocked: string;
    remindFailed: string;
    remindInstall: string;
    notifyAtRisk: (days: number) => { title: string; body: string };
    notifyStart: { title: string; body: string };
    notifyRescue: (days: number) => { title: string; body: string };
  };
  /** The reader's name and photo on the share card. */
  profile: {
    nameLabel: string;
    addPhoto: string;
    changePhoto: string;
    removePhoto: string;
    save: string;
    cancel: string;
    edit: string;
    editLong: string;
    add: string;
    showOnCard: string;
    photoFailed: string;
    saveFailed: string;
  };
  continueReading: {
    heading: (dateTime: string) => string;
    readAgain: string;
    continueBtn: string;
    nextChapter: (label: string) => string;
    statsAriaLabel: string;
    chaptersRead: (n: number) => string;
    dayStreak: string;
    booksOpened: (n: number) => string;
    localOnlyPrefix: string;
    signInToSync: string;
  };
  chapter: {
    kicker: (book: string, number: number) => string;
    lead: (versesCount: number, minutes: number) => string;
    storyAriaLabel: string;
    keyTakeaways: string;
    deeperMeaning: string;
    notesAndNuances: string;
    commentatorsHeading: (count: number) => string;
    fullTextHeading: (versesCount: number) => string;
    inlineScriptureHeading: (book: string, verseLabel: string) => string;
    confidencePrefix: string;
    confidence: { cao: string; vua: string; thap: string };
    lowConfidencePrefix: string;
    closePopover: string;
    bottomNavLabel: string;
    progressRegionLabel: string;
    prevChapterAria: (book: string, number: number) => string;
    nextChapterAria: (book: string, number: number) => string;
    completedLabel: string;
    markCompleteLabel: string;
  };
  moods: {
    kicker: (count: number) => string;
    heading: string;
    subtitle: string;
    searchLabel: string;
    searchPlaceholder: string;
    clearSearchAria: string;
    clearFilter: string;
    groupsHeading: string;
    allCount: (count: number) => string;
    randomMessage: string;
    filterGroupAria: string;
    showingCountPrefix: string;
    showingCountSuffix: (total: number) => string;
    emptyTitle: (query: string) => string;
    emptyHintPrefix: string;
    emptyHintExamples: readonly [string, string, string, string];
    emptyHintBookPrefix: string;
    emptyHintBookExample: string;
    resetAllBtn: (count: number) => string;
    groupTopicsCount: (count: number) => string;
    backToTop: string;
    readBadge: string;
    quickShortcuts: readonly QuickMoodShortcut[];
    detail: {
      backToAll: string;
      scriptureHeading: (count: number) => string;
      belongsToChapter: (book: string, chapter: number) => string;
      readFullChapter: (book: string, chapter: number) => string;
      prayerHeading: string;
      relatedHeading: string;
      bottomNavLabel: string;
    };
  };
  copyVerse: {
    copy: string;
    copied: string;
    ariaLabel: (label: string) => string;
    formatPassage: (label: string, body: string) => string;
  };
  share: {
    share: string;
    copiedLink: string;
  };
  ebook: {
    kicker: string;
    heading: string;
    intro: string;
    editionGroupLabel: string;
    conciseEdition: string;
    fullTextEdition: string;
    conciseHint: string;
    fullTextHint: string;
    bundlesHeading: string;
    bundleInfo: (books: number, chapters: number) => string;
    downloadPrefix: string;
    kindleHeading: string;
    kindleSteps: {
      step1: string;
      step2Before: string;
      step2After: string;
      step2Path: string;
      step3: string;
    };
  };
  history: {
    kicker: string;
    heading: string;
    syncing: string;
    refresh: string;
    guestBannerBefore: string;
    guestBannerBold: string;
    guestBannerAfter: string;
    signInBtn: string;
    loadingLabel: string;
    continueHeading: (dateTime: string) => string;
    readAgain: string;
    continueBtn: string;
    nextChapter: (label: string) => string;
    statsAriaLabel: string;
    ofTotalChapters: string;
    dayStreak: string;
    completedCount: string;
    filterGroupAria: string;
    tabAll: string;
    tabBible: string;
    tabMoods: string;
    tabCompleted: string;
    clearAll: string;
    confirmClear: string;
    cancel: string;
    emptyAll: string;
    emptyFiltered: string;
    emptyDesc: string;
    startGenesisCta: string;
    startGenesisHref: string;
    browseMoodsCta: string;
    itemsCount: (count: number) => string;
    moodPrefix: (subtitle: string) => string;
    doneBadge: string;
    unmarkTitle: string;
    markTitle: string;
    markBtn: string;
    continueItemBtn: string;
    deleteItemAria: (title: string, dateLabel: string) => string;
    today: string;
    yesterday: string;
    atWord: string;
  };
  account: {
    loadingLabel: string;
    syncKicker: string;
    signInHeading: string;
    signInDesc: string;
    notConfiguredBefore: string;
    notConfiguredLink: string;
    notConfiguredAfter: string;
    redirecting: string;
    signInBtn: string;
    signUpBtn: string;
    securityFootnote: string;
    syncingBadge: string;
    chaptersSeen: (n: number) => string;
    chaptersCompleted: string;
    dayStreak: string;
    openHistoryBtn: string;
    signOutBtn: string;
    defaultUserName: string;
    errors: {
      accessDenied: string;
      invalidRedirectUri: string;
      network: string;
      sessionExpired: string;
      genericWithReason: (raw: string) => string;
      generic: string;
      notConfigured: string;
      syncFailed: string;
      visitSyncFailed: string;
      completeSyncFailed: string;
      deleteLogFailed: string;
      deleteItemFailed: string;
      clearFailed: string;
    };
  };
  tour: {
    welcomeKicker: string;
    welcomeTitle: string;
    welcomePoints: readonly [TourPoint, TourPoint, TourPoint];
    welcomeStart: string;
    welcomeLater: string;
    stepOf: (step: number, total: number) => string;
    steps: Record<"ref" | "notes" | "display" | "next", { title: string; body: string }>;
    arrowKeysHint: string;
    next: string;
    back: string;
    skip: string;
    done: string;
    replay: string;
    replayHint: string;
  };
  notFound: {
    heading: string;
    description: string;
    backHome: string;
  };
  skeleton: {
    loading: string;
  };
};

const VI: Messages = {
  locale: "vi",
  htmlLang: "vi",
  ogLocale: "vi_VN",
  ogLocaleAlternate: "en_US",
  bibleVersionName: "Kinh Thánh Bản Truyền Thống",
  bibleVersionShort: "Bản Truyền Thống",
  bibleSourceUrl: "https://ebible.org/find/details.php?id=vie1934",
  aiNotice:
    "Nội dung được tạo bởi Opus 5.5 (15%) và Gemini Neon 4 (phần còn lại). Một ít nơi có thể sai sót, xin hãy double check hoặc hỏi ý kiến mục sư để hiểu đúng.",
  seo: {
    siteName: "Mỗi Ngày Một Đoạn — Kinh Thánh",
    defaultTitle: "Mỗi Ngày Một Đoạn — Kinh Thánh ghi chú từng đoạn",
    defaultDescription:
      "Đọc trọn bộ 66 sách, 1.189 đoạn Kinh Thánh bằng lời thường — chạm chỗ dẫn xem ngay nguyên văn Bản Truyền Thống 1926, 100 chủ đề cảm xúc, ebook Kindle và lịch sử đọc đồng bộ. Luôn phi lợi nhuận & mã nguồn mở.",
    ogImageAlt:
      "Mỗi Ngày Một Đoạn — Đọc trọn bộ 66 sách Kinh Thánh bằng lời thường kèm nguyên văn Bản Truyền Thống 1926",
    chapterTitle: (book, chapter, title) => `${book} ${chapter} — ${title} | Mỗi Ngày Một Đoạn`,
    chapterFallbackDesc: (book, chapter, title) =>
      `Đọc ${book} đoạn ${chapter} (${title}) bằng lời thường, kèm nguyên văn Bản Truyền Thống 1926.`,
    moodsTitle: "Đọc Kinh Thánh theo cảm xúc — 100 chủ đề | Mỗi Ngày Một Đoạn",
    moodsDescription:
      "Chọn tâm trạng hiện tại (lo âu, buồn bã, vui mừng, biết ơn, cần khôn ngoan...) để đọc ngay Lời Kinh Thánh Bản Truyền Thống 1926 và sao chép câu gốc.",
    moodDetailTitle: (title) => `${title} — Đọc Kinh Thánh theo cảm xúc | Mỗi Ngày Một Đoạn`,
    ebookTitle: "Tải Ebook EPUB cho Kindle & Apple Books | Mỗi Ngày Một Đoạn",
    ebookDescription:
      "Tải miễn phí trọn bộ Kinh Thánh ghi chú từng đoạn định dạng EPUB cho Kindle, Apple Books, Google Play Sách — bản gọn hoặc kèm nguyên văn Bản Truyền Thống 1926.",
    historyTitle: "Lịch sử đọc Kinh Thánh | Mỗi Ngày Một Đoạn",
    historyDescription:
      "Theo dõi ngày tháng năm đã xem, chuỗi ngày đọc liên tiếp, vòng tiến độ từng sách và mở Xem tiếp nhanh chóng trên mọi thiết bị.",
    accountTitle: "Tài khoản & Đồng bộ lịch sử | Mỗi Ngày Một Đoạn",
    accountDescription:
      "Đăng nhập để đồng bộ lịch sử đọc Kinh Thánh và tiến độ từng sách trên điện thoại và máy tính.",
    contactTitle: "Liên hệ & Góp ý | Mỗi Ngày Một Đoạn",
    contactDescription:
      "Liên hệ Mỗi Ngày Một Đoạn qua Email, Zalo, Facebook, Instagram hoặc GitHub để góp ý nội dung, báo lỗi hay gửi yêu cầu về dữ liệu tài khoản.",
    installTitle: "Cài ứng dụng | Mỗi Ngày Một Đoạn",
    installDescription:
      "Cài Mỗi Ngày Một Đoạn lên màn hình chính iPhone, Android hoặc máy tính để mở nhanh và đọc Kinh Thánh cả khi không có mạng.",
    notFoundTitle: "Không tìm thấy trang này | Mỗi Ngày Một Đoạn",
    notFoundDescription: "Đoạn Kinh Thánh hoặc đường dẫn bạn mở hiện không tồn tại.",
  },
  header: {
    brand: "Kinh Thánh",
    booksButton: "Sách",
    pickBookAndChapter: "Chọn sách và đoạn",
    booksNavLabel: "Các sách",
    oldTestament: "Cựu Ước",
    newTestament: "Tân Ước",
    chaptersOfBook: (book) => `Các đoạn ${book}`,
    backToToc: "Mục lục",
    searchByMood: "Tìm theo cảm xúc",
    accountLabel: (name) => `Tài khoản ${name}`,
    signInLabel: "Đăng nhập",
    switchLanguageLabel: "Switch to English",
    switchLanguageShort: "EN",
  },
  dock: {
    navLabel: "Điều hướng chính",
    read: "Đọc",
    moods: "Cảm xúc",
    history: "Lịch sử",
    me: "Tôi",
  },
  footer: {
    scripturePrefix: "Lời Kinh Thánh: Bản Truyền Thống (public domain), nguồn",
    sourceWord: "eBible.org",
    downloadEbook: "Tải ebook",
    privacy: "Quyền riêng tư",
    terms: "Điều khoản",
    contact: "Liên hệ",
    install: "Cài ứng dụng",
    contributeLanguage: "Đóng góp ngôn ngữ khác",
    contributeLanguageUrl: `${REPO_URL}/blob/main/CONTRIBUTING.md`,
    openSourcePrefix: "Phi lợi nhuận & mã nguồn mở trên",
    openSourceLink: "GitHub",
  },
  legal: {
    updatedLabel: "Cập nhật lần cuối:",
    contactPrompt: "Câu hỏi hoặc yêu cầu về dữ liệu của bạn:",
    contactLink: "trang Liên hệ",
  },
  install: {
    kicker: "Cài ứng dụng",
    heading: "Đặt Kinh Thánh lên màn hình chính",
    intro:
      "Mở bằng một chạm như một ứng dụng, và vẫn đọc được những đoạn đã mở khi không có mạng. Không cần App Store, chỉ chiếm vài MB.",
    benefits: [
      "Mở từ màn hình chính, toàn màn hình",
      "Đọc offline những đoạn bạn đã mở",
      "Miễn phí, không quảng cáo, gỡ bất cứ lúc nào",
    ],
    choosePlatform: "Chọn máy của bạn",
    detected: (platform) => `Đã nhận ra: ${platform}`,
    tabsLabel: "Nền tảng",
    platforms: { ios: "iPhone / iPad", android: "Android", desktop: "Máy tính", mac: "Mac (Safari)" },
    guides: {
      ios: {
        heading: "iPhone và iPad",
        steps: [
          "Mở trang này bằng Safari.",
          "Bấm nút Chia sẻ ở thanh dưới cùng. Không thấy? Bấm nút ≡ ở thanh địa chỉ cuối màn hình, rồi chọn “Chia sẻ”.",
          "Kéo xuống, chọn “Thêm vào MH chính”.",
          "Bấm “Thêm”. Biểu tượng Kinh Thánh sẽ nằm trên màn hình chính.",
        ],
      },
      android: {
        heading: "Android",
        steps: [
          "Mở trang này bằng Chrome.",
          "Bấm nút ⋮ ở góc trên bên phải.",
          "Chọn “Thêm vào màn hình chính”, rồi “Cài đặt”.",
        ],
      },
      desktop: {
        heading: "Máy tính (Chrome, Edge)",
        steps: [
          "Bấm biểu tượng Cài đặt ở cuối thanh địa chỉ.",
          "Chọn “Cài đặt”. Ứng dụng mở trong cửa sổ riêng và có trong menu Start hoặc Launchpad.",
        ],
      },
      mac: {
        heading: "Mac (Safari)",
        steps: ["Trên thanh menu, chọn Tệp rồi “Thêm vào Dock”.", "Bấm “Thêm”. Biểu tượng Kinh Thánh nằm trên Dock."],
      },
    },
    shareButton: "Nút Chia sẻ",
    shareMenu: ["Thêm vào Mục ưa thích", "Thêm vào MH chính", "Tìm trên trang"],
    newSafari: "Safari mới: nút ≡ ở thanh địa chỉ cuối màn hình",
    pageMenu: ["Dịch", "Chia sẻ", "Thêm vào Dấu trang"],
    appName: "Kinh Thánh",
    iosChromeNote: "Đang dùng Chrome trên iPhone? Bấm nút Chia sẻ ở cuối thanh địa chỉ, rồi làm tiếp từ bước 3.",
    installButton: "Cài ứng dụng",
    orByHand: "Không thấy hộp cài? Làm theo các bước dưới đây.",
    installed: "Bạn đang dùng ứng dụng đã cài. Cảm ơn bạn!",
    cornerToggle: "Nút cài nhanh ở góc màn hình",
    cornerToggleHint: "Bật lại nếu bạn đã ẩn nó",
    faqHeading: "Câu hỏi thường gặp",
    faq: [
      {
        q: "Lịch sử đọc có còn không?",
        a: "Trên iPhone, ứng dụng đã cài giữ dữ liệu riêng với Safari. Đăng nhập một lần trong ứng dụng để đồng bộ lịch sử đọc.",
      },
      { q: "Đọc offline được những gì?", a: "Trang chủ và mọi đoạn bạn đã mở khi có mạng." },
      { q: "Gỡ ứng dụng thế nào?", a: "Nhấn giữ biểu tượng rồi chọn Xóa, như mọi ứng dụng khác." },
    ],
    corner: {
      open: "Cài ứng dụng",
      tip: "Cài app, đọc cả khi offline",
      dismiss: "Ẩn nút cài",
      dismissed: "Đã ẩn. Bật lại trong trang Cài ứng dụng ở cuối trang.",
      undo: "Hoàn tác",
    },
  },
  contact: {
    kicker: "Liên hệ & Góp ý",
    heading: "Liên hệ",
    intro:
      "Mọi góp ý về ghi chú Kinh Thánh, báo lỗi kỹ thuật, yêu cầu xóa tài khoản hay mong muốn đóng góp thêm ngôn ngữ đều rất đáng quý. Bạn có thể nhắn qua kênh tiện nhất bên dưới.",
    directHeading: "Nhắn trực tiếp",
    communityHeading: "Mã nguồn mở & Đóng góp",
    copy: "Sao chép",
    copied: "Đã chép ✓",
    copyAriaLabel: (label) => `Sao chép ${label}`,
    channels: {
      email: {
        label: "Email",
        description: "Góp ý chi tiết, yêu cầu xóa tài khoản hoặc câu hỏi về quyền riêng tư.",
      },
      zalo: {
        label: "Zalo",
        description: "Nhắn nhanh trực tiếp qua Zalo.",
      },
      facebook: {
        label: "Facebook",
        description: "Nhắn tin hoặc kết nối trên Facebook.",
      },
      instagram: {
        label: "Instagram",
        description: "Nhắn tin trực tiếp trên Instagram.",
      },
      githubIssues: {
        label: "GitHub Issues",
        description: "Báo lỗi chính tả, hiệu đính giải kinh hoặc đề xuất tính năng công khai.",
      },
      contributing: {
        label: "Hướng dẫn đóng góp",
        description: "Quy chuẩn biên soạn nội dung và cách đóng góp thêm ngôn ngữ khác.",
      },
    },
    noteHeading: "Khi góp ý một đoạn Kinh Thánh",
    noteBody:
      "Nếu bạn thấy chỗ diễn đạt chưa chính xác hoặc muốn góp ý thần học, xin ghi kèm tên sách và số đoạn (ví dụ: Thi-thiên 23) để chúng tôi kiểm tra và chỉnh sửa nhanh nhất.",
    noteFootnote:
      "Mỗi Ngày Một Đoạn là dự án phi lợi nhuận làm trong thời gian rảnh, nên đôi khi phản hồi có thể chậm một chút — rất mong bạn thông cảm.",
  },
  display: {
    switchToLight: "Chuyển sang chế độ sáng",
    switchToDark: "Chuyển sang chế độ tối",
    triggerLabel: "Tùy chỉnh phông chữ, cỡ chữ và chế độ tối",
    title: "Hiển thị & Phông chữ",
    colorMode: "Chế độ màu",
    readingSize: "Cỡ chữ đọc",
    readingFont: "Phông chữ đọc",
    previewLabel: "Xem trước phông chữ",
    previewVerse: "Đức Giê-hô-va là Đấng chăn giữ tôi: tôi sẽ chẳng thiếu thốn gì.",
    themes: { system: "Hệ thống", light: "Sáng", dark: "Tối" },
    scales: { sm: "Nhỏ", md: "Vừa", lg: "Lớn" },
    fonts: {
      "source-serif": {
        tag: "Serif cổ điển",
        description: "Cân đối, sắc nét như bản in Kinh Thánh — mặc định của trang.",
      },
      literata: {
        tag: "Kiểu sách · Kindle",
        description: "Chế tác cho đọc sách dài trên màn hình (Google Play Books).",
      },
      lora: {
        tag: "Serif mềm mại",
        description: "Nét chữ ấm áp, uyển chuyển — hợp đọc Thi-thiên và suy ngẫm.",
      },
      newsreader: {
        tag: "Serif thanh mảnh",
        description: "Thanh lịch kiểu ấn phẩm văn chương, thoáng mắt ở cỡ chữ lớn.",
      },
      "be-vietnam": {
        tag: "Không chân · Thuần Việt",
        description: "Thiết kế riêng cho dấu tiếng Việt, hiện đại và rõ trên di động.",
      },
      lexend: {
        tag: "Không chân · Dễ đọc",
        description: "Giãn chữ thoáng, giúp giảm mỏi mắt khi đọc liên tục.",
      },
    },
  },
  home: {
    weekdays: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
    months: [
      "tháng 1",
      "tháng 2",
      "tháng 3",
      "tháng 4",
      "tháng 5",
      "tháng 6",
      "tháng 7",
      "tháng 8",
      "tháng 9",
      "tháng 10",
      "tháng 11",
      "tháng 12",
    ],
    formatDateLine: (now) => {
      const day = VI.home.weekdays[now.getDay()];
      return `${day}, ${now.getDate()} tháng ${now.getMonth() + 1}`;
    },
    morning: "Chào buổi sáng.",
    afternoon: "Chào buổi chiều.",
    evening: "Chào buổi tối.",
    fallbackKicker: "Kinh Thánh Bản Truyền Thống · 66 sách · 1.189 đoạn",
    fallbackHeadline: "Kinh Thánh bằng lời thường.",
    subtitle: "Mỗi đoạn Kinh Thánh kể lại bằng lời thường, kèm nguyên văn Bản Truyền Thống.",
    emptyFallback: "Chưa có đoạn nào. Mời bạn quay lại sau.",
    startReading: (book, chapter) => `Bắt đầu đọc · ${book} ${chapter}`,
    readThisChapter: "Đọc đoạn này →",
    moodsLink: "100 cảm xúc",
    ebookLink: "Tải ebook",
    booksHeading: "Các sách",
    chooseTestamentLabel: "Chọn giao ước",
    filterAll: "Tất cả",
    filterOld: (count) => `Cựu Ước · ${count}`,
    filterNew: (count) => `Tân Ước · ${count}`,
    chaptersCount: (count) => `${count} đoạn`,
    readOfTotal: (read, total) => `${read} / ${total} đã xem`,
    bookGroups: {
      law: "Ngũ Kinh",
      history: "Lịch sử",
      poetry: "Thơ ca",
      majorProphets: "Tiên tri lớn",
      minorProphets: "Tiên tri nhỏ",
      gospels: "Phúc Âm và Công-vụ",
      paul: "Thư Phao-lô",
      general: "Thư chung và Khải-huyền",
    },
    closeBook: "Đóng",
    legendCompleted: "đã đọc xong",
    legendSeen: "đã xem",
    legendUnread: "chưa đọc",
    chapterDisplayLabel: "Kiểu hiển thị các đoạn",
    viewDots: "Lưới chấm",
    viewTitles: "Tiêu đề",
    chapterTitleAttr: (chapter, title, lastReadDate) =>
      lastReadDate ? `Đoạn ${chapter}: ${title} (đã xem ${lastReadDate})` : `Đoạn ${chapter}: ${title}`,
    chapterAriaLabel: (chapter, title) => `Đoạn ${chapter}: ${title}`,
    seenBadge: "• đã xem",
  },
  streak: {
    regionLabel: "Chuỗi ngày đọc",
    daysLabel: () => "ngày liền",
    record: (days) => `Kỷ lục ${days} ngày`,
    weekdays: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    marks: { read: "đã đọc", rest: "ngày Sa-bát", rekindled: "đã thắp lại", missed: "chưa đọc", today: "hôm nay", future: "sắp tới" },
    startTitle: "Thắp ngọn nến hôm nay",
    startBody: "Đọc một đoạn hôm nay để bắt đầu chuỗi ngày đọc.",
    todayTitle: "Hôm nay: một đoạn để giữ lửa",
    todayBody: (days) => `Đọc một đoạn trước nửa đêm, chuỗi lên ${days + 1} ngày.`,
    readNext: (label) => `Đọc ${label}`,
    atRiskTitle: (days) => `Đèn ${days} ngày sẽ tắt lúc nửa đêm`,
    timeLeft: (hours, minutes) => `Còn ${hours} giờ ${minutes} phút`,
    shortTitle: "Chỉ có ít phút?",
    shortBody: "Một đoạn ngắn cũng giữ được chuỗi.",
    shortMeta: (verses, minutes) => `${verses} câu · ${minutes} phút`,
    rescueTitle: "Hôm qua đèn chưa được thắp",
    rescueBody: (days) => `Chuỗi ${days} ngày vẫn cứu được, đến 23:59 hôm nay. Chọn một cách:`,
    rekindleTitle: "Thắp lại",
    rekindleBody: (needed, days) =>
      needed === 2
        ? `Đọc 2 đoạn hôm nay: một bù cho hôm qua, một cho hôm nay. Chuỗi nối lại thành ${days + 1} ngày.`
        : `Đọc thêm 1 đoạn nữa hôm nay. Chuỗi nối lại thành ${days + 1} ngày.`,
    recommended: "Nên chọn",
    restTitle: "Dùng ngày Sa-bát",
    restBody: (days) => `Hôm qua thành ngày nghỉ, chuỗi giữ nguyên ${days} ngày. Mỗi tuần được một ngày Sa-bát.`,
    restartBtn: "Bắt đầu lại từ ngày 1",
    recordKept: (record) => `Kỷ lục ${record} ngày vẫn được lưu dù bạn chọn gì.`,
    doneTitle: "Hôm nay đèn đã được thắp",
    doneBody: (days) => `${days} ngày liền đọc Lời Chúa. Mai đọc tiếp nhé.`,
    milestoneBadge: (flame) => `Mốc mới: ${flame}`,
    nextMilestone: (at, flame) => `Mốc ${at} ngày: ${flame}`,
    daysLeft: (left) => `Còn ${left} ngày để thắp ngọn lửa mới.`,
    allFlames: "Bạn đã thắp đủ sáu ngọn lửa. Trụ lửa cháy mãi khi bạn còn đọc mỗi ngày.",
    share: (days) => `Chia sẻ thẻ ${days} ngày`,
    sharePost: "Bài đăng",
    shareStory: "Story",
    shareFailed: "Chưa tạo được ảnh. Thử lại nhé.",
    sharePreview: "Xem trước ảnh chia sẻ",
    shareSend: "Chia sẻ ảnh",
    shareSave: "Tải ảnh",
    shareClose: "Đóng",
    cardTagline: () => "ngày liền đọc Lời Chúa",
    sheetLabel: "Đọc xong hôm nay",
    sheetClose: "Đọc tiếp",
    remindMe: (hour) => `Nhắc tôi lúc ${hour}:00`,
    remindHourLabel: "Giờ nhắc",
    remindOff: "Tắt nhắc",
    remindTry: "Xem thử thông báo",
    remindBlocked: "Trình duyệt đang chặn thông báo của trang. Mở cài đặt trang để bật lại.",
    remindFailed: "Chưa bật được lời nhắc. Thử lại sau nhé.",
    remindInstall: "Cài app về màn hình chính để nhận lời nhắc trên iPhone",
    notifyAtRisk: (days) => ({
      title: `Đèn ${days} ngày sắp tắt`,
      body: `Đèn ${days} ngày của bạn sẽ tắt lúc nửa đêm. Một đoạn ngắn là đủ giữ nó.`,
    }),
    notifyStart: { title: "Mỗi ngày một đoạn", body: "Hôm nay bạn chưa đọc đoạn nào. Vài phút thôi là đủ." },
    notifyRescue: (days) => ({
      title: "Hôm qua đèn chưa được thắp",
      body: `Chuỗi ${days} ngày vẫn cứu được hôm nay: đọc 2 đoạn, hoặc dùng ngày Sa-bát.`,
    }),
  },
  profile: {
    nameLabel: "Tên hiện trên thẻ",
    addPhoto: "Thêm ảnh",
    changePhoto: "Đổi ảnh",
    removePhoto: "Bỏ ảnh",
    save: "Lưu",
    cancel: "Huỷ",
    edit: "Sửa",
    editLong: "Sửa tên và ảnh",
    add: "Thêm tên và ảnh của bạn",
    showOnCard: "Hiện tên và ảnh của tôi",
    photoFailed: "Không đọc được ảnh này. Thử ảnh khác nhé.",
    saveFailed: "Chưa lưu được. Thử lại nhé.",
  },
  continueReading: {
    heading: (dateTime) => `Xem tiếp · ${dateTime}`,
    readAgain: "Đọc lại đoạn này",
    continueBtn: "Tiếp tục đọc",
    nextChapter: (label) => `Đoạn kế: ${label} →`,
    statsAriaLabel: "Thống kê đọc",
    chaptersRead: () => "đoạn đã xem",
    dayStreak: "ngày liên tiếp",
    booksOpened: () => "sách đã mở",
    localOnlyPrefix: "Lịch sử đang lưu trên máy này",
    signInToSync: "Đăng nhập để đồng bộ mọi thiết bị",
  },
  chapter: {
    kicker: (book, number) => `${book} · Đoạn ${number}`,
    lead: (versesCount, minutes) => `${versesCount} câu · khoảng ${minutes} phút đọc · chạm chỗ dẫn để đọc nguyên văn`,
    storyAriaLabel: "Câu chuyện",
    keyTakeaways: "Điều cần nhớ",
    deeperMeaning: "Ý nghĩa sâu xa",
    notesAndNuances: "Lưu ý",
    commentatorsHeading: (count) => `Các nhà giải kinh nói gì (${count})`,
    fullTextHeading: (versesCount) => `Nguyên văn cả đoạn · ${versesCount} câu`,
    inlineScriptureHeading: (book, verseLabel) => `Nguyên văn · ${book} ${verseLabel}`,
    confidencePrefix: "Tin cậy:",
    confidence: { cao: "Cao", vua: "Vừa", thap: "Thấp" },
    lowConfidencePrefix: "Mức Thấp:",
    closePopover: "Đóng",
    bottomNavLabel: "Chuyển đoạn cuối bài",
    progressRegionLabel: "Tiến độ đọc đoạn này",
    prevChapterAria: (book, number) => `Đoạn trước: ${book} ${number}`,
    nextChapterAria: (book, number) => `Đoạn kế: ${book} ${number}`,
    completedLabel: "✓ Đã đọc xong",
    markCompleteLabel: "Đánh dấu xong",
  },
  moods: {
    kicker: (count) => `Đọc theo cảm xúc · ${count} chủ đề`,
    heading: "Bạn đang cảm thấy thế nào?",
    subtitle: "Chọn tâm trạng hoặc gõ từ khóa. Lời Kinh Thánh Bản Truyền Thống sẽ ở ngay đây.",
    searchLabel: "Tìm cảm xúc, chủ đề hoặc tên sách Kinh Thánh",
    searchPlaceholder: "Tìm: vui, buồn, lo âu, Thi-thiên…",
    clearSearchAria: "Xóa từ khóa tìm kiếm",
    clearFilter: "Xóa lọc",
    groupsHeading: "Nhóm chủ đề",
    allCount: (count) => `Tất cả (${count})`,
    randomMessage: "Lời nhắn ngẫu nhiên",
    filterGroupAria: "Lọc theo nhóm chủ đề",
    showingCountPrefix: "Đang hiện",
    showingCountSuffix: (total) => `/ ${total} chuyên mục.`,
    emptyTitle: (query) => `Không tìm thấy chuyên mục nào khớp với “${query}”.`,
    emptyHintPrefix: "Thử tìm bằng từ ngắn hơn như",
    emptyHintExamples: ["vui", "buồn", "lo âu", "cô đơn"],
    emptyHintBookPrefix: "hoặc tên sách như",
    emptyHintBookExample: "Thi-thiên",
    resetAllBtn: (count) => `Xem lại cả ${count} chuyên mục`,
    groupTopicsCount: (count) => `${count} chuyên mục`,
    backToTop: "↑ Đầu trang",
    readBadge: "✓ Đã đọc",
    quickShortcuts: [
      { slug: "vui-mung", label: "Vui mừng", hue: "#c9a227" },
      { slug: "buon-ba", label: "Buồn bã", hue: "#6b7fa8" },
      { slug: "lo-au-tuong-lai", label: "Lo âu", hue: "#8a6fb0" },
      { slug: "co-don", label: "Cô đơn", hue: "#c0714f" },
      { slug: "met-moi-kiet-suc", label: "Mệt mỏi", hue: "#5d8f7b" },
      { slug: "tuc-gian", label: "Tức giận", hue: "#9b5a6a" },
      { slug: "kho-tha-thu-nguoi-khac", label: "Khó tha thứ", hue: "#c47a9a" },
      { slug: "can-su-khon-ngoan", label: "Cần khôn ngoan", hue: "#4d8a7f" },
    ],
    detail: {
      backToAll: "‹ 100 cảm xúc",
      scriptureHeading: (count) => `Lời Kinh Thánh dành cho bạn · ${count} đoạn`,
      belongsToChapter: (book, chapter) => `Thuộc đoạn ${book} ${chapter}`,
      readFullChapter: (book, chapter) => `Đọc cả đoạn ${book} ${chapter}`,
      prayerHeading: "Lời cầu nguyện",
      relatedHeading: "Có thể bạn cũng đang tìm",
      bottomNavLabel: "Điều hướng cuối trang",
    },
  },
  copyVerse: {
    copy: "Sao chép",
    copied: "Đã chép ✓",
    ariaLabel: (label) => `Sao chép ${label}`,
    formatPassage: (label, body) => `“${body}” — ${label} (Kinh Thánh Bản Truyền Thống)`,
  },
  share: {
    share: "Chia sẻ",
    copiedLink: "Đã chép link ✓",
  },
  ebook: {
    kicker: "Đọc ngoại tuyến",
    heading: "Tải ebook cho Kindle",
    intro:
      "File EPUB, đọc được trên Kindle, Apple Books, Google Play Sách. Mỗi đoạn một trang, có mục lục theo sách và đoạn; chạm vào chỗ dẫn như (1:26) để xem câu Kinh Thánh ngay tại chỗ.",
    editionGroupLabel: "Phiên bản",
    conciseEdition: "Bản gọn",
    fullTextEdition: "Kèm nguyên văn cả đoạn",
    conciseHint: "Chỉ có ghi chú. Chạm vào chỗ dẫn vẫn hiện câu Kinh Thánh.",
    fullTextHint: "Sau ghi chú của mỗi đoạn là toàn văn đoạn đó theo Bản Truyền Thống. Dài gần gấp đôi.",
    bundlesHeading: "Theo bộ",
    bundleInfo: (books, chapters) => `${books} sách · ${chapters} đoạn`,
    downloadPrefix: "kinh-thanh-",
    kindleHeading: "Đưa vào Kindle",
    kindleSteps: {
      step1: "Tải file EPUB ở trên về máy.",
      step2Before: "Mở ",
      step2After: ", đăng nhập, kéo file vào. Hoặc gửi email kèm file tới địa chỉ Kindle của bạn (xem trong Amazon: ",
      step2Path: "Manage Your Content and Devices → Preferences → Personal Document Settings",
      step3: "Vài phút sau sách hiện trong thư viện Kindle. Ebook cập nhật mỗi khi site có đoạn mới: tải và gửi lại.",
    },
  },
  history: {
    kicker: "Nhật ký đọc Kinh Thánh",
    heading: "Lịch sử đã xem",
    syncing: "Đang đồng bộ…",
    refresh: "Làm mới",
    guestBannerBefore: "Lịch sử đang lưu trên thiết bị này. ",
    guestBannerBold: "Đăng nhập",
    guestBannerAfter: " để đồng bộ đám mây.",
    signInBtn: "Đăng nhập",
    loadingLabel: "Đang tải lịch sử đọc của bạn…",
    continueHeading: (dateTime) => `Xem tiếp · ${dateTime}`,
    readAgain: "Đọc lại đoạn này",
    continueBtn: "Tiếp tục đọc",
    nextChapter: (label) => `Đoạn kế: ${label} →`,
    statsAriaLabel: "Thống kê tiến độ đọc",
    ofTotalChapters: "/ 1.189 đoạn",
    dayStreak: "ngày liên tiếp",
    completedCount: "đã đọc xong",
    filterGroupAria: "Lọc lịch sử đọc",
    tabAll: "Tất cả",
    tabBible: "Kinh Thánh",
    tabMoods: "Cảm xúc",
    tabCompleted: "Đã xong",
    clearAll: "Xóa hết",
    confirmClear: "Xác nhận xóa",
    cancel: "Hủy",
    emptyAll: "Chưa có lịch sử đọc nào.",
    emptyFiltered: "Không có mục nào trong bộ lọc này.",
    emptyDesc:
      "Khi bạn mở một đoạn Kinh Thánh hoặc chủ đề cảm xúc, trang sẽ tự lưu lại ngày giờ để bạn quay lại xem tiếp.",
    startGenesisCta: "Đọc Sáng-thế Ký 1",
    startGenesisHref: "/sang-the-ky/1",
    browseMoodsCta: "Đọc theo cảm xúc",
    itemsCount: (count) => `${count} mục`,
    moodPrefix: (subtitle) => `Cảm xúc · ${subtitle}`,
    doneBadge: "✓ Xong",
    unmarkTitle: "Bỏ đánh dấu đã đọc xong",
    markTitle: "Đánh dấu đã đọc xong",
    markBtn: "Đánh dấu",
    continueItemBtn: "Xem tiếp",
    deleteItemAria: (title, dateLabel) => `Xóa ${title} khỏi lịch sử ngày ${dateLabel}`,
    today: "Hôm nay",
    yesterday: "Hôm qua",
    atWord: "lúc",
  },
  account: {
    loadingLabel: "Đang kiểm tra phiên đăng nhập và đồng bộ lịch sử…",
    syncKicker: "Đồng bộ lịch sử đọc",
    signInHeading: "Đăng nhập tài khoản",
    signInDesc:
      "Lưu lại ngày tháng năm đã xem, đoạn đang đọc dở và chuỗi ngày đọc để mở xem tiếp liền mạch trên mọi thiết bị.",
    notConfiguredBefore: "Chưa cấu hình WorkOS Client ID trên môi trường này. Bạn vẫn có thể xem lịch sử tạm tại ",
    notConfiguredLink: "trang Lịch sử",
    notConfiguredAfter: ".",
    redirecting: "Đang chuyển sang trang đăng nhập…",
    signInBtn: "Đăng nhập",
    signUpBtn: "Tạo tài khoản mới",
    securityFootnote:
      "Xác thực an toàn qua WorkOS AuthKit. Lịch sử bạn đã đọc trên trình duyệt này sẽ tự động gộp vào tài khoản sau khi đăng nhập.",
    syncingBadge: "✓ Đang đồng bộ đám mây",
    chaptersSeen: () => "đoạn đã xem",
    chaptersCompleted: "đã đọc xong",
    dayStreak: "ngày liên tiếp",
    openHistoryBtn: "Mở lịch sử đọc →",
    signOutBtn: "Đăng xuất",
    defaultUserName: "Bạn đọc",
    errors: {
      accessDenied: "Bạn đã hủy quá trình đăng nhập.",
      invalidRedirectUri: "Redirect URI chưa được khai báo trong WorkOS Dashboard (cần thêm đường dẫn /tai-khoan).",
      network: "Không kết nối được máy chủ WorkOS. Hãy kiểm tra kết nối mạng hoặc cấu hình CORS trong WorkOS Dashboard.",
      sessionExpired: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      genericWithReason: (raw) => `Không thể đăng nhập (${raw}).`,
      generic: "Đã xảy ra lỗi khi kết nối WorkOS. Vui lòng thử lại.",
      notConfigured: "Tính năng đăng nhập WorkOS chưa được cấu hình.",
      syncFailed: "Không đồng bộ được lịch sử từ đám mây lúc này.",
      visitSyncFailed: "Lượt đọc vừa mở chưa kịp đồng bộ lên máy chủ.",
      completeSyncFailed: "Không cập nhật được trạng thái đã đọc xong lên máy chủ.",
      deleteLogFailed: "Không xóa được mục lịch sử trên máy chủ.",
      deleteItemFailed: "Không xóa được mục khỏi đám mây.",
      clearFailed: "Không xóa được lịch sử trên máy chủ.",
    },
  },
  tour: {
    welcomeKicker: "Chào mừng",
    welcomeTitle: "Mỗi ngày một đoạn, bằng lời thường",
    welcomePoints: [
      { title: "Đọc câu chuyện trước.", body: "Mỗi đoạn được kể lại bằng lời thường, đọc trong vài phút." },
      { title: "Nguyên văn 1926 luôn kề bên.", body: "Chạm số câu để đọc lời gốc." },
      { title: "Tiến độ tự lưu.", body: "Không cần tài khoản. Đăng nhập chỉ để đồng bộ." },
    ],
    welcomeStart: "Đọc đoạn đầu, có chỉ dẫn",
    welcomeLater: "Tôi tự xem",
    stepOf: (step, total) => `Bước ${step} / ${total}`,
    steps: {
      ref: {
        title: "Chạm số câu để đọc nguyên văn",
        body: "Câu Kinh Thánh mở ngay dưới đoạn văn, không rời trang. Chạm lần nữa để gấp lại.",
      },
      notes: {
        title: "Đào sâu khi muốn",
        body: "Mở các phần gấp để xem ý nghĩa, lưu ý và lời các nhà giải kinh. Mỗi ý kiến có nhãn độ tin cậy: cao, vừa, thấp.",
      },
      display: {
        title: "Chữ to hơn, đọc ban đêm dễ hơn",
        body: "Nút mặt trăng đổi sáng / tối, nút Aa chọn cỡ chữ và phông. Chọn cỡ chữ ngay đây cũng được:",
      },
      next: {
        title: "Đọc xong thì sang đoạn kế",
        body: "Tiến độ tự lưu. Trang chủ có thêm Cảm xúc, Lịch sử và Tôi ở thanh dưới.",
      },
    },
    arrowKeysHint: "Trên máy tính: phím ← → mở đoạn trước / sau.",
    next: "Tiếp",
    back: "Quay lại",
    skip: "Bỏ qua hướng dẫn",
    done: "Xong, đọc tiếp",
    replay: "Xem lại hướng dẫn",
    replayHint: "4 bước, khoảng 1 phút",
  },
  notFound: {
    heading: "Không tìm thấy trang này",
    description: "Có thể đoạn này chưa có ghi chú, hoặc đường dẫn bị gõ sai.",
    backHome: "Về trang chủ",
  },
  skeleton: {
    loading: "Đang tải…",
  },
};

const dayWord = (n: number) => (n === 1 ? "day" : "days");

const EN: Messages = {
  locale: "en",
  htmlLang: "en",
  ogLocale: "en_US",
  ogLocaleAlternate: "vi_VN",
  bibleVersionName: "Berean Standard Bible (BSB)",
  bibleVersionShort: "BSB",
  bibleSourceUrl: "https://ebible.org/find/details.php?id=engbsb",
  aiNotice:
    "Study notes were drafted with AI assistance (Opus 5.5 ~15% and Gemini Neon 4 for the remainder). Occasional inaccuracies may occur — please verify directly against Scripture or consult a pastor.",
  seo: {
    siteName: "One Chapter a Day — Plain-Language Bible",
    defaultTitle: "One Chapter a Day — Plain-Language Bible Study",
    defaultDescription:
      "Read all 66 books and 1,189 chapters of the Bible in clear everyday English — tap any citation for Berean Standard Bible (BSB) scripture inline, 100 mood guides, Kindle EPUBs, and cloud-synced reading history. Always free, non-profit & open source.",
    ogImageAlt:
      "One Chapter a Day — Plain-language Bible study across all 66 books with Berean Standard Bible (BSB) inline Scripture",
    chapterTitle: (book, chapter, title) => `${book} ${chapter} — ${title} | One Chapter a Day`,
    chapterFallbackDesc: (book, chapter, title) =>
      `Read ${book} chapter ${chapter} (${title}) in clear everyday English with Berean Standard Bible (BSB) Scripture inline.`,
    moodsTitle: "Read the Bible by Mood — 100 Guides | One Chapter a Day",
    moodsDescription:
      "Choose how you are feeling right now (anxious, grieving, grateful, needing wisdom...) to read Berean Standard Bible passages with reflection notes and prayers.",
    moodDetailTitle: (title) => `${title} — Bible by Mood | One Chapter a Day`,
    ebookTitle: "Download EPUB Ebooks for Kindle & Apple Books | One Chapter a Day",
    ebookDescription:
      "Free offline EPUB editions of plain-language Bible chapter notes for Kindle, Apple Books, and Google Play Books — concise or with full Berean Standard Bible text.",
    historyTitle: "Bible Reading History | One Chapter a Day",
    historyDescription:
      "Track reading dates, daily streaks, per-book progress rings, and pick up right where you left off across devices.",
    accountTitle: "Account & Cloud Sync | One Chapter a Day",
    accountDescription:
      "Sign in to sync your Bible reading history and chapter progress across phone and computer.",
    contactTitle: "Contact & Feedback | One Chapter a Day",
    contactDescription:
      "Contact One Chapter a Day via Email, Zalo, Facebook, Instagram, or GitHub for study-note feedback, bug reports, translations, or data requests.",
    installTitle: "Install the App | One Chapter a Day",
    installDescription:
      "Install One Chapter a Day on your iPhone, Android or computer home screen to open it in one tap and read the Bible even offline.",
    notFoundTitle: "Page Not Found | One Chapter a Day",
    notFoundDescription: "The chapter or link you opened does not exist.",
  },
  header: {
    brand: "Bible",
    booksButton: "Books",
    pickBookAndChapter: "Choose book and chapter",
    booksNavLabel: "Bible books",
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    chaptersOfBook: (book) => `Chapters of ${book}`,
    backToToc: "Contents",
    searchByMood: "Browse by mood",
    accountLabel: (name) => `Account: ${name}`,
    signInLabel: "Sign in",
    switchLanguageLabel: "Chuyển sang Tiếng Việt",
    switchLanguageShort: "VI",
  },
  dock: {
    navLabel: "Main navigation",
    read: "Read",
    moods: "Moods",
    history: "History",
    me: "Me",
  },
  footer: {
    scripturePrefix: "Scripture: Berean Standard Bible (public domain), via",
    sourceWord: "eBible.org",
    downloadEbook: "Download ebooks",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    install: "Install app",
    contributeLanguage: "Contribute another language",
    contributeLanguageUrl: `${REPO_URL}#adding-another-language`,
    openSourcePrefix: "Non-profit & open source on",
    openSourceLink: "GitHub",
  },
  legal: {
    updatedLabel: "Last updated:",
    contactPrompt: "Questions or requests about your data:",
    contactLink: "visit our Contact page",
  },
  install: {
    kicker: "Install the app",
    heading: "Put the Bible on your home screen",
    intro:
      "Open it in one tap like any app, and keep reading the chapters you have opened when you are offline. No app store needed, and it takes only a few MB.",
    benefits: [
      "Opens from your home screen, full screen",
      "Read the chapters you have opened offline",
      "Free, no ads, remove it any time",
    ],
    choosePlatform: "Choose your device",
    detected: (platform) => `Detected: ${platform}`,
    tabsLabel: "Platform",
    platforms: { ios: "iPhone / iPad", android: "Android", desktop: "Computer", mac: "Mac (Safari)" },
    guides: {
      ios: {
        heading: "iPhone and iPad",
        steps: [
          "Open this page in Safari.",
          "Tap the Share button in the bottom bar. Not there? Tap the ≡ button in the address bar at the bottom of the screen, then choose “Share”.",
          "Scroll down and choose “Add to Home Screen”.",
          "Tap “Add”. The Bible icon appears on your home screen.",
        ],
      },
      android: {
        heading: "Android",
        steps: [
          "Open this page in Chrome.",
          "Tap the ⋮ button in the top-right corner.",
          "Choose “Add to Home screen”, then “Install”.",
        ],
      },
      desktop: {
        heading: "Computer (Chrome, Edge)",
        steps: [
          "Click the Install icon at the end of the address bar.",
          "Choose “Install”. The app opens in its own window and appears in Start or Launchpad.",
        ],
      },
      mac: {
        heading: "Mac (Safari)",
        steps: ["In the menu bar, choose File, then “Add to Dock”.", "Click “Add”. The Bible icon appears in your Dock."],
      },
    },
    shareButton: "Share button",
    shareMenu: ["Add to Favorites", "Add to Home Screen", "Find on Page"],
    newSafari: "Newer Safari: the ≡ button in the address bar at the bottom",
    pageMenu: ["Translate", "Share", "Add to Bookmarks"],
    appName: "Bible",
    iosChromeNote: "Using Chrome on iPhone? Tap the Share button at the end of the address bar, then continue from step 3.",
    installButton: "Install app",
    orByHand: "No install dialog? Follow the steps below.",
    installed: "You are using the installed app. Thank you!",
    cornerToggle: "Quick install button in the corner",
    cornerToggleHint: "Turn it back on if you hid it",
    faqHeading: "Questions",
    faq: [
      {
        q: "Will my reading history carry over?",
        a: "On iPhone, the installed app keeps its data apart from Safari. Sign in once in the app to sync your reading history.",
      },
      { q: "What can I read offline?", a: "The home page and every chapter you opened while online." },
      { q: "How do I remove it?", a: "Press and hold the icon, then choose Remove, like any other app." },
    ],
    corner: {
      open: "Install app",
      tip: "Install the app, read offline",
      dismiss: "Hide install button",
      dismissed: "Hidden. Turn it back on from Install app at the bottom of the page.",
      undo: "Undo",
    },
  },
  contact: {
    kicker: "Contact & Feedback",
    heading: "Contact",
    intro:
      "Feedback on study notes, bug reports, account or privacy requests, and offers to help translate are always welcome. Reach out through whichever channel works best for you.",
    directHeading: "Direct contact",
    communityHeading: "Open source & Contributing",
    copy: "Copy",
    copied: "Copied ✓",
    copyAriaLabel: (label) => `Copy ${label}`,
    channels: {
      email: {
        label: "Email",
        description: "Detailed feedback, account deletion, or privacy inquiries.",
      },
      zalo: {
        label: "Zalo",
        description: "Send a quick message on Zalo.",
      },
      facebook: {
        label: "Facebook",
        description: "Message or connect on Facebook.",
      },
      instagram: {
        label: "Instagram",
        description: "Send a direct message on Instagram.",
      },
      githubIssues: {
        label: "GitHub Issues",
        description: "Report typos, suggest study-note edits, or propose features publicly.",
      },
      contributing: {
        label: "Contributing guide",
        description: "Content guidelines and how to help add another language.",
      },
    },
    noteHeading: "When reporting a passage or note",
    noteBody:
      "If you spot an error or unclear wording in a chapter, please include the book and chapter number (for example, Psalms 23) so we can review and fix it promptly.",
    noteFootnote:
      "One Chapter a Day is a free, volunteer-run project, so replies may occasionally take a day or two — thank you for your patience.",
  },
  display: {
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    triggerLabel: "Customize font, text size, and color theme",
    title: "Display & Typography",
    colorMode: "Color mode",
    readingSize: "Text size",
    readingFont: "Reading font",
    previewLabel: "Font preview",
    previewVerse: "The LORD is my shepherd; I shall not want.",
    themes: { system: "System", light: "Light", dark: "Dark" },
    scales: { sm: "Small", md: "Medium", lg: "Large" },
    fonts: {
      "source-serif": {
        tag: "Classic serif",
        description: "Balanced and crisp like a printed study Bible — site default.",
      },
      literata: {
        tag: "Book · Kindle style",
        description: "Crafted for long-form screen reading (Google Play Books).",
      },
      lora: {
        tag: "Warm serif",
        description: "Soft, expressive strokes — well suited for Psalms and reflection.",
      },
      newsreader: {
        tag: "Editorial serif",
        description: "Refined literary proportion that stays airy at larger sizes.",
      },
      "be-vietnam": {
        tag: "Clean sans",
        description: "Crisp modern sans-serif designed for sharp mobile legibility.",
      },
      lexend: {
        tag: "Easy-read sans",
        description: "Generous letter spacing to reduce eye fatigue during long reads.",
      },
    },
  },
  home: {
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    formatDateLine: (now) => {
      const day = EN.home.weekdays[now.getDay()];
      const month = EN.home.months[now.getMonth()];
      return `${day}, ${month} ${now.getDate()}`;
    },
    morning: "Good morning.",
    afternoon: "Good afternoon.",
    evening: "Good evening.",
    fallbackKicker: "Berean Standard Bible · 66 books · 1,189 chapters",
    fallbackHeadline: "The Bible in plain English.",
    subtitle: "Every chapter retold in clear everyday English, with Berean Standard Bible scripture inline.",
    emptyFallback: "No chapters available yet. Please check back soon.",
    startReading: (book, chapter) => `Start reading · ${book} ${chapter}`,
    readThisChapter: "Read this chapter →",
    moodsLink: "100 mood guides",
    ebookLink: "Download ebooks",
    booksHeading: "Books",
    chooseTestamentLabel: "Filter by testament",
    filterAll: "All",
    filterOld: (count) => `Old Testament · ${count}`,
    filterNew: (count) => `New Testament · ${count}`,
    chaptersCount: (count) => `${count} ${count === 1 ? "chapter" : "chapters"}`,
    readOfTotal: (read, total) => `${read} / ${total} read`,
    bookGroups: {
      law: "The Law",
      history: "History",
      poetry: "Poetry and Wisdom",
      majorProphets: "Major Prophets",
      minorProphets: "Minor Prophets",
      gospels: "Gospels and Acts",
      paul: "Paul's Letters",
      general: "General Letters and Revelation",
    },
    closeBook: "Close",
    legendCompleted: "completed",
    legendSeen: "visited",
    legendUnread: "unread",
    chapterDisplayLabel: "Chapter display mode",
    viewDots: "Grid",
    viewTitles: "Titles",
    chapterTitleAttr: (chapter, title, lastReadDate) =>
      lastReadDate ? `Chapter ${chapter}: ${title} (read ${lastReadDate})` : `Chapter ${chapter}: ${title}`,
    chapterAriaLabel: (chapter, title) => `Chapter ${chapter}: ${title}`,
    seenBadge: "• visited",
  },
  streak: {
    regionLabel: "Reading streak",
    daysLabel: (days) => `${dayWord(days)} in a row`,
    record: (days) => `Best ${days} ${dayWord(days)}`,
    weekdays: ["M", "T", "W", "T", "F", "S", "S"],
    marks: { read: "read", rest: "Sabbath rest", rekindled: "rekindled", missed: "missed", today: "today", future: "to come" },
    startTitle: "Light your candle today",
    startBody: "Read one chapter today to start your streak.",
    todayTitle: "Today: one chapter keeps the flame",
    todayBody: (days) => `Read a chapter before midnight and your streak grows to ${days + 1}.`,
    readNext: (label) => `Read ${label}`,
    atRiskTitle: (days) => `Your ${days}-day lamp goes out at midnight`,
    timeLeft: (hours, minutes) => `${hours} h ${minutes} min left`,
    shortTitle: "Only a few minutes?",
    shortBody: "A short chapter keeps the streak too.",
    shortMeta: (verses, minutes) => `${verses} verses · ${minutes} min`,
    rescueTitle: "Yesterday's lamp was not lit",
    rescueBody: (days) => `Your ${days}-day streak can still be saved until 23:59 today. Choose one:`,
    rekindleTitle: "Rekindle",
    rekindleBody: (needed, days) =>
      needed === 2
        ? `Read 2 chapters today: one for yesterday, one for today. Your streak joins up at ${days + 1} days.`
        : `Read 1 more chapter today. Your streak joins up at ${days + 1} days.`,
    recommended: "Best choice",
    restTitle: "Use a Sabbath rest",
    restBody: (days) => `Yesterday becomes a rest day and your streak stays at ${days}. One Sabbath a week.`,
    restartBtn: "Start over from day 1",
    recordKept: (record) => `Your best of ${record} ${dayWord(record)} is kept whatever you choose.`,
    doneTitle: "Today's lamp is lit",
    doneBody: (days) => `${days} ${dayWord(days)} in a row in God's Word. See you tomorrow.`,
    milestoneBadge: (flame) => `New milestone: ${flame}`,
    nextMilestone: (at, flame) => `${at} days: ${flame}`,
    daysLeft: (left) => `${left} ${dayWord(left)} to your next flame.`,
    allFlames: "You have lit all six flames. The pillar of fire burns on as long as you read each day.",
    share: (days) => `Share your ${days}-day card`,
    sharePost: "Post",
    shareStory: "Story",
    shareFailed: "Could not make the image. Please try again.",
    sharePreview: "Share card preview",
    shareSend: "Share image",
    shareSave: "Download image",
    shareClose: "Close",
    cardTagline: (days) => `${dayWord(days)} in a row in God's Word`,
    sheetLabel: "Today's reading done",
    sheetClose: "Keep reading",
    remindMe: (hour) => `Remind me at ${hour}:00`,
    remindHourLabel: "Reminder time",
    remindOff: "Turn off",
    remindTry: "Preview a notification",
    remindBlocked: "Your browser blocks this site's notifications. Allow them in the site settings.",
    remindFailed: "Could not turn on reminders. Please try again later.",
    remindInstall: "Add the app to your Home Screen to get reminders on iPhone",
    notifyAtRisk: (days) => ({
      title: `Your ${days}-day lamp is flickering`,
      body: `Your ${days}-day lamp goes out at midnight. A short chapter is enough to keep it.`,
    }),
    notifyStart: { title: "One chapter a day", body: "You have not read a chapter today. A few minutes is enough." },
    notifyRescue: (days) => ({
      title: "Yesterday's lamp was not lit",
      body: `Your ${days}-day streak can still be saved today: read 2 chapters, or use a Sabbath rest.`,
    }),
  },
  profile: {
    nameLabel: "Name on the card",
    addPhoto: "Add photo",
    changePhoto: "Change photo",
    removePhoto: "Remove photo",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    editLong: "Edit name and photo",
    add: "Add your name and photo",
    showOnCard: "Show my name and photo",
    photoFailed: "Couldn't read that photo. Try another one.",
    saveFailed: "Couldn't save. Try again.",
  },
  continueReading: {
    heading: (dateTime) => `Continue reading · ${dateTime}`,
    readAgain: "Read chapter again",
    continueBtn: "Continue reading",
    nextChapter: (label) => `Next: ${label} →`,
    statsAriaLabel: "Reading statistics",
    chaptersRead: (n) => (n === 1 ? "chapter read" : "chapters read"),
    dayStreak: "day streak",
    booksOpened: (n) => (n === 1 ? "book opened" : "books opened"),
    localOnlyPrefix: "History is saved on this device",
    signInToSync: "Sign in to sync across devices",
  },
  chapter: {
    kicker: (book, number) => `${book} · Chapter ${number}`,
    lead: (versesCount, minutes) =>
      `${versesCount} ${versesCount === 1 ? "verse" : "verses"} · ~${minutes} min read · tap citations for Scripture`,
    storyAriaLabel: "Story",
    keyTakeaways: "Key Takeaways",
    deeperMeaning: "Deeper Meaning",
    notesAndNuances: "Notes & Nuances",
    commentatorsHeading: (count) => `What Commentators Say (${count})`,
    fullTextHeading: (versesCount) => `Full chapter text · ${versesCount} ${versesCount === 1 ? "verse" : "verses"}`,
    inlineScriptureHeading: (book, verseLabel) => `BSB · ${book} ${verseLabel}`,
    confidencePrefix: "Confidence:",
    confidence: { cao: "High", vua: "Medium", thap: "Low" },
    lowConfidencePrefix: "Low confidence:",
    closePopover: "Close",
    bottomNavLabel: "Chapter navigation",
    progressRegionLabel: "Reading progress for this chapter",
    prevChapterAria: (book, number) => `Previous chapter: ${book} ${number}`,
    nextChapterAria: (book, number) => `Next chapter: ${book} ${number}`,
    completedLabel: "✓ Completed",
    markCompleteLabel: "Mark complete",
  },
  moods: {
    kicker: (count) => `Read by mood · ${count} guides`,
    heading: "How are you feeling today?",
    subtitle: "Pick a mood or search a keyword. Berean Standard Bible passages are right here.",
    searchLabel: "Search moods, topics, or Bible book names",
    searchPlaceholder: "Search: joy, anxiety, grief, Psalms…",
    clearSearchAria: "Clear search query",
    clearFilter: "Clear filter",
    groupsHeading: "Topic groups",
    allCount: (count) => `All (${count})`,
    randomMessage: "Random guide",
    filterGroupAria: "Filter by topic group",
    showingCountPrefix: "Showing",
    showingCountSuffix: (total) => `of ${total} guides.`,
    emptyTitle: (query) => `No guides matched “${query}”.`,
    emptyHintPrefix: "Try a shorter word like",
    emptyHintExamples: ["joy", "sadness", "anxiety", "loneliness"],
    emptyHintBookPrefix: "or a Bible book like",
    emptyHintBookExample: "Psalms",
    resetAllBtn: (count) => `View all ${count} guides`,
    groupTopicsCount: (count) => `${count} ${count === 1 ? "guide" : "guides"}`,
    backToTop: "↑ Top",
    readBadge: "✓ Read",
    quickShortcuts: [
      { slug: "joy", label: "Joy", hue: "#c9a227" },
      { slug: "sadness", label: "Sadness", hue: "#6b7fa8" },
      { slug: "anxiety-about-the-future", label: "Anxiety", hue: "#8a6fb0" },
      { slug: "loneliness", label: "Loneliness", hue: "#c0714f" },
      { slug: "exhaustion-and-burnout", label: "Exhaustion", hue: "#5d8f7b" },
      { slug: "anger", label: "Anger", hue: "#9b5a6a" },
      { slug: "struggling-to-forgive", label: "Forgiveness", hue: "#c47a9a" },
      { slug: "needing-wisdom", label: "Wisdom", hue: "#4d8a7f" },
    ],
    detail: {
      backToAll: "‹ 100 moods",
      scriptureHeading: (count) => `Scripture for you · ${count} passages`,
      belongsToChapter: (book, chapter) => `From ${book} ${chapter}`,
      readFullChapter: (book, chapter) => `Read full chapter ${book} ${chapter}`,
      prayerHeading: "A Short Prayer",
      relatedHeading: "You may also be looking for",
      bottomNavLabel: "Bottom navigation",
    },
  },
  copyVerse: {
    copy: "Copy",
    copied: "Copied ✓",
    ariaLabel: (label) => `Copy ${label}`,
    formatPassage: (label, body) => `“${body}” — ${label} (BSB)`,
  },
  share: {
    share: "Share",
    copiedLink: "Link copied ✓",
  },
  ebook: {
    kicker: "Offline reading",
    heading: "Download ebooks for Kindle",
    intro:
      "EPUB files compatible with Kindle, Apple Books, and Google Play Books. One page per chapter with a full book-and-chapter table of contents; tap any citation like (1:26) to view verses in a pop-up.",
    editionGroupLabel: "Edition",
    conciseEdition: "Concise edition",
    fullTextEdition: "With full chapter text",
    conciseHint: "Study notes only. Tapping any citation still opens the BSB verses.",
    fullTextHint: "Includes the complete Berean Standard Bible chapter text after each chapter's notes. Roughly twice as long.",
    bundlesHeading: "Editions",
    bundleInfo: (books, chapters) =>
      `${books} ${books === 1 ? "book" : "books"} · ${chapters} ${chapters === 1 ? "chapter" : "chapters"}`,
    downloadPrefix: "bible-",
    kindleHeading: "Send to Kindle",
    kindleSteps: {
      step1: "Download an EPUB file above to your device.",
      step2Before: "Open ",
      step2After: ", sign in, and drag the file in. Or email the EPUB to your Send-to-Kindle address (find it in Amazon under ",
      step2Path: "Manage Your Content and Devices → Preferences → Personal Document Settings",
      step3: "Within a few minutes it appears in your Kindle library. Re-download anytime as new updates are published.",
    },
  },
  history: {
    kicker: "Bible reading journal",
    heading: "Reading history",
    syncing: "Syncing…",
    refresh: "Refresh",
    guestBannerBefore: "History is currently saved on this device. ",
    guestBannerBold: "Sign in",
    guestBannerAfter: " to sync across devices.",
    signInBtn: "Sign in",
    loadingLabel: "Loading your reading history…",
    continueHeading: (dateTime) => `Continue reading · ${dateTime}`,
    readAgain: "Read again",
    continueBtn: "Continue reading",
    nextChapter: (label) => `Next: ${label} →`,
    statsAriaLabel: "Reading progress summary",
    ofTotalChapters: "/ 1,189 chapters",
    dayStreak: "day streak",
    completedCount: "completed",
    filterGroupAria: "Filter reading history",
    tabAll: "All",
    tabBible: "Bible",
    tabMoods: "Moods",
    tabCompleted: "Completed",
    clearAll: "Clear all",
    confirmClear: "Confirm clear",
    cancel: "Cancel",
    emptyAll: "No reading history yet.",
    emptyFiltered: "No entries match this filter.",
    emptyDesc: "Whenever you open a Bible chapter or mood guide, your reading dates and progress are saved automatically.",
    startGenesisCta: "Read Genesis 1",
    startGenesisHref: "/en/genesis/1",
    browseMoodsCta: "Browse by mood",
    itemsCount: (count) => `${count} ${count === 1 ? "entry" : "entries"}`,
    moodPrefix: (subtitle) => `Mood · ${subtitle}`,
    doneBadge: "✓ Done",
    unmarkTitle: "Remove completed mark",
    markTitle: "Mark as completed",
    markBtn: "Mark done",
    continueItemBtn: "Open",
    deleteItemAria: (title, dateLabel) => `Remove ${title} from history on ${dateLabel}`,
    today: "Today",
    yesterday: "Yesterday",
    atWord: "at",
  },
  account: {
    loadingLabel: "Checking your session and syncing history…",
    syncKicker: "Cloud reading sync",
    signInHeading: "Sign in",
    signInDesc:
      "Save your reading dates, current chapter, and daily streak so you can pick up seamlessly on any device.",
    notConfiguredBefore: "WorkOS Client ID is not configured in this environment. You can still view local history on the ",
    notConfiguredLink: "History page",
    notConfiguredAfter: ".",
    redirecting: "Redirecting to sign in…",
    signInBtn: "Sign in",
    signUpBtn: "Create account",
    securityFootnote:
      "Secured by WorkOS AuthKit. Reading history stored in this browser merges automatically into your account on sign-in.",
    syncingBadge: "✓ Cloud sync active",
    chaptersSeen: (n) => (n === 1 ? "chapter read" : "chapters read"),
    chaptersCompleted: "completed",
    dayStreak: "day streak",
    openHistoryBtn: "Open reading history →",
    signOutBtn: "Sign out",
    defaultUserName: "Reader",
    errors: {
      accessDenied: "Sign-in was canceled.",
      invalidRedirectUri: "Redirect URI is not registered in the WorkOS Dashboard (add /tai-khoan).",
      network: "Could not reach WorkOS. Please check your connection or CORS settings in the WorkOS Dashboard.",
      sessionExpired: "Your session has expired. Please sign in again.",
      genericWithReason: (raw) => `Unable to sign in (${raw}).`,
      generic: "Something went wrong connecting to WorkOS. Please try again.",
      notConfigured: "WorkOS authentication is not configured.",
      syncFailed: "Could not sync history from the cloud right now.",
      visitSyncFailed: "Your latest visit could not sync to the cloud yet.",
      completeSyncFailed: "Could not update completion status in the cloud.",
      deleteLogFailed: "Could not remove this history entry from the cloud.",
      deleteItemFailed: "Could not remove this item from the cloud.",
      clearFailed: "Could not clear cloud history.",
    },
  },
  tour: {
    welcomeKicker: "Welcome",
    welcomeTitle: "One chapter a day, in plain words",
    welcomePoints: [
      { title: "Read the story first.", body: "Each chapter is retold in plain words, a few minutes long." },
      { title: "The Bible text is always at hand.", body: "Tap a verse number to read the original." },
      { title: "Progress saves itself.", body: "No account needed. Sign in only to sync." },
    ],
    welcomeStart: "Read the first chapter, guided",
    welcomeLater: "I'll look around myself",
    stepOf: (step, total) => `Step ${step} of ${total}`,
    steps: {
      ref: {
        title: "Tap a verse number to read the text",
        body: "The verses open right under the paragraph, without leaving the page. Tap again to fold them.",
      },
      notes: {
        title: "Go deeper when you want",
        body: "Open the folded sections for meaning, notes and what commentators say. Each view carries a confidence label: high, medium, low.",
      },
      display: {
        title: "Bigger text, easier night reading",
        body: "The moon button switches light and dark; Aa picks text size and font. You can pick a size right here:",
      },
      next: {
        title: "Done? On to the next chapter",
        body: "Progress saves itself. The home page also has Moods, History and Me in the bottom bar.",
      },
    },
    arrowKeysHint: "On a computer: ← → open the previous or next chapter.",
    next: "Next",
    back: "Back",
    skip: "Skip the tour",
    done: "Done, keep reading",
    replay: "Replay the tour",
    replayHint: "4 steps, about a minute",
  },
  notFound: {
    heading: "Page not found",
    description: "This chapter may not be written yet, or the link may have a typo.",
    backHome: "Back to home",
  },
  skeleton: {
    loading: "Loading…",
  },
};

export const MESSAGES: Record<Locale, Messages> = { vi: VI, en: EN };

export function messagesFor(locale: Locale = "vi"): Messages {
  return MESSAGES[locale];
}
