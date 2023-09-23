import { ActivityDetector } from "@juniper-lib/audio/ActivityDetector";
import { LocalUserMicrophone } from "@juniper-lib/audio/LocalUserMicrophone";
import { IFetcher } from "@juniper-lib/fetcher/IFetcher";
import { createSpeechRecognizer as create } from "@juniper-lib/speech/createSpeechRecognizer";
import { ISpeechRecognizer } from "@juniper-lib/speech/ISpeechRecognizer";

export function createSpeechRecognizer(fetcher: IFetcher, activity: ActivityDetector, microphones: LocalUserMicrophone, forceFallback = false): ISpeechRecognizer {
    return create(fetcher, activity, microphones, "/ai/conversation/listen", forceFallback);
}
