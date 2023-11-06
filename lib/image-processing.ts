"use client";
import * as tf from "@tensorflow/tfjs";

export async function preprocessImage(file: any): Promise<tf.Tensor> {
  const imageBitmap = await createImageBitmap(file);
  const imageTensor = tf.browser.fromPixels(imageBitmap);
  const imageReshaped = tf.image.resizeBilinear(imageTensor, [28, 28]);
  const grayScaleImage = tf.image.rgbToGrayscale(imageReshaped);
  return grayScaleImage.div(255);
}
