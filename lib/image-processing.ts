"use client";
import getPixels from "get-pixels";
import * as tf from "@tensorflow/tfjs";

export async function transformImageIntoTensor(
  file: any
): Promise<tf.Tensor3D> {
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
      res(tf.tensor(alphaRemovedArray, [pixels.shape[0], pixels.shape[1], 3]));
    });
  });
}

export async function preprocessImage(file: any): Promise<tf.Tensor> {
  const imageTensor = await transformImageIntoTensor(file);
  const imageReshaped = tf.image.resizeBilinear(imageTensor, [28, 28]);
  const grayScaleImage = tf.image.rgbToGrayscale(imageReshaped);
  return grayScaleImage;
}
