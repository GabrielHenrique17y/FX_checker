import { getLiveMarkets } from "../action/LiveMarkets/get-live-markets";

export type LiveMarket = Awaited<ReturnType<typeof getLiveMarkets>>;
