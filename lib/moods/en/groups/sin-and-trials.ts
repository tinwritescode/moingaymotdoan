import type { MoodDefinition } from "../../types";

/** Group 5: Sin, Temptation & Repentance (10) · Group 6: Exhaustion, Illness & Trials (12). */
export const SIN_AND_TRIALS: readonly MoodDefinition[] = [
  // === 5. Sin, Temptation & Repentance (10) ===
  {
    slug: "guilt",
    title: "Weighed down by guilt",
    groupId: "temptation-and-repentance",
    prompt: "When you know you did wrong and your conscience will not let you rest.",
    intro:
      "A troubled conscience is not meant to drive you away from God, but to draw you back into His forgiving arms. Hiding sin only wears the heart down, while honest confession opens the door to real relief.",
    keywords: ["guilt", "remorse", "conscience", "confession", "forgiveness", "feeling guilty"],
    passages: [
      {
        ref: "1 John 1:9",
        note: "A promise as clear as daylight: whenever we honestly confess our sins, God is faithful and just to forgive us and cleanse us from every wrong.",
      },
      {
        ref: "Psalms 32:1–5",
        note: "David recalls how staying silent about his sin left his bones wasting away, yet the moment he confessed openly, he received forgiveness.",
      },
      {
        ref: "Isaiah 1:18",
        note: "Even when sin feels stained deep crimson and impossible to wash out, God's grace is strong enough to make you clean and white as snow.",
      },
      {
        ref: "Micah 7:18–19",
        note: "God does not forgive reluctantly; He genuinely delights in showing mercy and hurls our sins into the very depths of the sea.",
      },
      {
        ref: "Hebrews 9:13–14",
        note: "The blood of Christ does more than erase an outward record; it cleanses your conscience from the weight of guilt so you can serve God freely.",
      },
      {
        ref: "Romans 8:1–2",
        note: "In Christ, you no longer have to live under a sentence of condemnation; the Spirit of life sets you free from sin's grip.",
      },
    ],
    prayer:
      "Lord, I do not want to hide or run from my mistakes anymore. I honestly confess my wrongs before You; please let the blood of Christ cleanse my burdened conscience and help me walk forward in Your forgiveness. Amen.",
  },
  {
    slug: "shame-over-the-past",
    title: "Ashamed of the past",
    groupId: "temptation-and-repentance",
    prompt: "When memories of old mistakes keep resurfacing and filling you with shame.",
    intro:
      "Guilt says you did something wrong, while shame whispers that you are broken beyond repair. Scripture offers an entirely new identity in Christ, where your past no longer holds the right to define who you are.",
    keywords: ["shame", "regret", "past mistakes", "embarrassment", "new identity", "grace"],
    passages: [
      {
        ref: "Isaiah 54:4",
        note: "A tender assurance from the Lord: do not fear being disgraced or humiliated again, for He will lift away the reproach of your past.",
      },
      {
        ref: "Joel 2:25–26",
        note: "God has the power to restore the years that feel wasted and ruined, promising that His people will never again be put to shame.",
      },
      {
        ref: "Romans 10:11",
        note: "Scripture gives a steady promise for every trembling heart: anyone who puts their trust in Him will never be put to shame.",
      },
      {
        ref: "2 Corinthians 5:17",
        note: "Your past is not a life sentence; in Christ, the old has passed away and you are made genuinely new from the roots up.",
      },
      {
        ref: "Psalms 34:5",
        note: "When you stop staring down at old stains and lift your eyes to the Lord, His radiance replaces the shame weighing on your face.",
      },
      {
        ref: "1 Timothy 1:15–16",
        note: "Paul carried a painful history, yet Christ showed him mercy and made him an example of grace; your past is never beyond God's reach.",
      },
    ],
    prayer:
      "Father, memories of old mistakes still return and make me hang my head in shame. Help me look up to You instead of condemning myself over and over, and teach me to live in the new identity You have given me in Christ. Amen.",
  },
  {
    slug: "facing-temptation",
    title: "Facing strong temptation",
    groupId: "temptation-and-repentance",
    prompt: "When the pull toward something wrong feels intense and you fear giving in.",
    intro:
      "Being tempted is not the same as sinning—even Jesus faced temptation and knows its real weight. In the very moment the pull feels strongest, God has already provided a way through for you.",
    keywords: ["temptation", "resisting sin", "standing firm", "way of escape", "self-control", "weakness"],
    passages: [
      {
        ref: "1 Corinthians 10:13",
        note: "God is faithful and will not let you be tempted beyond what you can bear; right inside the testing, He opens a way out so you can endure.",
      },
      {
        ref: "Hebrews 4:15–16",
        note: "Because Jesus endured every kind of temptation as we do, He understands deeply; come boldly to His throne of grace for timely help.",
      },
      {
        ref: "James 4:7",
        note: "Standing firm rests on two connected steps: surrender yourself to God first, and from that place firmly resist the pull of evil.",
      },
      {
        ref: "Matthew 26:41",
        note: "Your spirit may truly want what is right while your flesh feels weak, which is why staying alert and praying is an essential shield.",
      },
      {
        ref: "Genesis 39:8–10",
        note: "Joseph refused to linger or negotiate with a temptation that returned day after day; reverence for God gives you strength to say no early.",
      },
      {
        ref: "Psalms 19:13–14",
        note: "When the draw toward wrong feels heavy, you can ask God to guard you from willful sin and keep both your words and thoughts pleasing to Him.",
      },
    ],
    prayer:
      "Lord Jesus, the pull toward what is wrong feels strong right now and I feel how weak I am. You have faced temptation Yourself and know my heart; keep me watchful and give me the courage to take the way out You provide today. Amen.",
  },
  {
    slug: "repeated-stumbling",
    title: "Stumbling in the same sin again",
    groupId: "temptation-and-repentance",
    prompt: "When you feel defeated after falling back into a habit you promised to quit.",
    intro:
      "Few things wear down the spirit faster than making a promise and falling into the exact same pit again. Even the apostle Paul voiced that painful tug-of-war—yet he refused to stay in despair and ran straight to rescuing grace.",
    keywords: ["relapse", "bad habits", "addiction", "stumbling", "falling again", "struggling with sin"],
    passages: [
      {
        ref: "Romans 7:18–25",
        note: "Paul speaks candidly about wanting to do good yet falling into the very wrong he hates, before lifting his eyes to deliverance through Jesus.",
      },
      {
        ref: "Proverbs 28:13",
        note: "Hiding a recurring failure only lets it grow stronger in the dark; bringing it into the light through confession and turning away brings mercy.",
      },
      {
        ref: "James 5:16",
        note: "You were never meant to fight this battle alone in silence; honest confession and prayer with someone you trust opens the way to healing.",
      },
      {
        ref: "Micah 7:8",
        note: "A steady word of resilience after another fall: even though you have stumbled, you will rise again, and the Lord Himself will be your light.",
      },
      {
        ref: "1 John 2:1–2",
        note: "When you stumble again, do not run away from God in despair; before the Father, you still have Jesus the Righteous One speaking in your defense.",
      },
      {
        ref: "Galatians 5:16–17",
        note: "The inner conflict between flesh and Spirit is real, so instead of relying on willpower alone, lean daily on the leading of the Spirit.",
      },
    ],
    prayer:
      "Lord God, I feel so discouraged after stumbling into the same old pattern I swore I would leave behind. I confess my weakness honestly; please lift me up in mercy through Christ my Advocate and teach me to walk by Your Spirit each day. Amen.",
  },
  {
    slug: "pride-and-complacency",
    title: "Recognizing pride and complacency",
    groupId: "temptation-and-repentance",
    prompt: "When you catch yourself looking down on others or boasting in your success.",
    intro:
      "Pride is one of the subtlest sicknesses of the heart because it loves to hide behind competence and praise. Noticing it early is a genuine mercy—it invites you to bow low before a hard fall forces you down.",
    keywords: ["pride", "arrogance", "complacency", "humility", "boasting", "self-righteousness"],
    passages: [
      {
        ref: "Proverbs 16:18",
        note: "A sober pattern repeated across every generation: pride always walks right ahead of destruction, and an arrogant spirit leads to a fall.",
      },
      {
        ref: "James 4:6",
        note: "God actively stands against the proud, yet He pours out abundant grace on everyone willing to humble themselves before Him.",
      },
      {
        ref: "1 Corinthians 4:7",
        note: "A clear-eyed question for any boastful moment: what gift, talent, or opportunity do you hold that was not first given to you?",
      },
      {
        ref: "Proverbs 11:2",
        note: "Pride quietly draws disgrace behind it, whereas true wisdom always makes its home with the humble.",
      },
      {
        ref: "Jeremiah 9:23–24",
        note: "Wisdom, strength, and wealth all fade; the only thing truly worth taking pride in is not your achievements, but knowing the Lord Himself.",
      },
      {
        ref: "Romans 12:3",
        note: "Paul urges you to view yourself with sober honesty—never higher than you ought—while receiving every God-given ability with gratitude.",
      },
    ],
    prayer:
      "Heavenly Father, forgive me for the pride in my heart and for thinking myself better than others. Every good thing I have comes from Your hand; teach me to live with humility, gratitude, and joy in knowing You above all else. Amen.",
  },
  {
    slug: "greed-and-love-of-money",
    title: "Pulled into greed and the love of money",
    groupId: "temptation-and-repentance",
    prompt: "When you keep chasing wealth, fearing scarcity, and losing peace over money.",
    intro:
      "Money makes a useful servant but a cruel master. Scripture does not condemn material provision, yet it speaks with quiet clarity whenever the love of wealth begins to claim the throne of the human heart.",
    keywords: ["greed", "money", "materialism", "covetousness", "contentment", "wealth"],
    passages: [
      {
        ref: "1 Timothy 6:9–10",
        note: "The love of money lies at the root of all kinds of evil, piercing those who chase it with countless hidden sorrows.",
      },
      {
        ref: "Luke 12:15",
        note: "Jesus offers a simple truth that is easy to forget: the real richness and worth of your life are never measured by what you own.",
      },
      {
        ref: "Matthew 6:21",
        note: "Wherever you place your highest treasure, your heart, focus, and deepest anxieties will quietly follow.",
      },
      {
        ref: "Ecclesiastes 5:10",
        note: "Whoever loves money never feels they have enough; the harder you chase wealth to quiet greed, the deeper the thirst grows.",
      },
      {
        ref: "Proverbs 30:7–9",
        note: "A remarkably balanced prayer for any season: neither overwhelming wealth that makes you forget God nor grinding poverty, only daily bread.",
      },
      {
        ref: "Psalms 62:10",
        note: "Even when income or savings grow, Scripture reminds you to keep an open hand and never anchor your heart to what can vanish overnight.",
      },
    ],
    prayer:
      "Lord, I can see my heart being pulled along by money and the fear of not having enough. Free me from the grip of greed, teach me true contentment with what You provide each day, and keep my heart wholly Yours. Amen.",
  },
  {
    slug: "battling-lust",
    title: "Battling lust and impure desires",
    groupId: "temptation-and-repentance",
    prompt: "When you are fighting to guard your mind, eyes, and body from unhealthy desire.",
    intro:
      "Keeping a pure heart in a world saturated with tempting images is never easy. Scripture does not tell you to white-knuckle your way through by willpower alone, but to flee early and fill your mind with what is good and holy.",
    keywords: ["lust", "purity", "sexual temptation", "guarding the eyes", "self-control", "holiness"],
    passages: [
      {
        ref: "1 Corinthians 6:18–20",
        note: "When facing sexual temptation, Scripture does not tell you to debate it but to flee at once, because your body is a treasured temple of God.",
      },
      {
        ref: "2 Timothy 2:22",
        note: "Running from youthful passions works best alongside a positive pursuit: seeking righteousness, faith, love, and peace with pure-hearted friends.",
      },
      {
        ref: "Psalms 119:9–11",
        note: "Treasuring God's word deep in your heart remains the steadier, lasting way to keep your daily walk clean.",
      },
      {
        ref: "Job 31:1",
        note: "Job chose to make a clear covenant with his eyes, turning temptation away at the front door before it could settle into his heart.",
      },
      {
        ref: "1 Thessalonians 4:3–5",
        note: "Honoring your body in holiness is not meant to restrict you, but to protect your dignity and align your life with who you are in God.",
      },
      {
        ref: "1 Peter 2:11",
        note: "Unchecked desires are never harmless; they quietly wage war against your soul, and seeing that clearly strengthens your resolve to turn away.",
      },
    ],
    prayer:
      "Holy Lord, please guard my eyes, my thoughts, and my body amid the daily temptations around me. Give me the wisdom to step away early from what makes me stumble, and fill my heart with Your word and clean, steady peace. Amen.",
  },
  {
    slug: "honesty-after-lying",
    title: "Returning to honesty after lying",
    groupId: "temptation-and-repentance",
    prompt: "When you hid the truth out of fear and now feel uneasy inside.",
    intro:
      "One small lie usually demands ten more to keep it covered, leaving your heart constantly anxious about being found out. Stepping back into the truth may sting at first, yet it brings lasting relief and freedom.",
    keywords: ["lying", "dishonesty", "truth", "honesty", "integrity", "hiding the truth"],
    passages: [
      {
        ref: "Proverbs 12:22",
        note: "Deceitful speech grieves the Lord deeply, while people who choose honesty and faithfulness bring Him genuine delight.",
      },
      {
        ref: "Ephesians 4:25",
        note: "Setting aside falsehood and speaking honestly with one another is the steady foundation of trust in every relationship.",
      },
      {
        ref: "Psalms 51:6",
        note: "What God longs for most is not a polished outward appearance, but quiet truthfulness deep within your heart.",
      },
      {
        ref: "John 8:32",
        note: "Truth carries a freeing power that lifts off the exhausting weight of hiding, pretending, and living in fear.",
      },
      {
        ref: "Zechariah 8:16",
        note: "God invites you to begin again with a simple daily choice: speak truthfully to the people around you and build peace rooted in trust.",
      },
      {
        ref: "Colossians 3:9–10",
        note: "Leaving behind the habit of hiding or deceiving is part of shedding your old self and being renewed daily in the image of your Creator.",
      },
    ],
    prayer:
      "Father of truth, I am sorry for hiding what was true out of fear and a desire to protect my image. Please forgive me, give me the courage to speak plainly, and build honest integrity deep inside my heart before You and others. Amen.",
  },
  {
    slug: "feeling-distant-from-god",
    title: "Feeling spiritually cold and distant from God",
    groupId: "temptation-and-repentance",
    prompt: "When your faith feels dry, prayer feels stiff, and your heart has drifted far.",
    intro:
      "Even a sincere life of faith passes through dry winter seasons. The quiet grace is that simply noticing your coldness and missing God's presence is already a sign that the ember inside you has not gone out.",
    keywords: ["spiritual dryness", "distant from god", "lukewarm", "cold heart", "backsliding", "renewal"],
    passages: [
      {
        ref: "Revelation 2:4–5",
        note: "When your first love grows dim, Christ does not invite despair—He invites you to remember, turn back, and return to simple first steps.",
      },
      {
        ref: "James 4:8",
        note: "You only need to take one honest step toward God, and He promises to draw close to you in return.",
      },
      {
        ref: "Psalms 51:10–12",
        note: "A heartfelt prayer for any dry soul: ask God to create a clean heart within you and restore the joy of His salvation.",
      },
      {
        ref: "Psalms 63:1",
        note: "Even when you feel stuck in a dry and waterless wasteland, your soul can still lift up an honest thirst for God.",
      },
      {
        ref: "Hosea 14:4",
        note: "A cold heart has never made God stop loving you; He promises to heal our waywardness and love us freely when we turn back to Him.",
      },
      {
        ref: "John 15:4–5",
        note: "Dryness often starts when a branch drifts from the vine; you do not need to manufacture feelings—simply return and abide in Jesus day by day.",
      },
    ],
    prayer:
      "Lord, my heart has felt dry and distant lately, like parched ground waiting for rain. I want to return to my first love for You; please renew my spirit, restore the joy of Your salvation, and keep me abiding closely in You each day. Amen.",
  },
  {
    slug: "repentance-and-starting-over",
    title: "Repenting and starting over",
    groupId: "temptation-and-repentance",
    prompt: "When you are ready to leave an old path behind and walk in a new direction.",
    intro:
      "It is never too late to come home. One of the most moving pictures in the New Testament is a father watching from afar and running to embrace a wayward child—and that is how God welcomes you today.",
    keywords: ["repentance", "starting over", "fresh start", "coming home", "new life", "forgiveness"],
    passages: [
      {
        ref: "Luke 15:20–24",
        note: "The moment the prodigal son turned homeward, his father spotted him from a distance, was filled with compassion, and ran to embrace him.",
      },
      {
        ref: "Ezekiel 36:26",
        note: "God does not merely patch up a hardened heart; He promises to remove the heart of stone and place a tender, responsive heart within you.",
      },
      {
        ref: "Acts 3:19",
        note: "Repenting and turning back to God clears away past wrongs and opens the door to seasons of deep spiritual refreshing.",
      },
      {
        ref: "Isaiah 55:7",
        note: "Leave old ways behind and return to the Lord, for His compassion runs deep and He forgives abundantly.",
      },
      {
        ref: "Joel 2:12–13",
        note: "God is not looking for empty outward gestures, but a heart genuinely turning back; He is gracious, slow to anger, and eager to welcome you.",
      },
      {
        ref: "2 Corinthians 7:10",
        note: "Godly sorrow never pushes you into hopeless self-destruction; instead, it leads to healthy repentance and a new life free of regret.",
      },
    ],
    prayer:
      "Merciful Father, today I turn away from my old paths and come home to You. Please take away any hardness in my heart, forgive all my past failures, and give me a new heart so I can walk wholly in Your grace. Amen.",
  },

  // === 6. Exhaustion, Illness & Trials (12) ===
  {
    slug: "exhaustion-and-burnout",
    title: "Exhaustion and burnout",
    groupId: "trials",
    prompt: "When body and mind feel completely drained and you have nothing left to give.",
    intro:
      "Exhaustion is not a sin; it is a quiet reminder that human beings have real limits. Give yourself permission to pause, breathe, and rest the full weight of your life on the God who never grows weary.",
    keywords: ["exhaustion", "burnout", "tired", "fatigue", "rest", "weary"],
    passages: [
      {
        ref: "Isaiah 40:28–31",
        note: "God never grows faint or weary; He gives strength to the exhausted and renews the vigor of those who have nothing left.",
      },
      {
        ref: "Matthew 11:28–29",
        note: "Jesus offers the simplest invitation for weary, overburdened souls: come just as you are and receive real rest from Him.",
      },
      {
        ref: "Mark 6:31",
        note: "Right in the middle of nonstop demands with no time even to eat, Jesus Himself told His disciples to step aside to a quiet place and rest.",
      },
      {
        ref: "Psalms 62:1–2",
        note: "Your soul finds its deepest, truest breath of rest only when it grows quiet before God alone.",
      },
      {
        ref: "1 Kings 19:5–8",
        note: "When Elijah collapsed in complete burnout, God did not scold him—He provided food and sleep, showing He cares about your tired body too.",
      },
      {
        ref: "Jeremiah 31:25",
        note: "A gentle promise for depleted days: God Himself will refresh your weary spirit and replenish your faint, worn-out heart.",
      },
    ],
    prayer:
      "Lord, have mercy on my tired body and drained mind right now. Teach me to pause without guilt, lay down every heavy burden before You, and receive fresh strength from the One who never grows weary. Amen.",
  },
  {
    slug: "illness-and-pain",
    title: "Illness and physical pain",
    groupId: "trials",
    prompt: "When you are coping with sickness, long treatment, or persistent bodily pain.",
    intro:
      "Physical pain turns ordinary tasks into uphill climbs and can easily pull your spirit down alongside your body. In hospital rooms or long, weary hours at home, you are not enduring this alone.",
    keywords: ["illness", "sickness", "chronic pain", "healing", "medical treatment", "health"],
    passages: [
      {
        ref: "Psalms 41:3",
        note: "The Lord tenderly sustains the sick on their bed of weakness and cares for them through every difficult stretch of illness.",
      },
      {
        ref: "James 5:14–15",
        note: "Scripture encourages you not to suffer in isolation, but to invite trusted believers to stand with you and pray for God's healing and care.",
      },
      {
        ref: "Psalms 73:26",
        note: "Even when physical strength and emotional energy both seem to fail, God remains the steady rock and strength of your heart.",
      },
      {
        ref: "2 Corinthians 12:9–10",
        note: "When a painful thorn in the body is not taken away right away, God's grace remains more than enough to carry you through each day.",
      },
      {
        ref: "Jeremiah 17:14",
        note: "When pain lingers, you can pray as simply as Jeremiah did, placing both your healing and your whole life directly into God's hands.",
      },
      {
        ref: "Romans 8:18",
        note: "Scripture never minimizes the bodily suffering you face today, yet it holds out real hope that this pain is not the final chapter of your story.",
      },
    ],
    prayer:
      "Lord God, the pain in my body leaves me weary and fragile at times. Please stay close beside me, uphold me hour by hour with Your sufficient grace, and keep my heart anchored in You even if the road to recovery feels long. Amen.",
  },
  {
    slug: "caring-for-the-sick",
    title: "Weariness while caring for a sick loved one",
    groupId: "trials",
    prompt: "When you are keeping watch over an ailing parent, spouse, or child.",
    intro:
      "Caregivers often feel pressure to stay strong on the outside while quietly carrying deep exhaustion and worry inside. Every sleepless night and quiet act of tenderness you give is fully seen by God.",
    keywords: ["caregiving", "caring for the sick", "sick family member", "caregiver fatigue", "hospital watch", "compassion"],
    passages: [
      {
        ref: "Galatians 6:2",
        note: "Helping carry the heavy load of someone in weakness is one of the truest ways to live out the loving law of Christ.",
      },
      {
        ref: "Matthew 25:36–40",
        note: "Every quiet gesture of tending to someone who is ill is deeply treasured by Jesus, as if you were caring for Him personally.",
      },
      {
        ref: "Isaiah 46:4",
        note: "While you pour yourself out to carry a loved one, remember that God Himself is also carrying and sustaining you.",
      },
      {
        ref: "Psalms 121:1–2",
        note: "In the middle of a tiring bedside watch, lift your eyes toward the help that comes from the Maker of heaven and earth.",
      },
      {
        ref: "Hebrews 6:10",
        note: "Even when long nights of caregiving go unnoticed by the world, God never forgets a single small act done out of love.",
      },
      {
        ref: "1 Thessalonians 5:14",
        note: "Supporting someone who is weak calls for steady endurance; ask God to replenish your gentle patience one day at a time.",
      },
    ],
    prayer:
      "Gracious Father, there are moments when I feel nearly empty from trying to stay strong for the loved one I am caring for. Hold me up in Your arms too, and renew my endurance and gentle patience so I can keep loving well. Amen.",
  },
  {
    slug: "financial-hardship",
    title: "Financial hardship and heavy debt",
    groupId: "trials",
    prompt: "When money is tight, bills are piling up, and basic needs feel uncertain.",
    intro:
      "Financial pressure is a heavy, tangible strain that can steal sleep and fray peace at home. These passages calm rising panic while offering steady wisdom and quiet trust in God's daily provision.",
    keywords: ["financial stress", "debt", "money worries", "bills", "provision", "hardship"],
    passages: [
      {
        ref: "Philippians 4:19",
        note: "Paul shares a grounded promise: God will faithfully supply every genuine need you have out of His abundant riches.",
      },
      {
        ref: "Matthew 6:31–33",
        note: "Your heavenly Father already knows what you need to eat and wear; trusting Him and keeping first things first steadies a panicked heart.",
      },
      {
        ref: "Psalms 37:25",
        note: "A lifetime of lived testimony: through decades of ups and downs, the psalmist never saw those who trust God abandoned without hope.",
      },
      {
        ref: "Proverbs 22:7",
        note: "Looking honestly at the real weight of debt helps you stay calm, make wise choices, and work step by step toward financial freedom.",
      },
      {
        ref: "1 Kings 17:14–16",
        note: "God did not fill the widow's pantry all at once, yet her flour and oil never ran dry day by day—and He knows how to sustain you step by step.",
      },
      {
        ref: "Romans 13:8",
        note: "Carrying debt does not lower your worth before God; this passage sets a clear direction—pay what you owe steadily, while keeping love as your lifelong debt.",
      },
    ],
    prayer:
      "Lord my Provider, mounting bills and debt have left my heart heavy and my nights restless. Grant me clear wisdom to manage what I have honestly, lift this burden step by step, and trust You to provide for each day. Amen.",
  },
  {
    slug: "job-loss-and-career-uncertainty",
    title: "Job loss and career uncertainty",
    groupId: "trials",
    prompt: "When you have lost work, are searching for a new role, or feel unsure about your career path.",
    intro:
      "Losing a job takes more than a paycheck—it can quietly shake your sense of dignity. Remember that your worth is far larger than any title or salary, and the God who opens doors is already walking ahead of you.",
    keywords: ["job loss", "unemployment", "job search", "career uncertainty", "layoff", "work"],
    passages: [
      {
        ref: "Psalms 90:17",
        note: "A warm, grounded prayer for anyone seeking work: ask the Lord to rest His favor on you and establish the work of your hands.",
      },
      {
        ref: "Revelation 3:8",
        note: "When rejection closes one door after another, remember there is One who opens a fresh door that no human hand can shut.",
      },
      {
        ref: "Proverbs 16:3",
        note: "Entrust every application, interview, and uncertain next step to the Lord so He can establish the right path for you.",
      },
      {
        ref: "Psalms 37:3–5",
        note: "During the waiting season between jobs, keep trusting the Lord and stay faithful in the small, honest tasks right in front of you.",
      },
      {
        ref: "Isaiah 48:17",
        note: "When your career road ahead looks foggy, you do not have to stumble forward alone; God teaches what is best and guides your steps.",
      },
      {
        ref: "Matthew 6:26",
        note: "Unemployment can tempt you to doubt your worth, yet Jesus reminds you that to your Father in heaven, you are far more precious than any job.",
      },
    ],
    prayer:
      "Lord, losing work has left me unsettled and anxious about what comes next. I place my plans and job search in Your hands; guide my steps, guard my sense of worth in You, and open the right door in Your good timing. Amen.",
  },
  {
    slug: "after-a-heavy-failure",
    title: "Recovering from a heavy failure",
    groupId: "trials",
    prompt: "When hard work collapses, a major project fails, or you fall short of big hopes.",
    intro:
      "Standing among the wreckage of something you poured your heart into hurts deeply. Yet throughout Scripture, many of the strongest lives—Moses, David, and Peter—were shaped right after a painful failure.",
    keywords: ["failure", "setback", "defeat", "starting again", "disappointment", "resilience"],
    passages: [
      {
        ref: "Proverbs 24:16",
        note: "Failure only becomes final when you refuse to get up; even if the righteous fall seven times, they rise again.",
      },
      {
        ref: "John 21:15–17",
        note: "After the most painful failure of Peter's life, Jesus did not discard him—He met him beside a warm charcoal fire and restored him.",
      },
      {
        ref: "Romans 8:28",
        note: "No painful experience or costly mistake is ever wasted once you place it into the redemptive hands of God.",
      },
      {
        ref: "Micah 7:8",
        note: "Falling today does not mean you will stay on the ground forever; the Lord Himself will shine light on your path and lift you up.",
      },
      {
        ref: "Jeremiah 18:3–4",
        note: "When a clay vessel collapsed on the wheel, the potter did not throw the clay away—he reshaped it into something new, and God is not done with you.",
      },
      {
        ref: "2 Corinthians 4:8–9",
        note: "A heavy setback may leave you pressed hard and knocked down, yet Paul reminds us that being struck down never means being destroyed or forsaken.",
      },
    ],
    prayer:
      "Father, watching my effort and hopes fall apart hurts more than I can say. Please lift me up from this discouragement, and use even this painful lesson to shape me with greater wisdom and steadiness in Your hands. Amen.",
  },
  {
    slug: "long-trials",
    title: "Long trials and ongoing hardship",
    groupId: "trials",
    prompt: "When one difficulty follows another with no clear end in sight.",
    intro:
      "Most of us can brace through a brief storm, yet a long stretch of hardship truly wears down our resolve. Scripture compares these seasons to a refiner's fire—not meant to consume you, but to purify a steadier faith.",
    keywords: ["trials", "hardship", "suffering", "perseverance", "adversity", "endurance"],
    passages: [
      {
        ref: "James 1:2–4",
        note: "Hardship itself is not pleasant, yet when endured with God, it builds steady perseverance that matures and completes your character.",
      },
      {
        ref: "1 Peter 1:6–7",
        note: "Faith that passes through the heat of prolonged testing emerges far more precious and enduring than refined gold.",
      },
      {
        ref: "Isaiah 43:2",
        note: "God never promises you will avoid deep waters or fierce fires, but He promises to walk beside you so the flood will not sweep you away.",
      },
      {
        ref: "2 Corinthians 4:17–18",
        note: "Even heavy, drawn-out troubles in this life remain temporary beside the lasting glory God is preparing ahead.",
      },
      {
        ref: "Psalms 66:10–12",
        note: "The psalmist never sugarcoats passing through fire and water, yet testifies that God led them out into abundance—a steady anchor while you endure.",
      },
      {
        ref: "1 Peter 5:10",
        note: "Long hardship can make you feel close to breaking, yet the God of all grace promises to restore, strengthen, and steady you after you suffer.",
      },
    ],
    prayer:
      "Faithful Lord, this unbroken chain of difficulties is wearing down my endurance. Please walk right beside me through deep waters and hard fires, keep my faith from failing, and make my heart strong and steadfast in You. Amen.",
  },
  {
    slug: "when-god-seems-silent",
    title: "When God seems silent",
    groupId: "trials",
    prompt: "When you keep praying and heaven feels completely quiet, with no clear sign.",
    intro:
      "Calling out again and again without hearing an answer is one of the deepest tests of faith. The Psalms and the book of Job are filled with honest cries asking how long God will wait—showing He is never angry when you bring Him your real questions.",
    keywords: ["silent god", "unanswered prayer", "waiting on god", "feeling unheard", "why god", "silence"],
    passages: [
      {
        ref: "Psalms 13:1–6",
        note: "David asks four raw times how long the Lord will seem hidden, yet still chooses to anchor his heart in God's unfailing love.",
      },
      {
        ref: "Job 23:8–10",
        note: "Though Job searches in every direction and cannot perceive God's presence, he holds fast to one quiet certainty: God knows the way he takes.",
      },
      {
        ref: "Psalms 22:1–5",
        note: "The psalmist cries out day and night feeling forsaken, then steadies his soul by remembering past generations who trusted God and were rescued.",
      },
      {
        ref: "Habakkuk 3:17–19",
        note: "Even when the fields stand bare and no miracle has arrived yet, the prophet chooses to stand firm and rejoice in the God of his salvation.",
      },
      {
        ref: "John 11:3–6",
        note: "Scripture places two truths side by side: Jesus deeply loved Lazarus and his sisters, yet waited two more days—His delay never means He stopped loving you.",
      },
      {
        ref: "Luke 18:1–7",
        note: "Jesus tells the parable of the persistent widow to urge you not to lose heart; God still hears His people when they cry out to Him day and night.",
      },
    ],
    prayer:
      "Lord, I have prayed again and again, and the silence leaves me bewildered and lonely. Help me trust that Your quietness is not abandonment, and keep my heart patient and steady as I wait for Your timing. Amen.",
  },
  {
    slug: "doubting-your-faith",
    title: "Doubt and shaken faith",
    groupId: "trials",
    prompt: "When your mind is full of hard questions and your faith feels unsteady.",
    intro:
      "Honest doubt is not the enemy of faith; bringing real questions to God is often how faith grows deeper roots. Jesus never turned anyone away simply because they admitted their belief felt small.",
    keywords: ["doubt", "shaken faith", "hard questions", "unbelief", "weak faith", "crisis of faith"],
    passages: [
      {
        ref: "Mark 9:24",
        note: "One of the most honest prayers in all the Gospels comes from a trembling father who confesses his belief while asking Jesus to help his unbelief.",
      },
      {
        ref: "John 20:27–29",
        note: "Jesus did not scold Thomas for his doubt; instead, He patiently held out His hands so Thomas could see for himself and believe.",
      },
      {
        ref: "Romans 14:1",
        note: "Scripture calls believers to welcome anyone whose faith feels fragile, without harsh arguments over the questions they are still working through.",
      },
      {
        ref: "Hebrews 11:1",
        note: "Faith does not mean closing your eyes to reality; it means placing steady confidence in a faithful God who stands beyond what our eyes can see.",
      },
      {
        ref: "Psalms 73:16–17",
        note: "When heavy questions left Asaph overwhelmed and worn out, his turning point came not from figuring everything out, but from entering God's presence.",
      },
      {
        ref: "Job 42:2–5",
        note: "Walking through a storm of honest questions did not ruin Job's faith; it moved him from merely hearing about God to knowing Him personally.",
      },
    ],
    prayer:
      "Lord God, my mind is crowded with unanswered questions and my faith feels shaky right now. I do not want to pretend to be strong before You; I believe, yet please help my unbelief and draw me closer to who You truly are. Amen.",
  },
  {
    slug: "mocked-for-your-faith",
    title: "Mocked or isolated for your faith",
    groupId: "trials",
    prompt: "When people around you ridicule, misunderstand, or exclude you because of your beliefs.",
    intro:
      "Holding quietly to your faith and convictions in an unsympathetic setting can feel deeply lonely. Jesus walked that road first, and He encourages you to remain calm, steady, and gracious.",
    keywords: ["mocked", "persecution", "ridicule", "isolated", "standing for faith", "misunderstood"],
    passages: [
      {
        ref: "John 15:18–20",
        note: "Jesus spoke plainly ahead of time so His followers would not be blindsided or crushed when the world responds to them with coldness.",
      },
      {
        ref: "1 Peter 3:14–16",
        note: "When your beliefs are questioned or mocked, answer with quiet gentleness, genuine respect, and a clear conscience.",
      },
      {
        ref: "Matthew 5:10–12",
        note: "Paying a real cost for choosing righteousness is never wasted; God sees every moment clearly and honors your faithfulness.",
      },
      {
        ref: "2 Timothy 1:12",
        note: "Paul refused to feel ashamed amid opposition and suffering because he knew personally the One in whom he had placed his trust.",
      },
      {
        ref: "Isaiah 51:7–8",
        note: "Human mockery and cold stares eventually fade away, while God's righteousness and salvation over your life stand firm forever.",
      },
      {
        ref: "Daniel 6:10",
        note: "Surrounded by hostility toward his faith, Daniel neither picked a fight nor hid in fear—he simply knelt and prayed to God as he always had.",
      },
    ],
    prayer:
      "Lord Jesus, being misunderstood and ridiculed for my faith can feel deeply isolating. Keep my heart free from bitterness or harsh replies, and give me quiet courage, gentleness, and a clear conscience among those around me. Amen.",
  },
  {
    slug: "disaster-and-crisis",
    title: "Shaken by disaster or sudden crisis",
    groupId: "trials",
    prompt: "When tragedy, bad news, or sudden upheaval leaves your heart stunned.",
    intro:
      "Unexpected crises that overturn everyday life remind us how small and fragile we truly are. These ancient words of Scripture offer the steadiest anchor when the ground beneath your feet seems to shake.",
    keywords: ["crisis", "disaster", "tragedy", "bad news", "emergency", "refuge"],
    passages: [
      {
        ref: "Psalms 46:1–7",
        note: "Even when mountains give way and seas roar, God remains right in the midst of His people as an unshakable refuge and fortress.",
      },
      {
        ref: "Psalms 112:7",
        note: "A heart anchored firmly in trust toward the Lord does not have to unravel in panic when frightening news arrives.",
      },
      {
        ref: "Psalms 91:1–2",
        note: "Taking shelter beneath the shadow of the Almighty is the surest refuge for a shaken soul in the middle of a storm.",
      },
      {
        ref: "Nahum 1:7",
        note: "The Lord is good, a strong refuge in the day of trouble, and He cares personally for everyone who turns to Him for safety.",
      },
      {
        ref: "Hebrews 12:28",
        note: "When sudden upheaval shakes every familiar support around you, Scripture reminds you that God's kingdom alone can never be shaken.",
      },
      {
        ref: "Mark 4:37–40",
        note: "In a fierce storm that threatened to sink their boat, the disciples were not alone—Jesus was right there with them, and you can call on Him too.",
      },
    ],
    prayer:
      "Almighty Lord, my refuge and strength, this sudden crisis makes me feel small and helpless. Guard my heart from panic, protect my family and all who are suffering loss, and be our unshakable fortress right now. Amen.",
  },
  {
    slug: "growing-older",
    title: "Growing older and facing frailty",
    groupId: "trials",
    prompt: "When strength begins to fade, hair turns gray, and you reflect on the years behind you.",
    intro:
      "Aging is never a season where human worth quietly fades away. In Scripture, gray hair is called a crown of honor, and God's promises for the later chapters of life grow even more tender.",
    keywords: ["aging", "growing older", "gray hair", "frailty", "later years", "legacy"],
    passages: [
      {
        ref: "Isaiah 46:4",
        note: "One of Scripture's warmest promises for later life: even into old age and gray hair, God Himself will still carry, sustain, and rescue you.",
      },
      {
        ref: "Psalms 92:12–14",
        note: "Even in old age, a life rooted deeply in God stays fresh and green, continuing to bear rich and nourishing fruit.",
      },
      {
        ref: "Psalms 71:17–18",
        note: "A moving prayer from someone who has walked a lifetime with God: do not forsake me when I am old and gray, so I may tell the next generation of Your faithfulness.",
      },
      {
        ref: "Proverbs 16:31",
        note: "Gray hair earned along a righteous path is a crown of honor marking a deep and well-lived life.",
      },
      {
        ref: "2 Corinthians 4:16",
        note: "Outward physical strength may gradually diminish with the years, yet God renews your inner spirit day by day so hope never fades.",
      },
      {
        ref: "2 Timothy 4:7–8",
        note: "Near the close of his journey, Paul looked back in deep peace because he had kept the faith; your later years still hold rich meaning before God.",
      },
    ],
    prayer:
      "Thank You, Lord, for walking faithfully with me through so many years right up to this season of gray hair and quieter strength. Keep carrying me, keep my spirit green and hopeful in You, and let my life remain a peaceful witness to the generations after me. Amen.",
  },
];
