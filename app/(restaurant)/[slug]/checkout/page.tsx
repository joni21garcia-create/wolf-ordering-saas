import CheckoutForm from "@/components/restaurant/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main
      className="wolf-order-background"
      style={{
        minHeight: "100vh",
        padding: "120px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <CheckoutForm />
      </div>
    </main>
  );
}