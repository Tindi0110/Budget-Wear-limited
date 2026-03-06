from celery import shared_task
from .models import Payment, MpesaTransaction
from orders.models import Order
import logging

logger = logging.getLogger(__name__)

@shared_task
def process_mpesa_callback(data):
    body = data.get('Body', {})
    stk_callback = body.get('stkCallback', {})
    result_code = stk_callback.get('ResultCode')
    result_desc = stk_callback.get('ResultDesc')
    checkout_request_id = stk_callback.get('CheckoutRequestID')
    
    try:
        transaction = MpesaTransaction.objects.get(checkout_request_id=checkout_request_id)
        transaction.result_code = result_code
        transaction.result_desc = result_desc
        
        payment = transaction.payment
        
        if result_code == 0:
            # Success
            callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
            for item in callback_metadata:
                if item.get('Name') == 'MpesaReceiptNumber':
                    transaction.receipt_number = item.get('Value')
            
            payment.status = 'success'
            order = payment.order
            order.status = 'paid'
            order.save()
        else:
            # Failed
            payment.status = 'failed'
            order = payment.order
            order.status = 'cancelled' # Or keep as pending/failed
            order.save()
            
        payment.save()
        transaction.save()
        
    except MpesaTransaction.DoesNotExist:
        logger.error(f"Transaction with CheckoutRequestID {checkout_request_id} not found.")
