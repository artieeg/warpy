import { APIClient, WebSocketConn } from "@warpy/api";
import { Service } from "../Service";

export interface ApiData {
  api: APIClient;
  isConnected: boolean;
}

export class ApiService extends Service<ApiData> {
  getInitialState() {
    return {
      api: APIClient(new WebSocketConn()),
      isConnected: false,
    };
  }
}
