import type { MoodDefinition } from "../types";

/** Nhóm 7: Gia đình, tình yêu & các mối quan hệ (14) · Nhóm 8: Công việc, khôn ngoan & định hướng sống (14). */
export const GIA_DINH_VA_DINH_HUONG: readonly MoodDefinition[] = [
  // === 7. Gia đình, tình yêu & các mối quan hệ (14) ===
  {
    slug: "yeu-thuong-hen-ho",
    title: "Đang yêu và tìm hiểu hôn nhân",
    groupId: "gia-dinh",
    prompt: "Khi đang rung động, hẹn hò và muốn xây dựng tình yêu lành mạnh.",
    intro:
      "Tình yêu đẹp nhất khi vừa có rung động chân thành vừa có sự tỉnh táo, tôn trọng và chung thủy. Những đoạn Kinh Thánh này giúp bạn phân biệt cảm xúc nhất thời với tình yêu bền vững theo năm tháng.",
    keywords: ["tình yêu", "hẹn hò", "người yêu", "tìm hiểu", "yêu đương"],
    passages: [
      {
        ref: "1 Cô-rinh-tô 13:4–7",
        note: "Thước đo rõ nhất của tình yêu thật: nhịn nhục, nhân từ, không ghen tương, không ích kỷ và luôn bảo vệ nhau.",
      },
      {
        ref: "Nhã-ca 8:6–7",
        note: "Tình yêu chân thật bền chặt như ấn đóng trên trái tim, nước lớn không dập tắt nổi và tiền bạc không thể mua được.",
      },
      {
        ref: "Châm-ngôn 4:23",
        note: "Giữ gìn tấm lòng cẩn thận trong giai đoạn tìm hiểu để cả hai cùng bước đi trong sự bình an và tôn trọng.",
      },
      {
        ref: "Truyền-đạo 4:9–10",
        note: "Một tình yêu lành mạnh là nơi hai người nâng đỡ nhau đứng dậy khi một người vấp ngã.",
      },
      {
        ref: "1 Giăng 3:18",
        note: "Trong giai đoạn hẹn hò, tình yêu lành mạnh không chỉ dừng ở những lời ngọt ngào mà được kiểm chứng qua từng việc làm chân thành và lẽ thật giữa hai bạn.",
      },
      {
        ref: "Hê-bơ-rơ 13:4",
        note: "Tôn trọng ranh giới trong sạch từ lúc tìm hiểu là cách bạn bày tỏ sự trân quý dành cho người mình yêu và xây nền vững chắc cho hôn nhân mai sau.",
      },
    ],
    prayer:
      "Lạy Cha của tình yêu chân thật, con tạ ơn Ngài vì những rung động ấm áp trong hành trình tìm hiểu này. Xin giữ tấm lòng hai chúng con luôn trong sạch, tỉnh táo và biết yêu nhau bằng hành động chân thành, tôn trọng dưới sự dẫn dắt của Chúa. A-men.",
  },
  {
    slug: "hon-nhan-vo-chong",
    title: "Xây dựng hôn nhân bền chặt",
    groupId: "gia-dinh",
    prompt: "Khi muốn nuôi dưỡng sự gắn bó, tôn trọng và ấm áp giữa vợ chồng.",
    intro:
      "Hôn nhân hạnh phúc không tự nhiên mà có; nó được xây mỗi ngày bằng hàng trăm cử chỉ nhường nhịn, lắng nghe và chung thủy. Lời Kinh Thánh vẽ nên hình ảnh hôn nhân đặt nền trên tình yêu biết hy sinh.",
    keywords: ["vợ chồng", "hôn nhân", "gia đình", "chung thủy", "bạn đời"],
    passages: [
      {
        ref: "Ê-phê-sô 5:25–33",
        note: "Chuẩn mực cao đẹp của vợ chồng: yêu thương hết lòng như chính thân thể mình và luôn giữ sự kính trọng lẫn nhau.",
      },
      {
        ref: "Sáng-thế Ký 2:24",
        note: "Hôn nhân là sự gắn bó mật thiết để hai con người đồng hành thành một mái nhà chung.",
      },
      {
        ref: "Truyền-đạo 4:12",
        note: "Một sợi dây bện ba khó đứt: khi có Chúa ở giữa kết nối hai vợ chồng, gia đình càng thêm bền vững.",
      },
      {
        ref: "1 Phi-e-rơ 3:7",
        note: "Sống chung với nhau bằng sự hiểu biết, dịu dàng và tôn trọng người bạn đời như người cùng hưởng ơn sự sống.",
      },
      {
        ref: "Cô-lô-se 3:18–19",
        note: "Phao-lô trao cho vợ và chồng mỗi người một phần, đặt cả hai dưới chữ “theo Chúa”, và dặn người chồng “chớ hề ở cay nghiệt với người”. Hôn nhân bền khi cả hai cùng sống dưới Chúa.",
      },
      {
        ref: "Châm-ngôn 31:10–12",
        note: "Hôn nhân bền vững được nuôi dưỡng bằng sự tin cậy lẫn nhau và tấm lòng luôn tìm điều ích lợi cho người bạn đời suốt chặng đường chung đôi của bạn.",
      },
    ],
    prayer:
      "Chúa ơi, tạ ơn Ngài đã kết nối vợ chồng con bước chung một mái nhà. Xin Ngài luôn làm sợi dây thứ ba bền chặt ở giữa gia đình con, dạy chúng con biết yêu thương hy sinh, nói lời dịu dàng và giữ trọn lòng thủy chung với nhau qua từng năm tháng. A-men.",
  },
  {
    slug: "hon-nhan-ran-nut",
    title: "Hôn nhân đang rạn nứt và khủng hoảng",
    groupId: "gia-dinh",
    prompt: "Khi vợ chồng xa cách, căng thẳng kéo dài hoặc đứng bên bờ đổ vỡ.",
    intro:
      "Khủng hoảng hôn nhân là nỗi đau âm ỉ và mệt mỏi nhất vì diễn ra ngay dưới mái nhà lẽ ra bình yên nhất. Đừng cố gồng một mình; hãy mang nỗi đau ấy trước mặt Chúa và tìm kiếm sự khiêm nhường, chữa lành từng bước.",
    keywords: ["khủng hoảng hôn nhân", "vợ chồng cãi nhau", "rạn nứt", "ly hôn", "lạnh nhạt"],
    passages: [
      {
        ref: "Cô-lô-se 3:12–14",
        note: "Bộ áo mới cho hôn nhân đang mệt mỏi: lòng thương xót, nhân từ, khiêm nhường, mềm mại, nhịn nhục và tình yêu thương gắn kết.",
      },
      {
        ref: "Ê-phê-sô 4:2–3",
        note: "Hòa khí gia đình cần sự hạ mình và nhịn nhục chịu đựng lẫn nhau trong tình yêu thương để gìn giữ dây liên kết bình an.",
      },
      {
        ref: "Ma-thi-ơ 19:6",
        note: "Lời nhắc về sự quý giá của giao ước hôn nhân, khích lệ hai người trân trọng và nỗ lực giữ gìn điều Chúa đã phối hợp.",
      },
      {
        ref: "1 Phi-e-rơ 4:8",
        note: "Tình yêu thương bền bỉ có sức che lấp và chữa lành vô số va chạm, thiếu sót hằng ngày.",
      },
      {
        ref: "Thi-thiên 127:1",
        note: "Khi sức người dường như không còn đủ để hàn gắn vết nứt dưới mái nhà mình, lời Thi-thiên mời bạn đặt lại hôn nhân mình trong bàn tay xây dựng và gìn giữ của Chúa.",
      },
      {
        ref: "Châm-ngôn 24:3–4",
        note: "Xây lại một mái ấm đang tổn thương cần nhiều hơn cảm xúc nhất thời; hãy xin Chúa ban cho bạn sự khôn ngoan, thông sáng và kiên nhẫn để từng bước chữa lành.",
      },
    ],
    prayer:
      "Lạy Cha thương xót, mái ấm của con lúc này đang đầy căng thẳng, tổn thương và khoảng cách khiến lòng con mỏi mệt lắm. Con chẳng đủ sức tự mình hàn gắn mọi rạn nứt; xin Chúa bước vào giữa gia đình con, ban lòng khiêm nhường, sự khôn ngoan và ơn chữa lành dịu dàng cho cả hai chúng con. A-men.",
  },
  {
    slug: "lam-cha-me",
    title: "Làm cha mẹ và nuôi dạy con cái",
    groupId: "gia-dinh",
    prompt: "Khi cần sự kiên nhẫn, khôn ngoan và dịu dàng trong vai trò cha mẹ.",
    intro:
      "Làm cha mẹ là hành trình vừa đầy niềm vui vừa đầy bối rối. Không ai làm cha mẹ hoàn hảo ngay từ đầu, nhưng Kinh Thánh chỉ ra hai cột trụ vững nhất: tình yêu kiên nhẫn và đời sống làm gương hằng ngày.",
    keywords: ["cha mẹ", "dạy con", "nuôi con", "con cái", "làm mẹ", "làm cha"],
    passages: [
      {
        ref: "Phục-truyền Luật-lệ Ký 6:6–7",
        note: "Giáo dục con tốt nhất không chỉ là những bài thuyết giảng, mà là trò chuyện tự nhiên khi ở nhà, lúc ra đường, buổi tối và sáng mai.",
      },
      {
        ref: "Ê-phê-sô 6:4",
        note: "Cân bằng rất tinh tế cho cha mẹ: nuôi dạy và khuyên bảo con vững vàng, nhưng đừng làm con tức giận hay tổn thương lòng.",
      },
      {
        ref: "Thi-thiên 127:3",
        note: "Giữa những ngày bận rộn mệt nhoài, nhớ lại con cái là cơ nghiệp và phần thưởng quý giá Đức Giê-hô-va trao phó.",
      },
      {
        ref: "Châm-ngôn 22:6",
        note: "Kiên trì uốn nắn con theo đường ngay thẳng ngay từ nhỏ sẽ đặt nền móng tốt cho cả hành trình trưởng thành.",
      },
      {
        ref: "2 Ti-mô-thê 1:5",
        note: "Đức tin chân thành truyền lại qua nếp sống dịu dàng mỗi ngày — như bà và mẹ của Ti-mô-thê đã gieo hạt giống đức tin, đời sống bạn cũng là bài học sống động nhất cho con.",
      },
      {
        ref: "Mác 10:13–16",
        note: "Giữa những lúc bận rộn dễ mất kiên nhẫn với con, hình ảnh Chúa Jêsus trìu mến bồng ẵm và chúc phước cho con trẻ nhắc bạn rằng mỗi đứa trẻ đều vô cùng quý giá trước mặt Ngài.",
      },
    ],
    prayer:
      "Kính lạy Cha trên trời, vai trò làm cha mẹ mang lại cho con nhiều niềm vui nhưng cũng lắm lúc bối rối và thiếu kiên nhẫn. Cảm ơn Chúa đã trao con cái như cơ nghiệp quý giá cho nhà con; xin ban cho con tình yêu dịu dàng, sự khôn ngoan và đời sống làm gương tốt đẹp mỗi ngày. A-men.",
  },
  {
    slug: "hieu-kinh-cha-me",
    title: "Hiếu kính và ứng xử với cha mẹ",
    groupId: "gia-dinh",
    prompt: "Khi muốn bày tỏ lòng biết ơn hoặc học cách yêu thương cha mẹ kiên nhẫn hơn.",
    intro:
      "Khoảng cách thế hệ đôi khi khiến việc trò chuyện với cha mẹ không dễ dàng. Trong Mười Điều Răn, điều răn hiếu kính cha mẹ là điều răn đầu tiên đi kèm lời hứa phước lành cho cuộc đời.",
    keywords: ["cha mẹ", "hiếu kính", "bố mẹ", "báo hiếu", "ông bà"],
    passages: [
      {
        ref: "Xuất Ê-díp-tô Ký 20:12",
        note: "Mạng lệnh nền tảng của gia đình: hiếu kính cha mẹ là gốc rễ của một đời sống bình an và lâu bền.",
      },
      {
        ref: "Ê-phê-sô 6:1–3",
        note: "Phao-lô nhắc lại lời hứa phước lành dành cho người con biết tôn trọng và hiếu thảo với đấng sinh thành.",
      },
      {
        ref: "Châm-ngôn 23:22",
        note: "Lắng nghe kinh nghiệm của cha và đừng khinh thường hay mất kiên nhẫn khi mẹ đã về già.",
      },
      {
        ref: "1 Ti-mô-thê 5:4",
        note: "Chăm sóc và đền đáp ơn sinh thành trong gia đình chính là biểu hiện đẹp lòng Đức Chúa Trời nhất.",
      },
      {
        ref: "Ru-tơ 1:16–17",
        note: "Tấm lòng thủy chung của Ru-tơ khi chọn ở lại chăm sóc mẹ chồng lúc khó khăn là gương sáng ấm áp nhắc bạn biết yêu thương cha mẹ không chỉ lúc thuận lợi.",
      },
      {
        ref: "Giăng 19:26–27",
        note: "Ngay trong giờ phút đau đớn nhất trên thập tự giá, Chúa Jêsus vẫn chu đáo gửi gắm mẹ mình cho môn đồ chăm lo — gương hiếu thảo ấy chạm sâu vào trái tim bạn.",
      },
    ],
    prayer:
      "Tạ ơn Chúa đã ban cho con đấng sinh thành để con có mặt trên đời hôm nay. Dù đôi lúc khoảng cách thế hệ khiến con thiếu kiên nhẫn, xin dạy con biết lắng nghe, nói lời tôn trọng và thể hiện lòng hiếu kính cha mẹ bằng sự chăm sóc chân thành mỗi ngày. A-men.",
  },
  {
    slug: "lo-cho-con-cai",
    title: "Lo lắng cho con cái đang đi lạc hướng",
    groupId: "gia-dinh",
    prompt: "Khi đau lòng vì con nổi loạn, sa sút hoặc rẽ sang con đường đáng lo.",
    intro:
      "Không nỗi lo nào day dứt bằng nỗi lo cho đứa con mình yêu thương đang tự làm hại mình. Khi lời khuyên của cha mẹ dường như không còn lọt tai, lời cầu nguyện kiên trì vẫn luôn chạm được tới nơi tay ta không với tới.",
    keywords: ["con hư", "lo cho con", "con đi lạc", "con cái bướng bỉnh"],
    passages: [
      {
        ref: "Lu-ca 15:17–20",
        note: "Người cha không tuyệt vọng đóng cửa nhà; ông kiên nhẫn chờ ngày con tỉnh ngộ và luôn sẵn sàng mở vòng tay đón con về.",
      },
      {
        ref: "Ê-sai 54:13",
        note: "Lời hứa an ủi để cha mẹ nắm giữ trong lời cầu nguyện: chính Đức Giê-hô-va sẽ dạy dỗ con cái và ban bình an lớn cho chúng.",
      },
      {
        ref: "Giê-rê-mi 31:16–17",
        note: "Lời an ủi cho tiếng khóc của người mẹ: hãy gạt nước mắt, công khó và lời cầu xin cho con vẫn còn niềm trông cậy.",
      },
      {
        ref: "Phi-líp 4:6–7",
        note: "Thay vì chìm trong lo âu và cằn nhằn vô ích, hãy trao con cái vào tay Đấng yêu chúng còn hơn cả cha mẹ trần gian.",
      },
      {
        ref: "1 Sa-mu-ên 1:27–28",
        note: "Khi bạn thấy mình không thể kiểm soát mọi lựa chọn của con, gương bà An-ne dâng con cho Chúa nhắc bạn rằng bàn tay Ngài luôn rộng và bền bỉ hơn bàn tay cha mẹ.",
      },
      {
        ref: "Ma-thi-ơ 15:22–28",
        note: "Tình thương của người mẹ Ca-na-an không bỏ cuộc khi nài xin Chúa cho con mình khích lệ bạn tiếp tục bền lòng cầu thay — ngay cả khi trước mắt chưa thấy con thay đổi.",
      },
    ],
    prayer:
      "Ôi Chúa yêu thương con cái con hơn cả chính con yêu chúng, nhìn con cái mình đi lạc hướng khiến lòng làm cha mẹ của con đau nhói từng ngày. Khi lời khuyên của con chẳng còn đến được tai con mình, xin Chúa chạm đến tấm lòng con trẻ và dắt nó quay về trong bình an của Ngài. A-men.",
  },
  {
    slug: "tinh-ban-chan-thanh",
    title: "Trân trọng và tìm kiếm tình bạn chân thành",
    groupId: "gia-dinh",
    prompt: "Khi biết ơn bạn tốt hoặc mong có những người bạn thật lòng bên cạnh.",
    intro:
      "Một người bạn thật sự — dám nói lời thẳng thắn khi ta sai và ngồi cạnh ta khi trời sụp đổ — là món quà vô giá. Sách Châm-ngôn dành nhiều câu rất sâu sắc để nói về cách giữ và trở thành một người bạn tốt.",
    keywords: ["tình bạn", "bạn thân", "bạn bè", "tri kỷ", "đồng hành"],
    passages: [
      {
        ref: "Châm-ngôn 17:17",
        note: "Bạn hữu chân thật yêu thương trong mọi lúc, và khi cơn hoạn nạn ập đến họ đứng bên như anh em ruột thịt.",
      },
      {
        ref: "Châm-ngôn 27:17",
        note: "Như sắt mài nhọn sắt, những người bạn tốt giúp nhau trưởng thành và sắc bén hơn mỗi ngày.",
      },
      {
        ref: "Châm-ngôn 18:24",
        note: "Số lượng quen biết nhiều không bằng một người bạn gắn bó trung tín hơn cả anh em.",
      },
      {
        ref: "Giăng 15:13",
        note: "Đỉnh cao của tình bạn là lòng sẵn sàng đặt lợi ích của bạn mình lên trên sự ích kỷ cá nhân.",
      },
      {
        ref: "1 Sa-mu-ên 23:16",
        note: "Giữa lúc Đa-vít trốn chạy đơn độc trong rừng, người bạn thân Giô-na-than đã tìm đến giúp ông vững lòng nơi Chúa — đó là hình mẫu đẹp nhất của một tình bạn nâng đỡ mà bạn có thể vừa tìm kiếm vừa trao đi.",
      },
      {
        ref: "Rô-ma 12:10",
        note: "Tình bạn sâu bền được xây trên sự chân thành, ấm áp và thái độ tôn trọng lẫn nhau — bắt đầu từ chính cách bạn chủ động yêu thương người quanh mình.",
      },
    ],
    prayer:
      "Thưa Cha, cảm ơn Ngài vì những người bạn chân thành Ngài đặt vào cuộc đời con để cùng sẻ chia lúc vui cũng như khi gian nan. Xin dạy con trước hết biết trở thành một người bạn trung tín, biết lắng nghe và nâng đỡ người khác vững lòng hơn nơi Chúa. A-men.",
  },
  {
    slug: "song-trong-cong-dong",
    title: "Muốn gắn kết trong cộng đồng và Hội Thánh",
    groupId: "gia-dinh",
    prompt: "Khi thấy mình cần thuộc về một cộng đồng nâng đỡ và chia sẻ đức tin.",
    intro:
      "Con người được dựng nên để sống trong sự tương giao, không phải đơn độc một mình. Dẫu cộng đồng nào cũng có người bất toàn, bước vào sự gắn kết chân thành giúp ta vừa được nâng đỡ vừa học cách yêu thương.",
    keywords: ["cộng đồng", "Hội Thánh", "nhóm nhỏ", "thông công", "gắn kết"],
    passages: [
      {
        ref: "Hê-bơ-rơ 10:24–25",
        note: "Gặp gỡ và khích lệ nhau thường xuyên giúp giữ ngọn lửa yêu thương và việc lành không bị nguội đi.",
      },
      {
        ref: "Thi-thiên 133:1",
        note: "Anh em sống hòa thuận và hiệp nhất với nhau là cảnh tượng đẹp đẽ và tươi mát biết bao.",
      },
      {
        ref: "1 Cô-rinh-tô 12:26–27",
        note: "Trong một thân thể chung, khi một người đau thì cả tập thể cùng chia sẻ, một người vui thì mọi người cùng mừng.",
      },
      {
        ref: "Công-vụ các Sứ-đồ 2:42–47",
        note: "Hình ảnh ấm áp của cộng đồng đầu tiên: cùng học lời Chúa, chia sẻ bữa ăn, cầu nguyện và quan tâm người thiếu thốn.",
      },
      {
        ref: "Truyền-đạo 4:9–10",
        note: "Đức tin không được dựng nên để đi một mình: “Nếu người này sa ngã, thì người kia sẽ đỡ bạn mình lên”. Tìm một cộng đồng là cho mình chỗ được đỡ dậy và cơ hội đỡ người khác.",
      },
      {
        ref: "Cô-lô-se 3:16",
        note: "Khi cùng anh chị em học Lời Chúa, khích lệ nhau và chung tiếng hát ngợi khen, đức tin của bạn được nuôi dưỡng sâu hơn rất nhiều so với việc đi một mình.",
      },
    ],
    prayer:
      "Lạy Chúa là Đầu của Hội Thánh, con biết mình không được dựng nên để bước đi đức tin một mình. Xin dẫn con đến một cộng đồng chân thành, giúp con mở lòng đón nhận anh chị em dù ai cũng có bất toàn, để chúng con cùng nhau gây dựng trong tình yêu thương Ngài. A-men.",
  },
  {
    slug: "dat-ranh-gioi",
    title: "Học cách đặt ranh giới lành mạnh",
    groupId: "gia-dinh",
    prompt: "Khi hay cả nể, khó nói lời từ chối hoặc bị cuốn vào mối quan hệ độc hại.",
    intro:
      "Yêu thương theo Kinh Thánh không đồng nghĩa với việc để người khác mặc sức lợi dụng hay lôi mình vào đường xấu. Ngay cả Chúa Jêsus cũng thường xuyên tách khỏi đám đông để giữ nhịp sống lành mạnh và trung thành với sứ mạng.",
    keywords: ["ranh giới", "từ chối", "cả nể", "mối quan hệ độc hại", "tự bảo vệ"],
    passages: [
      {
        ref: "Châm-ngôn 4:23",
        note: "Hơn hết mọi sự, hãy gìn giữ tấm lòng mình — bởi ranh giới lành mạnh bảo vệ mạch sống bên trong bạn.",
      },
      {
        ref: "1 Cô-rinh-tô 15:33",
        note: "Đừng tự lừa mình: gắn bó quá sâu với những ảnh hưởng xấu sẽ dần bào mòn lối sống tốt đẹp.",
      },
      {
        ref: "Ma-thi-ơ 5:37",
        note: "Chúa dạy nói thẳng thắn “phải, phải; không, không” — sự rõ ràng, chân thật ấy giúp bạn đặt ranh giới lành mạnh mà không rơi vào vòng cả nể.",
      },
      {
        ref: "Lu-ca 5:15–16",
        note: "Dù nhu cầu của đám đông rất lớn, Chúa Jêsus vẫn chủ động rút lui vào nơi thanh vắng để cầu nguyện và giữ quân bình.",
      },
      {
        ref: "Nê-hê-mi 6:2–3",
        note: "Khi bị lôi kéo rời khỏi điều quan trọng, Nê-hê-mi không né tránh hay giải thích dài dòng mà từ chối rất dứt khoát — bạn cũng có quyền nói không để bảo vệ sứ mạng và sự bình an của mình.",
      },
      {
        ref: "Ga-la-ti 6:5",
        note: "Kinh Thánh dạy nâng đỡ nhau lúc ngã gục, nhưng cũng nhắc mỗi người phải chịu trách nhiệm cho phần đời riêng mình — nhận rõ ranh giới ấy giúp bạn giúp người đúng cách mà không tự kiệt sức.",
      },
    ],
    prayer:
      "Xin Chúa ban cho con sự sáng suốt và can đảm để biết nhận lời với điều đúng đắn và thẳng thắn từ chối những đòi hỏi làm kiệt sức hay kéo lòng con đi lệch hướng. Xin giúp con gìn giữ tấm lòng mình bằng những ranh giới lành mạnh, dịu dàng mà vững vàng. A-men.",
  },
  {
    slug: "doc-than-cho-doi",
    title: "Sống độc thân và chờ đợi người phù hợp",
    groupId: "gia-dinh",
    prompt: "Khi sống một mình, đôi lúc chạnh lòng nhưng muốn trân trọng mùa hiện tại.",
    intro:
      "Độc thân không phải là 'phòng chờ' thiếu trọn vẹn trước hôn nhân. Kinh Thánh xem đây là một giai đoạn quý giá để sống sâu sắc, tự do phục vụ và vun đắp nền tảng vững chắc trước khi đồng hành cùng ai đó.",
    keywords: ["độc thân", "chưa kết hôn", "ế", "chờ người phù hợp", "sống một mình"],
    passages: [
      {
        ref: "1 Cô-rinh-tô 7:32–35",
        note: "Phao-lô nhìn thấy vẻ đẹp riêng của đời sống độc thân: sự tự do rộng rãi để dốc lòng cho những điều ý nghĩa.",
      },
      {
        ref: "Thi-thiên 37:4",
        note: "Tìm niềm vui trọn vẹn nơi Đức Giê-hô-va giúp trái tim không còn nôn nóng tìm kiếm sự lấp đầy sai chỗ.",
      },
      {
        ref: "Nhã-ca 8:4",
        note: "Lời nhắc tinh tế: đừng vội khuấy động tình yêu khi chưa đúng thời điểm chín muồi.",
      },
      {
        ref: "Thi-thiên 84:11",
        note: "Đức Giê-hô-va không bao giờ giữ lại điều tốt lành nào cho những người bước đi ngay thẳng.",
      },
      {
        ref: "1 Cô-rinh-tô 7:7",
        note: "Độc thân hay có đôi đều không phải hạng nhì trước mặt Chúa: “mỗi người đã được ban riêng cho mình bởi Đức Chúa Trời”. Mùa hiện tại của bạn có giá trị riêng, dù bạn còn đang chờ đợi.",
      },
      {
        ref: "1 Ti-mô-thê 4:12",
        note: "Mùa độc thân hôm nay không phải quãng thời gian bị bỏ trống; bạn có thể sống thật trọn vẹn, trưởng thành trong tình yêu thương, đức tin và nếp sống trong sạch.",
      },
    ],
    prayer:
      "Cha ơi, sống một mình đôi lúc khiến con thấy chạnh lòng, nhất là khi xung quanh ai cũng có đôi có cặp. Xin giúp con không nóng vội tìm kiếm sai chỗ, nhưng biết tận hưởng sự tự do trong mùa hiện tại, trau dồi đời sống đẹp ý Ngài và tin cậy kỳ định tốt lành của Chúa. A-men.",
  },
  {
    slug: "lam-nguoi-hoa-giai",
    title: "Muốn hàn gắn và làm người hòa giải",
    groupId: "gia-dinh",
    prompt: "Khi muốn nối lại mối quan hệ rạn nứt hoặc giúp hai bên hiểu nhau hơn.",
    intro:
      "Phá vỡ một mối quan hệ chỉ mất vài giây nóng giận, còn xây lại nhịp cầu hòa giải đòi hỏi rất nhiều can đảm và khiêm nhường. Chúa Jêsus gọi những người làm hòa giải là con của Đức Chúa Trời.",
    keywords: ["hòa giải", "hàn gắn", "làm hòa", "xin lỗi", "nối lại"],
    passages: [
      {
        ref: "Ma-thi-ơ 5:9",
        note: "Người chủ động xây nhịp cầu hòa bình giữa những rạn nứt mang đậm hình ảnh của Đức Chúa Trời.",
      },
      {
        ref: "2 Cô-rinh-tô 5:18–19",
        note: "Vì chính ta đã được Đức Chúa Trời làm hòa lại với Ngài, nên ta cũng nhận lấy sứ mạng mang sự hòa giải đến quanh mình.",
      },
      {
        ref: "Gia-cơ 3:18",
        note: "Bông trái của sự công bình chỉ nảy nở tốt tươi khi được gieo trồng bởi những bàn tay biết gìn giữ hòa bình.",
      },
      {
        ref: "Châm-ngôn 12:20",
        note: "Người khuyên giải đem lại bình an luôn gặt hái niềm vui sâu bền trong lòng.",
      },
      {
        ref: "Sáng-thế Ký 13:8–9",
        note: "Để giữ tình thân khỏi đổ vỡ, Áp-ram sẵn sàng nhường quyền chọn trước cho Lót — đôi khi bước đầu tiên để bạn hàn gắn một mối quan hệ chính là chịu thiệt một chút về mình.",
      },
      {
        ref: "Rô-ma 14:19",
        note: "Hòa giải không tự xảy ra khi hai bên cứ ngồi đợi nhau mở lời trước; Phao-lô khích lệ bạn chủ động tìm kiếm điều xây dựng hòa thuận và gây dựng nhau.",
      },
    ],
    prayer:
      "Lạy Cha đã làm hòa lại với con nhờ Đấng Christ, con mong được trở thành nhịp cầu mang sự bình an đến giữa những rạn nứt quanh mình. Xin ban cho con tấm lòng khiêm nhường biết nhường nhịn, lời nói chín chắn và can đảm để chủ động hàn gắn điều đã đổ vỡ. A-men.",
  },
  {
    slug: "an-ui-nguoi-dau-kho",
    title: "Muốn an ủi người đang đau khổ",
    groupId: "gia-dinh",
    prompt: "Khi bạn bè hay người thân gặp hoạn nạn và bạn không biết nói gì cho phải.",
    intro:
      "Khi người thương đang đau buồn, nhiều khi họ không cần một bài giảng giải thích nguyên nhân, mà cần một người sẵn sàng ngồi im lặng và khóc cùng họ. Kinh Thánh dạy nghệ thuật an ủi rất nhân hậu này.",
    keywords: ["an ủi", "động viên", "chia buồn", "sẻ chia", "nâng đỡ"],
    passages: [
      {
        ref: "Rô-ma 12:15",
        note: "Cách đồng cảm chân thành nhất: hãy vui với kẻ vui và khóc với kẻ khóc.",
      },
      {
        ref: "Gióp 2:13",
        note: "Điều tốt đẹp nhất ba người bạn của Gióp làm được là ngồi im lặng bên cạnh ông suốt bảy ngày vì thấy nỗi đau ông quá lớn.",
      },
      {
        ref: "2 Cô-rinh-tô 1:3–4",
        note: "Chính những lần bạn từng được Chúa an ủi trong quá khứ trang bị cho bạn tấm lòng dịu dàng để nâng đỡ người khác hôm nay.",
      },
      {
        ref: "Châm-ngôn 16:24",
        note: "Lời nói dịu dàng, chân thành giống như mật ngọt êm tai và đem lại sức sống cho tinh thần người mệt mỏi.",
      },
      {
        ref: "Ê-sai 50:4",
        note: "Trước khi vội nói điều gì để an ủi người thương đang đau khổ, bạn có thể lắng nghe Chúa dạy dỗ trước để biết trao ra đúng lời dịu dàng nâng đỡ kẻ mệt mỏi.",
      },
      {
        ref: "1 Tê-sa-lô-ni-ca 5:11",
        note: "Đôi khi bạn không cần giải quyết hộ mọi vấn đề của bạn mình; chỉ cần sự hiện diện kiên trì và lời nâng đỡ chân thành cũng đủ tiếp thêm hơi ấm cho họ đi qua ngày khó.",
      },
    ],
    prayer:
      "Chúa của mọi sự yên ủi ơi, thấy người con thương đang chịu đau buồn mà con lúng túng chẳng biết nói gì cho phải. Xin dạy con biết ngồi lắng nghe cách kiên nhẫn, biết khóc cùng họ và đặt vào môi miệng con lời dịu dàng, đúng lúc để nâng đỡ tâm hồn họ. A-men.",
  },
  {
    slug: "nguoi-than-chua-tin",
    title: "Sống giữa người thân chưa cùng đức tin",
    groupId: "gia-dinh",
    prompt: "Khi yêu thương gia đình nhưng khác biệt đức tin và không biết chia sẻ sao.",
    intro:
      "Muốn người mình yêu thương nhận biết Chúa là tấm lòng rất đẹp, nhưng tranh cãi gay gắt thường chỉ đẩy họ ra xa hơn. Kinh Thánh chỉ ra con đường mềm mại mà có sức thuyết phục mạnh nhất: sống một đời sống tử tế, hiền hòa và cầu nguyện bền bỉ.",
    keywords: ["gia đình chưa tin", "truyền giáo gia đình", "khác tôn giáo", "người thân"],
    passages: [
      {
        ref: "1 Phi-e-rơ 3:1–2",
        note: "Đôi khi không cần nhiều lời thuyết phục; chính nếp sống ngay thẳng, dịu dàng và tôn trọng lại chạm đến lòng người thân sâu nhất.",
      },
      {
        ref: "Cô-lô-se 4:5–6",
        note: "Lời nói có ân hậu và nêm thêm chút muối khôn ngoan giúp mọi cuộc trò chuyện trở nên ấm áp, dễ lắng nghe.",
      },
      {
        ref: "1 Cô-rinh-tô 3:6–7",
        note: "Phần của ta là gieo hạt bằng tình yêu và cầu nguyện; còn việc làm hạt giống nảy mầm thuộc về Đức Chúa Trời.",
      },
      {
        ref: "Ma-thi-ơ 5:16",
        note: "Hãy để những việc lành bình dị hằng ngày tỏa sáng tự nhiên ngay trong mái nhà mình.",
      },
      {
        ref: "Châm-ngôn 3:3–4",
        note: "Sống giữa gia đình chưa cùng niềm tin, chính sự nhân từ và chân thật nhất quán trong cách ăn ở của bạn sẽ mở cánh cửa cảm tình tự nhiên hơn mọi lời tranh luận.",
      },
      {
        ref: "1 Sa-mu-ên 12:23",
        note: "Khi chưa có cơ hội chia sẻ nhiều bằng lời nói, bạn vẫn có thể âm thầm yêu thương người thân bằng sự cầu nguyện bền bỉ và không ngừng nghỉ trước mặt Chúa.",
      },
    ],
    prayer:
      "Lạy Chúa giàu ân điển, con rất yêu thương gia đình mình và ao ước người thân cũng nếm biết tình yêu bình an của Ngài. Xin giúp con không tranh cãi nóng vội, mà biết kiên trì cầu nguyện, sống nhân từ chân thật mỗi ngày để ánh sáng Chúa tỏa ra tự nhiên ngay trong nhà con. A-men.",
  },
  {
    slug: "chia-ly-tien-biet",
    title: "Chia ly và tiễn biệt người thương đi xa",
    groupId: "gia-dinh",
    prompt: "Khi phải nói lời tạm biệt người thân hay bạn quý lên đường sang phương xa.",
    intro:
      "Những cuộc chia tay luôn mang theo bịn rịn và lo lắng cho chặng đường của người đi xa. Lời chúc phước từ Kinh Thánh trao người bạn thương vào sự gìn giữ chung của một bầu trời bình an.",
    keywords: ["chia tay", "tiễn biệt", "đi xa", "tạm biệt", "lên đường"],
    passages: [
      {
        ref: "Dân-số Ký 6:24–26",
        note: "Lời chúc phước cổ xưa và đẹp nhất Kinh Thánh để trao gửi trước lúc chia xa: nguyện Chúa gìn giữ và ban bình an.",
      },
      {
        ref: "Phi-líp 1:3–5",
        note: "Khoảng cách địa lý không làm phai nhạt tình thân: mỗi khi nhớ đến nhau là một lần tạ ơn Chúa.",
      },
      {
        ref: "Sáng-thế Ký 31:49",
        note: "Lời cầu chúc khi hai người không còn ở gần: nguyện Đức Giê-hô-va trông nom đôi bên khi chúng ta cách mặt nhau.",
      },
      {
        ref: "Thi-thiên 121:7–8",
        note: "Gửi gắm từng bước đi và về của người thương trong sự bảo vệ bình an của Chúa.",
      },
      {
        ref: "Công-vụ các Sứ-đồ 20:32",
        note: "Khi đến lúc không thể đi cạnh nhau trên cùng một con đường nữa, lời tiễn biệt sâu lắng nhất của Phao-lô nhắc bạn trao gửi người thương vào tay Đức Chúa Trời và ân điển Ngài.",
      },
      {
        ref: "2 Cô-rinh-tô 13:11",
        note: "Lời chào tiễn biệt ấm áp để bạn gửi theo người lên đường: dù cách xa phương trời, Đức Chúa Trời của tình yêu thương và bình an vẫn đồng hành cùng cả hai bên.",
      },
    ],
    prayer:
      "Lạy Cha gìn giữ mọi nẻo đường, phút chia tay tiễn người thương đi xa khiến lòng con bịn rịn và lo lắng nhiều điều. Con xin giao phó người con yêu quý vào bàn tay che chở của Ngài; xin chiếu sáng mặt Chúa trên từng bước họ đi và giữ tình thân chúng con luôn ấm áp dù cách xa. A-men.",
  },

  // === 8. Công việc, khôn ngoan & định hướng sống (14) ===
  {
    slug: "can-su-khon-ngoan",
    title: "Cần sự khôn ngoan để quyết định",
    groupId: "dinh-huong",
    prompt: "Khi đứng trước bài toán khó và cần cái nhìn sáng suốt, thấu đáo.",
    intro:
      "Thông minh giúp ta phân tích dữ liệu, nhưng khôn ngoan giúp ta chọn điều đúng đắn và bền lâu. Điều tuyệt vời là Kinh Thánh hứa Đức Chúa Trời ban sự khôn ngoan cách rộng rãi cho bất cứ ai khiêm nhường cầu xin.",
    keywords: ["khôn ngoan", "quyết định", "sáng suốt", "băn khoăn", "phân định"],
    passages: [
      {
        ref: "Gia-cơ 1:5",
        note: "Lời hứa trực tiếp nhất khi thiếu sáng suốt: cứ cầu xin Đức Chúa Trời, Đấng ban cho mọi người cách rộng rãi không trách móc.",
      },
      {
        ref: "Châm-ngôn 9:10",
        note: "Khởi đầu của mọi sự khôn ngoan thật sự nằm ở lòng kính sợ và biết mình đứng trước Đức Chúa Trời.",
      },
      {
        ref: "Châm-ngôn 15:22",
        note: "Đừng vội quyết định một mình khi còn mơ hồ; lắng nghe nhiều người mưu luận chín chắn giúp kế hoạch vững vàng hơn.",
      },
      {
        ref: "Gia-cơ 3:17",
        note: "Dấu hiệu nhận ra sự khôn ngoan thật từ trời: trước hết là thanh sạch, sau lại hòa thuận, nhân từ, đầy lòng thương xót và không giả dối.",
      },
      {
        ref: "1 Các Vua 3:9",
        note: "Khi đứng trước quyết định lớn vượt quá tầm hiểu biết của mình, Sa-lô-môn không xin giàu sang mà xin một tấm lòng khôn sáng để phân biệt điều lành dữ — bạn cũng có thể xin đúng điều ấy.",
      },
      {
        ref: "Thi-thiên 90:12",
        note: "Ý thức rõ thời gian đời người có hạn giúp bạn gạn lọc điều thật sự đáng chọn, thay vì bị cuốn theo những bận tâm ngắn hạn.",
      },
    ],
    prayer:
      "Lạy Cha giàu sự khôn ngoan, trước bài toán khó này con thấy tầm nhìn của mình còn hạn hẹp quá. Con khiêm nhường cầu xin Ngài ban tấm lòng sáng suốt để phân biệt điều phải lẽ, biết lắng nghe lời khuyên chín chắn và chọn con đường bình an lâu dài. A-men.",
  },
  {
    slug: "tim-muc-dich-song",
    title: "Tìm ý nghĩa và mục đích cuộc đời",
    groupId: "dinh-huong",
    prompt: "Khi tự hỏi mình sống để làm gì và điều gì thật sự đáng dành cả đời.",
    intro:
      "Câu hỏi về ý nghĩa cuộc đời thường vang lên rõ nhất vào những buổi tối yên tĩnh hay sau một cột mốc lớn. Kinh Thánh đặt đời sống bạn vào một bức tranh rộng lớn hơn nhiều so với vòng quay cơm áo thường ngày.",
    keywords: ["mục đích sống", "ý nghĩa cuộc đời", "sứ mệnh", "lẽ sống", "tôi là ai"],
    passages: [
      {
        ref: "Ê-phê-sô 2:10",
        note: "Đời bạn có thiết kế và chủ ý: được dựng nên để bước đi trong những việc lành tốt đẹp đã chuẩn bị sẵn.",
      },
      {
        ref: "Truyền-đạo 12:13",
        note: "Sau khi thử hết giàu sang, danh vọng và lạc thú, tác giả rút gọn ý nghĩa cốt lõi nhất: kính sợ Đức Chúa Trời và giữ các điều răn Ngài.",
      },
      {
        ref: "Ma-thi-ơ 22:37–39",
        note: "Chúa Jêsus gói gọn mục đích sống đẹp nhất thành hai mũi tên đơn sơ: hết lòng yêu Đức Chúa Trời và yêu người lân cận như mình.",
      },
      {
        ref: "Rô-ma 12:1–2",
        note: "Đổi mới tâm trí để nhận biết ý muốn tốt lành, đẹp lòng và trọn vẹn của Chúa trên chính đời sống thường ngày.",
      },
      {
        ref: "1 Cô-rinh-tô 10:31",
        note: "Mục đích sống không chỉ nằm ở những việc thật to lớn; ngay cả bữa ăn, công việc thường ngày hay cử chỉ nhỏ của bạn đều trở nên đầy ý nghĩa khi làm để tôn vinh Đức Chúa Trời.",
      },
      {
        ref: "Thi-thiên 138:8",
        note: "Bạn không phải tự vẽ ra ý nghĩa cho đời mình từ con số không; tác giả Thi-thiên tin chắc chính Đức Giê-hô-va sẽ làm trọn công việc Ngài đã định cho đời bạn.",
      },
    ],
    prayer:
      "Đức Chúa Trời dựng nên đời con ơi, có những lúc con dừng lại tự hỏi mình đang sống vì điều gì và điều nào thật sự bền vững. Xin soi sáng tâm trí con để con thấy rõ mục đích Ngài đặt trong đời con, sống hết lòng yêu Chúa và yêu người quanh con mỗi ngày. A-men.",
  },
  {
    slug: "chan-nan-cong-viec",
    title: "Chán nản và mất lửa trong công việc",
    groupId: "dinh-huong",
    prompt: "Khi công việc lặp đi lặp lại nhàm chán, áp lực sếp hay thiếu động lực đi làm.",
    intro:
      "Phần lớn thời gian tỉnh thức của đời người gắn liền với công việc. Thay đổi góc nhìn về người mình đang thật sự phục vụ có thể thổi một luồng gió mới vào ngay cả những việc tưởng chừng bình thường nhất.",
    keywords: ["công việc", "đi làm", "chán việc", "văn phòng", "đồng nghiệp"],
    passages: [
      {
        ref: "Cô-lô-se 3:23–24",
        note: "Bất kỳ công việc lương thiện nào, khi làm hết lòng như làm cho Chúa chứ không chỉ để đối phó với sếp, đều mang giá trị cao quý.",
      },
      {
        ref: "Truyền-đạo 9:10",
        note: "Làm trọn vẹn hết sức điều tay mình đang cầm hôm nay đem lại niềm tự trọng và chiều sâu cho công việc.",
      },
      {
        ref: "Châm-ngôn 14:23",
        note: "Mọi công khó chăm chỉ đều sinh ra ích lợi thật, còn chỉ ngồi than thở nói suông chỉ dẫn đến thiếu thốn.",
      },
      {
        ref: "Thi-thiên 90:17",
        note: "Lời cầu nguyện mỗi sáng thứ Hai: xin Chúa làm vững bền và đặt ý nghĩa lâu dài trên công việc tay bạn làm.",
      },
      {
        ref: "Sáng-thế Ký 2:15",
        note: "Công việc vốn không phải hình phạt nhàm chán; ngay từ vườn Ê-đen, Chúa đã trao việc trồng và giữ cho con người — nhắc bạn rằng lao động chân chính luôn mang phẩm giá đẹp đẽ.",
      },
      {
        ref: "2 Tê-sa-lô-ni-ca 3:13",
        note: "Giữa những ngày làm việc lặp đi lặp lại dễ khiến bạn ngán ngẩm, lời nhắn ngắn gọn này tiếp thêm động lực để bạn không nản lòng trong việc làm điều ích lợi mỗi ngày.",
      },
    ],
    prayer:
      "Chúa ơi, nhịp công việc lặp đi lặp lại và áp lực nơi làm việc khiến con thấy cạn hứng thú và chỉ muốn cho qua ngày. Xin đổi mới tấm lòng con để con biết làm mọi việc lương thiện bằng sự tận tâm như đang làm cho Chúa, và tìm lại niềm vui trong công khó hôm nay. A-men.",
  },
  {
    slug: "buoc-ra-vung-an-toan",
    title: "Can đảm bước ra khỏi vùng an toàn",
    groupId: "dinh-huong",
    prompt: "Khi đứng trước cơ hội mới, thử thách mới nhưng còn ngần ngại sợ thay đổi.",
    intro:
      "Ở yên chỗ cũ thì quen thuộc, nhưng chẳng hạt giống nào nảy mầm nếu sợ rời khỏi vỏ. Khi Áp-ra-ham và Giô-suê bước vào vùng đất chưa biết, điều họ mang theo không phải sự chắc chắn tuyệt đối mà là lời hứa Chúa đi cùng.",
    keywords: ["can đảm", "vùng an toàn", "khởi nghiệp", "thay đổi", "mạo hiểm"],
    passages: [
      {
        ref: "Giô-suê 1:9",
        note: "Mạnh mẽ và vững lòng không phải vì đường phía trước dễ dàng, mà vì Đức Giê-hô-va đồng hành trong từng bước.",
      },
      {
        ref: "Hê-bơ-rơ 11:8",
        note: "Áp-ra-ham đã vâng lời lên đường dù chưa biết hết mọi chi tiết phía trước — đức tin thường sáng tỏ nhất khi ta bắt đầu bước đi.",
      },
      {
        ref: "Ê-xơ-tê 4:14",
        note: "Câu hỏi lay động của Mạc-đô-chê: biết đâu chính vì thời cơ này mà bạn được đặt vào vị trí hôm nay?",
      },
      {
        ref: "2 Ti-mô-thê 1:7",
        note: "Vượt qua sự rụt rè bằng tinh thần mạnh mẽ, tình yêu thương và sự tỉnh táo Chúa ban.",
      },
      {
        ref: "Sáng-thế Ký 12:1–2",
        note: "Chúa không đưa cho Áp-ram tấm bản đồ chi tiết trước khi ông lên đường, chỉ trao lời hứa sẽ làm ông thành nguồn phước — bước chân tin cậy đầu tiên của bạn cũng mở ra những chân trời mới như thế.",
      },
      {
        ref: "Ma-thi-ơ 14:28–31",
        note: "Phi-e-rơ dám bước xuống khi nghe Chúa gọi; lúc thấy gió mà chao đảo, ông kêu “Chúa ơi, xin cứu lấy tôi!” và Chúa “giơ tay ra nắm lấy người”. Bước ra không đòi bạn chẳng bao giờ chao đảo.",
      },
    ],
    prayer:
      "Lạy Chúa là Đấng kêu gọi con bước tới, đứng trước cơ hội và thay đổi mới lòng con vừa háo hức vừa e ngại không dám rời chỗ quen thuộc. Xin cất đi sự rụt rè trong con, ban tinh thần sáng suốt cùng lòng can đảm để con đặt bước chân tin cậy đầu tiên theo sự dẫn dắt của Ngài. A-men.",
  },
  {
    slug: "quan-ly-tien-bac",
    title: "Quản lý tiền bạc khôn ngoan và rộng rãi",
    groupId: "dinh-huong",
    prompt: "Khi muốn giữ cân bằng giữa tiết kiệm, chi tiêu khôn ngoan và sẻ chia.",
    intro:
      "Kinh Thánh nói về tiền bạc nhiều hơn hầu hết các chủ đề thực tế khác — không phải vì Chúa cần tiền của ta, mà vì cách ta dùng tiền phản chiếu rõ nhất trái tim ta đang đặt ở đâu.",
    keywords: ["tài chính", "tiết kiệm", "quản lý tiền", "rộng rãi", "dâng hiến", "chia sẻ"],
    passages: [
      {
        ref: "Châm-ngôn 21:20",
        note: "Người khôn ngoan biết dành dụm và chuẩn bị có kế hoạch, thay vì tiêu sạch mọi thứ vừa có trong tay.",
      },
      {
        ref: "2 Cô-rinh-tô 9:6–8",
        note: "Lòng rộng rãi vui vẻ không làm ta nghèo đi; ngược lại, nó mở lòng ta ra với niềm vui sẻ chia dư dật.",
      },
      {
        ref: "Lu-ca 16:10",
        note: "Sự trung tín và kỷ luật bắt đầu ngay từ những khoản tiền nhỏ hằng ngày.",
      },
      {
        ref: "Châm-ngôn 11:24–25",
        note: "Nghịch lý đẹp của sự hào phóng: người biết chia sẻ và tưới mát người khác chính mình cũng sẽ được tươi mát.",
      },
      {
        ref: "Thi-thiên 24:1",
        note: "Mọi tài sản bạn đang nắm giữ rút cuộc đều thuộc về Đức Chúa Trời; sống với tâm thế người quản gia trung tín giúp bạn vừa trân trọng đồng tiền vừa sẵn lòng sẻ chia.",
      },
      {
        ref: "1 Ti-mô-thê 6:17–19",
        note: "Tiền bạc vốn bấp bênh không thể làm chỗ dựa tuyệt đối cho bạn; học cách chi tiêu chừng mực và rộng tay làm việc lành mới tạo nên nền tảng bền vững thật sự.",
      },
    ],
    prayer:
      "Thưa Chúa là Chủ của muôn vật, con tạ ơn Ngài đã ban cho con sức lực và phương tiện để mưu sinh. Xin dạy con quản lý từng khoản thu chi cách ngay thẳng, có kế hoạch, không lệ thuộc vào tiền bạc nhưng luôn giữ tấm lòng rộng rãi vui vẻ sẻ chia với người cần giúp. A-men.",
  },
  {
    slug: "lam-lanh-dao",
    title: "Làm người lãnh đạo và phục vụ người khác",
    groupId: "dinh-huong",
    prompt: "Khi đang gánh vác trách nhiệm dẫn dắt đội nhóm, gia đình hay tổ chức.",
    intro:
      "Quyền lực dễ khiến con người xa rời thực tế hoặc trở nên nặng tay. Chúa Jêsus đặt ra một mô hình lãnh đạo đảo ngược hoàn toàn: người đứng đầu thật sự là người cúi xuống phục vụ và nâng đỡ người khác trưởng thành.",
    keywords: ["lãnh đạo", "quản lý", "trách nhiệm", "phục vụ", "dẫn dắt"],
    passages: [
      {
        ref: "Mác 10:43–45",
        note: "Chuẩn mực lãnh đạo của Chúa Jêsus: ai muốn làm lớn nhất phải chọn trở thành người phục vụ mọi người.",
      },
      {
        ref: "1 Phi-e-rơ 5:2–3",
        note: "Chăn dắt và dẫn dắt người khác bằng tấm lòng tình nguyện và gương mẫu, không bằng sự áp đặt quyền uy.",
      },
      {
        ref: "Thi-thiên 78:72",
        note: "Hai phẩm chất vàng của người lãnh đạo tốt: tấm lòng ngay thật và bàn tay khôn khéo.",
      },
      {
        ref: "Châm-ngôn 11:14",
        note: "Người lãnh đạo khôn ngoan biết lắng nghe cố vấn đáng tin để dẫn cả tập thể đi vững vàng.",
      },
      {
        ref: "Xuất Ê-díp-tô Ký 18:21–22",
        note: "Lãnh đạo khôn ngoan không phải tự ôm đồm hết mọi việc rồi kiệt sức; lời khuyên cho Môi-se nhắc bạn biết tin tưởng trao quyền và chia sẻ gánh nặng với những người ngay thật xung quanh.",
      },
      {
        ref: "Giăng 13:14–15",
        note: "Hình ảnh Chúa Jêsus cúi xuống rửa chân cho môn đồ thay đổi tận gốc cách bạn nhìn về vị trí đứng đầu: uy tín lớn nhất đến từ sự khiêm nhường và tấm lòng sẵn sàng phục vụ.",
      },
    ],
    prayer:
      "Lạy Chúa Jêsus là gương mẫu lãnh đạo phục vụ, trọng trách dẫn dắt người khác nhiều lúc làm con lo lắng và dễ nóng nảy. Xin ban cho con tấm lòng ngay thật, đôi tay khôn khéo, biết lắng nghe góp ý và dùng ảnh hưởng mình để nâng đỡ mọi người cùng trưởng thành. A-men.",
  },
  {
    slug: "song-chinh-truc",
    title: "Giữ sự chính trực giữa môi trường xấu",
    groupId: "dinh-huong",
    prompt: "Khi xung quanh nhiều gian dối và bạn bị ép thỏa hiệp lương tâm.",
    intro:
      "Giữ sự ngay thẳng khi chẳng ai nhìn thấy — hoặc khi mọi người xung quanh đều làm trái — đòi hỏi bản lĩnh rất lớn. Nhưng thanh danh sạch sẽ và giấc ngủ bình yên đáng giá hơn mọi khoản lợi bất chính.",
    keywords: ["chính trực", "liêm khiết", "ngay thẳng", "trung thực", "không thỏa hiệp"],
    passages: [
      {
        ref: "Châm-ngôn 10:9",
        note: "Người đi trong sự ngay thẳng bước đi bình an vững chãi, còn kẻ làm cong đường lối mình sớm muộn cũng lộ ra.",
      },
      {
        ref: "Châm-ngôn 11:3",
        note: "Sự thanh liêm ngay thẳng là chiếc la bàn tin cậy nhất dẫn lối cho con người giữa thời buổi nhiễu nhương.",
      },
      {
        ref: "Đa-ni-ên 6:4",
        note: "Giữa triều đình đầy đố kỵ, Đa-ni-ên làm việc trung tín đến mức kẻ thù soi mãi cũng không tìm ra vết sai phạm nào.",
      },
      {
        ref: "Châm-ngôn 22:1",
        note: "Danh tiếng ngay thẳng và lòng kính trọng thật sự quý giá hơn nhiều so với vàng bạc giàu sang.",
      },
      {
        ref: "2 Cô-rinh-tô 8:21",
        note: "Phao-lô chọn cách làm việc minh bạch đến mức không ai bắt bẻ được; giữ sự rõ ràng, ngay thẳng cả trước mặt Chúa lẫn con người là lá chắn tốt nhất cho bạn giữa môi trường nhiều cám dỗ.",
      },
      {
        ref: "Hê-bơ-rơ 13:18",
        note: "Khi xung quanh ai cũng bảo thỏa hiệp một chút có sao đâu, giữ được một lương tâm trong sạch và nếp sống ngay thẳng trong mọi việc vẫn là tài sản vô giá không gì mua đổi được của bạn.",
      },
    ],
    prayer:
      "Ôi Đức Chúa Trời công chính, giữ sự ngay thẳng giữa môi trường nhiều gian dối và áp lực thỏa hiệp thật không hề dễ dàng. Xin làm vững lòng con để con không đánh đổi lương tâm sạch lấy lợi ích nhất thời, nhưng cứ bước đi minh bạch và vững vàng trước mặt Ngài. A-men.",
  },
  {
    slug: "giu-mieng-luoi",
    title: "Giữ miệng lưỡi và nói lời xây dựng",
    groupId: "dinh-huong",
    prompt: "Khi muốn thôi buôn chuyện, bớt nói lời gây tổn thương và nói lời lành.",
    intro:
      "Một câu nói vô tâm có thể làm ai đó đau suốt nhiều năm, còn một lời khích lệ đúng lúc có thể cứu một tấm lòng đang gục ngã. Kinh Thánh ví chiếc lưỡi nhỏ bé như bánh lái điều khiển cả con tàu lớn.",
    keywords: ["lời nói", "miệng lưỡi", "nói xấu", "buôn chuyện", "giao tiếp"],
    passages: [
      {
        ref: "Ê-phê-sô 4:29",
        note: "Bộ lọc đơn giản trước khi mở miệng: lời này có giúp xây dựng và đem lại ích lợi cho người nghe không?",
      },
      {
        ref: "Châm-ngôn 18:21",
        note: "Lời nói không bao giờ vô hại: nó mang trong mình quyền lực gây đổ vỡ hoặc nuôi dưỡng sự sống.",
      },
      {
        ref: "Gia-cơ 3:5–10",
        note: "Tia lửa nhỏ có thể đốt cháy cả khu rừng; học kiểm soát chiếc lưỡi là dấu hiệu của người trưởng thành.",
      },
      {
        ref: "Thi-thiên 141:3",
        note: "Lời cầu nguyện ngắn mỗi sáng: lạy Chúa, xin đặt người canh giữ miệng tôi và coi sóc cửa môi tôi.",
      },
      {
        ref: "Lu-ca 6:45",
        note: "Muốn giữ miệng khỏi lời cay nghiệt, bạn không chỉ kìm lại bề ngoài mà cần nuôi lòng mình đầy điều thiện, vì “do sự đầy dẫy trong lòng mà miệng nói ra”.",
      },
      {
        ref: "Châm-ngôn 10:19",
        note: "Thói bình phẩm nhanh và nói nhiều dễ để lại lỗi lầm; “ai cầm giữ miệng mình là khôn ngoan”. Chậm lại một nhịp giúp lời bạn nói ra chín chắn và đáng tin hơn.",
      },
    ],
    prayer:
      "Kính lạy Chúa, con nhiều lần hối hận vì những lời nói vội vàng, buôn chuyện hay vô tâm làm đau người khác. Xin Ngài thanh lọc tấm lòng con từ bên trong, đặt người canh giữ cửa môi con mỗi ngày để lời nói của con chỉ mang lại sự gây dựng và bình an. A-men.",
  },
  {
    slug: "kien-tri-khong-bo-cuoc",
    title: "Kiên trì khi chỉ muốn bỏ cuộc",
    groupId: "dinh-huong",
    prompt: "Khi chặng đường quá dài, kết quả chưa thấy và bạn sắp buông tay.",
    intro:
      "Phần lớn những điều quý giá nhất trong đời đều nở hoa chậm hơn ta tưởng. Nếu bạn đang đi trên con đường đúng nhưng thấm mệt, hãy bước thêm một bước nhỏ hôm nay thay vì nhìn mãi đường xa.",
    keywords: ["kiên trì", "bền chí", "bỏ cuộc", "cố gắng", "đi đến cùng"],
    passages: [
      {
        ref: "Hê-bơ-rơ 12:1–2",
        note: "Chạy cuộc đua đường dài bằng sự nhịn nhục bền bỉ, bỏ xuống những gánh nặng không cần thiết và ngước mắt nhìn Chúa Jêsus.",
      },
      {
        ref: "Ga-la-ti 6:9",
        note: "Đừng mỏi mệt khi làm điều thiện; chỉ cần không bỏ cuộc giữa chừng, mùa gặt chắc chắn sẽ đến.",
      },
      {
        ref: "1 Cô-rinh-tô 15:58",
        note: "Hãy đứng vững đừng rúng động, vì mọi công khó chân thành trong Chúa chẳng hề là vô ích đâu.",
      },
      {
        ref: "Rô-ma 5:3–4",
        note: "Sự bền bỉ đi qua thử thách tôi luyện nên bản lĩnh vững vàng và niềm hy vọng không dễ gãy.",
      },
      {
        ref: "A-ghê 2:4",
        note: "Khi nhìn công trình còn dang dở mà muốn buông xuôi vì thấy sức mình quá nhỏ, lời Chúa qua tiên tri A-ghê vực bạn dậy: hãy can đảm tiếp tục làm việc vì Ngài đang ở cùng bạn.",
      },
      {
        ref: "Nê-hê-mi 6:9",
        note: "Giữa bao trở ngại khiến đôi tay gần như rã rời, lời cầu nguyện cực ngắn của Nê-hê-mi rất hợp cho lúc này của bạn: xin Chúa làm cho tay tôi mạnh mẽ để đi tiếp.",
      },
    ],
    prayer:
      "Chúa ơi, chặng đường trước mắt con còn dài mà kết quả chưa thấy đâu khiến lòng con thấm mệt và muốn buông tay bỏ cuộc. Xin làm mạnh đôi tay mỏi mệt của con hôm nay, giúp con giữ mắt nhìn lên Chúa Jêsus và bền bỉ bước thêm một bước nhỏ với niềm tin chẳng lay chuyển. A-men.",
  },
  {
    slug: "hoc-tinh-khiem-nhuong",
    title: "Học sống khiêm nhường",
    groupId: "dinh-huong",
    prompt: "Khi muốn sống hạ mình, biết lắng nghe và bớt đặt cái tôi làm trung tâm.",
    intro:
      "Khiêm nhường không phải là tự hạ thấp hay chê bai chính mình, mà là ít bận tâm về cái tôi hơn để có chỗ lắng nghe Chúa và yêu thương người bên cạnh.",
    keywords: ["khiêm nhường", "hạ mình", "nhún nhường", "lắng nghe", "cái tôi"],
    passages: [
      {
        ref: "Phi-líp 2:3–8",
        note: "Chúa Jêsus không giữ khư khư địa vị cao sang, mà tự hạ mình phục vụ — đó là gương mẫu sâu sắc nhất của lòng khiêm nhường.",
      },
      {
        ref: "1 Phi-e-rơ 5:5–6",
        note: "Hạ mình dưới bàn tay quyền năng của Đức Chúa Trời để chính Ngài nâng bạn lên vào đúng thời điểm.",
      },
      {
        ref: "Châm-ngôn 22:4",
        note: "Phần thưởng của sự khiêm nhường và kính sợ Chúa là sự sống bền vững và lòng tôn trọng thật.",
      },
      {
        ref: "Mi-chê 6:8",
        note: "Bước đi cách khiêm nhường với Đức Chúa Trời giữ cho tâm hồn luôn sáng trong và biết ơn.",
      },
      {
        ref: "Thi-thiên 131:1–2",
        note: "Tấm lòng khiêm nhường không phải là tự ti chán ghét bản thân, mà là sự bình an êm dịu như đứa trẻ tựa vào mẹ — khi bạn không còn cố gồng mình tỏ ra vĩ đại hơn sự thật.",
      },
      {
        ref: "Gia-cơ 4:10",
        note: "Bạn không cần tự nâng mình lên hay tranh chỗ trước mặt người đời; cứ thật lòng hạ mình sống ngay thẳng trước mặt Chúa, chính Ngài biết cách tôn trọng bạn đúng lúc.",
      },
    ],
    prayer:
      "Lạy Chúa Jêsus nhu mì và khiêm nhường trong lòng, cái tôi của con vẫn hay đòi được chú ý, khen ngợi và giành phần đúng về mình. Xin dạy con học nơi gương hạ mình của Ngài, để lòng con được êm dịu an tịnh, biết lắng nghe và thật lòng tôn trọng những người quanh con. A-men.",
  },
  {
    slug: "hoc-long-kien-nhan",
    title: "Học lòng kiên nhẫn và chậm nóng giận",
    groupId: "dinh-huong",
    prompt: "Khi thấy mình hay vội vàng, dễ sốt ruột với người khác và với chính mình.",
    intro:
      "Thế giới hiện đại chuộng mọi thứ tức thì, nhưng tâm hồn con người và các mối quan hệ đẹp đều cần thời gian để lớn lên. Kiên nhẫn là hình dáng rất gần gũi của tình yêu thương.",
    keywords: ["kiên nhẫn", "nhịn nhục", "bình tĩnh", "vội vàng", "chậm giận"],
    passages: [
      {
        ref: "Ga-la-ti 5:22–23",
        note: "Lòng nhịn nhục không phải là cố nghiến răng chịu đựng, mà là trái ngọt nảy sinh khi lòng gắn bó với Thánh Linh Chúa.",
      },
      {
        ref: "Châm-ngôn 14:29",
        note: "Người chậm nóng giận bày tỏ sự thông sáng lớn, còn kẻ vội vàng dễ bộc lộ sự dại dột.",
      },
      {
        ref: "Truyền-đạo 7:8",
        note: "Cuối cùng một việc tốt hơn lúc khởi đầu, và tấm lòng kiên nhẫn hơn hẳn sự kiêu hãnh vội vàng.",
      },
      {
        ref: "Rô-ma 12:12",
        note: "Vui mừng trong trông cậy, kiên nhẫn trong hoạn nạn và bền lòng trong sự cầu nguyện.",
      },
      {
        ref: "Thi-thiên 103:8",
        note: "Sự kiên nhẫn bạn đang tập luyện bắt nguồn từ chính bản tính của Đức Chúa Trời — Đấng vẫn hằng chậm nóng giận và đầy lòng thương xót đối với từng thiếu sót của bạn.",
      },
      {
        ref: "Cô-lô-se 1:11",
        note: "Kiên nhẫn không có nghĩa là cắn răng chịu đựng trong ấm ức; Phao-lô cầu nguyện để bạn nhận sức mạnh từ Chúa mà nhịn nhục với một tấm lòng bình tĩnh và vui vẻ.",
      },
    ],
    prayer:
      "Cha chậm nóng giận và giàu lòng thương xót ơi, con nhận ra mình vẫn hay vội vàng, dễ bực dọc khi mọi việc và mọi người không theo kịp ý mình. Xin Thánh Linh Ngài nuôi dưỡng trái nhịn nhục trong con, giúp con tập chậm lại, bao dung với người khác và dịu dàng hơn với chính mình. A-men.",
  },
  {
    slug: "thang-su-luoi-bieng",
    title: "Rèn kỷ luật bản thân và thắng sự trì hoãn",
    groupId: "dinh-huong",
    prompt: "Khi hay chần chừ, mất tập trung và muốn sống có nề nếp, tự chủ hơn.",
    intro:
      "Sự trì hoãn thường bắt đầu từ cảm giác ngại bắt đầu và rồi để lại nỗi áy náy cuối ngày. Sách Châm-ngôn và các thư Tân Ước khích lệ ta xây dựng kỷ luật từng bước nhỏ trong sự tỉnh táo và vui vẻ.",
    keywords: ["trì hoãn", "lười biếng", "kỷ luật", "tự chủ", "siêng năng", "tập trung"],
    passages: [
      {
        ref: "Châm-ngôn 6:6–8",
        note: "Bài học giản dị từ con kiến nhỏ bé: chẳng cần ai đốc thúc mà vẫn chăm chỉ chuẩn bị từng chút một đúng mùa.",
      },
      {
        ref: "Châm-ngôn 13:4",
        note: "Ước mơ mà không hành động chỉ còn tay trắng, còn người siêng năng sẽ gặt hái sự sung túc xứng đáng.",
      },
      {
        ref: "1 Cô-rinh-tô 9:24–27",
        note: "Phao-lô ví đời sống kỷ luật như vận động viên rèn luyện đều đặn để chạy thẳng đích chứ không đánh gió vô định.",
      },
      {
        ref: "Ê-phê-sô 5:15–16",
        note: "Biết quý trọng và tận dụng từng thì giờ hiện tại cách khôn ngoan để ngày sống trôi qua không uổng phí.",
      },
      {
        ref: "Truyền-đạo 11:4–6",
        note: "Chờ đến lúc mọi điều kiện thật hoàn hảo rồi mới làm chính là cái bẫy quen thuộc của sự trì hoãn; Kinh Thánh khuyên bạn cứ bắt tay gieo từ việc nhỏ ngay sáng nay.",
      },
      {
        ref: "Rô-ma 12:11",
        note: "Kỷ luật bản thân trở nên nhẹ nhàng và đầy sinh khí hơn khi bạn làm việc không vì sợ bị nhắc nhở, mà bằng tấm lòng siêng năng, sốt sắng như đang phục vụ chính Chúa.",
      },
    ],
    prayer:
      "Thưa Chúa, sự chần chừ và thói quen trì hoãn cứ làm ngày sống của con trôi qua trong áy náy và phân tâm. Xin ban cho con tinh thần tự chủ, lòng siêng năng và sự sáng suốt để bắt đầu ngay việc cần làm hôm nay, biết quý trọng từng giờ Ngài giao phó. A-men.",
  },
  {
    slug: "cau-nguyen-sau-sac",
    title: "Khát khao cầu nguyện sâu sắc hơn",
    groupId: "dinh-huong",
    prompt: "Khi muốn dành thời gian trò chuyện chân thật và lắng nghe Chúa.",
    intro:
      "Cầu nguyện không phải nghi thức nặng nề hay danh sách đòi hỏi dài dằng dặc, mà là cuộc trò chuyện thân mật với Cha trên trời. Những lời Kinh Thánh này mở ra nhịp thở cầu nguyện tự nhiên và gần gũi hơn.",
    keywords: ["cầu nguyện", "tĩnh nguyện", "nói chuyện với Chúa", "lắng nghe Chúa"],
    passages: [
      {
        ref: "Ma-thi-ơ 6:6",
        note: "Vào phòng kín đóng cửa lại — cầu nguyện bắt đầu từ cuộc gặp gỡ chân thật, không phô trương giữa bạn với Cha.",
      },
      {
        ref: "1 Tê-sa-lô-ni-ca 5:16–18",
        note: "Vui mừng, cầu nguyện không thôi và tạ ơn là nhịp thở tự nhiên giữ ta luôn trò chuyện với Chúa suốt cả ngày.",
      },
      {
        ref: "Giê-rê-mi 33:3",
        note: "Lời mời gọi ấm áp từ Đức Chúa Trời: hãy kêu cầu Ta, Ta sẽ trả lời và tỏ cho bạn những điều sâu nhiệm.",
      },
      {
        ref: "Thi-thiên 145:18",
        note: "Đức Giê-hô-va ở gần hết thảy những ai thành thật kêu cầu danh Ngài.",
      },
      {
        ref: "Mác 1:35",
        note: "Giữa lịch trình bận rộn nhất, chính Chúa Jêsus vẫn chọn dậy sớm tìm một khoảng lặng riêng để trò chuyện với Cha — một thói quen giản dị mà bạn có thể tập từng ngày.",
      },
      {
        ref: "1 Giăng 5:14–15",
        note: "Lời hứa đem lại sự dạn dĩ ấm áp mỗi khi bạn bước vào phòng kín: cầu nguyện không phải nói vào khoảng không, mà là trò chuyện với Đấng thật sự lắng nghe bạn.",
      },
    ],
    prayer:
      "Lạy Cha luôn ở gần người kêu cầu Ngài, con ao ước đời sống cầu nguyện của mình không còn qua loa hay vội vã nữa. Xin đánh thức trong con niềm vui tìm kiếm mặt Chúa mỗi sáng, dạy con biết lắng nghe tiếng Ngài và trò chuyện với Cha bằng cả tấm lòng chân thật. A-men.",
  },
  {
    slug: "khat-khao-gan-chua",
    title: "Khao khát gần Chúa và yêu mến Kinh Thánh",
    groupId: "dinh-huong",
    prompt: "Khi muốn nuôi dưỡng đời sống tâm linh và hiểu lời Chúa sâu hơn mỗi ngày.",
    intro:
      "Thật quý biết bao khi lòng bạn dâng lên cơn khát tìm kiếm Đức Chúa Trời và lời Ngài. Cơn khát ấy chính là hạt giống lành Ngài gieo vào tâm hồn — và Ngài hứa sẽ làm cho người tìm kiếm được gặp.",
    keywords: ["gần Chúa", "đọc Kinh Thánh", "tìm kiếm Chúa", "tâm linh", "lời Chúa"],
    passages: [
      {
        ref: "Thi-thiên 42:1–2",
        note: "Hình ảnh con nai khát nước khe suối diễn tả sâu sắc cơn khát của linh hồn tìm về Đức Chúa Trời hằng sống.",
      },
      {
        ref: "Giê-rê-mi 29:13",
        note: "Lời hứa chắc chắn: khi bạn hết lòng tìm kiếm Chúa, bạn chắc chắn sẽ gặp được Ngài.",
      },
      {
        ref: "Thi-thiên 119:103–105",
        note: "Lời Chúa vừa ngọt ngào nuôi dưỡng tâm hồn như mật ong, vừa là ánh sáng dẫn đường giữa thế giới nhiều ngã rẽ.",
      },
      {
        ref: "2 Ti-mô-thê 3:16–17",
        note: "Cả Kinh Thánh có ích cho sự dạy dỗ, sửa trị và rèn luyện để đời sống người tin được trọn vẹn trong mọi việc lành.",
      },
      {
        ref: "Giô-suê 1:8",
        note: "Đọc Kinh Thánh không phải để chạy cho đủ chương rồi quên ngay; suy gẫm từng đoạn nhỏ và đem ra sống trong ngày mới thật sự nuôi dưỡng con đường của bạn.",
      },
      {
        ref: "Giăng 6:68",
        note: "Câu thưa chân thành của Phi-e-rơ nói hộ tấm lòng đang khao khát gần Chúa của bạn: giữa muôn vàn tiếng nói ồn ào quanh mình, chỉ nơi Chúa Jêsus mới có lời đem lại sự sống thật.",
      },
    ],
    prayer:
      "Chỉ nơi Chúa Jêsus mới có lời của sự sống đời đời mà linh hồn con đang khao khát. Xin mở lòng và mở mắt con mỗi khi con đọc Kinh Thánh, để Lời Ngài trở nên ngọt ngào hơn mật ong, soi sáng từng bước chân con và kéo con lại thật gần bên Chúa mỗi ngày. A-men.",
  },
];
