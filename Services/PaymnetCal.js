function parseDate(dateString) {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function getMonthDayDifference(startDateString, endDateString) {
  console.log(startDateString)
  const start = parseDate(startDateString);
  const end = parseDate(endDateString);

  let months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  // Adjust months if days difference is negative
  if (days < 0) {
    months--;
    const lastMonthEnd = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += lastMonthEnd;
  }

  return { months: months, days: days };
}

function calculateRent(monthlyRent, months, days, currentDue) {
  let totalRent = monthlyRent * months;
  const dailyRent = monthlyRent / 30;
  totalRent += dailyRent * days;
  totalRent += currentDue;
  return totalRent;
}

function calculatePeriods(monthlyRent, payment, totalRent) {
  // Calculate the remaining amount after payment
  let remainingAmount = totalRent - payment;

  if (remainingAmount <= 0) {
    return {
      remaining: { months: 0, days: 0, remainingAmount: 0 },
      paid: {
        months: Math.floor(totalRent / monthlyRent),
        days: Math.round((totalRent % monthlyRent) / (monthlyRent / 30)),
      },
    };
  }

  // Calculate the paid amount
  let paidAmount = payment;

  // Calculate the paid months
  let paidMonths = Math.floor(paidAmount / monthlyRent);

  // Calculate the paid days
  let paidDays = Math.round((paidAmount % monthlyRent) / (monthlyRent / 30));

  // Calculate the remaining months
  let remainingMonths = Math.floor(remainingAmount / monthlyRent);

  // Calculate the remaining days
  let remainingDays = Math.round(
    (remainingAmount % monthlyRent) / (monthlyRent / 30)
  );

  return {
    remaining: {
      months: remainingMonths,
      days: remainingDays,
      remainingAmount: remainingAmount.toFixed(2),
    },
    paid: { months: paidMonths, days: paidDays },
  };
}

module.exports = {
  getMonthDayDifference,
  calculateRent,
  calculatePeriods,
};
