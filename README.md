## HEUIYEONG-vending-machine

HTML, JavaScript, CSS로 구현한 간단한 자판기 시뮬레이션입니다.
사용자는 결제 수단을 선택하고, 현금이나 카드를 투입하여 음료를 구매할 수 있습니다.

## 라이선스

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

---

## 주요 기능

- **현금/카드 결제** 선택 가능
- **콜라, 물, 커피** 중 음료 선택 가능
- 페이지 로딩 시, **100, 500, 1,000, 5,000, 10,000원** 단위의 현금이 랜덤으로 지급
- 해당 현금으로 음료 구매 가능
- 잔액 반환/초기화 기능 제공
- 투입한 금액, 잔액 구매현황 실시간 표시

## 프로젝트 구조

```
heuiyeong-vending-machine/
├── index.html
├── script.js
├── style.css
├── package.json
├── README.md
└── LICENSE
```

## 실행방법

1. GitHub에서 프로젝트 클론

   `bash`
   `git clone https://github.com/koreanbrian/heuiyeong-vending-machine`
   `cd brian-vending-machine`

2. 브라우저에서 index.html 파일을 직접 열기
   또는 아래처럼 간단한 로컬 서버 실행:
   `npx serve .`

## 사용기술

1. HTML5
2. Vanilla JavaScript(ES6)
3. CSS3
4. VS Code (개발환경)

## 개발자

- Heuiyeong Brian Jeong
- GitHub: @koreanbrian
- 이메일: jhy2139@gmail.com
