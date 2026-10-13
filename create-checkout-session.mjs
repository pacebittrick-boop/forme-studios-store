// Netlify serverless function: creates a Stripe Checkout Session.
// Configure STRIPE_SECRET_KEY in Netlify environment variables before accepting real payments.
const CATALOG = {
  "essential-tee": { name: "Essential Boxy Tee", amount: 3800, sizes: ["XS","S","M","L","XL"] },
  "studio-hoodie": { name: "Studio Heavyweight Hoodie", amount: 8800, sizes: ["S","M","L","XL"] },
  "relaxed-crew": { name: "Relaxed Crewneck", amount: 7400, sizes: ["S","M","L","XL"] },
  "daily-long-sleeve": { name: "Daily Long Sleeve", amount: 4800, sizes: ["XS","S","M","L","XL"] },
  "utility-tote": { name: "Everyday Utility Tote", amount: 3200, sizes: ["ONE SIZE"] },
  "structured-cap": { name: "Structured Studio Cap", amount: 3000, sizes: ["ONE SIZE"] }
};
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Content-Type": "application/json" };
export default async (request) => {
  if (request.method === "OPTIONS") return new Response("", { status: 204, headers: cors });
  if (request.method !== "POST") return new Response(JSON.stringify({error:"Method not allowed"}), {status:405,headers:cors});
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return new Response(JSON.stringify({error:"Stripe is not connected yet. Add STRIPE_SECRET_KEY in Netlify to enable checkout."}), {status:503,headers:cors});
  try {
    const body = await request.json();
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30) throw new Error("Your bag is empty or invalid.");
    const lineItems = [];
    for (const item of body.items) {
      const product = CATALOG[item.id];
      const quantity = Number(item.quantity);
      if (!product || !product.sizes.includes(item.size) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error("One of the items in your bag is invalid. Please refresh and try again.");
      lineItems.push({
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.amount,
          product_data: { name: product.name, description: `FORMÉ STUDIOS · Size: ${item.size}`, metadata: { product_id: item.id, size: item.size } }
        }
      });
    }
    const origin = new URL(request.url).origin;
    const form = new URLSearchParams();
    lineItems.forEach((item, i) => {
      form.set(`line_items[${i}][quantity]`, String(item.quantity));
      form.set(`line_items[${i}][price_data][currency]`, item.price_data.currency);
      form.set(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount));
      form.set(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name);
      form.set(`line_items[${i}][price_data][product_data][description]`, item.price_data.product_data.description);
      form.set(`line_items[${i}][price_data][product_data][metadata][product_id]`, item.price_data.product_data.metadata.product_id);
      form.set(`line_items[${i}][price_data][product_data][metadata][size]`, item.price_data.product_data.metadata.size);
    });
    form.set("mode","payment");
    form.set("success_url",`${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`);
    form.set("cancel_url",`${origin}/?checkout=cancelled`);
    form.set("billing_address_collection","required");
    form.set("shipping_address_collection[allowed_countries][0]","US");
    form.set("phone_number_collection[enabled]","true");
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method:"POST", headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/x-www-form-urlencoded"}, body:form
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "Stripe could not create checkout.");
    return new Response(JSON.stringify({url:result.url}), {status:200,headers:cors});
  } catch (error) {
    return new Response(JSON.stringify({error:error.message || "Unable to start checkout."}), {status:400,headers:cors});
  }
};
