import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const ddb = new DynamoDBClient({});
const NEEDS = process.env.NEEDS_TABLE;

export const handler = async () => {
  try {
    const out = await ddb.send(new ScanCommand({ TableName: NEEDS, Limit: 50 }));
    const items = (out.Items || []).map(x => ({
      id: x.id.S,
      text: x.text.S,
      zipcode: x.zipcode?.S || "",
      needType: x.needType?.S || "other",
      status: x.status.S,
      createdAt: Number(x.createdAt.N || "0"),
    }));
    return respond(200, items.sort((a, b) => b.createdAt - a.createdAt));
  } catch (e) {
    console.error(e);
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
