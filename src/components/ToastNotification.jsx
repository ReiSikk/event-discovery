import React from "react";
import * as Toast from "@radix-ui/react-toast";
import styles from "./ToastNotification.module.css";
import { useEffect, useRef, useState, forwardRef } from "react";
import { XCircle } from "lucide-react";

const ToastNotification = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const timerRef = useRef(0);

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    useEffect(() => {
        if (ref) {
            ref.current = {
                triggerToast: () => {
                    setOpen(false);
                    window.clearTimeout(timerRef.current);
                    timerRef.current = window.setTimeout(() => {
                        setOpen(true);
                    }, 100);
                }
            };
        }
    }, [ref]);

    return (
        <Toast.Provider swipeDirection="right">
            <Toast.Root className={styles.Root} open={open} onOpenChange={setOpen} duration={2000}>
                <Toast.Title className={styles.Title}>Event Created</Toast.Title>
                <Toast.Description asChild>
                    <span className={`${styles.Description} txt-medium`}>Your event has been successfully created!</span>
                </Toast.Description>
				<Toast.Close className={styles.Close}>
					<XCircle size={32} />
				</Toast.Close>
            </Toast.Root>
            <Toast.Viewport className={styles.Viewport} />
        </Toast.Provider>
    );
});

export default ToastNotification;