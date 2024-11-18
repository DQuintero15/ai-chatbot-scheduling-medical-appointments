import { createFlow } from "@builderbot/bot";

import { welcomeFlow } from "./welcome.flow";
import { assistantFlow } from "./assistant.flow";
import { dataTermsFlow } from "./data-terms.flow";
import { scheduleFlow } from "./schedule.flow";
import { idleFlow } from "src/utils/idle";
import { promptInjectionFlow } from "./prompt-injection.flow";
import { endFlow } from "./end.flow";
import { generalMedicineAppointment } from "./general-medicine-appointment.flow";
import { appointmentsSummaryFlow } from "./appointments-summary.flow";

export default createFlow([
  welcomeFlow,
  assistantFlow,
  dataTermsFlow,
  scheduleFlow,
  promptInjectionFlow,
  endFlow,
  generalMedicineAppointment,
  appointmentsSummaryFlow,
  idleFlow,
]);
