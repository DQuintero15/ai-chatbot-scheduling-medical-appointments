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
import { MessageBrokerService } from "./services/message-broker";

const PORT = process.env.PORT ?? 3001;
const ai = new AIClass(OPENAI_API_KEY, "gpt-4o-mini");
const patientService = new PatientsService(axiosInstance);
const medicalService = new MedicalService(axiosInstance);
const messageBrokerService = new MessageBrokerService();

const main = async () => {
  const { httpServer } = await createBot(
    {
      database: new MemoryDB(),
      provider,
      flow,
    },
    { extensions: { ai, patientService, medicalService, messageBrokerService } }
  );

  httpInject(provider.server);
  httpServer(+PORT);
};

main();
