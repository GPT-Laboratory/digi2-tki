import { InfluxDB } from '@influxdata/influxdb-client';

const token = process.env.INFLUXDB_TOKEN as string;
const url = process.env.INFLUXDB_URL as string;
const org = process.env.INFLUXDB_ORG as string;
const bucket = process.env.INFLUXDB_BUCKET as string;

const client = new InfluxDB({ url, token });

export const HOST = "digi2client";
export const MEASUREMENT = "mapformer";
export function queryApi(){ return client.getQueryApi(org)};
export function writeApi(){ return client.getWriteApi(org, bucket)};
export { Point } from '@influxdata/influxdb-client';
