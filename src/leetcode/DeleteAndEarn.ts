// 删除并获得点数

/**
 * 
 * 根据题意，在选择了元素 x 后，该元素以及所有等于 x−1 或 x+1 的元素会从数组中删去。若还有多个值为 x 的元素，
 * 由于所有等于 x−1 或 x+1 的元素已经被删除，我们可以直接删除 x 并获得其点数。因此若选择了 x，所有等于 x 的元素也应一同被选择，
 * 以尽可能多地获得点数。
 * 记元素 x 在数组中出现的次数为 c x
 ，我们可以用一个数组 sum 记录数组 nums 中所有相同元素之和，即 sum[x]=x⋅c x
 。若选择了 x，则可以获取 sum[x] 的点数，且无法再选择 x−1 和 x+1。
 * @param {number[]} nums
 * @return {number}
 */
export function deleteAndEarn(nums: number[]): number {
  const rob = (nums: number[]) => {
    const n = nums.length;
    let first = nums[0];
    let second = Math.max(nums[0], nums[1]);
    for (let i = 2; i < n; i++) {
      let temp = second;
      second = Math.max(first + nums[i], second);
      first = temp;
    }
    return second;
  };
  const maxVal = Math.max(...nums);
  const sum = new Array(maxVal + 1).fill(0);
  for (const num of nums) {
    sum[num] += num;
  }
  return rob(sum);
}
