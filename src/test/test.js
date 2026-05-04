/* const now = new Date();

console.log(
  new Date(now.getFullYear(), now.getMonth() - 1, 1),

);
console.log(new Date(now.getFullYear(), now.getMonth(), 0)); */

const getPresentDate = (preset) => {
  const now = new Date();

  const thisMonth = {
    firstDay: new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0],
    lastDay: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0],
  };

  const lastMonth = {
    firstDay: new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .split("T")[0],
    lastDay: new Date(now.getFullYear(), now.getMonth(), 0)
      .toISOString()
      .split("T")[0],
  };

  const lastThreeMonths = {
    firstDay: new Date(now.getFullYear(), now.getMonth() - 2, 1)
      .toISOString()
      .split("T")[0],
    lastDay: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0],
  };

  if (preset === "thisMonth") return thisMonth;

  if (preset === "lastMonth") return lastMonth;

  return lastThreeMonths;
};
