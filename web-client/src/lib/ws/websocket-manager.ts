import type { WsBaseEvent, WsEventType } from './websocket-events';

type WebsocketManagerListener<T extends WsBaseEvent> = (data: T) => void;

export class WebsocketManager {
	private socket: WebSocket | null = null;
	private listeners: Map<WsEventType, WebsocketManagerListener<any>[]> = new Map();

	constructor() {}

	public getStatus(): number {
		if (!this.socket) {
			return WebSocket.CLOSED;
		}

		return this.socket.readyState;
	}

	public addListener<T extends WsBaseEvent>(
		type: WsEventType,
		listener: WebsocketManagerListener<T>
	): void {
		if (this.listeners.has(type)) {
			this.listeners.get(type)?.push(listener);
			return;
		}

		this.listeners.set(type, [listener]);
	}

	public removeListener<T extends WsBaseEvent>(
		type: WsEventType,
		listener: WebsocketManagerListener<T>
	): void {
		const existListeners = this.listeners.get(type);

		if (!existListeners) {
			return;
		}

		const filteredListeners = existListeners.filter((l) => listener !== l);

		if (!filteredListeners.length) {
			this.listeners.delete(type);
			return;
		}

		this.listeners.set(type, filteredListeners);
	}

	public send<T extends WsBaseEvent>(event: T): void {
		const serializedEvent = this.serializeEventData(event);
		if (!serializedEvent) {
			console.warn('[WebsocketManager] cannot send empty value');
			return;
		}

		this.socket?.send(serializedEvent);
	}

	public connect(url: string) {
		if (this.socket) {
			console.warn('[WebsocketManager] websocket is already connected');
			return;
		}

		this.socket = new WebSocket(url);

		this.socket.onopen = () => {
			console.log('[WebsocketManager] websocket connected');
		};

		this.socket.onclose = () => {
			console.log('[WebsocketManager] websocket connection closed');
			this.socket = null;
		};

		this.socket.onerror = (error) => {
			console.error(`[WebsocketManager] websocket error: ${error}`);
		};

		this.socket.onmessage = (event) => {
			const parsed = this.parseEventData(event.data);
			if (!parsed) {
				return;
			}

			console.log('[WebsocketManager] message received:', parsed);

			if (!this.listeners.has(parsed.type)) {
				return;
			}

			const filteredListeners = this.listeners.get(parsed.type);

			if (!filteredListeners) {
				return;
			}

			filteredListeners.forEach((listener) => listener(parsed));
		};
	}

	public close() {
		if (!this.socket) {
			console.warn('[WebsocketManager] nothing to close.');
			return;
		}

		if (
			this.socket.readyState === WebSocket.CLOSED ||
			this.socket.readyState === WebSocket.CLOSING
		) {
			console.warn('[WebsocketManager] socket already closed');
		}

		this.socket.close();
		this.socket = null;
	}

	private parseEventData(data: any): WsBaseEvent | null {
		try {
			return JSON.parse(data) satisfies WsBaseEvent;
		} catch (error) {
			console.error(`[WebsocketManager] error while parsing ws message: ${error}`);
			return null;
		}
	}

	private serializeEventData<T extends WsBaseEvent>(data: T): string {
		try {
			return JSON.stringify(data);
		} catch (error) {
			console.error(`[WebsocketManager] error while serializing ws message: ${error}`);
			return '';
		}
	}
}
