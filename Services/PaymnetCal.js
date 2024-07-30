function parseDate(dateString) {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function getMonthDayDifference(startDateString, endDateString) {
  let start = parseDate(startDateString);
  let end = parseDate(endDateString);

  // Calculate total months difference
  let totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth();

  // Calculate days difference
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    totalMonths--;
    // Get the number of days in the previous month
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }

  return { months: totalMonths, days: days };
}

function calculateRent(monthlyRent, months, days, currentDue) {
  // Calculate rent for full months
  let totalRent = monthlyRent * months;

  // Calculate daily rent (assuming 30 days in a month)
  const dailyRent = monthlyRent / 30;

  // Calculate rent for the remaining days
  totalRent += dailyRent * days;

  // Add the current due amount
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
