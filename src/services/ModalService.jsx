import React from "react";
import ReactDOM from "react-dom/client";
import RevokeConfirmModal from "../components/RevokeConfirmModal";

const modalContainerId = "modal-portal-root";

function getModalRoot() {
  let container = document.getElementById(modalContainerId);
  if (!container) {
    container = document.createElement("div");
    container.id = modalContainerId;
    container.style.cssText = "position:fixed;inset:0;z-index:9999;";
    document.body.appendChild(container);
  }
  return ReactDOM.createRoot(container);
}

function removeModalRoot() {
  const container = document.getElementById(modalContainerId);
  if (container) {
    container.remove();
  }
  modalRenderer = null;
}

let modalRenderer = null;

class ModalService {
  static revokeConfirm = null;
  static confirmRevoke = null;
  static saving = false;
  
  static init(onConfirm) {
    this.confirmRevoke = onConfirm;
  }
  
  static show(data) {
    console.log("ModalService.show called with:", data);
    this.revokeConfirm = data;
    this.render();
  }
  
  static hide() {
    console.log("ModalService.hide called");
    this.revokeConfirm = null;
    this.saving = false;
    removeModalRoot();
  }

  static setSaving(value) {
    this.saving = value;
    this.render();
  }
  
  static render() {
    console.log("ModalService.render called, revokeConfirm:", this.revokeConfirm);
    
    try {
      if (!this.revokeConfirm) {
        removeModalRoot();
        return;
      }
      
      if (!modalRenderer) {
        modalRenderer = getModalRoot();
      }
      
      modalRenderer.render(
        React.createElement(RevokeConfirmModal, {
          revokeConfirm: this.revokeConfirm,
          setRevokeConfirm: (data) => {
            console.log("setRevokeConfirm called with:", data);
            if (data === null) this.hide();
          },
          confirmRevoke: async () => {
            console.log("confirmRevoke clicked");
            this.saving = true;
            this.render();
            if (this.confirmRevoke) {
              await this.confirmRevoke(this.revokeConfirm);
            }
            this.hide();
          },
          saving: this.saving
        })
      );
      console.log("Modal rendered successfully");
    } catch (error) {
      console.error("ModalService render error:", error);
    }
  }
}

export default ModalService;