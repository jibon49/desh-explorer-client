import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckOutForm from "./CheckOutForm";
import Banner from "../Home/Banner/Banner";
import bgImg from "../../assets/tourbg.jpg";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const CheckOut = () => {
  return (
    <>
      <Banner
        bgImage={bgImg}
        heading="Payment"
        text="Please complete your payment to confirm your booking."
      />
      <div className="mt-20 max-w-2xl mx-auto">
            <Elements stripe={stripePromise}>
                <CheckOutForm></CheckOutForm>
            </Elements>
        </div>
    </>
  );
};

export default CheckOut;
