# Pettie - Cloudflare Pages 배포 가이드 (상업적 허용)

## DB는 이미 준비 완료
- Supabase URL: https://xonmjufmpqdljaqqagjl.supabase.co
- Total conflicts: 61, Seed: 60 (12 each type) - LIVE CONNECTED 확인 완료

## 깃허브에 올릴 파일 (이 폴더 전체, env.js 제외)
- index.html
- css/style.css
- js/ (8개 파일)
- data/conflicts.json (로컬 fallback)
- README.md
- .gitignore
- .env.example

## 단계별

### 1단계: 깃허브 새 저장소
1. github.com > New repository
2. Name: pettie-service
3. Public으로 체크
4. Create

### 2단계: 파일 업로드
- 이 zip을 풀어서 나온 pettie-service 폴더 안의 파일들을 그대로 드래그 업로드
- 또는 git 명령어:
```
git init
git add .
git commit -m "pettie: initial service"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pettie-service.git
git push -u origin main
```

### 3단계: Cloudflare Pages
1. dash.cloudflare.com 가입/로그인 (무료)
2. 왼쪽 Workers & Pages > Create application > Pages > Connect to Git
3. pettie-service 저장소 선택
4. Build 설정:
   - Framework preset: None
   - Build command: (비워둠)
   - Build output directory: /
5. Environment variables 추가 (중요):
   - SUPABASE_URL = https://xonmjufmpqdljaqqagjl.supabase.co
   - SUPABASE_ANON_KEY = sb_publishable_4BfRgeEkb_RXtLUfJQJuCA_7DzfM26w
   - Production + Preview 둘 다 체크
6. Save and Deploy

### 4단계: 확인
- 배포 후 나오는 https://pettie-service-xxx.pages.dev 열기
- 갈등 카드 61개 뜨는지 확인
- 개발자도구 콘솔에 Supabase not configured가 아니라 LIVE 연결 로그 뜨는지

### 5단계: 후원 버튼 추가 (상업적 허용이라 OK)
- BuyMeACoffee, Ko-fi, Toss 중 하나 가입
- index.html 카드 밑에 <a href="후원링크">후원하기</a> 추가
- 다시 git push 하면 Cloudflare가 자동 재배포

### 왜 Cloudflare냐
- Vercel Hobby는 후원 = 상업적 사용으로 간주해 Pro $20 필요
- Cloudflare Pages 무료에서도 상업적 허용 + 대역폭 무제한
