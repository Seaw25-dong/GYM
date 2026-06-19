const glossaryTerms = {
  BMI: {
    term: "BMI",
    title: "Chỉ số khối cơ thể",
    short:
      "BMI = cân nặng / chiều cao bình phương. Dùng để tham khảo nhanh tình trạng cân nặng.",
    description:
      "BMI là chỉ số khối cơ thể, tính bằng cân nặng kg chia cho bình phương chiều cao mét. BMI hữu ích để nhìn tổng quan, nhưng không phân biệt được cơ bắp và mỡ nên chỉ nên dùng như một tín hiệu tham khảo.",
    formula: "BMI = weight(kg) / height(m)^2",
  },
  BMR: {
    term: "BMR",
    title: "Năng lượng nền",
    short:
      "Lượng calo cơ thể cần khi nghỉ ngơi hoàn toàn để duy trì chức năng sống.",
    description:
      "BMR là lượng năng lượng tối thiểu cơ thể tiêu hao khi nghỉ ngơi. App dùng công thức Mifflin-St Jeor dựa trên cân nặng, chiều cao, tuổi và giới tính.",
    formula: "Nam: 10W + 6.25H - 5A + 5; Nữ: 10W + 6.25H - 5A - 161",
  },
  TDEE: {
    term: "TDEE",
    title: "Tổng năng lượng tiêu hao mỗi ngày",
    short:
      "Ước tính tổng calo bạn đốt trong một ngày, gồm BMR và mức vận động.",
    description:
      "TDEE là tổng năng lượng tiêu hao hằng ngày. Đây là mốc quan trọng để quyết định nên ăn deficit để giảm mỡ hay surplus để tăng cơ.",
    formula: "TDEE = BMR x activity multiplier + điều chỉnh buổi tập",
  },
  Macro: {
    term: "Macro",
    title: "Protein, Carb, Fat",
    short:
      "Ba nhóm dinh dưỡng chính tạo nên tổng calo: protein, carb và fat.",
    description:
      "Macro là cách chia tổng calo thành protein, carbohydrate và fat. Với tăng cơ/giảm mỡ, protein thường được ưu tiên để giữ hoặc xây cơ.",
    formula: "Protein/Carb = 4 kcal mỗi gram; Fat = 9 kcal mỗi gram",
  },
  "Calorie Deficit": {
    term: "Calorie Deficit",
    title: "Thâm hụt calo",
    short:
      "Ăn ít calo hơn TDEE để cơ thể có xu hướng giảm cân, giảm mỡ.",
    description:
      "Calorie Deficit là trạng thái nạp ít năng lượng hơn mức tiêu hao. Deficit vừa phải giúp giảm mỡ bền hơn và ít ảnh hưởng hiệu suất tập.",
    formula: "Calo mục tiêu = TDEE - 300 đến 500 kcal",
  },
  "Calorie Surplus": {
    term: "Calorie Surplus",
    title: "Dư calo",
    short:
      "Ăn nhiều calo hơn TDEE để hỗ trợ tăng cân và xây cơ.",
    description:
      "Calorie Surplus là trạng thái nạp nhiều năng lượng hơn mức tiêu hao. Surplus nhỏ giúp tăng cơ nhưng hạn chế tăng mỡ quá nhanh.",
    formula: "Calo mục tiêu = TDEE + 200 đến 300 kcal",
  },
};

function getTerm(key) {
  return glossaryTerms[key];
}

export { glossaryTerms, getTerm };
