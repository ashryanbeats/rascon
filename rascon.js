const { exec } = require("child_process");

// Get your IP address
exec("ipconfig getifaddr en0", (err, stdout, stderr) => {
  if (err) console.error(`ipconfig node error: ${err}`); return;
  if (stderr) console.error(`ipconfig std error: ${stderr}`); return;

  const ip = stdout.trim();
  const nmapCmd = `sudo nmap -sn ${ip}/24`;

  // Use your IP address to scan all connected devices
  exec(nmapCmd, (err, stdout, stderr) => {
    if (err) console.error(`nmap node error: ${err}`); return;
    if (stderr) console.error(`nmap std error: ${stderr}`); return;

    const raspiIp = getRaspiIp(stdout);

    // Copy the ssh command to the clipboard and exit
    exec(`echo "ssh pi@${raspiIp}" | pbcopy`);
  });
});

function getRaspiIp(stdout) {
  // Match for an IP address followed by "Raspberry" 2 lines below
  const match = stdout.match(/([\d.]+)\n.+\n.+Raspberry/);

  // Exit if not found
  if (!match || !match[1]) {
    console.log("Raspberry Pi not found on network. Please try again.");
    process.exit();
  }

  // Return the regex capture group containing the raspi IP address
  return match[1];
}
