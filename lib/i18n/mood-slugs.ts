import type { Locale } from "./locale";

/**
 * Bidirectional 1-to-1 mapping between canonical (Vietnamese) mood group IDs and English IDs.
 */
export const MOOD_GROUP_IDS = [
  ["niem-vui", "joy"],
  ["noi-buon", "sorrow"],
  ["lo-au", "anxiety"],
  ["tuc-gian", "anger-and-forgiveness"],
  ["toi-loi", "temptation-and-repentance"],
  ["thu-thach", "trials"],
  ["gia-dinh", "family-and-love"],
  ["dinh-huong", "life-direction"],
] as const;

/**
 * Bidirectional 1-to-1 mapping between canonical (Vietnamese) mood slugs and English slugs
 * for all 100 mood guides. Kept separate from full mood definitions so client code can
 * switch languages and resolve history links without bundling the full mood catalog.
 */
export const MOOD_SLUG_PAIRS = [
  // Group 1: Joy & Gratitude (12)
  ["vui-mung", "joy"],
  ["biet-on", "gratitude"],
  ["hanh-phuc", "happiness"],
  ["binh-an", "peace"],
  ["hy-vong", "hope"],
  ["tu-tin", "confidence"],
  ["khoi-dau-moi", "new-beginnings"],
  ["hai-long-du-day", "contentment"],
  ["nhe-nhom-sau-bao", "relief-after-the-storm"],
  ["kinh-ngac-truoc-tao-vat", "awe-and-wonder"],
  ["muon-ca-ngoi", "praise-and-worship"],
  ["duoc-chua-yeu", "feeling-loved-by-god"],

  // Group 2: Sorrow, Loss & Loneliness (14)
  ["buon-ba", "sadness"],
  ["co-don", "loneliness"],
  ["mat-nguoi-than", "grief-and-loss"],
  ["tan-vo-that-tinh", "heartbreak"],
  ["tuyet-vong", "despair"],
  ["trong-rong-vo-nghia", "emptiness"],
  ["chan-nan-mat-dong-luc", "discouragement"],
  ["nho-nha-xa-que", "homesickness"],
  ["bi-bo-roi", "feeling-abandoned"],
  ["khong-duoc-yeu-thuong", "feeling-unloved"],
  ["tu-ti-vo-gia-tri", "feeling-worthless"],
  ["that-vong", "disappointment"],
  ["ton-thuong-sau-sac", "deep-hurt"],
  ["khoc-loc-dau-long", "weeping-and-lament"],

  // Group 3: Anxiety, Fear & Pressure (12)
  ["lo-au-tuong-lai", "anxiety-about-the-future"],
  ["so-hai", "fear"],
  ["cang-thang-qua-tai", "stress-and-overwhelm"],
  ["mat-ngu-dem-khuya", "sleepless-nights"],
  ["hoang-mang-nga-re", "crossroads-and-uncertainty"],
  ["so-that-bai", "fear-of-failure"],
  ["so-bi-tu-choi", "fear-of-rejection"],
  ["so-benh-tat", "fear-of-illness"],
  ["so-cai-chet", "fear-of-death"],
  ["khong-biet-cau-nguyen", "not-knowing-how-to-pray"],
  ["mat-kiem-soat", "feeling-out-of-control"],
  ["cho-doi-moi-mon", "weary-of-waiting"],

  // Group 4: Anger, Conflict & Forgiveness (12)
  ["tuc-gian", "anger"],
  ["cay-dang-oan-han", "bitterness-and-resentment"],
  ["bi-phan-boi", "betrayal"],
  ["bi-vu-khong-hieu-lam", "slander-and-misunderstanding"],
  ["ghen-ti-so-sanh", "envy-and-comparison"],
  ["muon-tra-thu", "desire-for-revenge"],
  ["kho-tha-thu-nguoi-khac", "struggling-to-forgive"],
  ["kho-tha-thu-chinh-minh", "forgiving-yourself"],
  ["cai-va-bat-hoa", "conflict-and-quarreling"],
  ["chiu-bat-cong", "enduring-injustice"],
  ["mat-niem-tin-con-nguoi", "losing-trust-in-people"],
  ["doi-dien-nguoi-kho-tinh", "dealing-with-difficult-people"],

  // Group 5: Sin, Temptation & Repentance (10)
  ["mac-cam-toi-loi", "guilt"],
  ["xau-ho-qua-khu", "shame-over-the-past"],
  ["dang-bi-cam-do", "facing-temptation"],
  ["vap-nga-lap-lai", "repeated-stumbling"],
  ["kieu-ngao-tu-man", "pride-and-complacency"],
  ["tham-lam-me-tien", "greed-and-love-of-money"],
  ["ham-muon-xac-thit", "battling-lust"],
  ["noi-doi-thieu-thanh-that", "honesty-after-lying"],
  ["nguoi-lanh-xa-chua", "feeling-distant-from-god"],
  ["muon-bat-dau-lai", "repentance-and-starting-over"],

  // Group 6: Exhaustion, Illness & Trials (12)
  ["met-moi-kiet-suc", "exhaustion-and-burnout"],
  ["benh-tat-dau-don", "illness-and-pain"],
  ["cham-soc-nguoi-benh", "caring-for-the-sick"],
  ["kho-khan-tai-chinh", "financial-hardship"],
  ["that-nghiep-chong-chenh", "job-loss-and-career-uncertainty"],
  ["that-bai-nang-ne", "after-a-heavy-failure"],
  ["thu-thach-keo-dai", "long-trials"],
  ["chua-im-lang", "when-god-seems-silent"],
  ["nghi-ngo-duc-tin", "doubting-your-faith"],
  ["bi-che-cuoi-vi-duc-tin", "mocked-for-your-faith"],
  ["thien-tai-bien-co", "disaster-and-crisis"],
  ["tuoi-gia-xe-chieu", "growing-older"],

  // Group 7: Family, Love & Relationships (14)
  ["yeu-thuong-hen-ho", "love-and-dating"],
  ["hon-nhan-vo-chong", "building-a-strong-marriage"],
  ["hon-nhan-ran-nut", "marriage-in-crisis"],
  ["lam-cha-me", "parenting"],
  ["hieu-kinh-cha-me", "honoring-parents"],
  ["lo-cho-con-cai", "worrying-about-your-children"],
  ["tinh-ban-chan-thanh", "true-friendship"],
  ["song-trong-cong-dong", "community-and-church"],
  ["dat-ranh-gioi", "healthy-boundaries"],
  ["doc-than-cho-doi", "singleness-and-waiting"],
  ["lam-nguoi-hoa-giai", "peacemaking"],
  ["an-ui-nguoi-dau-kho", "comforting-others"],
  ["nguoi-than-chua-tin", "unbelieving-family"],
  ["chia-ly-tien-biet", "parting-and-farewell"],

  // Group 8: Work, Wisdom & Life Direction (14)
  ["can-su-khon-ngoan", "needing-wisdom"],
  ["tim-muc-dich-song", "finding-purpose"],
  ["chan-nan-cong-viec", "work-weariness"],
  ["buoc-ra-vung-an-toan", "stepping-out-in-courage"],
  ["quan-ly-tien-bac", "stewardship-and-generosity"],
  ["lam-lanh-dao", "servant-leadership"],
  ["song-chinh-truc", "living-with-integrity"],
  ["giu-mieng-luoi", "guarding-your-words"],
  ["kien-tri-khong-bo-cuoc", "perseverance"],
  ["hoc-tinh-khiem-nhuong", "learning-humility"],
  ["hoc-long-kien-nhan", "learning-patience"],
  ["thang-su-luoi-bieng", "self-discipline"],
  ["cau-nguyen-sau-sac", "deeper-prayer"],
  ["khat-khao-gan-chua", "hungering-for-god"],
] as const;

const groupViToEn = new Map<string, string>(MOOD_GROUP_IDS);
const groupEnToVi = new Map<string, string>(MOOD_GROUP_IDS.map(([vi, en]) => [en, vi]));

const slugViToEn = new Map<string, string>(MOOD_SLUG_PAIRS);
const slugEnToVi = new Map<string, string>(MOOD_SLUG_PAIRS.map(([vi, en]) => [en, vi]));

/** Returns the canonical (Vietnamese) mood ID from either a VI or EN slug. */
export function canonicalMoodId(slug: string): string | undefined {
  if (slugViToEn.has(slug)) return slug;
  return slugEnToVi.get(slug);
}

/** Translates a mood slug (from either locale) into the target locale's slug. */
export function moodSlugFor(slugOrCanonicalId: string, locale: Locale): string | undefined {
  const canonical = canonicalMoodId(slugOrCanonicalId);
  if (!canonical) return undefined;
  return locale === "en" ? slugViToEn.get(canonical) : canonical;
}

/** Returns the canonical (Vietnamese) mood group ID from either a VI or EN group ID. */
export function canonicalMoodGroupId(id: string): string | undefined {
  if (groupViToEn.has(id)) return id;
  return groupEnToVi.get(id);
}

/** Translates a mood group ID (from either locale) into the target locale's group ID. */
export function moodGroupIdFor(idOrCanonical: string, locale: Locale): string | undefined {
  const canonical = canonicalMoodGroupId(idOrCanonical);
  if (!canonical) return undefined;
  return locale === "en" ? groupViToEn.get(canonical) : canonical;
}
