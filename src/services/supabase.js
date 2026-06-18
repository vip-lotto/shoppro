import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://eplvhlcltkjbrhibaskv.supabase.co";
  console.log(
  "SUPABASE URL",
  supabaseUrl
);

const supabaseKey =
  "sb_publishable_KfePq0prnmJ_QAu2vfdzLQ_1QP2SueK";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);