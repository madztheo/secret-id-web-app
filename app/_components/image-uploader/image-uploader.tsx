"use client";
import { preprocessImage } from "@/lib/image-processing";
import styles from "./image-uploader.module.scss";
import { FileUploader } from "@/components/file-uploader/FileUploader";
import { useRef, useState } from "react";
import { useSharedResources } from "@/providers/ezkl";

export default function ImageUploader() {
  const { engine, utils } = useSharedResources();
  const fileUploaderRef = useRef<HTMLInputElement>();
  const [file, setFile] = useState<{
    file?: File | undefined;
    url: string;
  }>();

  const generateWitness = async () => {
    const imageTensor = await preprocessImage(file?.url);
    try {
      const { output, executionTime } = await utils.handleGenWitnessButton(
        imageTensor
      );
      const witness = engine.deserialize(output);
      console.log("witness", witness);
      return output;
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const onUpload = async () => {
    if (fileUploaderRef && fileUploaderRef.current) {
      fileUploaderRef.current.click();
    }
  };

  const onGenerateProof = async () => {
    const witness = await generateWitness();
  };

  return (
    <div className={styles.container}>
      <FileUploader
        onFileUploaded={(file) => {
          setFile(file);
        }}
        inputRef={fileUploaderRef}
      />
      <div className={styles.buttons}>
        <button className={styles.button} onClick={onUpload}>
          Upload
        </button>
        {file && (
          <button className={styles.button} onClick={onGenerateProof}>
            Generate proof
          </button>
        )}
      </div>
    </div>
  );
}
