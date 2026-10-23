# 통합차트

한방 교통사고(TA) 임상 차트 웹앱. 자보(`setChartMode('ta')`)·건보(`'gb'`) 두 모드를 `index.html` 한 파일에서 처리.
GitHub Pages로 배포됨(`index.html` = 사이트). 버전 관리는 git 커밋 기록으로 함.

## 규칙
- 단일 파일 유지(분리 금지), 순수 HTML/CSS/JS, 외부 라이브러리 금지
- 기존 네이밍·포맷 유지, 임의 리팩터링 금지. 함수·변수명 변경 시 이유 설명
- `body.dark-mode` CSS 변수 구조 유지
- 답변은 간단히. 사실 기반, 불확실하면 불확실하다고 말할 것
- 파일명 변경·날짜별 새 파일 생성 금지(사이트 주소가 깨짐)

## "마무리하자"
1. `chart-checker` 에이전트로 에러 체크. 실패 시 보고 후 사용자 확인 대기
2. `<title>`을 `YYMMDD 통합차트`로 바꾸고, `<title>` 바로 아래(기존 이력 위)에 추가:
   ```html
   <!--
   [YYMMDD 업데이트]
   - 이번 세션 변경 내용
   -->
   ```
3. 커밋 메시지 `[YYMMDD 업데이트] 요약`으로 커밋 후 push (이 환경은 태그 push가 막혀 있어 태그는 쓰지 않음)

## 롤백
`git log --oneline --grep 'YYMMDD 업데이트'`로 커밋을 찾아 `git checkout <커밋> -- index.html` 후 새 커밋으로 push. 기록은 지우지 않음(force-push 금지).
