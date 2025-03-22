/**
 * 记 rev 为翻转后的数字，为完成翻转，我们可以重复「弹出」x 的末尾数字，将其「推入」rev 的末尾，直至 x 为 0。
 * 要在没有辅助栈或数组的帮助下「弹出」和「推入」数字，我们可以使用如下数学方法：digit = x % 10;  Math.floor(x / 10);
 * @param x
 * @returns
 */
export function reverse_7(x: number): number {
  let rev = 0;
  while (x != 0) {
    const digit = x % 10;
    x = Math.floor(x / 10);
    rev = rev * 10 + digit;
    if (rev < Math.pow(-2, 31) || rev > Math.pow(2, 31) - 1) {
      return 0;
    }
  }
  return rev;
}
