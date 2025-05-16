## heuiyeong-vending-machine

HTML, JavaScript, CSS로 구현한 간단한 자판기 시뮬레이터입니다.  
사용자는 결제 수단(현금/카드)을 선택하여 음료(콜라, 물, 커피)를 구매할 수 있습니다.

## 라이선스

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

---

## 주요 기능

- 현금 또는 카드 결제 선택
- 콜라, 물, 커피 중 음료 선택 가능
- 페이지 로딩 시, **100 / 500 / 1,000 / 5,000 / 10,000원 단위의 현금**이 랜덤 지급
- 해당 금액으로 음료 구매 가능
- 잔액 초기화 기능 제공
- 카드 거절 시, **카드 교체 or 현금 결제** 유도
- 실시간 **투입 금액, 잔액, 재고** 반영
- 자판기 고장 시, 수리 전까지 사용 불가

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

   ```
   bash
   git clone https://github.com/koreanbrian/heuiyeong-vending-machine
   cd heuiyeong-vending-machine
   ```

2. 로컬 서버로 실행
   (A) 로컬에서 직접 열기
   index.html 파일을 브라우저에서 더블 클릭하여 실행합니다.
   설치나 빌드 과정 없이 즉시 실행 가능합니다.

   (B) 로컬 서버로 실행 (권장)
   Node.js가 설치되어 있다면 serve 명령어로 로컬 서버를 띄워 실행할 수 있습니다.

   `npx serve .`

   위 명령어 실행 후 브라우저에서 안내된 localhost 주소로 접속하세요.

## 사용기술

1. HTML5
2. Vanilla JavaScript(ES6)
3. CSS3
4. VS Code (개발환경)

## 개발자

- Heuiyeong Brian Jeong
- GitHub: @koreanbrian
- 이메일: jhy2139@gmail.com

```

```
