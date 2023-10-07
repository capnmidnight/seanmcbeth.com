import { TypedEventTarget } from "@juniper-lib/events/dist/TypedEventTarget";
import { ConnectionState } from "@juniper-lib/webrtc/dist/ConnectionState";
import {
    HubAnswerReceivedEvent,
    HubCloseEvent,
    HubIceReceivedEvent,
    HubOfferReceivedEvent,
    HubReconnectedEvent,
    HubReconnectingEvent,
    HubUserChatEvent,
    HubUserJoinedEvent,
    HubUserLeftEvent,
    IHub,
    IHubEvents
} from "@juniper-lib/webrtc/dist/IHub";
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState
} from "@microsoft/signalr";

const hubStateTranslations = new Map<HubConnectionState, ConnectionState>([
    [HubConnectionState.Connected, ConnectionState.Connected],
    [HubConnectionState.Connecting, ConnectionState.Connecting],
    [HubConnectionState.Reconnecting, ConnectionState.Connecting],
    [HubConnectionState.Disconnected, ConnectionState.Disconnected],
    [HubConnectionState.Disconnecting, ConnectionState.Disconnecting]
]);

export class SignalRHub extends TypedEventTarget<IHubEvents> implements IHub {
    private readonly hub: HubConnection;
    constructor(signalRPath: string) {
        super();

        this.hub = new HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl(signalRPath, HttpTransportType.WebSockets)
            .build();

        this.hub.onclose(() =>
            this.dispatchEvent(new HubCloseEvent()));

        this.hub.onreconnecting((err) =>
            this.dispatchEvent(new HubReconnectingEvent(err)));

        this.hub.onreconnected(() =>
            this.dispatchEvent(new HubReconnectedEvent()));

        this.hub.on("userJoined", (fromUserID: string, fromUserName: string) =>
            this.dispatchEvent(new HubUserJoinedEvent(fromUserID, fromUserName)));

        this.hub.on("iceReceived", (fromUserID: string, candidateJSON: string) =>
            this.dispatchEvent(new HubIceReceivedEvent(fromUserID, candidateJSON)));

        this.hub.on("offerReceived", (fromUserID: string, offerJSON: string) =>
            this.dispatchEvent(new HubOfferReceivedEvent(fromUserID, offerJSON)));

        this.hub.on("answerReceived", (fromUserID: string, answerJSON: string) =>
            this.dispatchEvent(new HubAnswerReceivedEvent(fromUserID, answerJSON)));

        this.hub.on("userLeft", (fromUserID: string) =>
            this.dispatchEvent(new HubUserLeftEvent(fromUserID)));

        const userChatEvent = new HubUserChatEvent();
        this.hub.on("chat", (fromUserID: string, text: string) => {
            userChatEvent.set(fromUserID, text);
            this.dispatchEvent(userChatEvent);
        });

        window.addEventListener("unload", () => this.stop());
    }

    start(): Promise<void> {
        return this.hub.start();
    }

    stop(): Promise<void> {
        return this.hub.stop();
    }

    invoke<T>(methodName: string, ...params: any[]): Promise<T> {
        return this.hub.invoke(methodName, ...params);
    }

    get connectionState() {
        return hubStateTranslations.get(this.hub.state);
    }
}