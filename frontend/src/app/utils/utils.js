import { INVOICE_STATUS } from "../constants/constants";
import InvoiceDetail from "../i/invoices/components/invoice-detail";

export function convertAmountToWords(num) {
  if (num === 0) return "zero";

  const belowTwenty = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const thousands = [
    "",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
    "sextillion",
  ];

  function convertChunk(n) {
    if (n === 0) return "";
    else if (n < 20) return belowTwenty[n] + " ";
    else if (n < 100)
      return tens[Math.floor(n / 10)] + " " + convertChunk(n % 10);
    else
      return (
        belowTwenty[Math.floor(n / 100)] + " hundred " + convertChunk(n % 100)
      );
  }

  let word = "";
  let chunkIndex = 0;

  while (num > 0) {
    let chunk = num % 1000;
    if (chunk > 0) {
      word = convertChunk(chunk) + thousands[chunkIndex] + " " + word;
    }
    num = Math.floor(num / 1000);
    chunkIndex++;
  }

  return word.trim();
}

export function formatCurrentDate(date = null) {
  const now = date || new Date();
  const monthNames = [
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

  const month = monthNames[now.getMonth()];
  const day = now.getDate().toString().padStart(2, "0");
  const year = now.getFullYear().toString();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = now.getHours() >= 12 ? "PM" : "AM";

  return `${month} ${day}, ${year}  ${hours}:${minutes} ${period}`;
}

export function getInvoiceStatusColor(status) {
  let color = "";

  switch (status) {
    case INVOICE_STATUS.PENDING:
      color = "text-yellow-600";

      break;
    case INVOICE_STATUS.PARTIAL:
      color = "text-orange-600";
      break;
    case INVOICE_STATUS.PROCESSED:
      color = "text-green-600";
      break;
    case INVOICE_STATUS.COMPLETED:
      color = "text-blue-600";
      break;

    default:
      color = "text-gray-600";
      break;
  }

  return color;
}
