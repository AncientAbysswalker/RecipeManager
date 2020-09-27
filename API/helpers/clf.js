// Build the CLF string
exports.build = (ip, uid, time_req, method, req, status, size) => {
  return `${ip} - ${uid} [${time_req}] "${method} ${req}" ${status} ${size}\n`;
};

// Build a time stamp for the CLF format
exports.date = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the time string bits
  let date = new Date();
  let dd = enforceTwoDigit(date.getDate());
  let mmm = months[date.getMonth()];
  let yyyy = date.getFullYear();
  let HH = enforceTwoDigit(date.getHours());
  let MM = enforceTwoDigit(date.getMinutes());
  let SS = enforceTwoDigit(date.getSeconds());
  let zzzz = "0000";

  return `${dd}/${mmm}/${yyyy}:${HH}:${MM}:${SS} ${zzzz}`;
};

// Convert a number to a two-digit number
function enforceTwoDigit(num) {
  return num > 9 ? num : "0" + num;
}
