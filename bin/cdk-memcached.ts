#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkMemcachedStack } from '../lib/cdk-memcached-stack';

const app = new cdk.App();
new CdkMemcachedStack(app, 'kxt29-memcached', {
  env: {
    account: '244282049925',
    region: 'us-east-2'
  }
});