import type { MoodDefinition } from "../../types";

/** Group 1: Joy & Gratitude (12) · Group 2: Sorrow, Loss & Loneliness (14). */
export const JOY_AND_SORROW: readonly MoodDefinition[] = [
  // === 1. Joy & Gratitude (12) ===
  {
    slug: "joy",
    title: "Joy",
    groupId: "joy",
    prompt: "When your heart feels light, bright, and full of gladness.",
    intro:
      "True joy comes from more than an easy day; it grows deeper when we recognize every good thing as a gift from God. These passages invite you to savor this gladness and share its warmth with those around you.",
    keywords: ["joy", "gladness", "rejoice", "cheerful", "delight", "uplifted"],
    passages: [
      {
        ref: "Philippians 4:4",
        note: "Paul wrote this call to rejoice from a prison cell, reminding us that the most lasting joy is rooted in the Lord rather than in easy circumstances.",
      },
      {
        ref: "Psalms 118:24",
        note: "Every peaceful day we live is God’s own handiwork, meant to be received with an open heart and genuine gladness.",
      },
      {
        ref: "Nehemiah 8:10",
        note: "Joy in the Lord is never just a fleeting mood; it is a steady well of strength that lifts and carries the soul.",
      },
      {
        ref: "Proverbs 17:22",
        note: "A glad heart works like good medicine, refreshing both body and spirit from the inside out.",
      },
      {
        ref: "John 15:11",
        note: "Jesus does not want your joy to fade with the passing hour; He shares His own joy with you so that your gladness may be full.",
      },
      {
        ref: "1 Peter 1:8–9",
        note: "Even though our eyes do not yet see Christ, loving and trusting Him kindles an unshakable joy that outlasts every changing season.",
      },
    ],
    prayer:
      "Joyful Father, my heart feels so light and bright today, and I want to pause and celebrate in Your presence. Keep this joy rooted deep in You, and help me share its warmth generously with everyone I meet. Amen.",
  },
  {
    slug: "gratitude",
    title: "Gratitude",
    groupId: "joy",
    prompt: "When you want to pause, count your blessings, and give thanks.",
    intro:
      "Gratitude turns ordinary daily moments into cherished gifts. Pausing for a few quiet minutes to give thanks opens the heart and keeps us mindful of the faithful hand that has carried us this far.",
    keywords: ["gratitude", "thankful", "thanksgiving", "blessed", "blessings", "appreciation"],
    passages: [
      {
        ref: "1 Thessalonians 5:18",
        note: "Giving thanks in every circumstance does not mean every moment feels pleasant, but that we trust God is faithfully with us at every step.",
      },
      {
        ref: "Psalms 103:1–5",
        note: "David gently reminds his own soul not to overlook a single kindness—God’s forgiveness, healing, and daily renewal of mercy.",
      },
      {
        ref: "James 1:17",
        note: "Every good and perfect gift in our lives flows down from the Father of lights, whose goodness never shifts or fades.",
      },
      {
        ref: "Psalms 136:1",
        note: "The simplest words of thanks are also the most enduring: the Lord is good, and His loving devotion never runs dry.",
      },
      {
        ref: "Colossians 3:17",
        note: "Thankfulness is not reserved for special occasions; even ordinary conversations and daily work can become quiet offerings of gratitude to the Father.",
      },
      {
        ref: "1 Chronicles 29:13–14",
        note: "David’s humble prayer of thanks reminds us that every good thing resting in our hands came first from God’s generous hand.",
      },
    ],
    prayer:
      "Gracious Lord, thank You for every breath, every meal, and the countless quiet blessings You weave into my days. Keep my heart tender and attentive, never taking Your kindness for granted, and eager to share what I have received. Amen.",
  },
  {
    slug: "happiness",
    title: "Happiness",
    groupId: "joy",
    prompt: "When life feels warm, sweet, and deeply full in this moment.",
    intro:
      "Scripture describes a truly blessed person as one whose roots reach down into living water that never runs dry. When your heart is happy, bringing that sweetness into God’s light makes it richer still.",
    keywords: ["happiness", "happy", "blessed", "fulfilled", "warmth", "delight"],
    passages: [
      {
        ref: "Psalms 1:1–3",
        note: "Lasting happiness is like a tree planted beside flowing streams—bearing fruit in season and staying green even under scorching heat.",
      },
      {
        ref: "Psalms 16:11",
        note: "In God’s presence there is a fullness of joy and quiet pleasure that time cannot wear away.",
      },
      {
        ref: "Ecclesiastes 3:12–13",
        note: "Rejoicing in life, doing good, and savoring the simple fruit of daily work are all beautiful gifts straight from God’s hand.",
      },
      {
        ref: "Matthew 5:3–8",
        note: "Jesus gently turns the world’s idea of happiness upside down: deep blessing belongs to the humble, the gentle, and the pure in heart.",
      },
      {
        ref: "Proverbs 16:20",
        note: "Proverbs offers a simple path to a blessed life: the one who “heeds instruction” and places quiet trust in the LORD rather than in self-reliance.",
      },
      {
        ref: "Luke 11:28",
        note: "Jesus points to a steady source of blessing within reach every single day: listening closely to God’s word and living it out.",
      },
    ],
    prayer:
      "Good and loving Lord, my heart feels so warm and full as I savor the sweetness of this moment. Teach me to treasure today’s simple happiness while keeping my roots planted deep in Your word, where true blessing endures. Amen.",
  },
  {
    slug: "peace",
    title: "Peace",
    groupId: "joy",
    prompt: "When your heart feels quiet and calm, and you want to guard that stillness.",
    intro:
      "Biblical peace is far more than the absence of noise; it is a deep wholeness that comes from resting in the Shepherd’s care. Let these passages anchor your heart in a stillness that lasts.",
    keywords: ["peace", "calm", "stillness", "serenity", "tranquil", "quiet heart"],
    passages: [
      {
        ref: "John 14:27",
        note: "Jesus offers a peace completely unlike the fragile calm the world gives—deep enough to quiet both a troubled heart and lingering fear.",
      },
      {
        ref: "Isaiah 26:3",
        note: "A mind kept steady and trusting in God is guarded by Him in an unbroken, whole peace.",
      },
      {
        ref: "Psalms 23:1–3",
        note: "Under the gentle care of the Good Shepherd, a weary soul can lie down in green pastures and breathe beside quiet waters.",
      },
      {
        ref: "Colossians 3:15",
        note: "Let the peace of Christ act as the quiet umpire in your heart, guiding your thoughts and responses throughout the day.",
      },
      {
        ref: "Numbers 6:24–26",
        note: "Aaron’s ancient blessing paints a tender picture: God turning His shining face toward you with grace and wrapping your life in peace.",
      },
      {
        ref: "2 Thessalonians 3:16",
        note: "Paul prays that the Lord of peace Himself will be near you and steady your heart not only on calm days, but at all times and in every way.",
      },
    ],
    prayer:
      "Lord of peace, thank You for this quiet moment when my heart feels settled and unhurried. Let the light of Your face rest upon me today, and let the peace of Christ guard my thoughts wherever this day leads. Amen.",
  },
  {
    slug: "hope",
    title: "Hope",
    groupId: "joy",
    prompt: "When you see light ahead and sense that good things are coming.",
    intro:
      "Hope in Scripture is never vague wishful thinking; it is a sturdy anchor fastened to the faithful promises of God. When fresh hope begins to stir in your heart, nourish it with these steady words.",
    keywords: ["hope", "hopeful", "expectation", "future", "bright", "trust"],
    passages: [
      {
        ref: "Romans 15:13",
        note: "The God of hope can fill your heart with quiet joy and peace as you trust Him, until hope itself overflows within you.",
      },
      {
        ref: "Jeremiah 29:11",
        note: "Even while His people were living far from home in exile, God assured them that His plans held peace, a future, and real hope.",
      },
      {
        ref: "Hebrews 6:19",
        note: "Hope placed in God acts like a firm, secure anchor that keeps the soul steady when currents shift.",
      },
      {
        ref: "Isaiah 40:31",
        note: "Those who wait quietly on the Lord receive fresh strength to rise above exhaustion and keep moving forward.",
      },
      {
        ref: "1 Peter 1:3–4",
        note: "Your hope does not rest on fragile luck, but on a living promise grounded in Christ’s resurrection and an inheritance that never fades.",
      },
      {
        ref: "Psalms 33:20–22",
        note: "Waiting on God is never empty waiting; trusting His holy name allows your heart to rejoice even before the answer comes into view.",
      },
    ],
    prayer:
      "God of all hope, thank You for the quiet light rising in my heart today. Hold my soul steady with this hope as an anchor, so that I can step into tomorrow with calm trust in Your faithful promises. Amen.",
  },
  {
    slug: "confidence",
    title: "Confidence and Steadfastness",
    groupId: "joy",
    prompt: "When you want to stand firm and walk forward without wavering.",
    intro:
      "Healthy confidence does not come from proving ourselves better than others, but from knowing God walks beside us. Standing on that quiet assurance frees us to move forward with calm courage.",
    keywords: ["confidence", "courage", "boldness", "strength", "steadfast", "brave"],
    passages: [
      {
        ref: "Joshua 1:9",
        note: "True courage is not built on personal ability alone, but on God’s promise that He is with you wherever you step.",
      },
      {
        ref: "2 Timothy 1:7",
        note: "The Spirit God gives is never one of timid shrinking, but of quiet strength, steady love, and a clear, self-controlled mind.",
      },
      {
        ref: "Philippians 4:13",
        note: "Paul discovered the secret to standing steady in any season: drawing fresh strength from Christ rather than from sheer willpower.",
      },
      {
        ref: "Psalms 27:1",
        note: "When the Lord is your light and the stronghold of your life, nothing ahead holds enough power to make you live in dread.",
      },
      {
        ref: "Deuteronomy 31:6",
        note: "Your steadiness does not depend on proving yourself strong enough; it rests on the promise that God goes with you and will never leave you.",
      },
      {
        ref: "Ephesians 6:10",
        note: "Instead of straining under self-made strength that quickly runs out, Paul invites you to grow strong in the Lord and lean on His mighty power.",
      },
    ],
    prayer:
      "Lord, You are my light and my stronghold. Keep my heart steady without pride, and courageous while remaining humble. Thank You for walking beside me today and filling me with quiet clarity and strength. Amen.",
  },
  {
    slug: "new-beginnings",
    title: "Excited for a New Beginning",
    groupId: "joy",
    prompt: "When a new chapter, journey, or season of life is opening before you.",
    intro:
      "Every fresh start brings both excitement and a touch of uncertainty. Before taking your first steps, listen to the promise of the God who makes all things new, and place this chapter in His hands.",
    keywords: ["new beginning", "fresh start", "new chapter", "new season", "excited", "plans"],
    passages: [
      {
        ref: "Isaiah 43:18–19",
        note: "God invites you to loosen your grip on old patterns and watch closely for the fresh path He is already opening ahead of you.",
      },
      {
        ref: "2 Corinthians 5:17",
        note: "In Christ, the weight of the old does not define your future; a genuinely new life has already begun.",
      },
      {
        ref: "Proverbs 16:3",
        note: "Placing your work and hopes into the Lord’s hands is the surest way for your plans to find steady footing.",
      },
      {
        ref: "Lamentations 3:22–23",
        note: "Every morning arrives like an unspoiled page, greeting you with fresh mercies and the unfailing faithfulness of God.",
      },
      {
        ref: "Philippians 1:6",
        note: "You can step into this new season at ease, knowing that the One who began a good work in you is faithful to carry it to completion.",
      },
      {
        ref: "Joshua 3:4–5",
        note: "Before stepping onto a road you have never walked before, the wisest preparation is a consecrated heart attentive to God’s lead step by step.",
      },
    ],
    prayer:
      "Lord, You are the Maker of all things new. I bring You both my excitement and my quiet butterflies as this new chapter opens. Go ahead of me along this unfamiliar road, and guide my plans into what pleases You. Amen.",
  },
  {
    slug: "contentment",
    title: "Contentment",
    groupId: "joy",
    prompt: "When what you have feels like enough and you want no part in restless striving.",
    intro:
      "In a world that constantly whispers you need more, a contented heart is a rare treasure. Scripture calls godliness paired with quiet contentment one of the richest gains a person can ever know.",
    keywords: ["contentment", "content", "enough", "simplicity", "satisfied", "peaceful living"],
    passages: [
      {
        ref: "1 Timothy 6:6–8",
        note: "We enter the world empty-handed and leave the same way; being content with daily essentials frees us from endless exhaustion.",
      },
      {
        ref: "Philippians 4:11–12",
        note: "Contentment is a quiet skill learned through lived experience, keeping the heart balanced whether life holds plenty or little.",
      },
      {
        ref: "Hebrews 13:5",
        note: "We can release our anxious grip on money because we hold a promise richer than any balance sheet: God will never forsake us.",
      },
      {
        ref: "Psalms 23:1",
        note: "Knowing that the Lord Himself shepherds your life slowly quiets the restless feeling that something is always missing.",
      },
      {
        ref: "Proverbs 15:16–17",
        note: "Proverbs reminds us of what daily comparison hides: a simple meal shared in love and reverence for God outweighs great wealth wrapped in turmoil.",
      },
      {
        ref: "Ecclesiastes 4:6",
        note: "One handful held in peace is worth far more than two clenched fists chasing the wind—knowing when to stop is real freedom.",
      },
    ],
    prayer:
      "Heavenly Father, thank You for letting me taste the quiet freedom of having enough today. Guard my heart from comparison and restless striving, so I may cherish simple meals, daily peace, and the richness of Your care. Amen.",
  },
  {
    slug: "relief-after-the-storm",
    title: "Relief After the Storm",
    groupId: "joy",
    prompt: "When you have just come through a hard season and finally feel able to breathe.",
    intro:
      "Few moments feel sweeter than the first deep breath after a long, heavy storm. These songs of thanksgiving help you trace God’s quiet faithfulness through what you endured and remember His rescue.",
    keywords: ["relief", "deliverance", "after the storm", "breakthrough", "rescued", "overcome"],
    passages: [
      {
        ref: "Psalms 30:11–12",
        note: "God has turned seasons of mourning into dancing, lifting away heavy grief and clothing the heart with fresh joy.",
      },
      {
        ref: "Psalms 126:1–3",
        note: "When relief finally arrives after long months of waiting, the gladness can feel almost too wonderful to be real—like waking inside a dream.",
      },
      {
        ref: "Psalms 40:1–3",
        note: "Out of the miry pit of distress, the Lord lifts us onto solid rock and places a new song of praise on our lips.",
      },
      {
        ref: "Exodus 15:1–2",
        note: "Safe on the far shore of the Red Sea, Moses and the people broke into song—after a long storm, your heart deserves to pause and thank the One who carried you.",
      },
      {
        ref: "2 Corinthians 1:9–10",
        note: "Paul once felt under a sentence of death, yet God rescued him and left him sure that “He will yet again deliver us.” Today’s rescue can steady you for tomorrow.",
      },
      {
        ref: "John 16:20–22",
        note: "Just as the pain of childbirth gives way to holding a newborn child, Jesus promises sorrow will yield to a lasting joy no one can steal.",
      },
    ],
    prayer:
      "Thank You, Lord, for bringing me safely through this recent storm and giving me room to breathe again today. Write this deliverance deep in my memory, so that whenever rough winds return, I will remember how faithfully You carried me. Amen.",
  },
  {
    slug: "awe-and-wonder",
    title: "Awe and Wonder at Creation",
    groupId: "joy",
    prompt: "When the sky, nature, or the quiet miracle of life moves your heart to wonder.",
    intro:
      "Sometimes a quiet sunrise, a star-filled sky, or the simple rhythm of breathing leaves us speechless with wonder. Scripture invites us to look at such beauty as a mirror reflecting the Creator’s wisdom.",
    keywords: ["awe", "wonder", "nature", "creation", "beauty", "marvel", "creator"],
    passages: [
      {
        ref: "Psalms 19:1–4",
        note: "Without speaking a single audible word, the skies pour out a quiet, constant witness to God’s glory and craftsmanship.",
      },
      {
        ref: "Psalms 8:3–5",
        note: "Looking up at the moon and stars brings a humbling wonder: the Maker of this vast universe still holds small human lives closely in mind.",
      },
      {
        ref: "Psalms 104:24",
        note: "Every living creature across land and sea carries the unmistakable signature of God’s rich, imaginative wisdom.",
      },
      {
        ref: "Romans 1:20",
        note: "Right through the visible beauty of the natural world, God’s eternal power and divine nature shine clearly to anyone who pauses to look.",
      },
      {
        ref: "Job 12:7–10",
        note: "From birds in the sky to fish beneath the waves, creation quietly teaches the same truth: the breath of every living thing rests in God’s hand.",
      },
      {
        ref: "Colossians 1:16–17",
        note: "The beauty that takes your breath away is no lifeless accident; all things were made through Christ and hold together in Him moment by moment.",
      },
    ],
    prayer:
      "Wondrous Creator, taking in the sky, the earth, and the quiet gift of life fills me with awe today. I honor Your endless wisdom, and I marvel that amid a universe so vast, You still know and care for me. Amen.",
  },
  {
    slug: "praise-and-worship",
    title: "Longing to Praise and Worship",
    groupId: "joy",
    prompt: "When reverence and love rise in your heart and you want to lift up praise.",
    intro:
      "Praise is the most natural language of a heart overflowing with love for God. From the final songs of the Psalms to the throne room of Revelation, join your voice with these bright hymns of worship.",
    keywords: ["praise", "worship", "adoration", "sing", "glorify", "exalt", "hallelujah"],
    passages: [
      {
        ref: "Psalms 150:1–6",
        note: "The radiant finale of the Psalms calls every instrument and every breathing creature on earth to join in praising the Lord.",
      },
      {
        ref: "Psalms 95:1–3",
        note: "Come into God’s presence with songs of thanksgiving and joyful shouts to the Rock of our salvation.",
      },
      {
        ref: "Psalms 145:1–3",
        note: "Every new day brings fresh reasons to bless our King, whose greatness is deeper than words can ever measure.",
      },
      {
        ref: "Revelation 4:11",
        note: "Heaven’s own song gathers all glory, honor, and power and lays them before the One by whose will every living thing came to be.",
      },
      {
        ref: "1 Chronicles 29:11–12",
        note: "David’s sweeping anthem gives words to a full heart, returning all greatness, splendor, and majesty to the Lord who rules over all.",
      },
      {
        ref: "Hebrews 13:15",
        note: "Praise rising from a grateful heart is never small; Scripture calls it a sacrifice pleasing to God, offered continually through Jesus.",
      },
    ],
    prayer:
      "Lord, Eternal King, my heart is full of love and reverence for You today, and I want to lift up Your holy name. All glory, power, and splendor belong to You alone; let my whole life become a song of praise to You. Amen.",
  },
  {
    slug: "feeling-loved-by-god",
    title: "Feeling Loved by God",
    groupId: "joy",
    prompt: "When you want to rest quietly in God’s deep, unconditional love.",
    intro:
      "The deepest rest a human heart can know is realizing we are loved not because we are flawless, but because God’s love is steadfast. Let these passages unfold His tender heart toward you.",
    keywords: ["loved by god", "love of god", "grace", "beloved", "child of god", "mercy"],
    passages: [
      {
        ref: "Romans 8:38–39",
        note: "Neither life nor death, neither today’s troubles nor tomorrow’s unknowns can ever separate you from God’s love in Christ.",
      },
      {
        ref: "1 John 3:1",
        note: "The Father’s love is far more than warm sentiment; it names and embraces you as His own beloved child.",
      },
      {
        ref: "Zephaniah 3:17",
        note: "One of the tenderest scenes in the Old Testament: God quieting you with His love and rejoicing over you with singing.",
      },
      {
        ref: "Ephesians 3:17–19",
        note: "Paul prays that we might slowly grasp the width, length, height, and depth of a love too vast for human knowledge to contain.",
      },
      {
        ref: "John 15:9",
        note: "Jesus measures His love for you by the very love the Father has for Him—a complete, unhurried love where you are invited simply to stay.",
      },
      {
        ref: "Psalms 36:7",
        note: "God’s loving devotion is so precious that you can shelter beneath the shadow of His wings, safe and completely held.",
      },
    ],
    prayer:
      "Loving Father, it still amazes me to be called Your child and to know that nothing in all creation can separate me from Your love. Help me rest deeply in Your grace today and love others from that quiet fullness. Amen.",
  },

  // === 2. Sorrow, Loss & Loneliness (14) ===
  {
    slug: "sadness",
    title: "Sadness",
    groupId: "sorrow",
    prompt: "When your heart feels heavy with a quiet ache that is hard to put into words.",
    intro:
      "Scripture never tells a sad person to force a smile and pretend everything is fine. Instead, God draws remarkably close to broken hearts and listens tenderly to every unspoken sigh.",
    keywords: ["sadness", "sad", "sorrow", "heavy heart", "downcast", "melancholy"],
    passages: [
      {
        ref: "Psalms 34:18",
        note: "In the very moments when your heart feels bruised and broken, the Lord is not far away—He stands closest to you right there.",
      },
      {
        ref: "Psalms 42:11",
        note: "The psalmist never hides his heaviness; he speaks gently to his own downcast soul and turns his gaze back toward hope in God.",
      },
      {
        ref: "Matthew 5:4",
        note: "Jesus speaks a personal promise of comfort directly to those who are walking through deep sorrow.",
      },
      {
        ref: "Psalms 30:5",
        note: "Weeping may linger through a long night, yet it does not get the final word—morning and joy will return.",
      },
      {
        ref: "2 Corinthians 7:6",
        note: "God is the One who comforts the downcast, and He often brings that comfort through the warm, steady presence of a trusted friend.",
      },
      {
        ref: "Jeremiah 31:13",
        note: "Even while today feels heavy, God promises He has both the power and the tenderness to turn mourning into comfort and gladness.",
      },
    ],
    prayer:
      "Lord, my heart feels weighed down today with a sadness I can barely explain. I will not pretend to be fine before You; draw close to my heavy spirit and hold me gently in Your comforting presence. Amen.",
  },
  {
    slug: "loneliness",
    title: "Loneliness",
    groupId: "sorrow",
    prompt: "When you feel isolated, unseen, or without anyone walking beside you.",
    intro:
      "Loneliness can settle over us even in a crowded room. Faithful people throughout Scripture—David, Elijah, Paul—all tasted that ache, and right in the quiet silence they met the One who never leaves.",
    keywords: ["loneliness", "lonely", "alone", "isolated", "unseen", "solitude"],
    passages: [
      {
        ref: "Deuteronomy 31:8",
        note: "The Lord does not merely walk beside you; He goes ahead to clear the way, promising He will never leave or forsake you.",
      },
      {
        ref: "Psalms 25:16",
        note: "A brief, honest prayer for moments when you feel utterly alone and worn down: simply ask God to turn toward you with grace.",
      },
      {
        ref: "Psalms 139:7–10",
        note: "No matter how far away or low your spirit feels, there is nowhere you can drift beyond God’s guiding, steady hand.",
      },
      {
        ref: "Matthew 28:20",
        note: "Jesus’ parting promise to His followers still stands unbroken: He is with you always, through every ordinary and lonely day.",
      },
      {
        ref: "John 16:32",
        note: "Jesus Himself knew the sting of watching close friends scatter, so He understands your ache—and reminds you that the Father is right here with you.",
      },
      {
        ref: "Isaiah 41:13",
        note: "When it feels as though no one stands at your side, God Himself takes hold of your right hand and quietly assures you of His help.",
      },
    ],
    prayer:
      "Father who is always near, the loneliness today makes everything around me feel unusually quiet and empty. Take hold of my hand, let me truly feel Your steady presence, and bring genuine companions into my life. Amen.",
  },
  {
    slug: "grief-and-loss",
    title: "Grief and Losing a Loved One",
    groupId: "sorrow",
    prompt: "When you are mourning someone dear and feeling the hollow ache of goodbye.",
    intro:
      "No words can instantly fill the empty space left when someone you love is gone. Standing before the tomb of His friend Lazarus, Jesus Himself wept. May these passages gently hold your grief today.",
    keywords: ["grief", "loss", "mourning", "bereavement", "death", "loved one", "funeral"],
    passages: [
      {
        ref: "John 11:35",
        note: "The shortest verse in Scripture holds immeasurable tenderness: Jesus did not rush past human loss—He stood still and wept.",
      },
      {
        ref: "1 Thessalonians 4:13–14",
        note: "Believers still grieve deeply when love is parted by death, yet not without hope, because Christ’s resurrection promises reunion.",
      },
      {
        ref: "Revelation 21:4",
        note: "Scripture’s final horizon holds a gentle certainty: God Himself will wipe away every tear, and death and mourning will be no more.",
      },
      {
        ref: "Psalms 23:4",
        note: "Even when your path winds through the darkest valley of death’s shadow, the Shepherd walks right beside you to comfort you.",
      },
      {
        ref: "Isaiah 25:8",
        note: "Today’s ache of parting is deeply real, yet God holds out a quiet promise: He will swallow up death forever and wipe tears from every face.",
      },
      {
        ref: "Romans 14:8",
        note: "Whether in life or in death, those who belong to the Lord remain safely in His care—and you do not have to walk through this grief alone.",
      },
    ],
    prayer:
      "Jesus, You wept beside the grave of Your friend, and my heart aches with the empty space left by the one I love. Sit quietly with me in these days of mourning, comfort my family, and keep the gentle light of resurrection hope alive in me. Amen.",
  },
  {
    slug: "heartbreak",
    title: "Heartbreak",
    groupId: "sorrow",
    prompt: "When a treasured relationship breaks apart and your heart feels shattered.",
    intro:
      "A broken relationship leaves a deep, real wound that can make us question our own worth. Yet no shattered heart lies beyond the healing touch of the One who knows every fragile piece within you.",
    keywords: ["heartbreak", "breakup", "broken heart", "lost love", "rejection", "romance"],
    passages: [
      {
        ref: "Psalms 147:3",
        note: "God personally tends to the brokenhearted, gently binding up the hidden wounds no one else can see.",
      },
      {
        ref: "Isaiah 54:10",
        note: "Human affection can shift like trembling hills, yet God’s loving devotion and covenant of peace toward you will never depart.",
      },
      {
        ref: "Psalms 73:26",
        note: "When hurt drains both body and heart of strength, God remains the steady strength of your heart and your lasting portion.",
      },
      {
        ref: "Romans 8:28",
        note: "Even from pieces that look hopelessly broken today, God is able to weave unexpected healing and goodness into the road ahead.",
      },
      {
        ref: "Galatians 2:20",
        note: "When heartbreak tempts you to feel unlovable, remember a love that never wavers: the Son of God loved you and gave Himself up for you.",
      },
      {
        ref: "Hebrews 4:15–16",
        note: "You do not have to hide your bruised heart; come honestly to the throne of grace, where Jesus sympathizes with your pain and meets you with mercy.",
      },
    ],
    prayer:
      "Compassionate Father, my heart feels bruised and aching after this loss. Gently bind up the deep wounds inside me, guard me from losing sight of my worth, and anchor me in Christ’s unchanging love. Amen.",
  },
  {
    slug: "despair",
    title: "Despair",
    groupId: "sorrow",
    prompt: "When every door feels shut and you can no longer see a way forward.",
    intro:
      "If you feel sunk at the bottom with no strength left to take another step, remember that Scripture is full of honest cries from the depths. God does not turn away from despair; He meets you right where you are.",
    keywords: ["despair", "hopeless", "rock bottom", "no way out", "trapped", "darkness"],
    passages: [
      {
        ref: "Psalms 130:1–5",
        note: "Even from the darkest depths, the psalmist cries honestly to the Lord and clings quietly to His mercy and His word.",
      },
      {
        ref: "2 Corinthians 4:8–9",
        note: "Paul openly admitted feeling hard pressed and perplexed on every side—yet never abandoned by God and never utterly destroyed.",
      },
      {
        ref: "Lamentations 3:21–24",
        note: "Right in the ashes of deepest grief, deliberately remembering God’s unfailing mercy becomes the small spark that keeps hope alive.",
      },
      {
        ref: "Psalms 34:17",
        note: "When you have no strength left to rescue yourself, the Lord bends down to hear your cry and deliver you from trouble.",
      },
      {
        ref: "Jonah 2:2–7",
        note: "From the darkest depths when his life was fading away, Jonah’s faint prayer still reached God’s ear—you are never too far down for Him to hear.",
      },
      {
        ref: "Matthew 12:20",
        note: "When your spirit feels like a bruised reed and hope is barely a smoldering wick, Jesus does not snap or snuff you out; He handles you with care.",
      },
    ],
    prayer:
      "God of mercy, right now I feel sunk in the depths with no clear way ahead. All I can offer is this quiet cry for help; hear me, guard the faint ember of hope left in my heart, and carry me through this dark night. Amen.",
  },
  {
    slug: "emptiness",
    title: "Emptiness and Feeling Lost",
    groupId: "sorrow",
    prompt: "When life keeps moving around you, yet everything inside feels hollow and gray.",
    intro:
      "A hollow ache can creep in even when nothing looks wrong on the outside. Ecclesiastes speaks candidly about that emptiness—not to leave us cynical, but to point us toward a fullness nothing fleeting can satisfy.",
    keywords: ["emptiness", "empty", "hollow", "numb", "meaningless", "purpose", "flat"],
    passages: [
      {
        ref: "Ecclesiastes 3:11",
        note: "Because God has set eternity inside the human heart, nothing temporary under the sun can ever completely satisfy our deepest longing.",
      },
      {
        ref: "John 10:10",
        note: "Jesus did not come to shrink your life into mere routine, but to give you real life in all its richness and fullness.",
      },
      {
        ref: "Isaiah 55:1–2",
        note: "A gentle invitation to anyone worn out from chasing things that never nourish: come freely to the water that truly satisfies.",
      },
      {
        ref: "John 4:13–14",
        note: "Passing pleasures leave us thirsty all over again, whereas the living water Jesus gives becomes a quiet spring welling up from within.",
      },
      {
        ref: "Psalms 107:9",
        note: "That hollow feeling is a quiet sign of spiritual hunger; only God can genuinely satisfy a thirsty soul and fill it with lasting good.",
      },
      {
        ref: "Colossians 2:9–10",
        note: "Rather than drifting from one pursuit to another and still feeling gray inside, you are invited to discover true completeness in Christ.",
      },
    ],
    prayer:
      "Lord Jesus, life keeps spinning around me while everything inside feels hollow and flat. Pour Your living water into my thirsty soul, awaken fresh meaning in my days, and help me find fullness in You again. Amen.",
  },
  {
    slug: "discouragement",
    title: "Discouragement and Low Motivation",
    groupId: "sorrow",
    prompt: "When your drive has drained away, your spirit feels weary, and you want to quit.",
    intro:
      "Anyone walking a long road eventually grows tired and longs to sit down by the side of the path. These passages do not scold or push you; they offer quiet breath and fresh grace for one small step.",
    keywords: ["discouragement", "discouraged", "unmotivated", "burnt out", "giving up", "weary"],
    passages: [
      {
        ref: "Galatians 6:9",
        note: "Do not lose heart just because you cannot see results today; steady faithfulness brings a harvest in its proper time.",
      },
      {
        ref: "1 Kings 19:4–8",
        note: "When Elijah was so discouraged he wanted to give up completely, God did not lecture him—He gave him sleep and warm bread for the journey.",
      },
      {
        ref: "Psalms 43:5",
        note: "In seasons when the soul feels heavy and worn down, this psalm gently lifts your eyes back to the God who helps you.",
      },
      {
        ref: "Isaiah 41:10",
        note: "God does not demand that you manufacture strength on your own; He promises to strengthen you and uphold you with His own right hand.",
      },
      {
        ref: "Hebrews 12:3",
        note: "When weariness whispers that it is time to quit, looking steadily at Jesus—who endured far heavier resistance—helps your heart keep going.",
      },
      {
        ref: "2 Chronicles 15:7",
        note: "Even when the fruit of your labor feels invisible, this word steadies tired hands: your faithful work is seen and will not go unrewarded.",
      },
    ],
    prayer:
      "Gentle Lord, my spirit feels drained and I have little strength left to push myself forward today. Let me rest a moment in Your care, breathe deeply again, and receive enough quiet courage for the small step right in front of me. Amen.",
  },
  {
    slug: "homesickness",
    title: "Homesickness and Living Far Away",
    groupId: "sorrow",
    prompt: "When you are living far from home, missing family, and longing to belong.",
    intro:
      "Being far from home makes quiet evenings and holidays feel heavier. Many people in Scripture also lived as strangers in unfamiliar lands—and discovered that God Himself was their truest home.",
    keywords: ["homesickness", "homesick", "far from home", "missing family", "belonging", "abroad"],
    passages: [
      {
        ref: "Psalms 90:1",
        note: "Across every move and every generation, the Lord Himself has been a safe, enduring dwelling place for His people.",
      },
      {
        ref: "Genesis 28:15",
        note: "When Jacob left home alone and slept under the open sky, God promised to stay with him, watch over him, and never leave him.",
      },
      {
        ref: "Psalms 121:7–8",
        note: "A tender blessing of protection covering every departure, every quiet return, and every mile lived away from home.",
      },
      {
        ref: "Hebrews 11:13–16",
        note: "The deep homesickness we feel on earth also echoes our longing for a lasting heavenly home that God Himself has prepared for us.",
      },
      {
        ref: "Jeremiah 29:7",
        note: "Living in a foreign city, God’s people were invited not to withdraw in isolation, but to pray for their new place and find warmth right where they were.",
      },
      {
        ref: "John 14:2–3",
        note: "Even when life far away feels unsettled and temporary, Jesus is personally preparing an eternal home where you will always belong.",
      },
    ],
    prayer:
      "Father, You are my true dwelling place. Being far from home makes my heart ache for family and familiar voices today. Watch over my steps here, keep the ones I love safe back home, and be my warm refuge right where I am. Amen.",
  },
  {
    slug: "feeling-abandoned",
    title: "Feeling Abandoned and Forgotten",
    groupId: "sorrow",
    prompt: "When people you trusted walk away, pull back, or seem to forget you.",
    intro:
      "Being left behind is one of the sharpest pains a human heart can carry. Yet there is One who has inscribed you on the palms of His hands and has never overlooked you for even a single moment.",
    keywords: ["abandoned", "forgotten", "left behind", "forsaken", "rejected", "alone"],
    passages: [
      {
        ref: "Isaiah 49:15–16",
        note: "Even the deepest bond of a mother’s love could falter before God ever would; He keeps you inscribed on the very palms of His hands.",
      },
      {
        ref: "Psalms 27:10",
        note: "Even if the closest earthly relationships fail or fall away, the Lord Himself steps forward to welcome and receive you.",
      },
      {
        ref: "John 14:18",
        note: "Jesus speaks a tender, unmistakable promise to everyone who belongs to Him: “I will not leave you as orphans; I will come to you.”",
      },
      {
        ref: "Hebrews 13:5–6",
        note: "Scripture anchors your heart in a double assurance straight from God’s own mouth: “Never will I leave you, never will I forsake you.”",
      },
      {
        ref: "1 Samuel 12:22",
        note: "People can pull away when feelings or convenience shift, yet God’s loyalty is tied to His own great name—He will not abandon His own.",
      },
      {
        ref: "Luke 15:4–6",
        note: "You are never a forgotten face lost in a crowd; to the Good Shepherd, you matter so much that He searches until He brings you safely home.",
      },
    ],
    prayer:
      "Faithful God who never forgets me, feeling left behind by people I trusted hurts so deeply. Remind my aching heart that my name is held in Your hands, and wrap me today in Your presence that never walks away. Amen.",
  },
  {
    slug: "feeling-unloved",
    title: "Feeling Unloved",
    groupId: "sorrow",
    prompt: "When your heart feels starved for affection and aches to be cared for.",
    intro:
      "When warmth feels scarce around us, it is painfully easy to believe we are not worth loving. Scripture answers that lie with a steadfast love that chose you long before you ever knew Him.",
    keywords: ["unloved", "unwanted", "neglected", "starved for love", "longing for love", "hurt"],
    passages: [
      {
        ref: "Jeremiah 31:3",
        note: "God speaks straight into a lonely, aching heart: “I have loved you with an everlasting love; therefore I have drawn you with loving devotion.”",
      },
      {
        ref: "Isaiah 43:4",
        note: "In God’s eyes, you are not an afterthought—you are precious, honored, and deeply loved by Him.",
      },
      {
        ref: "Romans 5:8",
        note: "God did not wait for us to become impressive or flawless before loving us; He proved His love right in the middle of our imperfection.",
      },
      {
        ref: "1 John 4:9–10",
        note: "Real love is not measured by the shifting moods of people around us, but by the Father who loved us first and sent His Son for us.",
      },
      {
        ref: "Ephesians 2:4–5",
        note: "God’s love is never hesitant or rationed; rich in mercy, He poured out great love on us when we had nothing to earn it.",
      },
      {
        ref: "Psalms 86:15",
        note: "When the world around you feels cold, you can lean on God’s unchanging character: compassionate, gracious, and abounding in loving devotion.",
      },
    ],
    prayer:
      "Father rich in mercy, my heart feels tender and hungry for warmth and care right now. Let Your everlasting love thaw the cold inside me, so I know I am treasured in Your sight and stop chasing fragile approval. Amen.",
  },
  {
    slug: "feeling-worthless",
    title: "Feeling Worthless and Inadequate",
    groupId: "sorrow",
    prompt: "When self-criticism weighs on you and makes you feel small or not enough.",
    intro:
      "The critical voice inside our own minds is often harsher than anyone else could ever be. Do not measure your worth by mistakes or comparisons; listen instead to how tenderly your Maker speaks of you.",
    keywords: ["worthless", "inadequate", "insecure", "not enough", "self-doubt", "low self-worth"],
    passages: [
      {
        ref: "Psalms 139:13–14",
        note: "You are not a mistake or an accident; God intentionally knit every part of your life together with remarkable care.",
      },
      {
        ref: "Ephesians 2:10",
        note: "Scripture calls you God’s own workmanship—thoughtfully crafted in Christ for meaningful good prepared ahead of you.",
      },
      {
        ref: "Luke 12:6–7",
        note: "Not even a tiny sparrow escapes God’s notice, and He knows every hair on your head—your life holds immense value to Him.",
      },
      {
        ref: "1 Corinthians 1:27–29",
        note: "God loves to choose the very people and quiet gifts the world overlooks, working His greatest beauty through humble hands.",
      },
      {
        ref: "Genesis 1:27",
        note: "Your dignity does not start with credentials, appearance, or success; from the very beginning, you were created in God’s own image.",
      },
      {
        ref: "1 Peter 2:9",
        note: "Self-doubt whispers that you do not measure up, yet God names His people chosen, royal, and His own treasured possession.",
      },
    ],
    prayer:
      "Maker of my soul, the harsh voices in my head keep telling me I am small and never enough. Quiet that self-criticism with Your truth, help me honor the life You carefully formed in me, and steady my steps today. Amen.",
  },
  {
    slug: "disappointment",
    title: "Disappointment and Shattered Hopes",
    groupId: "sorrow",
    prompt: "When something you hoped and prayed for does not turn out as you longed.",
    intro:
      "Disappointment stings deeply precisely because we poured so much hope into what we wanted. Scripture honors that ache while gently lifting our eyes toward a wisdom wider than what we can see right now.",
    keywords: ["disappointment", "disappointed", "let down", "unmet expectations", "heartache", "waiting"],
    passages: [
      {
        ref: "Proverbs 13:12",
        note: "Scripture names our feelings with refreshing honesty: watching a longed-for hope stall really does make the heart feel sick.",
      },
      {
        ref: "Isaiah 55:8–9",
        note: "Sometimes a closed door is God’s quiet way of guiding us onto higher, wiser paths than our short-term plans could imagine.",
      },
      {
        ref: "Romans 5:3–5",
        note: "Even when the road takes hard, unexpected turns, hope anchored in God’s love will never leave us empty or ashamed.",
      },
      {
        ref: "Psalms 62:5–8",
        note: "Pour out every piece of your letdown honestly before God; He is a rock sturdy enough to hold all your unfiltered disappointment.",
      },
      {
        ref: "Hebrews 10:23",
        note: "Our specific expectations can shatter, yet the One who makes promises remains completely faithful—you can re-anchor your hope in Him.",
      },
      {
        ref: "James 5:7–8",
        note: "When what you hoped for has not arrived, the picture of a patient farmer waiting for rain encourages you to steady your heart and keep trusting.",
      },
    ],
    prayer:
      "Faithful Lord, what I poured my heart into did not unfold as I hoped, and I feel let down and bruised. I pour all this disappointment out before You; help me trust that Your ways are higher than mine and give me patience to keep walking. Amen.",
  },
  {
    slug: "deep-hurt",
    title: "Deep Emotional Hurt",
    groupId: "sorrow",
    prompt: "When someone’s words or actions have cut deeply into your heart.",
    intro:
      "Physical cuts are easy for others to see, while wounds inside the heart are often carried in quiet silence. The God who sees every hidden corner knows how much this hurts and walks with you toward healing.",
    keywords: ["deep hurt", "wounded", "emotional pain", "hurt feelings", "healing", "betrayed"],
    passages: [
      {
        ref: "Psalms 56:8",
        note: "Not a single tear you have cried or lonely step you have walked goes unnoticed; God holds every one of them in His remembrance.",
      },
      {
        ref: "Isaiah 61:1–3",
        note: "The Messiah came specifically to bind up broken hearts and trade the ashes of sorrow for beauty, joy, and praise.",
      },
      {
        ref: "Proverbs 18:14",
        note: "Scripture candidly acknowledges that a crushed spirit weighs heavier than physical illness and deserves tender, patient healing.",
      },
      {
        ref: "2 Corinthians 1:3–4",
        note: "The God of all comfort stays close to soothe us in every ache, gently shaping us to comfort others who hurt one day too.",
      },
      {
        ref: "Jeremiah 30:17",
        note: "Even when painful words or neglect leave you feeling cast aside, the Lord still sees you and promises to restore and heal your wounds.",
      },
      {
        ref: "1 Peter 2:23–24",
        note: "When Jesus was mistreated, He “did not retaliate” but “entrusted Himself to Him who judges justly.” You too can place this deep pain in the hands of the One who understands.",
      },
    ],
    prayer:
      "Lord, the wound inside my heart feels raw and painful after what was said and done. I bring this hurt openly into Your hands; wipe away my tears, guard my heart from growing bitter, and heal me gently step by step. Amen.",
  },
  {
    slug: "weeping-and-lament",
    title: "Weeping and Pouring Out Your Pain",
    groupId: "sorrow",
    prompt: "When your chest feels tight and you simply need to weep honestly before God.",
    intro:
      "Tears are never a sign of weak faith. The Psalms and Lamentations are soaked with unguarded weeping—and God receives your tears not as an interruption, but as an honest, cherished prayer.",
    keywords: ["weeping", "crying", "tears", "lament", "grieving", "pouring out", "pain"],
    passages: [
      {
        ref: "Psalms 6:6–9",
        note: "David wept until his bed was drenched with tears, yet right in the middle of his grief he held to one certainty: “the LORD has heard my weeping.”",
      },
      {
        ref: "Psalms 126:5–6",
        note: "Tears sown during painful seasons are never wasted; a harvest of quiet relief and gladness waits further down the road.",
      },
      {
        ref: "Psalms 39:12",
        note: "When words run thin, this honest, simple plea says it all: “do not be deaf to my weeping.” God never turns away when your eyes overflow.",
      },
      {
        ref: "Ecclesiastes 3:1–4",
        note: "Life holds a season to laugh and a real season to weep; giving yourself permission to cry is often the first quiet step toward healing.",
      },
      {
        ref: "Hebrews 5:7",
        note: "Jesus Himself prayed with loud cries and tears during His earthly life, so you never need to hold back your tears when coming to God.",
      },
      {
        ref: "Revelation 7:17",
        note: "Let your tears fall freely today for relief, while holding fast to this promise: the Shepherd will lead you to living springs and wipe every tear away.",
      },
    ],
    prayer:
      "Father who counts every tear I shed, my chest feels tight and all I want right now is to weep honestly before You. Thank You for never shaming my weakness; receive these wordless tears as my prayer and gently hold my aching heart. Amen.",
  },
];
