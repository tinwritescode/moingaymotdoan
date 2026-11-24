import type { MoodDefinition } from "../types";

/** Nhóm 1: Niềm vui & biết ơn (12) · Nhóm 2: Nỗi buồn, mất mát & cô đơn (14). */
export const NIEM_VUI_VA_NOI_BUON: readonly MoodDefinition[] = [
  // === 1. Niềm vui & biết ơn (12) ===
  {
    slug: "vui-mung",
    title: "Vui mừng",
    groupId: "niem-vui",
    prompt: "Khi lòng rạng rỡ, nhẹ nhõm và tràn ngập niềm vui.",
    intro:
      "Niềm vui thật không chỉ đến từ một ngày suôn sẻ, mà sâu bền hơn khi ta nhận ra mọi điều tốt lành đều là quà tặng từ Đức Chúa Trời. Những lời Kinh Thánh dưới đây giúp ngài giữ gìn niềm vui ấy và chia sẻ nó cho người quanh mình.",
    keywords: ["vui", "hân hoan", "phấn khởi", "mừng rỡ", "lạc quan"],
    passages: [
      {
        ref: "Phi-líp 4:4",
        note: "Phao-lô viết lời kêu gọi vui mừng này ngay trong cảnh tù đày, nhắc rằng niềm vui bền nhất bắt rễ từ Chúa chứ không chỉ từ hoàn cảnh.",
      },
      {
        ref: "Thi-thiên 118:24",
        note: "Mỗi ngày bình an ta đang sống đều là công trình Chúa dựng nên, xứng đáng để đón nhận bằng nụ cười và lòng mừng rỡ.",
      },
      {
        ref: "Nê-hê-mi 8:10",
        note: "Sự vui vẻ trong Đức Giê-hô-va không chỉ là cảm xúc thoáng qua, mà là nguồn sức mạnh thật nâng đỡ tâm hồn.",
      },
      {
        ref: "Châm-ngôn 17:22",
        note: "Một tấm lòng vui vẻ giữ cho cả thân thể lẫn tinh thần luôn tươi mới như phương thuốc lành.",
      },
    ],
  },
  {
    slug: "biet-on",
    title: "Biết ơn",
    groupId: "niem-vui",
    prompt: "Khi muốn dừng lại đếm những ơn phước và nói lời cảm tạ.",
    intro:
      "Lòng biết ơn biến những điều quen thuộc hằng ngày thành món quà quý giá. Dừng lại vài phút để tạ ơn giúp lòng ta mở rộng và không quên bàn tay thành tín đã dẫn dắt mình.",
    keywords: ["cảm ơn", "tạ ơn", "tri ân", "phước hạnh", "ơn phước"],
    passages: [
      {
        ref: "1 Tê-sa-lô-ni-ca 5:18",
        note: "Tạ ơn trong mọi hoàn cảnh không có nghĩa mọi việc đều dễ chịu, mà là tin Chúa vẫn ở cùng ta trong từng bước đi.",
      },
      {
        ref: "Thi-thiên 103:1–5",
        note: "Đa-vít tự nhắc linh hồn mình đừng quên bất kỳ ân huệ nào: sự tha thứ, sự chữa lành và lòng thương xót hằng ngày.",
      },
      {
        ref: "Gia-cơ 1:17",
        note: "Mọi món quà tốt lành và trọn vẹn nhất trong đời đều đến từ Cha sáng láng, Đấng không hề đổi thay.",
      },
      {
        ref: "Thi-thiên 136:1",
        note: "Lời cảm tạ giản dị nhất cũng là lời bền vững nhất: Chúa vốn là thiện và sự thương xót Ngài còn đến đời đời.",
      },
    ],
  },
  {
    slug: "hanh-phuc",
    title: "Hạnh phúc",
    groupId: "niem-vui",
    prompt: "Khi cảm nhận sự ấm áp, ngọt ngào và trọn vẹn trong hiện tại.",
    intro:
      "Kinh Thánh gọi người có phước là người biết gắn rễ đời mình vào nơi không bao giờ khô cạn. Khi lòng đang hạnh phúc, hãy đặt niềm vui ấy dưới ánh sáng của Đấng ban sự sống để hạnh phúc càng thêm sâu sắc.",
    keywords: ["có phước", "mãn nguyện", "ấm áp", "trọn vẹn", "vui sướng"],
    passages: [
      {
        ref: "Thi-thiên 1:1–3",
        note: "Hạnh phúc bền bỉ giống như cây trồng bên dòng nước: xanh tốt đúng mùa và không khô héo khi nắng gắt.",
      },
      {
        ref: "Thi-thiên 16:11",
        note: "Trước mặt Đức Chúa Trời có sự khoái lạc trọn vẹn và niềm vui không phai tàn theo năm tháng.",
      },
      {
        ref: "Truyền-đạo 3:12–13",
        note: "Được vui vẻ, làm điều lành và tận hưởng thành quả lao động thường ngày chính là sự ban cho rất đẹp của Đức Chúa Trời.",
      },
      {
        ref: "Ma-thi-ơ 5:3–8",
        note: "Chúa Jêsus đảo ngược định nghĩa hạnh phúc của thế gian: phước thật nằm nơi tấm lòng khiêm nhường, hiền hòa và trong sạch.",
      },
    ],
  },
  {
    slug: "binh-an",
    title: "Bình an",
    groupId: "niem-vui",
    prompt: "Khi lòng lắng dịu, thanh thản và muốn gìn giữ sự tĩnh lặng ấy.",
    intro:
      "Sự bình an trong Kinh Thánh không chỉ là vắng bóng tiếng ồn, mà là sự vẹn toàn sâu thẳm khi biết mình đang ở trong tay Đấng chăn giữ. Hãy để những câu dưới đây neo chặt lòng ngài vào sự bình an lâu dài.",
    keywords: ["an bình", "yên tĩnh", "thanh thản", "tĩnh lặng", "yên lòng"],
    passages: [
      {
        ref: "Giăng 14:27",
        note: "Chúa Jêsus ban thứ bình an khác hẳn kiểu bình an mong manh của thế gian, đủ để lòng không còn bối rối hay sợ hãi.",
      },
      {
        ref: "Ê-sai 26:3",
        note: "Tâm trí kiên định nương cậy nơi Đức Chúa Trời sẽ được Ngài gìn giữ trong sự bình an trọn vẹn.",
      },
      {
        ref: "Thi-thiên 23:1–3",
        note: "Dưới sự dẫn dắt của Đấng Chăn Hiền Lành, linh hồn được nghỉ ngơi nơi đồng cỏ xanh tươi và mé nước bình tịnh.",
      },
      {
        ref: "Cô-lô-se 3:15",
        note: "Hãy để sự bình an của Đấng Christ làm trọng tài cai trị trong lòng và giữ gìn mọi suy nghĩ hằng ngày.",
      },
    ],
  },
  {
    slug: "hy-vong",
    title: "Hy vọng",
    groupId: "niem-vui",
    prompt: "Khi nhìn thấy tia sáng phía trước và tin điều tốt đẹp đang tới.",
    intro:
      "Hy vọng theo Kinh Thánh không phải là sự lạc quan mơ hồ, mà là cái neo chắc chắn đặt trên lời hứa thành tín của Đức Chúa Trời. Khi hy vọng nảy mầm trong lòng, hãy nuôi dưỡng nó bằng những lời này.",
    keywords: ["trông cậy", "mong đợi", "niềm tin", "tương lai", "tươi sáng"],
    passages: [
      {
        ref: "Rô-ma 15:13",
        note: "Đức Chúa Trời của sự trông cậy có thể làm lòng ngài đầy dẫy mọi niềm vui, bình an và hy vọng dư dật.",
      },
      {
        ref: "Giê-rê-mi 29:11",
        note: "Ngay cả giữa giai đoạn dân Chúa đang ở xa quê, Chúa vẫn khẳng định ý định bình an và tương lai đầy trông cậy cho họ.",
      },
      {
        ref: "Hê-bơ-rơ 6:19",
        note: "Sự trông cậy nơi Chúa giống như chiếc neo chắc chắn và bền vững giữ cho linh hồn không trôi dạt.",
      },
      {
        ref: "Ê-sai 40:31",
        note: "Những ai trông đợi Đức Giê-hô-va sẽ luôn nhận được sức mới để cất cánh vượt qua chặng đường dài.",
      },
    ],
  },
  {
    slug: "tu-tin",
    title: "Tự tin và vững lòng",
    groupId: "niem-vui",
    prompt: "Khi cần củng cố sự vững vàng và bước đi không nao núng.",
    intro:
      "Sự tự tin lành mạnh không đến từ việc tự nâng mình lên hơn người khác, mà từ nhận thức rõ Đức Chúa Trời đang đồng hành cùng ta. Khi đứng trên nền tảng ấy, ta bước đi điềm tĩnh và dạn dĩ.",
    keywords: ["vững tin", "mạnh mẽ", "can đảm", "dạn dĩ", "bản lĩnh"],
    passages: [
      {
        ref: "Giô-suê 1:9",
        note: "Cội nguồn của sự mạnh mẽ và vững lòng không phải tài năng riêng, mà là lời hứa Chúa ở cùng mọi nơi ta đi.",
      },
      {
        ref: "2 Ti-mô-thê 1:7",
        note: "Thần linh Chúa ban không phải sự nhút nhát rụt rè, mà là sức mạnh, tình yêu thương và tinh thần sáng suốt.",
      },
      {
        ref: "Phi-líp 4:13",
        note: "Phao-lô học được bí quyết vững vàng trong mọi cảnh ngộ nhờ sức lực đến từ Đấng thêm sức cho mình.",
      },
      {
        ref: "Thi-thiên 27:1",
        note: "Khi Đức Giê-hô-va là ánh sáng và đồn lũy của đời sống, chẳng còn thế lực nào khiến ta phải run sợ.",
      },
    ],
  },
  {
    slug: "khoi-dau-moi",
    title: "Hào hứng trước khởi đầu mới",
    groupId: "niem-vui",
    prompt: "Khi sắp mở ra một chặng đường, dự định hay mùa mới của cuộc đời.",
    intro:
      "Mỗi khởi đầu mới đều mang theo sự háo hức xen lẫn chút bỡ ngỡ. Trước khi đặt bước chân đầu tiên, hãy lắng nghe lời hứa của Đấng chuyên làm mới mọi sự và giao phó hành trình mới vào tay Ngài.",
    keywords: ["bắt đầu", "mới mẻ", "khởi hành", "chương mới", "dự định"],
    passages: [
      {
        ref: "Ê-sai 43:18–19",
        note: "Chúa mời ta thôi níu giữ những lối mòn cũ để sẵn sàng đón nhận công việc mới Ngài đang mở lối giữa sa mạc.",
      },
      {
        ref: "2 Cô-rinh-tô 5:17",
        note: "Trong Đấng Christ, quá khứ cũ đã đi qua và một đời sống hoàn toàn mới mẻ đã bắt đầu.",
      },
      {
        ref: "Châm-ngôn 16:3",
        note: "Giao phó công việc và dự tính cho Chúa là nền tảng vững chắc nhất để mọi kế hoạch được thành lập.",
      },
      {
        ref: "Ca-thương 3:22–23",
        note: "Mỗi buổi sáng thức dậy đều là một trang mới với lòng thương xót hoàn toàn mới mẻ từ Đức Chúa Trời.",
      },
    ],
  },
  {
    slug: "hai-long-du-day",
    title: "Hài lòng và đủ đầy",
    groupId: "niem-vui",
    prompt: "Khi thấy những gì mình đang có là đủ và không muốn chạy theo hơn thua.",
    intro:
      "Giữa thế giới luôn thúc giục con người phải có nhiều hơn nữa, tấm lòng biết đủ là một kho báu hiếm có. Kinh Thánh gọi lòng tin kính cộng với sự thỏa lòng là nguồn lợi lớn nhất của đời người.",
    keywords: ["biết đủ", "thỏa lòng", "giản dị", "đủ đầy", "không tham"],
    passages: [
      {
        ref: "1 Ti-mô-thê 6:6–8",
        note: "Ta đi vào đời tay trắng và ra đi cũng tay trắng; biết thỏa lòng với nhu cầu hằng ngày giải phóng ta khỏi bao mệt mỏi.",
      },
      {
        ref: "Phi-líp 4:11–12",
        note: "Thỏa lòng là một kỹ năng phải học qua trải nghiệm, để dù dư dật hay thiếu thốn lòng vẫn giữ được thăng bằng.",
      },
      {
        ref: "Hê-bơ-rơ 13:5",
        note: "Ta có thể buông bỏ nỗi ám ảnh tiền bạc vì có lời cam kết lớn hơn mọi tài khoản: Chúa không bao giờ lìa bỏ ta.",
      },
      {
        ref: "Thi-thiên 23:1",
        note: "Khi biết mình có Đấng Chăn giữ, cảm giác thiếu thốn không ngừng trong tâm hồn dần được lấp đầy.",
      },
    ],
  },
  {
    slug: "nhe-nhom-sau-bao",
    title: "Nhẹ nhõm sau cơn bão",
    groupId: "niem-vui",
    prompt: "Khi vừa bước qua giai đoạn khó khăn và cảm thấy được giải cứu.",
    intro:
      "Không gì ngọt ngào bằng hơi thở nhẹ nhõm sau một chặng đường dài nặng nề. Những lời Thi-thiên cảm tạ này giúp ngài nhìn lại dấu vết bình an sau cơn giông và ghi nhớ sự giải cứu của Chúa.",
    keywords: ["giải cứu", "vượt qua", "thoát nạn", "nhẹ lòng", "sau cơn mưa"],
    passages: [
      {
        ref: "Thi-thiên 30:11–12",
        note: "Chúa đã đổi tiếng khóc than thành điệu nhảy mừng, cởi bỏ áo tang và mặc cho lòng sự vui vẻ mới.",
      },
      {
        ref: "Thi-thiên 126:1–3",
        note: "Khi sự giải cứu đến sau chuỗi ngày dài chờ đợi, niềm vui lớn đến mức tưởng chừng như đang nằm chiêm bao.",
      },
      {
        ref: "Thi-thiên 40:1–3",
        note: "Từ vũng bùn lầy của hoạn nạn, Chúa kéo ta lên đặt chân trên vầng đá vững chắc và đặt bài ca mới trong miệng.",
      },
      {
        ref: "Thi-thiên 116:7–8",
        note: "Sau bao giằng co mệt nhoài, hãy nhủ lòng trở về nơi yên nghỉ vì Chúa đã lau nước mắt và giữ chân khỏi vấp ngã.",
      },
    ],
  },
  {
    slug: "kinh-ngac-truoc-tao-vat",
    title: "Ngưỡng mộ và kinh ngạc trước cuộc sống",
    groupId: "niem-vui",
    prompt: "Khi ngắm bầu trời, thiên nhiên hay phép màu của sự sống mà lòng rung động.",
    intro:
      "Đôi khi một buổi bình minh, bầu trời đầy sao hay nhịp thở bình thường của sự sống đủ khiến ta lặng người kinh ngạc. Kinh Thánh mời ta nhìn vẻ đẹp ấy như tấm gương phản chiếu sự khôn ngoan của Đấng Tạo Hóa.",
    keywords: ["thiên nhiên", "tạo vật", "kỳ diệu", "ngưỡng mộ", "kinh ngạc"],
    passages: [
      {
        ref: "Thi-thiên 19:1–4",
        note: "Các tầng trời chẳng cần lời nói mà ngày đêm vẫn rao truyền sự vinh hiển và bàn tay khéo léo của Đức Chúa Trời.",
      },
      {
        ref: "Thi-thiên 8:3–5",
        note: "Ngắm trăng sao bao la mà ngạc nhiên thay: Đấng dựng nên cả vũ trụ ấy lại để lòng đoái tưởng đến con người nhỏ bé.",
      },
      {
        ref: "Thi-thiên 104:24",
        note: "Muôn loài vật trên đất đều mang dấu ấn khôn ngoan phong phú của Đấng tạo dựng.",
      },
      {
        ref: "Rô-ma 1:20",
        note: "Ngay qua những gì mắt thấy tai nghe trong thế giới tự nhiên, quyền năng và sự kỳ diệu của Chúa hiện ra rõ ràng.",
      },
    ],
  },
  {
    slug: "muon-ca-ngoi",
    title: "Muốn ca ngợi và tôn vinh Chúa",
    groupId: "niem-vui",
    prompt: "Khi lòng dâng trào sự kính yêu và muốn cất lời ngợi khen.",
    intro:
      "Ngợi khen là cách tự nhiên nhất để lòng đầy ắp niềm vui cất thành lời. Từ Thi-thiên đến sách Khải-huyền, đây là những khúc ca sáng trong nhất để ngài hòa giọng tôn vinh Đức Chúa Trời.",
    keywords: ["ngợi khen", "thờ phượng", "tôn vinh", "ca hát", "chúc tụng"],
    passages: [
      {
        ref: "Thi-thiên 150:1–6",
        note: "Khúc kết rực rỡ của cả sách Thi-thiên mời mọi hơi thở sống trên đất cùng cất tiếng ngợi khen Đức Giê-hô-va.",
      },
      {
        ref: "Thi-thiên 95:1–3",
        note: "Hãy đến trước mặt Chúa bằng tiếng hát cảm tạ, mừng rỡ trước Vầng Đá của sự cứu rỗi.",
      },
      {
        ref: "Thi-thiên 145:1–3",
        note: "Mỗi ngày đều có lý do mới để chúc tụng sự cao cả khôn dò của Đức Chúa Trời.",
      },
      {
        ref: "Khải-huyền 4:11",
        note: "Bài ca trên trời quy mọi vinh hiển, tôn quý và quyền phép về Đấng đã dựng nên muôn vật.",
      },
    ],
  },
  {
    slug: "duoc-chua-yeu",
    title: "Cảm nhận mình được yêu thương",
    groupId: "niem-vui",
    prompt: "Khi muốn lắng lòng trong tình yêu vô điều kiện và sâu rộng của Chúa.",
    intro:
      "Nền tảng bình an sâu nhất của con người là biết mình được yêu không phải vì hoàn hảo, mà vì tình yêu bền bỉ của Đức Chúa Trời. Những đoạn Kinh Thánh này bày tỏ trọn vẹn trái tim Ngài dành cho ngài.",
    keywords: ["tình yêu", "được yêu", "ân điển", "thương xót", "con cái Chúa"],
    passages: [
      {
        ref: "Rô-ma 8:38–39",
        note: "Không sự sống, sự chết, hiện tại hay tương lai nào đủ sức tách rời ta khỏi tình yêu thương của Đức Chúa Trời.",
      },
      {
        ref: "1 Giăng 3:1",
        note: "Tình yêu lớn lao của Đức Chúa Cha không chỉ dừng ở lời nói, mà đặt ta vào địa vị làm con cái thật của Ngài.",
      },
      {
        ref: "Sô-phô-ni 3:17",
        note: "Một trong những bức tranh dịu dàng nhất Cựu Ước: Chúa vui mừng lớn tiếng và cất tiếng hát vì lòng yêu thương dân Ngài.",
      },
      {
        ref: "Ê-phê-sô 3:17–19",
        note: "Phao-lô cầu nguyện để ta cảm nhận được bề rộng, bề dài, bề cao, bề sâu của tình yêu vượt quá mọi hiểu biết.",
      },
    ],
  },

  // === 2. Nỗi buồn, mất mát & cô đơn (14) ===
  {
    slug: "buon-ba",
    title: "Buồn bã",
    groupId: "noi-buon",
    prompt: "Khi lòng chùng xuống, nặng trĩu nỗi buồn không dễ nói thành lời.",
    intro:
      "Kinh Thánh chưa bao giờ bảo người buồn phải gượng cười giả vờ ổn. Trái lại, Đức Chúa Trời đến thật gần những tấm lòng tan vỡ và lắng nghe từng tiếng thở dài của ngài.",
    keywords: ["buồn", "u sầu", "sầu muộn", "nặng lòng", "tâm trạng xấu"],
    passages: [
      {
        ref: "Thi-thiên 34:18",
        note: "Khi lòng đau thương và tan vỡ nhất, đó lại chính là lúc Đức Giê-hô-va đứng sát bên ngài nhất.",
      },
      {
        ref: "Thi-thiên 42:11",
        note: "Tác giả không che giấu nỗi sờn ngã, mà nhẹ nhàng trò chuyện với chính linh hồn mình để hướng về niềm hy vọng nơi Chúa.",
      },
      {
        ref: "Ma-thi-ơ 5:4",
        note: "Chúa Jêsus hứa sự yên ủi dành riêng cho những ai đang mang nỗi buồn sâu sắc.",
      },
      {
        ref: "Thi-thiên 30:5",
        note: "Đêm tối của nỗi buồn có thể kéo dài, nhưng buổi sáng của niềm vui chắc chắn sẽ trở lại.",
      },
    ],
  },
  {
    slug: "co-don",
    title: "Cô đơn",
    groupId: "noi-buon",
    prompt: "Khi thấy mình lẻ loi, không ai hiểu hay đồng hành.",
    intro:
      "Cô đơn có thể ập đến ngay cả khi chung quanh đông người. Trong Kinh Thánh, rất nhiều người trung tín như Đa-vít, Ê-li hay Phao-lô đều từng nếm trải cảm giác ấy — và ngay trong nơi vắng lặng đó, họ gặp được Đấng không bao giờ rời xa mình.",
    keywords: ["lẻ loi", "một mình", "cô độc", "không ai hiểu", "trơ trọi"],
    passages: [
      {
        ref: "Phục-truyền Luật-lệ Ký 31:8",
        note: "Đức Giê-hô-va không chỉ đi bên cạnh mà còn đi trước mở đường; Ngài sẽ không lìa bỏ hay từ bỏ ngài.",
      },
      {
        ref: "Thi-thiên 25:16",
        note: "Một lời cầu nguyện ngắn gọn và thành thật khi thấy mình đơn độc khốn khổ: xin Chúa đoái nhìn và thương xót.",
      },
      {
        ref: "Thi-thiên 139:7–10",
        note: "Dù ở đâu hay vào lúc tâm trạng chạm đáy nhất, bàn tay Chúa vẫn đang nắm giữ và dẫn dắt ngài.",
      },
      {
        ref: "Ma-thi-ơ 28:20",
        note: "Lời hứa cuối cùng của Chúa Jêsus trước khi về trời: Ngài ở cùng ta luôn luôn cho đến tận thế.",
      },
    ],
  },
  {
    slug: "mat-nguoi-than",
    title: "Mất người thân và tang chế",
    groupId: "noi-buon",
    prompt: "Khi vừa tiễn biệt người thương và lòng trống hoác vì mất mát.",
    intro:
      "Không lời nào xóa ngay được khoảng trống khi người mình yêu quý ra đi. Trước ngôi mộ bạn mình là La-xa-rơ, chính Chúa Jêsus cũng đã rơi nước mắt. Mong những lời này nhẹ nhàng ôm ấp nỗi đau của ngài.",
    keywords: ["tang chế", "mất mát", "người thân qua đời", "đau buồn", "sinh ly tử biệt"],
    passages: [
      {
        ref: "Giăng 11:35",
        note: "Câu ngắn nhất trong Kinh Thánh lại chứa tình cảm sâu nhất: Chúa Jêsus đã khóc cùng nỗi đau mất mát của con người.",
      },
      {
        ref: "1 Tê-sa-lô-ni-ca 4:13–14",
        note: "Người tin Chúa vẫn đau buồn khi chia ly, nhưng không buồn rầu tuyệt vọng vì có niềm hy vọng sống lại và sum họp.",
      },
      {
        ref: "Khải-huyền 21:4",
        note: "Lời hứa sau cùng của Kinh Thánh: chính Đức Chúa Trời sẽ lau sạch mọi giọt nước mắt, sự chết và tang chế sẽ không còn nữa.",
      },
      {
        ref: "Thi-thiên 23:4",
        note: "Ngay cả khi phải bước đi qua thung lũng bóng tối của sự chết, Ngài vẫn ở cùng và an ủi ngài.",
      },
    ],
  },
  {
    slug: "tan-vo-that-tinh",
    title: "Tan vỡ và thất tình",
    groupId: "noi-buon",
    prompt: "Khi một mối quan hệ yêu thương đổ vỡ và trái tim rạn nứt.",
    intro:
      "Sự đổ vỡ trong tình cảm để lại vết thương rất thật, khiến ta nghi ngờ cả giá trị của chính mình. Nhưng vết thương lòng không nằm ngoài tầm chữa lành của Đấng biết rõ từng mảnh vỡ trong trái tim ngài.",
    keywords: ["thất tình", "chia tay", "tan vỡ", "đổ vỡ", "đau tình"],
    passages: [
      {
        ref: "Thi-thiên 147:3",
        note: "Đức Chúa Trời đích thân chữa lành người có lòng tan vỡ và rịt buộc từng vết thương sâu kín nhất.",
      },
      {
        ref: "Ê-sai 54:10",
        note: "Tình cảm con người có thể đổi thay như núi đồi rung chuyển, nhưng lòng nhân từ của Chúa dành cho ngài không bao giờ dời đổi.",
      },
      {
        ref: "Thi-thiên 73:26",
        note: "Khi trái tim và sức lực cạn kiệt vì tổn thương, chính Đức Chúa Trời là sức mạnh và phần cơ nghiệp bền lâu.",
      },
      {
        ref: "Rô-ma 8:28",
        note: "Ngay cả từ những mảnh vỡ tưởng như không thể cứu vãn, Chúa vẫn có thể dệt nên điều tốt lành cho chặng đường phía sau.",
      },
    ],
  },
  {
    slug: "tuyet-vong",
    title: "Tuyệt vọng",
    groupId: "noi-buon",
    prompt: "Khi thấy mọi cánh cửa đóng kín và không còn nhìn thấy lối ra.",
    intro:
      "Nếu lúc này ngài thấy mình đang ở dưới đáy sâu và không còn sức bước tiếp, xin nhớ rằng Kinh Thánh đầy những lời kêu cứu từ tận vực thẳm. Chúa không quay lưng với người tuyệt vọng; Ngài gặp ngài ngay tại chỗ ngài đang ngã.",
    keywords: ["bế tắc", "không lối thoát", "chạm đáy", "ngã gục", "hết hy vọng"],
    passages: [
      {
        ref: "Thi-thiên 130:1–5",
        note: "Từ nơi sâu thẳm nhất, tác giả vẫn cất tiếng kêu lên Chúa và kiên nhẫn chờ đợi như lính canh chờ rạng đông.",
      },
      {
        ref: "2 Cô-rinh-tô 4:8–9",
        note: "Phao-lô thừa nhận mình từng bị ép đủ cách và bối rối, nhưng không bị bỏ rơi và không bị tuyệt diệt.",
      },
      {
        ref: "Ca-thương 3:21–24",
        note: "Giữa đống tro tàn đau đớn nhất của cuộc đời, nhớ lại sự thành tín của Chúa là đốm lửa nhỏ giữ lại hy vọng.",
      },
      {
        ref: "Thi-thiên 34:17",
        note: "Khi người kêu cứu không còn tự cứu nổi mình, Đức Giê-hô-va lắng nghe và giải cứu họ khỏi mọi gian truân.",
      },
    ],
  },
  {
    slug: "trong-rong-vo-nghia",
    title: "Trống rỗng và thấy đời vô nghĩa",
    groupId: "noi-buon",
    prompt: "Khi mọi thứ xung quanh vẫn chạy nhưng bên trong thấy nhạt nhòa, vô vị.",
    intro:
      "Cảm giác trống rỗng đôi khi đến ngay cả khi ta không thiếu thứ gì về vật chất. Sách Truyền-đạo nói thẳng về nỗi hư không ấy — không phải để ta chán đời, mà để dẫn ta đến nguồn ý nghĩa thật vượt trên mọi phù du.",
    keywords: ["trống rỗng", "vô nghĩa", "hư không", "nhạt nhẽo", "lạc lõng"],
    passages: [
      {
        ref: "Truyền-đạo 3:11",
        note: "Chúa đặt sự đời đời vào lòng con người, nên không điều tạm bợ nào dưới mặt trời lấp đầy trọn vẹn cơn khát sâu nhất của ta.",
      },
      {
        ref: "Giăng 10:10",
        note: "Chúa Jêsus không đến để đời sống ta thêm chật chội, mà để ban sự sống trọn vẹn và dư dật.",
      },
      {
        ref: "Ê-sai 55:1–2",
        note: "Lời mời dịu dàng cho người đang mệt vì chạy theo những thứ không làm no lòng: hãy đến nguồn nước sống miễn phí.",
      },
      {
        ref: "Giăng 4:13–14",
        note: "Những niềm vui trần gian khiến ta uống rồi lại khát, còn nguồn nước Chúa ban trở thành suối tuôn tràn từ bên trong.",
      },
    ],
  },
  {
    slug: "chan-nan-mat-dong-luc",
    title: "Chán nản và mất động lực",
    groupId: "noi-buon",
    prompt: "Khi không còn hứng thú làm gì, lòng uể oải và muốn buông xuôi.",
    intro:
      "Ai đi đường dài cũng có lúc sờn lòng và muốn ngồi bệt xuống bên đường. Những lời Kinh Thánh này không thúc ép hay trách móc ngài, mà nhẹ nhàng tiếp thêm hơi thở mới cho từng bước nhỏ.",
    keywords: ["chán nản", "nản lòng", "mất lửa", "uể oải", "ngán ngẩm"],
    passages: [
      {
        ref: "Ga-la-ti 6:9",
        note: "Đừng sờn lòng khi chưa thấy kết quả ngay hôm nay; nếu không bỏ cuộc, đúng kỳ ngài sẽ gặt lấy mùa màng.",
      },
      {
        ref: "1 Các Vua 19:4–8",
        note: "Khi tiên tri Ê-li chán nản đến mức chỉ muốn chết, Chúa không giảng đạo cho ông mà cho ông ngủ một giấc và ăn bữa bánh ấm.",
      },
      {
        ref: "Thi-thiên 43:5",
        note: "Giữa lúc tâm hồn nặng trĩu và chán chường, lời nhắc nhẹ nhàng hướng mắt lên nguồn giúp đỡ của mình.",
      },
      {
        ref: "Ê-sai 41:10",
        note: "Ngài không đòi ngài phải tự gồng lên thật mạnh, mà hứa chính tay phải công bình của Ngài sẽ nâng đỡ ngài.",
      },
    ],
  },
  {
    slug: "nho-nha-xa-que",
    title: "Nhớ nhà và sống xa quê",
    groupId: "noi-buon",
    prompt: "Khi sống nơi đất khách, nhớ gia đình và thèm cảm giác thuộc về.",
    intro:
      "Sống xa nhà khiến những buổi chiều cuối ngày hay dịp lễ tết trở nên chênh vênh hơn. Nhiều nhân vật trong Kinh Thánh cũng từng là khách lạ nơi đất khách — và họ khám phá ra chính Đức Chúa Trời là mái nhà đích thực của mình.",
    keywords: ["xa nhà", "xa quê", "nhớ gia đình", "đất khách", "tha hương"],
    passages: [
      {
        ref: "Thi-thiên 90:1",
        note: "Qua mọi thế hệ và mọi cuộc di chuyển, chính Đức Chúa Trời là nơi ở bình yên vững chắc cho con cái Ngài.",
      },
      {
        ref: "Sáng-thế Ký 28:15",
        note: "Khi Gia-cốp phải rời nhà đi xa một mình giữa đồng vắng, Chúa hứa Ngài đi theo, gìn giữ và không rời ông.",
      },
      {
        ref: "Thi-thiên 121:7–8",
        note: "Lời chúc phước bảo vệ cho từng bước ra đi và trở về của người xa quê.",
      },
      {
        ref: "Hê-bơ-rơ 11:13–16",
        note: "Nỗi nhớ quê hương trong lòng con người cũng nhắc ta về một quê hương tốt hơn mà Chúa đã sắm sẵn.",
      },
    ],
  },
  {
    slug: "bi-bo-roi",
    title: "Bị bỏ rơi và lãng quên",
    groupId: "noi-buon",
    prompt: "Khi thấy những người mình tin cậy quay lưng hoặc quên mất mình.",
    intro:
      "Cảm giác bị bỏ lại phía sau là một trong những vết đau buốt nhất của lòng người. Nhưng có một Đấng khắc tên ngài trong lòng bàn tay Ngài và chưa từng quên ngài dù chỉ một khoảnh khắc.",
    keywords: ["bị bỏ rơi", "lãng quên", "bơ vơ", "quay lưng", "bị gạt ra"],
    passages: [
      {
        ref: "Ê-sai 49:15–16",
        note: "Ngay cả tình mẫu tử gắn bó nhất cũng có lúc sơ sót, nhưng Đức Chúa Trời khẳng định Ngài chẳng bao giờ quên ngài.",
      },
      {
        ref: "Thi-thiên 27:10",
        note: "Ngay cả khi những người thân cận nhất trên đời bỏ rơi, Đức Giê-hô-va vẫn dang tay tiếp nhận ngài.",
      },
      {
        ref: "Giăng 14:18",
        note: "Chúa Jêsus hứa rõ ràng với những người thuộc về Ngài: ta không để các ngươi mồ côi đâu.",
      },
      {
        ref: "Hê-bơ-rơ 13:5–6",
        note: "Lời cam kết hai lần chắc chắn: ta sẽ chẳng lìa ngươi đâu, chẳng bỏ ngươi đâu.",
      },
    ],
  },
  {
    slug: "khong-duoc-yeu-thuong",
    title: "Cảm thấy không ai yêu thương mình",
    groupId: "noi-buon",
    prompt: "Khi lòng thấy mình thiếu thốn tình cảm và khát khao được quan tâm.",
    intro:
      "Khi không nhận được sự ấm áp từ xung quanh, ta dễ tin rằng mình không đáng được yêu. Kinh Thánh bác bỏ lời nói dối đó bằng tình yêu bền bỉ đã chọn ngài từ rất lâu trước khi ngài biết đến Ngài.",
    keywords: ["thiếu tình thương", "không được yêu", "khát yêu", "tủi thân"],
    passages: [
      {
        ref: "Giê-rê-mi 31:3",
        note: "Đức Chúa Trời phán thẳng với tấm lòng tủi thân: ta lấy tình yêu đời đời mà yêu ngươi và lấy sự nhân từ kéo ngươi đến.",
      },
      {
        ref: "Ê-sai 43:4",
        note: "Trước mắt Đức Chúa Trời, ngài là người quý giá, được tôn trọng và được Ngài yêu thương sâu sắc.",
      },
      {
        ref: "Rô-ma 5:8",
        note: "Tình yêu của Chúa không chờ đến khi ta hoàn hảo rồi mới trao, mà bày tỏ trọn vẹn ngay khi ta còn nhiều bất toàn.",
      },
      {
        ref: "1 Giăng 4:9–10",
        note: "Thước đo tình yêu thật không nằm ở cảm xúc bất chợt của người đời, mà ở việc Chúa đã yêu ta trước.",
      },
    ],
  },
  {
    slug: "tu-ti-vo-gia-tri",
    title: "Tự ti và thấy mình vô giá trị",
    groupId: "noi-buon",
    prompt: "Khi tự chê trách bản thân, thấy mình kém cỏi và chẳng có gì đáng kể.",
    intro:
      "Tiếng nói chỉ trích bên trong thường khắc nghiệt hơn bất kỳ ai bên ngoài. Đừng đo giá trị đời mình bằng những lần vấp ngã hay ánh mắt so sánh; hãy nghe Đấng dựng nên ngài nói ngài quý giá đến nhường nào.",
    keywords: ["tự ti", "vô dụng", "kém cỏi", "thấp kém", "mặc cảm bản thân"],
    passages: [
      {
        ref: "Thi-thiên 139:13–14",
        note: "Ngài không phải sản phẩm ngẫu nhiên hay lỗi tạo hóa; từng đường nét đời ngài được dệt nên cách lạ lùng.",
      },
      {
        ref: "Ê-phê-sô 2:10",
        note: "Kinh Thánh gọi người tin Chúa là công trình tuyệt tác do chính tay Ngài dựng nên cho những việc lành đã sắm sẵn.",
      },
      {
        ref: "Lu-ca 12:6–7",
        note: "Ngay cả từng con chim sẻ nhỏ bé Chúa còn không quên, huống chi là từng sợi tóc trên đầu ngài.",
      },
      {
        ref: "1 Cô-rinh-tô 1:27–29",
        note: "Chúa thường chọn chính những điều thế gian coi là nhỏ bé, yếu đuối để làm nên những việc lớn lao.",
      },
    ],
  },
  {
    slug: "that-vong",
    title: "Thất vọng khi kỳ vọng tan vỡ",
    groupId: "noi-buon",
    prompt: "Khi điều mình dốc lòng chờ đợi không thành như ý muốn.",
    intro:
      "Thất vọng làm lòng nhức nhối vì ta đã gửi gắm vào đó quá nhiều hy vọng. Kinh Thánh hiểu cảm giác ấy và nhẹ nhàng nâng tầm mắt ta lên kế hoạch rộng lớn hơn điều ta đang thấy trước mắt.",
    keywords: ["thất vọng", "hụt hẫng", "vỡ mộng", "không như ý", "chưng hửng"],
    passages: [
      {
        ref: "Châm-ngôn 13:12",
        note: "Kinh Thánh nói thật điều lòng người cảm thấy: sự trông cậy kéo dài khiến lòng đau đớn, nhưng điều ước thành tựu như cây sự sống.",
      },
      {
        ref: "Ê-sai 55:8–9",
        note: "Những cánh cửa đóng lại đôi khi là cách Chúa dẫn ta đi con đường cao hơn và tốt lành hơn suy tính ngắn hạn của ta.",
      },
      {
        ref: "Rô-ma 5:3–5",
        note: "Sự trông cậy đặt nơi Chúa không làm ta hổ thẹn, dù chặng đường đi qua có những khúc quanh đầy thử thách.",
      },
      {
        ref: "Thi-thiên 62:5–8",
        note: "Hãy đổ hết nỗi hụt hẫng ra trước mặt Chúa; Ngài là vầng đá đủ vững để tiếp nhận mọi tâm sự của ngài.",
      },
    ],
  },
  {
    slug: "ton-thuong-sau-sac",
    title: "Tổn thương lòng sâu sắc",
    groupId: "noi-buon",
    prompt: "Khi bị lời nói hay hành động của ai đó làm đau nhói tận bên trong.",
    intro:
      "Vết thương ngoài da ai cũng thấy, còn vết thương trong lòng thường phải tự mình gánh chịu trong im lặng. Đấng thấu suốt tâm can hiểu rõ nỗi đau ấy và sẵn sàng chữa lành từng bước một.",
    keywords: ["tổn thương", "đau lòng", "vết thương lòng", "bị làm đau", "nhói lòng"],
    passages: [
      {
        ref: "Thi-thiên 56:8",
        note: "Không một giọt nước mắt hay bước chân lang thang đau khổ nào của ngài bị bỏ sót; Chúa ghi nhớ tất cả.",
      },
      {
        ref: "Ê-sai 61:1–3",
        note: "Sứ mạng của Đấng Mê-si là băng bó những tấm lòng tan vỡ và đổi tro bụi đau buồn thành mão hoa vui mừng.",
      },
      {
        ref: "Châm-ngôn 18:14",
        note: "Kinh Thánh thừa nhận vết thương tinh thần nặng nề hơn cả bệnh tật thân xác, nên cần được nâng niu và chữa lành thật sự.",
      },
      {
        ref: "2 Cô-rinh-tô 1:3–4",
        note: "Đức Chúa Trời của mọi sự yên ủi ở bên an ủi ta trong từng cơn đau, để rồi mai này ta cũng biết nâng đỡ người khác.",
      },
    ],
  },
  {
    slug: "khoc-loc-dau-long",
    title: "Muốn khóc và giải tỏa nỗi đau",
    groupId: "noi-buon",
    prompt: "Khi lòng nghẹn ứ, chỉ muốn khóc thật lớn trước mặt Chúa.",
    intro:
      "Nước mắt không phải là dấu hiệu của yếu đuối hay thiếu đức tin. Sách Thi-thiên và Ca-thương tràn ngập những giọt nước mắt chân thành — và Chúa lắng nghe tiếng khóc của ngài như một lời cầu nguyện.",
    keywords: ["khóc", "nước mắt", "nghẹn ngào", "đau xót", "than khóc"],
    passages: [
      {
        ref: "Thi-thiên 6:6–9",
        note: "Đa-vít khóc ướt cả giường nằm, nhưng ngay giữa giọt nước mắt ông khẳng định: Đức Giê-hô-va đã nghe tiếng tôi khóc lóc.",
      },
      {
        ref: "Thi-thiên 126:5–6",
        note: "Những giọt nước mắt gieo ra trong ngày đau buồn không uổng phí; ngày gặt hái với tiếng reo mừng đang chờ phía trước.",
      },
      {
        ref: "Thi-thiên 39:12",
        note: "Lời khẩn cầu tha thiết mà giản dị: Chúa ơi, xin đừng làm thinh trước nước mắt của con.",
      },
      {
        ref: "Truyền-đạo 3:1–4",
        note: "Cuộc đời có kỳ cười và cũng có kỳ khóc; cho phép mình khóc đúng lúc là bước đầu để lòng được chữa lành.",
      },
    ],
  },
];
