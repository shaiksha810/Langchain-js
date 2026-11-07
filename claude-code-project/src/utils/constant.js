import os from "os"
import path from "path"


export const homeDir = os.homedir() // /User/91888
export const configDir = path.join(homeDir, ".beta") // /User/91888/.beta