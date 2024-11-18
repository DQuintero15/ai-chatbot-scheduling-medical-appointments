import { addKeyword, EVENTS } from "@builderbot/bot";
import { generateTimer } from "../utils/generateTimer";
import { handleHistory } from "../utils/handleHistory";
import { toAsk } from "@builderbot-plugins/openai-assistants";
import { typing } from "../utils/presence";
import { ASSISTANT_ID } from "src/config";
import { provider } from "src/provider";
import { dataTermsFlow } from "./data-terms.flow";
import { STATE } from "src/constants/state";
import { PatientsService } from "src/services/patients";


const assistantFlow = addKeyword(EVENTS.ACTION)
  .addAction(
    async (ctx, { state, flowDynamic, gotoFlow, endFlow, extensions }) => {
      const patientService = extensions.patientService as PatientsService;

      const currentPhone = ctx.from.replace("57", "");

      const patientPolicyStatus =
        await patientService.isPatientDataPolicyConfirmed(currentPhone);

      if (patientPolicyStatus) {
        await state.update({
          [STATE.userAlreadyAcceptDataTerms]: patientPolicyStatus,
        });
      }

      const dataTermsAccepted = state.get<Boolean | undefined>(
        STATE.userAlreadyAcceptDataTerms
      );

      console.log(`[DEBUG]: dataTermsAccepted`, dataTermsAccepted);

      if (dataTermsAccepted === undefined) return gotoFlow(dataTermsFlow);

      if (dataTermsAccepted === false) {
        await typing(ctx, provider);

        await flowDynamic(
          [
            "Lo siento, no podemos continuar si no acepta los términos de tratamiento de datos.",
          ],
          { delay: generateTimer(150, 250) }
        );

        return endFlow();
      }
    }
  )
  .addAction(async (ctx, { state, flowDynamic }) => {
    try {
      const response = await toAsk(ASSISTANT_ID, ctx.body, state);

      await handleHistory({ content: response, role: "assistant" }, state);

      const chunks = response.split(/(?<!\d)\.\s+/g);

      for (const chunk of chunks) {
        await flowDynamic([
          {
            body: chunk.trim().replace(/\s*\【\d+:\d+†[^】]*】/g, ""),
            delay: generateTimer(150, 250),
          },
        ]);
      }
    } catch (err) {
      console.log(`[ERROR]:`, err);
      return;
    }
  });

export { assistantFlow };
