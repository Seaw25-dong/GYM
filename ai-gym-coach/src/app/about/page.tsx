import {
  Activity,
  Brain,
  CalendarDays,
  ChartNoAxesCombined,
  Dumbbell,
  HeartPulse,
  Salad,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: Brain, title: "Bớt phải tự đoán", text: "AI kết hợp chỉ số cơ thể, mục tiêu và lịch vận động để tạo điểm khởi đầu rõ ràng." },
  { icon: Dumbbell, title: "Tập có kế hoạch", text: "Mỗi buổi có bài tập, sets, reps, nghỉ giữa set và ghi chú kỹ thuật dễ theo dõi." },
  { icon: ChartNoAxesCombined, title: "Nhìn thấy tiến bộ", text: "Cân nặng, số đo, ảnh, workout logs và PR được lưu thành lịch sử thay vì nằm rời rạc." },
  { icon: Salad, title: "Ăn theo mục tiêu", text: "Theo dõi calo, macro, thực đơn theo gram và lượng thực tế trong từng bữa." },
];

const features = [
  { icon: UserRound, title: "Hồ sơ cá nhân", text: "Tài khoản, username, avatar, xác thực email và khôi phục mật khẩu." },
  { icon: Sparkles, title: "AI tạo và điều chỉnh plan", text: "Sinh workout–nutrition plan, sau đó phân tích lịch sử gần nhất để điều chỉnh." },
  { icon: CalendarDays, title: "Lịch tập realtime", text: "Chọn ngày tập, xem lịch tháng và đồng bộ trạng thái hoàn thành giữa các thiết bị." },
  { icon: Activity, title: "Workout logger", text: "Ghi kg, reps, từng set, timer nghỉ và thay thế bài theo thiết bị hiện có." },
  { icon: HeartPulse, title: "Cardio & sức khỏe", text: "Gợi ý cardio trong plan và thư viện bài conditioning để cải thiện tim mạch." },
  { icon: Salad, title: "Nhật ký dinh dưỡng", text: "Đánh dấu bữa ăn, chỉnh gram thực tế, tìm và thêm thực phẩm thay thế." },
  { icon: ChartNoAxesCombined, title: "Theo dõi tiến độ", text: "Biểu đồ cân nặng, số đo, ảnh tiến độ và PR ước tính từ workout log thật." },
  { icon: ShieldCheck, title: "Kiến thức có cảnh báo", text: "Thuật ngữ gym và thực phẩm bổ sung được phân nhóm theo mức bằng chứng, kèm lưu ý an toàn." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-bold">AI Gym Coach</Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10">Trang chủ</Link>
            <Link href="/register" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Bắt đầu</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
        <div className="absolute left-1/2 top-0 size-[500px] -translate-x-1/2 rounded-full bg-zinc-800/50 blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">Về AI Gym Coach</span>
          <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            Biến dữ liệu của bạn thành một kế hoạch <span className="text-zinc-500">dễ thực hiện</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-zinc-400">
            AI Gym Coach là nền tảng hỗ trợ người tập xây dựng lịch tập, dinh dưỡng và thói quen theo dõi tiến độ trong cùng một nơi. Web không thay thế huấn luyện viên hay chuyên gia y tế, nhưng giúp bạn bắt đầu có hệ thống và ra quyết định dựa trên dữ liệu hơn.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="rounded-2xl bg-white px-7 py-3 font-medium text-black transition hover:scale-105">Tạo tài khoản</Link>
            <Link href="/glossary" className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-medium hover:bg-white/10">Xem thuật ngữ</Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-widest text-zinc-500">Web giúp ích gì?</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold sm:text-5xl">Tập trung vào những thứ thực sự đưa bạn tiến lên</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-black/40 p-6">
                <Icon className="size-7" /><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 leading-relaxed text-zinc-500">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-widest text-zinc-500">Tính năng</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">Mọi phần của hành trình trong một hệ thống</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between"><Icon className="size-6" /><span className="text-sm font-bold text-zinc-700">{String(index + 1).padStart(2, "0")}</span></div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-500">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-zinc-950 px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-5xl">Bắt đầu bằng chỉ số của chính bạn</h2>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-500">Tạo tài khoản, nhập thông tin cơ thể và để hệ thống xây dựng plan đầu tiên.</p>
        <Link href="/register" className="mt-8 inline-flex rounded-2xl bg-white px-8 py-3 font-medium text-black">Bắt đầu ngay</Link>
      </section>
    </main>
  );
}
