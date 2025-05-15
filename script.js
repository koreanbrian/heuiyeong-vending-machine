//기본 값
const moneyValues = [100, 500, 1000, 5000, 10000];
const prices = { cola: 1100, water: 600, coffee: 700 };

//변수
let money = {}; // 현재 사용가능 현금
let originalMoney = {}; // 원래 가지고 있던 현금
let originalDrinkstock = {};
let balance = 0;
let moneyInserted = 0;
let isMachineBroken = true;
let brokenMachinePossibility = 0;
let isCardWorking = true;
let workingCardPossibility = 0;

let drinkStock = {
  cola: Math.floor(Math.random() * 5) + 1,
  water: Math.floor(Math.random() * 5) + 1,
  coffee: Math.floor(Math.random() * 5) + 1,
};
originalDrinkstock = JSON.parse(JSON.stringify(drinkStock));
//페이지 로딩 시, 랜덤으로 지급되는 현금
moneyValues.forEach((value) => {
  money[value] = Math.floor(Math.random() * 5);
});
//리셋 시 필요한 디폴트 값 세팅
originalMoney = JSON.parse(JSON.stringify(money));
balance = getRandomBalance();

//기계고장 여부
brokenMachinePossibility = Math.floor(Math.random() * 9);
brokenMachinePossibility <= 7 ? (isMachineBroken = false) : (isMachineBroken = true);
//카드거절 여부
workingCardPossibility = Math.floor(Math.random() * 9);
workingCardPossibility <= 6 ? (isCardWorking = true) : (isCardWorking = false);
console.log("isCardWorking", isCardWorking);
let isCardDeclinedHandled = false;

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
  const moneyInsertedText = document.getElementById("moneyInserted");
  const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
  const payWithCardBtn = document.getElementById("payWithCardBtn");
  const allButtons = document.querySelectorAll("button");

  if (payWithCardBtn) payWithCardBtn.disabled = false;

  if (method === "cash") {
    cashSection.style.display = "block";
    creditcardSection.style.display = "none";
    notificationSection.style.display = "none";
    resetBalance();
    moneyInsertedText.textContent = `자판기 잔액: ${moneyInserted}원`;
    resetBtn.disabled = false;
    payWithCardBtn.disabled = true;
    paymentOptions.forEach((radio) => (radio.disabled = true));
    allButtons.forEach((btn) => {
      btn.disabled = false;
    });
  } else if (method === "creditcard") {
    resetBalance();
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
  document.getElementById("balance").textContent = isFinite(balance) ? `${getRandomBalance()} 원` : "카드";
  let totalBalance =
    100 * money[100] + 500 * money[500] + 1000 * money[1000] + 5000 * money[5000] + 10000 * money[10000];

  const balanceElement = document.getElementById("balance");
  balanceElement.textContent = isFinite(balance) ? `${totalBalance} 원` : "카드";
}

// 결과 표시
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
    showMessage(`${amount}원 화폐가 부족합니다.`);
  }
}

// 잔액 초기화
function resetBalance() {
  money = JSON.parse(JSON.stringify(originalMoney));
  drinkStock = JSON.parse(JSON.stringify(originalDrinkstock));
  balance = getRandomBalance();
  moneyInserted = 0;
  updateBalance();
  updateDrinkStockUI();
  showMessage("잔액이 초기화되었습니다.");
}

// 카드로 구매 (무제한)
function payWithCard() {
  if (!isCardWorking) {
    if (isCardDeclinedHandled) return;
    isCardDeclinedHandled = true;

    showMessage("카드가 거절되었습니다. 카드를 교체 하거나 현금으로 결제하세요.");
    document.getElementById("changeCardBtnDiv").style.display = "block";
    document.getElementById("payWithCardBtn").disabled = true;
    document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
      radio.disabled = false;
    });

    return;
  }

  notifyChangeCard();

  resetBalance();
  balance = Infinity;
  moneyInserted = Infinity;
  document.getElementById("resetBlaanceBtn").disabled = true;
  updateBalance();
  showMessage("카드 결제 준비 완료. 음료를 선택하세요.");
}

function changeCard() {
  isCardWorking = true;
  isCardDeclinedHandled = false;
  document.getElementById("payWithCardBtn").disabled = false;
  document.getElementById("changeCardBtn").disabled = true;
  document.getElementById("changeCardBtnDiv").style.display = "none";

  showMessage("새 카드로 교체되었습니다. 다시 결제를 시도하세요.");
}

function buyDrink(type) {
  var price = prices[type];
  if (drinkStock[type] <= 0) return showMessage(`${type}는 품절되었습니다.`);
  if (moneyInserted >= price) {
    moneyInserted -= price;
    updateBalance();
    drinkStock[type]--;
    updateDrinkStockUI();
    showMessage(`${type} 구매완료!`);
    if (balance !== Infinity) showMessage(`잔액: ${moneyInserted}원`);
  } else {
    showMessage("잔액이 부족합니다.");
  }
}
function notifyBrokenMachine() {
  const notification = document.getElementById("brokeMachineNotfication");
  const allButtons = document.querySelectorAll("button");
  const paymentOptions = this.document.querySelectorAll('input[name="paymentMethod"]');
  const fixMachineBtnDiv = document.getElementById("fixMachineBtnDiv");
  const fixMachineBtn = document.getElementById("fixBtn");

  if (isMachineBroken) {
    notification.textContent = "자판기 고장으로 현재 사용할 수 없습니다.";
    notification.style.color = "red";
    notification.style.fontWeight = "bold";
    fixMachineBtnDiv.style.display = "block";
    paymentOptions.forEach((radio) => (radio.disabled = true));
    allButtons.forEach((btn) => {
      btn.disabled = true;
      if (btn === fixMachineBtn) btn.disabled = false;
    });
  } else {
    notification.textContent = "자판기 사용가능";
    notification.style.color = "green";
    paymentOptions.forEach((radio) => (radio.disabled = false));
    allButtons.forEach((btn) => (btn.disabled = false));
  }
}

function notifyChangeCard() {
  const allButtons = document.querySelectorAll("button");
  const paymentOptions = this.document.querySelectorAll('input[name="paymentMethod"]');
  const changeCardBtnDiv = document.getElementById("changeCardBtnDiv");
  const changeCardBtn = document.getElementById("changeCardBtn");
  if (!isCardWorking) {
    showMessage("카드가 거절되었습니다. 카드를 교체 하거나 현금으로 결제하세요.");
    changeCardBtnDiv.style.display = "block";
    paymentOptions.forEach((radio) => (radio.disabled = false));
    allButtons.forEach((btn) => {
      btn.disabled = true;
      if (btn === changeCardBtn) btn.disabled = false;
    });
  } else {
    showMessage("카드 사용이 가능합니다.");
    allButtons.forEach((btn) => (btn.disabled = false));
  }
}

function updateDrinkStockUI() {
  document.getElementById("stockCola").textContent = drinkStock.cola;
  document.getElementById("stockWater").textContent = drinkStock.water;
  document.getElementById("stockCoffee").textContent = drinkStock.coffee;
}

function fixMachine() {
  isMachineBroken = false;
  const fixMachineBtnDiv = document.getElementById("fixMachineBtnDiv");
  fixMachineBtnDiv.style.display = "none";
  const fixMachineBtn = document.getElementById("fixBtn");
  fixMachineBtn.disabled = true;
  showMessage("자판기가 고쳐졌습니다.");
  notifyBrokenMachine();
}

window.addEventListener("DOMContentLoaded", function () {
  updateBalance();
  updateDrinkStockUI();
  notifyBrokenMachine();
  const paymentOptions = this.document.querySelectorAll('input[name="paymentMethod"]');
  paymentOptions.forEach((radio) => {
    radio.addEventListener("change", handlePaymentMethod);
  });
  handlePaymentMethod();
});
