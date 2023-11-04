import getPixels from "get-pixels";

export async function transformImageIntoArray(file: any): Promise<number[]> {
  return new Promise((res, rej) => {
    getPixels(file, function (err, pixels) {
      if (err) {
        console.log("Bad image path");
        rej(err);
        return;
      }
      console.log(pixels.dimension);
      console.log(pixels.shape);
      const convertedArray = Array.from(pixels.data).map((x) => x / 255);
      // Remove the alpha channel from the array
      const alphaRemovedArray: number[] = [];
      for (let i = 0; i < convertedArray.length; i += 4) {
        alphaRemovedArray.push(
          convertedArray[i],
          convertedArray[i + 1],
          convertedArray[i + 2]
        );
      }
      res(alphaRemovedArray);
    });
  });
}
