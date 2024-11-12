import { createFlow } from "@builderbot/bot";

import { welcomeFlow } from "./welcome.flow";
import { assistantFlow } from "./assistant.flow";
import { dataTermsFlow } from "./data-terms.flow";
import { scheduleFlow } from "./schedule.flow";
import { idleFlow } from "src/utils/idle";
import { promptInjectionFlow } from "./prompt-injection.flow";


export default createFlow([
    welcomeFlow,
    assistantFlow,
    dataTermsFlow,
    scheduleFlow,
    promptInjectionFlow,
    idleFlow
])