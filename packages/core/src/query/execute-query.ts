import type { QueryParams } from "../client/types";
import type { Transport } from "../transport/types";

export function executeQuery<TData>({
  transport,
  resource,
  params,
}: {
  transport: Transport;
  resource: string;
  params?: QueryParams;
}): Promise<TData> {
  return transport.request<TData>({
    resource,
    params,
  });
}
