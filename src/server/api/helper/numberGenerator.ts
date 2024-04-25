export default function generateRandomNumber(length = 6) {
  length = Math.floor(Math.abs(length));

  const random = Math.random();

  const maxNumber = Math.pow(10, length) - 1;
  const randomNumber = Math.floor(random * maxNumber);

  return randomNumber + 1;
}
