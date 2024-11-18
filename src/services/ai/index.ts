import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { INTENTIONS } from "src/constants/intentions";

class AIClass {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, _model: string) {
    this.openai = new OpenAI({ apiKey, timeout: 15 * 1000 });
    if (!apiKey || apiKey.length === 0) {
      throw new Error("OPENAI_KEY is missing");
    }

    this.model = _model;
  }

  createChat = async (
    messages: ChatCompletionMessageParam[],
    model?: string,
    temperature = 0,
    max_tokens = 256
  ) => {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model ?? this.model,
        messages,
        temperature,
        max_tokens,
        top_p: 0,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.error(err);
      return "ERROR";
    }
  };

  determineChatFn = async (
    messages: ChatCompletionMessageParam[],
    model?: string,
    temperature = 0
  ): Promise<{ prediction: string }> => {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model ?? this.model,
        temperature: temperature,
        messages,
        functions: [
          {
            name: "fn_get_prediction_intent",
            description: "Predict the user intention for a given conversation",
            parameters: {
              type: "object",
              properties: {
                prediction: {
                  type: "string",
                  description: "The predicted user intention.",
                  items: {
                    type: "string",
                    enum: Object.values(INTENTIONS),
                  },
                },
              },
              required: ["prediction"],
            },
          },
        ],
        function_call: {
          name: "fn_get_prediction_intent",
        },
      });
      const response = JSON.parse(
        completion.choices[0].message.function_call.arguments
      );
      return response;
    } catch (err) {
      console.error(err);
      return {
        prediction: "",
      };
    }
  };

  userAcceptsDataTermsFn = async (
    messages: ChatCompletionMessageParam[],
    model?: string,
    temperature = 0
  ): Promise<{ dataTermsAccepted: boolean }> => {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model ?? this.model,
        temperature: temperature,
        messages,
        functions: [
          {
            name: "fn_get_data_terms_accepted",
            description: "Check if the user accepts the data terms",
            parameters: {
              type: "object",
              properties: {
                dataTermsAccepted: {
                  type: "boolean",
                  description: "The user acceptance of data terms",
                },
              },
              required: ["dataTermsAccepted"],
            },
          },
        ],
        function_call: {
          name: "fn_get_data_terms_accepted",
        },
      });
      const response = JSON.parse(
        completion.choices[0].message.function_call.arguments
      );
      return response;
    } catch (err) {
      console.error(err);
      return {
        dataTermsAccepted: false,
      };
    }
  };

  greetUserFn = async (
    messages: ChatCompletionMessageParam[],
    model?: string,
    temperature = 0
  ): Promise<{ greeting: string }> => {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model ?? this.model,
        temperature: temperature,
        messages,
        functions: [
          {
            name: "fn_get_greeting",
            description: "Get the greeting message",
            parameters: {
              type: "object",
              properties: {
                greeting: {
                  type: "string",
                  description: "The greeting message",
                },
              },
              required: ["greeting"],
            },
          },
        ],
        function_call: {
          name: "fn_get_greeting",
        },
      });
      const response = JSON.parse(
        completion.choices[0].message.function_call.arguments
      );
      return response;
    } catch (err) {
      console.error(err);
      return {
        greeting: "",
      };
    }
  };

  getScheduleInfoFromUserResponseFn = async (
    messages: ChatCompletionMessageParam[],
    model?: string,
    temperature = 0
  ): Promise<{ scheduleID: number; doctorID: number; startTime: string }> => {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model ?? this.model,
        temperature: temperature,
        messages,
        functions: [
          {
            name: "fn_get_schedule_info",
            description:
              "Get the schedule ID and doctor ID from the user response",
            parameters: {
              type: "object",
              properties: {
                scheduleID: {
                  type: "number",
                  description: "The schedule ID",
                },
                doctorID: {
                  type: "number",
                  description: "The doctor ID",
                },
                startDate: {
                  type: "string",
                  description: "The schedule startTime"
                },
              },
              required: ["scheduleID", "doctorID", "startTime"],
            },
          },
        ],
        function_call: {
          name: "fn_get_schedule_info",
        },
      });
      const response = JSON.parse(
        completion.choices[0].message.function_call.arguments
      );
      return response;
    } catch (err) {
      console.error(err);
      return {
        doctorID: -1,
        scheduleID: -1,
        startTime: "",
      };
    }
  };
}

export default AIClass;
