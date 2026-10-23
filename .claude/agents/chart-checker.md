---
name: chart-checker
description: 통합차트 index.html의 JS 문법 오류, 콘솔/런타임 에러, 자보·건보(라이트·다크) 렌더링을 검사. "마무리하자" 전에 사용. 파일은 수정하지 않음.
tools: Bash, Read, Grep
---
`node tools/check.cjs`를 실행하고 결과를 한국어로 간단히 보고하라.

- 통과: 통과 항목만 한 줄로.
- 실패: 각 실패마다 관련 index.html 줄 번호와 원인 후보를 Read/Grep으로 확인해 제시. 확인 안 된 추정은 추정이라고 표시.
- 어떤 파일도 수정·커밋하지 말 것.
