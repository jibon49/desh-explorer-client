import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../Authproviders/AuthProviders";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const CheckOutForm = () => {

    const [error, setError] = useState([])
    const stripe = useStripe();
    const {user} = useContext(AuthContext)
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const totalPrice = '149'
    const [clientSecret, setClientSecret] = useState('')
    const [transactionId, setTransactionId] = useState('')



    useEffect(()=>{
        axiosSecure.post('/create-payment-intent', {price:totalPrice})
        .then(res=>{
            console.log(res.data.clientSecret);
            setClientSecret(res.data.clientSecret);
        })
    },[axiosSecure])

    
    const handleSubmit =async (event) =>{
        event.preventDefault();

        if(!stripe || !elements){
            return
        }
        const card = elements.getElement(CardElement)

        if(card === null){
            return
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })
        if(error){
            console.log('payment method', error)
            setError(error.message);
        }
        else{
            console.log('payment method', paymentMethod)
            setError('');
        }



        //payment confirmation

        const {paymentIntent, error : confirmError} = await stripe.confirmCardPayment(clientSecret,{
            payment_method : {
                card : card,
                billing_details : {
                    email : user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        })

        if(confirmError){
            console.log('confirm error', confirmError)
        }
        else{
            console.log('paymentIntent', paymentIntent)
            if(paymentIntent.status === 'succeeded'){
                console.log('transaction id', paymentIntent.id);
                setTransactionId(paymentIntent.id)

                axiosSecure.patch(`/payments/${user.email}`)
                .then(res=>{
                    console.log(res)
                    if(res.data.modifiedCount > 0){
                    Swal.fire({
                        title: "Good job!",
                        text: "You have earned gold badge!",
                        icon: "success"
                      });
                }
                })
                
            }
        }


    }

    return (
        <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
        <button className="btn btn-sm btn-primary mt-10" type="submit" disabled={!stripe || !clientSecret}>
          Pay
        </button>
        <p className="text-red-500">{error}</p>
        {transactionId && <p className="text-green-500">Your transaction id is {transactionId}</p>}
      </form>
    );
};

export default CheckOutForm;