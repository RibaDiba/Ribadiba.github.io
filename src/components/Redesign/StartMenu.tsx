import styles from "./DesktopSection.module.css";

interface StartMenuFolder {
    id: string;
    label: string;
}

interface StartMenuProps {
    open: boolean;
    folders: StartMenuFolder[];
    onOpenTerminal: () => void;
    onOpenReadme: () => void;
    onOpenFolder: (id: string) => void;
}

const StartMenu = ({ open, folders, onOpenTerminal, onOpenReadme, onOpenFolder }: StartMenuProps) => {
    return (
        <div
            className={`${styles.startMenu} ${open ? styles.startMenuOpen : ""}`}
            role="menu"
            aria-hidden={!open}
            onClick={(event) => event.stopPropagation()}
        >
            <div className={styles.startMenuHead}>abir_os</div>
            <button
                type="button"
                className={styles.startMenuItem}
                onClick={onOpenTerminal}
                role="menuitem"
            >
                ▸ Claude Code (terminal)
            </button>
            <button
                type="button"
                className={styles.startMenuItem}
                onClick={onOpenReadme}
                role="menuitem"
            >
                ▸ readme.txt
            </button>
            <div className={styles.startMenuSep} aria-hidden="true" />
            {folders.map((folder) => (
                <button
                    key={folder.id}
                    type="button"
                    className={styles.startMenuItem}
                    onClick={() => onOpenFolder(folder.id)}
                    role="menuitem"
                >
                    ▸ {folder.label}
                </button>
            ))}
        </div>
    );
};

export default StartMenu;
