import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

let envLoaded = false;
const envFilePath = process.env['NODE_ENV']
  ? path.resolve(__dirname, '../../', `.env.${process.env['NODE_ENV']}`)
  : path.resolve(__dirname, '../../', '.env');

if (fs.existsSync(envFilePath)) {
  envLoaded = true;
  dotenv.config({ path: envFilePath });
}

export { envLoaded, envFilePath };
