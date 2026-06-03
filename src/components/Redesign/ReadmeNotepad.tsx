import { readmeMarkup } from "@/stores/abirOsContent";
import styles from "./DesktopSection.module.css";

const ReadmeNotepad = () => {
    return (
        <div
            className={styles.notePad}
            dangerouslySetInnerHTML={{ __html: readmeMarkup }}
        />
    );
};

export default ReadmeNotepad;
