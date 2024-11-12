import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "src/utils/handleHistory";

const promptInjectionFlow = addKeyword(EVENTS.ACTION)
  .addAnswer([
    `He detectado que tienes la intención de inyectar un mensaje en el flujo del bot.`,
    `¿Otro intento de hackearme? Qué original. 😏`,
    `Démonos un descanso y hablamos luego.`,
  ])
  .addAction(async (ctx, { blacklist, endFlow, state }) => {
    const dataFromDb = { muted: true };

    if (dataFromDb.muted) {
      blacklist.add(ctx.from);
      console.log(`${ctx.from}! added to blacklist`);
    }

    await clearHistory(state);
    return endFlow();
  });

export { promptInjectionFlow };
