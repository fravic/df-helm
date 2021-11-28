import * as redis from "redis";

import { SUBSCRIBED_ETH_ADDRS_KEY } from "../../common/constants";

export async function createClient() {
  const client = redis.createClient({ url: process.env.REDIS_URL });
  client.on("error", (err: any) => console.log("Redis Client Error", err));
  await client.connect();
  return client;
}

export async function addSubscribedEthAddr(
  ethAddr: string,
  iftttApiKey: string
) {
  const client = await createClient();
  const currentAddrs = JSON.parse(
    (await client.get(SUBSCRIBED_ETH_ADDRS_KEY)) || "{}"
  );
  const updatedAddrs = JSON.stringify({
    ...currentAddrs,
    [ethAddr]: iftttApiKey,
  });
  await client.set(SUBSCRIBED_ETH_ADDRS_KEY, updatedAddrs);
}