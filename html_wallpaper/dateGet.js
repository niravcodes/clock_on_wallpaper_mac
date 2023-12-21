const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
function getEnglishDate() {
  const date = new Date();
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getTime() {
  const date = new Date();
  var meridian = date.getHours() >= 12 ? "PM" : "AM";
  return `${date.getHours() % 12}:${
    date.getMinutes() <= 9 ? "0" : ""
  }${date.getMinutes()} ${meridian}`;
}
