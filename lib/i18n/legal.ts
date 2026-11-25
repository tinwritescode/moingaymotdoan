import type { Locale } from "./locale";

export type LegalKind = "privacy" | "terms";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDoc = {
  title: string;
  /** One sentence for the meta description. */
  description: string;
  /** Shown as "last updated"; ISO date YYYY-MM-DD. */
  updated: string;
  sections: LegalSection[];
};

/** Where readers send questions and data requests; the legal page renders it below the sections. */
export const LEGAL_CONTACT_URL = "https://github.com/tinwritescode/moingaymotdoan/issues";

export const LEGAL: Record<Locale, Record<LegalKind, LegalDoc>> = {
  vi: {
    privacy: {
      title: "Quyền riêng tư",
      description:
        "Cách Mỗi Ngày Một Đoạn xử lý lịch sử đọc khi bạn đọc không cần tài khoản hoặc đăng nhập đồng bộ — không quảng cáo, không theo dõi.",
      updated: "2026-11-25",
      sections: [
        {
          heading: "Đọc không cần tài khoản",
          paragraphs: [
            "Bạn có thể đọc toàn bộ Kinh Thánh, ghi chú và các trang cảm xúc trên Mỗi Ngày Một Đoạn mà không cần đăng ký hay đăng nhập.",
            "Khi bạn không đăng nhập, không có dữ liệu nào được gửi về máy chủ của chúng tôi. Lịch sử đọc và các tùy chỉnh hiển thị (chế độ màu, phông chữ, cỡ chữ) chỉ được lưu ngay trong bộ nhớ trình duyệt (localStorage) trên thiết bị của bạn.",
          ],
        },
        {
          heading: "Khi bạn đăng nhập tài khoản",
          paragraphs: [
            "Tài khoản là hoàn toàn tùy chọn, giúp bạn đồng bộ tiến độ đọc giữa các thiết bị. Việc đăng nhập được thực hiện qua WorkOS AuthKit.",
            "WorkOS lưu email, tên hiển thị và ảnh đại diện tài khoản của bạn. Cơ sở dữ liệu của chúng tôi không bao giờ lưu email hay tên của bạn, mà chỉ lưu mã định danh người dùng do WorkOS cấp.",
            "Khi bạn đã đăng nhập, lịch sử đọc của bạn được đồng bộ về cơ sở dữ liệu của chúng tôi (Postgres chạy trên Neon) thông qua một hàm API nhỏ (Neon Functions). Dữ liệu được lưu cho mỗi tài khoản gồm: các đoạn Kinh Thánh và trang cảm xúc bạn đã mở (tên sách, số đoạn, tiêu đề), ngày giờ đọc, số lần đọc và trạng thái đã đọc xong. Ngay khi bạn đăng nhập, lịch sử đang lưu sẵn trên trình duyệt sẽ tự động được gộp vào tài khoản.",
          ],
        },
        {
          heading: "Mục đích sử dụng dữ liệu",
          paragraphs: [
            "Chúng tôi chỉ dùng lịch sử đọc của bạn cho một mục đích duy nhất: hiển thị lại lịch sử và tiến độ đọc của chính bạn trên các thiết bị bạn sử dụng.",
            "Trang web hoàn toàn miễn phí, phi lợi nhuận và không đặt quảng cáo. Chúng tôi không cài công cụ phân tích hay mã theo dõi, không gửi email tiếp thị, và không bán hay chia sẻ dữ liệu của bạn cho bất kỳ ai.",
          ],
        },
        {
          heading: "Các dịch vụ hạ tầng",
          paragraphs: [
            "Để vận hành trang web, chúng tôi sử dụng ba đơn vị hạ tầng: WorkOS (đăng nhập và xác thực tài khoản), Neon (cơ sở dữ liệu và API), và Vercel (lưu trữ trang web tĩnh).",
            "Cũng như mọi nhà cung cấp máy chủ web khác, Vercel có thể xử lý các thông tin kỹ thuật tiêu chuẩn của mỗi lượt truy cập (chẳng hạn địa chỉ IP) để gửi trang web đến trình duyệt của bạn.",
          ],
        },
        {
          heading: "Lưu giữ và xóa dữ liệu",
          paragraphs: [
            "Lịch sử đọc đã đồng bộ được giữ lại cho đến khi bạn tự xóa hoặc yêu cầu chúng tôi xóa tài khoản.",
            "Trên trang Lịch sử, bạn có thể xóa từng mục riêng lẻ hoặc chọn “Xóa hết” để xóa toàn bộ lịch sử đọc khỏi cả trình duyệt lẫn máy chủ của chúng tôi. Khi bạn đăng xuất, trang web sẽ ngừng đồng bộ.",
            "Nếu bạn muốn xóa hẳn tài khoản, xin nhắn cho chúng tôi qua liên kết liên hệ bên dưới. Chúng tôi sẽ xóa tài khoản của bạn trên WorkOS cùng toàn bộ lịch sử đọc còn lại.",
          ],
        },
        {
          heading: "Quyền của bạn",
          paragraphs: [
            "Theo các quy định về bảo vệ dữ liệu cá nhân tại Việt Nam (Nghị định 13/2023/NĐ-CP), bạn có quyền truy cập, chỉnh sửa, yêu cầu xóa dữ liệu của mình hoặc rút lại sự đồng ý bất cứ lúc nào.",
            "Bạn có thể xem và xóa lịch sử đọc trực tiếp trên trang Lịch sử, hoặc gửi yêu cầu cho chúng tôi qua liên kết liên hệ bên dưới.",
          ],
        },
        {
          heading: "Trẻ em",
          paragraphs: [
            "Mỗi Ngày Một Đoạn dành cho bạn đọc phổ thông và không hướng tới trẻ em dưới 13 tuổi.",
            "Nếu bạn là phụ huynh hoặc người giám hộ và nhận thấy con em mình đã tạo tài khoản, xin liên hệ với chúng tôi qua liên kết liên hệ bên dưới để chúng tôi xóa tài khoản và dữ liệu liên quan.",
          ],
        },
        {
          heading: "Thay đổi chính sách này",
          paragraphs: [
            "Chính sách này có thể được cập nhật khi trang web có thay đổi. Ngày cập nhật ở đầu trang luôn cho biết phiên bản mới nhất, và những thay đổi đáng kể sẽ được thông báo trên trang web.",
            "Nếu bạn có câu hỏi hoặc góp ý về quyền riêng tư, xin gửi cho chúng tôi qua liên kết liên hệ bên dưới.",
          ],
        },
      ],
    },
    terms: {
      title: "Điều khoản sử dụng",
      description:
        "Điều khoản sử dụng Mỗi Ngày Một Đoạn: bản văn Kinh Thánh phạm vi công cộng, phần ghi chú tham khảo, mã nguồn mở MIT và cách chia sẻ nội dung.",
      updated: "2026-11-25",
      sections: [
        {
          heading: "Về trang web này",
          paragraphs: [
            "Mỗi Ngày Một Đoạn là trang đọc Kinh Thánh miễn phí, phi lợi nhuận, không quảng cáo và mở mã nguồn theo giấy phép MIT.",
            "Khi truy cập và sử dụng trang web, bạn đồng ý với các điều khoản ngắn gọn dưới đây.",
          ],
        },
        {
          heading: "Bản văn Kinh Thánh",
          paragraphs: [
            "Lời Kinh Thánh tiếng Việt trên trang là Bản Truyền Thống 1926 (Vietnamese Union Version), thuộc phạm vi công cộng, lấy nguồn từ eBible.org.",
            "Lời Kinh Thánh tiếng Anh trên trang là bản Berean Standard Bible (BSB), thuộc phạm vi công cộng, cũng lấy nguồn từ eBible.org.",
          ],
        },
        {
          heading: "Ghi chú, trang cảm xúc và hỗ trợ của AI",
          paragraphs: [
            "Các phần ghi chú từng đoạn và các trang đọc theo cảm xúc do trang web biên soạn nhằm hỗ trợ bạn đọc và suy ngẫm hằng ngày, có sự hỗ trợ một phần của AI và được con người rà soát.",
            "Những phần này không phải giáo lý chính thức và vẫn có thể có sai sót. Chúng tôi luôn khuyến khích bạn đọc trực tiếp nguyên văn Kinh Thánh và lắng nghe sự dạy dỗ của hội thánh mình.",
            "Nếu bạn phát hiện chỗ sai hoặc chưa chính xác, xin báo giúp chúng tôi trên GitHub qua liên kết liên hệ bên dưới.",
          ],
        },
        {
          heading: "Mã nguồn mở và chia sẻ nội dung",
          paragraphs: [
            "Mã nguồn của trang web được công bố theo giấy phép MIT trên GitHub (tinwritescode/moingaymotdoan).",
            "Ngoài bản văn Kinh Thánh thuộc phạm vi công cộng, bạn có thể thoải mái trích dẫn và chia sẻ lại các ghi chú cùng nội dung trang cảm xúc cho mục đích phi thương mại, kèm đường dẫn về trang Mỗi Ngày Một Đoạn.",
          ],
        },
        {
          heading: "Sử dụng đúng mực",
          paragraphs: [
            "Xin hãy sử dụng trang web một cách thiện chí và không lạm dụng hệ thống hay API của trang.",
            "Cụ thể, xin không chạy công cụ thu thập dữ liệu tự động gây quá tải, không tấn công kỹ thuật, và không tìm cách truy cập vào tài khoản của bạn đọc khác.",
          ],
        },
        {
          heading: "Không bảo đảm và giới hạn trách nhiệm",
          paragraphs: [
            "Trang web được cung cấp miễn phí theo hiện trạng sẵn có, không kèm cam kết bảo đảm nào. Trang web hoặc các tính năng có thể được thay đổi hoặc ngừng hoạt động bất cứ lúc nào.",
            "Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm đối với các thiệt hại gián tiếp phát sinh từ việc bạn sử dụng trang web.",
          ],
        },
        {
          heading: "Thay đổi điều khoản và luật áp dụng",
          paragraphs: [
            "Chúng tôi có thể cập nhật các điều khoản này khi cần thiết. Ngày cập nhật ở đầu trang luôn thể hiện phiên bản mới nhất, và việc bạn tiếp tục sử dụng trang web đồng nghĩa với việc đồng ý với bản cập nhật đó.",
            "Các điều khoản này được điều chỉnh theo pháp luật Việt Nam. Nếu bạn có câu hỏi, xin gửi cho chúng tôi qua liên kết liên hệ bên dưới.",
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      description:
        "How Mỗi Ngày Một Đoạn handles reading history locally or with an optional account — with no ads, no tracking, and simple ways to delete your data.",
      updated: "2026-11-25",
      sections: [
        {
          heading: "Reading without an account",
          paragraphs: [
            "You can read all Scripture passages, study notes, and mood guides on Mỗi Ngày Một Đoạn (One Chapter a Day) without creating an account.",
            "When you are not signed in, nothing is sent to our servers. Your reading history and display preferences (theme, font, and text size) are stored only in your browser's localStorage on your device.",
          ],
        },
        {
          heading: "When you sign in",
          paragraphs: [
            "Accounts are optional and let you sync reading progress across devices. Sign-in is handled through WorkOS AuthKit.",
            "WorkOS holds your email address, name, and avatar. Our own database never stores your email or name; it only stores your WorkOS user ID.",
            "When you sign in, your reading history syncs to our database (Postgres hosted on Neon) through a small API function (Neon Functions). For each account, we store which chapters and mood pages you read (book, chapter, and title), the dates and times you read them, your read count, and whether you marked them completed. On sign-in, the reading history saved in your browser is merged into your account.",
          ],
        },
        {
          heading: "How we use your data",
          paragraphs: [
            "We use your reading history for one purpose only: to show you your own reading history and progress across your devices.",
            "This site is free, non-profit, and ad-free. We do not run analytics or tracking scripts, send marketing emails, or sell or share your data with anyone.",
          ],
        },
        {
          heading: "Service providers",
          paragraphs: [
            "Three service providers help run the site: WorkOS (sign-in and authentication), Neon (database and API), and Vercel (static site hosting).",
            "Like any web host, Vercel may process standard web request data, such as your IP address, in order to serve pages to your browser.",
          ],
        },
        {
          heading: "Keeping and deleting your data",
          paragraphs: [
            "We keep your synced reading history until you delete it or ask us to delete your account.",
            "On the History page, you can delete individual entries or use “Clear all” to remove all of your reading history from both your browser and our server. Signing out stops syncing.",
            "To delete your account itself, please reach out through the contact link below. We will delete your WorkOS account along with any remaining reading history.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You have the right to access, correct, or delete your personal data, or withdraw your consent at any time.",
            "You can view and delete your reading history directly on the History page, or send us a request using the contact link below.",
          ],
        },
        {
          heading: "Children",
          paragraphs: [
            "This site is meant for general audiences and is not directed at children under 13.",
            "If you are a parent or guardian and believe your child has created an account, please contact us through the contact link below so we can remove the account and its history.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: [
            "We may update this policy from time to time. The last updated date at the top shows the latest version, and we will note meaningful changes on the site.",
            "If you have questions about your privacy or data, please write to us using the contact link below.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Use",
      description:
        "Terms for using Mỗi Ngày Một Đoạn: public-domain Scripture, devotional notes, MIT open-source code, non-commercial sharing, and acceptable use.",
      updated: "2026-11-25",
      sections: [
        {
          heading: "About this site",
          paragraphs: [
            "Mỗi Ngày Một Đoạn (One Chapter a Day) is a free, non-profit, ad-free Bible reading site released as open-source software under the MIT License.",
            "By visiting or using the site, you agree to these terms.",
          ],
        },
        {
          heading: "Scripture texts",
          paragraphs: [
            "The Vietnamese Scripture text is the 1926 Vietnamese Union Version (Bản Truyền Thống), in the public domain, sourced from eBible.org.",
            "The English Scripture text is the Berean Standard Bible (BSB), in the public domain, also sourced from eBible.org.",
          ],
        },
        {
          heading: "Study notes, mood pages, and AI assistance",
          paragraphs: [
            "The chapter notes and mood pages are written by the site for devotional help, partly with AI assistance and human review.",
            "They are not authoritative doctrine and may contain mistakes. We encourage you to read Scripture itself and rely on your church's teaching.",
            "If you spot an error, please report it via GitHub issues using the contact link below.",
          ],
        },
        {
          heading: "Open source and sharing content",
          paragraphs: [
            "The site's source code is licensed under the MIT License on GitHub (tinwritescode/moingaymotdoan).",
            "Outside the public-domain Scripture texts, you may freely quote and share our notes and mood pages for non-commercial use with a link back to the site.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: [
            "Please use the site respectfully and do not abuse its API or infrastructure.",
            "Do not run automated scraping that overloads the service, launch attacks, or try to access another reader's account.",
          ],
        },
        {
          heading: "No warranty and limitation of liability",
          paragraphs: [
            "The site is provided free of charge and “as is”, without warranty of any kind. We may change or stop the service at any time.",
            "To the extent the law allows, we are not liable for any indirect loss arising from your use of the site.",
          ],
        },
        {
          heading: "Changes and governing law",
          paragraphs: [
            "We may update these terms from time to time. The last updated date at the top shows the latest version, and continued use of the site means you accept the updated terms.",
            "These terms are governed by the laws of Vietnam. If you have questions, please reach out through the contact link below.",
          ],
        },
      ],
    },
  },
};
