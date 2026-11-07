import { initGraph } from "./graph/graph.js";
import { getSettingsFile, saveApiKey, getApiKey } from "./utils/file.utils.js";
import { rl } from "./utils/readline.js";

async function main() {
  const settings = await getSettingsFile();

  if (!settings.apiKey) {
    const apiKey = await rl.question("Please Enter Your API Key: ");
    await saveApiKey(apiKey);
  }

  const response = await getApiKey();

  if (response.error) {
    console.log(response.error);
  }

  const apiKey = response.apiKey;

  await initGraph();

  rl.close();
}

export default main;
