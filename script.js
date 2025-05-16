//자판기 상태 관리 및 기능 제어
class VendingMachine {
  constructor() {
    this.moneyValues = [100, 500, 1000, 5000, 10000]; // 사용 가능한 지폐 단위
    this.prices = { cola: 1100, water: 600, coffee: 700 }; // 음료 가격

    // 현재 보유 현금 및 초기 상태 저장용 변수
    this.money = {};
    this.originalMoney = {};
    this.originalDrinkStock = {};
    this.balance = 0;
    this.moneyInserted = 0;

    // 자판기 고장, 카드 작동 여부 설정
    this.isMachineBroken = Math.floor(Math.random() * 9) > 7;
    this.isCardWorking = Math.floor(Math.random() * 9) <= 6;
    this.isCardDeclinedHandled = false;

    // 음료 재고 초기화
    this.drinkStock = {
      cola: Math.floor(Math.random() * 5) + 1,
      water: Math.floor(Math.random() * 5) + 1,
      coffee: Math.floor(Math.random() * 5) + 1,
    };

    // 초기 재고 및 현금 상태 저장
    this.originalDrinkStock = JSON.parse(JSON.stringify(this.drinkStock));
    this.moneyValues.forEach((value) => {
      this.money[value] = Math.floor(Math.random() * 5);
    });
    this.originalMoney = JSON.parse(JSON.stringify(this.money));
  }

  // 현재 보유한 모든 지폐 총합 계산
  getRandomBalance() {
    let total = 0;
    for (const denom in this.money) {
      total += parseInt(denom) * this.money[denom];
    }
    return total;
  }

  // 잔액 및 재고 초기화
  resetBalance() {
    this.money = JSON.parse(JSON.stringify(this.originalMoney));
    this.drinkStock = JSON.parse(JSON.stringify(this.originalDrinkStock));
    this.balance = this.getRandomBalance();
    this.moneyInserted = 0;
    ui.updateBalance();
    ui.updateDrinkStockUI();
    ui.showMessage("잔액이 초기화되었습니다.");
  }

  // 현금 투입 기능
  insertMoney(amount) {
    if (this.money[amount] > 0) {
      this.money[amount]--;
      this.moneyInserted += amount;
      this.balance += amount;
      ui.updateBalance();
      ui.showMessage(`${amount}원을 넣었습니다.`);
    } else {
      ui.showMessage(`${amount}원 화폐가 부족합니다.`);
    }
  }

  // 한글 음료 이름 반환용 유틸 함수
  getDrinkName(type) {
    return { cola: "콜라", water: "물", coffee: "커피" }[type] || type;
  }

  // 음료 구매 로직
  buyDrink(type) {
    const price = this.prices[type];
    if (this.drinkStock[type] <= 0) return ui.showMessage(`${this.getDrinkName(type)}은(는) 품절되었습니다.`);
    if (this.moneyInserted >= price) {
      this.moneyInserted -= price;
      this.balance -= price;
      ui.updateBalance();
      this.drinkStock[type]--;
      ui.updateDrinkStockUI();
      ui.showMessage(`${this.getDrinkName(type)} 구매완료!`);
    } else {
      ui.showMessage("잔액이 부족합니다.");
    }
  }

  // 카드로 구매 (무제한)
  payWithCard() {
    if (!this.isCardWorking) {
      if (this.isCardDeclinedHandled) return;
      this.isCardDeclinedHandled = true;
      ui.showMessage("카드가 거절되었습니다. 카드를 교체 하거나 현금으로 결제하세요.");
      document.getElementById("changeCardBtnDiv").style.display = "block";
      document.getElementById("payWithCardBtn").disabled = true;
      ui.enablePaymentOptions();
      return;
    }

    this.isCardDeclinedHandled = false;
    this.resetBalance();
    this.balance = Infinity;
    this.moneyInserted = Infinity;
    document.getElementById("resetBalanceBtn").disabled = true;
    ui.updateBalance();
    ui.showMessage("카드 결제 준비 완료. 음료를 선택하세요.");
  }

  // 카드 교체 기능
  changeCard() {
    this.isCardWorking = true;
    this.isCardDeclinedHandled = false;
    document.getElementById("payWithCardBtn").disabled = false;
    document.getElementById("changeCardBtn").disabled = true;
    document.getElementById("changeCardBtnDiv").style.display = "none";
    ui.showMessage("새 카드로 교체되었습니다. 다시 결제를 시도하세요.");
  }

  // 자판기 수리 버튼
  fixMachine() {
    this.isMachineBroken = false;
    document.getElementById("fixMachineBtnDiv").style.display = "none";
    document.getElementById("fixBtn").disabled = true;
    this.resetBalance();
    ui.enablePaymentOptions();
    ui.enableAllButtons();
    ui.notifyBrokenMachine();
    ui.showMessage("자판기가 고쳐졌습니다.");
  }
}

class VendingUI {
  // 메시지를 출력하고 일정 시간 후 자동으로 지움
  showMessage(message, duration = 3000) {
    const output = document.getElementById("output");
    if (output) {
      output.textContent = message;
      setTimeout(() => (output.textContent = ""), duration);
    }
  }

  // 결제 수단 라디오 버튼 활성화 및 체크 해제
  enablePaymentOptions() {
    document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
      radio.disabled = false;
      radio.checked = false;
    });
  }

  // 특정 버튼만 제외하고 나머지 버튼을 모두 비활성화
  disableAllButtonsExcept(exceptions = []) {
    document.querySelectorAll("button").forEach((btn) => {
      btn.disabled = !exceptions.includes(btn);
    });
  }

  // 모든 버튼을 활성화
  enableAllButtons() {
    document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  }

  // 음료 재고 수치를 UI에 반영
  updateDrinkStockUI() {
    document.getElementById("stockCola").textContent = vending.drinkStock.cola;
    document.getElementById("stockWater").textContent = vending.drinkStock.water;
    document.getElementById("stockCoffee").textContent = vending.drinkStock.coffee;
  }

  // 현금 단위별 개수, 총액 및 잔액 정보를 UI에 반영
  updateBalance() {
    document.getElementById("hundredTotal").textContent = vending.money[100];
    document.getElementById("hundredBalance").textContent = 100 * vending.money[100];
    document.getElementById("fiveHundredTotal").textContent = vending.money[500];
    document.getElementById("fiveHundredBalance").textContent = 500 * vending.money[500];
    document.getElementById("thousandTotal").textContent = vending.money[1000];
    document.getElementById("thousandBalance").textContent = 1000 * vending.money[1000];
    document.getElementById("fiveThousandTotal").textContent = vending.money[5000];
    document.getElementById("fiveThousandBalance").textContent = 5000 * vending.money[5000];
    document.getElementById("tenThousandTotal").textContent = vending.money[10000];
    document.getElementById("tenThousandBalance").textContent = 10000 * vending.money[10000];

    document.getElementById("moneyInserted").textContent = isFinite(vending.moneyInserted)
      ? `자판기 잔액: ${vending.moneyInserted}원`
      : "카드이용";

    const balanceElement = document.getElementById("balance");
    balanceElement.textContent = isFinite(vending.balance) ? `${vending.balance} 원` : "카드";
  }

  // 자판기 고장 여부에 따라 안내 메시지 및 UI 제어
  notifyBrokenMachine() {
    const notification = document.getElementById("brokenMachineNotification");
    const fixMachineBtnDiv = document.getElementById("fixMachineBtnDiv");
    const fixMachineBtn = document.getElementById("fixBtn");
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');

    if (vending.isMachineBroken) {
      notification.textContent = "자판기 고장으로 현재 사용할 수 없습니다.";
      notification.style.color = "red";
      notification.style.fontWeight = "bold";
      fixMachineBtnDiv.style.display = "block";
      paymentOptions.forEach((radio) => (radio.disabled = true));
      this.disableAllButtonsExcept([fixMachineBtn]);
    } else {
      notification.textContent = "자판기 사용가능";
      notification.style.color = "green";
      notification.style.fontWeight = "bold";
      paymentOptions.forEach((radio) => (radio.disabled = false));
      this.enableAllButtons();
    }
  }

  // 결제 수단 선택에 따라 UI를 표시/숨김 처리
  handlePaymentMethod() {
    const method = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    const cashSection = document.getElementById("cashSection");
    const creditcardSection = document.getElementById("creditcardSection");
    const notificationSection = document.getElementById("payment-notification");
    const resetBtn = document.getElementById("resetBalanceBtn");
    const moneyInsertedText = document.getElementById("moneyInserted");
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    const payWithCardBtn = document.getElementById("payWithCardBtn");
    const allButtons = document.querySelectorAll("button");

    if (payWithCardBtn) payWithCardBtn.disabled = false;

    if (method === "cash") {
      cashSection.style.display = "block";
      creditcardSection.style.display = "none";
      notificationSection.style.display = "none";
      vending.resetBalance();
      moneyInsertedText.textContent = `자판기 잔액: ${vending.moneyInserted}원`;
      resetBtn.disabled = false;
      paymentOptions.forEach((radio) => (radio.disabled = true));
      allButtons.forEach((btn) => {
        btn.disabled = false;
      });
    } else if (method === "creditcard") {
      vending.resetBalance();
      cashSection.style.display = "none";
      creditcardSection.style.display = "block";
      notificationSection.style.display = "none";
      resetBtn.disabled = true;
      if (payWithCardBtn) payWithCardBtn.disabled = false;
      paymentOptions.forEach((radio) => (radio.disabled = true));
    } else {
      cashSection.style.display = "none";
      creditcardSection.style.display = "none";
      notificationSection.style.display = "block";
      resetBtn.disabled = true;
      allButtons.forEach((btn) => {
        if (!btn.id.includes("changeCardBtn")) btn.disabled = false;
      });
    }
  }
}

const vending = new VendingMachine();
const ui = new VendingUI();

window.addEventListener("DOMContentLoaded", function () {
  ui.updateBalance();
  ui.updateDrinkStockUI();
  ui.notifyBrokenMachine();
  document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener("change", () => ui.handlePaymentMethod());
  });
  ui.handlePaymentMethod();
});
