from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Payment, MpesaTransaction
from .serializers import PaymentSerializer, MpesaTransactionSerializer
from .services import MpesaService
from .tasks import process_mpesa_callback

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'staff_profile'):
            return self.queryset.filter(order__branch=self.request.user.staff_profile.branch)
        return self.queryset.filter(order__customer=self.request.user)

    @action(detail=False, methods=['post'], url_path='stk-push')
    def stk_push(self, request):
        order_id = request.data.get('order_id')
        phone_number = request.data.get('phone_number')
        
        try:
            payment = Payment.objects.get(order_id=order_id, status='pending')
            # Format phone number for Mpesa
            if phone_number.startswith('0'):
                phone_number = '254' + phone_number[1:]
            elif phone_number.startswith('+'):
                phone_number = phone_number[1:]
            
            # Use real domain in production
            callback_url = "https://your-domain.com/api/payments/callback/"
            
            service = MpesaService()
            response = service.stk_push(phone_number, payment.amount, callback_url, order_id)
            
            if response.get('ResponseCode') == '0':
                MpesaTransaction.objects.create(
                    payment=payment,
                    checkout_request_id=response.get('CheckoutRequestID'),
                    merchant_request_id=response.get('MerchantRequestID'),
                    phone_number=phone_number
                )
                return Response(response, status=status.HTTP_200_OK)
            else:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
                
        except Payment.DoesNotExist:
            return Response({"error": "Pending payment for this order not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='callback', permission_classes=[AllowAny])
    def mpesa_callback(self, request):
        # Trigger async processing
        process_mpesa_callback.delay(request.data)
        return Response({"ResultCode": 0, "ResultDesc": "Success"}, status=status.HTTP_200_OK)

class MpesaTransactionViewSet(viewsets.ModelViewSet):
    queryset = MpesaTransaction.objects.all()
    serializer_class = MpesaTransactionSerializer
    permission_classes = [IsAuthenticated]

