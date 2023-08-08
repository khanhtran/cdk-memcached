import * as cdk from 'aws-cdk-lib'
import { CfnOutput } from 'aws-cdk-lib'
import {
    Peer,
    Port,
    SecurityGroup,
    Subnet,
    Vpc,
} from 'aws-cdk-lib/aws-ec2'
import { CfnCacheCluster, CfnSubnetGroup } from 'aws-cdk-lib/aws-elasticache'

import { Construct } from 'constructs'
import path = require('path')

export class CdkMemcachedStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const vpc = Vpc.fromLookup(this, `vpc`, {
            vpcId: '<YOUR_VPC_ID>',
        })

        const subnets = [
            Subnet.fromSubnetAttributes(this, 'subnet-b', {
                subnetId: '<YOUR_SUBNET_ID>',
                availabilityZone: 'us-east-2b',
            }),
            Subnet.fromSubnetAttributes(this, 'subnet-c', {
                subnetId: 'YOUR_ANOTHER_SUBNET_ID',
                availabilityZone: 'us-east-2c',
            }),
        ]

        const cacheSecurityGroup = new SecurityGroup(this, 'cache-security-group', {
            vpc: vpc,
        })

        cacheSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.allTcp(), 'Accepts all incomming')

        const cacheSubnetGroup = new CfnSubnetGroup(this, 'cache-subnet-group', {
            description: 'Subnet group for cache',
            subnetIds: subnets.map((s) => s.subnetId),
            cacheSubnetGroupName: 'cache-subnet-group',
        })

        const memcachedCluster = new CfnCacheCluster(this, 'memcached-cluster', {
            engine: 'memcached',
            cacheNodeType: 'cache.t2.small',
            numCacheNodes: 1,
            clusterName: 'kxt29-memcached',
            vpcSecurityGroupIds: [cacheSecurityGroup.securityGroupId],
            cacheSubnetGroupName: cacheSubnetGroup.cacheSubnetGroupName,
        })
        memcachedCluster.addDependency(cacheSubnetGroup)

        new CfnOutput(this, 'endpoint', { value: memcachedCluster.attrConfigurationEndpointAddress })
        new CfnOutput(this, 'port', { value: memcachedCluster.attrConfigurationEndpointPort })
    }
}
