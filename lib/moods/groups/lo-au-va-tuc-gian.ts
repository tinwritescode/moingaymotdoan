import type { MoodDefinition } from "../types";

/** Nhóm 3: Lo âu, sợ hãi & áp lực (12) · Nhóm 4: Tức giận, xung đột & tha thứ (12). */
export const LO_AU_VA_TUC_GIAN: readonly MoodDefinition[] = [
  // === 3. Lo âu, sợ hãi & áp lực (12) ===
  {
    slug: "lo-au-tuong-lai",
    title: "Lo âu về tương lai",
    groupId: "lo-au",
    prompt: "Khi đầu óc quay cuồng với hàng trăm kịch bản ngày mai chưa xảy ra.",
    intro:
      "Lo âu kéo ta rời khỏi giây phút hiện tại để gánh trước những gánh nặng của ngày mai mà ta chưa có sức cho hôm nay. Hãy thở chậm lại và đặt từng nỗi lo ấy vào tay Đấng đã nắm giữ ngày mai của bạn.",
    keywords: ["lo âu", "lo lắng", "bất an", "tương lai", "suy nghĩ nhiều"],
    passages: [
      {
        ref: "Ma-thi-ơ 6:25–34",
        note: "Chúa Jêsus chỉ vào chim trời và hoa huệ ngoài đồng để nhắc: Cha trên trời biết rõ mọi nhu cầu của bạn, hãy sống trọn hôm nay.",
      },
      {
        ref: "Phi-líp 4:6–7",
        note: "Thay vì để nỗi lo xoay vòng trong đầu, hãy đem từng điều cụ thể thưa với Chúa bằng lời cầu nguyện và lòng biết ơn.",
      },
      {
        ref: "1 Phi-e-rơ 5:7",
        note: "Phi-e-rơ dùng một động từ rất mạnh: hãy trút hết mọi sự lo lắng lên Chúa, vì Ngài thật sự chăm sóc bạn.",
      },
      {
        ref: "Châm-ngôn 12:25",
        note: "Sự lo lắng đè nặng làm lòng sờn xuống, còn một lời lành và sự sẻ chia nâng lòng đứng dậy.",
      },
      {
        ref: "Thi-thiên 94:19",
        note: "Những lúc đầu óc bạn bộn bề hàng loạt suy nghĩ rối rắm về tương lai, sự an ủi của Chúa có thể làm dịu lại và vui vẻ linh hồn bạn.",
      },
      {
        ref: "Giăng 14:1",
        note: "Lời khuyên ngắn gọn mà vững chãi của Chúa Jêsus: thay vì để kịch bản ngày mai làm lòng bối rối, bạn có thể neo niềm tin vào Đức Chúa Trời và vào chính Ngài.",
      },
    ],
    prayer:
      "Lạy Cha nắm giữ ngày mai, đầu óc con đang quay cuồng với biết bao kịch bản lo lắng chưa hề xảy ra. Xin giúp con trút hết mọi gánh nặng tương lai xuống trước mặt Ngài, thở chậm lại và sống trọn vẹn bình an trong ngày hôm nay. A-men.",
  },
  {
    slug: "so-hai",
    title: "Sợ hãi và bất an",
    groupId: "lo-au",
    prompt: "Khi nỗi sợ xâm chiếm tâm trí và khiến bạn chùn bước.",
    intro:
      "Câu nói lặp lại nhiều lần nhất trong Kinh Thánh là 'Đừng sợ'. Chúa không nói 'đừng sợ' vì cuộc đời không có hiểm nguy, mà vì Đấng đang đứng bên cạnh bạn lớn hơn mọi điều làm bạn run sợ.",
    keywords: ["sợ", "hoảng sợ", "kinh hãi", "bất an", "run sợ"],
    passages: [
      {
        ref: "Thi-thiên 56:3–4",
        note: "Đa-vít không nói ông chẳng bao giờ sợ; ông nói: 'Trong ngày sợ hãi, Tôi sẽ để lòng nhờ cậy nơi Chúa.'",
      },
      {
        ref: "Ê-sai 41:10",
        note: "Bốn lời bảo đảm nối tiếp nhau cho người đang run sợ: Ta ở cùng, Ta là Đức Chúa Trời ngươi, Ta bổ sức và Ta nâng đỡ.",
      },
      {
        ref: "Thi-thiên 91:1–6",
        note: "Ẩn mình dưới bóng Đấng Toàn năng đem lại sự che chở bình yên cả giữa nỗi kinh hãi ban đêm lẫn mũi tên ban ngày.",
      },
      {
        ref: "1 Giăng 4:18",
        note: "Tình yêu trọn vẹn của Đức Chúa Trời từng bước đẩy lùi nỗi sợ hãi ra khỏi lòng.",
      },
      {
        ref: "Rô-ma 8:15",
        note: "Bạn không phải sống như kẻ tôi mọi luôn co rúm trong sợ hãi; nhờ Thánh Linh, bạn là con yêu dấu có thể cất tiếng gọi Đức Chúa Trời là Cha ngay lúc bất an.",
      },
      {
        ref: "Châm-ngôn 3:25–26",
        note: "Trước những nỗi sợ ập đến bất ngờ làm bạn chùn bước, Đức Giê-hô-va là chỗ nương cậy vững vàng giúp gìn giữ từng bước chân bạn.",
      },
    ],
    prayer:
      "A-ba Cha ơi, nỗi sợ hãi và bất an lúc này khiến tim con đập nhanh và chẳng dám bước tới. Con chạy vào dưới bóng cánh của Đấng Toàn năng; xin tình yêu trọn vẹn của Ngài đẩy lùi sự kinh hãi và cho con bước đi dạn dĩ hơn. A-men.",
  },
  {
    slug: "cang-thang-qua-tai",
    title: "Căng thẳng và quá tải",
    groupId: "lo-au",
    prompt: "Khi công việc, trách nhiệm và áp lực dồn dập khiến bạn nghẹt thở.",
    intro:
      "Khi danh sách việc phải làm dài bất tận và ai cũng chờ đợi ở bạn, rất dễ quên rằng mình không phải là cỗ máy. Hãy dừng lại vài phút trước lời mời nghỉ ngơi đầy nhân hậu của Chúa Jêsus.",
    keywords: ["stress", "áp lực", "quá tải", "căng thẳng", "ngộp thở"],
    passages: [
      {
        ref: "Ma-thi-ơ 11:28–30",
        note: "Chúa Jêsus không đặt thêm gánh nặng lên vai người mệt mỏi, mà mời bạn đến nhận lấy sự yên nghỉ thật cho linh hồn.",
      },
      {
        ref: "Thi-thiên 46:10",
        note: "Giữa cơn quay cuồng của áp lực, mệnh lệnh đầu tiên của Chúa là: hãy dừng lại, yên lặng và nhớ Ngài mới là Đấng nắm quyền.",
      },
      {
        ref: "Thi-thiên 55:22",
        note: "Hãy trao gánh nặng quá sức của bạn sang cho Đức Giê-hô-va; Ngài sẽ nâng đỡ để bạn không gục ngã.",
      },
      {
        ref: "Xuất Ê-díp-tô Ký 33:14",
        note: "Trước áp lực khổng lồ dẫn dắt cả một dân tộc, Chúa hứa với Môi-se: chính mặt Ta sẽ đi cùng và ban sự yên nghỉ cho ngươi.",
      },
      {
        ref: "Ê-sai 30:15",
        note: "Khi guồng quay áp lực thúc bạn chạy nhanh hơn nữa, Chúa lại chỉ hướng ngược lại: sức mạnh thật đến với bạn từ việc dừng lại yên lặng và trông cậy nơi Ngài.",
      },
      {
        ref: "Lu-ca 10:41–42",
        note: "Như lời Chúa Jêsus dịu dàng gọi tên Ma-thê giữa lúc tất bật rối bời, Ngài nhắc bạn giữa trăm việc dồn dập vẫn có một điều cần nhất: ngồi yên bên chân Chúa.",
      },
    ],
    prayer:
      "Công việc và trách nhiệm chất chồng khiến con thấy căng thẳng và ngộp thở quá, lạy Chúa. Xin dạy con biết đặt những gánh nặng quá sức xuống dưới chân Ngài, chọn phần tốt nhất là lắng lòng bên Chúa và nhận lại sự yên nghỉ thật. A-men.",
  },
  {
    slug: "mat-ngu-dem-khuya",
    title: "Mất ngủ và trằn trọc đêm khuya",
    groupId: "lo-au",
    prompt: "Khi đêm đã khuya mà mắt vẫn mở trừng, suy nghĩ cứ chạy mãi không ngừng.",
    intro:
      "Ban đêm thường phóng đại mọi nỗi lo vốn nhỏ bé hơn vào ban ngày. Thay vì vật lộn với từng ý nghĩ rối ren trong bóng tối, hãy thả lỏng thân tâm trong sự canh giữ không bao giờ ngủ gật của Đức Chúa Trời.",
    keywords: ["mất ngủ", "khó ngủ", "đêm khuya", "trằn trọc", "thức trắng"],
    passages: [
      {
        ref: "Thi-thiên 4:8",
        note: "Lời cầu nguyện tuyệt đẹp trước khi nhắm mắt: tôi nằm và ngủ bình yên, vì chỉ một mình Chúa làm tôi ở an toàn.",
      },
      {
        ref: "Thi-thiên 121:3–4",
        note: "Bạn có thể yên tâm ngủ đi vì Đấng gìn giữ bạn chẳng hề buồn ngủ cũng không hề ngủ.",
      },
      {
        ref: "Thi-thiên 127:2",
        note: "Thức khuya dậy sớm lo âu cũng chẳng tự làm nên mọi sự; chính Chúa ban giấc ngủ bình yên cho người Ngài yêu.",
      },
      {
        ref: "Châm-ngôn 3:24",
        note: "Khi lòng tựa nương vào sự khôn ngoan của Chúa, nằm xuống sẽ chẳng kinh sợ và giấc ngủ trở nên êm dịu.",
      },
      {
        ref: "Phi-líp 4:8",
        note: "Khi tâm trí cứ tua đi tua lại những chuyện rối ren lúc nửa đêm, bạn có thể nhẹ nhàng chuyển hướng suy nghĩ sang những điều chân thật, tốt lành và đáng biết ơn.",
      },
      {
        ref: "Ê-sai 26:3",
        note: "Khi đầu óc cứ chạy mãi lúc nửa đêm, bạn có thể đặt từng ý nghĩ vào tay Chúa: ai “để trí mình nương dựa nơi Ngài” thì được Ngài gìn giữ trong sự bình yên.",
      },
    ],
    prayer:
      "Đêm đã khuya lắm rồi, lạy Chúa là Đấng chẳng hề ngủ gật, mà mắt con vẫn mở trừng với bao suy nghĩ ngổn ngang. Con giao hết mọi việc chưa xong của ngày hôm nay vào tay Ngài; xin dỗ dịu tâm trí con để con được nằm xuống và ngủ một giấc bình yên. A-men.",
  },
  {
    slug: "hoang-mang-nga-re",
    title: "Hoang mang trước ngã rẽ cuộc đời",
    groupId: "lo-au",
    prompt: "Khi đứng trước nhiều lựa chọn và không biết rẽ hướng nào cho đúng.",
    intro:
      "Đứng trước một quyết định lớn mà thiếu bản đồ rõ ràng luôn khiến lòng chao đảo. Chúa thường không chiếu sáng cả mười cây số phía trước, nhưng Ngài luôn đủ ánh sáng cho bước chân kế tiếp của bạn.",
    keywords: ["hoang mang", "mất phương hướng", "ngã rẽ", "phân vân", "lựa chọn"],
    passages: [
      {
        ref: "Châm-ngôn 3:5–6",
        note: "Khi lý trí không nhìn hết đường phía trước, hết lòng tin cậy và nhận biết Chúa là cách để Ngài chỉ dẫn các nẻo bạn đi.",
      },
      {
        ref: "Thi-thiên 119:105",
        note: "Lời Chúa như ngọn đèn soi ngay dưới bàn chân: đủ sáng để thấy rõ bước đi hôm nay mà không lạc hướng.",
      },
      {
        ref: "Thi-thiên 32:8",
        note: "Lời hứa trực tiếp của Chúa: Ta sẽ dạy dỗ ngươi, chỉ cho con đường phải đi và để mắt trông chừng ngươi.",
      },
      {
        ref: "Ê-sai 30:21",
        note: "Khi sắp rẽ sang phải hay sang trái, lắng lòng sẽ nghe tiếng dẫn đường: đây là con đường, hãy đi theo nó.",
      },
      {
        ref: "Giăng 10:3–4",
        note: "Bạn không cần tự vẽ hết bản đồ đường dài khi đứng trước ngã rẽ; Đấng Chăn Hiền Lành luôn đi trước, gọi đích danh và dẫn bạn từng bước một.",
      },
      {
        ref: "Cô-lô-se 1:9–10",
        note: "Lời cầu nguyện của Phao-lô cũng là điều bạn có thể thưa với Chúa lúc phân vân: xin Ngài ban sự khôn ngoan để nhận biết ý muốn Ngài và bước đi vững vàng.",
      },
    ],
    prayer:
      "Lạy Đấng Chăn dắt đời con, đứng trước ngã rẽ này con thật hoang mang và sợ mình chọn sai hướng. Xin Lời Ngài làm ngọn đèn soi rõ ngay dưới bàn chân con hôm nay, mở tai con nghe rõ tiếng Chúa và ban sự sáng suốt cho quyết định trước mắt. A-men.",
  },
  {
    slug: "so-that-bai",
    title: "Sợ thất bại",
    groupId: "lo-au",
    prompt: "Khi chùn bước vì sợ làm hỏng, sợ sai lầm hoặc không đủ giỏi.",
    intro:
      "Nỗi sợ thất bại thường làm ta tê liệt trước cả khi bắt đầu. Nhưng trong bàn tay Đức Chúa Trời, một bước vấp ngã không phải dấu chấm hết — mà là nơi Ngài nắm tay kéo bạn đứng dậy.",
    keywords: ["sợ sai", "sợ thua", "chùn bước", "do dự", "sợ hỏng việc"],
    passages: [
      {
        ref: "Thi-thiên 37:23–24",
        note: "Ngay cả người bước đi trong sự dẫn dắt của Chúa cũng có lúc vấp ngã, nhưng không bao giờ ngã luôn vì tay Chúa nâng đỡ.",
      },
      {
        ref: "Châm-ngôn 24:16",
        note: "Người ngay thẳng không phải người chưa từng ngã, mà là người dầu sa ngã bảy lần vẫn đứng dậy đi tiếp.",
      },
      {
        ref: "2 Cô-rinh-tô 12:9",
        note: "Sức mạnh của Chúa thường tỏa sáng rực rỡ nhất chính tại những chỗ con người thấy mình yếu đuối và bất toàn.",
      },
      {
        ref: "Rô-ma 8:31",
        note: "Khi Đức Chúa Trời đứng về phía bạn, nỗi sợ thất bại không còn tiếng nói cuối cùng trên đời bạn nữa.",
      },
      {
        ref: "1 Sử-ký 28:20",
        note: "Trước nhiệm vụ lớn khiến bạn run tay sợ làm hỏng, lời khích lệ Đa-vít trao cho Sa-lô-môn cũng nhắc bạn: hãy mạnh dạn bắt tay làm vì Chúa đồng hành cho đến trọn việc.",
      },
      {
        ref: "Ma-thi-ơ 25:21",
        note: "Chúa không đòi hỏi bạn phải hoàn hảo không một vết xước; điều Ngài trân trọng và khen ngợi nơi bạn là tấm lòng ngay lành và trung tín từng việc nhỏ.",
      },
    ],
    prayer:
      "Thưa Cha, nỗi sợ làm hỏng việc và không đủ giỏi đang khiến con chùn chân ngay trước vạch xuất phát. Xin cất đi nỗi ám ảnh phải hoàn hảo, cho con can đảm bước tới bằng lòng trung tín và tin rằng sức mạnh Ngài luôn nâng đỡ ngay trong sự yếu đuối của con. A-men.",
  },
  {
    slug: "so-bi-tu-choi",
    title: "Sợ bị từ chối và đánh giá",
    groupId: "lo-au",
    prompt: "Khi quá để tâm ánh mắt người khác và sống mệt mỏi vì muốn làm vừa lòng tất cả.",
    intro:
      "Sống chạy theo sự công nhận của người đời giống như chiếc bẫy vô hình khiến ta luôn căng thẳng. Biết mình đã được Đấng Tối Cao tiếp nhận giúp bạn bước đi tự do và chân thật hơn.",
    keywords: ["sợ phán xét", "làm vừa lòng người khác", "bị từ chối", "ánh mắt người đời"],
    passages: [
      {
        ref: "Châm-ngôn 29:25",
        note: "Sợ hãi ánh mắt và lời chê khen của loài người là cái bẫy trói buộc, còn tin cậy Đức Giê-hô-va đem lại sự tự do an toàn.",
      },
      {
        ref: "Ga-la-ti 1:10",
        note: "Câu hỏi giúp lòng sáng ra ngay lập tức: ta đang tìm cách đẹp lòng người ta hay đẹp lòng Đức Chúa Trời?",
      },
      {
        ref: "Thi-thiên 118:6",
        note: "Có Đức Giê-hô-va ở về phía mình, lời đánh giá hay sự khước từ của loài người không thể định đoạt giá trị bạn.",
      },
      {
        ref: "1 Phi-e-rơ 2:4",
        note: "Chính Chúa Jêsus cũng từng bị loài người loại bỏ, nhưng trước mặt Đức Chúa Trời Ngài là viên đá được chọn và quý báu.",
      },
      {
        ref: "1 Sa-mu-ên 16:7",
        note: "Ánh mắt đánh giá của người đời thường chỉ dừng ở vẻ bề ngoài chóng thay đổi, còn Đức Chúa Trời nhìn thấu và trân trọng tấm lòng chân thật bên trong bạn.",
      },
      {
        ref: "Rô-ma 15:7",
        note: "Nỗi lo bị khước từ sẽ nhẹ đi nhiều khi bạn nhớ rằng chính Đấng Christ đã rộng vòng tay tiếp nhận bạn trước hết — bạn không cần gồng mình mua lấy sự công nhận.",
      },
    ],
    prayer:
      "Lạy Chúa thấu suốt lòng con, con thật mệt mỏi khi cứ sống căng thẳng theo ánh mắt khen chê của người xung quanh. Cảm ơn Ngài đã tiếp nhận con cách trọn vẹn trong Đấng Christ; xin giải phóng con khỏi chiếc bẫy sợ loài người để con sống chân thật và đẹp ý Ngài. A-men.",
  },
  {
    slug: "so-benh-tat",
    title: "Sợ bệnh tật và yếu đuối",
    groupId: "lo-au",
    prompt: "Khi lo lắng về sức khỏe, chờ kết quả khám bệnh hoặc sợ thân thể suy yếu.",
    intro:
      "Thân thể con người mong manh nên nỗi lo về bệnh tật là điều rất dễ hiểu. Giữa lúc hồi hộp chờ đợi hay chăm lo sức khỏe, hãy tựa vào Đấng nắm giữ từng nhịp đập và hơi thở của bạn.",
    keywords: ["sức khỏe", "lo bệnh", "khám bệnh", "ốm đau", "thân thể yếu"],
    passages: [
      {
        ref: "Thi-thiên 41:3",
        note: "Khi thân thể nằm yếu trên giường bệnh, chính tay Đức Giê-hô-va nâng đỡ và chăm sóc người tin cậy Ngài.",
      },
      {
        ref: "Thi-thiên 103:2–3",
        note: "Nhắc lòng nhớ về Đấng tha thứ tội lỗi và chữa lành các bệnh tật trong hành trình đời người.",
      },
      {
        ref: "2 Cô-rinh-tô 4:16",
        note: "Dầu bề ngoài thân xác có ngày hao mòn yếu đuối, con người bề trong vẫn có thể được đổi mới từng ngày.",
      },
      {
        ref: "Giê-rê-mi 17:14",
        note: "Lời cầu nguyện thẳng thắn, bình dị dâng lên Đấng duy nhất có quyền chữa lành và cứu rỗi thật sự.",
      },
      {
        ref: "Ma-thi-ơ 10:29–31",
        note: "Khi chờ kết quả khám hay lo lắng về thân thể mong manh, Chúa Jêsus nhắc bạn rằng ngay cả từng sợi tóc trên đầu bạn Cha cũng đếm hết — bạn đang ở trong sự chăm sóc rất sát sao.",
      },
      {
        ref: "Rô-ma 8:11",
        note: "Dù thân thể con người có giới hạn và dễ suy yếu, Thánh Linh sự sống đang ngự trong bạn giữ cho bạn niềm hy vọng vững vàng vượt trên nỗi lo bệnh tật.",
      },
    ],
    prayer:
      "Lạy Đức Chúa Trời nắm giữ từng nhịp thở của con, nỗi lo về sức khỏe và sự mong manh của thân thể khiến lòng con bất an lắm. Con phó thác thân xác mình trong sự chăm sóc dịu dàng của Ngài; xin giữ tâm trí con bình tĩnh và lòng con luôn được đổi mới trong Chúa. A-men.",
  },
  {
    slug: "so-cai-chet",
    title: "Sợ cái chết",
    groupId: "lo-au",
    prompt: "Khi đối diện sự hữu hạn của kiếp người và thấy bất an trước cõi đời sau.",
    intro:
      "Cái chết là bóng tối lớn nhất khiến loài người run sợ suốt lịch sử. Tin Lành không né tránh sự thật ấy, mà loan báo một Đấng đã đi xuyên qua sự chết và bước ra khỏi ngôi mộ để nắm tay dẫn bạn qua bên kia.",
    keywords: ["cái chết", "sợ chết", "hữu hạn", "đời sau", "sống lại"],
    passages: [
      {
        ref: "Giăng 11:25–26",
        note: "Chúa Jêsus tuyên bố chính Ngài là sự sống lại và sự sống; ai tin Ngài thì sự chết không còn giữ được họ mãi mãi.",
      },
      {
        ref: "Hê-bơ-rơ 2:14–15",
        note: "Chúa Jêsus đã mang lấy thân xác và đi qua sự chết để giải phóng những ai suốt đời làm tôi mọi cho nỗi sợ chết.",
      },
      {
        ref: "1 Cô-rinh-tô 15:54–57",
        note: "Khúc khải hoàn trước bóng tối lớn nhất: sự chết đã bị nuốt mất trong sự thắng lợi nhờ Chúa Jêsus Christ.",
      },
      {
        ref: "Thi-thiên 116:15",
        note: "Trước mặt Đức Giê-hô-va, ngày qua đời của người thuộc về Ngài không phải sự bỏ quên, mà là điều vô cùng quý giá.",
      },
      {
        ref: "Khải-huyền 1:17–18",
        note: "Chính Đấng cầm “chìa khóa của sự chết và âm phủ” đặt tay trên bạn mà phán “Đừng sợ chi” — Ngài đã đi qua sự chết trước bạn và nay sống đời đời.",
      },
      {
        ref: "Thi-thiên 48:14",
        note: "Bạn không phải bước vào bóng tối cuối cùng một mình; Đức Chúa Trời đời đời hứa chính Ngài sẽ dẫn dắt bạn xuyên suốt cuộc đời cho đến tận phút sau cùng.",
      },
    ],
    prayer:
      "Chúa Jêsus là Đấng Sống đời đời ơi, nghĩ đến sự hữu hạn của kiếp người đôi lúc vẫn làm lòng con rùng mình bất an. Tạ ơn Ngài đã chiến thắng sự chết và nắm giữ chìa khóa sự sống; xin dắt tay con suốt những ngày trên đất và giữ con bình yên trong niềm hy vọng đời sau. A-men.",
  },
  {
    slug: "khong-biet-cau-nguyen",
    title: "Bối rối không biết cầu nguyện thế nào",
    groupId: "lo-au",
    prompt: "Khi lòng ngổn ngang đến mức chẳng ghép nổi thành lời cầu nguyện.",
    intro:
      "Có những ngày lòng quá nặng hoặc quá rối khiến ta ngồi im trước mặt Chúa mà không biết thưa gì. Tin vui là Đức Chúa Trời không chấm điểm văn hay chữ tốt; Ngài đọc hiểu cả những tiếng thở dài không thành lời.",
    keywords: ["cầu nguyện", "nghẹn lời", "không nói nên lời", "im lặng trước Chúa"],
    passages: [
      {
        ref: "Rô-ma 8:26–27",
        note: "Khi ta không biết phải cầu xin điều gì cho xứng đáng, chính Đức Thánh Linh lấy những sự thở than không nói ra được mà cầu thay cho ta.",
      },
      {
        ref: "Ma-thi-ơ 6:7–9",
        note: "Chúa Jêsus dạy cầu nguyện không cần dài dòng hoa mỹ, vì Cha đã biết rõ điều bạn cần trước khi bạn mở miệng.",
      },
      {
        ref: "1 Sa-mu-ên 1:12–15",
        note: "Bà An-ne đau khổ đến nỗi chỉ mấp máy môi không thành tiếng, vậy mà Đức Chúa Trời lắng nghe trọn vẹn tấm lòng bà.",
      },
      {
        ref: "Thi-thiên 62:8",
        note: "Cầu nguyện đơn giản là dốc đổ nguyên vẹn tấm lòng mình ra trước mặt Chúa — cả nỗi buồn lẫn sự rối ren.",
      },
      {
        ref: "Thi-thiên 139:4",
        note: "Bạn không cần sắp câu chữ cho trôi chảy mới dám đến với Chúa: “lời chưa ở trên lưỡi tôi”, Ngài đã biết trọn hết rồi. Cứ thưa với Ngài bằng những lời vụng về nhất.",
      },
      {
        ref: "Lu-ca 11:1–4",
        note: "Ngay cả các môn đồ đi sát bên Chúa Jêsus cũng từng phải thưa rằng xin dạy chúng tôi cầu nguyện — bài cầu nguyện mẫu rất ngắn gọn của Ngài là điểm khởi đầu dịu dàng cho bạn hôm nay.",
      },
    ],
    prayer:
      "Cha ơi, lúc này lòng con ngổn ngang quá đến nỗi chẳng biết phải bắt đầu cầu nguyện từ đâu hay nói thế nào cho phải. Con chỉ xin ngồi im trước mặt Ngài, nhờ Đức Thánh Linh chuyển thấu những tiếng thở dài chưa thành lời của con lên cùng Cha. A-men.",
  },
  {
    slug: "mat-kiem-soat",
    title: "Cảm thấy mất kiểm soát cuộc sống",
    groupId: "lo-au",
    prompt: "Khi mọi kế hoạch đổ bể và mọi thứ vượt khỏi tầm tay mình.",
    intro:
      "Cảm giác mất lái khiến ai cũng chới với, nhưng thực ra ta chưa từng tự mình điều khiển nổi cả vũ trụ này. Buông đôi tay đang cố gồng cứng để tin vào quyền tể trị tốt lành của Chúa là bước đầu tìm lại bình an.",
    keywords: ["mất kiểm soát", "rối loạn", "ngoài tầm tay", "vỡ kế hoạch", "chới với"],
    passages: [
      {
        ref: "Châm-ngôn 16:9",
        note: "Lòng người có thể vạch ra rất nhiều kế hoạch, nhưng chính Đức Giê-hô-va mới là Đấng định hướng từng bước chân.",
      },
      {
        ref: "Thi-thiên 46:1–3",
        note: "Ngay cả khi đất biến đổi và núi rúng động giữa lòng biển, Đức Chúa Trời vẫn là nơi nương náu bất biến.",
      },
      {
        ref: "Mác 4:37–40",
        note: "Giữa cơn sóng lớn tưởng chừng đánh chìm thuyền, một lời phán của Chúa Jêsus đủ khiến gió biển lập tức yên lặng.",
      },
      {
        ref: "Châm-ngôn 19:21",
        note: "Giữa bao dự tính thay đổi của con người, mục đích tốt lành của Đức Giê-hô-va vẫn đứng vững bền.",
      },
      {
        ref: "Đa-ni-ên 2:20–21",
        note: "Khi mọi dự tính tuột khỏi tay bạn, lời ngợi khen của Đa-ni-ên nhắc bạn rằng thời cuộc, mùa màng và lịch sử vẫn đang nằm gọn trong sự khôn ngoan và quyền năng của Chúa.",
      },
      {
        ref: "Gia-cơ 4:13–15",
        note: "Gia-cơ nhẹ nhàng giúp bạn buông bỏ áp lực phải tự kiểm soát mọi chuyện ngày mai, và tập phó thác từng kế hoạch trong sự dẫn dắt của Chúa.",
      },
    ],
    prayer:
      "Lạy Chúa tể trị muôn vật, mọi kế hoạch con vạch ra bỗng đổ bể và mọi thứ vượt khỏi tầm tay làm con chới với quá. Con xin mở đôi tay đang cố gồng giữ ra để trao quyền điều khiển đời con lại cho Ngài, xin giữ lòng con bình tĩnh giữa sóng gió. A-men.",
  },
  {
    slug: "cho-doi-moi-mon",
    title: "Chờ đợi mỏi mòn và sốt ruột",
    groupId: "lo-au",
    prompt: "Khi phải chờ một câu trả lời hay bước ngoặt mãi chưa thấy đến.",
    intro:
      "Chờ đợi là một trong những bài học khó nhất của đời người. Trong Kinh Thánh, thời gian chờ đợi chưa bao giờ là khoảng thời gian bỏ đi; đó là lúc Đức Chúa Trời âm thầm chuẩn bị cả hoàn cảnh lẫn tấm lòng ta.",
    keywords: ["chờ đợi", "sốt ruột", "nóng ruột", "mãi chưa đến", "kiên chờ"],
    passages: [
      {
        ref: "Thi-thiên 27:14",
        note: "Hai lần nhấn mạnh lời khuyên: hãy trông đợi Đức Giê-hô-va, giữ lòng vững bền và can đảm trong lúc chờ.",
      },
      {
        ref: "Ca-thương 3:25–26",
        note: "Đức Giê-hô-va rất nhân từ với những ai biết yên lặng chờ đợi sự cứu giúp đúng kỳ của Ngài.",
      },
      {
        ref: "Thi-thiên 37:7",
        note: "Thay vì bực bội nôn nóng khi thấy người khác đi trước, hãy yên lặng trước mặt Chúa và kiên nhẫn chờ Ngài hành động.",
      },
      {
        ref: "Ha-ba-cúc 2:3",
        note: "Lời hứa của Chúa luôn có thời điểm đã định sẵn; dẫu thấy dường như chậm trễ, nó nhất định sẽ đến đúng lúc.",
      },
      {
        ref: "Hê-bơ-rơ 10:35–36",
        note: "Chờ đợi dài ngày rất dễ làm bạn nản chí và muốn bỏ dở, nhưng thư Hê-bơ-rơ khuyên bạn giữ lòng dạn dĩ cùng sự nhịn nhục để bước tiếp theo ý Chúa.",
      },
      {
        ref: "Rô-ma 8:24–25",
        note: "Hy vọng thật chỉ hiện rõ khi kết quả chưa nằm trong tầm mắt; sự chờ đợi kiên nhẫn lúc này chính là cách đức tin của bạn được rèn sâu hơn.",
      },
    ],
    prayer:
      "Thưa Chúa, chờ đợi mãi mà bước ngoặt vẫn chưa tới khiến lòng con sốt ruột và mỏi mòn lắm rồi. Xin ban cho con sự nhịn nhục bình tĩnh trong khoảng lặng này, giúp con tin vào kỳ định khôn ngoan của Ngài và tiếp tục trung tín làm điều phải hôm nay. A-men.",
  },

  // === 4. Tức giận, xung đột & tha thứ (12) ===
  {
    slug: "tuc-gian",
    title: "Tức giận và nóng nảy",
    groupId: "tuc-gian",
    prompt: "Khi cơn giận bốc lên, muốn nói lời gay gắt hoặc hành động bốc đồng.",
    intro:
      "Tức giận là cảm xúc tự nhiên khi gặp điều trái ý hay bất công, nhưng cơn nóng giận không kiềm chế sẽ phá hủy những gì ta mất nhiều năm gây dựng. Hãy hít sâu một hơi trước khi nói hay nhắn bất kỳ điều gì.",
    keywords: ["giận", "nóng giận", "bực bội", "cáu gắt", "nổi điên"],
    passages: [
      {
        ref: "Gia-cơ 1:19–20",
        note: "Nguyên tắc vàng giữa lúc nóng đầu: mau nghe, chậm nói, chậm giận — vì cơn giận bốc đồng không bao giờ làm nên công bình.",
      },
      {
        ref: "Ê-phê-sô 4:26–27",
        note: "Dù có lúc giận dữ, đừng để cơn giận kéo dài qua đêm biến thành cánh cửa cho sự cay đắng bước vào.",
      },
      {
        ref: "Châm-ngôn 15:1",
        note: "Một lời đáp êm nhẹ có sức dập tắt cơn thịnh nộ, còn lời xẳng xớm chỉ đổ thêm dầu vào lửa.",
      },
      {
        ref: "Châm-ngôn 16:32",
        note: "Người kìm giữ được cơn nóng giận của chính mình còn bản lĩnh hơn cả vị tướng đánh chiếm được một thành trì.",
      },
      {
        ref: "Truyền-đạo 7:9",
        note: "Cơn giận bốc lên quá nhanh thường che mờ sự sáng suốt của bạn; dừng lại một nhịp giúp bạn không để sự nóng nảy dẫn dắt hành động mình.",
      },
      {
        ref: "Cô-lô-se 3:8",
        note: "Phao-lô khuyên bạn dứt khoát cởi bỏ cơn thịnh nộ và lời nặng nề như cởi bỏ chiếc áo cũ, để lời nói của bạn không gây thêm vết thương mới.",
      },
    ],
    prayer:
      "Chúa ơi, cơn nóng giận lúc này đang bốc lên trong lòng con và khiến con muốn bật ra những lời gay gắt. Xin ghìm giữ miệng môi con lại, cho con chậm nói, chậm giận và đủ bình tĩnh để đáp lời cách khôn ngoan, êm dịu. A-men.",
  },
  {
    slug: "cay-dang-oan-han",
    title: "Cay đắng và oán hận",
    groupId: "tuc-gian",
    prompt: "Khi vết đau cũ kéo dài thành nỗi cay đắng gặm nhấm tâm hồn.",
    intro:
      "Sự cay đắng giống như rễ độc mọc ngầm: kẻ chịu hại nặng nề nhất không phải người làm tổn thương ta, mà chính là tâm hồn ta mỗi ngày. Kinh Thánh chỉ lối nhổ bỏ rễ đắng ấy bằng ân điển Chúa.",
    keywords: ["cay đắng", "oán hận", "hậm hực", "thù ghét", "tức tối"],
    passages: [
      {
        ref: "Hê-bơ-rơ 12:15",
        note: "Cảnh báo rất thực tế: đừng để một rễ đắng nhỏ nảy mầm trong lòng, vì nó sẽ làm rối loạn và vấy bẩn cả đời sống xung quanh.",
      },
      {
        ref: "Ê-phê-sô 4:31–32",
        note: "Bỏ sạch sự cay đắng và giận dữ không phải để bỏ trống lòng, mà để thay vào bằng sự nhân từ và lòng thương xót.",
      },
      {
        ref: "Thi-thiên 73:21–24",
        note: "Tác giả thú nhận lòng mình từng chua cay và đau nhói, nhưng khi quay lại nắm tay Chúa, lòng ông dần được chữa lành.",
      },
      {
        ref: "Châm-ngôn 14:30",
        note: "Một tấm lòng bình tĩnh nuôi dưỡng sức sống cho thân thể, còn lòng ghen tức cay đắng làm héo mòn từ bên trong.",
      },
      {
        ref: "Lê-vi Ký 19:18",
        note: "Ngay từ Cựu Ước, Chúa đã căn dặn bạn đừng giữ mãi mối hận trong lòng; buông sự oán giận chính là cách bạn bảo vệ tâm hồn mình khỏi khô héo.",
      },
      {
        ref: "1 Phi-e-rơ 2:1–2",
        note: "Cởi bỏ lòng độc ác, ghen ghét hay nói hành chưa đủ; Phi-e-rơ mời bạn lấp đầy lại khoảng trống ấy bằng Lời Chúa tinh sạch để tâm hồn được lớn lên lành mạnh.",
      },
    ],
    prayer:
      "Lạy Cha hay thương xót, vết đau cũ ở lại lâu quá đã dần hóa thành nỗi cay đắng gặm nhấm lòng con mỗi ngày. Con không muốn giữ rễ đắng này thêm nữa; xin ân điển Ngài nhẹ nhàng nhổ bỏ sự oán hận và thay vào đó sự dịu dàng, bình an của Chúa. A-men.",
  },
  {
    slug: "bi-phan-boi",
    title: "Bị phản bội",
    groupId: "tuc-gian",
    prompt: "Khi người mình tin cậy nhất lại quay lưng hoặc đâm sau lưng mình.",
    intro:
      "Nỗi đau bị kẻ thù hại không sánh nổi nỗi đau bị chính bạn thân hay người một nhà phản bội. Vua Đa-vít từng nếm trải và chính Chúa Jêsus cũng bị bạn đồng bàn bán đứng — Ngài hiểu thấu cảm giác lúc này của bạn.",
    keywords: ["phản bội", "lừa dối", "đâm sau lưng", "bội bạc", "phụ lòng"],
    passages: [
      {
        ref: "Thi-thiên 55:12–14",
        note: "Đa-vít thốt lên nỗi đau chân thực nhất: nếu là kẻ thù thì còn chịu được, đằng này lại là chính người bạn thân thiết cùng đi chung đường.",
      },
      {
        ref: "Sáng-thế Ký 50:20",
        note: "Sau khi bị chính các anh ruột bán làm nô lệ, Giô-sép nhìn thấy bàn tay Chúa biến mưu hại của con người thành điều ích lợi.",
      },
      {
        ref: "Thi-thiên 41:9–10",
        note: "Ngay cả khi người bạn tin cậy nhất trở gót phản lại, bạn vẫn có nơi nương tựa chắc chắn nơi lòng thương xót của Chúa.",
      },
      {
        ref: "2 Ti-mô-thê 4:16–17",
        note: "Khi mọi người quanh Phao-lô bỏ mặc ông giữa tòa án, chính Chúa đứng sát bên thêm sức và gìn giữ ông.",
      },
      {
        ref: "Lu-ca 22:47–48",
        note: "Chính Chúa Jêsus cũng từng bị một người trong nhóm thân cận nhất phản bội bằng nụ hôn — Ngài thấu rõ nỗi choáng váng và đau buốt bạn đang mang.",
      },
      {
        ref: "Mi-chê 7:7",
        note: "Khi lòng tin nơi người thân cận bị rạn vỡ, tiên tri Mi-chê chỉ cho bạn chỗ đứng duy nhất không bao giờ phản bội bạn: ngước trông Đức Chúa Trời.",
      },
    ],
    prayer:
      "Thưa Chúa Jêsus từng bị người thân cận phản bội, nỗi đau bị chính người mình tin cậy quay lưng khiến lòng con tan nát và bàng hoàng quá. Xin Ngài ở gần an ủi con, giữ trái tim con khỏi hóa lạnh băng và giúp con đặt trọn niềm tin nơi Đấng thành tín duy nhất. A-men.",
  },
  {
    slug: "bi-vu-khong-hieu-lam",
    title: "Bị vu khống và hiểu lầm",
    groupId: "tuc-gian",
    prompt: "Khi bị đặt điều nói xấu hoặc bị hiểu sai mà không biết thanh minh thế nào.",
    intro:
      "Bị mang tiếng oan luôn khiến ta nóng ruột muốn giải thích cho bằng được với tất cả mọi người. Hãy nhớ rằng có một Đấng thấy rõ sự thật ngay cả khi không ai tin bạn, và Ngài sẽ làm sáng tỏ lẽ công bình vào đúng lúc.",
    keywords: ["oan ức", "vu khống", "hiểu lầm", "nói xấu", "đặt điều"],
    passages: [
      {
        ref: "Thi-thiên 37:5–6",
        note: "Trao phó con đường mình cho Chúa: Ngài sẽ làm cho sự ngay thẳng của bạn sáng rực lên như ánh sáng ban trưa.",
      },
      {
        ref: "1 Phi-e-rơ 2:23",
        note: "Khi bị rủa sả oan ức, Chúa Jêsus không đôi co hăm dọa, mà phó thác hoàn toàn cho Đấng xét đoán công bình.",
      },
      {
        ref: "Ma-thi-ơ 5:11–12",
        note: "Lời an ủi sâu sắc khi bị người ta lấy mọi điều dữ nói vu cho mình vì chọn sống ngay thẳng.",
      },
      {
        ref: "Thi-thiên 31:20",
        note: "Chúa có nơi kín đáo để che chở người ngay thẳng khỏi mưu gian và những lời tranh cãi cay nghiệt của lưỡi người đời.",
      },
      {
        ref: "1 Cô-rinh-tô 4:3–5",
        note: "Khi lời thanh minh của bạn không ai chịu nghe, Phao-lô nhắc bạn rằng tòa án sau cùng thuộc về Chúa — Đấng sẽ đưa mọi sự thật ra ánh sáng đúng kỳ.",
      },
      {
        ref: "Ê-sai 54:17",
        note: "Những lời đặt điều hay xét đoán oan uổng có thể làm bạn đau lòng hôm nay, nhưng Chúa là Đấng bảo vệ sự công bình của bạn và không lời vu khống nào đứng vững mãi.",
      },
    ],
    prayer:
      "Lạy Đấng xét đoán công bình, mang tiếng oan và bị hiểu lầm khiến lòng con bức bối và chỉ muốn phân bua cho bằng được. Xin cho con sự bình tĩnh để phó thác thanh danh mình trong tay Chúa, giữ lòng ngay sạch và tin Ngài sẽ làm sáng tỏ sự thật đúng lúc. A-men.",
  },
  {
    slug: "ghen-ti-so-sanh",
    title: "Ghen tị và hay so sánh mình với người khác",
    groupId: "tuc-gian",
    prompt: "Khi thấy người khác thành công hơn mà lòng chạnh lòng, đố kỵ.",
    intro:
      "So sánh âm thầm đánh cắp niềm vui khỏi đời sống ta: nhìn lên thì sinh ghen tị, nhìn xuống lại sinh kiêu ngạo. Kinh Thánh kéo mắt ta trở về con đường riêng Chúa giao cho từng người.",
    keywords: ["ghen tị", "đố kỵ", "so sánh", "chạnh lòng", "ganh ghét"],
    passages: [
      {
        ref: "Ga-la-ti 6:4",
        note: "Mỗi người hãy tự xét công việc của chính mình mà vui, chứ đừng đặt đời mình lên bàn cân so đo với người bên cạnh.",
      },
      {
        ref: "Châm-ngôn 14:30",
        note: "Sự ghen tị giống như bệnh sâu mục trong xương cốt, âm thầm rút cạn bình an của chính người giữ nó.",
      },
      {
        ref: "Gia-cơ 3:16",
        note: "Nơi nào có ghen tương và tranh cạnh ích kỷ, nơi đó sớm muộn cũng sinh ra rối loạn và bất an.",
      },
      {
        ref: "Giăng 21:21–22",
        note: "Khi Phi-e-rơ quay sang so sánh số phận mình với Giăng, Chúa Jêsus nhẹ nhàng kéo ông lại: việc người ấy có can gì đến ngươi, ngươi hãy theo Ta.",
      },
      {
        ref: "Truyền-đạo 4:4",
        note: "Chạy đua chỉ vì lòng ganh tị với thành công của người khác rút cuộc chỉ để lại sự mệt mỏi hư không; bạn có thể bước ra khỏi cuộc đua vô nghĩa ấy hôm nay.",
      },
      {
        ref: "1 Cô-rinh-tô 13:4–6",
        note: "Tình yêu thương thật không ghen tị trước niềm vui của người khác; khi bạn thôi so đo hơn thua, lòng bạn mới đủ rộng để thật sự mừng cho họ và yên vui với phần mình.",
      },
    ],
    prayer:
      "Cha ơi, con thú nhận lòng mình hay chạnh lòng và ghen tị mỗi khi thấy người khác thuận lợi hơn con. Xin kéo mắt con khỏi bàn cân so đo ấy, giúp con biết ơn con đường riêng Chúa trao cho con và tập thật lòng mừng vui cùng người bên cạnh. A-men.",
  },
  {
    slug: "muon-tra-thu",
    title: "Muốn trả thù và đòi công bằng ngay",
    groupId: "tuc-gian",
    prompt: "Khi bị đối xử tệ và chỉ muốn ăn miếng trả miếng cho hả giận.",
    intro:
      "Phản xạ tự nhiên của con người là muốn kẻ làm hại mình phải nếm đúng nỗi đau họ gây ra. Kinh Thánh không xem nhẹ tội ác, nhưng bảo vệ bạn khỏi biến mình thành bản sao của chính kẻ làm hại bạn.",
    keywords: ["trả thù", "trả đũa", "ăn miếng trả miếng", "báo thù", "hả giận"],
    passages: [
      {
        ref: "Rô-ma 12:19–21",
        note: "Nhường quyền báo ứng lại cho Đức Chúa Trời công bình, còn phần ta là không để điều ác thắng mình mà lấy điều thiện thắng điều ác.",
      },
      {
        ref: "Châm-ngôn 20:22",
        note: "Đừng vội thề sẽ trả ác lại; hãy trông cậy Đức Giê-hô-va, Ngài biết cách bênh vực và giải cứu trọn vẹn hơn ta.",
      },
      {
        ref: "1 Tê-sa-lô-ni-ca 5:15",
        note: "Giữ mình không lấy ác trả ác với bất kỳ ai, để vòng xoáy hận thù dừng lại ngay nơi bạn.",
      },
      {
        ref: "1 Phi-e-rơ 3:9",
        note: "Đáp lại lời sỉ nhục bằng sự điềm tĩnh và chúc phước là dấu hiệu của sức mạnh tinh thần thật sự.",
      },
      {
        ref: "1 Sa-mu-ên 24:12",
        note: "Ngay khi có cơ hội hạ gục người đang săn đuổi mình, Đa-vít vẫn chọn dừng tay lại và trao việc xét xử cho Đức Giê-hô-va — đó cũng là tự do dành cho bạn.",
      },
      {
        ref: "Ma-thi-ơ 5:38–39",
        note: "Chúa Jêsus bẻ gãy quy luật ăn miếng trả miếng để bạn không bị kéo vào vòng xoáy trả đũa bất tận, mà giữ được phẩm giá và sự tự chủ trong ân điển Ngài.",
      },
    ],
    prayer:
      "Lạy Chúa công chính, khi bị đối xử tệ bạc, trong con chỉ muốn đáp trả ngay cho bõ tức. Xin giữ đôi tay và lời nói con khỏi chạy theo cơn trả đũa, giúp con nhường quyền xét xử lại cho Ngài và lấy điều thiện thắng điều ác. A-men.",
  },
  {
    slug: "kho-tha-thu-nguoi-khac",
    title: "Khó tha thứ cho người làm hại mình",
    groupId: "tuc-gian",
    prompt: "Khi biết nên tha thứ nhưng vết thương vẫn quá lớn để buông bỏ.",
    intro:
      "Tha thứ không phải là nói rằng chuyện sai trái đó chẳng sao cả, cũng không bắt buộc bạn phải quên ngay nỗi đau. Tha thứ là quyết định giao món nợ ấy vào tay Chúa để giải thoát chính trái tim mình khỏi nhà tù hận thù.",
    keywords: ["tha thứ", "buông bỏ", "khó tha thứ", "lòng bao dung"],
    passages: [
      {
        ref: "Cô-lô-se 3:13",
        note: "Sức mạnh để tha thứ cho người khác không đến từ việc tự ép mình, mà từ việc nhớ lại mình cũng đã được Chúa tha thứ nhường nào.",
      },
      {
        ref: "Ma-thi-ơ 18:21–22",
        note: "Chúa Jêsus dạy tha thứ không phải là đếm sổ từng lần, mà là nuôi dưỡng một tâm thế rộng lượng không chấp nhặt.",
      },
      {
        ref: "Mác 11:25",
        note: "Khi đứng cầu nguyện, buông bỏ mối hận với ai đó mở thông con đường bình an giữa ta với Cha trên trời.",
      },
      {
        ref: "Lu-ca 23:34",
        note: "Ngay trên thập tự giá giữa cơn đau cực độ, Chúa Jêsus cầu xin Cha tha thứ cho kẻ đóng đinh mình — mẫu gương vượt trên sức người.",
      },
      {
        ref: "Sáng-thế Ký 45:5–8",
        note: "Bị chính anh ruột bán làm nô lệ, Giô-sép vẫn tha thứ được không phải vì xem nhẹ lỗi họ, mà vì ông tin Đức Chúa Trời lớn hơn mưu hại của con người — góc nhìn ấy cũng giúp lòng bạn nhẹ dần.",
      },
      {
        ref: "Châm-ngôn 19:11",
        note: "Tha thứ không phải là dấu hiệu bạn yếu đuối hay chịu thua; Kinh Thánh gọi sự khôn ngoan biết bỏ qua lỗi phạm là danh dự của một tấm lòng lớn.",
      },
    ],
    prayer:
      "Chúa Jêsus ơi, con biết mình nên tha thứ nhưng vết thương trong lòng con vẫn còn đau lắm, tự sức con không sao buông nổi. Xin nhắc con nhớ Ngài đã tha thứ con nhiều nhường nào, và từng bước giúp con trao món nợ này vào tay Chúa để lòng con được tự do. A-men.",
  },
  {
    slug: "kho-tha-thu-chinh-minh",
    title: "Khó tha thứ cho chính mình",
    groupId: "tuc-gian",
    prompt: "Khi cứ tự dằn vặt mãi về một sai lầm cũ dù đã ăn năn.",
    intro:
      "Nhiều khi ta dễ tha thứ cho người khác nhưng lại làm quan tòa khắc nghiệt nhất với chính mình. Nếu Đức Chúa Trời đã tuyên bố tha thứ và xóa sạch lỗi lầm của bạn, bạn không cần tiếp tục tự kết án mình nữa.",
    keywords: ["tự trách", "dằn vặt", "ân hận", "tự tha thứ", "hối hận"],
    passages: [
      {
        ref: "Rô-ma 8:1",
        note: "Bản án đã được khép lại hoàn toàn: không còn sự đoán phạt nào cho người đang ở trong Đấng Christ Jêsus.",
      },
      {
        ref: "Thi-thiên 103:12",
        note: "Khi Chúa tha thứ, Ngài đẩy tội lỗi ta ra xa như phương đông cách phương tây — xa đến không bao giờ gặp lại.",
      },
      {
        ref: "1 Giăng 3:20",
        note: "Ngay cả khi lòng ta cứ tiếp tục lên án mình, Đức Chúa Trời lớn hơn lòng ta và biết rõ mọi sự.",
      },
      {
        ref: "Phi-líp 3:13–14",
        note: "Phao-lô từng có quá khứ rất nặng nề, nhưng ông chọn quên lửng điều ở đằng sau để bươn tới điều ở đằng trước.",
      },
      {
        ref: "Ê-sai 43:25",
        note: "Nếu chính Đức Chúa Trời đã xóa sạch lỗi phạm và chọn không nhắc lại tội cũ của bạn nữa, bạn cũng có thể nhẹ nhàng buông xuống chiếc búa tự kết án mình.",
      },
      {
        ref: "Hê-bơ-rơ 8:12",
        note: "Giao ước mới của Chúa bảo đảm sự tha thứ trọn vẹn chứ không nửa vời — khi bạn đã ăn năn quay về, đừng tiếp tục giam mình trong bản án Chúa đã xé bỏ.",
      },
    ],
    prayer:
      "Lạy Cha hay tha thứ, dù con đã xưng tội và ăn năn rồi nhưng lòng con vẫn cứ tự dằn vặt và kết án mình mãi về sai lầm cũ. Xin giúp con tin nhận trọn vẹn ơn tha thứ Ngài đã tuyên bố trong Đấng Christ, để con thôi nhìn lại quá khứ mà bước tiếp bình an. A-men.",
  },
  {
    slug: "cai-va-bat-hoa",
    title: "Cãi vã và bất hòa",
    groupId: "tuc-gian",
    prompt: "Khi đang căng thẳng tranh cãi với người thân, bạn bè hay đồng nghiệp.",
    intro:
      "Trong một cuộc tranh cãi, thắng phần lý mà đánh mất tình nghĩa thường là thua cả hai. Những lời khôn ngoan từ Kinh Thánh giúp hạ nhiệt bầu không khí và mở lại đối thoại chân thành.",
    keywords: ["cãi nhau", "xung đột", "bất hòa", "tranh cãi", "mâu thuẫn"],
    passages: [
      {
        ref: "Châm-ngôn 17:14",
        note: "Cãi vã giống như làm vỡ bờ đê: càng kéo dài càng khó chặn lại, nên biết dừng sớm là sự khôn ngoan lớn.",
      },
      {
        ref: "Rô-ma 12:18",
        note: "Lời khuyên vừa nhân hậu vừa thực tế: hết sức giữ sự hòa thuận trong phần trách nhiệm của chính mình.",
      },
      {
        ref: "Châm-ngôn 15:18",
        note: "Người nóng nảy làm bùng lên tranh cãi, còn người chậm giận biết cách dập tắt xung đột.",
      },
      {
        ref: "Ma-thi-ơ 5:23–24",
        note: "Chúa đặt việc chủ động làm hòa với anh em mình lên vị trí rất quan trọng, ngay trước cả nghi lễ thờ phượng.",
      },
      {
        ref: "2 Ti-mô-thê 2:24–25",
        note: "Giữa lúc căng thẳng muốn tranh cho bằng được phần thắng, Phao-lô nhắc bạn đừng ưa tranh cạnh, mà chọn thái độ tử tế, nhịn nhục và mềm mại để mở lối đối thoại.",
      },
      {
        ref: "Gia-cơ 3:17–18",
        note: "Sự khôn ngoan từ Chúa không châm ngòi cho cuộc cãi vã gay gắt hơn, mà giúp bạn chọn lời hòa thuận, nhu mì để gieo lại bình an cho mối quan hệ.",
      },
    ],
    prayer:
      "Lạy Chúa của sự hòa bình, cuộc tranh cãi vừa rồi làm bầu không khí trở nên nặng nề và cả hai bên đều mệt mỏi. Xin hạ cái tôi đang muốn thắng thua của con xuống, ban cho con lời nói dịu dàng và lòng khiêm nhường để chủ động giữ sự hòa thuận. A-men.",
  },
  {
    slug: "chiu-bat-cong",
    title: "Chịu đựng sự bất công",
    groupId: "tuc-gian",
    prompt: "Khi thấy kẻ gian trục lợi còn người ngay thẳng chịu thiệt thòi.",
    intro:
      "Nhìn thấy sự bất công mà lòng không nổi sóng mới là điều lạ. Kinh Thánh chưa bao giờ làm ngơ trước bất công; trái lại, sách Thi-thiên và các tiên tri đồng hành cùng nỗi bất bình chính đáng của bạn và khẳng định công lý sau cùng thuộc về Chúa.",
    keywords: ["bất công", "chịu thiệt", "áp bức", "công lý", "oan trái"],
    passages: [
      {
        ref: "Thi-thiên 37:1–9",
        note: "Đừng vì thấy kẻ làm gian ác thịnh vượng tạm thời mà nóng lòng đánh mất sự ngay thẳng của mình; cuối cùng họ sẽ tàn nhanh như cỏ.",
      },
      {
        ref: "Thi-thiên 103:6",
        note: "Đức Giê-hô-va không đứng ngoài cuộc: Ngài thi hành sự công bình và bênh vực mọi người bị hà hiếp.",
      },
      {
        ref: "Mi-chê 6:8",
        note: "Giữa xã hội nhiều bất công, điều Chúa đòi nơi mỗi chúng ta vẫn rất rõ: làm sự công bình, ưa nhân từ và bước đi khiêm nhường.",
      },
      {
        ref: "1 Phi-e-rơ 2:19–20",
        note: "Chịu thiệt thòi oan ức vì chọn làm điều ngay thẳng là điều được Đức Chúa Trời ghi nhận và trân quý.",
      },
      {
        ref: "Ê-sai 30:18",
        note: "Khi thấy sự bất công kéo dài mà chưa được giải quyết, lời này nhắc bạn rằng Đức Giê-hô-va là Đức Chúa Trời công nghĩa và Ngài không hề làm ngơ trước người trông đợi Ngài.",
      },
      {
        ref: "A-mốt 5:24",
        note: "Nỗi bất bình của bạn trước điều bất công chạm đúng tấm lòng Đức Chúa Trời — Đấng mong thấy sự chánh trực và công bình tuôn chảy mạnh mẽ như dòng sông chẳng cạn.",
      },
    ],
    prayer:
      "Ôi Đức Chúa Trời công nghĩa, chứng kiến sự bất công và chịu thiệt thòi vô lý khiến lòng con bức xúc và tủi hờn lắm. Xin giữ con khỏi chai sạn hay thỏa hiệp với cái sai, thêm sức cho con tiếp tục sống ngay thẳng và tin cậy công lý sau cùng ở nơi Ngài. A-men.",
  },
  {
    slug: "mat-niem-tin-con-nguoi",
    title: "Mất niềm tin vào con người",
    groupId: "tuc-gian",
    prompt: "Khi trải qua nhiều thất vọng khiến bạn muốn khép cửa lòng lại.",
    intro:
      "Sau vài lần bị lợi dụng hay phụ bạc, tự nhiên ta muốn dựng bức tường thật dày quanh mình. Kinh Thánh dạy ta sống tỉnh táo, không ngây thơ đặt trọn linh hồn nơi con người bất toàn — nhưng vẫn giữ trái tim ấm áp nhờ tin cậy Chúa.",
    keywords: ["khép lòng", "không tin ai", "thất vọng con người", "hoài nghi"],
    passages: [
      {
        ref: "Thi-thiên 118:8–9",
        note: "Nương náu nơi Đức Giê-hô-va luôn vững chắc hơn là gửi trọn hy vọng vào con người hay quyền thế trần gian.",
      },
      {
        ref: "Giăng 2:24–25",
        note: "Chính Chúa Jêsus hiểu rõ lòng người thay đổi thế nào; Ngài không ảo tưởng về con người, nhưng vẫn yêu thương và cứu chuộc họ.",
      },
      {
        ref: "Giê-rê-mi 17:7–8",
        note: "Khi rễ niềm tin cắm sâu nơi Đức Giê-hô-va, những biến động từ người đời không làm cây đời ta héo khô.",
      },
      {
        ref: "1 Cô-rinh-tô 13:7",
        note: "Tình yêu thương chân thật không mù quáng, nhưng vẫn kiên trì giữ lòng tin tưởng vào điều tốt lành Chúa có thể làm nơi con người.",
      },
      {
        ref: "Ma-thi-ơ 10:16",
        note: "Chúa Jêsus không bảo bạn ngây thơ để bị lợi dụng mãi, cũng không muốn bạn chai cứng hoài nghi — Ngài dạy bạn sống vừa tỉnh táo khôn khéo vừa giữ tấm lòng đơn sơ.",
      },
      {
        ref: "Hê-bơ-rơ 13:8",
        note: "Lòng người nay thế này mai thế khác dễ làm bạn muốn đóng cửa tim lại, nhưng Chúa Jêsus trước sau như một vẫn là điểm tựa đáng tin cậy tuyệt đối cho bạn.",
      },
    ],
    prayer:
      "Kính lạy Chúa không hề thay đổi, sau những lần thất vọng vì người đời, con thấy mình chỉ muốn khép chặt cửa lòng để khỏi bị tổn thương nữa. Xin làm điểm tựa vững chắc cho niềm tin của con, dạy con vừa tỉnh táo khôn ngoan vừa giữ được trái tim ấm áp. A-men.",
  },
  {
    slug: "doi-dien-nguoi-kho-tinh",
    title: "Đối diện với người khó tính và thù ghét mình",
    groupId: "tuc-gian",
    prompt: "Khi phải chung sống hay làm việc với người cay nghiệt, hay gây khó dễ.",
    intro:
      "Không phải lúc nào ta cũng có thể tránh mặt người làm mình khó chịu. Kinh Thánh chỉ ra cách ứng xử vừa vững vàng, vừa không để sự cay nghiệt của họ kéo mình xuống cùng mức độ.",
    keywords: ["người khó tính", "kẻ thù", "ghét mình", "đối xử tệ", "khó chịu"],
    passages: [
      {
        ref: "Lu-ca 6:27–28",
        note: "Lời dạy đầy thách thức của Chúa Jêsus: chúc phước và cầu nguyện cho người đối xử tệ giúp trái tim ta không bị chai cứng.",
      },
      {
        ref: "Châm-ngôn 25:21–22",
        note: "Sự tử tế chân thành trước thái độ thù nghịch có sức lay động lương tâm mạnh hơn mọi lời đôi co.",
      },
      {
        ref: "Châm-ngôn 16:7",
        note: "Khi đường lối ta đẹp lòng Đức Giê-hô-va, Ngài thậm chí có thể làm dịu lòng những kẻ từng chống đối ta.",
      },
      {
        ref: "Rô-ma 12:14",
        note: "Chọn chúc phước thay vì rủa sả giữ cho tâm trí bạn luôn sáng sủa và thanh thản.",
      },
      {
        ref: "Truyền-đạo 10:4",
        note: "Khi gặp cấp trên hay người xung quanh hay nổi giận và gây khó dễ, giữ sự điềm tĩnh mềm mại giúp bạn đứng vững mà không khiến mâu thuẫn bùng lớn thêm.",
      },
      {
        ref: "Cô-lô-se 4:6",
        note: "Trước những lời cay nghiệt dễ làm bạn phản ứng gay gắt lại, hãy xin Chúa cho lời đáp của bạn luôn có sự ân hậu và khôn khéo đúng mực.",
      },
    ],
    prayer:
      "Lạy Cha dịu dàng, mỗi ngày phải tiếp xúc với người hay gây khó dễ và nói lời cay nghiệt thật sự làm con kiệt sức. Xin giữ lòng con khỏi trở nên gay gắt giống họ, cho con lời đáp ân hậu, sự mềm mại vững vàng và đủ ơn để cầu nguyện cho chính họ. A-men.",
  },
];
