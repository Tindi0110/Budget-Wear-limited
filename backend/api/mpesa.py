import requests
import base64
from django.conf import settings
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def get_mpesa_access_token():
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    api_url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    
    # In sandbox useful to use different URL if needed, but here we stick to what's likely production or configured
    if settings.DEBUG:
        api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    try:
        res = requests.get(api_url, auth=(consumer_key, consumer_secret))
        res.raise_for_status()
        return res.json()['access_token']
    except Exception as e:
        logger.error(f"Failed to get M-Pesa token: {str(e)}")
        return None

def initiate_stk_push(phone_number, amount, order_id):
    access_token = get_mpesa_access_token()
    if not access_token:
        return False
    
    if phone_number.startswith('0'):
        phone_number = '254' + phone_number[1:]
    elif phone_number.startswith('+'):
        phone_number = phone_number[1:]
    
    passkey = settings.MPESA_PASSKEY
    business_short_code = settings.MPESA_SHORTCODE
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(f"{business_short_code}{passkey}{timestamp}".encode()).decode()
    
    api_url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    if settings.DEBUG:
        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    headers = {"Authorization": f"Bearer {access_token}"}
    
    payload = {
        "BusinessShortCode": business_short_code,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": business_short_code,
        "PhoneNumber": phone_number,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": f"Order-{order_id}",
        "TransactionDesc": f"Payment for Order {order_id}"
    }

    try:
        res = requests.post(api_url, json=payload, headers=headers)
        res.raise_for_status()
        logger.info(f"M-Pesa STK Push initiated for {phone_number}: {res.json()}")
        return True
    except Exception as e:
        logger.error(f"M-Pesa STK Push failed: {str(e)}")
        return False
