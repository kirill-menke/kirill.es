- Instruct AI to make code suggestions in a review which I can accept
    - I think AI has to actively start a code review on the code then IF it has suggestions. Currently it just looks a the code and posts a comment.

- Rate Limiting (IP-based, Router-based?)
    - Performed via Cloudflare, express-rate-limitng, fail2bain, or nginx?
- Check if firewall really allows only connections from 443 and 80, and 22

- For now: Hold both repos on the VPS and built them there after synchronization. Later, build the server with github actions and then just push the artefacts.
- Later: push artifacts + packages.json from CI build and install npm packages on server

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

- Karteikartenapp
