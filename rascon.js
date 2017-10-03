const { exec } = require("child_process");

exec("ipconfig getifaddr en0", (err, stdout, stderr) => {
  if (err) console.error(`ipconfig node error: ${err}`); return;
  if (stderr) console.error(`ipconfig std error: ${stderr}`); return;

  const ip = stdout.trim();
  const nmapCmd = `sudo nmap -sn ${ip}/24`;

  exec(nmapCmd, (err, stdout, stderr) => {
    if (err) console.error(`nmap node error: ${err}`); return;
    if (stderr) console.error(`nmap std error: ${stderr}`); return;

    const res = stdout.match(/([\d.]+)\n.+\n.+Raspberry/);
    if (!res || !res[1]) console.log("Raspberry Pi not found on network. Please try again."); return;

    exec(`echo "ssh pi@${res[1]}" | pbcopy`);
  });
});
