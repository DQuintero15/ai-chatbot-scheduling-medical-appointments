import { addKeyword, EVENTS } from "@builderbot/bot";
import { APPOINTMENTS_SUMMARY_PROMPT } from "src/prompts/appointments.prompt";
import { provider } from "src/provider";
import AIClass from "src/services/ai";
import { AppointmentService } from "src/services/appointments";
import { generateTimer } from "src/utils/generateTimer";
import { typing } from "src/utils/presence";

const appointmentsSummaryFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { extensions, flowDynamic, endFlow }) => {
    const appointmentService =
      extensions.appointmentService as AppointmentService;
    const ai = extensions.ai as AIClass;

    const appointments = await appointmentService.getUserAppointments(
      ctx.from.replace("57", "")
    );

    const appointmentsSummaryPrompts =
      buildAppointmentsSummaryPrompts(appointments);

    const response = await ai.createChat(
      [
        {
          role: "system",
          content: appointmentsSummaryPrompts,
        },
      ],
      "gpt-4o-mini",
      0,
      320
    );

    const chunks = response.split(/(?<!\d)\.\s+/g);

    for (const chunk of chunks) {
      await typing(ctx, provider);
      await flowDynamic([
        { body: chunk.trim(), delay: generateTimer(250, 350) },
      ]);
    }

    return endFlow();
  }
);

const buildAppointmentsSummaryPrompts = (userAppointments: Appointment[]) => {
  return APPOINTMENTS_SUMMARY_PROMPT.replace(
    "{APPOINTMENTS}",
    JSON.stringify(userAppointments)
  );
};

export { appointmentsSummaryFlow };
