import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

function AlertModal({ handleDelete, eventId }) {


    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
                <button className="btn__primary btn__cancel">Delete event</button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="AlertDialogOverlay" />
                <AlertDialog.Content className="AlertDialogContent">
                    <AlertDialog.Title className="AlertDialogTitle h3">
                        Are you absolutely sure?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="AlertDialogDescription txt-medium">
                        This action cannot be undone. This will permanently delete your
                        event.
                    </AlertDialog.Description>
                    <div className="AlertDialog__buttons">
                        <AlertDialog.Cancel asChild>
                            <button className="AlertDialog__cancel btn__primary btn__cancel">Cancel</button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild onClick={handleDelete}>
                            <button className="AlertDialog__confirm btn__primary">Yes, delete event</button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};

export default AlertModal;
