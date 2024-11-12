import { BotContext, BotMethods } from "@builderbot/bot/dist/types";
import { handleHistory } from "../utils/handleHistory";

export default async ({ body }: BotContext, { state, }: BotMethods) => {
    if(body.includes('_event_')) return
    await handleHistory({ content: body, role: 'user' }, state)
}