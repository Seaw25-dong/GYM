import { createHttpError } from "../utils/httpError.js";

const defaultModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const aiPlanSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "workoutPlan", "nutritionPlan", "coachNotes"],
  properties: {
    summary: {
      type: "object",
      additionalProperties: false,
      required: ["goal", "calorieTarget", "macroTarget", "strategy"],
      properties: {
        goal: { type: "string" },
        calorieTarget: { type: "string" },
        macroTarget: { type: "string" },
        strategy: { type: "string" },
      },
    },
    workoutPlan: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["day", "name", "focus", "exercises"],
        properties: {
          day: { type: "integer" },
          name: { type: "string" },
          focus: { type: "string" },
          exercises: {
            type: "array",
            minItems: 5,
            maxItems: 6,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "name",
                "muscleGroup",
                "sets",
                "reps",
                "restSeconds",
                "note",
                "mediaSearchQuery",
              ],
              properties: {
                name: { type: "string" },
                muscleGroup: { type: "string" },
                sets: { type: "integer" },
                reps: { type: "string" },
                restSeconds: { type: "integer" },
                note: { type: "string" },
                mediaSearchQuery: { type: "string" },
              },
            },
          },
        },
      },
    },
    nutritionPlan: {
      type: "object",
      additionalProperties: false,
      required: ["dailyTargets", "meals", "swapRules"],
      properties: {
        dailyTargets: {
          type: "object",
          additionalProperties: false,
          required: ["calories", "protein", "carbs", "fat"],
          properties: {
            calories: { type: "integer" },
            protein: { type: "integer" },
            carbs: { type: "integer" },
            fat: { type: "integer" },
          },
        },
        meals: {
          type: "array",
          minItems: 3,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["name", "calories", "foods", "note"],
            properties: {
              name: { type: "string" },
              calories: { type: "integer" },
              foods: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["name", "grams"],
                  properties: {
                    name: { type: "string" },
                    grams: { type: "integer" },
                  },
                },
              },
              note: { type: "string" },
            },
          },
        },
        swapRules: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
    coachNotes: {
      type: "array",
      minItems: 1,
      items: { type: "string" },
    },
  },
};

async function generateAiPlan({ profile, calculatedPlan, history = null, adjustmentMode = false }) {
  if (!process.env.OPENAI_API_KEY) {
    throw createHttpError(503, "OPENAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: defaultModel,
      input: [
        {
          role: "system",
          content:
            adjustmentMode
              ? "Bạn là AI fitness coach cho người Việt. Hãy điều chỉnh plan dựa trên lịch sử thực tế. Chỉ thay đổi calo theo bước nhỏ tối đa 200 kcal, giữ protein hợp lý và giải thích chiến lược. Có thể điều chỉnh volume/bài tập theo workout logs."
              : "Bạn là AI fitness coach cho người Việt. Sinh plan thực tế, an toàn, dễ hiểu bằng tiếng Việt. Giữ tên bài tập gym bằng tiếng Anh khi phổ biến. Không thay đổi các chỉ số calo/macro đã tính; chỉ dùng chúng làm ràng buộc.",
        },
        {
          role: "user",
          content: JSON.stringify({
            profile: normalizeForAi(profile),
            calculatedPlan,
            recentHistory: history,
            adjustmentMode,
            requirements: [
              "Workout plan phải khớp số buổi gym mỗi tuần.",
              "Trong lịch mỗi tuần phải có ít nhất một gợi ý cardio hoặc conditioning phù hợp; khi giảm mỡ hãy ghi rõ cách thêm cardio mà không ảnh hưởng phục hồi.",
              "Mỗi buổi tập bắt buộc có 5-6 bài, gồm bài chính và bài phụ.",
              "Mỗi bài tập cần có nhóm cơ chính và mediaSearchQuery bằng tiếng Anh để tìm video/animation.",
              "Meal plan phải bám sát target calories và macro.",
              "Meal plan phải ghi rõ từng thực phẩm bao nhiêu gram trong mỗi bữa.",
              "Ưu tiên món dễ mua ở Việt Nam như yến mạch, cơm, khoai, ức gà, trứng, cá, rau xanh, sữa chua.",
              "Không đưa lời khuyên y tế; nếu có bệnh lý/chấn thương thì khuyên hỏi chuyên gia.",
            ],
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "ai_gym_plan",
          schema: aiPlanSchema,
          strict: true,
        },
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw createHttpError(
      response.status,
      payload.error?.message || "OpenAI plan generation failed",
      payload.error || payload
    );
  }

  return {
    model: payload.model || defaultModel,
    plan: parseOutput(payload),
    rawResponseId: payload.id,
  };
}

function parseOutput(payload) {
  if (payload.output_text) {
    return JSON.parse(payload.output_text);
  }

  const textItem = payload.output
    ?.flatMap((item) => item.content || [])
    .find((content) => content.type === "output_text" && content.text);

  if (!textItem) {
    throw createHttpError(502, "OpenAI response did not include JSON text");
  }

  return JSON.parse(textItem.text);
}

function normalizeForAi(profile) {
  return {
    age: profile.age,
    sex: profile.sex,
    height: profile.height,
    weight: profile.weight,
    bodyFat: profile.bodyFat,
    activity: profile.activity,
    gymDays: profile.gymDays,
    sportDays: profile.sportDays,
    experience: profile.experience,
    goal: profile.goal,
  };
}

export { generateAiPlan };
