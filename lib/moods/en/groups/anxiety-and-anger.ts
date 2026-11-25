import type { MoodDefinition } from "../../types";

/** Group 3: Anxiety, Fear & Pressure (12) · Group 4: Anger, Conflict & Forgiveness (12). */
export const ANXIETY_AND_ANGER: readonly MoodDefinition[] = [
  // === 3. Anxiety, Fear & Pressure (12) ===
  {
    slug: "anxiety-about-the-future",
    title: "Anxiety About the Future",
    groupId: "anxiety",
    prompt: "When your mind races through a hundred tomorrow scenarios that haven't even happened.",
    intro:
      "Anxiety pulls us out of the present moment to carry tomorrow's burdens without tomorrow's strength. Slow your breathing and place each worry into the hands of the One who already holds your future.",
    keywords: ["anxiety", "worry", "anxious", "future", "overthinking", "uneasy"],
    passages: [
      {
        ref: "Matthew 6:25–34",
        note: "Jesus points to the birds of the air and lilies of the field to remind you that your heavenly Father knows every need—so you can live fully in today.",
      },
      {
        ref: "Philippians 4:6–7",
        note: "Instead of letting worries spin in circles in your mind, bring each specific concern to God in prayer and thanksgiving, and let His peace guard your heart.",
      },
      {
        ref: "1 Peter 5:7",
        note: "Peter uses a vivid, forceful image here: throw every weight of anxiety onto God, because He genuinely and personally cares for you.",
      },
      {
        ref: "Proverbs 12:25",
        note: "Heavy anxiety bows the heart down under its weight, while a kind word and honest encouragement can lift your spirit back up.",
      },
      {
        ref: "Psalms 94:19",
        note: "When anxious thoughts multiply and crowd out your peace, God's gentle consolation is deep enough to quiet your mind and delight your soul.",
      },
      {
        ref: "John 14:1",
        note: "Jesus offers a brief, steady anchor: rather than letting tomorrow's scenarios trouble your heart, rest your trust in God and in Him.",
      },
    ],
    prayer:
      "Father who holds tomorrow, my mind is spinning through endless worries that have not even happened yet. Help me cast every burden of the future into Your hands, breathe slowly, and receive Your peace for today. Amen.",
  },
  {
    slug: "fear",
    title: "Fear and Unease",
    groupId: "anxiety",
    prompt: "When fear takes hold of your mind and makes you hesitate to step forward.",
    intro:
      "The command repeated most often in Scripture is “Do not be afraid.” God never says that because life is free of danger, but because the One standing beside you is far greater than anything that makes you tremble.",
    keywords: ["fear", "afraid", "scared", "panic", "dread", "unease"],
    passages: [
      {
        ref: "Psalms 56:3–4",
        note: "David does not pretend he never feels afraid; instead, he turns fear into trust: “When I am afraid, I put my trust in You.”",
      },
      {
        ref: "Isaiah 41:10",
        note: "Four steady assurances meet you in your trembling: God is with you, He is your God, He will strengthen you, and He will uphold you with His right hand.",
      },
      {
        ref: "Psalms 91:1–6",
        note: "Abiding in the shadow of the Almighty brings quiet shelter, whether you face the terrors of the night or sudden arrows by day.",
      },
      {
        ref: "1 John 4:18",
        note: "God's perfect love does not scold you for being afraid; step by step, His secure love drives fear out of your heart.",
      },
      {
        ref: "Romans 8:15",
        note: "You do not have to live like a slave shrinking back in dread; by the Spirit, you are God's beloved child who can call out to Him as Father right now.",
      },
      {
        ref: "Proverbs 3:25–26",
        note: "When sudden alarms threaten to freeze you in your tracks, the Lord Himself stands as your confidence and keeps your feet from being ensnared.",
      },
    ],
    prayer:
      "Abba Father, fear and unease have my heart racing and make me afraid to move forward. I run into the shadow of Your wings right now; let Your perfect love drive out every dread and give me quiet courage to step ahead. Amen.",
  },
  {
    slug: "stress-and-overwhelm",
    title: "Stress and Overwhelm",
    groupId: "anxiety",
    prompt: "When work, responsibilities, and relentless pressure leave you breathless.",
    intro:
      "When your to-do list never ends and everyone seems to need something from you, it is easy to forget you are human, not a machine. Pause for a few quiet minutes before the gentle invitation of Jesus to rest.",
    keywords: ["stress", "overwhelmed", "pressure", "burnout", "overloaded", "stressed"],
    passages: [
      {
        ref: "Matthew 11:28–30",
        note: "Jesus never piles another heavy expectation onto weary shoulders; instead, He invites you to come to Him and find true rest for your soul.",
      },
      {
        ref: "Psalms 46:10",
        note: "In the middle of relentless urgency, God's first word to you is to pause: “Be still and know that I am God”—remembering He holds the world, not you.",
      },
      {
        ref: "Psalms 55:22",
        note: "Cast the weight you were never meant to carry alone onto the Lord; He promises to sustain you and keep you from being shaken.",
      },
      {
        ref: "Exodus 33:14",
        note: "Under the crushing pressure of leading an entire nation, Moses received God's promise that His own Presence would go with him and give him rest.",
      },
      {
        ref: "Isaiah 30:15",
        note: "When pressure urges you to run even faster, God points the opposite way: your deepest strength comes from slowing down in quiet confidence and rest.",
      },
      {
        ref: "Luke 10:41–42",
        note: "Just as Jesus gently called Martha's name amid her frantic tasks, He reminds you that one thing matters most: sitting quietly at His feet.",
      },
    ],
    prayer:
      "Lord, the weight of work and endless demands has left me stretched thin and gasping for air. Teach me to lay down what is too heavy for my hands, sit quietly at Your feet, and receive the real rest only You can give. Amen.",
  },
  {
    slug: "sleepless-nights",
    title: "Sleepless Nights and Restless Thoughts",
    groupId: "anxiety",
    prompt: "When the hour is late, your eyes stay wide open, and your thoughts refuse to slow down.",
    intro:
      "Night has a way of magnifying worries that look far smaller in daylight. Rather than wrestling with restless thoughts in the dark, loosen your grip and rest beneath the watch of a God who never sleeps.",
    keywords: ["insomnia", "sleepless", "cannot sleep", "late night", "restless", "awake"],
    passages: [
      {
        ref: "Psalms 4:8",
        note: "A peaceful prayer before closing your eyes: you can lie down and sleep in peace because the Lord alone makes you dwell in safety.",
      },
      {
        ref: "Psalms 121:3–4",
        note: "You can finally let go and sleep tonight, because the Protector who watches over your life neither slumbers nor sleeps.",
      },
      {
        ref: "Psalms 127:2",
        note: "Staying up late to worry cannot hold everything together; God Himself tenderly gives sleep to those He loves.",
      },
      {
        ref: "Proverbs 3:24",
        note: "When your heart leans on God's wisdom and care, you can lie down without dread and find your sleep made sweet.",
      },
      {
        ref: "Philippians 4:8",
        note: "When your mind keeps replaying tangled problems at midnight, gently redirect your thoughts toward whatever is true, honorable, lovely, and praiseworthy.",
      },
      {
        ref: "Isaiah 26:3",
        note: "When thoughts race in the quiet dark, entrust each one to God: He keeps “the steadfast of mind” in “perfect peace” as you rest your trust in Him.",
      },
    ],
    prayer:
      "Lord, You never slumber or sleep, yet here I am wide awake with a racing mind in the middle of the night. I hand over every unfinished task and unspoken worry to You; quiet my thoughts and grant me sweet, peaceful rest. Amen.",
  },
  {
    slug: "crossroads-and-uncertainty",
    title: "Crossroads and Uncertainty",
    groupId: "anxiety",
    prompt: "When you stand before big choices and do not know which path to take.",
    intro:
      "Facing a major decision without a clear map can leave anyone feeling unsteady. God rarely lights up the next ten miles ahead, yet He faithfully gives enough light for the very next step in front of you.",
    keywords: ["crossroads", "uncertainty", "decisions", "direction", "confused", "guidance"],
    passages: [
      {
        ref: "Proverbs 3:5–6",
        note: "When your own understanding cannot see far enough ahead, trusting the Lord with all your heart invites Him to make your paths straight.",
      },
      {
        ref: "Psalms 119:105",
        note: "God's word is like a lamp right at your feet—bright enough to illuminate today's step clearly even when the distant horizon stays dim.",
      },
      {
        ref: "Psalms 32:8",
        note: "Hear the Lord's personal promise when you feel unsure: He will instruct you, teach you the way to go, and counsel you with His watchful eye.",
      },
      {
        ref: "Isaiah 30:21",
        note: "As you wonder whether to turn right or left, a quiet heart can hear God's steady guidance behind you: “This is the way. Walk in it.”",
      },
      {
        ref: "John 10:3–4",
        note: "You do not have to draw the whole map yourself at a crossroads; the Good Shepherd calls you by name, goes ahead of you, and leads you step by step.",
      },
      {
        ref: "Colossians 1:9–10",
        note: "Paul's prayer becomes your own in moments of indecision: asking God to fill you with spiritual wisdom so you know His will and walk steadily.",
      },
    ],
    prayer:
      "Good Shepherd, standing at this crossroads leaves me unsure and afraid of choosing the wrong way. Let Your word be a lamp right at my feet today, tune my ears to Your gentle voice, and give me clear wisdom for the step ahead. Amen.",
  },
  {
    slug: "fear-of-failure",
    title: "Fear of Failure",
    groupId: "anxiety",
    prompt: "When you hold back for fear of failing, making a mistake, or not being good enough.",
    intro:
      "The fear of failing often paralyzes us before we ever begin. Yet in God's hands, a stumble is never the final verdict on your life—it is the very place where He reaches down to hold you up.",
    keywords: ["fear of failure", "failing", "mistakes", "not good enough", "perfectionism", "hesitation"],
    passages: [
      {
        ref: "Psalms 37:23–24",
        note: "Even those whose steps are ordered by the Lord still stumble at times, yet they are never overwhelmed because the Lord Himself holds their hand.",
      },
      {
        ref: "Proverbs 24:16",
        note: "Righteousness is not a spotless record without a fall; it is the resilience to get back up again even after falling seven times.",
      },
      {
        ref: "2 Corinthians 12:9",
        note: "God's grace is enough for every limitation you fear, and His power shines most clearly right where you feel weakest and most inadequate.",
      },
      {
        ref: "Romans 8:31",
        note: "When the living God Himself stands for you, the fear of failure no longer gets the final word over your future or your worth.",
      },
      {
        ref: "1 Chronicles 28:20",
        note: "Before a daunting task that makes your hands shake, David's charge to Solomon speaks to you too: take courage and begin, for God will stay with you until it is finished.",
      },
      {
        ref: "Matthew 25:21",
        note: "God is not demanding flawless perfection without a single blemish; what He delights in and commends is quiet faithfulness with what He puts in your hands.",
      },
    ],
    prayer:
      "Father, the fear of messing up and falling short keeps me frozen at the starting line. Free me from the pressure to be flawless, give me courage to step forward in faithfulness, and let Your strength hold me up in my weakness. Amen.",
  },
  {
    slug: "fear-of-rejection",
    title: "Fear of Rejection and Judgment",
    groupId: "anxiety",
    prompt: "When you worry constantly about others' opinions and wear yourself out trying to please everyone.",
    intro:
      "Chasing human approval is an invisible trap that keeps your soul permanently tense. Knowing you are already welcomed by the Most High sets you free to walk with honesty, calm, and quiet confidence.",
    keywords: ["rejection", "people pleasing", "judgment", "approval", "insecurity", "opinions"],
    passages: [
      {
        ref: "Proverbs 29:25",
        note: "Living in fear of what people think or say lays a snare around your heart, while trusting in the Lord sets you in a safe, high place.",
      },
      {
        ref: "Galatians 1:10",
        note: "One honest question clears the fog immediately: right now, am I striving to win the approval of people, or living to please God?",
      },
      {
        ref: "Psalms 118:6",
        note: "With the Lord standing on your side, human criticism or rejection no longer holds the power to define your worth or shake your footing.",
      },
      {
        ref: "1 Peter 2:4",
        note: "Jesus Himself knew what it felt like to be rejected by people, yet in God's sight He was chosen and precious—and you belong to Him.",
      },
      {
        ref: "1 Samuel 16:7",
        note: "People's quick judgments rarely look past shifting outward appearances, while the Lord looks deeper and sees the true sincerity of your heart.",
      },
      {
        ref: "Romans 15:7",
        note: "The ache of fearing rejection loosens its grip when you remember that Christ has already welcomed you—you do not have to perform to earn belonging.",
      },
    ],
    prayer:
      "Lord, You know my heart through and through, and I am exhausted from measuring my worth by people's approval and criticism. Thank You for welcoming me fully in Christ; free me from the fear of man so I can live honestly before You. Amen.",
  },
  {
    slug: "fear-of-illness",
    title: "Fear of Illness and Frailty",
    groupId: "anxiety",
    prompt: "When you worry about your health, wait on medical results, or dread bodily weakness.",
    intro:
      "Our bodies are fragile, so anxiety over sickness and aging is deeply human. While you wait for answers or care for your health, lean on the One who numbers every breath and holds every heartbeat.",
    keywords: ["health anxiety", "illness", "sickness", "medical results", "weakness", "healing"],
    passages: [
      {
        ref: "Psalms 41:3",
        note: "When your body lies weak on a bed of illness, the Lord does not stand far off—He promises to sustain you and care for you gently.",
      },
      {
        ref: "Psalms 103:2–3",
        note: "Remind your anxious soul of who God is: the compassionate Lord who forgives every iniquity and heals all our diseases in His time and way.",
      },
      {
        ref: "2 Corinthians 4:16",
        note: "Even when our outward body feels fragile or wears down, God can quietly renew our inner life with fresh strength day by day.",
      },
      {
        ref: "Jeremiah 17:14",
        note: "A simple, unadorned prayer you can echo verbatim today—turning straight to the only One with power to heal and truly save.",
      },
      {
        ref: "Matthew 10:29–31",
        note: "As you wait on test results or worry over your body's frailty, Jesus reminds you that your Father has counted every hair on your head—you are closely cared for.",
      },
      {
        ref: "Romans 8:11",
        note: "Though mortal bodies have real limits, the life-giving Spirit who raised Jesus dwells in you and anchors your hope beyond sickness and fear.",
      },
    ],
    prayer:
      "Lord, every breath and heartbeat belongs to You, yet worry over my health and my body's fragility makes my heart uneasy. I place my body into Your tender care; steady my mind while I wait and renew my spirit within me each day. Amen.",
  },
  {
    slug: "fear-of-death",
    title: "Fear of Death",
    groupId: "anxiety",
    prompt: "When facing human mortality leaves you unsettled about what lies beyond.",
    intro:
      "Death has cast the longest shadow over human life throughout history. The gospel does not look away from that darkness; it announces the One who walked through death, stepped out of the tomb, and holds your hand across to the other side.",
    keywords: ["fear of death", "mortality", "dying", "eternity", "afterlife", "resurrection"],
    passages: [
      {
        ref: "John 11:25–26",
        note: "Jesus declares Himself to be the resurrection and the life—for everyone who trusts in Him, death no longer has the power to hold them forever.",
      },
      {
        ref: "Hebrews 2:14–15",
        note: "Jesus took on flesh and walked through death Himself specifically to break its power and free those held captive all their lives by the fear of dying.",
      },
      {
        ref: "1 Corinthians 15:54–57",
        note: "Here is the song of triumph over our deepest shadow: death has been swallowed up in victory through our Lord Jesus Christ.",
      },
      {
        ref: "Psalms 116:15",
        note: "In the sight of the Lord, the passing of His people is never an accidental loss or abandonment—it is deeply precious to Him.",
      },
      {
        ref: "Revelation 1:17–18",
        note: "The Living One who holds “the keys of Death and of Hades” lays His right hand on you and says, “Do not be afraid”—He went through death ahead of you.",
      },
      {
        ref: "Psalms 48:14",
        note: "You will never walk into that final shadow alone; the eternal God promises to be your faithful guide through all of life, even to the very end.",
      },
    ],
    prayer:
      "Living Jesus, facing the shortness of life and the mystery of death still makes my heart tremble at times. Thank You for conquering the grave and holding the keys of life; lead me by the hand through my days and anchor me in eternal hope. Amen.",
  },
  {
    slug: "not-knowing-how-to-pray",
    title: "Not Knowing How to Pray",
    groupId: "anxiety",
    prompt: "When your heart feels so tangled and heavy that you cannot even put words together.",
    intro:
      "Some days your soul feels too crowded or too tired to form a single coherent sentence before God. The good news is that He does not grade your eloquence—He understands even the quietest unspoken sigh.",
    keywords: ["how to pray", "speechless", "wordless prayer", "silence", "prayer", "struggling to pray"],
    passages: [
      {
        ref: "Romans 8:26–27",
        note: "When you do not know what to ask for, the Holy Spirit Himself steps into your weakness and intercedes for you with groans deeper than words.",
      },
      {
        ref: "Matthew 6:7–9",
        note: "Jesus frees you from polished or lengthy speeches, reminding you that your Father already knows what you need before you open your mouth.",
      },
      {
        ref: "1 Samuel 1:12–15",
        note: "Hannah was so weighed down with grief that her lips moved without a sound, yet the Lord heard every word of her silent, poured-out heart.",
      },
      {
        ref: "Psalms 62:8",
        note: "Prayer does not have to be tidy; Scripture simply invites you to pour out your whole heart before God—confusion, heaviness, and all.",
      },
      {
        ref: "Psalms 139:4",
        note: "You do not need eloquent sentences to come near: “before a word is on my tongue,” the Lord already knows it completely. Bring Him your unpolished honesty.",
      },
      {
        ref: "Luke 11:1–4",
        note: "Even the disciples who walked closest to Jesus had to ask Him to teach them to pray—His brief, simple model prayer is a gentle place to start today.",
      },
    ],
    prayer:
      "Father, my heart is so tangled today that I scarcely know where to begin or what to say. I simply sit quietly in Your presence and trust Your Spirit to carry my wordless sighs straight to Your heart. Amen.",
  },
  {
    slug: "feeling-out-of-control",
    title: "Feeling Out of Control",
    groupId: "anxiety",
    prompt: "When carefully laid plans fall apart and everything slips beyond your grasp.",
    intro:
      "Losing our grip on how life was supposed to unfold is deeply unsettling, yet we were never meant to steer the universe on our own. Unclenching tight hands to trust God's wise sovereignty is where steadiness begins.",
    keywords: ["out of control", "helpless", "chaos", "ruined plans", "surrender", "sovereignty"],
    passages: [
      {
        ref: "Proverbs 16:9",
        note: "Our hearts map out careful courses, yet the Lord Himself is the One who steadies and directs each actual step we take.",
      },
      {
        ref: "Psalms 46:1–3",
        note: "Even if the ground shifts beneath you and mountains tumble into roaring seas, God remains your unshakable refuge and present help.",
      },
      {
        ref: "Mark 4:37–40",
        note: "In a storm fierce enough to swamp the boat and terrify seasoned fishermen, one calm word from Jesus stilled both wind and waves.",
      },
      {
        ref: "Proverbs 19:21",
        note: "Human plans shift and unravel every day, yet the good purpose of the Lord stands firm and will prevail through it all.",
      },
      {
        ref: "Daniel 2:20–21",
        note: "When circumstances spin beyond your reach, Daniel's praise reminds you that times, seasons, and rulers still rest safely within God's wisdom and power.",
      },
      {
        ref: "James 4:13–15",
        note: "James gently loosens the burden of needing to control tomorrow, inviting you to hold every plan lightly inside the Lord's good will.",
      },
    ],
    prayer:
      "Sovereign Lord, my plans have come undone and everything feels beyond my grasp right now. I unclench my tightly held hands and surrender control of my life back to You; keep my heart steady in the middle of the storm. Amen.",
  },
  {
    slug: "weary-of-waiting",
    title: "Weary of Waiting and Impatient",
    groupId: "anxiety",
    prompt: "When you keep waiting for an answer or breakthrough that still has not arrived.",
    intro:
      "Waiting is one of the hardest classrooms of faith. In Scripture, a season of waiting is never wasted time; it is often where God quietly prepares both the circumstances ahead and the depth of our hearts.",
    keywords: ["waiting", "impatient", "delay", "patience", "unanswered prayer", "weary"],
    passages: [
      {
        ref: "Psalms 27:14",
        note: "Twice this verse calls you to wait patiently for the Lord—not in passive defeat, but with a strong and courageous heart.",
      },
      {
        ref: "Lamentations 3:25–26",
        note: "Even in dark seasons, the Lord is genuinely good to those who seek Him and wait quietly for His timely deliverance.",
      },
      {
        ref: "Psalms 37:7",
        note: "Instead of growing restless and resentful while watching others move ahead, be still before the Lord and wait patiently for Him to act.",
      },
      {
        ref: "Habakkuk 2:3",
        note: "God's promise has an appointed time; even when it feels painfully slow to you, it will surely arrive right on schedule.",
      },
      {
        ref: "Hebrews 10:35–36",
        note: "Long stretches of waiting can tempt you to give up, yet Scripture encourages you not to throw away your confidence—perseverance leads to the promise.",
      },
      {
        ref: "Romans 8:24–25",
        note: "True hope shines brightest when the answer is still unseen; waiting patiently right now is how your faith puts down deeper roots.",
      },
    ],
    prayer:
      "Lord, waiting so long without seeing the breakthrough has left me impatient and worn down. Give me quiet endurance in this in-between season, strengthen my trust in Your wise timing, and help me stay faithful today. Amen.",
  },

  // === 4. Anger, Conflict & Forgiveness (12) ===
  {
    slug: "anger",
    title: "Anger and Losing Your Temper",
    groupId: "anger-and-forgiveness",
    prompt: "When anger flares up and makes you want to snap back or act impulsively.",
    intro:
      "Anger is a natural response to unfairness or frustration, yet unchecked temper can tear down in seconds what took years to build. Take a slow breath before you speak, reply, or send that message.",
    keywords: ["anger", "angry", "temper", "rage", "frustrated", "irritable"],
    passages: [
      {
        ref: "James 1:19–20",
        note: "A golden rhythm for heated moments: be quick to listen, slow to speak, and slow to anger, because human rage never produces God's righteousness.",
      },
      {
        ref: "Ephesians 4:26–27",
        note: "Even when anger rises, refuse to let it linger past sundown and turn into an open door for lasting bitterness or sin.",
      },
      {
        ref: "Proverbs 15:1",
        note: "A gentle answer has quiet strength to cool rising wrath, whereas a harsh reply only pours more fuel onto the fire.",
      },
      {
        ref: "Proverbs 16:32",
        note: "True strength is not winning a shouting match; mastering your own temper takes greater courage than conquering a city.",
      },
      {
        ref: "Ecclesiastes 7:9",
        note: "Quickly provoked anger clouds your wisdom before you realize it; pausing for one breath keeps impulse from steering your words.",
      },
      {
        ref: "Colossians 3:8",
        note: "Paul urges you to set aside anger, rage, and harsh speech like worn-out garments so your words do not inflict wounds you later regret.",
      },
    ],
    prayer:
      "Lord, anger is rising fast inside me and tempting me to say things I will regret. Put a gentle guard over my tongue right now, help me pause and listen, and give me the calm self-control to respond with wisdom and grace. Amen.",
  },
  {
    slug: "bitterness-and-resentment",
    title: "Bitterness and Resentment",
    groupId: "anger-and-forgiveness",
    prompt: "When an old wound lingers so long that it turns into quiet bitterness eating at your soul.",
    intro:
      "Bitterness grows like a hidden poisonous root: the person it harms most is rarely the one who wronged us, but our own weary heart day after day. Scripture shows how God's grace can gently uproot it.",
    keywords: ["bitterness", "resentment", "grudge", "hatred", "hardened heart", "spite"],
    passages: [
      {
        ref: "Hebrews 12:15",
        note: "A sober, practical warning: watch closely so no small root of bitterness sprouts in your heart, where it can trouble and poison everything around you.",
      },
      {
        ref: "Ephesians 4:31–32",
        note: "Laying down bitterness and rage does not leave your heart empty—God invites you to fill that space with kindness, tenderness, and forgiving grace.",
      },
      {
        ref: "Psalms 73:21–24",
        note: "The psalmist admits his heart once grew grieved and embittered, yet turning back to take God's right hand brought steady healing and counsel.",
      },
      {
        ref: "Proverbs 14:30",
        note: "A tranquil heart brings fresh life to the whole body, whereas lingering resentment and envy slowly eat away at your peace from within.",
      },
      {
        ref: "Leviticus 19:18",
        note: "Even in the Old Testament, God urged His people not to nurse a grudge; releasing resentment protects your own soul from drying up.",
      },
      {
        ref: "1 Peter 2:1–2",
        note: "Putting away malice, envy, and slander is only half the path; Peter invites you to nourish your heart instead on the pure, healing word of God.",
      },
    ],
    prayer:
      "Merciful Father, this old hurt has lingered so long that it is hardening into bitterness inside me. I do not want to carry this poisonous root anymore; let Your grace gently pull it out and fill my heart with peace and tenderness again. Amen.",
  },
  {
    slug: "betrayal",
    title: "Betrayal",
    groupId: "anger-and-forgiveness",
    prompt: "When someone you trusted deeply turns against you or breaks your confidence.",
    intro:
      "A blow from an enemy hurts, yet nothing cuts as deeply as betrayal by a close friend or loved one. King David walked that lonely road, and Jesus Himself was betrayed by a friend at His own table—He understands your ache completely.",
    keywords: ["betrayal", "betrayed", "backstabbed", "broken trust", "disloyalty", "deceived"],
    passages: [
      {
        ref: "Psalms 55:12–14",
        note: "David voices the rawest truth of betrayal: an enemy's insults you could bear, yet it was a close friend who walked beside you who turned away.",
      },
      {
        ref: "Genesis 50:20",
        note: "After his own brothers sold him into slavery, Joseph came to see how God's sovereign hand could turn human betrayal into saving good.",
      },
      {
        ref: "Psalms 41:9–10",
        note: "Even when the trusted friend who shared your bread lifts a heel against you, the Lord's unfailing mercy remains your solid ground.",
      },
      {
        ref: "2 Timothy 4:16–17",
        note: "When everyone around Paul deserted him at his trial, the Lord Himself stood right beside him, strengthened him, and saw him safely through.",
      },
      {
        ref: "Luke 22:47–48",
        note: "Jesus knew the shock of being betrayed by one of His closest companions with a kiss—He meets you right inside the sting you feel today.",
      },
      {
        ref: "Micah 7:7",
        note: "When trust in those closest to you shatters, the prophet Micah points to the one relationship that will never fail: looking steadily to the Lord.",
      },
    ],
    prayer:
      "Lord Jesus, You know the piercing ache of being betrayed by someone close to Your table. My heart feels stunned and broken by this breach of trust; stay near to comfort me, keep my heart from turning cold, and anchor my trust in You. Amen.",
  },
  {
    slug: "slander-and-misunderstanding",
    title: "Slander and Misunderstanding",
    groupId: "anger-and-forgiveness",
    prompt: "When false rumors spread about you or you are misjudged with no way to clear your name.",
    intro:
      "Being wrongly accused sparks an urgent urge to defend yourself to everyone who will listen. Remember that One sees the full truth even when nobody else believes you, and He knows how to bring justice into the light in His time.",
    keywords: ["slander", "gossip", "misunderstood", "falsely accused", "rumors", "unfairly judged"],
    passages: [
      {
        ref: "Psalms 37:5–6",
        note: "Commit your path to the Lord rather than fighting every rumor; He is able to bring out your righteousness as clearly as the noonday sun.",
      },
      {
        ref: "1 Peter 2:23",
        note: "When false accusations and insults poured onto Jesus, He did not retaliate or threaten—He entrusted Himself quietly to the One who judges justly.",
      },
      {
        ref: "Matthew 5:11–12",
        note: "Jesus speaks deep reassurance to anyone falsely maligned for walking uprightly: heaven sees clearly, and your reward is secure with God.",
      },
      {
        ref: "Psalms 31:20",
        note: "The Lord keeps a quiet shelter in His presence where He hides the upright from human schemes and the sting of accusing tongues.",
      },
      {
        ref: "1 Corinthians 4:3–5",
        note: "When no one seems willing to hear your side, Paul reminds you that human courts are never final—the Lord will bring every hidden truth to light.",
      },
      {
        ref: "Isaiah 54:17",
        note: "False words and unfair accusations may wound you today, yet your vindication comes from the Lord and no slander will have the last word.",
      },
    ],
    prayer:
      "Righteous Judge, being misjudged and spoken against falsely leaves me restless and desperate to clear my name. Calm my heart to entrust my reputation into Your hands, keep my conscience clean, and trust You to bring the truth to light. Amen.",
  },
  {
    slug: "envy-and-comparison",
    title: "Envy and Comparing Yourself to Others",
    groupId: "anger-and-forgiveness",
    prompt: "When seeing someone else thrive stirs up jealousy, inadequacy, or quiet resentment.",
    intro:
      "Comparison quietly steals joy from every corner of life: looking up breeds envy, and looking down breeds pride. Scripture gently lifts your gaze away from others' lanes and back to the path God gave you.",
    keywords: ["envy", "jealousy", "comparison", "comparing", "covet", "insecurity"],
    passages: [
      {
        ref: "Galatians 6:4",
        note: "Paul invites you to examine your own faithful work with quiet gratitude instead of measuring your worth on someone else's scale.",
      },
      {
        ref: "Proverbs 14:30",
        note: "Envy acts like decay inside the bones, quietly draining away your peace while a tranquil, grateful heart restores life.",
      },
      {
        ref: "James 3:16",
        note: "Wherever bitter jealousy and selfish rivalry take root, restlessness and disorder are never far behind.",
      },
      {
        ref: "John 21:21–22",
        note: "When Peter glanced sideways to compare his future with John's, Jesus gently redirected him: leave that to Me—you follow Me.",
      },
      {
        ref: "Ecclesiastes 4:4",
        note: "Toiling just to keep up with a neighbor's success is chasing the wind; today you are free to step out of that exhausting race.",
      },
      {
        ref: "1 Corinthians 13:4–6",
        note: "Real love does not envy another's joy; letting go of comparison opens your heart to celebrate others genuinely and rest in your own portion.",
      },
    ],
    prayer:
      "Father, I confess how easily my heart turns envious and discouraged whenever I compare my life to someone else's. Lift my eyes off that scorecard, fill me with gratitude for the path You have given me, and help me truly rejoice with others. Amen.",
  },
  {
    slug: "desire-for-revenge",
    title: "Desire for Revenge",
    groupId: "anger-and-forgiveness",
    prompt: "When someone treats you badly and every instinct wants to get even right away.",
    intro:
      "It feels deeply natural to want those who hurt us to taste the exact pain they caused. Scripture never minimizes real wrong, yet it guards you from becoming a mirror image of the very person who wounded you.",
    keywords: ["revenge", "vengeance", "getting even", "retaliation", "payback", "unfair"],
    passages: [
      {
        ref: "Romans 12:19–21",
        note: "Leave room for God's righteous justice instead of avenging yourself, and refuse to let evil conquer you—overcome evil with good.",
      },
      {
        ref: "Proverbs 20:22",
        note: "Hold back from swearing to pay evil back; wait on the Lord, who knows how to defend and rescue you far more cleanly than anger ever could.",
      },
      {
        ref: "1 Thessalonians 5:15",
        note: "Refusing to repay evil for evil lets the endless cycle of retaliation stop right here with you.",
      },
      {
        ref: "1 Peter 3:9",
        note: "Answering an insult with steadiness and blessing rather than payback is not weakness—it is quiet spiritual strength.",
      },
      {
        ref: "1 Samuel 24:12",
        note: "Even with the man hunting him completely within reach, David lowered his hand and left judgment to the Lord—that same freedom is offered to you.",
      },
      {
        ref: "Matthew 5:38–39",
        note: "Jesus breaks the ancient reflex of eye-for-an-eye retaliation so you can keep your dignity and self-control in His grace instead of being dragged down.",
      },
    ],
    prayer:
      "Just and faithful Lord, after being treated so unfairly, part of me longs to strike back and even the score. Hold my hands and words back from retaliation, help me leave justice with You, and give me strength to overcome evil with good. Amen.",
  },
  {
    slug: "struggling-to-forgive",
    title: "Struggling to Forgive Others",
    groupId: "anger-and-forgiveness",
    prompt: "When you know forgiveness is right, yet the wound still feels far too deep to let go.",
    intro:
      "Forgiveness does not pretend a wrong never mattered, nor does it force you to erase the pain overnight. Forgiveness is placing that debt into God's hands so your own heart is finally released from the prison of resentment.",
    keywords: ["forgiveness", "forgive", "letting go", "mercy", "unforgiveness", "hurt"],
    passages: [
      {
        ref: "Colossians 3:13",
        note: "The strength to forgive rarely comes from gritting your teeth; it grows as you remember how generously the Lord has already forgiven you.",
      },
      {
        ref: "Matthew 18:21–22",
        note: "Jesus teaches that forgiveness is never about keeping a tight tally—it is cultivating a merciful heart that refuses to keep score.",
      },
      {
        ref: "Mark 11:25",
        note: "When you stand to pray, releasing what you hold against another clears the path for fresh peace between your heart and your Father in heaven.",
      },
      {
        ref: "Luke 23:34",
        note: "Even from the cross in unbearable agony, Jesus asked His Father to forgive those crucifying Him—a mercy far beyond human strength alone.",
      },
      {
        ref: "Genesis 45:5–8",
        note: "Sold into slavery by his own brothers, Joseph forgave not by excusing their sin, but by trusting that God's good purpose was larger than their harm.",
      },
      {
        ref: "Proverbs 19:11",
        note: "Overlooking an offense is never a mark of weakness or defeat; Scripture calls that patient wisdom the true honor of a noble heart.",
      },
    ],
    prayer:
      "Lord Jesus, I know I need to forgive, yet this wound still aches deeply and I cannot force my heart to let go alone. Remind me of Your vast mercy toward me, and step by step help me place this debt in Your hands so I can be free. Amen.",
  },
  {
    slug: "forgiving-yourself",
    title: "Struggling to Forgive Yourself",
    groupId: "anger-and-forgiveness",
    prompt: "When you keep punishing yourself over a past mistake even after repenting.",
    intro:
      "Often we extend grace freely to others while acting as the harshest judge over ourselves. If God Himself has already declared you forgiven and wiped the slate clean, you do not have to keep sentencing yourself.",
    keywords: ["forgiving yourself", "self-forgiveness", "regret", "guilt", "remorse", "past mistakes"],
    passages: [
      {
        ref: "Romans 8:1",
        note: "The verdict is settled for good: there is now no condemnation left for anyone who belongs to Christ Jesus.",
      },
      {
        ref: "Psalms 103:12",
        note: "When God forgives, He removes your transgressions as far as the east is from the west—a distance that never meets again.",
      },
      {
        ref: "1 John 3:20",
        note: "Even when your own heart keeps accusing and replaying old failures, God is greater than your heart and knows everything with mercy.",
      },
      {
        ref: "Philippians 3:13–14",
        note: "Paul carried a painful past he could never rewrite, yet he chose to leave what lay behind and press forward toward Christ's calling.",
      },
      {
        ref: "Isaiah 43:25",
        note: "If God Himself has blotted out your transgressions and chosen to remember your sins no more, you can gently lay down the gavel of self-condemnation.",
      },
      {
        ref: "Hebrews 8:12",
        note: "God's new covenant promises wholehearted, complete forgiveness—once you have repented, do not lock yourself inside a sentence He has already torn up.",
      },
    ],
    prayer:
      "Forgiving Father, even though I have confessed my failure and turned back to You, my own heart keeps replaying it and condemning me. Help me truly receive the full pardon You have declared in Christ and step forward in peace. Amen.",
  },
  {
    slug: "conflict-and-quarreling",
    title: "Conflict and Quarreling",
    groupId: "anger-and-forgiveness",
    prompt: "When a tense argument erupts with family, a close friend, or a coworker.",
    intro:
      "In a heated argument, winning the point at the cost of the relationship usually means both sides lose. Scripture's steady wisdom cools the room and opens a quieter door back toward honest conversation.",
    keywords: ["conflict", "quarreling", "argument", "fighting", "disagreement", "peace"],
    passages: [
      {
        ref: "Proverbs 17:14",
        note: "Starting a quarrel is like breaching a dam: the longer it runs, the harder it is to hold back, so stepping away early is true wisdom.",
      },
      {
        ref: "Romans 12:18",
        note: "Counsel that is both tender and realistic: as far as it depends on you, do everything within your power to live at peace with everyone.",
      },
      {
        ref: "Proverbs 15:18",
        note: "A hot temper fans small sparks into lasting strife, while a patient spirit knows how to quiet a rising dispute.",
      },
      {
        ref: "Matthew 5:23–24",
        note: "Jesus treats taking the first step toward reconciliation with a brother or sister as so urgent that it comes even before bringing an offering.",
      },
      {
        ref: "2 Timothy 2:24–25",
        note: "When tension tempts you to fight for the last word, Paul reminds you not to be quarrelsome, but to choose kindness, patience, and gentleness instead.",
      },
      {
        ref: "James 3:17–18",
        note: "Wisdom from above never pours gasoline on an argument; it is peace-loving, gentle, and willing to yield so righteousness can grow in peace.",
      },
    ],
    prayer:
      "Lord of peace, this conflict has left the air heavy and both of us bruised and weary. Lower my pride and my urge to win the argument; give me a gentle voice and a humble heart to take the first step toward peace. Amen.",
  },
  {
    slug: "enduring-injustice",
    title: "Enduring Injustice",
    groupId: "anger-and-forgiveness",
    prompt: "When dishonest people seem to get ahead while those doing right pay the price.",
    intro:
      "Seeing real injustice without feeling a stir inside would be strange. Scripture never shrugs at unfairness; the Psalms and prophets sit right beside your honest outrage and affirm that final justice belongs to God.",
    keywords: ["injustice", "unfair", "unfairness", "oppression", "justice", "wronged"],
    passages: [
      {
        ref: "Psalms 37:1–9",
        note: "Do not let the brief success of wrongdoers provoke you into abandoning integrity; their triumph fades like grass, while those who wait on God endure.",
      },
      {
        ref: "Psalms 103:6",
        note: "The Lord does not sit passively on the sidelines—He actively works righteousness and justice on behalf of all who are oppressed.",
      },
      {
        ref: "Micah 6:8",
        note: "Even in a crooked world, what God asks of you stays wonderfully clear: act justly, love mercy, and walk humbly with your God.",
      },
      {
        ref: "1 Peter 2:19–20",
        note: "Enduring unfair treatment with grace because you choose to do right does not go unnoticed—it is deeply commendable in God's sight.",
      },
      {
        ref: "Isaiah 30:18",
        note: "When unfairness drags on without relief, remember that the Lord is a God of justice who longs to show grace and never ignores those who wait for Him.",
      },
      {
        ref: "Amos 5:24",
        note: "Your ache for fairness echoes God's own heart—He desires justice to roll on like a mighty river and righteousness like an ever-flowing stream.",
      },
    ],
    prayer:
      "Righteous God, watching unfairness go unchecked and bearing unjust loss weighs heavily on my heart. Keep me from growing cynical or compromising what is right; give me strength to stay faithful and trust Your final justice. Amen.",
  },
  {
    slug: "losing-trust-in-people",
    title: "Losing Trust in People",
    groupId: "anger-and-forgiveness",
    prompt: "When repeated disappointments make you want to wall off your heart for good.",
    intro:
      "After being let down or taken advantage of more than once, building thick walls feels like common sense. Scripture teaches us to walk wisely without placing our whole soul in fragile human hands—while keeping our hearts warm through trust in God.",
    keywords: ["trust issues", "losing trust", "guarded heart", "disappointed in people", "cynicism", "skeptical"],
    passages: [
      {
        ref: "Psalms 118:8–9",
        note: "Taking refuge in the Lord is always far steadier than staking your ultimate hope on flawed people or human influence.",
      },
      {
        ref: "John 2:24–25",
        note: "Jesus Himself had no illusions about how fickle human hearts can be, yet He still loved people deeply and gave Himself to redeem them.",
      },
      {
        ref: "Jeremiah 17:7–8",
        note: "When your trust sends its roots deep into the Lord, human inconsistency and dry seasons cannot make your soul wither.",
      },
      {
        ref: "1 Corinthians 13:7",
        note: "True love is never naive, yet anchored in God it refuses to surrender entirely to cynicism and still hopes for the good He can work in others.",
      },
      {
        ref: "Matthew 10:16",
        note: "Jesus asks neither for naive gullibility nor for hardened suspicion—He calls you to combine wise discernment with an innocent, unpoisoned heart.",
      },
      {
        ref: "Hebrews 13:8",
        note: "Shifting human loyalties can tempt you to lock your heart away, yet Jesus Christ remains the same yesterday, today, and forever—utterly trustworthy.",
      },
    ],
    prayer:
      "Unchanging Lord, after so many disappointments with people, I just want to lock the door of my heart so no one can hurt me again. Be the steady anchor of my trust, and teach me to walk with wise discernment while keeping my heart soft. Amen.",
  },
  {
    slug: "dealing-with-difficult-people",
    title: "Dealing with Difficult or Hostile People",
    groupId: "anger-and-forgiveness",
    prompt: "When you have to live or work alongside someone who is harsh, prickly, or hard to please.",
    intro:
      "We cannot always avoid the people who wear us down or treat us harshly. Scripture offers a steady way to respond—standing with quiet dignity without letting someone else's sharpness pull you down to their level.",
    keywords: ["difficult people", "enemies", "hostility", "hard to deal with", "harshness", "grace"],
    passages: [
      {
        ref: "Luke 6:27–28",
        note: "When Jesus commands you to bless and pray for those who mistreat you, He is guarding your own heart from growing hard and bitter.",
      },
      {
        ref: "Proverbs 25:21–22",
        note: "Genuine kindness in the face of hostility reaches a person's conscience more deeply than any sharp comeback ever could.",
      },
      {
        ref: "Proverbs 16:7",
        note: "When your ways remain pleasing to the Lord, He is able even to soften the hearts of those who oppose you and bring unexpected peace.",
      },
      {
        ref: "Romans 12:14",
        note: "Choosing to bless rather than curse keeps your own spirit clear, steady, and free from the heaviness of resentment.",
      },
      {
        ref: "Ecclesiastes 10:4",
        note: "When a leader or someone around you flares up in temper, holding your post with calm composure can lay great offenses to rest.",
      },
      {
        ref: "Colossians 4:6",
        note: "When sharp words tempt you to answer with equal edge, ask God to make your speech consistently gracious, wise, and well-seasoned.",
      },
    ],
    prayer:
      "Gentle Father, dealing day after day with someone so harsh and difficult is wearing down my patience. Guard my heart from turning sharp in return; fill my words with grace and wisdom, and give me enough strength to pray for them too. Amen.",
  },
];
