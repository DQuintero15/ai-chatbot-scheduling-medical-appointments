import "dotenv/config";
import { createBot, MemoryDB } from "@builderbot/bot";
import AIClass from "./services/ai";
import flow from "./flows";
import { provider } from "./provider";
import { httpInject } from "@builderbot-plugins/openai-assistants";
import { OPENAI_API_KEY } from "./config";
import { PatientsService } from "./services/patients";
import axiosInstance from "./utils/axios";
import { MedicalService } from "./services/medical-services";
import { sendMessage } from "./utils/sendMessage";
import { recieveMessage } from "./utils/recieveMessage";
import { DATA_THERMS_QUEUE } from "./queues";

const PORT = process.env.PORT ?? 3001;
const ai = new AIClass(OPENAI_API_KEY, "gpt-4o-mini");
const patientService = new PatientsService(axiosInstance);
const medicalService = new MedicalService(axiosInstance);

const main = async () => {
  const { httpServer } = await createBot(
    {
      database: new MemoryDB(),
      provider,
      flow,
    },
    { extensions: { ai, patientService, medicalService } }
  );

  sendMessage(
    DATA_THERMS_QUEUE,
    JSON.stringify({ id: 2, dataThermsAccepted: true })
  );
  recieveMessage(DATA_THERMS_QUEUE);

  httpInject(provider.server);
  httpServer(+PORT);
};

main();
