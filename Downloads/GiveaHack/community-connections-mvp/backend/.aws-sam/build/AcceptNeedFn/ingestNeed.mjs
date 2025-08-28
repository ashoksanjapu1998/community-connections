import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import crypto from "crypto";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sns = new SNSClient({});
const NEEDS = process.env.NEEDS_TABLE;
// const HELPERS = process.env.HELPERS_TABLE; // for later
const SNS_SENDER_ID = process.env.SNS_SENDER_ID || "CommConnect";

function lightNlp(text) {
  const lower = (text || "").toLowerCase();
  const needType = /ride|transport|uber|chemo/.test(lower) ? "transportation"
                : /food|meal|grocer/.test(lower) ? "food"
                : /house|rent|shelter/.test(lower) ? "housing" : "other";
  const timeISO = "";
  const urgency = /urgent|asap|emergen/.test(lower) ? "high" : "normal";
  const context = /chemo|doctor|clinic|medical/.test(lower) ? "medical" : "general";
  return { needType, timeISO, urgency, context };
}

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { text, seekerPhone = "", zipcode = "" } = body;
    if (!text) return respond(400, { error: "text required" });

    const id = "req_" + crypto.randomUUID();
    const meta = lightNlp(text);

    await ddb.send(new PutCommand({
      TableName: NEEDS,
      Item: {
        id, text, seekerPhone, zipcode,
        needType: meta.needType,
        timeISO: meta.timeISO,
        urgency: meta.urgency,
        context: meta.context,
        status: "open",
        createdAt: Date.now()
      }
    }));

    // Optional: notify a hardcoded helper later with SNS
    // await sns.send(new PublishCommand({
    //   PhoneNumber: "+1XXXXXXXXXX",
    //   Message: `New request ${id}: "${text}"`,
    //   MessageAttributes: {
    //     "AWS.SNS.SMS.SenderID": { DataType: "String", StringValue: SNS_SENDER_ID }
    //   }
    // }));

    return respond(200, { id });
  } catch (err) {
    console.error(err);
    return respond(500, { error: "internal error" });
  }
};

function respond(code, body) {
  return {
    statusCode: code,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
