import { addKeyword, EVENTS } from "@builderbot/bot";
import { generateTimer } from "src/utils/generateTimer";
import { clearHistory } from "src/utils/handleHistory";

const endFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    `¡Qué pena que te vayas, justo cuando estábamos conectando! 😢 Pero está bien,no soy de esos bots que insisten... por ahora.`,
    { delay: generateTimer(150, 250) }
  )
  .addAnswer(
    "`Si necesitas algo más, ya sabes dónde encontrarme. 🩺✨ ¡Cuídate y no olvides que las citas médicas no se agendan solas! 😉🙃",
    { delay: generateTimer(150, 250) }
  )
  .addAction(async (_, { endFlow, state }) => {
    await clearHistory(state);
    return endFlow();
  });

export { endFlow };
