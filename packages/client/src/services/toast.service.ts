import { Service } from "../Service";

export type TOAST_DURATION = "LONG" | "SHORT";

export interface ToastData {
  message: string | null;
  duration: TOAST_DURATION | null;
}

export class ToastService extends Service<ToastData> {
  getInitialState() {
    return {
      message: null,
      duration: null,
    };
  }

  async showToastMessage(message: string, duration: TOAST_DURATION = "SHORT") {
    return this.set({
      message,
      duration,
    });
  }
}
