# 🎬 Filmmoi — Tulab.cloud

**Không gian xem phim cá nhân** — Svelte 5 client + Hono server, stream m3u8 KKPhim không quảng cáo, tự đề xuất thể loại/phim theo gu người xem, kèm giao diện TV riêng và tìm kiếm bằng điện thoại qua QR.

![Version](https://img.shields.io/badge/version-4.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TV Mode](https://img.shields.io/badge/TV_Mode-enabled-orange)

## Kiến trúc v4

- **Client**: Svelte 5 + Vite + TypeScript, một trang (`hash router`), build ra `dist/client`, không phụ thuộc CDN lúc chạy (font/icon/player tự host).
- **Server**: Hono + TypeScript (`server/`), gộp nguồn phía server thay vì trình duyệt tự gọi nhiều API.
- **Nguồn phim**: danh sách gộp KKPhim/PhimAPI và Nguonc (ưu tiên KKPhim khi trùng); chi tiết thử KKPhim rồi fallback sang Nguonc. chophim.app bổ sung danh sách "Phim lẻ" trong trường hợp phù hợp và cung cấp mục đề xuất riêng.
- **Dữ liệu cá nhân**: `localStorage` trên trình duyệt (yêu thích, theo dõi, ẩn, lịch sử, tiến độ xem, thể loại yêu thích `xam_taste`, tìm gần đây `xam_recent_searches`, TV mode, ngôn ngữ/tốc độ ưu tiên) + `data/*.json` trên server (lượt xem, bình luận, skip-times).
- **Đề xuất theo gu**: tính hoàn toàn trên trình duyệt (`client/src/lib/domain/recommend.ts`), không gửi dữ liệu cá nhân lên server; danh sách phim theo thể loại lấy qua `/api/browse?genre=…` và được cache 10 phút trong bộ nhớ (`client/src/lib/catalogCache.ts`).

### Luồng dữ liệu

```
Trình duyệt (Svelte)
  → /api/browse, /api/search           (KKPhim + Nguonc [+ chophim khi Phim lẻ], gộp ưu tiên)
  → /api/movie/:slug                   (KKPhim → Nguonc)
  → /api/suggestions                   (chophim /phim-le, gộp 5 trang)
  → /api/taxonomy                      (thể loại/quốc gia)
  → /api/tv-search                     (ghép nối tìm kiếm TV ↔ điện thoại, phiên tạm thời)
  → /api/skip-times, /api/views, /api/comments   (dữ liệu riêng, JSON trên server)
```

## Quick Start

### Phát triển

```bash
git clone https://github.com/ntu168108/phimtulab.git
cd phimtulab
npm ci
npm run dev:server     # Hono API, mặc định port 8790
npm run dev:client     # Vite dev server, mặc định port 5173, proxy /api sang 8790
```

Mở `http://127.0.0.1:5173/`.

### Build & chạy production

```bash
npm run build           # build:server (tsc) + build:client (vite build -> dist/client)
FILMMOI_PORT=8787 npm start
```

### Kiểm thử

```bash
npm test                # Vitest: server (Node) + client (jsdom)
npm run check           # tsc --noEmit (server)
npm run check:client    # svelte-check (client)
npm run test:e2e        # build + Playwright, chạy trên server FILMMOI_FIXTURES=1
```

> Playwright cần Chromium + vài thư viện hệ thống (`libatk-1.0.so.0`, `libgbm.so.1`, `libpango-1.0.so.0`, v.v.). Trên máy có quyền root: `sudo npx playwright install-deps chromium`. Nếu không có root, có thể tải các gói `.deb` cần thiết bằng `apt-get download <gói>`, giải nén bằng `dpkg-deb -x <gói>.deb <thư mục>` rồi chạy Playwright với `LD_LIBRARY_PATH=<thư mục>/usr/lib/x86_64-linux-gnu` — không cần sudo.

## Biến môi trường (server)

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `FILMMOI_PORT` | 8787 | Port server |
| `SERVER_HOST` | 127.0.0.1 | Host bind |
| `FILMMOI_DATA_DIR` | `./data` | Nơi lưu skip-times/views/comments |
| `FILMMOI_FIXTURES` | (tắt) | `1` = phục vụ dữ liệu mẫu từ `server/fixtures/`, không gọi mạng thật — dùng cho test/e2e/dev offline |

## API

Chi tiết tham số, ví dụ request/response và mã lỗi nằm trong [tài liệu API](docs/api.md).

| Endpoint | Mô tả |
|---|---|
| `GET /api/browse?type&genre&country&year&lang&status&quality&sort&page` | Danh sách phim, gộp nguồn phía server |
| `GET /api/search?q&page&...` | Tìm kiếm, cùng bộ filter |
| `GET /api/movie/:slug` | Chi tiết phim + danh sách tập (KKPhim → Nguonc) |
| `GET /api/taxonomy` | Thể loại + quốc gia |
| `GET /api/suggestions` | Đề xuất từ chophim.app (gộp 5 trang `/phim-le`) |
| `GET/POST /api/skip-times` | Điểm bỏ qua intro/outro theo phim + tập |
| `GET/POST /api/views` | Lượt xem theo phim |
| `GET/POST /api/comments` | Bình luận theo phim |
| `POST/GET/DELETE /api/tv-search…` | Ghép nối điện thoại, gửi từ khóa và TV nhận kết quả |
| `GET /api/health` | Trạng thái 3 nguồn (phimapi, nguonc, chophim) |

## Tính năng

- Trang chủ cá nhân hoá: banner nổi bật (tiếp tục xem kèm tiến độ, hoặc phim hợp gu nhất), tiếp tục xem, "Thể loại hợp gu bạn", "Gợi ý cho bạn", đề xuất hôm nay từ chophim, "Vì bạn thích {thể loại}", đang theo dõi.
- Tự đề xuất thể loại: gu được suy ra từ yêu thích, theo dõi, phim đang xem dở (xem càng nhiều càng nặng), lịch sử và thể loại tự chọn; tín hiệu cũ nhạt dần (half-life 45 ngày), phim "Không quan tâm" bị trừ điểm. "Chính Kịch"/"Tâm Lý" (gắn cho ~một nửa kho phim) được giảm trọng số; "Phim 18+" không bao giờ tự lên trang chủ. Lần đầu vào có bước chọn thể loại, sửa lại bất cứ lúc nào bằng "Chỉnh gu".
- Trang chi tiết: "Có thể bạn cũng thích" (cùng thể loại/quốc gia/loại phim), chip thể loại/quốc gia bấm để duyệt tiếp.
- Tìm kiếm: gợi ý kèm poster ngay khi gõ (↑/↓ + Enter trên máy tính), lưu tìm gần đây, bàn phím điện thoại có nút Tìm.
- Duyệt theo loại/thể loại/quốc gia/năm/ngôn ngữ/trạng thái/chất lượng, 5 bộ lọc nhanh; lưới 3 cột trên điện thoại, poster dọc đúng theo từng nguồn.
- Trình phát Plyr + hls.js: tự khôi phục lỗi mạng/media, chuyển dự phòng sang embed khi cần, nhớ vị trí xem, tự chuyển tập.
- Bỏ qua intro/outro, nút +30s, nạp phụ đề `.srt`/`.vtt` ngoài.
- Yêu thích / theo dõi / ẩn / lịch sử xem — lưu trên trình duyệt, không cần đăng nhập.
- TV Mode: giao diện riêng với menu trái cố định, poster lớn, bàn phím QWERTY (chữ hoa và tiếng Việt), QR để nhập tìm kiếm bằng điện thoại, bộ lọc dạng nút, thư viện và cài đặt. Điều hướng toàn bộ bằng bốn hướng + OK/Enter; nhớ thẻ phim và vị trí cuộn khi quay lại, giữ focus trong hộp thoại. Player có điều khiển TV trong fullscreen, tua, tập trước/sau, intro/outro, âm lượng, phụ đề và tốc độ; tập dài được chia nhóm 30. Tự nhận diện Smart TV hoặc màn CSS ≥960px không có thiết bị trỏ chính xác và không phải màn cảm ứng; máy tính có chuột không tự chuyển sang TV. Xem [hướng dẫn TV](docs/tv-mode.md).
- Bình luận + lượt xem theo phim (dữ liệu riêng của trang, không phải mạng xã hội).

## Cấu trúc thư mục

```
phim.tulab.cloud/
├── client/            # Vite + Svelte 5
├── server/            # Hono + TypeScript, fixtures nằm trong server/fixtures/
├── shared/            # Kiểu dữ liệu + hằng số dùng chung client/server
├── tests/e2e/         # Playwright
├── docs/              # API, phát triển, vận hành và lịch sử cutover
└── data/              # skip-times/views/comments (gitignored)
```

## Nginx

Không đổi so với trước — vẫn proxy sang `127.0.0.1:8787`, xem `phim-tulab-nginx.conf`.

## Tài liệu

- [Phát triển và kiểm thử](docs/development.md) — cài đặt, chạy client/server, fixtures và các lệnh kiểm tra.
- [API](docs/api.md) — query, request body, response, lỗi và cache của từng endpoint.
- [Triển khai và vận hành](docs/deployment.md) — build, cấu hình server, dữ liệu bền vững, Nginx và kiểm tra sau deploy.
- [Hướng dẫn giao diện TV và QR](docs/tv-mode.md) — điều hướng remote, QWERTY, thư viện, player và tìm kiếm bằng điện thoại.
- [Changelog](CHANGELOG.md) — thay đổi theo phiên bản.
- [Lịch sử cutover v4](docs/v4-cutover-checklist.md) — ghi nhận lần chuyển production từ v3 sang v4.
- [Fixtures](server/fixtures/README.md) — cách làm mới dữ liệu mẫu cho unit test và chạy offline.

## License

MIT License.

## Liên hệ

- **GitHub**: https://github.com/ntu168108/phimtulab
- **Live**: https://phim.tulab.cloud
