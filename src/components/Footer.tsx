export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold">
              <span className="text-sm font-bold text-gold">法</span>
            </div>
            <span className="text-xl font-bold text-white">法鉴</span>
          </div>

          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} 法鉴 — AI 驱动的法律智能助手
          </p>

          <div className="flex gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-gold transition-colors">
              隐私政策
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              服务条款
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}