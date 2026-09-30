import { ActionsBar } from "../../shared/components/actions-bar.js";

export class MailActionsBar extends ActionsBar {
  get markup() {
    return `
      <div>
        <img id="addFolder" data-command="add-folder" title="Add folder" src="../shared/images/dark/plus.svg" />
        <img id="deleteFolder" data-command="delete-folder" title="Delete folder" src="../shared/images/dark/minus.svg" />
        <img id="showEmptyFolders" data-command="toggle-empty-folders" title="Show empty folders" src="../shared/images/dark/up-arrow.svg" />

        <img id="markAsRead" data-command="mark-as-read" title="Mark as read" src="../shared/images/dark/mark.svg" />
        <img id="archive" data-command="archive" title="Move to another folder" src="../shared/images/dark/down-arrow.svg" />
        <img id="deleteEmails" data-command="delete-emails" title="Delete" src="../shared/images/dark/delete.svg" />
      </div>

      <div>
        <img id="reply" data-command="reply" title="Reply" src="../shared/images/dark/reply.svg" />
        <img id="replyAll" data-command="reply-all" title="Reply all" src="../shared/images/dark/reply-all.svg" />
        <img id="forward" data-command="forward" title="Forward" src="../shared/images/dark/forward.svg" />

        <img id="load" data-command="load-mail" title="Load mail folder" src="../shared/images/dark/button-load.svg" />
        <img id="reload" data-command="reload" title="Reload" src="../shared/images/dark/sync.svg" />
        <img id="newEmail" data-command="new-email" title="New email" src="../shared/images/dark/add-new.svg" />
      </div>`;
  }
}

customElements.define("actions-bar", MailActionsBar);
