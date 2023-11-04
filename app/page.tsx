import styles from "./page.module.scss";
import ImageUploader from "./_components/image-uploader/image-uploader";

export default function Home() {
  return (
    <div className={styles.container}>
      <ImageUploader />
    </div>
  );
}
