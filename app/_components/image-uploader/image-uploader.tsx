"use client";
import { transformImageIntoArray } from "@/lib/image-processing";
import styles from "./image-uploader.module.scss";

export default function ImageUploader() {
  const onUpload = async () => {
    const res = await transformImageIntoArray("/images/sample-card.jpg");
    console.log(res);
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={onUpload}>
        Upload
      </button>
    </div>
  );
}
