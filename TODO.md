# Things I want to look into
- Rate Limiting (IP-based, Router-based?)
    - Performed via Cloudflare, express-rate-limitng, fail2bain, or nginx?
- Check if firewall really allows only connections from 443 and 80, and 22

- Automatic deplyoment with autonpm or smthng? PM2
- Hostname-based routing on VPS using reverse-proxy or just with node?

- For now: Hold both repos on the VPS and built them there after synchronization. Later, build the server with github actions and then just push the artefacts.


- CI/CD pipeline of Github actions:
    - CI:
        - Check code quality: Linting, Formatting
        - Run an LLM agent to check the code and create comments? Maybe only on PR to main?
        - Build project
        - Run security scans?
    - CD:
        - Deploy to production when merging to main
        - Deploy to staging when pushing on dev branch
        - Create releases and artifacts?
