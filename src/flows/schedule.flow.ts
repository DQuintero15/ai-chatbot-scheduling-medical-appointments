import { addKeyword, EVENTS } from "@builderbot/bot";
import { generateTimer } from "../utils/generateTimer";
import { PatientsService } from "src/services/patients";
import { typing } from "src/utils/presence";
import { provider } from "src/provider";
import AIClass from "src/services/ai";
import { Patient } from "src/typings/patients";
import { GREETINGS_PROMPT } from "src/prompts/schedule.prompt";
import { MedicalService } from "src/services/medical-services";
import { Service } from "src/typings/medical-services";

const scheduleFlow = addKeyword(EVENTS.ACTION).addAnswer(
  `Por favor, ingrese su número de identificación sin puntos ni comas.`,
  { capture: true },
  async (ctx, { state, extensions, flowDynamic, endFlow }) => {
    const patientService = extensions.patientService as PatientsService;
    const medicalService = extensions.medicalService as MedicalService;
    const ai = extensions.ai as AIClass;

    const { body } = ctx;

    const cleanBody = body.replace(/[^0-9]/g, "");

    if (!cleanBody) {
      await typing(ctx, provider);
      await flowDynamic(
        ["Lo siento, el número de identificación no puede estar vacío. 😔"],
        { delay: generateTimer(150, 250) }
      );
      return endFlow();
    }

    try {
      const patient = await patientService.getPatientByDocument(cleanBody);

      if (!patient) {
        await typing(ctx, provider);
        await flowDynamic(
          [
            `Lo siento, no encontré un paciente con el número de identificación ${cleanBody}. 😔`,
            `Por favor, intente nuevamente.`,
          ],
          { delay: generateTimer(150, 250) }
        );
        return endFlow();
      }

      await typing(ctx, provider);

      const services = await medicalService.getServices();

      const greetingsPrompt = generateGreetings(
        patient,
        services._embedded.services
      );

      const message = await ai.greetUserFn([
        {
          role: "system",
          content: greetingsPrompt,
        },
      ]);

      const chunks = message.greeting.split(/(?<!\d)\.\s+/g);

      for (const chunk of chunks) {
        await flowDynamic([
          { body: chunk.trim(), delay: generateTimer(150, 250) },
        ]);
      }
    } catch (error) {
      console.error(error);
      await typing(ctx, provider);
      await flowDynamic(
        [
          `Lo siento, ocurrió un error al buscar el paciente con el número de identificación ${cleanBody}. 😔`,
          `Por favor, intente nuevamente.`,
        ],
        { delay: generateTimer(150, 250) }
      );
      return endFlow();
    }
  }
);

export const generateGreetings = (patient: Patient, services: Service[]) => {
  return GREETINGS_PROMPT.replace("{USER}", JSON.stringify(patient)).replace(
    "{SERVICES}",
    JSON.stringify(services)
  );
};

export { scheduleFlow };
