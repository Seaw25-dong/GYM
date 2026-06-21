const foodMarketUpdatedAt = "21/06/2026";

const foodMarket = [
  ["Ức gà không da", "Đạm động vật", 23, 120, 90000, 135000, "kg", "sống"],
  ["Trứng gà", "Đạm động vật", 12.6, 143, 70000, 105000, "kg", "nguyên quả"],
  ["Thịt bò nạc", "Đạm động vật", 21, 170, 220000, 350000, "kg", "sống"],
  ["Thịt thăn heo", "Đạm động vật", 21, 143, 115000, 180000, "kg", "sống"],
  ["Cá hồi", "Đạm động vật", 20, 208, 350000, 600000, "kg", "sống"],
  ["Cá basa phi lê", "Đạm động vật", 15, 90, 75000, 130000, "kg", "sống"],
  ["Cá ngừ", "Đạm động vật", 23, 130, 140000, 260000, "kg", "phần nạc"],
  ["Tôm", "Đạm động vật", 20, 99, 180000, 350000, "kg", "bỏ vỏ"],
  ["Đậu hũ", "Đạm thực vật", 8, 76, 30000, 60000, "kg", "thành phẩm"],
  ["Đậu gà", "Đạm thực vật", 8.9, 164, 80000, 160000, "kg", "đã nấu"],
  ["Sữa chua Hy Lạp", "Sữa", 10, 59, 160000, 300000, "kg", "không đường"],
  ["Sữa tươi không đường", "Sữa", 3.2, 61, 32000, 48000, "lít", "thành phẩm"],
  ["Gạo trắng", "Tinh bột", 2.7, 130, 18000, 38000, "kg", "cơm đã nấu"],
  ["Yến mạch", "Tinh bột", 16.9, 389, 70000, 150000, "kg", "khô"],
  ["Khoai lang", "Tinh bột", 1.6, 86, 25000, 55000, "kg", "đã nấu"],
  ["Khoai tây", "Tinh bột", 2, 77, 25000, 55000, "kg", "sống"],
  ["Chuối", "Trái cây", 1.1, 89, 20000, 45000, "kg", "phần ăn được"],
  ["Bơ", "Trái cây", 2, 160, 50000, 120000, "kg", "phần thịt"],
  ["Bông cải xanh", "Rau củ", 2.8, 34, 45000, 100000, "kg", "sống"],
  ["Rau bina", "Rau củ", 2.9, 23, 35000, 90000, "kg", "sống"],
  ["Bơ đậu phộng", "Chất béo", 25, 588, 140000, 300000, "kg", "thành phẩm"],
  ["Hạnh nhân", "Chất béo", 21, 579, 250000, 500000, "kg", "hạt khô"],
].map(([name, group, protein, calories, priceMin, priceMax, unit, state]) => ({
  name: String(name),
  group: String(group),
  protein: Number(protein),
  calories: Number(calories),
  priceMin: Number(priceMin),
  priceMax: Number(priceMax),
  unit: String(unit),
  state: String(state),
}));

export { foodMarket, foodMarketUpdatedAt };
