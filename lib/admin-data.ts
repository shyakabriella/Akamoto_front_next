import { api } from "./api";
import { PricingRule, RiderProfile } from "./types";

export async function fetchRiders(params?: {
  status?: string;
  is_online?: boolean;
  search?: string;
}): Promise<RiderProfile[]> {
  return api.listRiders({ ...params, per_page: 50 });
}

export async function fetchRider(id: number): Promise<RiderProfile> {
  return api.getRider(id);
}

export async function fetchPricingRules(params?: {
  vehicle_type?: string;
  is_active?: boolean;
  search?: string;
}): Promise<PricingRule[]> {
  return api.listPricingRules({ ...params, per_page: 50 });
}

export async function fetchPricingRule(id: number): Promise<PricingRule> {
  return api.getPricingRule(id);
}
