import { addKeyword, EVENTS } from "@builderbot/bot";
import { generateTimer } from "../utils/generateTimer";
import { typing } from "../utils/presence";
import { provider } from "src/provider";
import AIClass from "src/services/ai";
import { DATA_TERMS_PROMPT } from "src/prompts/data-terms.prompt";
import { STATE } from "src/constants/state";

const dataTermsFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Buen día 👋! , Bienvenido a la central de citas del Hospital Municipal de Acacías, los datos que suministre en este canal serán tratados según la *Ley de Protección de Datos Personales (1581 de 2012)*"
  )
  .addAnswer(
    "Puede consultar nuestra política de tratamiento de datos en el siguiente enlace: https://shorturl.at/fyBAN 📜"
  )
  .addAnswer(
    "¿Acepta que sus datos sean tratados de acuerdo a la ley?",
    { capture: true },
    async (ctx, { state, extensions, flowDynamic, endFlow }) => {
      const ai = extensions.ai as AIClass;
      const { body } = ctx;

      const { dataTermsAccepted } = await ai.userAcceptsDataTermsFn([
        {
          role: "system",
          content: buildDataTermsPrompt(body),
        },
      ]);

      console.log({ dataTermsAccepted });

      if (!dataTermsAccepted) {
        await typing(ctx, provider);
        await flowDynamic(
          [
            "Lo siento, no podemos continuar si no acepta los términos de tratamiento de datos. 😔",
          ],
          { delay: generateTimer(150, 250) }
        );
        return endFlow();
      }

      await state.update({
        [STATE.userAlreadyAcceptDataTerms]: dataTermsAccepted,
      }),
        await flowDynamic(
          [
            "¡Gracias por aceptar los términos de tratamiento de datos! 🎉",
            "Por favor, cuéntame en qué puedo ayudarte hoy. 😊",
          ],
          { delay: generateTimer(150, 250) }
        );

      return endFlow();
    }
  );

export const buildDataTermsPrompt = (history: string) => {
  return DATA_TERMS_PROMPT.replace("{HISTORY}", history);
};

export { dataTermsFlow };
