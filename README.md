# Webex ACK Bot – clean starter
Steps:
1) Set repo secrets (Azure) and variables (WEBHOOK_URL).
2) Build image via GHCR workflow.
3) Deploy to Azure Web App (Container).
4) Set App Settings in Azure: BOT_TOKEN, WEBHOOK_URL.
5) Register Webex webhook (Action or npm script).
6) Test: /health and Webex room commands.
