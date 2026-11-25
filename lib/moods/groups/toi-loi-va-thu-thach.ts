import type { MoodDefinition } from "../types";

/** Nhóm 5: Tội lỗi, cám dỗ & ăn năn (10) · Nhóm 6: Kiệt sức, bệnh tật & thử thách (12). */
export const TOI_LOI_VA_THU_THACH: readonly MoodDefinition[] = [
  // === 5. Tội lỗi, cám dỗ & ăn năn (10) ===
  {
    slug: "mac-cam-toi-loi",
    title: "Mặc cảm tội lỗi",
    groupId: "toi-loi",
    prompt: "Khi biết mình đã làm sai và lương tâm cắn rứt nặng nề.",
    intro:
      "Cảm giác cắn rứt không phải để đẩy bạn chạy trốn khỏi Đức Chúa Trời, mà để kéo bạn chạy về vòng tay tha thứ của Ngài. Giấu giếm tội lỗi chỉ khiến lòng héo mòn, còn thành thật xưng nhận mở ra sự nhẹ nhõm thật sự.",
    keywords: ["tội lỗi", "cắn rứt", "lương tâm", "có lỗi", "làm sai"],
    passages: [
      {
        ref: "1 Giăng 1:9",
        note: "Lời hứa rõ ràng như ban ngày: hễ ta thành thật xưng tội, Chúa thành tín và công bình sẽ tha thứ và làm sạch mọi điều gian ác.",
      },
      {
        ref: "Thi-thiên 32:1–5",
        note: "Đa-vít kể lại: khi ông nín lặng che giấu lỗi mình, xương cốt rã rời; vừa mở miệng xưng thật, ông lập tức nhận lấy ơn tha thứ.",
      },
      {
        ref: "Ê-sai 1:18",
        note: "Dầu tội lỗi có đỏ sậm như vết son không tẩy nổi, ân điển Đức Chúa Trời đủ sức rửa sạch trắng như tuyết.",
      },
      {
        ref: "Mi-chê 7:18–19",
        note: "Đức Chúa Trời không miễn cưỡng tha thứ; Ngài thật sự vui thích tỏ lòng thương xót và ném tội lỗi xuống tận đáy biển.",
      },
      {
        ref: "Hê-bơ-rơ 9:13–14",
        note: "Huyết Đấng Christ không chỉ xóa lỗi bên ngoài, mà còn làm sạch lương tâm bạn khỏi gánh nặng tội lỗi để tự do bước tiếp với Chúa.",
      },
      {
        ref: "Rô-ma 8:1–2",
        note: "Trong Đấng Christ, bạn không còn phải sống dưới bản án đoán phạt nữa; Thánh Linh sự sống giải phóng bạn khỏi vòng kìm kẹp của tội lỗi.",
      },
    ],
    prayer:
      "Lạy Chúa, con không muốn trốn tránh hay giấu giếm lỗi lầm của mình nữa. Con thành thật xưng nhận mọi sai phạm trước mặt Ngài, xin huyết Đấng Christ rửa sạch lương tâm cắn rứt và cho con bước đi trong ơn tha thứ của Chúa. A-men.",
  },
  {
    slug: "xau-ho-qua-khu",
    title: "Xấu hổ vì quá khứ",
    groupId: "toi-loi",
    prompt: "Khi những ký ức sai lầm xưa cũ cứ quay về làm bạn hổ thẹn.",
    intro:
      "Cảm giác có lỗi nói 'tôi đã làm sai', còn nỗi xấu hổ thì thầm 'tôi là người hỏng bét'. Kinh Thánh đem lại một căn tính mới mẻ hoàn toàn, nơi quá khứ không còn quyền định nghĩa con người bạn.",
    keywords: ["xấu hổ", "hổ thẹn", "quá khứ", "nhục nhã", "vết nhơ"],
    passages: [
      {
        ref: "Ê-sai 54:4",
        note: "Lời an ủi dịu dàng của Chúa: đừng sợ bị xấu hổ hay hổ thẹn nữa, vì Ngài sẽ xóa tan nỗi nhục của quá khứ.",
      },
      {
        ref: "Giô-ên 2:25–26",
        note: "Đức Chúa Trời có quyền bù lại những năm tháng đã bị hư mất và khiến dân Ngài không còn phải hổ thẹn.",
      },
      {
        ref: "Rô-ma 10:11",
        note: "Ai đặt niềm tin nơi Ngài sẽ chẳng bao giờ bị hổ thẹn.",
      },
      {
        ref: "2 Cô-rinh-tô 5:17",
        note: "Quá khứ không phải bản án chung thân; trong Đấng Christ, bạn được dựng nên mới lại từ gốc.",
      },
      {
        ref: "Thi-thiên 34:5",
        note: "Khi bạn thôi cúi mặt nhìn mãi vào vết nhơ cũ mà ngước lên nhìn Chúa, ánh sáng của Ngài sẽ xua tan nỗi hổ thẹn đang đè nặng.",
      },
      {
        ref: "1 Ti-mô-thê 1:15–16",
        note: "Phao-lô từng mang quá khứ nặng nề mà vẫn được Đấng Christ thương xót và dùng làm gương ân điển — quá khứ của bạn cũng không nằm ngoài tầm tay Ngài.",
      },
    ],
    prayer:
      "Cha ơi, những ký ức sai lầm xưa cũ vẫn hay quay về khiến lòng con cúi mặt hổ thẹn. Xin giúp con ngước trông lên Ngài thay vì tự kết án mình mãi, và tập sống trong căn tính mới mẻ Chúa đã ban cho con trong Đấng Christ. A-men.",
  },
  {
    slug: "dang-bi-cam-do",
    title: "Đang bị cám dỗ mạnh mẽ",
    groupId: "toi-loi",
    prompt: "Khi đang đứng trước lực hút của điều sai trái và sợ mình không đứng vững.",
    intro:
      "Bị cám dỗ chưa phải là đã phạm tội — chính Chúa Jêsus cũng từng chịu cám dỗ và hiểu rõ sức nặng của nó. Ngay lúc sức hút đang mạnh nhất, luôn có một lối thoát Chúa mở sẵn cho bạn.",
    keywords: ["cám dỗ", "thử thách", "sa ngã", "đứng vững", "lối thoát"],
    passages: [
      {
        ref: "1 Cô-rinh-tô 10:13",
        note: "Chúa thành tín không bao giờ để bạn bị cám dỗ quá sức chịu đựng, mà luôn mở sẵn một đường ra ngay trong cơn thử thách.",
      },
      {
        ref: "Hê-bơ-rơ 4:15–16",
        note: "Chúa Jêsus từng trải mọi cơn cám dỗ như ta nên Ngài cảm thông sâu sắc; hãy mạnh dạn chạy đến xin ơn giúp đúng lúc.",
      },
      {
        ref: "Gia-cơ 4:7",
        note: "Bí quyết đứng vững gồm hai bước đi liền: thuận phục Đức Chúa Trời, rồi dứt khoát chống trả cám dỗ.",
      },
      {
        ref: "Ma-thi-ơ 26:41",
        note: "Tâm thần có thể muốn điều đúng nhưng xác thịt hay yếu đuối, nên sự tỉnh thức và cầu nguyện là chiếc khiên không thể thiếu.",
      },
      {
        ref: "Sáng-thế Ký 39:8–10",
        note: "Giô-sép không đứng lại thương lượng với cám dỗ lặp đi lặp lại mỗi ngày; lòng kính sợ Chúa giúp bạn đủ dứt khoát nói không ngay từ đầu.",
      },
      {
        ref: "Thi-thiên 19:13–14",
        note: "Khi lực hút của điều sai quá mạnh, bạn có thể cầu xin Chúa giữ lòng mình khỏi cố ý phạm tội và gìn giữ từng lời nói, ý nghĩ cho đẹp ý Ngài.",
      },
    ],
    prayer:
      "Chúa Jêsus ơi, sức hút của điều sai trái lúc này thật mạnh và lòng con thấy mình quá yếu đuối. Ngài đã từng chịu cám dỗ nên hiểu rõ lòng con; xin giữ con tỉnh thức, cho con can đảm bước ra lối thoát Ngài mở sẵn hôm nay. A-men.",
  },
  {
    slug: "vap-nga-lap-lai",
    title: "Vấp ngã lặp đi lặp lại trong cùng một lỗi",
    groupId: "toi-loi",
    prompt: "Khi thất vọng vì lại mắc đúng thói xấu mình từng thề sẽ bỏ.",
    intro:
      "Không gì dễ làm ta chán mình hơn cảm giác hứa rồi lại ngã vào đúng cái hố cũ. Sứ đồ Phao-lô cũng từng thốt lên nỗi giằng xé ấy — nhưng ông không dừng ở thất vọng, mà chạy thẳng đến ân điển giải cứu.",
    keywords: ["tái phạm", "thói xấu", "vấp ngã", "nghiện", "không bỏ được"],
    passages: [
      {
        ref: "Rô-ma 7:18–25",
        note: "Phao-lô nói thật cuộc vật lộn bên trong khi điều lành muốn làm thì không làm, điều dữ không muốn thì lại vướng — rồi ngước lên ơn giải cứu nhờ Chúa Jêsus.",
      },
      {
        ref: "Châm-ngôn 28:13",
        note: "Che giấu lỗi lầm chỉ làm nó lớn thêm trong bóng tối; thành thật xưng ra và xoay bỏ sẽ nhận lấy lòng thương xót.",
      },
      {
        ref: "Gia-cơ 5:16",
        note: "Đừng chiến đấu một mình trong im lặng; chia sẻ thật lòng và cầu nguyện cùng một người tin cậy đem lại sự chữa lành lớn.",
      },
      {
        ref: "Mi-chê 7:8",
        note: "Lời tuyên bố kiên cường sau cú ngã: dầu tôi bị ngã, tôi sẽ lại dậy; dầu ngồi nơi tối tăm, Chúa sẽ làm ánh sáng cho tôi.",
      },
      {
        ref: "1 Giăng 2:1–2",
        note: "Khi lại lỡ vấp ngã, bạn đừng tuyệt vọng trốn khỏi Chúa; trước mặt Đức Chúa Cha, bạn vẫn có Chúa Jêsus là Đấng công bình đứng ra cầu thay.",
      },
      {
        ref: "Ga-la-ti 5:16–17",
        note: "Cuộc giằng co giữa xác thịt và Thánh Linh là có thật, nên thay vì chỉ gồng sức tự chống chọi, bạn hãy nương cậy và bước đi theo sự dẫn dắt của Thánh Linh.",
      },
    ],
    prayer:
      "Lạy Đức Chúa Trời, con thật chán nản khi lại vấp vào đúng lỗi cũ mình từng hứa sẽ bỏ. Con thành thật xưng ra sự yếu đuối của mình, xin Đấng cầu thay thương xót nâng con dậy và dạy con bước đi mỗi ngày nhờ sức Thánh Linh Ngài. A-men.",
  },
  {
    slug: "kieu-ngao-tu-man",
    title: "Nhận ra mình đang kiêu ngạo và tự mãn",
    groupId: "toi-loi",
    prompt: "Khi thấy mình bắt đầu xem thường người khác hoặc tự đắc về thành tích.",
    intro:
      "Kiêu ngạo là căn bệnh tinh vi nhất vì nó hay núp sau thành công và sự khen ngợi. Nhận ra nó sớm là một ơn phước lớn, giúp ta kịp cúi xuống trước khi vấp ngã nặng nề.",
    keywords: ["kiêu ngạo", "tự mãn", "tự cao", "ngạo mạn", "xem thường"],
    passages: [
      {
        ref: "Châm-ngôn 16:18",
        note: "Quy luật đã lặp lại suốt lịch sử: sự kiêu ngạo luôn đi ngay trước bước hủy diệt và sụp đổ.",
      },
      {
        ref: "Gia-cơ 4:6",
        note: "Đức Chúa Trời chống cự kẻ kiêu ngạo, nhưng lại tuôn đổ ân điển dồi dào cho người biết hạ mình.",
      },
      {
        ref: "1 Cô-rinh-tô 4:7",
        note: "Câu hỏi rất tỉnh táo cho lòng tự đắc: bạn có tài năng hay cơ hội nào mà không phải do được ban cho?",
      },
      {
        ref: "Châm-ngôn 11:2",
        note: "Kiêu ngạo kéo theo xấu hổ, còn sự khôn ngoan thật luôn ở cùng người khiêm nhường.",
      },
      {
        ref: "Giê-rê-mi 9:23–24",
        note: "Khôn ngoan, sức mạnh hay của cải đều chóng qua; điều duy nhất đáng để bạn tự hào không phải thành tích của mình, mà là được biết Đức Chúa Trời.",
      },
      {
        ref: "Rô-ma 12:3",
        note: "Phao-lô khuyên bạn nhìn nhận bản thân cách tỉnh táo, đừng nghĩ mình cao hơn thực tế, nhưng biết ơn từng khả năng Chúa đã giao phó.",
      },
    ],
    prayer:
      "Lạy Cha trên trời, xin thứ lỗi cho lòng con khi đã tự đắc và xem mình cao hơn người khác. Mọi điều tốt đẹp con có đều do Ngài ban cho; xin dạy con sống khiêm nhường, biết ơn và chỉ lấy việc nhận biết Chúa làm niềm vui thật của mình. A-men.",
  },
  {
    slug: "tham-lam-me-tien",
    title: "Bị cuốn vào tham lam và tiền bạc",
    groupId: "toi-loi",
    prompt: "Khi thấy lòng cứ mãi chạy theo vật chất, sợ thiếu và mất bình an vì tiền.",
    intro:
      "Tiền bạc là người đầy tớ tốt nhưng là ông chủ tàn nhẫn. Kinh Thánh không lên án của cải, nhưng cảnh tỉnh rất rõ khi lòng yêu tiền bắt đầu chiếm lấy ngai vàng của trái tim.",
    keywords: ["tham lam", "mê tiền", "vật chất", "ích kỷ", "ham giàu"],
    passages: [
      {
        ref: "1 Ti-mô-thê 6:9–10",
        note: "Lòng tham yêu tiền bạc là cội rễ của nhiều điều ác, tự đâm thấu lòng mình bằng biết bao nỗi đau đớn.",
      },
      {
        ref: "Lu-ca 12:15",
        note: "Chúa Jêsus nhắc một chân lý giản dị mà dễ quên: sự sống và giá trị con người không nằm ở số của cải dư dật.",
      },
      {
        ref: "Ma-thi-ơ 6:21",
        note: "Của cải bạn quý nhất đặt ở đâu, thì cả trái tim và nỗi bận tâm của bạn cũng bị cột chặt ở đó.",
      },
      {
        ref: "Truyền-đạo 5:10",
        note: "Người mê bạc không bao giờ thấy đủ bạc; càng chạy theo để lấp đầy lòng tham, cơn khát chỉ càng sâu thêm.",
      },
      {
        ref: "Châm-ngôn 30:7–9",
        note: "Lời cầu xin rất cân bằng cho bạn: chẳng ước quá giàu để quên Chúa, cũng chẳng rơi vào túng thiếu, chỉ xin đủ phần cần dùng mỗi ngày.",
      },
      {
        ref: "Thi-thiên 62:10",
        note: "Dù thu nhập hay của cải có tăng lên, Kinh Thánh vẫn nhắc bạn giữ trái tim tự do — đừng để lòng bám chặt vào những thứ nay còn mai mất.",
      },
    ],
    prayer:
      "Chúa ơi, con nhận ra lòng mình đang bị kéo chạy theo tiền bạc và nỗi lo thiếu thốn. Xin gỡ bỏ lòng tham đang trói buộc con, dạy con biết đủ với những gì Ngài chu cấp mỗi ngày và giữ trái tim con thuộc trọn về Ngài. A-men.",
  },
  {
    slug: "ham-muon-xac-thit",
    title: "Đấu tranh với ham muốn xác thịt",
    groupId: "toi-loi",
    prompt: "Khi phải giữ gìn tâm trí, ánh mắt và thân thể khỏi dục vọng sai lạc.",
    intro:
      "Cuộc chiến giữ lòng thanh sạch trong thế giới tràn ngập hình ảnh cám dỗ ngày nay không hề dễ. Kinh Thánh không dạy cách chống chọi bằng ý chí khô khan, mà bằng cách chạy trốn sớm và lấp đầy tâm trí bằng điều thánh sạch.",
    keywords: ["dục vọng", "tình dục", "ham muốn", "trong sạch", "cám dỗ mắt"],
    passages: [
      {
        ref: "1 Cô-rinh-tô 6:18–20",
        note: "Trước cám dỗ tà dâm, Kinh Thánh không bảo đứng lại tranh luận mà bảo hãy tránh chạy ngay — vì thân thể bạn là đền thờ quý giá.",
      },
      {
        ref: "2 Ti-mô-thê 2:22",
        note: "Tránh xa tình dục của tuổi trẻ phải đi liền với điều tích cực: theo đuổi sự công bình, đức tin và yêu thương cùng người có lòng sạch.",
      },
      {
        ref: "Thi-thiên 119:9–11",
        note: "Giữ lời Chúa trong lòng là cách bền bỉ nhất để giữ lối sống luôn thanh sạch.",
      },
      {
        ref: "Gióp 31:1",
        note: "Gióp chọn lập giao ước rõ ràng ngay từ đôi mắt — chặn cám dỗ ở cánh cửa đầu tiên trước khi nó vào tới trái tim.",
      },
      {
        ref: "1 Tê-sa-lô-ni-ca 4:3–5",
        note: "Giữ thân thể thánh sạch không phải để gò bó bạn, mà để bạn tôn trọng chính mình và bước đi đúng với giá trị của người thuộc về Chúa.",
      },
      {
        ref: "1 Phi-e-rơ 2:11",
        note: "Những ham muốn buông tuồng không hề vô hại mà âm thầm bào mòn linh hồn bạn; nhận ra điều đó giúp bạn kiên quyết kiêng tránh chúng hơn.",
      },
    ],
    prayer:
      "Lạy Chúa thánh khiết, xin gìn giữ đôi mắt, tâm trí và thân thể con giữa bao cám dỗ mỗi ngày. Xin cho con đủ khôn ngoan để tránh xa điều gây vấp phạm, và lấp đầy lòng con bằng Lời Ngài cùng sự bình an trong sạch. A-men.",
  },
  {
    slug: "noi-doi-thieu-thanh-that",
    title: "Lỡ nói dối và muốn sống thật",
    groupId: "toi-loi",
    prompt: "Khi vừa che giấu sự thật vì sợ hãi và thấy lòng bất an.",
    intro:
      "Một lời nói dối nhỏ thường đòi hỏi mười lời nói dối khác để che đậy, khiến lòng lúc nào cũng nơm nớp lo bị phát hiện. Quay lại với sự thật có thể hơi đau lúc đầu, nhưng mang lại tự do nhẹ nhõm lâu dài.",
    keywords: ["nói dối", "giả dối", "thành thật", "sự thật", "che giấu"],
    passages: [
      {
        ref: "Châm-ngôn 12:22",
        note: "Môi dối trá làm Đức Giê-hô-va gớm ghiếc, còn người ăn ở thành thật đem lại niềm vui cho Ngài.",
      },
      {
        ref: "Ê-phê-sô 4:25",
        note: "Bỏ sự nói dối để nói thật với nhau là nền tảng xây dựng lòng tin trong mọi mối quan hệ.",
      },
      {
        ref: "Thi-thiên 51:6",
        note: "Điều Chúa mong muốn nhất không phải vỏ bọc hoàn hảo bên ngoài, mà là sự chân thật ở tận đáy lòng.",
      },
      {
        ref: "Giăng 8:32",
        note: "Lẽ thật có sức giải phóng con người khỏi gánh nặng che giấu và sợ hãi.",
      },
      {
        ref: "Xa-cha-ri 8:16",
        note: "Chúa mời gọi bạn bắt đầu lại bằng một lựa chọn đơn sơ: nói điều chân thật với người bên cạnh để gây dựng sự tin cậy và bình an.",
      },
      {
        ref: "Cô-lô-se 3:9–10",
        note: "Bỏ thói quen che giấu hay nói dối là bước bạn cởi bỏ con người cũ, để từng ngày được đổi mới theo hình ảnh Đấng dựng nên bạn.",
      },
    ],
    prayer:
      "Lạy Cha chân thật, con xin lỗi vì đã giấu đi sự thật chỉ vì sợ hãi và muốn giữ thể diện. Xin tha thứ cho con, ban cho con lòng can đảm để nói lời ngay thẳng và giữ sự chân thật từ tận đáy lòng trước mặt Ngài lẫn mọi người. A-men.",
  },
  {
    slug: "nguoi-lanh-xa-chua",
    title: "Thấy lòng nguội lạnh và xa cách Chúa",
    groupId: "toi-loi",
    prompt: "Khi đức tin trở nên khô khan, cầu nguyện thấy gượng gạo và lòng trôi xa.",
    intro:
      "Đời sống đức tin cũng có những mùa đông khô hạn. Điều đáng mừng là chỉ riêng việc bạn nhận ra mình đang nguội lạnh và thấy nhớ Chúa đã là dấu hiệu ngọn lửa vẫn chưa tắt.",
    keywords: ["khô khan", "nguội lạnh", "xa Chúa", "mất lửa đức tin", "lạnh nhạt"],
    passages: [
      {
        ref: "Khải-huyền 2:4–5",
        note: "Khi tình yêu ban đầu phai nhạt, lời mời gọi không phải là tuyệt vọng, mà là nhớ lại, xoay lòng về và làm lại những điều đơn sơ thuở đầu.",
      },
      {
        ref: "Gia-cơ 4:8",
        note: "Bạn chỉ cần bước một bước đến gần Đức Chúa Trời, chính Ngài sẽ bước đến thật gần với bạn.",
      },
      {
        ref: "Thi-thiên 51:10–12",
        note: "Lời cầu nguyện tuyệt đẹp cho tâm hồn khô hạn: xin dựng nên lòng trong sạch và trả lại niềm vui của sự cứu rỗi.",
      },
      {
        ref: "Thi-thiên 63:1",
        note: "Dù đang đứng giữa đồng vắng khô cằn không nước, linh hồn vẫn có thể cất tiếng khao khát tìm kiếm Chúa.",
      },
      {
        ref: "Ô-sê 14:4",
        note: "Lòng nguội lạnh không khiến Chúa thôi yêu bạn. Ngài phán: “Ta sẽ chữa lành sự bội nghịch của chúng nó. Ta sẽ lấy lòng tốt yêu chúng nó” — bạn cứ quay về với Ngài.",
      },
      {
        ref: "Giăng 15:4–5",
        note: "Sự khô khan thường bắt đầu khi nhánh nho xa dần gốc nho; bạn không cần gồng lên tạo cảm xúc, chỉ cần trở lại nép mình nơi Chúa Jêsus từng ngày.",
      },
    ],
    prayer:
      "Chúa ơi, lòng con dạo này khô khan và nguội lạnh như mảnh đất lâu ngày thiếu mưa. Con muốn quay về với tình yêu ban đầu; xin dựng nên trong con tấm lòng mới, làm tươi lại niềm vui cứu rỗi và giữ con gắn chặt nơi Ngài mỗi ngày. A-men.",
  },
  {
    slug: "muon-bat-dau-lai",
    title: "Ăn năn và muốn làm lại cuộc đời",
    groupId: "toi-loi",
    prompt: "Khi muốn quay đầu khỏi lối cũ và bước đi theo hướng hoàn toàn mới.",
    intro:
      "Không bao giờ là quá muộn để quay về. Hình ảnh đẹp nhất trong Tân Ước là người cha đứng ngóng từ xa rồi chạy ra ôm lấy đứa con lầm lạc — đó chính là cách Đức Chúa Trời đón bạn hôm nay.",
    keywords: ["ăn năn", "làm lại", "quay về", "hoán cải", "thay đổi cuộc đời"],
    passages: [
      {
        ref: "Lu-ca 15:20–24",
        note: "Khi người con hoang đàng mới vừa quay bước về nhà, người cha đã thấy từ xa, động lòng thương xót và chạy ra ôm chầm lấy.",
      },
      {
        ref: "Ê-xê-chi-ên 36:26",
        note: "Chúa không chỉ vá víu tấm lòng cũ, mà hứa cất lòng bằng đá đi và đặt vào trong bạn một tấm lòng mới mềm mại.",
      },
      {
        ref: "Công-vụ các Sứ-đồ 3:19",
        note: "Ăn năn và quay lại cùng Chúa mở ra mùa tươi mới và sự xóa sạch mọi lỗi xưa.",
      },
      {
        ref: "Ê-sai 55:7",
        note: "Hãy bỏ đường cũ trở về cùng Đức Giê-hô-va, vì Ngài thương xót và tha thứ dồi dào vô hạn.",
      },
      {
        ref: "Giô-ên 2:12–13",
        note: "Chúa không đòi hỏi nghi thức bề ngoài mà nhìn vào tấm lòng thật sự muốn quay về — Ngài nhân từ, chậm giận và luôn sẵn lòng đón bạn.",
      },
      {
        ref: "2 Cô-rinh-tô 7:10",
        note: "Nỗi buồn theo ý Chúa không đẩy bạn vào tuyệt vọng tự hủy, nhưng dẫn bạn đến sự ăn năn lành mạnh và bước vào đời sống mới không hối tiếc.",
      },
    ],
    prayer:
      "Lạy Cha giàu lòng thương xót, hôm nay con quay đầu khỏi lối cũ để trở về nhà cùng Ngài. Xin cất đi tấm lòng chai đá, tha thứ mọi sai lầm đã qua và đặt trong con một tấm lòng mới để con bước đi trọn vẹn trong ơn Chúa. A-men.",
  },

  // === 6. Kiệt sức, bệnh tật & thử thách (12) ===
  {
    slug: "met-moi-kiet-suc",
    title: "Mệt mỏi và kiệt sức",
    groupId: "thu-thach",
    prompt: "Khi cạn sạch năng lượng cả thể xác lẫn tinh thần, không muốn cố thêm nữa.",
    intro:
      "Kiệt sức không phải là tội; nó là tín hiệu nhắc rằng con người vốn có giới hạn. Hãy cho phép mình dừng lại, nghỉ ngơi và tựa hẳn trọng lượng đời mình vào Đấng không bao giờ mệt mỏi.",
    keywords: ["mệt mỏi", "kiệt sức", "burnout", "hết sức", "cạn năng lượng"],
    passages: [
      {
        ref: "Ê-sai 40:28–31",
        note: "Đức Chúa Trời chẳng hề mỏi mệt hay rã rời; chính Ngài ban sức mạnh cho kẻ yếu đuối và thêm lực cho người cạn sức.",
      },
      {
        ref: "Ma-thi-ơ 11:28–29",
        note: "Lời mời đơn sơ nhất dành cho kẻ mệt mỏi gánh nặng: cứ đến với Ta, Ta sẽ cho các ngươi được yên nghỉ.",
      },
      {
        ref: "Mác 6:31",
        note: "Giữa lúc công việc ngập đầu không kịp ăn, chính Chúa Jêsus bảo các môn đồ đi riêng ra nơi vắng vẻ mà nghỉ ngơi một chút.",
      },
      {
        ref: "Thi-thiên 62:1–2",
        note: "Linh hồn chỉ thật sự tìm thấy hơi thở yên nghỉ sâu nhất khi lắng xuống bên Đức Chúa Trời.",
      },
      {
        ref: "1 Các Vua 19:5–8",
        note: "Khi Ê-li kiệt sức đến mức nằm gục xuống, Chúa không vội trách móc mà cho ông ăn uống và ngủ yên — Ngài cũng hiểu thân thể bạn cần nghỉ ngơi.",
      },
      {
        ref: "Giê-rê-mi 31:25",
        note: "Lời hứa dịu dàng dành cho lúc cạn kiệt: chính Chúa sẽ tưới mát và làm cho tấm lòng mệt mỏi, buồn rầu của bạn được no nê trở lại.",
      },
    ],
    prayer:
      "Xin Chúa thương xót thân thể và tâm trí đang cạn sức của con lúc này. Xin dạy con biết dừng lại, buông gánh nặng xuống trước mặt Ngài để yên nghỉ, và nhận lại sức mới từ Đấng chẳng hề mỏi mệt. A-men.",
  },
  {
    slug: "benh-tat-dau-don",
    title: "Bệnh tật và đau đớn thân xác",
    groupId: "thu-thach",
    prompt: "Khi đang mang bệnh, điều trị dài ngày hoặc chịu cơn đau thể xác.",
    intro:
      "Đau đớn thân xác làm mọi việc thường ngày trở nên vất vả và dễ kéo tinh thần xuống theo. Trong căn phòng bệnh hay những giờ mỏi mệt này, bạn không phải chịu đựng một mình.",
    keywords: ["bệnh tật", "đau đớn", "nằm viện", "chữa lành", "điều trị"],
    passages: [
      {
        ref: "Thi-thiên 41:3",
        note: "Đức Giê-hô-va nâng đỡ người đau yếu trên giường bệnh và dịu dàng chăm sóc trong suốt cơn đau.",
      },
      {
        ref: "Gia-cơ 5:14–15",
        note: "Kinh Thánh khuyến khích người đau yếu đừng chịu đựng một mình, mà mời cộng đồng cùng cầu nguyện xin Chúa nâng đỡ chữa lành.",
      },
      {
        ref: "Thi-thiên 73:26",
        note: "Ngay cả khi thịt và lòng đều tiêu hao sức lực, Đức Chúa Trời vẫn là vầng đá vững chắc của trái tim bạn.",
      },
      {
        ref: "2 Cô-rinh-tô 12:9–10",
        note: "Khi gai nhọn trong thân xác chưa lập tức cất đi, ân điển Chúa vẫn đủ đầy để nâng bạn đi qua từng ngày.",
      },
      {
        ref: "Giê-rê-mi 17:14",
        note: "Khi cơn đau kéo dài, bạn có thể cầu nguyện thật đơn sơ như Giê-rê-mi: đặt cả sự chữa lành lẫn đời sống mình trong tay Đức Chúa Trời.",
      },
      {
        ref: "Rô-ma 8:18",
        note: "Kinh Thánh không xem nhẹ cơn đau thân xác bạn đang chịu, nhưng mở ra hy vọng rằng đau đớn hôm nay không phải là chương cuối của đời bạn.",
      },
    ],
    prayer:
      "Đức Chúa Trời ơi, cơn đau trong thân thể khiến con nhiều lúc mệt nhoài và yếu lòng. Xin Ngài ở kề bên giường bệnh, nâng đỡ con từng giờ bằng ân điển đủ đầy và giữ lòng con vững tin nơi Chúa dẫu chặng đường điều trị còn dài. A-men.",
  },
  {
    slug: "cham-soc-nguoi-benh",
    title: "Mệt nhoài khi chăm sóc người bệnh",
    groupId: "thu-thach",
    prompt: "Khi đang túc trực lo lắng cho cha mẹ, vợ chồng hay con cái đau ốm.",
    intro:
      "Người chăm sóc bệnh nhân thường phải gồng mình tỏ ra mạnh mẽ trong khi bên trong cũng kiệt sức và lo âu không kém. Từng đêm thức trắng và từng cử chỉ yêu thương âm thầm của bạn đều được Chúa thấy rõ.",
    keywords: ["chăm người bệnh", "nuôi bệnh", "thương người thân", "túc trực"],
    passages: [
      {
        ref: "Ga-la-ti 6:2",
        note: "Mang lấy gánh nặng cho người yếu đau chính là cách sống trọn vẹn nhất luật yêu thương của Đấng Christ.",
      },
      {
        ref: "Ma-thi-ơ 25:36–40",
        note: "Mỗi cử chỉ chăm nom người đau ốm trong âm thầm đều được Chúa Jêsus trân quý như thể làm cho chính Ngài.",
      },
      {
        ref: "Ê-sai 46:4",
        note: "Khi bạn đang gồng mình bồng ẵm người thân, hãy nhớ chính Chúa cũng đang bồng ẵm và nâng đỡ cả bạn.",
      },
      {
        ref: "Thi-thiên 121:1–2",
        note: "Giữa căn phòng mệt mỏi, ngước mắt lên nguồn tiếp trợ đến từ Đấng dựng nên trời đất.",
      },
      {
        ref: "Hê-bơ-rơ 6:10",
        note: "Dù nhiều đêm túc trực chẳng ai thấy hết nỗi vất vả của bạn, Đức Chúa Trời không bao giờ quên từng việc nhỏ bạn làm vì tình yêu thương.",
      },
      {
        ref: "1 Tê-sa-lô-ni-ca 5:14",
        note: "Nâng đỡ người yếu đau luôn đòi hỏi sự kiên nhẫn bền bỉ; hãy xin Chúa tiếp thêm lòng nhịn nhục dịu dàng cho bạn qua mỗi ngày chăm sóc.",
      },
    ],
    prayer:
      "Lạy Cha nhân từ, có những lúc con thấy mình gần như kiệt sức khi cứ phải gồng lên chăm lo cho người thân đau ốm. Xin cánh tay Ngài cũng bồng ẵm chính con, thêm sức bền và lòng kiên nhẫn dịu dàng để con tiếp tục yêu thương. A-men.",
  },
  {
    slug: "kho-khan-tai-chinh",
    title: "Khó khăn tài chính và gánh nặng nợ nần",
    groupId: "thu-thach",
    prompt: "Khi tiền bạc eo hẹp, hóa đơn chồng chất và lo miếng cơm manh áo.",
    intro:
      "Áp lực tiền bạc là nỗi lo rất thực tế, dễ bào mòn giấc ngủ và hòa khí gia đình. Những lời Kinh Thánh này vừa xoa dịu nỗi hoảng loạn, vừa đem lại sự sáng suốt và tin cậy vào sự chu cấp từng ngày của Chúa.",
    keywords: ["thiếu tiền", "nợ nần", "tài chính", "kinh tế khó khăn", "túng thiếu"],
    passages: [
      {
        ref: "Phi-líp 4:19",
        note: "Lời hứa vững chắc của Phao-lô: Đức Chúa Trời sẽ làm cho đầy đủ mọi nhu cầu thật sự của bạn theo sự giàu có Ngài.",
      },
      {
        ref: "Ma-thi-ơ 6:31–33",
        note: "Cha trên trời biết rõ bạn cần ăn gì, mặc gì; đặt niềm tin và thứ tự ưu tiên đúng giúp lòng thôi hoảng loạn.",
      },
      {
        ref: "Thi-thiên 37:25",
        note: "Lời làm chứng cả một đời người: qua bao thăng trầm, người tin cậy Chúa không bị bỏ mặc cùng đường.",
      },
      {
        ref: "Châm-ngôn 22:7",
        note: "Nhìn thẳng vào thực tế của nợ nần để bình tĩnh từng bước giải quyết và tìm lại tự do tài chính.",
      },
      {
        ref: "1 Các Vua 17:14–16",
        note: "Chúa không đổ đầy kho cho người góa bụa Sa-rép-ta một lần, nhưng giữ vò bột không cạn, bình dầu không thiếu qua từng ngày — Ngài cũng biết cách nuôi bạn từng bước.",
      },
      {
        ref: "Rô-ma 13:8",
        note: "Đang mắc nợ không làm bạn mất giá trị trước mặt Chúa. Lời này cho bạn một hướng đi: từng bước trả dứt điều mình còn mắc, và giữ món nợ nên mang suốt đời là “sự yêu thương nhau”.",
      },
    ],
    prayer:
      "Ôi Chúa là Đấng chu cấp, những hóa đơn và khoản nợ đang khiến lòng con nặng trĩu và mất ăn mất ngủ. Xin cho con sự khôn ngoan để sắp xếp chi tiêu ngay thẳng, từng bước gỡ gánh nặng và tin cậy Ngài nuôi đủ con từng ngày. A-men.",
  },
  {
    slug: "that-nghiep-chong-chenh",
    title: "Thất nghiệp và chông chênh sự nghiệp",
    groupId: "thu-thach",
    prompt: "Khi mất việc, đang tìm cơ hội mới hoặc thấy con đường nghề nghiệp mờ mịt.",
    intro:
      "Mất việc không chỉ là mất thu nhập mà còn dễ làm lung lay lòng tự trọng. Xin nhớ rằng giá trị đời bạn lớn hơn nhiều so với một chức danh hay bảng lương, và Đấng mở cửa mới vẫn đang đi trước bạn.",
    keywords: ["thất nghiệp", "mất việc", "tìm việc", "sự nghiệp", "chông chênh"],
    passages: [
      {
        ref: "Thi-thiên 90:17",
        note: "Lời cầu xin rất gần gũi cho người tìm việc: xin Chúa ban ơn và làm vững bền công việc tay bạn làm.",
      },
      {
        ref: "Khải-huyền 3:8",
        note: "Khi nhiều cánh cửa bị từ chối khép lại, có một Đấng mở ra cánh cửa mới mà không ai đóng nổi.",
      },
      {
        ref: "Châm-ngôn 16:3",
        note: "Giao từng bộ hồ sơ, từng bước tìm hướng đi mới vào tay Chúa để Ngài sắp đặt con đường phù hợp.",
      },
      {
        ref: "Thi-thiên 37:3–5",
        note: "Giữa giai đoạn chờ đợi việc làm, tiếp tục tin cậy Chúa và giữ lòng trung tín trong những việc nhỏ trước mắt.",
      },
      {
        ref: "Ê-sai 48:17",
        note: "Khi con đường sự nghiệp trước mắt còn mù mờ, bạn không phải tự mò mẫm một mình — Chúa là Đấng dạy điều ích lợi và dẫn lối cho từng bước bạn đi.",
      },
      {
        ref: "Ma-thi-ơ 6:26",
        note: "Mất việc dễ khiến bạn nghi ngờ giá trị bản thân, nhưng Chúa Jêsus nhắc rằng trước mặt Cha trên trời, đời sống bạn luôn quý trọng vượt xa công việc hay thu nhập.",
      },
    ],
    prayer:
      "Kính lạy Chúa, mất việc làm con thấy chông chênh và lo lắng cho chặng đường phía trước. Con xin giao mọi kế hoạch vào tay Ngài; xin dẫn lối cho con bước tiếp, giữ vững lòng tự trọng trong Chúa và mở cánh cửa thích hợp đúng kỳ Ngài định. A-men.",
  },
  {
    slug: "that-bai-nang-ne",
    title: "Vừa trải qua thất bại nặng nề",
    groupId: "thu-thach",
    prompt: "Khi công sức đổ sông đổ biển, dự án sụp đổ hoặc trượt kỳ vọng lớn.",
    intro:
      "Đứng giữa đống đổ nát của một kế hoạch từng dốc hết tâm huyết thật không dễ chịu. Nhưng trong Kinh Thánh, rất nhiều cuộc đời rực rỡ nhất như Môi-se, Đa-vít hay Phi-e-rơ đều được rèn giũa ngay sau một lần thất bại cay đắng.",
    keywords: ["thất bại", "đổ bể", "thua cuộc", "sụp đổ", "trượt"],
    passages: [
      {
        ref: "Châm-ngôn 24:16",
        note: "Thất bại chỉ thành kết cục khi ta từ chối đứng dậy; người công bình dầu ngã bảy lần vẫn chổi dậy.",
      },
      {
        ref: "Giăng 21:15–17",
        note: "Sau cú chối Thầy đau đớn nhất đời Phi-e-rơ, Chúa Jêsus không loại ông mà phục hồi ông bên bếp lửa hồng.",
      },
      {
        ref: "Rô-ma 8:28",
        note: "Không một kinh nghiệm đau đớn nào bị lãng phí khi đặt trong bàn tay Đức Chúa Trời.",
      },
      {
        ref: "Mi-chê 7:8",
        note: "Ngã xuống hôm nay không có nghĩa sẽ nằm mãi nơi đó; Chúa sẽ làm ánh sáng nâng bạn đứng lên.",
      },
      {
        ref: "Giê-rê-mi 18:3–4",
        note: "Khi cái bình bị hư trên bàn xoay, người thợ gốm không vứt bỏ đất sét mà nắn lại hình dáng mới — cú đổ bể hôm nay không chấm dứt cuộc đời bạn.",
      },
      {
        ref: "2 Cô-rinh-tô 4:8–9",
        note: "Bạn có thể đang bị đánh ngã và túng thế sau thất bại nặng nề, nhưng Phao-lô nhắc rằng ngã xuống không đồng nghĩa với kết thúc hay bị bỏ mặc.",
      },
    ],
    prayer:
      "Thưa Cha, nhìn công sức và kỳ vọng vừa đổ bể làm lòng con hụt hẫng và đau xót quá. Xin nâng con đứng dậy khỏi nỗi thất vọng này, dùng chính bài học hôm nay để uốn nắn con trưởng thành hơn trong bàn tay Ngài. A-men.",
  },
  {
    slug: "thu-thach-keo-dai",
    title: "Hoạn nạn và thử thách kéo dài",
    groupId: "thu-thach",
    prompt: "Khi khó khăn nối tiếp khó khăn mãi chưa thấy hồi kết.",
    intro:
      "Một cơn bão ngắn ai cũng cố chịu được, nhưng chuỗi ngày thử thách kéo dài mới thực sự bào mòn ý chí. Kinh Thánh gọi giai đoạn ấy là lò luyện vàng: không phải để thiêu hủy bạn, mà để tinh luyện đức tin bền vững hơn.",
    keywords: ["hoạn nạn", "thử thách", "gian nan", "khó khăn kéo dài", "nghịch cảnh"],
    passages: [
      {
        ref: "Gia-cơ 1:2–4",
        note: "Thử thách không tự nó là vui, nhưng nó rèn nên sự nhịn nhục bền bỉ giúp nhân cách ta trưởng thành và trọn vẹn.",
      },
      {
        ref: "1 Phi-e-rơ 1:6–7",
        note: "Đức tin đi qua lửa thử thách trở nên quý giá hơn cả vàng đã luyện sạch.",
      },
      {
        ref: "Ê-sai 43:2",
        note: "Chúa không hứa ta sẽ chẳng bao giờ gặp nước sâu hay lửa nóng, nhưng Ngài hứa đi ngay bên cạnh để nước không ngập và lửa không thiêu.",
      },
      {
        ref: "2 Cô-rinh-tô 4:17–18",
        note: "Những hoạn nạn nặng nề lúc này chỉ là tạm thời so với sự vinh hiển bền vững đang chờ đợi phía trước.",
      },
      {
        ref: "Thi-thiên 66:10–12",
        note: "Người viết Thi-thiên không tô hồng chuỗi ngày “đi qua lửa qua nước”, nhưng làm chứng Chúa đã đưa họ ra khỏi. Lời chứng ấy giữ lòng bạn khi thử thách vẫn còn kéo dài.",
      },
      {
        ref: "1 Phi-e-rơ 5:10",
        note: "Thử thách kéo dài dễ khiến bạn tưởng mình sắp gãy gục, nhưng Đức Chúa Trời ban mọi ơn hứa sẽ đỡ nâng, làm bạn vững vàng và thêm sức sau cơn đau.",
      },
    ],
    prayer:
      "Lạy Chúa là Đấng thành tín, chuỗi ngày khó khăn cứ nối tiếp nhau khiến ý chí con nhiều lúc muốn mỏi mòn. Xin bước đi ngay bên cạnh con qua nước sâu lửa nóng, gìn giữ đức tin con khỏi tắt và rèn luyện lòng con nên vững vàng trong Ngài. A-men.",
  },
  {
    slug: "chua-im-lang",
    title: "Cảm thấy Chúa im lặng không đáp lời",
    groupId: "thu-thach",
    prompt: "Khi cầu nguyện mãi mà bầu trời như im bặt, không thấy dấu hiệu gì.",
    intro:
      "Cảm giác gọi mãi mà không nghe tiếng đáp là một thử thách rất sâu của người tin Chúa. Sách Thi-thiên và sách Gióp chứa đầy những câu hỏi 'Chúa ơi, cho đến bao giờ?' — cho thấy Ngài không hề giận khi bạn thành thật thưa nỗi thắc mắc ấy.",
    keywords: ["Chúa im lặng", "cầu nguyện không thấy đáp", "tại sao", "xa vắng"],
    passages: [
      {
        ref: "Thi-thiên 13:1–6",
        note: "Đa-vít hỏi thẳng bốn lần 'cho đến chừng nào?' rồi vẫn chọn neo lòng vào sự nhân từ không đổi của Chúa.",
      },
      {
        ref: "Gióp 23:8–10",
        note: "Dù nhìn quanh bốn hướng chẳng thấy bóng dáng Chúa đâu, Gióp vẫn giữ niềm xác tín: Ngài biết rõ con đường tôi đang đi.",
      },
      {
        ref: "Thi-thiên 22:1–5",
        note: "Kêu lên cảm giác bị bỏ rơi giữa ban ngày lẫn ban đêm, nhưng rồi nhớ lại các thế hệ trước từng tin cậy Chúa và được cứu.",
      },
      {
        ref: "Ha-ba-cúc 3:17–19",
        note: "Ngay cả khi vườn cây trơ trụi và chưa thấy phép lạ xảy ra, tác giả vẫn chọn đứng vững và vui mừng nơi Đức Chúa Trời.",
      },
      {
        ref: "Giăng 11:3–6",
        note: "Kinh Thánh ghép hai câu này ngay cạnh nhau: Chúa Jêsus rất yêu gia đình La-xa-rơ, nhưng Ngài vẫn nán lại hai ngày — sự chậm trễ không có nghĩa Ngài hết thương bạn.",
      },
      {
        ref: "Lu-ca 18:1–7",
        note: "Chúa Jêsus kể câu chuyện người đàn bà góa để khích lệ bạn đừng bỏ cuộc khi cầu nguyện mãi chưa thấy động tĩnh; Đức Chúa Trời vẫn lắng nghe từng tiếng kêu đêm ngày.",
      },
    ],
    prayer:
      "Chúa ơi, con đã cầu nguyện nhiều lần mà bầu trời dường như vẫn im bặt khiến lòng con bối rối và tủi thân. Xin giúp con tin rằng sự im lặng của Ngài không phải sự bỏ rơi, và giữ lòng con kiên nhẫn trông đợi theo kỳ định của Chúa. A-men.",
  },
  {
    slug: "nghi-ngo-duc-tin",
    title: "Nghi ngờ và lung lay đức tin",
    groupId: "thu-thach",
    prompt: "Khi trong đầu đầy câu hỏi khó và thấy đức tin mình chao đảo.",
    intro:
      "Nghi ngờ thành thật không phải kẻ thù của đức tin; ngược lại, mang câu hỏi thật đến với Chúa là cách đức tin trưởng thành hơn. Chúa Jêsus chưa từng đuổi một người đi chỉ vì họ thành thật thừa nhận đức tin mình còn yếu.",
    keywords: ["nghi ngờ", "lung lay", "đức tin yếu", "thắc mắc", "khủng hoảng đức tin"],
    passages: [
      {
        ref: "Mác 9:24",
        note: "Lời cầu nguyện chân thật nhất trong bốn sách Tin Lành: 'Tôi tin; xin Chúa giúp đỡ trong sự không tin của tôi!'",
      },
      {
        ref: "Giăng 20:27–29",
        note: "Chúa Jêsus không mắng nhiếc Thô-ma khi ông nghi ngờ, mà kiên nhẫn đưa tay ra để ông tự mình nhìn thấy và tin.",
      },
      {
        ref: "Rô-ma 14:1",
        note: "Kinh Thánh dạy phải bằng lòng tiếp lấy người còn yếu đức tin, không cãi vã nặng lời trước những điều họ còn nghi ngờ.",
      },
      {
        ref: "Hê-bơ-rơ 11:1",
        note: "Đức tin không phải nhắm mắt làm ngơ thực tế, mà là lòng tin chắc vào Đấng thành tín vượt trên điều mắt thường đang thấy.",
      },
      {
        ref: "Thi-thiên 73:16–17",
        note: "Khi những câu hỏi khó khiến tâm trí bạn rối bời và kiệt sức, A-sáp tìm thấy bước ngoặt không phải lúc tự giải thích hết mọi thứ, mà khi bước vào hiện diện của Chúa.",
      },
      {
        ref: "Gióp 42:2–5",
        note: "Đi qua cơn bão nghi ngờ thành thật không phá hủy đức tin của Gióp, mà đưa ông từ chỗ chỉ nghe kể về Chúa sang gặp gỡ chính Ngài — hành trình của bạn cũng có thể như thế.",
      },
    ],
    prayer:
      "Lạy Đức Chúa Trời, trong đầu con lúc này đầy những thắc mắc chưa có lời giải và đức tin con đang chao đảo. Con không muốn giả vờ mạnh mẽ trước mặt Ngài; con tin, xin Chúa giúp đỡ sự yếu đuối trong đức tin con và dẫn con đến gần Ngài hơn. A-men.",
  },
  {
    slug: "bi-che-cuoi-vi-duc-tin",
    title: "Bị chê cười hoặc cô lập vì đức tin",
    groupId: "thu-thach",
    prompt: "Khi bị người xung quanh giễu cợt, hiểu sai hoặc tách biệt vì niềm tin của mình.",
    intro:
      "Giữ vững niềm tin và giá trị sống của mình giữa môi trường không đồng cảm có thể khiến bạn thấy lạc lõng. Chính Chúa Jêsus đã đi trước trên con đường ấy và khích lệ bạn giữ lòng bình tĩnh, nhân hậu.",
    keywords: ["bị chê cười", "bắt bớ", "giễu cợt", "cô lập", "giữ đức tin"],
    passages: [
      {
        ref: "Giăng 15:18–20",
        note: "Chúa Jêsus báo trước rất thẳng để môn đồ không bất ngờ hay tổn thương khi gặp sự lạnh nhạt từ thế gian.",
      },
      {
        ref: "1 Phi-e-rơ 3:14–16",
        note: "Khi bị chất vấn hay chê cười, hãy trả lời bằng sự nhu mì, kính trọng và một lương tâm ngay sạch.",
      },
      {
        ref: "Ma-thi-ơ 5:10–12",
        note: "Chịu thiệt thòi vì chọn sống theo sự công bình không hề vô ích; Chúa nhìn thấy và ghi nhận trọn vẹn.",
      },
      {
        ref: "2 Ti-mô-thê 1:12",
        note: "Phao-lô không hổ thẹn giữa thử thách vì ông biết rõ mình đã tin cậy Đấng nào.",
      },
      {
        ref: "Ê-sai 51:7–8",
        note: "Lời chê bai hay ánh mắt lạnh nhạt của người đời rồi cũng qua đi, còn sự công bình và sự cứu rỗi của Chúa dành cho bạn thì đứng vững đến đời đời.",
      },
      {
        ref: "Đa-ni-ên 6:10",
        note: "Giữa môi trường thù nghịch với niềm tin của mình, Đa-ni-ên không gây gổ hay thu mình sợ hãi, mà cứ điềm tĩnh quỳ gối cầu nguyện với Chúa như thường lệ — sự bình tĩnh ấy cũng dành cho bạn.",
      },
    ],
    prayer:
      "Chúa Jêsus của con ơi, bị hiểu lầm và giễu cợt vì giữ niềm tin đôi khi khiến con thấy rất lẻ loi. Xin cho con không cay đắng hay đáp trả nặng lời, mà đủ vững lòng, nhu mì và giữ lương tâm ngay sạch giữa những người xung quanh. A-men.",
  },
  {
    slug: "thien-tai-bien-co",
    title: "Bàng hoàng trước biến cố và thiên tai",
    groupId: "thu-thach",
    prompt: "Khi xảy ra tai họa, tin dữ hay biến động lớn khiến lòng bàng hoàng.",
    intro:
      "Trước những biến cố bất ngờ làm chao đảo cuộc sống thường nhật, con người cảm nhận rõ sự nhỏ bé của mình. Những lời Kinh Thánh cổ xưa này là điểm tựa vững chãi nhất khi mặt đất dưới chân dường như rung chuyển.",
    keywords: ["biến cố", "thiên tai", "tai nạn", "tin dữ", "khủng hoảng"],
    passages: [
      {
        ref: "Thi-thiên 46:1–7",
        note: "Dầu núi non đổ sụp và biển gầm thét, Đức Chúa Trời vẫn ở giữa làm nơi ẩn náu và đồn lũy bất biến.",
      },
      {
        ref: "Thi-thiên 112:7",
        note: "Người có lòng vững chắc tin cậy Đức Giê-hô-va sẽ không hoảng loạn đánh mất bình tĩnh trước tin dữ.",
      },
      {
        ref: "Thi-thiên 91:1–2",
        note: "Chạy vào nơi kín đáo dưới bóng Đấng Toàn năng là phản xạ bình an nhất giữa cơn sóng gió.",
      },
      {
        ref: "Na-hum 1:7",
        note: "Đức Giê-hô-va vốn là thiện, là đồn lũy trong ngày hoạn nạn, và Ngài biết rõ từng người chạy đến nương náu nơi Ngài.",
      },
      {
        ref: "Hê-bơ-rơ 12:28",
        note: "Khi biến cố bất ngờ làm mọi điểm tựa quen thuộc chao đảo, Kinh Thánh nhắc bạn rằng nước của Đức Chúa Trời là nơi duy nhất không bao giờ bị rúng động.",
      },
      {
        ref: "Mác 4:37–40",
        note: "Giữa cơn bão lớn tưởng chừng nhấn chìm con thuyền, các môn đồ vẫn không cô độc vì Chúa ở ngay cùng họ — bạn cũng có thể kêu cầu Ngài giữa lúc bàng hoàng nhất.",
      },
    ],
    prayer:
      "Lạy Chúa Toàn năng là nơi ẩn náu của con, trước biến cố bất ngờ này con cảm thấy mình thật nhỏ bé và bất lực. Xin giữ lòng con khỏi hoảng loạn, che chở gia đình cùng những người đang chịu tổn thất, và làm đồn lũy vững chắc cho chúng con. A-men.",
  },
  {
    slug: "tuoi-gia-xe-chieu",
    title: "Già yếu và bước sang tuổi xế chiều",
    groupId: "thu-thach",
    prompt: "Khi sức khỏe giảm dần, tóc bạc thêm và suy ngẫm về chặng đường đã qua.",
    intro:
      "Tuổi già không phải là lúc giá trị con người phai nhạt. Trong Kinh Thánh, mái tóc bạc là mão triều thiên vinh dự, và lời hứa của Đức Chúa Trời dành cho những năm tháng cuối đời lại càng thêm dịu dàng.",
    keywords: ["tuổi già", "tóc bạc", "lớn tuổi", "xế chiều", "sức yếu"],
    passages: [
      {
        ref: "Ê-sai 46:4",
        note: "Lời hứa ấm áp bậc nhất cho tuổi già: cho đến lúc bạn già cả và tóc bạc, chính Ta vẫn bồng ẵm, gánh vác và giải cứu.",
      },
      {
        ref: "Thi-thiên 92:12–14",
        note: "Dầu đến tuổi già cả, đời sống gắn bó với Chúa vẫn xanh tươi và tiếp tục sinh ra hoa trái tốt lành.",
      },
      {
        ref: "Thi-thiên 71:17–18",
        note: "Lời cầu nguyện của người đã đi gần trọn đời với Chúa: xin đừng lìa bỏ khi tóc bạc để còn kể lại ơn Chúa cho thế hệ sau.",
      },
      {
        ref: "Châm-ngôn 16:31",
        note: "Mái tóc bạc đi trên con đường ngay thẳng là mão triều thiên vinh hiển của một cuộc đời sâu sắc.",
      },
      {
        ref: "2 Cô-rinh-tô 4:16",
        note: "Sức lực bề ngoài có thể yếu dần theo năm tháng, nhưng tâm hồn bên trong bạn vẫn được Chúa làm mới mỗi ngày để không đánh mất hy vọng.",
      },
      {
        ref: "2 Ti-mô-thê 4:7–8",
        note: "Ở chặng cuối cuộc đời, Phao-lô nhìn lại hành trình với lòng bình an vì đã giữ trọn đức tin — những năm tháng tuổi xế chiều của bạn vẫn đầy ý nghĩa trước mặt Chúa.",
      },
    ],
    prayer:
      "Tạ ơn Chúa vì Ngài đã dắt đưa con đi qua biết bao năm tháng cho đến ngày tóc bạc sức yếu hôm nay. Xin Ngài tiếp tục bồng ẵm, giữ tâm hồn con luôn xanh tươi trong Chúa và cho đời con vẫn là lời chứng bình an cho con cháu mai sau. A-men.",
  },
];
