import { exec } from "child_process"

exec('docker-compose up -d', (error, stdout, stderr) => {
    if (error) {
        console.error(` Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`✅ Docker started:\n${stdout}`);
});
