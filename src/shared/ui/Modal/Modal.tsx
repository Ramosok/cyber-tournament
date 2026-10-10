import { useEffect, useImperativeHandle, useRef } from "react";

import type { MouseEvent, PropsWithChildren, ReactElement, Ref } from "react";

import { Icon } from "@/shared/ui/icon";
import { lockScroll, unlockScroll } from "@/shared/ui/Modal/scrollLock";

import styles from "./modal.module.css";

const maxHeight = 20;

export type ModalHandle = {
  showModal: () => void;
  close: () => void;
};

type ModalProps = PropsWithChildren<{
  onClose?: () => void;
  noCross?: boolean;
  className?: string;
  /** В React 19 ref передаётся как обычный проп — forwardRef не нужен. */
  ref?: Ref<ModalHandle>;
}>;

export const Modal = ({
  children,
  noCross,
  onClose,
  className = "",
  ref,
}: ModalProps): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    showModal() {
      lockScroll();
      dialogRef.current?.showModal();
    },
    close() {
      dialogRef.current?.close();
    },
  }));

  const handleClose = (): void => {
    dialogRef.current?.close();
    unlockScroll();
    onClose?.();
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>): void => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      handleClose();
    }
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    const thumb = thumbRef.current;
    if (!scroller || !thumb) return;

    const updateThumb = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;

      if (scrollHeight <= clientHeight) {
        thumb.style.display = "none";
        return;
      }

      thumb.style.display = "block";

      const marginTop = 4;
      const marginBottom = 4;
      const trackHeight = clientHeight - marginTop - marginBottom;
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(maxHeight, ratio * trackHeight);
      const maxScroll = scrollHeight - clientHeight;
      const maxThumbPos = trackHeight - thumbHeight;
      const scrollPos =
        maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbPos : 0;

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.top = `${marginTop + scrollPos}px`;
    };

    const handleScroll = (): void => updateThumb();

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    updateThumb();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateThumb);
    });
    resizeObserver.observe(scroller);

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <dialog
      className={styles.dialog}
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        {!noCross && (
          <button type="button" className={styles.cross} onClick={handleClose}>
            <Icon width="22" height="22" icon="cross" />
          </button>
        )}
        <section className={className === "" ? styles.container : className}>
          <div className={styles.scroller} ref={scrollerRef}>
            {children}
          </div>
          <div className={styles.scrollbar}>
            <div className={styles.thumb} ref={thumbRef} />
          </div>
        </section>
      </div>
    </dialog>
  );
};
