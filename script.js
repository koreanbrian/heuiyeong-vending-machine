//기본 값
const moneyValues = [100, 500, 1000, 5000, 10000];
const prices = { cola: 1100, water: 600, coffee: 700 };
//변수
let money = {}; // 현재 사용가능 현금
let originalMoney = {}; // 원래 가지고 있던 현금
let balance = 0;
let moneyInserted = 0;
let isMachineBroken = true;
let brokenMachinePossibility = 0;
//페이지 로딩 시, 랜덤으로 지급되는 현금
moneyValues.forEach((value) => {
  money[value] = Math.floor(Math.random() * 5);
});
let drinkStock = {
  cola: Math.floor(Math.random() * 5) + 1,
  water: Math.floor(Math.random() * 5) + 1,
  coffee: Math.floor(Math.random() * 5) + 1,
};
brokenMachinePossibility = Math.floor(Math.random() * 9);
brokenMachinePossibility <= 7 ? (isMachineBroken = false) : (isMachineBroken = true);

//리셋 시 필요한 디폴트 값 세팅
originalMoney = JSON.parse(JSON.stringify(money));
balance = getRandomBalance();

// --- 자판기 운영을 위해 필요한 함수 --- //
function getRandomBalance() {
  let total = 0;
  for (const denom in money) {
    total += parseInt(denom) * money[denom];
  }
  return total;
}

// 결제 수단 선택 관련
function handlePaymentMethod() {
  const method = document.querySelector('input[name="paymentMethod"]:checked')?.value;
  const cashSection = document.getElementById("cashSection");
  const creditcardSection = document.getElementById("creditcardSection");
  const notificationSection = document.getElementById("payment-notification");
  const resetBtn = document.getElementById("resetBlaanceBtn");
  const moneyInserted = document.getElementById("moneyInserted");
  const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');

  if (method === "cash") {
    cashSection.style.display = "block";
    creditcardSection.style.display = "none";
    notificationSection.style.display = "none";
    resetBalance();
    moneyInserted.textContent = isFinite(moneyInserted) ? `자판기 잔액: ${moneyInserted}원` : "카드이용";
    resetBtn.disabled = false;
    paymentOptions.forEach((radio) => {
      radio.disabled = true;
    });
  } else if (method === "creditcard") {
    resetBalance();
    cashSection.style.display = "none";
    creditcardSection.style.display = "block";
    notificationSection.style.display = "none";
    resetBtn.disabled = true;
    paymentOptions.forEach((radio) => {
      radio.disabled = true;
    });
  } else {
    cashSection.style.display = "none";
    creditcardSection.style.display = "none";
    notificationSection.style.display = "block";
    resetBtn.disabled = true;
  }
}

// 현금 보유량 및 잔액 업데이트
function updateBalance() {
  document.getElementById("hundredTotal").textContent = money[100];
  document.getElementById("hundredBalance").textContent = 100 * money[100];
  document.getElementById("fiveHundredTotal").textContent = money[500];
  document.getElementById("fiveHundredBalance").textContent = 500 * money[500];
  document.getElementById("thousandTotal").textContent = money[1000];
  document.getElementById("thousandBalance").textContent = 1000 * money[1000];
  document.getElementById("fiveThousandTotal").textContent = money[5000];
  document.getElementById("fiveThousandBalance").textContent = 5000 * money[5000];
  document.getElementById("tenThousandTotal").textContent = money[10000];
  document.getElementById("tenThousandBalance").textContent = 10000 * money[10000];

  document.getElementById("moneyInserted").textContent = isFinite(moneyInserted)
    ? `자판기 잔액: ${moneyInserted}원`
    : "카드이용";

  let totalBalance =
    100 * money[100] + 500 * money[500] + 1000 * money[1000] + 5000 * money[5000] + 10000 * money[10000];

  const balanceElement = document.getElementById("balance");
  balanceElement.textContent = isFinite(balance) ? `${totalBalance} 원` : "카드";
}

function showMessage(message) {
  var output = document.getElementById("output");
  if (output) {
    output.textContent = message;
  }
}

// 현금 투입 및 반환 관련
function insertMoney(amount) {
  if (money[amount] > 0) {
    money[amount]--;
    moneyInserted += amount;
    balance += amount;
    updateBalance();
    showMessage(`${amount}원을 넣었습니다.`);
  } else {
    showMessage(`${amount}원 동전이 부족합니다.`);
  }
}

function resetBalance() {
  money = JSON.parse(JSON.stringify(originalMoney));
  balance = getRandomBalance();
  moneyInserted = 0;
  updateBalance();
  showMessage("잔액이 초기화되었습니다.");
}

function payWithCard() {
  const resetBtn = document.getElementById("resetBlaanceBtn");
  resetBalance();
  balance = Infinity;
  moneyInserted = Infinity;
  resetBtn.disabled = true;
  updateBalance();
  showMessage("카드 결제 준비 완료. 음료를 선택하세요.");
}

function buyDrink(type) {
  var price = prices[type];

  if (drinkStock[type] <= 0) {
    showMessage(`${type}는 품절되었습니다.`);
    return;
  }

  if (moneyInserted >= price) {
    moneyInserted -= price;
    updateBalance();
    drinkStock[type]--;
    updateDrinkStockUI();
    showMessage(`${type} 구매완료!`);
    if (balance !== Infinity) {
      showMessage(`잔액: ${moneyInserted}원`);
    }
  } else {
    showMessage("잔액이 부족합니다.");
  }
}
function notifyBrokenMachine() {
  const notification = document.getElementById("brokeMachineNotfication");
  const allButtons = document.querySelectorAll("button");
  const paymentOptions = this.document.querySelectorAll('input[name="paymentMethod"]');
  const fixMachineBtnDiv = document.getElementById("fixMachineBtn");
  const fixMachineBtn = document.getElementById("fixBtn");
  if (isMachineBroken) {
    notification.textContent = "자판기 고장으로 현재 사용할 수 없습니다.";
    notification.style.color = "red";
    notification.style.fontWeight = "bold";
    fixMachineBtnDiv.style.display = "block";

    paymentOptions.forEach((radio) => {
      radio.disabled = true;
    });
    allButtons.forEach((btn) => {
      btn.disabled = true;
      if (fixMachineBtn) {
        fixMachineBtn.disabled = false;
      }
    });
  } else {
    notification.textContent = "자판기 사용가능";
    notification.style.color = "green";
    paymentOptions.forEach((radio) => {
      radio.disabled = false;
    });
    allButtons.forEach((btn) => {
      btn.disabled = false;
    });
  }
}
function updateDrinkStockUI() {
  document.getElementById("stockCola").textContent = drinkStock.cola;
  document.getElementById("stockWater").textContent = drinkStock.water;
  document.getElementById("stockCoffee").textContent = drinkStock.coffee;
}

function fixMachine() {
  isMachineBroken = false;
  const fixMachineBtnDiv = document.getElementById("fixMachineBtn");
  fixMachineBtnDiv.style.display = "none";
  const fixMachineBtn = document.getElementById("fixBtn");
  fixMachineBtn.disabled = true;
  showMessage("🔧 자판기가 고쳐졌습니다.");
  notifyBrokenMachine();
}

window.addEventListener("DOMContentLoaded", function () {
  updateBalance();
  notifyBrokenMachine();
  updateDrinkStockUI();
  const paymentOptions = this.document.querySelectorAll('input[name="paymentMethod"]');
  paymentOptions.forEach((radio) => {
    radio.addEventListener("change", handlePaymentMethod);
  });
  handlePaymentMethod();
});
