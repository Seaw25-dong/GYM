const exerciseGroups = [
  {
    group: "Ngực",
    exercises: [
      {
        name: "Bench Press",
        equipment: "Barbell, bench",
        level: "Cơ bản",
        muscles: ["Chest", "Triceps", "Front delts"],
        instruction: "Giữ vai ép xuống ghế, hạ tạ có kiểm soát, đẩy lên theo đường hơi chéo về phía rack.",
        mediaSearchQuery: "bench press form animation",
      },
      {
        name: "Incline Dumbbell Press",
        equipment: "Dumbbells, incline bench",
        level: "Cơ bản",
        muscles: ["Upper chest", "Triceps"],
        instruction: "Ghế nghiêng 20-35 độ, hạ tạ đến ngang ngực trên, không để vai nhô quá cao.",
        mediaSearchQuery: "incline dumbbell press animation",
      },
      {
        name: "Cable Fly",
        equipment: "Cable machine",
        level: "Trung cấp",
        muscles: ["Chest"],
        instruction: "Giữ khuỷu tay hơi cong, kéo cáp theo vòng cung và siết ngực ở cuối biên độ.",
        mediaSearchQuery: "cable fly chest animation",
      },
    ],
  },
  {
    group: "Lưng",
    exercises: [
      {
        name: "Lat Pulldown",
        equipment: "Cable machine",
        level: "Cơ bản",
        muscles: ["Lats", "Biceps"],
        instruction: "Kéo khuỷu tay xuống sát thân, ngực mở, tránh giật người ra sau quá nhiều.",
        mediaSearchQuery: "lat pulldown animation",
      },
      {
        name: "Seated Row",
        equipment: "Cable row",
        level: "Cơ bản",
        muscles: ["Mid back", "Lats"],
        instruction: "Kéo về sát bụng, giữ lưng trung lập và siết bả vai ở cuối động tác.",
        mediaSearchQuery: "seated cable row animation",
      },
      {
        name: "Romanian Deadlift",
        equipment: "Barbell or dumbbells",
        level: "Trung cấp",
        muscles: ["Hamstrings", "Glutes", "Back"],
        instruction: "Đẩy hông ra sau, giữ lưng thẳng, cảm nhận căng gân kheo rồi kéo hông về.",
        mediaSearchQuery: "romanian deadlift animation",
      },
    ],
  },
  {
    group: "Chân",
    exercises: [
      {
        name: "Squat",
        equipment: "Barbell",
        level: "Trung cấp",
        muscles: ["Quads", "Glutes", "Core"],
        instruction: "Gồng core, đầu gối đi theo hướng mũi chân, xuống sâu trong biên độ kiểm soát.",
        mediaSearchQuery: "barbell squat animation",
      },
      {
        name: "Leg Press",
        equipment: "Leg press machine",
        level: "Cơ bản",
        muscles: ["Quads", "Glutes"],
        instruction: "Không khóa gối ở đỉnh, hạ platform đến khi gối gập đủ sâu mà lưng không cong.",
        mediaSearchQuery: "leg press animation",
      },
      {
        name: "Walking Lunge",
        equipment: "Bodyweight or dumbbells",
        level: "Cơ bản",
        muscles: ["Quads", "Glutes"],
        instruction: "Bước dài vừa phải, thân người thẳng, đẩy lên bằng chân trước.",
        mediaSearchQuery: "walking lunge animation",
      },
    ],
  },
  {
    group: "Vai",
    exercises: [
      {
        name: "Overhead Press",
        equipment: "Barbell or dumbbells",
        level: "Trung cấp",
        muscles: ["Shoulders", "Triceps"],
        instruction: "Gồng bụng, đẩy tạ thẳng lên trên đầu, không ưỡn lưng quá mức.",
        mediaSearchQuery: "overhead press animation",
      },
      {
        name: "Lateral Raise",
        equipment: "Dumbbells",
        level: "Cơ bản",
        muscles: ["Side delts"],
        instruction: "Nâng tạ sang hai bên đến ngang vai, giữ cổ tay trung lập và không vung người.",
        mediaSearchQuery: "dumbbell lateral raise animation",
      },
    ],
  },
  {
    group: "Tay trước",
    exercises: [
      {
        name: "Dumbbell Curl",
        equipment: "Dumbbells",
        level: "Cơ bản",
        muscles: ["Biceps"],
        instruction: "Giữ khuỷu tay gần thân, cuốn tạ lên có kiểm soát và hạ chậm.",
        mediaSearchQuery: "dumbbell curl animation",
      },
      {
        name: "Hammer Curl",
        equipment: "Dumbbells",
        level: "Cơ bản",
        muscles: ["Biceps", "Forearms"],
        instruction: "Cầm neutral grip, không đung đưa thân người, kiểm soát pha hạ.",
        mediaSearchQuery: "hammer curl animation",
      },
    ],
  },
  {
    group: "Tay sau",
    exercises: [
      {
        name: "Triceps Pushdown",
        equipment: "Cable machine",
        level: "Cơ bản",
        muscles: ["Triceps"],
        instruction: "Giữ khuỷu tay cố định sát thân, duỗi tay xuống và siết tay sau.",
        mediaSearchQuery: "triceps pushdown animation",
      },
      {
        name: "Overhead Triceps Extension",
        equipment: "Dumbbell or cable",
        level: "Cơ bản",
        muscles: ["Triceps long head"],
        instruction: "Giữ khuỷu hướng lên, hạ tạ sau đầu rồi duỗi lên có kiểm soát.",
        mediaSearchQuery: "overhead triceps extension animation",
      },
    ],
  },
];

const fallbackWorkoutExercises = [
  { name: "Bench Press", sets: 4, reps: "6-8", restSeconds: 120, note: "Bài chính, ưu tiên kỹ thuật chắc." },
  { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", restSeconds: 90, note: "Tập trung ngực trên." },
  { name: "Lat Pulldown", sets: 3, reps: "10-12", restSeconds: 90, note: "Kéo bằng khuỷu tay, không giật người." },
  { name: "Seated Row", sets: 3, reps: "10-12", restSeconds: 90, note: "Siết bả vai cuối động tác." },
  { name: "Lateral Raise", sets: 3, reps: "12-15", restSeconds: 60, note: "Không vung người." },
  { name: "Triceps Pushdown", sets: 3, reps: "12-15", restSeconds: 60, note: "Giữ khuỷu cố định." },
];

export { exerciseGroups, fallbackWorkoutExercises };
