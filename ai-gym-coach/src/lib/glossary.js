const glossaryTerms = {
  BMI: {
    category: "Chỉ số cơ thể",
    term: "BMI",
    title: "Chỉ số khối cơ thể",
    short:
      "BMI = cân nặng / chiều cao bình phương. Dùng để tham khảo nhanh tình trạng cân nặng.",
    description:
      "BMI là chỉ số khối cơ thể, tính bằng cân nặng kg chia cho bình phương chiều cao mét. BMI hữu ích để nhìn tổng quan, nhưng không phân biệt được cơ bắp và mỡ nên chỉ nên dùng như một tín hiệu tham khảo.",
    formula: "BMI = weight(kg) / height(m)^2",
  },
  BMR: {
    category: "Chỉ số cơ thể",
    term: "BMR",
    title: "Năng lượng nền",
    short:
      "Lượng calo cơ thể cần khi nghỉ ngơi hoàn toàn để duy trì chức năng sống.",
    description:
      "BMR là lượng năng lượng tối thiểu cơ thể tiêu hao khi nghỉ ngơi. App dùng công thức Mifflin-St Jeor dựa trên cân nặng, chiều cao, tuổi và giới tính.",
    formula: "Nam: 10W + 6.25H - 5A + 5; Nữ: 10W + 6.25H - 5A - 161",
  },
  TDEE: {
    category: "Dinh dưỡng",
    term: "TDEE",
    title: "Tổng năng lượng tiêu hao mỗi ngày",
    short:
      "Ước tính tổng calo bạn đốt trong một ngày, gồm BMR và mức vận động.",
    description:
      "TDEE là tổng năng lượng tiêu hao hằng ngày. Đây là mốc quan trọng để quyết định nên ăn deficit để giảm mỡ hay surplus để tăng cơ.",
    formula: "TDEE = BMR x activity multiplier + điều chỉnh buổi tập",
  },
  Macro: {
    category: "Dinh dưỡng",
    term: "Macro",
    title: "Protein, Carb, Fat",
    short:
      "Ba nhóm dinh dưỡng chính tạo nên tổng calo: protein, carb và fat.",
    description:
      "Macro là cách chia tổng calo thành protein, carbohydrate và fat. Với tăng cơ/giảm mỡ, protein thường được ưu tiên để giữ hoặc xây cơ.",
    formula: "Protein/Carb = 4 kcal mỗi gram; Fat = 9 kcal mỗi gram",
  },
  "Calorie Deficit": {
    category: "Dinh dưỡng",
    term: "Calorie Deficit",
    title: "Thâm hụt calo",
    short:
      "Ăn ít calo hơn TDEE để cơ thể có xu hướng giảm cân, giảm mỡ.",
    description:
      "Calorie Deficit là trạng thái nạp ít năng lượng hơn mức tiêu hao. Deficit vừa phải giúp giảm mỡ bền hơn và ít ảnh hưởng hiệu suất tập.",
    formula: "Calo mục tiêu = TDEE - 300 đến 500 kcal",
  },
  "Calorie Surplus": {
    category: "Dinh dưỡng",
    term: "Calorie Surplus",
    title: "Dư calo",
    short:
      "Ăn nhiều calo hơn TDEE để hỗ trợ tăng cân và xây cơ.",
    description:
      "Calorie Surplus là trạng thái nạp nhiều năng lượng hơn mức tiêu hao. Surplus nhỏ giúp tăng cơ nhưng hạn chế tăng mỡ quá nhanh.",
    formula: "Calo mục tiêu = TDEE + 200 đến 300 kcal",
  },
  RPE: {
    category: "Cường độ",
    term: "RPE",
    title: "Mức gắng sức cảm nhận",
    short: "Thang điểm 1–10 mô tả một set nặng đến đâu dựa trên cảm nhận.",
    description: "RPE giúp tự điều chỉnh tải theo thể trạng trong ngày. RPE 10 là không thể thực hiện thêm rep nào; RPE 8 thường tương đương còn khoảng 2 rep.",
    formula: "RPE 10 ≈ 0 RIR; RPE 9 ≈ 1 RIR; RPE 8 ≈ 2 RIR",
  },
  RIR: {
    category: "Cường độ",
    term: "RIR",
    title: "Số rep còn lại",
    short: "Ước tính bạn còn thực hiện được bao nhiêu rep trước khi thất bại kỹ thuật.",
    description: "RIR là cách thực tế để kiểm soát cường độ. Phần lớn set tăng cơ có thể kết thúc khi còn khoảng 1–3 rep với kỹ thuật tốt.",
    formula: "2 RIR = dừng set khi ước tính vẫn còn làm được 2 rep",
  },
  "1RM": {
    category: "Cường độ",
    term: "1RM",
    title: "Mức tạ tối đa một rep",
    short: "Khối lượng lớn nhất bạn có thể nâng đúng kỹ thuật trong một lần lặp.",
    description: "1RM thường dùng để theo dõi sức mạnh và quy đổi mức tạ cho chương trình. Người mới không cần test tối đa trực tiếp; có thể ước tính từ set nhiều rep.",
    formula: "Epley ước tính: 1RM ≈ weight × (1 + reps / 30)",
  },
  "Progressive Overload": {
    category: "Lập chương trình",
    term: "Progressive Overload",
    title: "Tăng tiến quá tải",
    short: "Tăng dần yêu cầu tập luyện để cơ thể tiếp tục thích nghi.",
    description: "Không chỉ là tăng tạ. Bạn có thể tăng rep, set, biên độ, chất lượng kỹ thuật hoặc giảm mức gắng sức ở cùng khối lượng.",
    formula: "Ví dụ: 60kg × 8 → 60kg × 10 → 62.5kg × 8",
  },
  Volume: {
    category: "Lập chương trình",
    term: "Volume",
    title: "Khối lượng tập luyện",
    short: "Tổng lượng công việc thực hiện trong buổi hoặc tuần.",
    description: "Trong thực hành tăng cơ, volume thường được theo dõi bằng số hard set cho mỗi nhóm cơ mỗi tuần thay vì chỉ dùng tổng kilogram.",
    formula: "Tonnage = sets × reps × weight",
  },
  Intensity: {
    category: "Cường độ",
    term: "Intensity",
    title: "Cường độ tập",
    short: "Có thể chỉ phần trăm 1RM hoặc mức độ set tiến gần thất bại.",
    description: "Intensity không đồng nghĩa với cảm giác mệt chung. Trong tập sức mạnh, nó thường là %1RM; trong tăng cơ, RPE/RIR giúp mô tả rõ hơn.",
    formula: "Intensity tương đối = weight / 1RM × 100%",
  },
  Hypertrophy: {
    category: "Mục tiêu",
    term: "Hypertrophy",
    title: "Phì đại cơ",
    short: "Quá trình sợi cơ tăng kích thước nhờ tập luyện và phục hồi.",
    description: "Tăng cơ cần đủ stimulus, protein, năng lượng và thời gian phục hồi. Cảm giác pump hoặc đau cơ không tự động đồng nghĩa với hypertrophy tốt hơn.",
    formula: "Stimulus phù hợp + dinh dưỡng + phục hồi + thời gian",
  },
  Recomp: {
    category: "Mục tiêu",
    term: "Body Recomposition",
    title: "Tái cấu trúc cơ thể",
    short: "Tăng cơ đồng thời giảm mỡ trong một giai đoạn.",
    description: "Recomp thường khả thi hơn với người mới, người quay lại tập hoặc người có tỷ lệ mỡ cao. Tiến độ có thể chậm dù cân nặng ít thay đổi.",
    formula: "Theo dõi vòng đo, ảnh, sức mạnh và cân nặng cùng nhau",
  },
  "Compound Exercise": {
    category: "Kỹ thuật",
    term: "Compound Exercise",
    title: "Bài tập đa khớp",
    short: "Động tác sử dụng nhiều khớp và nhiều nhóm cơ cùng lúc.",
    description: "Squat, bench press, row và deadlift là các ví dụ phổ biến. Compound hiệu quả về thời gian nhưng không bắt buộc phải là lựa chọn duy nhất để tăng cơ.",
    formula: "Ví dụ: Squat dùng khớp háng, gối và cổ chân",
  },
  "Isolation Exercise": {
    category: "Kỹ thuật",
    term: "Isolation Exercise",
    title: "Bài tập cô lập",
    short: "Động tác chủ yếu tập trung vào một khớp hoặc nhóm cơ.",
    description: "Lateral raise, leg curl và biceps curl giúp bổ sung volume có mục tiêu với mức mệt toàn thân thấp hơn bài compound.",
    formula: "Ví dụ: Biceps curl chủ yếu gập khuỷu tay",
  },
  ROM: {
    category: "Kỹ thuật",
    term: "ROM",
    title: "Biên độ chuyển động",
    short: "Khoảng chuyển động của khớp trong một rep.",
    description: "ROM phù hợp phụ thuộc bài tập, cấu trúc cơ thể và khả năng kiểm soát. Ưu tiên biên độ không đau, ổn định và có chủ đích.",
    formula: "ROM = vị trí bắt đầu → điểm cuối có kiểm soát",
  },
  Tempo: {
    category: "Kỹ thuật",
    term: "Tempo",
    title: "Nhịp độ một rep",
    short: "Tốc độ của các pha hạ tạ, dừng, nâng và giữ.",
    description: "Tempo giúp kiểm soát kỹ thuật và tránh dùng quán tính. Không cần cố tình làm mọi rep quá chậm nếu điều đó khiến tải và số rep giảm mạnh.",
    formula: "3-1-1-0 = hạ 3s, dừng 1s, nâng 1s, không dừng trên",
  },
  Deload: {
    category: "Phục hồi",
    term: "Deload",
    title: "Tuần giảm tải",
    short: "Giai đoạn chủ động giảm volume hoặc intensity để hồi phục.",
    description: "Deload có thể hữu ích khi mệt tích lũy, hiệu suất giảm và đau nhức kéo dài. Không nhất thiết phải lên lịch cố định nếu chương trình đang tiến triển tốt.",
    formula: "Ví dụ: giảm 30–50% số set trong một tuần",
  },
  DOMS: {
    category: "Phục hồi",
    term: "DOMS",
    title: "Đau cơ khởi phát muộn",
    short: "Đau và cứng cơ thường xuất hiện 12–48 giờ sau buổi tập lạ hoặc nặng.",
    description: "DOMS không phải thước đo trực tiếp của một buổi tập hiệu quả. Đau dữ dội, sưng bất thường hoặc nước tiểu sẫm màu cần được đánh giá y tế.",
    formula: "DOMS thường giảm khi cơ thể quen dần với stimulus",
  },
  "Training to Failure": {
    category: "Cường độ",
    term: "Training to Failure",
    title: "Tập đến thất bại",
    short: "Tiếp tục set đến khi không thể hoàn thành rep tiếp theo đúng kỹ thuật.",
    description: "Failure có thể dùng có chọn lọc, thường phù hợp hơn với bài máy hoặc isolation. Lạm dụng ở compound nặng làm tăng mệt và rủi ro kỹ thuật.",
    formula: "Technical failure = rep tiếp theo không thể giữ kỹ thuật chấp nhận được",
  },
  Superset: {
    category: "Kỹ thuật",
    term: "Superset",
    title: "Hai bài tập liên tiếp",
    short: "Thực hiện hai bài gần như không nghỉ giữa chúng rồi mới nghỉ.",
    description: "Superset tiết kiệm thời gian. Ghép hai nhóm cơ đối lập hoặc bài ít cạnh tranh thường giúp giữ hiệu suất tốt hơn.",
    formula: "Bài A → Bài B → nghỉ → lặp lại",
  },
  NEAT: {
    category: "Dinh dưỡng",
    term: "NEAT",
    title: "Vận động ngoài tập luyện",
    short: "Năng lượng tiêu hao từ đi bộ, đứng và các hoạt động thường ngày.",
    description: "NEAT có thể thay đổi đáng kể khi ăn kiêng. Theo dõi số bước giúp duy trì mức vận động ổn định thay vì chỉ tăng cardio.",
    formula: "NEAT không bao gồm tập có chủ đích, tiêu hóa hay BMR",
  },
};

function getTerm(key) {
  return glossaryTerms[key];
}

export { glossaryTerms, getTerm };
