import html

from django.conf import settings


def notify_new_lead(lead_pk: int) -> None:
    """
    Send Telegram + email notification for new lead.
    Called as Celery task when available; also works as plain function.
    """
    from .models import Lead
    try:
        lead = Lead.objects.get(pk=lead_pk)
    except Lead.DoesNotExist:
        return

    def esc(value) -> str:
        # HTML-escape user-supplied content so it can't break Telegram's
        # HTML parse_mode (or inject markup) — name/company/message are public input.
        return html.escape(str(value)) if value else "—"

    company = f" ({esc(lead.company)})" if lead.company else ""
    message = (
        f"📬 <b>Yangi murojaat!</b>\n"
        f"👤 {esc(lead.name)}{company}\n"
        f"📞 {esc(lead.phone)}\n"
        f"✉️ {esc(lead.email)}\n"
        f"📝 {esc(lead.message)}\n"
        f"🔗 Sahifa: {esc(lead.source_page)}"
    )

    _send_telegram(message)


def _send_telegram(text: str) -> None:
    token = getattr(settings, "TELEGRAM_BOT_TOKEN", "")
    chat_id = getattr(settings, "TELEGRAM_CHAT_ID", "")
    if not token or not chat_id:
        return
    try:
        import urllib.request, urllib.parse
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        data = urllib.parse.urlencode({
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
        }).encode()
        urllib.request.urlopen(url, data, timeout=5)
    except Exception:
        pass


# Wrap as Celery task only if Celery is available
try:
    from celery import shared_task
    notify_new_lead = shared_task(notify_new_lead)
except ImportError:
    pass
