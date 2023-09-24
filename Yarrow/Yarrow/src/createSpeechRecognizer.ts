import { ActivityDetector } from "@juniper-lib/audio/dist/ActivityDetector";
import { LocalUserMicrophone } from "@juniper-lib/audio/dist/LocalUserMicrophone";
import { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { createSpeechRecognizer as create } from "@juniper-lib/speech/dist/createSpeechRecognizer";
import { ISpeechRecognizer } from "@juniper-lib/speech/dist/ISpeechRecognizer";

export function createSpeechRecognizer(fetcher: IFetcher, activity: ActivityDetector, microphones: LocalUserMicrophone, forceFallback = false): ISpeechRecognizer {
    return create(fetcher, activity, microphones, "/ai/conversation/listen", forceFallback);
}
