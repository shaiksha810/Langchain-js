import fs from "fs/promises";
import { configDir } from "./constant.js";
import path from "path";
import axios from "axios";

export async function getSettingsFile() {
  try {
    await fs.access(configDir);
  } catch (error) {
    await fs.mkdir(configDir, { recursive: true });
  }

  const settingsFilePath = path.join(configDir, "settings.json");

  try {
    await fs.access(settingsFilePath);
    const content = await fs.readFile(settingsFilePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    await fs.writeFile(settingsFilePath, JSON.stringify({}));
    return {};
  }
}

export async function saveApiKey(apiKey) {
  const settingsFilePath = path.join(configDir, "settings.json");
  const settingsContent = await getSettingsFile();
  await fs.writeFile(
    settingsFilePath,
    JSON.stringify({
      ...settingsContent,
      apiKey,
    }),
  );
}

export async function getApiKey() {
  const settings = await getSettingsFile();

  const apiKey = settings.apiKey || null;

  if (!apiKey) {
    return {
      error: "API key is not found",
    };
  }

  try {

    await axios.get("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return {
      "apiKey":apiKey,
      "status":"apikey is valid"
    }

  } catch (error) {
    return {
      error:"Invalid or expired API key",
       status: error.response?.status,
    };
  }
}
