const mortgageAmountError = document.getElementById("mortgageAmountError");
const mortgageTermError = document.getElementById("mortgageTermError");
const interestRateError = document.getElementById("interestRateError");
const mortgageTypeError = document.getElementById("mortgageTypeError");
const mortgageAmountLabel = document.getElementById("mortgageAmountLabel");
const mortgageTermLabel = document.getElementById("mortgageTermLabel");
const interestRateLabel = document.getElementById("interestRateLabel");
const mortgageAmountInput = document.getElementById("mortgageAmountInput");
const mortgageTermInput = document.getElementById("mortgageTermInput");
const interestRateInput = document.getElementById("interestRateInput");
const mortgageTypeRepayment = document.getElementById("mortgageTypeRepayment");
const mortgageTypeInterestOnly = document.getElementById(
	"mortgageTypeInterestOnly",
);
const clearAllButton = document.getElementById("clearAllButton");
const submitButton = document.getElementById("submitButton");
const resultsEmpty = document.getElementById("resultsEmpty");
const resultsSuccess = document.getElementById("resultsSuccess");
const resultsMonthly = document.getElementById("resultsMonthly");
const resultsTotal = document.getElementById("resultsTotal");
const errorField = "errorField";
const block = "block";
const flex = "flex";
const none = "none";
const repayment = "repayment";
const interestOnly = "interestOnly";

let amountError = false;
let termError = false;
let rateError = false;
let typeError = false;

submitButton.addEventListener("click", () => {
	if (mortgageAmountInput.value === "") {
		amountError = true;
	} else {
		amountError = false;
	}
	if (mortgageTermInput.value === "") {
		termError = true;
	} else {
		termError = false;
	}
	if (interestRateInput.value === "") {
		rateError = true;
	} else {
		rateError = false;
	}
	typeError = true;
	let selectedType = none;
	for (const input of [mortgageTypeRepayment, mortgageTypeInterestOnly]) {
		if (input.checked) {
			typeError = false;
			selectedType = input.value;
		}
	}
	const errorsFound = handleErrors();
	if (errorsFound) return;
	const { monthlyRepayment, totalRepayment } = calculateMortgage(
		mortgageAmountInput.value,
		mortgageTermInput.value,
		interestRateInput.value,
		selectedType,
	);
	resultsMonthly.textContent = monthlyRepayment;
	resultsTotal.textContent = totalRepayment;
});

clearAllButton.addEventListener("click", () => {
	amountError = false;
	termError = false;
	rateError = false;
	typeError = false;
	handleErrors(true);
	mortgageAmountInput.value = "";
	mortgageTermInput.value = "";
	interestRateInput.value = "";
	for (const input of [mortgageTypeRepayment, mortgageTypeInterestOnly]) {
		if (input.checked) {
			input.checked = "";
		}
	}
});

function handleErrors(isWithoutResult) {
	if (amountError) {
		mortgageAmountInput.classList.add(errorField);
		mortgageAmountLabel.classList.add(errorField);
		mortgageAmountError.style.display = block;
	} else {
		mortgageAmountInput.classList.remove(errorField);
		mortgageAmountLabel.classList.remove(errorField);
		mortgageAmountError.style.display = none;
	}
	if (termError) {
		mortgageTermInput.classList.add(errorField);
		mortgageTermLabel.classList.add(errorField);
		mortgageTermError.style.display = block;
	} else {
		mortgageTermInput.classList.remove(errorField);
		mortgageTermLabel.classList.remove(errorField);
		mortgageTermError.style.display = none;
	}
	if (rateError) {
		interestRateInput.classList.add(errorField);
		interestRateLabel.classList.add(errorField);
		interestRateError.style.display = block;
	} else {
		interestRateInput.classList.remove(errorField);
		interestRateLabel.classList.remove(errorField);
		interestRateError.style.display = none;
	}
	if (typeError) {
		mortgageTypeError.style.display = block;
	} else {
		mortgageTypeError.style.display = none;
	}
	if (isWithoutResult) {
		resultsEmpty.style.display = flex;
		resultsSuccess.style.display = none;
		return;
	}
	if (amountError || termError || rateError || typeError) {
		resultsEmpty.style.display = flex;
		resultsSuccess.style.display = none;
	} else {
		resultsEmpty.style.display = none;
		resultsSuccess.style.display = flex;
		return false;
	}
	return true;
}

/**
 *
 * @param {number} mortgageAmount
 * @param {number} mortgageTerm
 * @param {number} interestRate
 * @param {string} mortgageType
 * @returns void
 */
function calculateMortgage(
	mortgageAmount,
	mortgageTerm,
	interestRate,
	mortgageType,
) {
	const monthlyRate = interestRate / 100 / 12;
	const totalPayments = mortgageTerm * 12;
	let monthlyRepayment;
	let totalRepayment;
	if (mortgageType === "repayment") {
		monthlyRepayment =
			(mortgageAmount * (monthlyRate * (1 + monthlyRate) ** totalPayments)) /
			((1 + monthlyRate) ** totalPayments - 1);
		totalRepayment = monthlyRepayment * totalPayments;
	} else if (mortgageType === "interestOnly") {
		monthlyRepayment = mortgageAmount * monthlyRate;
		totalRepayment = monthlyRepayment * totalPayments + Number(mortgageAmount);
	}
	return {
		monthlyRepayment: monthlyRepayment.toLocaleString("en-US", {
			style: "currency",
			currency: "GBP",
		}),
		totalRepayment: totalRepayment.toLocaleString("en-US", {
			style: "currency",
			currency: "GBP",
		}),
	};
}
