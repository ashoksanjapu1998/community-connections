import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const NEEDS = process.env.NEEDS_TABLE;

export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return respond(400, { error: "id required" });

    const b = JSON.parse(event.body || "{}");
    const { helperPhone = "", helperName = "" } = b;

    // ensure need exists and still open
    const cur = await ddb.send(new GetCommand({ TableName: NEEDS, Key: { id } }));
    if (!cur.Item) return respond(404, { error: "not found" });
    if (cur.Item.status !== "open") return respond(409, { error: "already accepted" });

    await ddb.send(new UpdateCommand({
      TableName: NEEDS,
      Key: { id },
      UpdateExpression: "SET #s = :s, acceptedBy = :p, acceptedByName = :n, acceptedAt = :t",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":s": "accepted", ":p": helperPhone, ":n": helperName, ":t": Date.now()
      }
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
