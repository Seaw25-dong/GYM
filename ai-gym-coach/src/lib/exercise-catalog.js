const levelOrder = ["Cơ bản", "Trung cấp", "Nâng cao", "Thi đấu"];

function exercise(group, name, level, equipment, muscles, instruction, history = "Không có một tác giả duy nhất được xác nhận; động tác phát triển dần từ thực hành thể lực và huấn luyện sức mạnh.") {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    group, name, level, equipment, muscles, instruction, history,
    videoSearchQuery: `${name} correct form tutorial`,
    steps: instruction.split(". ").filter(Boolean),
    mistakes: defaultMistakes(group),
  };
}

function defaultMistakes(group) {
  if (group === "Cardio") return ["Tăng cường độ quá nhanh", "Mất tư thế khi mệt", "Không điều chỉnh máy theo cơ thể"];
  if (["Ngực", "Vai", "Tay sau"].includes(group)) return ["Mất ổn định vai", "Dùng quán tính", "Tăng tạ trước khi kiểm soát biên độ"];
  if (["Chân", "Thi đấu"].includes(group)) return ["Mất vị trí cột sống", "Đầu gối mất kiểm soát", "Bỏ qua khởi động và bracing"];
  return ["Dùng quán tính", "Không kiểm soát pha hạ", "Hy sinh kỹ thuật để tăng tạ"];
}

const exerciseCatalog = [
  // Ngực
  exercise("Ngực", "Incline Push-up", "Cơ bản", "Ghế hoặc box", ["Ngực", "Tay sau", "Vai trước"], "Đặt tay trên mặt phẳng cao. Giữ cơ thể thành một đường thẳng. Hạ ngực có kiểm soát rồi đẩy lên"),
  exercise("Ngực", "Push-up", "Cơ bản", "Bodyweight", ["Ngực", "Tay sau", "Core"], "Siết mông và core. Hạ ngực giữa hai tay. Giữ khuỷu chếch khoảng 30–45 độ rồi đẩy sàn ra xa"),
  exercise("Ngực", "Dumbbell Bench Press", "Cơ bản", "Dumbbells, bench", ["Ngực", "Tay sau", "Vai trước"], "Ép vai xuống ghế. Hạ tạ cạnh ngực trong biên độ kiểm soát. Đẩy lên mà không va hai tạ"),
  exercise("Ngực", "Bench Press", "Trung cấp", "Barbell, bench", ["Ngực", "Tay sau", "Vai trước"], "Tạo điểm tựa bằng chân và lưng trên. Hạ thanh về ngực dưới. Đẩy thanh hơi chéo về phía rack"),
  exercise("Ngực", "Incline Dumbbell Press", "Trung cấp", "Dumbbells, incline bench", ["Ngực trên", "Tay sau"], "Đặt ghế nghiêng 20–35 độ. Hạ tạ ngang ngực trên. Giữ vai không nhô về trước"),
  exercise("Ngực", "Cable Fly", "Trung cấp", "Cable machine", ["Ngực"], "Giữ khuỷu hơi cong. Khép tay theo vòng cung. Siết ngực rồi trở lại chậm"),
  exercise("Ngực", "Weighted Dip", "Nâng cao", "Dip bars, belt", ["Ngực dưới", "Tay sau"], "Nghiêng thân nhẹ về trước. Hạ đến biên độ vai chịu được. Đẩy lên mà không nhún vai"),
  exercise("Ngực", "Competition Paused Bench Press", "Thi đấu", "Barbell, competition bench", ["Ngực", "Tay sau"], "Thiết lập theo luật liên đoàn. Dừng thanh bất động trên ngực. Chỉ đẩy khi có hiệu lệnh giả lập", "Biến thể đặc thù powerlifting, phát triển từ luật thi đấu bench press; không có một người phát minh duy nhất."),

  // Lưng
  exercise("Lưng", "Lat Pulldown", "Cơ bản", "Cable machine", ["Lats", "Tay trước"], "Mở ngực. Kéo khuỷu xuống sát thân. Trả tay lên mà vẫn kiểm soát xương bả vai"),
  exercise("Lưng", "Seated Cable Row", "Cơ bản", "Cable row", ["Lưng giữa", "Lats"], "Giữ lưng trung lập. Kéo tay cầm về bụng. Siết bả vai rồi duỗi tay chậm"),
  exercise("Lưng", "Assisted Pull-up", "Cơ bản", "Assisted machine hoặc band", ["Lats", "Tay trước"], "Bắt đầu từ vai ổn định. Kéo ngực hướng về xà. Hạ người hết biên độ có kiểm soát"),
  exercise("Lưng", "Pull-up", "Trung cấp", "Pull-up bar", ["Lats", "Tay trước", "Core"], "Gồng core. Kéo khuỷu xuống. Đưa cằm qua xà mà không đá chân"),
  exercise("Lưng", "Chest-supported Row", "Trung cấp", "Incline bench, dumbbells", ["Lưng giữa", "Vai sau"], "Tì ngực chắc trên ghế. Kéo tạ về hông. Không nhấc ngực để tạo đà"),
  exercise("Lưng", "Barbell Row", "Trung cấp", "Barbell", ["Lưng giữa", "Lats", "Gân kheo"], "Hip hinge và giữ lưng trung lập. Kéo thanh về bụng. Không biến bài thành shrug"),
  exercise("Lưng", "Pendlay Row", "Nâng cao", "Barbell", ["Lưng", "Sức mạnh kéo"], "Đặt thanh về sàn sau mỗi rep. Giữ thân gần song song sàn. Kéo bùng nổ nhưng không mất bracing", "Được phổ biến và hệ thống hóa bởi HLV cử tạ Glenn Pendlay."),
  exercise("Lưng", "Weighted Pull-up", "Nâng cao", "Pull-up bar, belt", ["Lats", "Tay trước"], "Giữ tải ổn định dưới thân. Kéo đủ biên độ. Dừng set trước khi kỹ thuật biến dạng"),

  // Chân
  exercise("Chân", "Bodyweight Squat", "Cơ bản", "Bodyweight", ["Đùi trước", "Mông", "Core"], "Đứng theo độ rộng thoải mái. Ngồi xuống giữa hai chân. Đầu gối đi theo hướng mũi chân"),
  exercise("Chân", "Goblet Squat", "Cơ bản", "Dumbbell hoặc kettlebell", ["Đùi trước", "Mông"], "Giữ tạ sát ngực. Gồng bụng. Xuống sâu trong biên độ kiểm soát rồi đứng lên"),
  exercise("Chân", "Leg Press", "Cơ bản", "Leg press machine", ["Đùi trước", "Mông"], "Giữ hông và lưng trên đệm. Hạ platform đến khi xương chậu vẫn ổn định. Không khóa gối"),
  exercise("Chân", "Romanian Deadlift", "Trung cấp", "Barbell hoặc dumbbells", ["Gân kheo", "Mông", "Lưng"], "Đẩy hông ra sau. Giữ tạ sát chân. Dừng khi gân kheo căng mà lưng vẫn trung lập"),
  exercise("Chân", "Bulgarian Split Squat", "Trung cấp", "Bench, dumbbells", ["Đùi trước", "Mông"], "Đặt chân sau lên ghế. Hạ hông thẳng xuống. Đẩy qua cả bàn chân trước"),
  exercise("Chân", "Front Squat", "Nâng cao", "Barbell", ["Đùi trước", "Core", "Lưng trên"], "Giữ khuỷu cao và thanh trên vai trước. Gồng thân. Ngồi xuống giữa hai chân rồi đứng lên"),
  exercise("Chân", "Hack Squat", "Trung cấp", "Hack squat machine", ["Đùi trước", "Mông"], "Giữ lưng áp đệm. Hạ sâu trong biên độ gối kiểm soát. Đẩy platform bằng giữa bàn chân", "Tên bài gắn với đô vật–lực sĩ George Hackenschmidt; dạng máy hiện đại phát triển sau này."),
  exercise("Chân", "Zercher Squat", "Nâng cao", "Barbell", ["Đùi", "Mông", "Core"], "Đặt thanh trong khuỷu tay. Giữ thân chắc. Squat xuống mà không để thanh kéo vai về trước", "Được đặt theo lực sĩ Ed Zercher, người nổi tiếng với cách nâng thanh từ sàn trong khuỷu tay."),
  exercise("Chân", "Competition Back Squat", "Thi đấu", "Barbell, rack", ["Đùi", "Mông", "Core"], "Thiết lập độ sâu theo luật. Giữ chân và thanh ổn định. Tập hiệu lệnh rack–squat–rack", "Biến thể thi đấu powerlifting được chuẩn hóa bởi luật liên đoàn, không có tác giả duy nhất."),

  // Vai
  exercise("Vai", "Machine Shoulder Press", "Cơ bản", "Machine", ["Vai", "Tay sau"], "Chỉnh ghế để tay cầm ngang vai. Đẩy lên không nhún vai. Hạ chậm"),
  exercise("Vai", "Dumbbell Shoulder Press", "Cơ bản", "Dumbbells", ["Vai", "Tay sau"], "Gồng bụng. Đẩy tạ lên trên vai. Không ưỡn lưng quá mức"),
  exercise("Vai", "Lateral Raise", "Cơ bản", "Dumbbells hoặc cable", ["Vai giữa"], "Nâng khuỷu sang hai bên. Dừng gần ngang vai. Hạ tạ chậm và tránh vung người"),
  exercise("Vai", "Reverse Pec Deck", "Cơ bản", "Pec deck machine", ["Vai sau", "Lưng trên"], "Giữ ngực áp đệm. Mở tay sang hai bên. Không nhún vai"),
  exercise("Vai", "Overhead Press", "Trung cấp", "Barbell", ["Vai", "Tay sau", "Core"], "Gồng mông và bụng. Đẩy thanh sát mặt lên trên đầu. Kết thúc với thanh trên giữa bàn chân"),
  exercise("Vai", "Arnold Press", "Trung cấp", "Dumbbells", ["Vai trước", "Vai giữa"], "Bắt đầu lòng bàn tay hướng vào mặt. Xoay và đẩy tạ lên. Đảo chuyển động có kiểm soát", "Động tác được Arnold Schwarzenegger phổ biến rộng rãi trong bodybuilding."),
  exercise("Vai", "Push Press", "Nâng cao", "Barbell", ["Vai", "Tay sau", "Chân"], "Dip ngắn bằng gối và hông. Truyền lực từ chân để đẩy thanh. Khóa thanh ổn định trên đầu"),

  // Tay
  exercise("Tay trước", "Dumbbell Curl", "Cơ bản", "Dumbbells", ["Biceps"], "Giữ khuỷu gần thân. Cuốn tạ không đung đưa. Hạ hết biên độ"),
  exercise("Tay trước", "Hammer Curl", "Cơ bản", "Dumbbells", ["Biceps", "Brachialis", "Cẳng tay"], "Giữ neutral grip. Cuốn tạ trong khi cổ tay thẳng. Không đưa khuỷu ra trước"),
  exercise("Tay trước", "Preacher Curl", "Trung cấp", "Preacher bench", ["Biceps"], "Tì tay chắc trên đệm. Duỗi gần hết khuỷu. Cuốn tạ không nhấc vai"),
  exercise("Tay trước", "Incline Dumbbell Curl", "Trung cấp", "Incline bench, dumbbells", ["Biceps đầu dài"], "Để tay rơi tự nhiên sau thân. Cuốn tạ mà không đưa vai về trước. Hạ chậm"),
  exercise("Tay sau", "Triceps Pushdown", "Cơ bản", "Cable machine", ["Triceps"], "Giữ khuỷu sát thân. Duỗi tay xuống hết biên độ. Trả cáp chậm"),
  exercise("Tay sau", "Overhead Triceps Extension", "Cơ bản", "Cable hoặc dumbbell", ["Triceps đầu dài"], "Giữ khuỷu hướng lên. Hạ tạ sau đầu trong biên độ thoải mái. Duỗi tay không xòe khuỷu"),
  exercise("Tay sau", "Skull Crusher", "Trung cấp", "EZ bar hoặc dumbbells", ["Triceps"], "Giữ cánh tay tương đối cố định. Gập khuỷu đưa tạ về sau đầu. Duỗi lên có kiểm soát"),
  exercise("Tay sau", "JM Press", "Nâng cao", "Barbell, bench", ["Triceps", "Ngực"], "Hạ thanh về vùng cổ–ngực trên bằng cách gập khuỷu. Giữ tải vừa và học kỹ thuật trước", "Được powerlifter JM Blakley phổ biến như bài bổ trợ bench press."),

  // Core
  exercise("Core", "Dead Bug", "Cơ bản", "Mat", ["Core sâu"], "Ép lưng dưới nhẹ xuống sàn. Duỗi tay và chân đối diện. Không để xương sườn bật lên"),
  exercise("Core", "Plank", "Cơ bản", "Mat", ["Core", "Mông"], "Giữ khuỷu dưới vai. Siết mông và bụng. Duy trì đường thẳng từ đầu đến gót"),
  exercise("Core", "Pallof Press", "Cơ bản", "Cable hoặc band", ["Core chống xoay"], "Đứng vuông góc dây. Đẩy tay ra trước. Chống lại lực kéo xoay thân"),
  exercise("Core", "Hanging Knee Raise", "Trung cấp", "Pull-up bar", ["Bụng", "Gập hông"], "Giữ vai ổn định. Cuộn xương chậu kéo gối lên. Tránh đung đưa"),
  exercise("Core", "Ab Wheel Rollout", "Nâng cao", "Ab wheel", ["Core", "Lats"], "Gồng mông và bụng. Lăn ra khi cột sống vẫn kiểm soát. Kéo về bằng core"),

  // Cardio
  exercise("Cardio", "Incline Treadmill Walk", "Cơ bản", "Treadmill", ["Tim mạch", "Chân"], "Chọn độ dốc và tốc độ duy trì được. Giữ thân thẳng. Hạn chế bám tay", "Biến thể đi bộ trên máy chạy; không có tác giả duy nhất."),
  exercise("Cardio", "Stationary Bike", "Cơ bản", "Exercise bike", ["Tim mạch", "Chân"], "Chỉnh yên phù hợp. Đạp nhịp đều. Tăng kháng lực từng bước"),
  exercise("Cardio", "Rowing Machine", "Trung cấp", "Row ergometer", ["Tim mạch", "Toàn thân"], "Đạp chân trước. Ngả thân nhẹ rồi kéo tay. Trở lại theo thứ tự tay–thân–chân"),
  exercise("Cardio", "Jump Rope", "Trung cấp", "Jump rope", ["Tim mạch", "Bắp chân"], "Nhảy thấp và tiếp đất nhẹ. Xoay dây bằng cổ tay. Chia hiệp ngắn khi mới tập"),
  exercise("Cardio", "Sled Push", "Nâng cao", "Weighted sled", ["Tim mạch", "Chân", "Toàn thân"], "Nghiêng thân thành một đường thẳng. Bước ngắn mạnh. Giữ nhịp thở và dừng trước khi tư thế vỡ"),

  // Thi đấu
  exercise("Thi đấu", "Conventional Deadlift", "Thi đấu", "Barbell, plates", ["Mông", "Gân kheo", "Lưng"], "Đặt thanh trên giữa bàn chân. Kéo slack và gồng lats. Đạp sàn rồi khóa hông", "Deadlift hiện đại phát triển từ các màn biểu diễn sức mạnh và được chuẩn hóa trong powerlifting."),
  exercise("Thi đấu", "Sumo Deadlift", "Thi đấu", "Barbell, plates", ["Mông", "Đùi", "Lưng"], "Mở chân rộng phù hợp hông. Giữ gối theo mũi chân. Kéo slack rồi đứng lên với thanh sát người"),
  exercise("Thi đấu", "Power Clean", "Nâng cao", "Olympic barbell", ["Toàn thân", "Sức mạnh bùng nổ"], "Đẩy sàn có kiểm soát. Mở rộng hông mạnh. Kéo người xuống đón thanh trên vai", "Biến thể của clean trong cử tạ; không gắn với một tác giả duy nhất."),
  exercise("Thi đấu", "Snatch", "Thi đấu", "Olympic barbell", ["Toàn thân", "Sức mạnh bùng nổ"], "Dùng grip rộng. Tăng tốc thanh sau gối. Kéo người xuống và đón thanh ổn định trên đầu", "Một trong hai nội dung thi đấu Olympic weightlifting hiện đại; kỹ thuật được phát triển qua nhiều thế hệ."),
  exercise("Thi đấu", "Clean and Jerk", "Thi đấu", "Olympic barbell", ["Toàn thân", "Sức mạnh bùng nổ"], "Clean thanh lên vai. Ổn định hơi thở. Dip thẳng và jerk thanh lên đầu với chân split hoặc power", "Nội dung thi đấu Olympic weightlifting, được chuẩn hóa bởi luật IWF."),
];

const exerciseGroupsDetailed = [...new Set(exerciseCatalog.map((item) => item.group))];

export { exerciseCatalog, exerciseGroupsDetailed, levelOrder };
