import { BaseTele } from "@juniper-lib/threejs/dist/BaseTele";
import type { Environment } from "@juniper-lib/threejs/dist/environment/Environment";
import { TeleconferenceManager } from "@juniper-lib/webrtc/dist/TeleconferenceManager";
import { SignalRHub } from "./SignalRHub";

export default class Tele extends BaseTele {
    private hubName: string = null;
    
    constructor(env: Environment) {
        super(env);

        Object.seal(this);
    }

    override async init(params: Map<string, unknown>): Promise<void> {
        this.hubName = params.get("hub") as string;
        if (!this.hubName) {
            throw new Error("Missing hub parameter");
        }

        await super.init(params);
    }

    override setConferenceInfo(userType: string, userName: string, meetingID: string): Promise<void> {
        this.log("connect", {
            userName,
            meetingID,
            userType
        });
        return super.setConferenceInfo(userType, userName, meetingID);
    }

    protected createConference(): TeleconferenceManager {
        return new TeleconferenceManager(
            this.env.audio,
            this.env.microphones,
            this.env.webcams,
            new SignalRHub(this.hubName)
        );
    }
}