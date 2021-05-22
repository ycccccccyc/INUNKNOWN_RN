import React, { Component } from 'react'
import * as tf from '@tensorflow/tfjs';
import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';
import ImgToBase64 from 'react-native-image-base64';

export function toDataUri(base64) {
  return `data:image/jpeg;base64,${base64}`;
}

export async function resizeContent(
    imageUrl, width, resizeRatio, compress) {
  const newWidth = Math.floor(width * resizeRatio);
  let actions = [];
  if (width) {
    actions = [{
      resize: {
        newWidth,
      },
    }];
  } else actions = [];

  const saveOptions = {
    compress: compress || 0.75,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  };
  const res =
      await ImageManipulator.manipulateAsync(imageUrl, actions, saveOptions);
  return res;
}

export async function resizeStyle(
  imageUrl, width, height, autoResize, compress) {
  const actions = [];
  const saveOptions = {
    compress: compress || 0.75,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  };
  const res =
      await ImageManipulator.manipulateAsync(imageUrl, actions, saveOptions);
  return res;
}

export async function base64ImageToTensor(base64) {
  console.log(tf.util.encodeString(base64, 'base64'));
  const rawImageData = tf.util.encodeString(base64, 'base64');
  const TO_UINT8ARRAY = true;
  const {width, height, data} = jpeg.decode(rawImageData, TO_UINT8ARRAY);
  // Drop the alpha channel info
  const buffer = new Uint8Array(width * height * 3);
  let offset = 0;  // offset into original data
  for (let i = 0; i < buffer.length; i += 3) {
    buffer[i] = data[offset];
    buffer[i + 1] = data[offset + 1];
    buffer[i + 2] = data[offset + 2];

    offset += 4;
  }
  return tf.tensor3d(buffer, [height, width, 3]);
}

export async function tensorToImageUrl(imageTensor){
  const [height, width] = imageTensor.shape;
  const buffer = await imageTensor.toInt().data();
  const frameData = new Uint8Array(width * height * 4);

  let offset = 0;
  for (let i = 0; i < frameData.length; i += 4) {
    frameData[i] = buffer[offset];
    frameData[i + 1] = buffer[offset + 1];
    frameData[i + 2] = buffer[offset + 2];
    frameData[i + 3] = 0xFF;

    offset += 3;
  }

  const rawImageData = {
    data: frameData,
    width,
    height,
  };
  const jpegImageData = jpeg.encode(rawImageData, 75);
  const base64Encoding = tf.util.decodeString(jpegImageData.data, 'base64');
  return base64Encoding;
}

export async function imageToBase64(image) {
  try {
    ImgToBase64.getBase64String(image)
    .then(base64String => {
      return base64String;
    })
    .catch(err => console.log(err));
  } catch (err) {
    console.log(err);
  }
}
