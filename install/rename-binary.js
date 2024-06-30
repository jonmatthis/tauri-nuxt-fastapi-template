import { execa } from 'execa';
import * as fs from 'fs';
import os from 'os';
import path from 'path';

async function main() {
    console.log(`Renaming Python executable to match Tauri/Rust 'sidecar' requirements...`);
    const baseName = '../dist/main';
    const rustInfo = (await execa('rustc', ['-vV'])).stdout;
    const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
    if (!targetTriple) {
        console.error('Failed to determine platform target triple');
    } else {
        console.log(`Target triple: ${targetTriple} (tbh, i don't know what this means, but it has to do with the build system...)`);
    }

    let extension = '';
    if (os.platform() === 'win32') {  // Use os.platform() to determine the platform
        extension = '.exe';
    }

    const oldPath = path.resolve(`${baseName}${extension}`);
    const newPath = path.resolve(`${baseName}-${targetTriple}${extension}`);

    if (!fs.existsSync(oldPath)) {
        console.error(`File not found: ${oldPath}`);
        return;
    }

    fs.renameSync(oldPath, newPath);
    console.log(`Renamed binary to ${newPath}`);
}

main().catch((e) => {
    throw e;
});
