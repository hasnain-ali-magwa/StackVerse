import requests
import os


def send_to_discord(name, email, subject, message):
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")

    if not webhook_url:
        print("Webhook URL missing")
        return False

    payload = {
        "embeds": [
            {
                "title": "📩 New StackVerse Message",
                "color": 5814783,
                "fields": [
                    {
                        "name": "Name",
                        "value": name,
                        "inline": False
                    },
                    {
                        "name": "Email",
                        "value": email,
                        "inline": False
                    },
                    {
                        "name": "Subject",
                        "value": subject,
                        "inline": False
                    },
                    {
                        "name": "Message",
                        "value": message,
                        "inline": False
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(
            webhook_url,
            json=payload
        )

        print("Discord Status Code:", response.status_code)
        print("Discord Response:", response.text)

        return response.status_code == 204

    except Exception as e:
        print("Webhook Error:", e)
        return False