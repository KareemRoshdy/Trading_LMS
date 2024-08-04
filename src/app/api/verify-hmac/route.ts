import { calculateHmac } from "@/utils/calculateHmac";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { data, hmac: receivedHmac } = await req.json();

  const amount_cents = data.amount_cents;
  const created_at = data.created_at;
  const currency = data.currency;
  const error_occured = data.error_occured;
  const has_parent_transaction = data.has_parent_transaction;
  const obj_id = data.transaction_id;
  const integration_id = data.integration_id;
  const is_3d_secure = data.is_3d_secure;
  const is_auth = data.is_auth;
  const is_capture = data.is_capture;
  const is_refunded = data.is_refunded;
  const is_standalone_payment = data.is_standalone_payment;
  const is_voided = data.is_voided;
  const order_id = data.order;
  const owner = data.owner;
  const pending = data.pending;
  const source_data_pan = data.source_data_pan;
  const source_data_sub_type = data.source_data_sub_type;
  const source_data_type = data.source_data_type;
  const success = data.success;

  const req_string =
    amount_cents +
    created_at +
    currency +
    error_occured +
    has_parent_transaction +
    obj_id +
    integration_id +
    is_3d_secure +
    is_auth +
    is_capture +
    is_refunded +
    is_standalone_payment +
    is_voided +
    order_id +
    owner +
    pending +
    source_data_pan +
    source_data_sub_type +
    source_data_type +
    success;

  const secret = process.env.HMAC_SECRET!;
  const calculatedHmac = calculateHmac(secret, req_string);

  const isValid = calculatedHmac === receivedHmac;

  return NextResponse.json({ valid: isValid });
}
