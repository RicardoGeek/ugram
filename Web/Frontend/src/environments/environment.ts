/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //apiUrl: 'http://seminario-load-balancer-1300044666.us-east-1.elb.amazonaws.com',
  apiUrl: 'http://ec2-54-167-156-180.compute-1.amazonaws.com',
  //apiUrl: 'http://ec2-3-88-115-247.compute-1.amazonaws.com',
  bucketUrl: 'https://bucket-imagenes-practica1.s3.amazonaws.com/'
};
