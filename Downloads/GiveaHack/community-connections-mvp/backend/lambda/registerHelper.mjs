import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const HELPERS = process.env.HELPERS_TABLE;

export const handler = async (event) => {
  try {
    const b = JSON.parse(event.body || "{}");
    const { phone, name = "", skills = [], zipcode = "", radiusMi = 15 } = b;
    if (!phone) return respond(400, { error: "phone required" });

    await ddb.send(new PutCommand({
      TableName: HELPERS,
      Item: { phone, name, skills, zipcode, radiusMi, createdAt: Date.now() }
    }));
    return respond(200, { ok: true });
  } catch (e) {
    console.error(e);
    return respond(500, { error: "internal error" });
  }
};

const respond = (code, body) => ({
  statusCode: code,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify(body)
});
