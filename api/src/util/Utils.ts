export class Utils {
  public static chunk(array: any[], size: number) {
    const chunkedArray: any[] = [];
    let index = 0;
    while (index < array.length) {
      chunkedArray.push(array.slice(index, size + index));
      index += size;
    }
    return chunkedArray;
  }
}