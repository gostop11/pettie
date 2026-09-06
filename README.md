# Pettie Service - English Version (Multi-file)

네가 원한 "여러 파일로 쪼개서 수정하기 쉬운" 구조.

## 구조
```
/index.html              -> 메인 서비스 화면 (영어)
/css/style.css           -> 반응형 스타일 (360/768/1024)
/js/config.js            -> 키 외부 분리 (절대 하드코딩 안 함)
/js/supabase-client.js   -> Supabase 연결 (env 있으면 실시간, 없으면 로컬 JSON)
/js/data.js              -> 60개 갈등 데이터 로더
/js/filters.js           -> 5개 relationship_type 필터
/js/cards.js             -> 갈등 카드 컴포넌트
/js/detail.js            -> 상세 드로어
/js/auth.js              -> 로그인 필요 처리 (익명 불가 이유)
/data/conflicts.json     -> DB에서 뽑은 60개 (로컬 fallback)
```

## 키 외부 분리 원칙
- `config.js`는 `window.__ENV__` 또는 `.env`에서 읽음. 소스코드에 하드코딩 없음
- anon key는 RLS로 보호되어 프론트 노출되어도 되지만, `.env.example`처럼 외부 파일로 분리
- service_role 키는 절대 프론트에 넣지 않음

## 실행 방법
1. `.env.example`을 `.env`로 복사하고 Supabase URL/anon key 넣기
2. 로컬 서버: `npx serve .` 또는 VSCode Live Server로 index.html 열기
3. .env 없으면 자동으로 `/data/conflicts.json` (네가 검증한 60개)로 동작 - DB 연결 전 디자인 확인용

## DB 연결 상태
- 현재 Supabase에 `pettie_full_v4.sql` 실행된 상태 (users 5, pets 8, conflicts 61 검증 완료)
- 연결되면 `conflicts WHERE is_seed=true` 12개씩 5개 유형 실시간으로 가져옴
