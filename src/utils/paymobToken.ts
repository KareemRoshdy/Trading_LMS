import axios from "axios";

export const firstStep = async (amount: number) => {
  try {
    const data = {
      api_key: process.env.PAYMOB_API_KEY,
    };

    const response = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      data
    );

    const token = response.data.token;

    const result = secondStep(token, amount);
    return result;
  } catch (error: any) {
    console.log("[FIRST]: Something went wrong!");
    console.error(error.response?.data || error.message);
  }
};

export const secondStep = async (token: string, amount: number) => {
  try {
    const data = {
      auth_token: token,
      delivery_needed: "false",
      amount_cents: `${amount * 100}`,
      currency: "EGP",
      items: [],
    };

    const response = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      data
    );

    const result = response.data;

    const id = result?.data?.id;
    const Token = thirdStep(token, id, amount);
    return Token;
  } catch (error: any) {
    console.log("[SECOND]: Something went wrong!");
    console.error(error.response?.data || error.message);
  }
};

export const thirdStep = async (token: string, id: number, amount: number) => {
  try {
    const data = {
      auth_token: token,
      amount_cents: `${amount * 100}`,
      expiration: 3600,
      order_id: id,
      billing_data: {
        apartment: "803",
        email: "claudette09@exa.com",
        floor: "42",
        first_name: "Clifford",
        street: "Ethan Land",
        building: "8028",
        phone_number: "+86(8)9135210487",
        shipping_method: "PKG",
        postal_code: "01898",
        city: "Jaskolskiburgh",
        country: "CR",
        last_name: "Nicolas",
        state: "Utah",
      },
      currency: "EGP",
      integration_id: process.env.PAYMOB_INTEGRATION_ID,
    };

    const response = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      data
    );

    const result = response.data.token;

    return result;
  } catch (error: any) {
    console.log("[THIRD]: Something went wrong!");
    console.error(error.response?.data || error.message);
  }
};
