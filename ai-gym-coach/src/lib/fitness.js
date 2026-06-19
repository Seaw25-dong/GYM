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

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function calculateBmr(profile) {
  const weight = toNumber(profile.weight);
  const height = toNumber(profile.height);
  const age = toNumber(profile.age);
  if (!weight || !height || !age) return 0;
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
  const hasRequiredMetrics = Boolean(weight && height && toNumber(profile.age) && gymDays);

  if (!hasRequiredMetrics) {
    return {
      bmi: 0,
      bmr: 0,
      tdee: 0,
      targetCalories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      goalLabel: goal.label,
      focus: "",
      workoutSplit: [],
      mealPlan: [],
    };
  }
  const exerciseAdjustment = Math.round((gymDays * 90 + sportDays * 70) / 7);
  const tdee = Math.round(bmr * multiplier + exerciseAdjustment);
  const targetCalories = Math.max(1200, tdee + goal.calorieOffset);
  const protein = weight ? Math.round(weight * goal.proteinPerKg) : 0;
  const fat = weight ? Math.round(weight * goal.fatPerKg) : 0;
  const carbs = Math.max(80, Math.round((targetCalories - protein * 4 - fat * 9) / 4));
  const bmi = weight && height ? Math.round((weight / (height / 100) ** 2) * 10) / 10 : 0;

  return {
    bmi,
    bmr,
    tdee,
    targetCalories,
    protein,
    fat,
    carbs,
    goalLabel: goal.label,
    focus: goal.focus,
    workoutSplit: getWorkoutSplit(profile),
    mealPlan: getMealPlan(targetCalories, protein, profile.goal),
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

function getMealPlan(calories, protein, goal) {
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
      meal: isFatLoss
        ? "Sữa chua Hy Lạp, yến mạch, berries, whey"
        : "Trứng, yến mạch, chuối, bơ đậu phộng",
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
      meal: "Ức gà, cơm, rau xanh, dầu olive",
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
      meal: isFatLoss
        ? "Cá trắng, khoai tây, salad"
        : "Bò nạc, pasta, rau xanh",
    },
    {
      name: "Bữa phụ",
      calories: Math.round(calories * 0.1),
      foods: [
        { name: "Whey hoặc sữa chua", grams: 180 },
        { name: "Trái cây", grams: 120 },
      ],
      meal: `Bữa phụ khoảng ${Math.max(25, Math.round(protein * 0.18))}g protein`,
    },
  ];
}

const defaultProfile = {
  age: "",
  sex: "male",
  height: "",
  weight: "",
  bodyFat: "",
  activity: "light",
  gymDays: "",
  trainingDays: [],
  sportDays: "",
  experience: "intermediate",
  goal: "muscle_gain",
};

export { calculateFitnessPlan, defaultProfile, goalSettings };
