import { bookByCode } from "../content/books";
import type { Locale } from "../i18n/locale";

type CardVerse = { code: string; chapter: number; verse: number; vi: string; en: string };

/**
 * Verses for the streak share card: the verse, or a whole clause of it, as the site's Bibles print it
 * (Bản Truyền Thống, BSB), short enough for two lines on the card. card-verses.test.ts checks both.
 */
export const CARD_VERSES: readonly CardVerse[] = [
  { code: "PSA", chapter: 119, verse: 105, vi: "Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi.", en: "Your word is a lamp to my feet and a light to my path." },
  { code: "PSA", chapter: 119, verse: 11, vi: "Tôi đã giấu lời Chúa trong lòng tôi, để tôi không phạm tội cùng Chúa.", en: "I have hidden Your word in my heart that I might not sin against You." },
  { code: "PSA", chapter: 119, verse: 103, vi: "Lời Chúa ngọt họng tôi dường bao! Thật ngọt hơn mật ong trong miệng tôi!", en: "How sweet are Your words to my taste— sweeter than honey in my mouth!" },
  { code: "PSA", chapter: 119, verse: 130, vi: "Sự bày giãi lời Chúa, soi sáng cho, ban sự thông hiểu cho người thật thà.", en: "The unfolding of Your words gives light; it informs the simple." },
  { code: "PSA", chapter: 119, verse: 18, vi: "Xin Chúa mở mắt tôi, để tôi thấy sự lạ lùng trong luật pháp của Chúa.", en: "Open my eyes that I may see wondrous things from Your law." },
  { code: "PSA", chapter: 119, verse: 89, vi: "Hỡi Đức Giê-hô-va, lời Ngài được vững lập đời đời trên trời.", en: "Your word, O LORD, is everlasting; it is firmly fixed in the heavens." },
  { code: "PSA", chapter: 119, verse: 50, vi: "Lời Chúa làm cho tôi được sống lại, ấy là sự an ủi tôi trong cơn hoạn nạn.", en: "This is my comfort in affliction, that Your promise has given me life." },
  { code: "LAM", chapter: 3, verse: 23, vi: "Mỗi buổi sáng thì lại mới luôn, sự thành tín Ngài là lớn lắm.", en: "They are new every morning; great is Your faithfulness!" },
  { code: "ISA", chapter: 40, verse: 8, vi: "Cỏ khô, hoa rụng; nhưng lời của Đức Chúa Trời chúng ta còn mãi đời đời!", en: "The grass withers and the flowers fall, but the word of our God stands forever." },
  { code: "JOH", chapter: 1, verse: 5, vi: "Sự sáng soi trong tối tăm, tối tăm chẳng hề nhận lấy sự sáng.", en: "The Light shines in the darkness, and the darkness has not overcome it." },
  { code: "PSA", chapter: 118, verse: 24, vi: "Nầy là ngày Đức Giê-hô-va làm nên, chúng tôi sẽ mừng rỡ và vui vẻ trong ngày ấy.", en: "This is the day that the LORD has made; we will rejoice and be glad in it." },
  { code: "MAT", chapter: 11, verse: 28, vi: "Hỡi những kẻ mệt mỏi và gánh nặng, hãy đến cùng ta, ta sẽ cho các ngươi được yên nghỉ.", en: "Come to Me, all you who are weary and burdened, and I will give you rest." },
  { code: "PHI", chapter: 4, verse: 13, vi: "Tôi làm được mọi sự nhờ Đấng ban thêm sức cho tôi.", en: "I can do all things through Christ who gives me strength." },
  { code: "JAM", chapter: 1, verse: 22, vi: "Hãy làm theo lời, chớ lấy nghe làm đủ mà lừa dối mình.", en: "Be doers of the word, and not hearers only. Otherwise, you are deceiving yourselves." },
  { code: "PSA", chapter: 23, verse: 1, vi: "Đức Giê-hô-va là Đấng chăn giữ tôi: tôi sẽ chẳng thiếu thốn gì.", en: "The LORD is my shepherd; I shall not want." },
  { code: "MAT", chapter: 24, verse: 35, vi: "Trời đất sẽ qua, nhưng lời ta nói chẳng bao giờ qua đi.", en: "Heaven and earth will pass away, but My words will never pass away." },
  { code: "1PE", chapter: 5, verse: 7, vi: "Hãy trao mọi điều lo lắng mình cho Ngài, vì Ngài hay săn sóc anh em.", en: "Cast all your anxiety on Him, because He cares for you." },
  { code: "JOH", chapter: 6, verse: 68, vi: "Lạy Chúa, chúng tôi đi theo ai? Chúa có những lời của sự sống đời đời.", en: "Lord, to whom would we go? You have the words of eternal life." },
  { code: "PSA", chapter: 121, verse: 2, vi: "Sự tiếp trợ tôi đến từ Đức Giê-hô-va, là Đấng đã dựng nên trời và đất.", en: "My help comes from the LORD, the Maker of heaven and earth." },
  { code: "ROM", chapter: 12, verse: 12, vi: "Hãy vui mừng trong sự trông cậy, nhịn nhục trong sự hoạn nạn, bền lòng mà cầu nguyện.", en: "Be joyful in hope, patient in affliction, persistent in prayer." },
  { code: "PSA", chapter: 27, verse: 1, vi: "Đức Giê-hô-va là ánh sáng và là sự cứu rỗi tôi: tôi sẽ sợ ai?", en: "The LORD is my light and my salvation— whom shall I fear?" },
  { code: "PSA", chapter: 46, verse: 10, vi: "Hãy yên lặng và biết rằng ta là Đức Chúa Trời.", en: "Be still and know that I am God." },
  { code: "PSA", chapter: 16, verse: 11, vi: "Chúa sẽ chỉ cho tôi biết con đường sự sống.", en: "You have made known to me the path of life." },
  { code: "JOH", chapter: 15, verse: 5, vi: "Ta là gốc nho, các ngươi là nhánh.", en: "I am the vine and you are the branches." },
  { code: "JOH", chapter: 8, verse: 12, vi: "Ta là sự sáng của thế gian.", en: "I am the light of the world." },
  { code: "ISA", chapter: 40, verse: 31, vi: "Ai trông đợi Đức Giê-hô-va thì chắc được sức mới.", en: "Those who wait upon the LORD will renew their strength." },
  { code: "PSA", chapter: 5, verse: 3, vi: "Đức Giê-hô-va ôi! buổi sáng Ngài sẽ nghe tiếng tôi.", en: "In the morning, O LORD, You hear my voice." },
  { code: "HEB", chapter: 4, verse: 12, vi: "Lời của Đức Chúa Trời là lời sống và linh nghiệm.", en: "The word of God is living and active." },
  { code: "JER", chapter: 15, verse: 16, vi: "Lời Ngài là sự vui mừng hớn hở của lòng tôi.", en: "Your words became my joy and my heart’s delight." },
  { code: "2CO", chapter: 4, verse: 16, vi: "Người bề trong cứ đổi mới càng ngày càng hơn.", en: "Our inner self is being renewed day by day." },
  { code: "PSA", chapter: 90, verse: 12, vi: "Cầu xin Chúa dạy chúng tôi biết đếm các ngày chúng tôi.", en: "Teach us to number our days." },
  { code: "GAL", chapter: 6, verse: 9, vi: "Chớ mệt nhọc về sự làm lành.", en: "Let us not grow weary in well-doing." },
  { code: "MAT", chapter: 6, verse: 33, vi: "Trước hết, hãy tìm kiếm nước Đức Chúa Trời và sự công bình của Ngài.", en: "Seek first the kingdom of God and His righteousness." },
  { code: "JOH", chapter: 14, verse: 27, vi: "Ta để sự bình an lại cho các ngươi; ta ban sự bình an ta cho các ngươi.", en: "Peace I leave with you; My peace I give to you." },
  { code: "JOS", chapter: 1, verse: 9, vi: "Giê-hô-va Đức Chúa Trời ngươi vẫn ở cùng ngươi trong mọi nơi ngươi đi.", en: "The LORD your God is with you wherever you go." },
  { code: "ISA", chapter: 26, verse: 3, vi: "Ngài sẽ gìn giữ người trong sự bình yên trọn vẹn, vì người nhờ cậy Ngài.", en: "You will keep in perfect peace the steadfast of mind, because he trusts in You." },
];

/** FNV-1a, 32-bit: a stable spread of any string over the unsigned integers. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/** The card's verse for a reader on a local day: the same all that day, different across days and readers. */
export function cardVerse(locale: Locale, userId: string | null, day: string): { text: string; ref: string } {
  const v = CARD_VERSES[hash(`${userId ?? ""}:${day}`) % CARD_VERSES.length];
  // One psalm is "Psalm", the book is "Psalms".
  const book = locale === "en" && v.code === "PSA" ? "Psalm" : (bookByCode(v.code, locale)?.name ?? v.code);
  return { text: v[locale], ref: `${book} ${v.chapter}:${v.verse}` };
}
