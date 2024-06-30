import { execa } from 'execa';
import * as fs from 'fs';
import os from 'os';
import * as path from 'path';
import {process} from "@tauri-apps/api";


let extension = '';
if (os.platform() === 'win32') {
    extension = '.exe';
}

async function main() {
    console.log(`Renaming Python executable to match Tauri/Rust 'sidecar' configuration...`);
    console.log('Current working directory:', process.cwd());
    const tauriConfig = JSON.parse(fs.readFileSync('../src-tauri/tauri.conf.json', 'utf8'));
    const baseName = tauriConfig.tauri.allowlist.shell.scope[0].name

    const originalBinaryFileName = await path.resolve(`${baseName}${extension}`)
    if (!fs.existsSync(originalBinaryPath)) {
        console.error(`File not found:${originalBinaryPath}`);
        return;
    }

    const rustInfo = (await execa('rustc', ['-vV'])).stdout;
    const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
    if (!targetTriple) {
        console.error('Failed to determine platform target triple');
    } else {
        console.log(`Target triple (architecture, vender, operating system): ${targetTriple}`);
    }
    const originalBinaryPath = await path.resolve(`${baseName}${extension}`)

    fs.renameSync(oldPath, newPath);
    console.log(`Renamed binary to ${newPath}`);
}

await main().catch((e) => {
    throw e;
});
