import { addKeyword, EVENTS } from "@builderbot/bot";
import {
  GET_SCHEDULE_PROMPT,
  GET_SCHEDULE_TYPE_PROMPT,
} from "src/prompts/schedule.prompt";
import { APPOINTMENT_QUEUE } from "src/queues";
import AIClass from "src/services/ai";
import { MessageBrokerService } from "src/services/message-broker";
import { ScheduleService } from "src/services/schedules";
import { ServicesResponse } from "src/typings/medical-services";
import { generateTimer } from "src/utils/generateTimer";
import { assistantFlow } from "./assistant.flow";

const clinicalLabAppointmentFlow = addKeyword(EVENTS.ACTION)
  .addAction(
    async (ctx, { state, flowDynamic, gotoFlow, endFlow, extensions }) => {
      const scheduleService = extensions.scheduleService as ScheduleService;
      const ai = extensions.ai as AIClass;

      const schedules =
        await scheduleService.getSchedulesAvailablesBySpecialtyID(3);

      await state.update({
        SCHEDULES: schedules,
      });

      console.log(`[DEBUG] schedules`, schedules);

      if (!schedules.length) {
        flowDynamic([
          `Ups! Parece que no hay citas disponibles para medicina general. ¿Quieres intentar con otra especialidad?`,
        ]);
        return endFlow();
      }

      const prompt = generateGetSchedulesPrompt(schedules);

      const response = await ai.createChat([
        { role: "system", content: prompt },
      ]);

      const chunks = response.split(/(?<!\d)\.\s+/g);

      for (const chunk of chunks) {
        await flowDynamic([
          { body: chunk.trim(), delay: generateTimer(150, 250) },
        ]);
      }

      await flowDynamic("¿Me confirmas el horario de la cita?");
    }
  )
  .addAction(
    { capture: true },
    async (ctx, { state, flowDynamic, gotoFlow, endFlow, extensions }) => {
      const ai = extensions.ai as AIClass;
      const schedules = state.get<SchedulesResponse>("SCHEDULES");
      const messageBrokerService =
        extensions.messageBrokerService as MessageBrokerService;

      const { body } = ctx;

      const response = await ai.getScheduleInfoFromUserResponseFn([
        {
          role: "user",
          content: `Current response: ${body}\n Schedules ${JSON.stringify(
            schedules
          )}`,
        },
      ]);

      const { scheduleID, doctorID } = response;

      const scheduleData = schedules.filter(
        (schedule) => schedule.id === scheduleID
      )[0];

      console.log(`[DEBUG] scheduleData`, scheduleData);

      await flowDynamic(
        [
          `Detalles de tu cita médica`,
          `🧑‍⚕️ Doctor: ${scheduleData.doctor.firstName} ${scheduleData.doctor.lastName}\n📅 Horario: ${scheduleData.scheduleDate} ${scheduleData.startTime}\n`,
          "Recuerda que si no puedes asistir a tu cita, debes cancelarla con anticipación.",
          "Debes presentarte 15 minutos antes de la hora de tu cita, de lo contrario, esta será cancelada automáticamente.",
          "Si el examen de laboratorio requiere preparación especial (como ayuno o restricción de alimentos), te recomendamos seguir las indicaciones de tu médico. Esto garantizará la precisión de los resultados y evitará la necesidad de reagendar el examen.",
        ],
        { delay: generateTimer(150, 250) }
      );

      await messageBrokerService.sendMessage(
        APPOINTMENT_QUEUE,
        JSON.stringify({
          doctorId: doctorID,
          phoneNumber: ctx.from.replace("57", ""),
          serviceId: 3,
          scheduleId: scheduleID,
          appointmentTime: `${scheduleData.scheduleDate} ${scheduleData.startTime}`,
          status: true,
        })
      );

      return endFlow();
    }
  );

export const generateGetScheduleTypePrompt = (
  history: string,
  schedulesType: ServicesResponse
) => {
  return GET_SCHEDULE_TYPE_PROMPT.replace(
    "{SCHEDULES}",
    JSON.stringify(schedulesType._embedded.services)
  ).replace("{HISTORY}", JSON.stringify(history));
};

export const generateGetSchedulesPrompt = (schedules: SchedulesResponse) => {
  return GET_SCHEDULE_PROMPT.replace("{SCHEDULES}", JSON.stringify(schedules));
};

export { clinicalLabAppointmentFlow };
