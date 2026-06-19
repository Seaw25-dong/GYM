const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
};

const goalSettings = {
  fat_loss: {
    label: "Giảm mỡ",
    calorieOffset: -500,
    proteinPerKg: 2.2,
    fatPerKg: 0.8,
    focus: "Giữ sức mạnh và cơ bắp trong khi tạo thâm hụt calo ổn định.",
  },
  muscle_gain: {
    label: "Tăng cơ",
    calorieOffset: 300,
    proteinPerKg: 2,
    fatPerKg: 0.9,
    focus: "Xây cơ với mức dư calo vừa phải và tăng tải có kiểm soát.",
  },
  recomp: {
    label: "Tái cấu trúc cơ thể",
    calorieOffset: -100,
    proteinPerKg: 2.2,
    fatPerKg: 0.8,
    focus: "Cải thiện tỉ lệ cơ/mỡ gần mức duy trì calo, ưu tiên protein cao.",
  },
};

const exerciseLibrary = {
  Push: [
    { name: "Bench Press", muscleGroup: "Ngực", sets: 4, reps: "6-8", restSeconds: 120, note: "Bài compound chính." },
    { name: "Incline Dumbbell Press", muscleGroup: "Ngực trên", sets: 3, reps: "8-10", restSeconds: 90, note: "Kiểm soát biên độ." },
    { name: "Cable Fly", muscleGroup: "Ngực", sets: 3, reps: "12-15", restSeconds: 60, note: "Siết ngực cuối động tác." },
    { name: "Overhead Press", muscleGroup: "Vai", sets: 3, reps: "8-10", restSeconds: 90, note: "Gồng core, không ưỡn lưng." },
    { name: "Lateral Raise", muscleGroup: "Vai giữa", sets: 3, reps: "12-15", restSeconds: 60, note: "Không vung người." },
    { name: "Triceps Pushdown", muscleGroup: "Tay sau", sets: 3, reps: "12-15", restSeconds: 60, note: "Giữ khuỷu cố định." },
  ],
  Pull: [
    { name: "Lat Pulldown", muscleGroup: "Lưng xô", sets: 4, reps: "8-10", restSeconds: 90, note: "Kéo bằng khuỷu tay." },
    { name: "Seated Row", muscleGroup: "Lưng giữa", sets: 3, reps: "10-12", restSeconds: 90, note: "Siết bả vai." },
    { name: "Romanian Deadlift", muscleGroup: "Gân kheo/lưng", sets: 3, reps: "8-10", restSeconds: 120, note: "Đẩy hông ra sau." },
    { name: "Face Pull", muscleGroup: "Vai sau", sets: 3, reps: "12-15", restSeconds: 60, note: "Kéo về ngang mặt." },
    { name: "Dumbbell Curl", muscleGroup: "Tay trước", sets: 3, reps: "10-12", restSeconds: 60, note: "Không đung đưa thân." },
  ],
  Legs: [
    { name: "Squat", muscleGroup: "Đùi trước", sets: 4, reps: "5-8", restSeconds: 150, note: "Giữ core chặt." },
    { name: "Leg Press", muscleGroup: "Đùi trước/mông", sets: 3, reps: "10-12", restSeconds: 90, note: "Không khóa gối." },
    { name: "Romanian Deadlift", muscleGroup: "Gân kheo", sets: 3, reps: "8-10", restSeconds: 120, note: "Cảm nhận căng gân kheo." },
    { name: "Walking Lunge", muscleGroup: "Mông/đùi", sets: 3, reps: "10 mỗi chân", restSeconds: 90, note: "Bước đều và kiểm soát." },
    { name: "Calf Raise", muscleGroup: "Bắp chân", sets: 4, reps: "12-15", restSeconds: 60, note: "Dừng nhẹ ở đỉnh." },
  ],
};

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function calculateBmr(profile) {
  const weight = toNumber(profile.weight);
  const height = toNumber(profile.height);
  const age = toNumber(profile.age);
  const sexOffset = profile.sex === "female" ? -161 : 5;

  return Math.round(10 * weight + 6.25 * height - 5 * age + sexOffset);
}

function calculateFitnessPlan(profile) {
  const weight = toNumber(profile.weight);
  const height = toNumber(profile.height);
  const gymDays = toNumber(profile.gymDays);
  const sportDays = toNumber(profile.sportDays);
  const goal = goalSettings[profile.goal] || goalSettings.recomp;
  const multiplier = activityMultipliers[profile.activity] || activityMultipliers.light;
  const bmr = calculateBmr(profile);
  const exerciseAdjustment = Math.round((gymDays * 90 + sportDays * 70) / 7);
  const tdee = Math.round(bmr * multiplier + exerciseAdjustment);
  const targetCalories = Math.max(1200, tdee + goal.calorieOffset);
  const protein = Math.round(weight * goal.proteinPerKg);
  const fat = Math.round(weight * goal.fatPerKg);
  const carbs = Math.max(80, Math.round((targetCalories - protein * 4 - fat * 9) / 4));
  const bmi = Math.round((weight / (height / 100) ** 2) * 10) / 10;
  const workoutSplit = getWorkoutSplit(profile);

  return {
    bmi,
    bmr,
    tdee,
    exerciseAdjustment,
    targetCalories,
    macros: { protein, carbs, fat },
    protein,
    carbs,
    fat,
    goalLabel: goal.label,
    focus: goal.focus,
    workoutSplit,
    workouts: workoutSplit.map((name, index) => ({
      day: index + 1,
      name,
      exercises: getExercisesForWorkout(name),
    })),
    mealPlan: getMealPlan(targetCalories, profile.goal),
  };
}

function getWorkoutSplit(profile) {
  const gymDays = toNumber(profile.gymDays);
  const goal = profile.goal;

  if (gymDays <= 3) {
    return [
      "Full Body Strength",
      "Full Body Hypertrophy",
      goal === "fat_loss" ? "Full Body + Conditioning" : "Full Body Pump",
    ];
  }

  if (gymDays === 4) {
    return ["Upper Strength", "Lower Strength", "Upper Volume", "Lower Volume"];
  }

  return ["Push", "Pull", "Legs", "Upper Volume", "Lower + Conditioning"];
}

function getExercisesForWorkout(workoutName) {
  if (exerciseLibrary[workoutName]) return exerciseLibrary[workoutName];
  if (workoutName.includes("Lower") || workoutName.includes("Legs")) return exerciseLibrary.Legs;
  if (workoutName.includes("Pull")) return exerciseLibrary.Pull;
  if (workoutName.includes("Full Body")) {
    return [
      exerciseLibrary.Legs[0],
      exerciseLibrary.Push[0],
      exerciseLibrary.Pull[0],
      exerciseLibrary.Push[4],
      exerciseLibrary.Pull[4],
    ];
  }
  return exerciseLibrary.Push;
}

function getMealPlan(calories, goal) {
  const isFatLoss = goal === "fat_loss";

  return [
    {
      name: "Bữa sáng",
      calories: Math.round(calories * 0.25),
      foods: isFatLoss
        ? [
            { name: "Sữa chua Hy Lạp", grams: 200 },
            { name: "Yến mạch", grams: 45 },
            { name: "Berries", grams: 80 },
            { name: "Whey", grams: 25 },
          ]
        : [
            { name: "Trứng", grams: 120 },
            { name: "Yến mạch", grams: 70 },
            { name: "Chuối", grams: 120 },
            { name: "Bơ đậu phộng", grams: 20 },
          ],
    },
    {
      name: "Bữa trưa",
      calories: Math.round(calories * 0.35),
      foods: [
        { name: "Ức gà", grams: 180 },
        { name: "Cơm", grams: 220 },
        { name: "Rau xanh", grams: 200 },
        { name: "Dầu olive", grams: 10 },
      ],
    },
    {
      name: "Bữa tối",
      calories: Math.round(calories * 0.3),
      foods: isFatLoss
        ? [
            { name: "Cá trắng", grams: 180 },
            { name: "Khoai tây", grams: 250 },
            { name: "Salad", grams: 200 },
          ]
        : [
            { name: "Bò nạc", grams: 170 },
            { name: "Pasta", grams: 220 },
            { name: "Rau xanh", grams: 180 },
          ],
    },
    {
      name: "Bữa phụ",
      calories: Math.round(calories * 0.1),
      foods: [
        { name: "Whey hoặc sữa chua", grams: 180 },
        { name: "Trái cây", grams: 120 },
      ],
    },
  ];
}

export { calculateFitnessPlan, goalSettings };
