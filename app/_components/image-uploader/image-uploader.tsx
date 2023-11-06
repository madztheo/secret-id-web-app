"use client";
import { preprocessImage } from "@/lib/image-processing";
import styles from "./image-uploader.module.scss";
import { FileUploader } from "@/components/file-uploader/FileUploader";
import { useRef, useState } from "react";
import { useSharedResources } from "@/providers/ezkl";
import { Button } from "@/components/button/Button";

export default function ImageUploader() {
  const { engine, utils } = useSharedResources();
  const fileUploaderRef = useRef<HTMLInputElement>();
  const [file, setFile] = useState<{
    file?: File | undefined;
    url: string;
  }>();
  const [processingImage, setProcessingImage] = useState(false);
  const [generatingProof, setGeneratingProof] = useState(false);

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

  const verifyProof = async (proof: any) => {
    // Transform the proof object into a Uint8ClampedArray
    const convertedProof = engine.serialize(proof);
    const verifRes = await utils.handleVerifyButton(convertedProof);
    return verifRes;
  };

  const onUpload = async () => {
    if (fileUploaderRef && fileUploaderRef.current) {
      setProcessingImage(true);
      fileUploaderRef.current.click();
    }
  };

  const onGenerateProof = async () => {
    try {
      setGeneratingProof(true);
      const witness = await generateWitness();
      const { output } = await utils.handleGenProofButton(
        new Uint8ClampedArray(witness!)
      );
      const proof = engine.deserialize(output);
      console.log("proof", proof);
      const verifRes = await verifyProof(proof);
      console.log("verifRes", verifRes);
      setGeneratingProof(false);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className={styles.container}>
      <FileUploader
        onFileUploaded={(file) => {
          setFile(file);
          setProcessingImage(false);
        }}
        inputRef={fileUploaderRef}
      />
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          text="Upload"
          loading={processingImage}
          loadingText="Uploading..."
          onClick={onUpload}
        />
        {file && (
          <Button
            className={styles.button}
            text="Generate proof"
            loading={generatingProof}
            loadingText="Generating..."
            onClick={onGenerateProof}
          />
        )}
      </div>
    </div>
  );
}
