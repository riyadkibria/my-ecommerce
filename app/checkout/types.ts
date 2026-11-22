export type Division = {
  id: number;
  name: string;
};


export type District = {
  id: number;
  name: string;
};


export type DeliveryArea = {
  id: number;
  name: string;
  redx_area_id: number;
  post_code: number;
};


export type CheckoutProps = {
  divisions: Division[];
};