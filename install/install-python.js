import { execa } from 'execa';
import * as fs from 'fs';
import os from 'os';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let extension = '';
if (os.platform() === 'win32') {
    extension = '.exe';
}

async function main() {
    const scriptName = process.platform === 'win32' ? 'install-python.bat' : 'install-python.sh';
    const scriptPath = path.join(__dirname, scriptName);
    const pythonMainFileFullPath = path.join(__dirname, '../src-python/main.py')
    console.log(`Preparing to run script: ${scriptPath}...`);

    console.log('Load Tauri config...')
    const data = fs.readFileSync('../src-tauri/tauri.conf.json', 'utf8')
    const tauriConfig = JSON.parse(data);
    const baseName = tauriConfig.tauri.allowlist.shell.scope[0].name

    const originalBinaryPath = await path.resolve(`${baseName}${extension}`)

    if (!fs.existsSync(originalBinaryPath)) {
        console.error(`Original binary not found at:${originalBinaryPath}`);
        return;
    }


    if (!fs.existsSync(scriptPath)) {
        console.error(`Script not found:${scriptPath}`);
        return;
    }

    if (!fs.existsSync(pythonMainFileFullPath)) {
        console.error(`Python main file not found: ${pythonMainFileFullPath}`);
        return;
    }

    const rustInfo = (await execa('rustc', ['-vV'])).stdout;
    const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
    if (!targetTriple) {
        console.error('Failed to determine platform target triple');
    } else {
        console.log(`Target triple (architecture, vender, operating system): ${targetTriple}`);
    }
    const binaryNameWithTargetTripleSuffix =`${baseName}-${targetTriple}${extension}`

    if (os.platform !== 'win32') {
        console.log('Setting script permissions to be executable...');
        await fs.promises.chmod(scriptPath, 0o755);
    }

    try {
        console.log(`Running the install script with args: \nbinaryPath: ${binaryNameWithTargetTripleSuffix}, \npythonMainFilePath: ${pythonMainFileFullPath}\n==================`);

        await execa(scriptPath, [binaryNameWithTargetTripleSuffix, pythonMainFileFullPath],{ stdio: 'inherit' });

        console.log(`=======================\n Script completed`)
    } catch (error) {
        console.error(`Failed to execute ${scriptName}:`, error);
        // Propagate the error to ensure the calling context is aware of the failure
        throw error;
    }
    console.log(`------------------------------------\nScript ${scriptName} execution complete - Check logs above for potential errors`);
}

main().catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);  // Ensure the process exits with an error status
});
